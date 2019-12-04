package actions

import (
	"net/http"
	"strings"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// ListMerchantsAndProductsBaseOnLocation display products base on the
//city, state, street entered by the user
func ListMerchantsAndProductsBaseOnLocation(c buffalo.Context) error {
	merchants := &models.Merchants{}

	tx, ok := c.Value("tx").(*pop.Connection)

	if !ok {
		return errors.WithStack(errors.New("transaction not found"))
	}

	state := TrimString(c.Request().URL.Query().Get("state"))
	city := TrimString(c.Request().URL.Query().Get("city"))
	street := TrimString(c.Request().URL.Query().Get("street"))

	if len(state) > 1 || len(city) > 1 || len(street) > 1 {
		q := tx.Eager().Where("state =? OR city =? OR street=?", state, city, street).PaginateFromParams(c.Params()).Order("created_at desc")

		if err := q.All(merchants); err != nil {
			return errors.WithStack(err)
		}
		c.Response().Header().Set("X-Pagination", q.Paginator.String())
		return c.Render(http.StatusOK, r.JSON(merchants))
	}

	q := tx.Eager().PaginateFromParams(c.Params()).Order("created_at desc")
	if err := q.All(merchants); err != nil {
		return errors.WithStack(err)
	}
	c.Response().Header().Set("X-Pagination", q.Paginator.String())
	return c.Render(http.StatusOK, r.JSON(merchants))
}

// Search look for product my name or state or but
func Search(c buffalo.Context) error {
	merchants := &models.Merchants{}
	products := &models.Products{}

	q := TrimString(c.Request().URL.Query().Get("q"))
	category := TrimString(c.Request().URL.Query().Get("category_id"))
	state := TrimString(c.Request().URL.Query().Get("state"))
	tx, ok := c.Value("tx").(*pop.Connection)

	if !ok {
		return errors.WithStack(errors.New("transaction not found"))
	}

	if state != "" {
		if err := tx.Eager().RawQuery(`SELECT m.* FROM merchants m 
		INNER JOIN merchantproducts mp ON m.id = mp.merchant_id 
		INNER JOIN products p ON mp.product_id = p.id
		WHERE p.name LIKE ? AND m.state =?`, q, state).Order("created_at desc").All(merchants); err != nil {
			return errors.WithStack(err)
		}
		return c.Render(http.StatusOK, r.JSON(merchants))
	}

	// if category != "" {
	// 	if err := tx.Eager().RawQuery(`SELECT m.* FROM merchants m
	// 	INNER JOIN merchantproducts mp ON m.id = mp.merchant_id
	// 	INNER JOIN products p ON mp.product_id = p.id
	// 	WHERE p.name LIKE ? AND p.category_id =?`, q, category).Order("created_at desc").All(merchants); err != nil {
	// 		return errors.WithStack(err)
	// 	}
	// 	return c.Render(http.StatusOK, r.JSON(merchants))
	// }

	// db := tx.BelongsToThrough(&models.Merchant{}, &models.Merchantproduct{})
	// if err := tx.Eager().RawQuery(`SELECT m.* FROM merchants m
	// INNER JOIN merchantproducts mp ON m.id = mp.merchant_id
	// INNER JOIN products p ON mp.product_id = p.id
	// WHERE p.name LIKE ?`, q).Order("created_at desc").All(merchants); err != nil {
	// 	return errors.WithStack(err)
	// }
	// return c.Render(http.StatusOK, r.JSON(merchants))
	if category != "" {
		if err := tx.Eager().RawQuery(`SELECT * FROM products
		WHERE name LIKE ? AND category_id = ?`, q+"%", category).Order("created_at desc").All(products); err != nil {
			return errors.WithStack(err)
		}
		return c.Render(http.StatusOK, r.JSON(products))
	}

	if err := tx.Eager().RawQuery(`SELECT * FROM products p
	WHERE p.name LIKE ?`, q+"%").Order("created_at desc").All(products); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(http.StatusOK, r.JSON(products))
}

// FilterProductsByPriceRange return products within that price range
func FilterProductsByPriceRange(c buffalo.Context) error {
	products := &models.Products{}
	priceRange := strings.SplitN(TrimString(c.Request().URL.Query().Get("price_range")), "-", 2)
	if len(priceRange) < 1 {
		return errors.WithStack(errors.New("There is no price range"))
	}
	min, max := priceRange[0], priceRange[1]
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transaction not found"))
	}
	q := tx.Eager().Where("price >= ? AND price <= ?", min, max).PaginateFromParams(c.Params()).Order("updated_at desc")

	if err := q.All(products); err != nil {
		return c.Error(http.StatusInternalServerError, err)
	}
	c.Response().Header().Set("X-Pagination", q.Paginator.String())
	return c.Render(http.StatusOK, r.JSON(products))
}
