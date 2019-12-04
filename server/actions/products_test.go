package actions

import (
	"fmt"
	"testing"
	"time"

	"github.com/bxcodec/faker"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/nulls"
	"github.com/gobuffalo/suite"
	"github.com/tonymj76/inventory/server/models"
)

type ProductSuite struct {
	*suite.Action
	User        *models.User
	Merchant    *models.Merchant
	tokenString string
}

var productAPI = "/api/v1/product/"

func (is *ProductSuite) SetupTest() {
	is.Action.SetupTest()
	u := &models.User{
		FirstName:            "Aurther",
		LastName:             "Castiel",
		UserName:             "warluck",
		Email:                "aurther@gmail.com",
		Password:             "password",
		PasswordConfirmation: "password",
		IsMerchant:           true,
		Merchant: models.Merchant{
			BusinessName:  "Build2Day",
			PhoneNumber:   "234803466343322",
			HouseNumber:   "W54 Busa-Soji",
			Street:        "St mary",
			City:          "Calabar",
			State:         "Cross River",
			Country:       "Nigeria",
			BusinessEmail: "build2day@gmail.com",
		},
	}

	err := is.DB.Eager("Merchant").Create(u)
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

	m := &models.Merchant{}
	// errs := is.DB.Find(m, u.ID)
	errs := is.DB.Eager("Products").Where("user_id = ?", u.ID).First(m)
	is.NoError(errs)
	is.Merchant = m
}

// i need merchant id to create a product of the merchant
func (is *ProductSuite) createProduct() *models.Product {
	product := &models.Product{
		MerchantID: is.Merchant.ID,
		Category:   models.Category{Name: "Nigerian Dish"},
		Images: models.Images{
			{URL: nulls.NewString(faker.FirstName())}, {URL: nulls.NewString("my image")},
		},
		Name:        "Eba",
		Description: "Eba and soup with 5 meat",
		Quantity:    44,
		Price:       5000.3,
		Active:      true,
	}
	err := is.DB.Eager().Create(product)
	is.NoError(err)
	return product
}

func (is *ProductSuite) TableCount(table string, count int, fn func()) {
	fn()

	finalCount, err := is.DB.Count(table)
	is.NoError(err)
	is.Equal(count, finalCount)
}

func (as *ProductSuite) Test_ProductsResource_List() {
	p := as.createProduct()
	as.TableCount("products", 1, func() {
		req := as.JSON(productAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Get()
		as.Equal(200, res.Code)
		as.NoError(as.DB.Reload(p))
		as.Equal("Eba", p.Name)
	})
	c := &models.Category{}
	err := as.DB.Eager().Where("id = ?", p.CategoryID).First(c)
	as.NoError(err)
}

// you can pass in the category id to product category_id to link them
func (as *ProductSuite) Test_ProductsResource_Create() {
	as.TableCount("products", 1, func() {
		req := as.JSON(productAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Post(&models.Product{
			Name:        "Egusi",
			Description: "egusi with 5 meat",
			Quantity:    32,
			Price:       559,
			Active:      true,
		})
		as.Contains(res.Body.String(), "Egusi")
		as.Equal(201, res.Code)
	})
}

func (as *ProductSuite) Test_ProductsResource_Update() {
	p := as.createProduct()
	as.TableCount("products", 1, func() {
		req := as.JSON(productAPI+"%s", p.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Put(&models.Product{
			ID:          p.ID,
			MerchantID:  p.MerchantID,
			Name:        "Egusis",
			Description: "Eguis with 6 meat",
			Price:       p.Price,
			Active:      p.Active,
		})
		as.Equal(200, res.Code)
		as.NoError(as.DB.Reload(p))
		as.Equal("Egusis", p.Name)
		as.NotEqual(44, p.Quantity)
		as.Equal("Eguis with 6 meat", p.Description)
	})
}

func (as *ProductSuite) Test_ProductsResource_show() {
	p := as.createProduct()
	as.TableCount("products", 1, func() {
		req := as.JSON(productAPI+"%s", p.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Get()
		as.Equal(200, res.Code)
		as.Contains(res.Body.String(), p.Name)
	})
}

func (as *ProductSuite) Test_ProductsResource_Destroy() {
	p := as.createProduct()
	as.TableCount("products", 0, func() {
		req := as.JSON(productAPI+"%s", p.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Delete()
		as.Equal(200, res.Code)
	})
}

func Test_ProductSuite(t *testing.T) {
	as := suite.NewAction(App())
	suite.Run(t, &ProductSuite{Action: as})
}
