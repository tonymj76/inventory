package actions

import (
	"fmt"
	"testing"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/suite"
	"github.com/gofrs/uuid"
	"github.com/tonymj76/inventory/server/models"
)

var orderAPI = "/api/v1/order/"

type OrderSuite struct {
	*suite.Action
	User             *models.User
	MerchantID       uuid.UUID
	CourierID        uuid.UUID
	ShippingDetailID uuid.UUID
	Products         models.Products
	tokenString      string
}

func (is *OrderSuite) SetupTest() {
	is.Action.SetupTest()
	u := &models.User{
		FirstName:            "Aurther",
		LastName:             "Castiel",
		UserName:             "warluck",
		Email:                "aurther@gmail.com",
		Password:             "password",
		PasswordConfirmation: "password",
		Addresses: models.Addresses{
			models.Address{
				HouseNumber: "W54 Busa-Soji",
				Street:      "St mary",
				City:        "Calabar",
				State:       "Cross River",
				Country:     "Nigeria",
				Phone:       "09088787677"},
		},
	}

	err := is.DB.Eager().Create(u)
	is.NoError(err)
	is.NoError(is.DB.Reload(u))
	is.NoError(is.DB.Load(u, "Addresses"))
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
	is.ShippingDetailID = u.Addresses[0].ID
}

func (is *OrderSuite) createMerchant() {
	m := &models.Merchant{
		BusinessName: "Investlift",
		PhoneNumber:  "090900030",
		Products: models.Products{
			// Each product here is of different category
			models.Product{
				Name:        "Eba",
				Description: "Eba pounded well",
				Quantity:    44,
				Price:       300.3,
				Active:      true,
			},
			models.Product{
				Name:        "Egusi",
				Description: "well cooked",
				Quantity:    44,
				Price:       500.3,
				Active:      true,
			},
			models.Product{
				Name:        "Goat meat",
				Description: "male goat meat",
				Quantity:    2,
				Price:       40.3,
				Active:      true,
			},
		},
	}

	is.NoError(is.DB.Eager().Create(m))
	is.NoError(is.DB.Reload(m))
	is.MerchantID = m.ID
	is.NoError(is.DB.Load(m, "Products"))
	is.Products = append(is.Products, m.Products...)

}

func (is *OrderSuite) createCourier() {

	c := &models.Courier{
		CompanyName: "move move chop",
	}
	is.NoError(is.DB.Create(c))
	is.NoError(is.DB.Reload(c))
	is.CourierID = c.ID
}

func (is *OrderSuite) tableCount(table string, count int, fn func()) {
	fn()
	finalCount, err := is.DB.Count(table)
	is.NoError(err)
	is.Equal(count, finalCount)
}

func (is *OrderSuite) createOrder() *models.Order {
	order := &models.Order{
		UserID:           is.User.ID,
		CourierID:        is.CourierID,
		ShippingDetailID: is.ShippingDetailID,

		OrderItems: *is.createOrderItems(),
		Quantity:   5,
		TotalPrice: 5 * 40000.00,
		Status:     Paid,
	}

	// is.NoError(is.DB.Eager().Create(order))
	// is.NoError(is.DB.Reload(order))
	// is.NoError(is.DB.Load(order, "OrderItems"))
	return order
}

func (is *OrderSuite) createOrderItems() *models.OrderItems {
	orderItems := models.OrderItems{}
	for _, p := range is.Products {
		orderItem := models.OrderItem{
			UserID:     is.User.ID,
			CourierID:  is.CourierID,
			MerchantID: is.MerchantID,
			ProductID:  p.ID,
			Product:    p,
			Quantity:   4,
			TotalPrice: 40000.00,
		}
		orderItems = append(orderItems, orderItem)
	}
	return &orderItems
}

func (is *OrderSuite) createOrderItem() *models.OrderItem {
	orderItem := models.OrderItem{
		UserID:        is.User.ID,
		CourierID:     is.CourierID,
		MerchantID:    is.MerchantID,
		ProductID:     is.Products[0].ID,
		Product:       is.Products[0],
		Quantity:      4,
		TotalPrice:    40000.00,
		DeliveryState: Pending,
		Status:        Paid,
	}
	o := &models.OrderItem{}
	// fmt.Println(orderItem.String())
	is.NoError(is.DB.Eager().Create(&orderItem))
	is.NoError(is.DB.Where("user_id =? ", is.User.ID).First(o))
	return o
}

func (is *OrderSuite) Test_Order_Create() {
	is.createCourier()
	is.createMerchant()
	is.NoError(is.DB.Eager().Create(is.createOrder()))
	order := is.createOrder()
	is.tableCount("orders", 1, func() {
		req := is.JSON(orderAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Post(order)
		is.Equal(201, res.Code)
	})
}

func (is *OrderSuite) Test_Order_List() {
	is.createCourier()
	is.createMerchant()
	is.NoError(is.DB.Eager().Create(is.createOrder()))
	is.tableCount("orders", 1, func() {
		req := is.JSON(orderAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Get()
		is.Equal(200, res.Code)
		is.Contains(res.Body.String(), "successful")
	})
}

func Test_OrderSuite(t *testing.T) {
	as := suite.NewAction(App())
	suite.Run(t, &OrderSuite{Action: as})
}

/*
order should be paid then modify order_item status from panding to paid

total price for order item will be added from client when the user is adding to his dish
save it on a order item total price variable

then on order will be how many order items he or she want
order total is quantity * order item total price

check if the total price from the front end is equal to product unit price * order item quantity
*/
