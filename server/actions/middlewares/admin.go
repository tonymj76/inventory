package middlewares

import (
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// IsAdmin default implementation.
func IsAdmin(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		user, ok := c.Value("user").(*models.User)
		if !ok {
			return c.Error(http.StatusUnauthorized, errors.New("user is not found"))
		}
		if !user.IsAdmin {
			return c.Error(http.StatusUnauthorized, errors.Errorf("%s you are not authorized", user.FirstName))
		}
		return next(c)
	}
}
