package actions

import (
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// ProductsResource is the Product CRUD interface
type ProductsResource struct {
	buffalo.Resource
}

// Note that is product routes is for mechants only
// very important for current user
func (v ProductsResource) scope(c buffalo.Context) (*pop.Query, error) {
	tx := c.Value("tx").(*pop.Connection)
	cu, ok := c.Value("user").(*models.User)

	if !ok {
		return tx.Q(), errors.New("Can't get current user")
	}
	if cu.IsCourier {
		return tx.Q(), errors.WithStack(errors.New("You Can't View this Page"))
	}
	if !cu.IsMerchant {
		return tx.Q(), errors.WithStack(errors.New("You Can't View this Page because you are not a merchant"))
	}
	m := &models.Merchant{}
	if err := tx.Eager("Products").Where("user_id = ?", cu.ID).First(m); err != nil {
		return tx.Q(), c.Error(444, err)
	}
	return tx.BelongsTo(m), nil
}

// List get all the product of a merchant
func (v ProductsResource) List(c buffalo.Context) error {
	products := &models.Products{}
	tx, err := c.Value("tx").(*pop.Connection)
	if !err {
		return errors.WithStack(errors.New("transaction not found"))
	}
	query := tx.PaginateFromParams(c.Params()).Order("created_at desc")
	if err := query.Eager().All(products); err != nil {
		return errors.WithStack(err)
	}

	c.Response().Header().Set("X-Pagination", query.Paginator.String())
	return c.Render(200, r.JSON(products))
}

// Create make a merchant Product
func (v ProductsResource) Create(c buffalo.Context) error {
	product := &models.Product{}

	if err := c.Bind(product); err != nil {
		return errors.WithStack(err)
	}

	tx := c.Value("tx").(*pop.Connection)
	cu, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.WithStack(errors.New("error while fetching current user"))
	}

	m := &models.Merchant{}
	if err := tx.Where("user_id = ?", cu.ID).First(m); err != nil {
		return c.Error(404, errors.New("couldn't get merchant from db"))
	}
	product.MerchantID = m.ID

	// add Product details to db
	verrs, err := tx.Eager().ValidateAndSave(product)

	if err != nil {
		return errors.WithStack(err)
	}

	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}

	// manytomany relationship
	if err := tx.Create(&models.Merchantproduct{
		MerchantID: m.ID,
		ProductID:  product.ID,
	}); err != nil {
		return errors.WithStack(err)
	}

	return c.Render(201, r.JSON(product))
}

// Update Product info of a merchant
func (v ProductsResource) Update(c buffalo.Context) error {
	product := &models.Product{}

	q, err := v.scope(c)
	if err != nil {
		return errors.WithStack(err)
	}

	if err := q.Find(product, c.Param("product_id")); err != nil {
		return c.Error(404, err)
	}

	if err := c.Bind(product); err != nil {
		return errors.WithStack(err)
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}

	verrs, err := tx.ValidateAndUpdate(product)
	if err != nil {
		return errors.WithStack(err)
	}
	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}
	return c.Render(200, r.JSON(product))
}

// Destroy allow a merchant-Product  to delete Product account
func (v ProductsResource) Destroy(c buffalo.Context) error {
	product := &models.Product{}

	q, err := v.scope(c)
	if err != nil {
		return errors.WithStack(err)
	}

	if err := q.Find(product, c.Param("product_id")); err != nil {
		return c.Error(404, err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	if err := tx.Destroy(product); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(200, r.JSON(product))
}

// Show default implementation. Returns a 404
func (v ProductsResource) Show(c buffalo.Context) error {
	product := &models.Product{}
	tx, err := c.Value("tx").(*pop.Connection)
	if !err {
		c.Error(http.StatusInternalServerError, errors.New("transaction not found"))
	}
	if err := tx.Eager().Find(product, c.Param("product_id")); err != nil {
		c.Error(http.StatusBadRequest, err)
	}
	return c.Render(http.StatusOK, r.JSON(product))
}
