package actions

import (
	"fmt"
	"testing"

	"github.com/bxcodec/faker"
	"github.com/gobuffalo/suite"
	"github.com/tonymj76/inventory/server/models"
)

var displayProductAPI = "/api/v1/display_products/"
var queryAPI = "/api/v1/query/"
var filterAPI = "/api/v1/filter/"

type DisplayProductSuite struct {
	*suite.Action
	merchants models.Merchants
}

func (is *DisplayProductSuite) SetupTest() {
	is.Action.SetupTest()
	street := [10]string{"street1", "str2", "str3", "str4", "str5", "str6", "str7", "str8", "str9", "str10"}
	city := [10]string{"cty1", "cty2", "cty3", "cty4", "cty5", "cty6", "cty7", "cty8", "cty9", "cty10"}
	state := [10]string{"state1", "state2", "state3", "state4", "state5", "state6", "state7", "state8", "state9", "state10"}

	name := [3]string{"eba", "egusi", "meat"}
	cat := [3]string{"swallow", "soup", "protein"}
	price := [3]float64{250.00, 400.00, 600.00}
	ps := models.Products{}
	for i := 0; i < 3; i++ {
		product := &models.Product{
			Category:    models.Category{Name: cat[i]},
			Name:        name[i],
			Description: fmt.Sprintf("%s is the best you can ever have", name[i]),
			Quantity:    44,
			Price:       price[i],
			Active:      true,
		}
		ps = append(ps, *product)
	}
	err := is.DB.Eager("Category").Save(ps)
	is.NoError(err)

	for i := 0; i < 10; i++ {
		m := &models.Merchant{
			BusinessName:  faker.Name(),
			PhoneNumber:   faker.Phonenumber(),
			HouseNumber:   "W56",
			Street:        street[i],
			City:          city[i],
			State:         state[i],
			Country:       "Nigeria",
			BusinessEmail: "build2day@gmail.com",
			Products: models.Products{
				ps[0], ps[1], ps[2],
			},
		}
		is.merchants = append(is.merchants, *m)
	}
	is.NoError(is.DB.Eager().Create(is.merchants))
}

func (is *DisplayProductSuite) tableCount(table string, count int, fn func()) {
	fn()

	finalCount, err := is.DB.Count(table)
	is.NoError(err)
	is.Equal(count, finalCount)
}

func (is *DisplayProductSuite) Test_ListMerchantsAndProducts() {
	// fmt.Println(is.merchants)
	is.tableCount("merchants", 20, func() {
		res := is.JSON(displayProductAPI).Get()
		is.Equal(200, res.Code)
	})
}

func (is *DisplayProductSuite) Test_ListMerchantsAndProductsBaseOnLocation() {
	// fmt.Println(is.merchants)
	is.tableCount("merchants", 30, func() {
		res := is.JSON(displayProductAPI+"%s", "?state=state1&city=cty1&street=street1").Get()
		is.Equal(200, res.Code)
	})
}

func (is *DisplayProductSuite) Test_Search_Query() {
	merchants := &models.Merchants{}
	is.tableCount("merchants", 40, func() {
		res := is.JSON(queryAPI+"%s", "?q=eba").Get()
		res.Bind(merchants)
		// fmt.Println(merchants.String())
		is.Equal(200, res.Code)
	})
}

func (is *DisplayProductSuite) Test_Search_Query_WithState() {
	merchants := &models.Merchants{}
	is.tableCount("merchants", 50, func() {
		res := is.JSON(queryAPI+"%s", "?q=eba&state=state1").Get()
		res.Bind(merchants)
		// fmt.Println(merchants.String())
		is.Equal(200, res.Code)
	})
}

func (is *DisplayProductSuite) Test_Filter_Products_By_Price_Range() {
	products := &models.Products{}
	is.tableCount("products", 3, func() {
		res := is.JSON(filterAPI+"%s", "?price_range=100.00-500.00").Get()
		res.Bind(products)
		for _, p := range *products {
			if p.Price < 100.00 || p.Price > 500.00 {
				is.Fail("Product price is less or more then the range provided in the query")
			}
			is.True(p.Price >= 100 && p.Price <= 500)
		}

		if len(*products) < 1 {
			is.Fail("i need you to fail; no products")
		}
		is.Equal(200, res.Code)
	})
}

func Test_DisplayProductSuite(t *testing.T) {
	as := suite.NewAction(App())
	suite.Run(t, &DisplayProductSuite{Action: as})
}
