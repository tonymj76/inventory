package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

// ShippingAddress model struct
type ShippingAddress struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	AddressID uuid.UUID `json:"address_id" db:"address_id"`
	Address   Address   `json:"address" belongs_to:"addresses"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
}

// String is not required by pop and may be deleted
func (s ShippingAddress) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}

// ShippingAddresses is not required by pop and may be deleted
type ShippingAddresses []ShippingAddress

// String is not required by pop and may be deleted
func (s ShippingAddresses) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (s *ShippingAddress) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.UUIDIsPresent{Field: s.UserID, Name: "UserID"},
		&validators.UUIDIsPresent{Field: s.AddressID, Name: "AddressID"},
	), err
}
