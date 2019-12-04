package actions

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"

	// "github.com/gofrs/uuid"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/actions/services/paystack"
	"github.com/tonymj76/inventory/server/models"
)

// OrderVerifyPaymentAndUpdate verifies that an order has been paid for and updates that order
func OrderVerifyPaymentAndUpdate(c buffalo.Context) error {
	orderVerificationRequest := models.OrderVerificationRequest{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("transaction not found"))
	}

	if err := c.Bind(&orderVerificationRequest); err != nil {
		return c.Error(http.StatusBadRequest, err)
	}

	_, err := paystack.VerifyPayment(orderVerificationRequest.Reference)
	if err != nil {
		return c.Error(http.StatusBadRequest, err)
	}
	// mdata := data["data"].(map[string]interface{})["metadata"].(map[string]interface{})
	// customFields := mdata["custom_fields"].([]interface{})
	// orderID := customFields[0].(map[string]interface{})["order_id"]
	// orderIDString := customFields[0].(map[string]interface{})["order_id"].(string)

	// orderID, err := uuid.FromString(orderIDString)
	// if err != nil {
	// 	log.Printf("failed to parse UUID %q: %v", orderIDString, err)
	// }
	orderID := orderVerificationRequest.Order.ID
	order := models.Order{}
	if err := tx.Find(&order, orderID); err != nil {
		return c.Error(http.StatusInternalServerError, errors.Errorf("order not found!"))
	}
	order.PaymentRef = orderVerificationRequest.Reference
	order.Status = Paid

	if err := tx.Save(&order); err != nil {
		log.Println(err)
		return c.Error(http.StatusInternalServerError, err)
	}

	orderItems := models.OrderItems{}
	if err := tx.Where("order_id = ? AND status = ?", orderID, Pending).All(&orderItems); err != nil {
		return c.Error(http.StatusInternalServerError, errors.Errorf("order items not found!"))
	}

	// update cart DB
	cart := models.Cart{}

	for _, orderItem := range orderItems {
		orderItem.DeliveryState = Processing
		orderItem.Status = Paid

		if err = tx.Save(&orderItem); err != nil {
			log.Println(err)
			return c.Error(http.StatusInternalServerError, errors.Errorf("an error occured while saving the order item: %v", err))
		}

		if err := tx.Where("user_id = ? AND product_id = ? AND status = ?", orderItem.UserID,
			orderItem.ProductID, Pending).First(&cart); err != nil {

			if errors.Cause(err) == sql.ErrNoRows {
				log.Println("product is not in cart")
			} else {
				return errors.WithStack(err)
			}
		} else {
			cart.Status = Paid
			if err := tx.Update(&cart, "user_id", "product_id", "cart_id"); err != nil {
				log.Println(err)
				return errors.Errorf("Error: failed to update cart: %v", err)
			}
		}
	}

	return c.Render(200, r.JSON(map[string]interface{}{
		"message": "order verified successfully",
	}))
}

