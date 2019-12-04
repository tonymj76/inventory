package actions

import (
	"fmt"
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// MerchantsResource is the merchant CRUD interface
type MerchantsResource struct {
	buffalo.Resource
}

// very important for current user
func (v MerchantsResource) scope(c buffalo.Context) (*pop.Query, error) {
	tx := c.Value("tx").(*pop.Connection)
	cu, ok := c.Value("user").(*models.User)

	if !ok {
		return tx.Q(), errors.WithStack(errors.New("could not find a current user"))
	}
	return tx.BelongsTo(cu), nil
}

// List lists all the merchant but the current user have to be admin
func (v MerchantsResource) List(c buffalo.Context) error {
	merchants := &models.Merchants{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction"))
	}
	if err := tx.Eager().All(merchants); err != nil {
		return errors.WithStack(err)
	}

	// Add the paginator to the header so clients know how to paginate.
	c.Response().Header().Set("X-Pagination", tx.PaginateFromParams(c.Params()).Order("created_at desc").Paginator.String())
	return c.Render(http.StatusOK, r.JSON(merchants))
}

// Create make a user merchant
func (v MerchantsResource) Create(c buffalo.Context) error {
	merchant := &models.Merchant{}

	cu, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.WithStack(errors.New("could not find a current user"))
	}

	if err := c.Bind(merchant); err != nil {
		return errors.WithStack(err)
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("No transaction found"))
	}

	merchant.UserID = cu.ID
	cu.IsMerchant = true

	updateUser := &models.User{
		ID:         cu.ID,
		FirstName:  cu.FirstName,
		LastName:   cu.LastName,
		UserName:   cu.UserName,
		Email:      cu.Email,
		IsMerchant: true,
	}

	verrs, err := tx.ValidateAndUpdate(updateUser, "password_hash", "is_admin", "is_couries")
	if err != nil {
		return errors.WithStack(err)
	}

	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}
	// add merchant details to db
	verrss, errs := tx.ValidateAndCreate(merchant)

	if errs != nil {
		return errors.WithStack(errs)
	}

	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrss))
	}

	return c.Render(201, r.JSON(merchant))
}

// Update merchant info
func (v MerchantsResource) Update(c buffalo.Context) error {
	merchant := &models.Merchant{}

	q, err := v.scope(c)
	if err != nil {
		return errors.WithStack(err)
	}
	if err := q.Find(merchant, c.Param("merchant_id")); err != nil {
		return c.Error(404, err)
	}

	if err := c.Bind(merchant); err != nil {
		return errors.WithStack(err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}

	verrs, err := tx.ValidateAndUpdate(merchant, "password_hash", "is_admin", "is_couries", "is_merchant")
	if err != nil {
		return errors.WithStack(err)
	}
	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}
	return c.Render(200, r.JSON(merchant))
}

// Destroy allow a user-merchant  to delete merchant account
func (v MerchantsResource) Destroy(c buffalo.Context) error {
	merchant := &models.Merchant{}
	q, err := v.scope(c)
	if err != nil {
		return errors.WithStack(err)
	}
	if err := q.Find(merchant, c.Param("merchant_id")); err != nil {
		return c.Error(404, err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	if err := tx.Destroy(merchant); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(200, r.JSON(merchant))
}

// Show default implementation. Returns a 404
func (v MerchantsResource) Show(c buffalo.Context) error {
	merchant := &models.Merchant{}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transaction not found"))
	}

	if err := tx.Eager().Where("user_id = ?", c.Param("merchant_id")).First(merchant); err != nil {
		return c.Error(404, err)
	}
	return c.Render(http.StatusOK, r.JSON(merchant))
}

// CreateForm is a link use to create both user and merchant at the same time
func CreateForm(c buffalo.Context) error {
	merchant := &models.Merchant{}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transaction not found"))
	}
	if err := c.Bind(merchant); err != nil {
		return errors.WithStack(err)
	}

	user, err := GetUserByID(merchant.UserID.String(), c)
	if err != nil {
		return errors.WithStack(err)
	}
	user.IsMerchant = true
	user.MerchantID = merchant.ID
	if err := tx.Update(user); err != nil {
		return errors.WithStack(err)
	}
	// add merchant details to db
	verrs, errs := tx.ValidateAndCreate(merchant)

	if errs != nil {
		return errors.WithStack(errs)
	}
	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}

	return c.Render(201, r.JSON(merchant))
}

// GetMerchantsByLocation fetches merchants based on their location
func GetMerchantsByLocation(c buffalo.Context) error {
	state := TrimString(c.Request().URL.Query().Get("state"))
	city := TrimString(c.Request().URL.Query().Get("city"))
	merchants := &models.Merchant{}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transaction not found"))
	}
	if err := c.Bind(merchants); err != nil {
		return errors.WithStack(err)
	}

	if len(state) > 1 || len(city) > 1 {
		q := tx.Eager().RawQuery("SELECT * FROM merchants WHERE state LIKE %?% OR city LIKE %?%", state, city).Order("created_at desc")

		if err := q.All(merchants); err != nil {
			return errors.WithStack(err)
		}
		return c.Render(http.StatusOK, r.JSON(merchants))
	}
	return errors.WithStack(errors.New("State and city are required"))
}

// ViewOrderDetails display product and user info about a purchase item
func ViewOrderDetails(c buffalo.Context) error {

	userID := TrimString(c.Request().URL.Query().Get("user_id"))
	orderID := TrimString(c.Request().URL.Query().Get("order_id"))
	productID := TrimString(c.Request().URL.Query().Get("product_id"))

	user, err := GetUserByID(userID, c)
	if err != nil {
		return errors.Wrap(err, "user not found in view order detail fn")
	}

	order, err := GetOrderByID(orderID, c)
	if err != nil {
		return errors.Wrap(err, "order not found in view order detail fn")
	}

	product, err := GetProductByID(productID, c)
	if err != nil {
		return errors.Wrap(err, "product not found in view order detail fn")
	}

	courier, err := GetCourierByID(order.CourierID.String(), c)
	if err != nil {
		return errors.Wrap(err, "courier not foound in view order detail fn")
	}

	View := struct {
		ProductImage       models.Images `json:"images"`
		BuyerFullName      string `json:"buyer_full_name"`
		BuyerEmail         string `json:"buyer_email"`
		ProductName        string `json:"product_name"`
		CourierCompanyName string `json:"courier_company_name"`
		CourierNumber      string `json:"courier_number"`
		CourierEmail       string `json:"courier_email"`
	}{
		BuyerFullName:      fmt.Sprintf("%s  %s", user.FirstName, user.LastName),
		BuyerEmail:         user.Email,
		ProductName:        product.Name,
		ProductImage: 			product.Images,
		CourierCompanyName: courier.CompanyName,
		CourierNumber: 			courier.PhoneNumber,
		CourierEmail: 			courier.BusinessEmail,
	}

	return c.Render(http.StatusOK, r.JSON(View))
}

// UpdateOrderItemToProcessed merchant can update status to processed
func UpdateOrderItemToProcessed (c buffalo.Context) error {
	orderItem := &models.OrderItem{}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transaction not found"))
	}
	if err := tx.Find(orderItem, c.Param("order_item_id")); err != nil {
		return errors.Wrap(err, "order item not found")
	}
	if err := c.Bind(orderItem); err != nil {
		return errors.Wrap(err, "error binding orderitem")
	}

	verrs, err := tx.ValidateAndUpdate(orderItem)
	if err != nil {
		return errors.WithStack(err)
	}
	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}
	return c.Render(http.StatusOK, r.JSON(orderItem))
}