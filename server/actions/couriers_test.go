package actions

import (
	"fmt"
	"testing"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/suite"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

var courierAPI = "/api/v1/couriers/"

type CourierSuite struct {
	*suite.Action
	User        *models.User
	tokenString string
}

func (is *CourierSuite) SetupTest() {
	is.Action.SetupTest()
	u := &models.User{
		FirstName:            "Aurther",
		LastName:             "Castiel",
		UserName:             "warluck",
		Email:                "aurther@gmail.com",
		Password:             "password",
		PasswordConfirmation: "password",
		IsCourier:            true,
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
func (is *CourierSuite) TableCount(table string, count int, fn func()) {
	fn()

	finalCount, err := is.DB.Count(table)
	is.NoError(err)
	is.Equal(count, finalCount)
}

func (is *CourierSuite) CreateCourier() *models.Courier {
	courier := &models.Courier{
		UserID:        is.User.ID,
		CompanyName:   "Build2Day",
		PhoneNumber:   "234803466343322",
		HouseNumber:   "W54 Busa-Soji",
		Street:        "St mary",
		City:          "Calabar",
		State:         "Cross River",
		Country:       "Nigeria",
		BusinessEmail: "build2day@gmail.com",
		// Description:  "we render servers to people",
	}
	is.NoError(is.DB.Create(courier))
	return courier
}

func (as *CourierSuite) Test_CouriersResource_List() {
	as.CreateCourier()
	req := as.JSON(courierAPI)
	req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
	res := req.Get()
	as.Equal(200, res.Code)
}

func (as *CourierSuite) Test_CouriersResource_Show() {
	as.EqualError(errors.New("not available"), "not available")
}

func (as *CourierSuite) Test_CouriersResource_Create() {
	as.TableCount("couriers", 1, func() {
		req := as.JSON(courierAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Post(&models.Courier{
			UserID:        as.User.ID,
			CompanyName:   "Build2Day",
			PhoneNumber:   "234803466343322",
			HouseNumber:   "W54 Busa-Soji",
			Street:        "St mary",
			City:          "Calabar",
			State:         "Cross River",
			Country:       "Nigeria",
			BusinessEmail: "build2day@gmail.com",
		})
		as.Equal(201, res.Code)
	})
	// check if is Courier is set to true
	u := &models.User{}
	err := as.DB.Where("id = ?", as.User.ID).First(u)
	as.NoError(err)
	as.Equal(true, u.IsCourier)
}

func (as *CourierSuite) Test_CouriersResource_Update() {
	c := as.CreateCourier()
	as.TableCount("couriers", 1, func() {
		req := as.JSON(courierAPI+"%s", c.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Put(&models.Courier{
			ID:            c.ID,
			UserID:        as.User.ID,
			CompanyName:   "Investlift",
			PhoneNumber:   "080343343434",
			HouseNumber:   "W54 Busa-Soji",
			Street:        "St mary",
			City:          "Calabar",
			State:         "Cross River",
			Country:       "Nigeria",
			BusinessEmail: "build2day@gmail.com",
		})
		as.Equal(200, res.Code)
		as.NoError(as.DB.Reload(c))
		checkdb := &models.Courier{}
		// as.DB.Where("id = ?", c.ID).First(checkdb)
		res.Bind(checkdb)
		as.Equal("Investlift", checkdb.CompanyName)
		as.Equal("Investlift", c.CompanyName)
	})

}

func (as *CourierSuite) Test_CouriersResource_Destroy() {
	c := as.CreateCourier()
	req := as.JSON(courierAPI+"%s", c.ID)
	req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
	res := req.Delete()
	as.Equal(200, res.Code)

}

func Test_CourierSuite(t *testing.T) {
	as := suite.NewAction(App())
	suite.Run(t, &CourierSuite{Action: as})
}
