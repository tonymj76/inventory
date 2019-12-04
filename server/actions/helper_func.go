package actions

import (
	"strings"
	"unicode"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

const (
	// Pending products
	Pending = "pending"

	// Paid product for cart
	Paid = "paid"

	Processing = "processing"
	Transit    = "transit"
	Delivered  = "delivered"
	Received   = "received"
	waiting    = "waiting"
	Processed  = "processed"
)

// CurrentUser get the user who is login from middleware
func CurrentUser(c buffalo.Context) (*models.User, error) {
	cu, ok := c.Value("user").(*models.User)
	if !ok {
		return nil, errors.WithStack(errors.New("user not found"))
	}
	return cu, nil
}

// GetUserByID fetch user with id
func GetUserByID(id string, c buffalo.Context) (*models.User, error) {
	user := &models.User{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return user, errors.WithStack(errors.New("Transaction was not successful"))
	}
	if err := tx.Find(user, id); err != nil {
		return user, errors.WithStack(err)
	}
	return user, nil
}

// GetOrderByID fetch order with id
func GetOrderByID(id string, c buffalo.Context) (*models.Order, error) {
	order := &models.Order{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return order, errors.WithStack(errors.New("Transaction was not successful"))
	}
	if err := tx.Find(order, id); err != nil {
		return order, errors.WithStack(err)
	}
	return order, nil
}

// GetProductByID fetch Product with id
func GetProductByID(id string, c buffalo.Context) (*models.Product, error) {
	product := &models.Product{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return product, errors.WithStack(errors.New("Transaction was not successful"))
	}
	if err := tx.Find(product, id); err != nil {
		return product, errors.WithStack(err)
	}
	return product, nil
}

// GetCourierByID fetch a courier by id
func GetCourierByID(id string, c buffalo.Context) (*models.Courier, error) {
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return nil, errors.WithStack(errors.New("transaction not found"))
	}
	courier := &models.Courier{}
	if err := tx.Eager().Find(courier, id); err != nil {
		return nil, errors.WithStack(err)
	}
	return courier, nil
}

// GetMerchantByID fetch a Merchant by id
func GetMerchantByID(id string, c buffalo.Context) (*models.Merchant, error) {
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return nil, errors.WithStack(errors.New("transaction not found"))
	}
	m := &models.Merchant{}
	if err := tx.Eager().Find(m, id); err != nil {
		return nil, errors.WithStack(err)
	}
	return m, nil
}

// GetMerchantByUserID fetch a Merchant by user id
func GetMerchantByUserID(id string, c buffalo.Context) (*models.Merchant, error) {
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return nil, errors.WithStack(errors.New("transaction not found"))
	}
	m := &models.Merchant{}
	if err := tx.Eager().Where("user_id =? ", id).First(m); err != nil {
		return nil, errors.WithStack(err)
	}
	return m, nil
}

// GetCourierByUserID fetch a Merchant by user id
func GetCourierByUserID(id string, c buffalo.Context) (*models.Courier, error) {
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return nil, errors.WithStack(errors.New("transaction not found"))
	}
	m := &models.Courier{}
	if err := tx.Eager().Where("user_id =? ", id).First(m); err != nil {
		return nil, errors.WithStack(err)
	}
	return m, nil
}

// GetUserAddressByID fetch a Address by id
func GetUserAddressByID(id string, c buffalo.Context) (*models.Address, error) {
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return nil, errors.WithStack(errors.New("transaction not found"))
	}
	a := &models.Address{}
	if err := tx.Find(a, id); err != nil {
		return nil, errors.WithStack(err)
	}
	return a, nil
}

// TrimString helps to remove white space and other character
// that is not number and string
func TrimString(str string) string {
	return strings.TrimFunc(str, func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsNumber(r)
	})
}

// GetOrderItemsFromOrderID fetches the orderitems in order db
func GetOrderItemsFromOrderID(id string, c buffalo.Context) (*models.OrderItems, error) {
	orderItems := &models.OrderItems{}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return nil, errors.WithStack(errors.New("Transaction not found"))
	}
	if err := tx.Eager("Product").Where("order_id =?", id).All(orderItems); err != nil {
		return nil, errors.WithStack(err)
	}
	return orderItems, nil
}

// GetUserAddressByShippingAddrID fetch address from shipping address of a particular user
func GetUserAddressByShippingAddrID(id string, c buffalo.Context) (*models.Address, error){
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return nil, errors.WithStack(errors.New("Transaction not found"))
	}
	shippingAddr := &models.ShippingAddress{}
	if err := tx.Find(shippingAddr, id); err != nil {
		return nil, errors.WithStack(err)
	}
	address, err:= GetUserAddressByID(shippingAddr.AddressID.String(), c)

	return address, err
}