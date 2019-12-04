package actions

import (
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// CartsResource is the resource for the Cart model
type CartsResource struct {
	buffalo.Resource
}

// List gets all Carts. This function is mapped to the path
// GET /carts
func (v CartsResource) List(c buffalo.Context) error {
	// Get the DB connection from the context
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.New("no transaction found")
	}
	user, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.New("no user found")
	}

	carts := &models.Carts{}

	// Paginate results. Params "page" and "per_page" control pagination.
	// Default values are "page=1" and "per_page=20".
	q := tx.PaginateFromParams(c.Params())

	// Retrieve all Carts from the DB
	if err := q.Eager().Where("user_id = ?", user.ID).All(carts); err != nil {
		return errors.WithStack(err)
	}

	// Add the paginator to the context so it can be used in the template.
	c.Response().Header().Set("X-Pagination", q.Paginator.String())

	return c.Render(http.StatusOK, r.JSON(carts))
}

// Show gets the data for one Cart. This function is mapped to
// the path GET /carts/{cart_id}
func (v CartsResource) Show(c buffalo.Context) error {
	// Get the DB connection from the context
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.New("no transaction found")
	}
	user, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.New("no user found")
	}

	// Allocate an empty Cart
	cart := &models.Cart{}

	// To find the Cart the parameter cart_id is used.
	if err := tx.Eager().Where("user_id = ? ", user.ID).Find(cart, c.Param("cart_id")); err != nil {
		return c.Error(404, err)
	}

	return c.Render(http.StatusOK, r.JSON(cart))
}

// Create adds a Cart to the DB. This function is mapped to the
// path POST /carts
func (v CartsResource) Create(c buffalo.Context) error {
	// Allocate an empty Cart
	cart := &models.Cart{}

	// Bind cart to the html form elements
	if err := c.Bind(cart); err != nil {
		return errors.WithStack(err)
	}

	// Get the DB connection from the context
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.New("no transaction found")
	}
	user, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.New("no user found")
	}
	previousCart := &models.Cart{}
	if err := tx.Where("user_id = ? AND product_id = ? AND status = ?", user.ID, cart.ProductID, Pending).First(previousCart); err == nil {
		return errors.New("product already added")
	}
	if cart.Status != Pending {
		cart.Status = Pending
	}
	// Validate the data from the html form
	verrs, err := tx.Eager().ValidateAndCreate(cart)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrs.HasAny() {
		return c.Render(422, r.JSON(verrs))
	}

	return c.Render(http.StatusCreated, r.JSON(map[string]interface{}{
		"message": "successful",
		"cart":    cart}))
}

// Update changes a Cart in the DB. This function is mapped to
// the path PUT /carts/{cart_id}
func (v CartsResource) Update(c buffalo.Context) error {
	// Get the DB connection from the context
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.New("no transaction found")
	}
	user, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.New("no user found")
	}

	// Allocate an empty Cart
	cart := &models.Cart{}

	if err := tx.Where("user_id = ?", user.ID).Find(cart, c.Param("cart_id")); err != nil {
		return c.Error(404, err)
	}

	// Bind Cart to the html form elements
	if err := c.Bind(cart); err != nil {
		return errors.WithStack(err)
	}
	// if cart.Status != Paid {
	// 	return errors.New("the cart status should be paid to update")
	// }

	verrs, err := tx.ValidateAndUpdate(cart)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrs.HasAny() {
		return c.Render(422, r.JSON(verrs))
	}

	// and redirect to the carts index page
	return c.Render(200, r.JSON(map[string]interface{}{
		"message": "successful",
		"cart":    cart,
	}))
}

// Destroy deletes a Cart from the DB. This function is mapped
// to the path DELETE /carts/{cart_id}
func (v CartsResource) Destroy(c buffalo.Context) error {
	// Get the DB connection from the context
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.New("no transaction found")
	}
	user, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.New("no user found")
	}

	// Allocate an empty Cart
	cart := &models.Cart{}

	// To find the Cart the parameter cart_id is used.
	if err := tx.Where("user_id =? ", user.ID).Find(cart, c.Param("cart_id")); err != nil {
		return c.Error(404, err)
	}

	if err := tx.Destroy(cart); err != nil {
		return errors.WithStack(err)
	}

	// Redirect to the carts index page
	return c.Render(200, r.JSON(map[string]interface{}{
		"message": "successfully deleted",
		"cart":    cart,
	}))
}
