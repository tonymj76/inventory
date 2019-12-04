package actions

import (
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

type StatesResource struct {
	buffalo.Resource
}

func (s StatesResource) scope(c buffalo.Context) (*pop.Query, error) {
	tx := c.Value("tx").(*pop.Connection)
	cu, ok := c.Value("user").(*models.User)

	if !ok {
		return tx.Q(), errors.WithStack(errors.New("could not find a current user"))
	}
	return tx.BelongsTo(cu), nil
}

// List default implementation.
func (s StatesResource) List(c buffalo.Context) error {
	states := &models.States{}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return c.Error(http.StatusInternalServerError, errors.New("transaction not found"))
	}

	if err := tx.Eager().All(states); err != nil {
		return c.Error(http.StatusNotFound, errors.WithStack((err)))
	}
	return c.Render(http.StatusOK, r.JSON(states))
}

// Show default implementation.
func (s StatesResource) Show(c buffalo.Context) error {
	state := &models.State{}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}

	if err := tx.Eager().Find(state, c.Param("state_id")); err != nil {
		return errors.WithStack(err)
	}

	return c.Render(http.StatusOK, r.JSON(state))
}

// Update default implementation.
func (s StatesResource) Update(c buffalo.Context) error {
	state := &models.State{}

	q, err := s.scope(c)
	if err != nil {
		return errors.WithStack(err)
	}
	if err := q.Find(state, c.Param("state_id")); err != nil {
		return c.Error(http.StatusBadRequest, err)
	}

	if err := c.Bind(state); err != nil {
		return errors.WithStack(err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}

	verrs, err := tx.Eager().ValidateAndUpdate(state, "id", "name")
	if err != nil {
		return errors.WithStack(err)
	}
	if verrs.HasAny() {
		return c.Render(http.StatusBadRequest, r.JSON(verrs))
	}
	return c.Render(http.StatusOK, r.JSON(state))
}

// Destroy default implementation.
func (s StatesResource) Destroy(c buffalo.Context) error {
	state := &models.State{}

	q, err := s.scope(c)
	if err != nil {
		return errors.WithStack(err)
	}
	if err := q.Find(state, c.Param("state_id")); err != nil {
		return c.Error(http.StatusBadRequest, err)
	}

	if err := c.Bind(state); err != nil {
		return errors.WithStack(err)
	}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("no transaction found"))
	}

	if err := tx.Destroy(state); err != nil {
		return errors.WithStack(err)
	}
	return c.Render(http.StatusOK, r.JSON(state))
}
