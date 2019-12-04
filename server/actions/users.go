package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

// UsersResource is the resource for the User model
type UsersResource struct {
	buffalo.Resource
}

//List gets all Users. This function is mapped to the path
//Get /users
func (v UsersResource) List(c buffalo.Context) error {
	// Get the DB connection from the context
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no entry found"))
	}

	users := &models.Users{}

	// Paginate results. Params "page" and "per_page" control pagination.
	// Default values are "page=1" and "per_page=20".
	query := tx.PaginateFromParams(c.Params())

	// Retrieve all Users from the DB
	if err := query.Eager().All(users); err != nil {
		return errors.WithStack(err)
	}

	// Add the paginator to the header so clients know how to paginate.
	c.Response().Header().Set("X-Pagination", query.Paginator.String())
	return c.Render(200, r.JSON(users))
}

// Create adds a User to the DB. This function is mapped to the
// path Post /users
func (v UsersResource) Create(c buffalo.Context) error {
	// Allocate an empty user
	user := &models.User{}

	// Bind user to the response coming in
	if err := c.Bind(user); err != nil {
		return errors.WithStack(err)
	}

	// Get the DB connection from the context
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("No Value is found"))
	}

	// Time to save in DB and also validate the result
	verrs, err := user.Create(tx)

	// check to see if their is any errors during creating user
	if err != nil {
		return errors.WithStack(err)
	}

	// check for validations errors
	if verrs.HasAny() {
		// Render errors as Json
		return c.Render(400, r.JSON(verrs))
	}

	return c.Render(201, r.JSON(user.ID))
}

// Update Users info in the DB. This function is mapped to the
// Path Put /users/{user_id}
func (v UsersResource) Update(c buffalo.Context) error {
	// Alloocate an empty user
	user := &models.User{}
	// if err := v.scope(c).Find(user, c.Param("user_id")); err != nil {
	// 	return c.Error(404, err)
	// }
	tx, ok := c.Value("tx").(*pop.Connection)

	if !ok {
		return errors.WithStack(errors.New("No value is found"))
	}

	if err := tx.Find(user, c.Param("user_id")); err != nil {
		return c.Error(404, err)
	}

	if err := c.Bind(user); err != nil {
		return errors.WithStack(err)
	}

	verrs, err := tx.ValidateAndUpdate(user)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrs.HasAny() {
		return c.Render(400, r.JSON(verrs))
	}
	return c.Render(200, r.JSON(user))
}

//Destroy deletes a user from the DB. this function is mapped
// path Delete /users/{user_id}
func (v UsersResource) Destroy(c buffalo.Context) error {
	user := &models.User{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("No value is found"))
	}
	if err := tx.Find(user, c.Param("user_id")); err != nil {
		return c.Error(404, err)
	}

	if err := tx.Destroy(user); err != nil {
		return errors.WithStack(err)
	}

	return c.Render(200, r.JSON(user))
}

// Show gets the data from one user. This function is mapped to
// the path Get /users/{user_id}
func (v UsersResource) Show(c buffalo.Context) error {
	user := &models.User{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("No value is Found"))
	}

	if err := tx.Eager().Find(user, c.Param("user_id")); err != nil {
		return c.Error(404, err)
	}
	return c.Render(200, r.JSON(user))
}
