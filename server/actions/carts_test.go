//Note this product will fail
// because there is no way to add product id
package actions

import (
	"fmt"
	"testing"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/suite"
	"github.com/tonymj76/inventory/server/models"
)

var cartAPI = "/api/v1/carts/"

type CartSuite struct {
	*suite.Action
	User        *models.User
	tokenString string
}

func (is *CartSuite) SetupTest() {
	is.Action.SetupTest()
	u := &models.User{
		FirstName:            "Aurther",
		LastName:             "Castiel",
		UserName:             "warluck",
		Email:                "aurther@gmail.com",
		Password:             "password",
		PasswordConfirmation: "password",
	}

	err := is.DB.Create(u)
	is.NoError(err)
	is.NoError(is.DB.Reload(u))
	claims := struct {
		FirstName string `json:"first_name"`
		jwt.StandardClaims
	}{
		FirstName: u.FirstName,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 5).Unix(),
			Issuer:    fmt.Sprintf("%s.api.ocm-key.it", envy.Get("GO_ENV", "development")),
			Id:        u.ID.String(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signingKey := []byte(envy.Get("JWT_SECRET", "secret"))
	tokenString, err := token.SignedString(signingKey)
	is.NoError(err)
	is.tokenString = tokenString
	is.User = u
}

func (is *CartSuite) tableCount(table string, count int, fn func()) {
	fn()

	finalCount, err := is.DB.Count(table)
	is.NoError(err)
	is.Equal(count, finalCount)
}

func (is *CartSuite) createCart() *models.Cart {
	cart := &models.Cart{
		UserID: is.User.ID,
		Status: Pending,
		Product: models.Product{
			Name:        "Eba",
			Description: "Eba and soup with 5 meat",
			Quantity:    44,
			Price:       5000.3,
			Active:      true,
		},
	}
	is.NoError(is.DB.Eager().Create(cart))
	return cart
}

func (is *CartSuite) Test_CartsResource_List() {
	is.createCart()
	is.createCart()
	is.tableCount("carts", 2, func() {
		req := is.JSON(cartAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Get()
		is.Equal(200, res.Code)
	})
}

func (is *CartSuite) Test_CartsResource_Show() {
	cart := is.createCart()
	is.tableCount("carts", 1, func() {
		req := is.JSON(cartAPI+"%s", cart.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Get()
		is.Equal(200, res.Code)
	})
}

func (is *CartSuite) Test_CartsResource_Create() {
	is.tableCount("carts", 1, func() {
		req := is.JSON(cartAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Post(&models.Cart{
			UserID: is.User.ID,
			Status: Pending,
			Product: models.Product{
				Name:        "Eba",
				Description: "Eba and soup with 5 meat",
				Quantity:    44,
				Price:       5000.3,
				Active:      true,
			},
		})
		is.Equal(201, res.Code)
		is.Contains(res.Body.String(), "successful")
	})
}

func (is *CartSuite) Test_CartsResource_Update() {
	cart := is.createCart()
	is.tableCount("carts", 1, func() {
		req := is.JSON(cartAPI+"%s", cart.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Put(&models.Cart{
			ID:     cart.ID,
			Status: Paid,
		})

		is.Equal(200, res.Code)
		is.NoError(is.DB.Reload(cart))
		is.Equal(Paid, cart.Status)
		is.Contains(res.Body.String(), Paid)
	})
}

func (is *CartSuite) Test_CartsResource_Destroy() {
	cart := is.createCart()
	is.tableCount("carts", 0, func() {
		req := is.JSON(cartAPI+"%s", cart.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Delete()
		is.Equal(200, res.Code)
		is.Contains(res.Body.String(), "successfully deleted")
	})
}

func Test_CartSuite(t *testing.T) {
	is := suite.NewAction(App())
	suite.Run(t, &CartSuite{Action: is})
}
