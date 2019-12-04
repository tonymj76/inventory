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

var merchantAPI = "/api/v1/merchants/"

type MerchantSuite struct {
	*suite.Action
	User        *models.User
	tokenString string
}

func (is *MerchantSuite) SetupTest() {
	is.Action.SetupTest()
	u := &models.User{
		FirstName:            "Aurther",
		LastName:             "Castiel",
		UserName:             "warluck",
		Email:                "aurther@gmail.com",
		Password:             "password",
		PasswordConfirmation: "password",
		IsMerchant:           true,
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
func (is *MerchantSuite) TableCount(table string, count int, fn func()) {
	fn()

	finalCount, err := is.DB.Count(table)
	is.NoError(err)
	is.Equal(count, finalCount)
}

func (is *MerchantSuite) CreateMerchant() *models.Merchant {
	merchant := &models.Merchant{
		UserID:        is.User.ID,
		BusinessName:  "Build2Day",
		PhoneNumber:   "234803466343322",
		HouseNumber:   "W54 Busa-Soji",
		City:          "Calabar",
		Street:        "St mary",
		Country:       "Nigeria",
		State:         "Cross River",
		BusinessEmail: "build2day@gmail.com",
		// Description:  "we render servers to people",
	}
	is.NoError(is.DB.Create(merchant))
	return merchant
}

func (as *MerchantSuite) Test_MerchantsResource_List() {
	merchant := as.CreateMerchant()
	req := as.JSON(merchantAPI)
	req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
	res := req.Get()
	as.Equal(200, res.Code)
	as.Contains(res.Body.String(), merchant.BusinessName)
}

func (as *MerchantSuite) Test_MerchantsResource_Show() {
	merchant := as.CreateMerchant()
	req := as.JSON(merchantAPI+"%s", merchant.ID)
	req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
	res := req.Get()
	as.Equal(200, res.Code)
	as.Contains(res.Body.String(), merchant.BusinessName)
}

func (as *MerchantSuite) Test_MerchantsResource_Create() {
	as.TableCount("merchants", 1, func() {
		req := as.JSON(merchantAPI)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Post(&models.Merchant{
			UserID:        as.User.ID,
			BusinessName:  "Build2Day",
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
	// check if is merchant is set to true
	u := &models.User{}
	err := as.DB.Where("id = ?", as.User.ID).First(u)
	as.NoError(err)
	as.Equal(true, u.IsMerchant)
}

func (as *MerchantSuite) Test_MerchantsResource_Update() {
	m := as.CreateMerchant()
	as.TableCount("merchants", 1, func() {
		req := as.JSON(merchantAPI+"%s", m.ID)
		req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
		res := req.Put(&models.Merchant{
			ID:            m.ID,
			UserID:        as.User.ID,
			BusinessName:  "Investlift",
			PhoneNumber:   "080343343434",
			HouseNumber:   "W54 Busa-Soji",
			Street:        "St mary",
			City:          "Calabar",
			State:         "Cross River",
			Country:       "Nigeria",
			BusinessEmail: "build2day@gmail.com",
		})

		as.Equal(200, res.Code)
		as.NoError(as.DB.Reload(m))
		checkdb := &models.Merchant{}
		// as.DB.Where("id = ?", m.ID).First(checkdb)
		res.Bind(checkdb)
		as.Equal("Investlift", checkdb.BusinessName)
		as.Equal("Investlift", m.BusinessName)
	})

}

func (as *MerchantSuite) Test_MerchantsResource_Destroy() {
	merchant := as.CreateMerchant()
	req := as.JSON(merchantAPI+"%s", merchant.ID)
	req.Headers["Authorization"] = fmt.Sprintf("Bearer %s", as.tokenString)
	res := req.Delete()
	as.Equal(200, res.Code)

}

func Test_MerchantSuite(t *testing.T) {
	as := suite.NewAction(App())
	suite.Run(t, &MerchantSuite{Action: as})
}
