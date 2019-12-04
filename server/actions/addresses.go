package actions

import (
	"net/http"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
)

type AddressesResource struct {
	buffalo.Resource
}

func (v AddressesResource) scope(c buffalo.Context) (*pop.Query, error) {
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return tx.Q(), errors.WithStack(errors.New("transaction not found"))
	}

	cu, ok := c.Value("user").(*models.User)
	if !ok {
		return tx.Q(), errors.WithStack(errors.New("user not found"))
	}

	return tx.BelongsTo(cu), nil
}

// List default implementation.
func (v AddressesResource) List(c buffalo.Context) error {
	addresses := &models.Addresses{}
	q, err := v.scope(c)
	if err != nil {
		c.Error(http.StatusInternalServerError, err)
	}
	if err := q.All(addresses); err != nil {
		c.Error(http.StatusInternalServerError, err)
	}
	return c.Render(200, r.JSON(map[string]interface{}{
		"message":   "successful",
		"addresses": addresses,
	}))
}

// Show default implementation.
func (v AddressesResource) Show(c buffalo.Context) error {
	address := &models.Address{}
	q, err := v.scope(c)

	if err != nil {
		return c.Error(http.StatusInternalServerError, err)
	}
	if err := q.Find(address, c.Param("address_id")); err != nil {
		c.Error(http.StatusInternalServerError, err)
	}
	return c.Render(200, r.JSON(map[string]interface{}{
		"message": "successful",
		"address": address,
	}))
}

// Create default implementation.
func (v AddressesResource) Create(c buffalo.Context) error {
	address := &models.Address{}
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("transaction not found"))
	}
	if err := c.Bind(address); err != nil {
		c.Error(http.StatusInternalServerError, err)
	}

	cu, ok := c.Value("user").(*models.User)
	if !ok {
		return errors.WithStack(errors.New("user not found"))
	}

	// Use the current user's name if they are not provided
	if address.FirstName == "" && address.LastName == "" {
		address.FirstName = cu.FirstName
		address.LastName = cu.LastName
	}
	verrs, err := tx.ValidateAndCreate(address)
	if verrs.HasAny() {
		return c.Render(http.StatusBadRequest, r.JSON(verrs))
	}
	if err != nil {
		return errors.WithStack(err)
	}

	if err := tx.Create(&models.Useraddress{
		UserID:    cu.ID,
		AddressID: address.ID,
	}); err != nil {
		return errors.WithStack(err)
	}

	// Create shipping address if the current user is a customer
	if !cu.IsAdmin && !cu.IsCourier && !cu.IsMerchant {
		if err := tx.Create(&models.ShippingAddress{
			UserID:    cu.ID,
			AddressID: address.ID,
		}); err != nil {
			return errors.WithStack(err)
		}
	}

	return c.Render(http.StatusCreated, r.JSON(map[string]interface{}{
		"message": "successful",
		"address": address,
	}))
}

// Update default implementation.
func (v AddressesResource) Update(c buffalo.Context) error {
	address := &models.Address{}
	q, err := v.scope(c)
	if err != nil {
		return c.Error(http.StatusInternalServerError, err)
	}
	if err := q.Find(address, c.Param("address_id")); err != nil {
		c.Error(http.StatusInternalServerError, err)
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transection not found"))
	}
	if err := c.Bind(address); err != nil {
		return errors.WithStack(err)
	}

	verrs, err := tx.ValidateAndUpdate(address)
	if verrs.HasAny() {
		return c.Render(http.StatusBadRequest, r.JSON(verrs))
	}
	if err != nil {
		return errors.WithStack(err)
	}
	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{
		"message": "successful",
		"address": address,
	}))
}

// Destroy default implementation.
func (v AddressesResource) Destroy(c buffalo.Context) error {
	address := &models.Address{}
	q, err := v.scope(c)
	if err != nil {
		return c.Error(http.StatusInternalServerError, err)
	}
	if err := q.Find(address, c.Param("address_id")); err != nil {
		c.Error(http.StatusInternalServerError, err)
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("Transection not found"))
	}
	if err := tx.Destroy(address); err != nil {
		c.Error(http.StatusBadRequest, err)
	}
	return c.Render(200, r.JSON(address))
}
