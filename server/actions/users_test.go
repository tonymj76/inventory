package actions

import (
	"testing"

	"github.com/gobuffalo/suite"
	"github.com/tonymj76/inventory/server/models"
)

var API = "/api/v1/users/"

type UserSuite struct {
	*suite.Action
	User *models.User
}

func (is *UserSuite) SetupTest() {
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
	is.User = u
}

func (as *UserSuite) Test_UsersResource_List() {
	res := as.JSON(API).Get()
	as.Equal(200, res.Code)
}

func (as *UserSuite) Test_UsersResource_Show() {
	res := as.JSON(API+"%s", as.User.ID).Get()
	as.Equal(200, res.Code)
}

func (as *UserSuite) Test_UsersResource_Create() {
	count, err := as.DB.Count("users")
	as.NoError(err)
	as.Equal(1, count)

	u := &models.User{
		FirstName:            "lucy",
		LastName:             "john",
		UserName:             "admin",
		Email:                "lucy@gmail.com",
		Password:             "password",
		PasswordConfirmation: "password",
	}

	res := as.JSON(API).Post(u)
	as.Equal(201, res.Code)
	// as.Contains(res.Body.String(), "email:aurther@gmail.com")

	count, err = as.DB.Count("users")
	as.NoError(err)
	as.Equal(2, count)
}

func (as *UserSuite) Test_UsersResource_Update() {
	res := as.JSON(API+"%s", as.User.ID).Put(&models.User{
		ID:        as.User.ID,
		FirstName: "Dan",
		LastName:  as.User.LastName,
		Email:     as.User.Email,
		Password:  as.User.Password,
	})
	as.Equal(200, res.Code)
	checkupdate := &models.User{}
	res.Bind(checkupdate)
	as.Equal("Dan", checkupdate.FirstName)
	// as.NoError(as.DB.Reload(as.u)
}

func (as *UserSuite) Test_UsersResource_Destroy() {
	res := as.JSON(API+"%s", as.User.ID).Delete()
	as.Equal(200, res.Code)
	count, err := as.DB.Count("users")
	as.NoError(err)
	as.Equal(0, count)
}

func Test_UserSuite(t *testing.T) {
	as := suite.NewAction(App())
	suite.Run(t, &UserSuite{Action: as})
}
