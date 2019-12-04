package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// CategoriesCreate adds category to the db if you are an admin
func CategoriesCreate(c buffalo.Context) error {
	category := &models.Category{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}

	if err := c.Bind(category); err != nil {
		return errors.WithStack(err)
	}

	verrs, err := tx.ValidateAndCreate(category)
	if err != nil {
		return errors.WithStack(err)
	}
	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}

	return c.Render(201, r.JSON(category))
}

// CategoriesUpdate edit of category
func CategoriesUpdate(c buffalo.Context) error {
	category := &models.Category{}

	tx, ok := c.Value("tx").(*pop.Connection)

	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	if err := tx.Find(category, c.Param("category_id")); err != nil {
		return errors.WithStack(err)
	}

	if err := c.Bind(category); err != nil {
		return errors.WithStack(err)
	}
	verrs, err := tx.ValidateAndUpdate(category)
	if err != nil {
		return errors.WithStack(err)
	}
	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}
	return c.Render(200, r.JSON(category))
}

// CategoriesDestroy edit of category
func CategoriesDestroy(c buffalo.Context) error {
	category := &models.Category{}

	tx, ok := c.Value("tx").(*pop.Connection)

	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	if err := tx.Find(category, c.Param("category_id")); err != nil {
		return errors.WithStack(err)
	}

	err := tx.Destroy(category)
	if err != nil {
		return errors.WithStack(err)
	}
	return c.Render(200, r.JSON(category))
}

// CategoriesShow edit of category
func CategoriesShow(c buffalo.Context) error {
	category := &models.Category{}

	tx, ok := c.Value("tx").(*pop.Connection)

	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	if err := tx.Find(category, c.Param("category_id")); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(200, r.JSON(category))
}

// CategoriesList edit of category
func CategoriesList(c buffalo.Context) error {
	categories := &models.Categories{}

	tx, ok := c.Value("tx").(*pop.Connection)

	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	if err := tx.All(categories); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(200, r.JSON(categories))
}

// CategoriesListWithProducts edit of category
func CategoriesListWithProducts(c buffalo.Context) error {
	categories := &models.Categories{}

	tx, ok := c.Value("tx").(*pop.Connection)

	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}
	if err := tx.Eager().All(categories); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(200, r.JSON(categories))
}
