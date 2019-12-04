package actions

import (
	"testing"

	"github.com/gobuffalo/suite"
	"github.com/tonymj76/inventory/server/models"
)

var AuthAPI = "/api/v1/login/"

type AuthSuite struct {
	*suite.Action
	User *models.User
}

func (as *AuthSuite) SetupTest() {
	as.Action.SetupTest()
	u := &models.User{
		FirstName:            "Aurther",
		LastName:             "Castiel",
		UserName:             "warluck",
		Email:                "aurther@gmail.com",
		Password:             "password",
		PasswordConfirmation: "password",
	}
	//only u.create is the one creating the hash password
	verrs, err := u.Create(as.DB)
	as.NoError(err)
	as.False(verrs.HasAny())
	as.User = u
}

func (as *AuthSuite) Test_Auth_New() {
	res := as.JSON(AuthAPI).Get()
	as.Equal(200, res.Code)
	as.Contains(res.Body.String(), "Welcome to sign in page")
}

// Test_Auth_Create add users to test db
func (as *AuthSuite) Test_Auth_Create() {
	res := as.JSON(AuthAPI).Post(&models.User{
		Email:    "aurther@gmail.com",
		Password: "password",
	})

	as.Equal(200, res.Code)
}

func (as *AuthSuite) Test_Auth_Create_UnknownUser() {
	res := as.JSON(AuthAPI).Post(&models.User{
		Email:    "unknownuser@gmail.com",
		Password: "password",
	})
	as.Equal(433, res.Code)
	as.Equal("/", res.Location())
}

func (as *AuthSuite) Test_Auth_Create_BadPassword() {
	res := as.JSON(AuthAPI).Post(&models.User{
		Email:    "aurther@gmail.com",
		Password: "Bad",
	})
	as.Equal(433, res.Code)
	as.Equal("/", res.Location())
}

func Test_AuthSuite(t *testing.T) {
	as := suite.NewAction(App())
	suite.Run(t, &AuthSuite{Action: as})
}
