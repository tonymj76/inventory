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

type CategorySuite struct {
	*suite.Action
	tokenString string
	User        *models.User
}

func (is *CategorySuite) SetupTest() {
	is.Action.SetupTest()
	u := &models.User{
		FirstName:            "Aurther",
		LastName:             "Castiel",
		UserName:             "warluck",
		Email:                "aurther@gmail.com",
		Password:             "password",
		PasswordConfirmation: "password",
		IsAdmin:              true,
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

func (as *CategorySuite) TableCount(table string, count int, fn func()) {
	fn()

	finalCount, err := as.DB.Count(table)
	as.NoError(err)
	as.Equal(count, finalCount)
}

func (as *CategorySuite) createCategory() *models.Category {
	c := &models.Category{
		Name: "Nigerian Dish",
	}
	err := as.DB.Create(c)
	as.NoError(err)
	return c
}

func (as *CategorySuite) createCategoryWithProduct() *models.Category {
	c := &models.Category{
		Name: "Nigerian Dish",
		Products: models.Products{
			{
				Name:        "Eba",
				Description: "Eba and soup with 5 meat",
				Quantity:    44,
				Price:       5000.3,
				Active:      true,
			},
		},
	}
	err := as.DB.Eager().Create(c)
	as.NoError(err)
	return c
}

func (as *CategorySuite) Test_Categories_List() {
	c := as.createCategory()
	as.TableCount("categories", 1, func() {
		res := as.JSON("/api/v1/categories/").Get()
		as.Equal(200, res.Code)
		as.NoError(as.DB.Reload(c))
		as.Equal("Nigerian Dish", c.Name)
	})
}
func (as *CategorySuite) Test_Categories_List_with_products() {
	c := as.createCategoryWithProduct()
	as.TableCount("categories", 1, func() {
		res := as.JSON("/api/v1/categories/products/").Get()
		as.Equal(200, res.Code)
		as.NoError(as.DB.Reload(c))
		as.Equal("Nigerian Dish", c.Name)
		as.Equal("Eba", c.Products[0].Name)
	})
}

func (as *CategorySuite) Test_Categories_Show() {
	c := as.createCategory()
	as.TableCount("categories", 1, func() {
		res := as.JSON("/api/v1/category/%s", c.ID).Get()
		as.Equal(200, res.Code)
	})
}

func (as *CategorySuite) Test_Categories_Create() {
	as.createCategory()
	as.TableCount("categories", 2, func() {
		req := as.JSON("/api/v1/category/")
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Post(&models.Category{
			Name: "Chinese",
		})
		as.Equal(201, res.Code)
	})
}

func (as *CategorySuite) Test_Categories_Update() {
	c := as.createCategory()
	as.TableCount("categories", 1, func() {
		req := as.JSON("/api/v1/category/%s", c.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Put(&models.Category{
			ID:   c.ID,
			Name: "American",
		})
		as.Equal(200, res.Code)
		as.NoError(as.DB.Reload(c))
		as.Equal("American", c.Name)
	})
}

func (as *CategorySuite) Test_Categories_Destroy() {
	c := as.createCategory()
	as.TableCount("categories", 0, func() {
		req := as.JSON("/api/v1/category/%s", c.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Delete()
		as.Equal(200, res.Code)
	})
}

func Test_CategorySuite(t *testing.T) {
	as := suite.NewAction(App())
	suite.Run(t, &CategorySuite{Action: as})
}
