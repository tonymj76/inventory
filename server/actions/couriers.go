package actions

import (
	"fmt"
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// CouriersResource is the merchant CRUD interface
type CouriersResource struct {
	buffalo.Resource
}

// very important for current user
func (v CouriersResource) scope(c buffalo.Context) (*pop.Query, error) {
	tx := c.Value("tx").(*pop.Connection)
	cu, ok := c.Value("user").(*models.User)
	if !ok {
		return tx.Q(), errors.WithStack(errors.New("could not find a current user"))
	}
	return tx.BelongsTo(cu), nil
}

// List lists all the merchant but the current user have to be admin
func (v CouriersResource) List(c buffalo.Context) error {
	couriers := &models.Couriers{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transaction not found"))
	}

	query := tx.PaginateFromParams(c.Params()).Order("created_at desc")

	if err := query.Eager().All(couriers); err != nil {
		return errors.WithStack(err)
	}

	// Add the paginator to the header so clients know how to paginate.
	c.Response().Header().Set("X-Pagination", query.Paginator.String())
	return c.Render(200, r.JSON(couriers))
}

// Create make a user merchant
func (v CouriersResource) Create(c buffalo.Context) error {
	courier := &models.Courier{}

	cu, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.WithStack(errors.New("could not find a current user"))
	}

	if err := c.Bind(courier); err != nil {
		return errors.WithStack(err)
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("No transaction found"))
	}

	courier.UserID = cu.ID
	cu.IsCourier = true

	updateUserToCourier := &models.User{
		ID:        cu.ID,
		FirstName: cu.FirstName,
		LastName:  cu.LastName,
		UserName:  cu.UserName,
		Email:     cu.Email,
		IsCourier: true,
	}

	verrs, err := tx.ValidateAndUpdate(updateUserToCourier,
		"password_hash",
		"is_admin",
		"is_merchant",
	)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrs.HasAny() {
		return c.Render(http.StatusBadRequest, r.JSON(verrs))
	}
	// add courier details to db
	verrss, errs := tx.ValidateAndCreate(courier)

	if errs != nil {
		return errors.WithStack(errs)
	}

	if verrs.HasAny() {
		return c.Render(http.StatusBadRequest, r.JSON(verrss))
	}

	return c.Render(http.StatusCreated, r.JSON(courier))
}

// Update courier info
func (v CouriersResource) Update(c buffalo.Context) error {
	courier := &models.Courier{}
	query, err := v.scope(c)
	if err != nil {
		return c.Error(http.StatusUnauthorized, err)
	}

	if err := query.Find(courier, c.Param("courier_id")); err != nil {
		return c.Error(http.StatusNotFound, err)
	}

	if err := c.Bind(courier); err != nil {
		return errors.WithStack(err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}

	verrs, err := tx.ValidateAndUpdate(courier, "password_hash", "is_admin", "is_couries", "is_merchant")
	if err != nil {
		return errors.WithStack(err)
	}
	if verrs.HasAny() {
		return c.Render(http.StatusBadRequest, r.JSON(verrs))
	}
	return c.Render(http.StatusOK, r.JSON(courier))
}

// Destroy allow a user-courier  to delete courier account
// next step update the user is courier field to false when you delete it like update
func (v CouriersResource) Destroy(c buffalo.Context) error {
	courier := &models.Courier{}

	query, err := v.scope(c)
	if err != nil {
		return c.Error(http.StatusUnauthorized, err)
	}
	if err := query.Find(courier, c.Param("courier_id")); err != nil {
		return c.Error(404, err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	if err := tx.Destroy(courier); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(http.StatusOK, r.JSON(courier))
}

func (v CouriersResource) Show(c buffalo.Context) error {
	return c.Error(http.StatusNotFound, errors.New("not available"))
}

// CreateCourierForm is a link use to create both user and courier at the same time
func CreateCourierForm(c buffalo.Context) error {
	courier := &models.Courier{}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transaction not found"))
	}
	if err := c.Bind(courier); err != nil {
		return errors.WithStack(err)
	}

	user, err := GetUserByID(courier.UserID.String(), c)
	if err != nil {
		return errors.WithStack(err)
	}
	user.IsCourier = true
	if err := tx.Update(user); err != nil {
		return errors.WithStack(err)
	}
	// add courier details to db
	verrs, errs := tx.ValidateAndCreate(courier)

	if errs != nil {
		return errors.WithStack(errs)
	}
	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}

	return c.Render(201, r.JSON(courier))
}

// ViewOrderDetailsCourier show info about the product
func ViewOrderDetailsCourier(c buffalo.Context) error {
	userID := TrimString(c.Request().URL.Query().Get("user_id"))
	orderID := TrimString(c.Request().URL.Query().Get("order_id"))
	shippingDetailID := TrimString(c.Request().URL.Query().Get("shipping_detail_id"))
	productID := TrimString(c.Request().URL.Query().Get("product_id"))

	user, err := GetUserByID(userID, c)
	if err != nil {
		return errors.Wrap(err, "user not found in view order detail fn")
	}

	orderItems, err := GetOrderItemsFromOrderID(orderID, c)
	if err != nil {
		return errors.Wrap(err, "orderItems not found in view order detail fn")
	}

	address, err := GetUserAddressByShippingAddrID(shippingDetailID, c)
	if err != nil {
		return errors.Wrap(err, "orderItems not found in view order detail fn")
	}

	product, err := GetProductByID(productID, c)
	if err != nil {
		return errors.Wrap(err, "orderItems not found in view order detail fn")
	}

	View := struct {
		BuyerFullName string             `json:"buyer_full_name"`
		OrderItems    *models.OrderItems `json:"order_items"`
		Address       *models.Address    `json:"address"`
		Product       *models.Product    `json:"product"`
	}{
		BuyerFullName: fmt.Sprintf("%s  %s", user.FirstName, user.LastName),
		OrderItems:    orderItems,
		Address:       address,
		Product:       product,
	}

	return c.Render(http.StatusOK, r.JSON(View))
}