// OrderCreate default implementation.
func OrderCreate(c buffalo.Context) error {
	user, err := CurrentUser(c)
	if err != nil {
		return errors.WithStack(err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("transaction not found"))
	}

	orderRequest := &models.OrderRequest{}
	if err := c.Bind(orderRequest); err != nil {
		return c.Error(http.StatusBadRequest, err)
	}

	order := &models.Order{}
	shippingAddress := models.ShippingAddress{}
	if err := tx.Eager().Where("user_id = ? AND address_id = ?", orderRequest.UserID,
		orderRequest.AddressID).First(&shippingAddress); err != nil {
		return c.Error(http.StatusNotFound, errors.Errorf("could not find shipping address: %v", err))
	}
	order.ShippingAddressID = shippingAddress.ID
	order.ShippingAddress = shippingAddress
	order.Status = Pending
	order.UserID = orderRequest.UserID
	order.CourierID = orderRequest.CourierID

	if verrs, err := tx.ValidateAndCreate(order); err != nil || verrs != nil {
		c.Error(http.StatusBadRequest, errors.Errorf("err during saving order or verrs: %v  %v", err, verrs))
	}

	if user.ID != order.UserID {
		return c.Error(http.StatusUnauthorized, err)
	}
	// if order.Status != Paid {
	// 	return c.Error(http.StatusNotAcceptable, errors.New("order status should be paid"))
	// }

	var totalAmount float64
	var totalQuantity int
	orderItems := models.OrderItems{}
	for _, item := range orderRequest.OrderItems {
		orderItem := models.OrderItem{
			DeliveryState: Pending,
			Status:        Pending,
			OrderID:       order.ID,
			UserID:        item.UserID,
			MerchantID:    item.MerchantID,
			ProductID:     item.ProductID,
			Quantity:      item.Quantity,
			TotalPrice:    item.TotalPrice,
		}
		orderItems = append(orderItems, orderItem)
		totalAmount += item.TotalPrice
		totalQuantity += item.Quantity
	}
	verrs, err := tx.ValidateAndCreate(orderItems)
	if err != nil {
		c.Error(http.StatusInternalServerError, errors.Errorf("an error occured while creating order items: %v", err))
	}
	if verrs != nil {
		c.Error(http.StatusBadRequest, errors.Errorf("verrs: %v", verrs))
	}

	order.OrderItems = orderItems
	courier := &models.Courier{}
	if err := tx.Eager("DeliveryPrice").Find(courier, orderRequest.CourierID); err != nil {
		c.Error(http.StatusInternalServerError, errors.Errorf("courier not found!"))
	}
	log.Println(totalAmount)
	order.Quantity = totalQuantity
	order.TotalPrice = totalAmount + courier.DeliveryPrice.DefaultPrice

	verrs, err = tx.Eager().ValidateAndSave(order)
	if err != nil {
		c.Error(http.StatusInternalServerError, errors.Errorf("an error occured while saving order: %v", err))
	}
	if verrs != nil {
		c.Error(http.StatusBadRequest, errors.Errorf("verrs: %v", verrs))
	}
	return c.Render(http.StatusCreated, r.JSON(map[string]interface{}{
		"message": "Order created successfully",
		"order":   order,
	}))
}

// GetCustomerOrders fetches all the orders made by a user
func GetCustomerOrders(c buffalo.Context) error {
	customer, err := GetUserByID(c.Param("user_id"), c)
	if err != nil {
		return errors.WithStack(errors.New("could not find user"))
	}
	tx := c.Value("tx").(*pop.Connection)
	orders := &models.Orders{}

	if err := tx.Eager().Where("user_id = ? AND status = ?", customer.ID, Paid).All(orders); err != nil {
		return c.Error(http.StatusInternalServerError, err)
	}
	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"message": "successful",
		"orders":  orders,
	}))
}

// GetMerchantOrders fetches all the paid order items of a merchant
func GetMerchantOrders(c buffalo.Context) error {
	merchant, err := GetMerchantByUserID(c.Param("user_id"), c)
	if err != nil {
		return errors.WithStack(errors.New("could not find merchant"))
	}
	tx := c.Value("tx").(*pop.Connection)
	orderItems := &models.OrderItems{}

	if err := tx.Eager().Where("merchant_id = ?", merchant.ID).All(orderItems); err != nil {
		return c.Error(http.StatusInternalServerError, err)
	}
	return c.Render(http.StatusOK, r.JSON(orderItems))
}

// GetCourierOrders fetches all the paid order items of a merchant
func GetCourierOrders(c buffalo.Context) error {
	courier, err := GetCourierByUserID(c.Param("user_id"), c)
	if err != nil {
		return errors.WithStack(errors.New("could not find courier"))
	}
	tx := c.Value("tx").(*pop.Connection)
	orders := &models.Orders{}

	if err := tx.Eager().Where("courier_id = ?", courier.ID).All(orders); err != nil {
		return c.Error(http.StatusInternalServerError, err)
	}
	return c.Render(http.StatusOK, r.JSON(orders))
}

// OrderList fetches all the paid orders
func OrderList(c buffalo.Context) error {
	_, err := CurrentUser(c)
	if err != nil {
		return errors.WithStack(err)
	}
	tx := c.Value("tx").(*pop.Connection)
	orders := models.Orders{}

	if err := tx.Eager().Where("status = ?", Paid).All(&orders); err != nil {
		return c.Error(http.StatusInternalServerError, err)
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"message": "successful",
		"orders":  orders,
	}))
}

// OrderDestroy removes an order
func OrderDestroy(c buffalo.Context) error {
	cu, err := CurrentUser(c)
	if err != nil {
		return errors.WithStack(err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	order := &models.Order{}

	if err := tx.Where("user_id = ? AND id = ?", cu.ID, c.Param("order_id")).First(order); err != nil {
		return c.Error(404, err)
	}

	if err := tx.Destroy(order); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(200, r.JSON(map[string]interface{}{
		"message": "order deleted successfully",
	}))
}
