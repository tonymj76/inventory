package actions

import (
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// CreateProductImage to add product images
func CreateProductImage(c buffalo.Context) error {
	images := &models.Images{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.New("Transaction not found")
	}
	if err := c.Bind(images); err != nil {
		return errors.WithStack(err)
	}

	if err := tx.Create(images); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(201, r.JSON(images))
}

// GetProductImage to get product images
func GetProductImage(c buffalo.Context) error {
	images := &models.Images{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.New("Transaction not found")
	}

	if err := tx.All(images); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(http.StatusOK, r.JSON(images))
}
