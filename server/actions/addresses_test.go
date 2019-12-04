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

var addressAPI = "/api/v1/addresses/"

type AddressSuite struct {
	*suite.Action
	User        *models.User
	tokenString string
}

func (is *AddressSuite) SetupTest() {
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

func (is *AddressSuite) tableCount(table string, count int, fn func()) {
	fn()

	finalCount, err := is.DB.Count(table)
	is.NoError(err)
	is.Equal(count, finalCount)
}

func (is *AddressSuite) createUserAddress() *models.Address {
	a := &models.Address{
		UserID:      is.User.ID,
		HouseNumber: "W54 Busa-Soji",
		Street:      "St mary",
		City:        "Calabar",
		State:       "Cross River",
		Country:     "Nigeria",
		Phone:       "09088787677",
	}
	is.NoError(is.DB.Eager().Create(a))
	return a
}

func (is *AddressSuite) Test_AddressesResource_List() {
	is.createUserAddress()
	is.tableCount("addresses", 1, func() {
		req := is.JSON(addressAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Get()
		is.Equal(200, res.Code)
		is.Contains(res.Body.String(), "successful")
	})
}

func (is *AddressSuite) Test_AddressesResource_Show() {
	a := is.createUserAddress()
	is.tableCount("addresses", 1, func() {
		req := is.JSON(addressAPI+"%s", a.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Get()
		is.Equal(200, res.Code)
		is.Contains(res.Body.String(), "successful")
	})
}

func (is *AddressSuite) Test_AddressesResource_Create() {
	is.tableCount("addresses", 1, func() {
		req := is.JSON(addressAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Post(&models.Address{
			UserID:      is.User.ID,
			HouseNumber: "W55 zusa-Soji",
			Street:      "St John",
			City:        "Calabar",
			State:       "Cross River",
			Country:     "Nigeria",
			Phone:       "09088787677",
		})
		is.Equal(201, res.Code)
		is.Contains(res.Body.String(), "successful")

	})
}

// Test_AddressesResource_Update note you have to pass in all
// the field. so it won't default to it zeroth value while updating
func (is *AddressSuite) Test_AddressesResource_Update() {
	a := is.createUserAddress()
	is.tableCount("addresses", 1, func() {
		req := is.JSON(addressAPI+"%s", a.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Put(&models.Address{
			ID:          a.ID,
			UserID:      is.User.ID,
			HouseNumber: "W55 zusa-Soji",
			Street:      "housing estate",
			City:        "Calabar",
			State:       "Cross-River",
			Country:     "Nigeria",
			Phone:       "09088787677",
		})
		is.Equal(200, res.Code)
		is.NoError(is.DB.Reload(a))
		is.Equal("housing estate", a.Street)
		is.Contains(res.Body.String(), "successful")
	})
}

func (is *AddressSuite) Test_AddressesResource_Destroy() {
	a := is.createUserAddress()
	is.tableCount("addresses", 0, func() {
		req := is.JSON(addressAPI+"%s", a.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", is.tokenString)
		res := req.Delete()
		is.Equal(200, res.Code)
	})
}

func Test_AddressSuite(t *testing.T) {
	is := suite.NewAction(App())
	suite.Run(t, &AddressSuite{Action: is})
}
