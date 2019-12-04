package middlewares

// import (
// 	"net/http"

// 	"github.com/gobuffalo/buffalo"
// 	"github.com/gobuffalo/buffalo/render"
// 	"github.com/tonymj76/inventory/server/models"
// )

// func VerifyUserEmail(next buffalo.Handler) *buffalo.Handler {
// 	return func(c buffalo.Context) error {
// 		cu := c.Value("user").(*models.User)
// 		if cu.VerifyEmail {
// 			return next(c)
// 		}
// 		c.Render(http.StatusOK, render.JSON("email not varified"))
// 		return next(c)
// 	}
// }
