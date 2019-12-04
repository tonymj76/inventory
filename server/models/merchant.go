package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/validate/validators"

	"github.com/gobuffalo/nulls"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gofrs/uuid"
	// github.com/markbates/validate
)

//Merchant is a user who is granded access to sell goods
type Merchant struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`

	UserID   uuid.UUID `json:"user_id" db:"user_id"`
	Products Products  `json:"products,omitempty" many_to_many:"merchantproducts"`

	Description   nulls.String `json:"description" db:"description"`
	CACRegNo      nulls.String `json:"cac_reg_no" db:"cac_reg_no"`
	BusinessName  string       `json:"business_name" db:"business_name"`
	PhoneNumber   string       `json:"phone_number" db:"phone_number"`
	HouseNumber   string       `json:"house_number" db:"house_number"`
	Street        string       `json:"street" db:"street"`
	City          string       `json:"city" db:"city"`
	State         string       `json:"state" db:"state"`
	Country       string       `json:"country" db:"country"`
	BusinessEmail string       `json:"business_email" db:"business_email"`
}

// String is not required by pop and may be deleted
func (m Merchant) String() string {
	jm, _ := json.MarshalIndent(m, " ", " ")
	return string(jm)
}

// Merchants is not required by pop and may be deleted
type Merchants []Merchant

// String is not required by pop and may be deleted
func (m Merchants) String() string {
	jm, _ := json.MarshalIndent(m, " ", "  ")
	return string(jm)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (m *Merchant) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: m.BusinessName, Name: "BusinessName"},
		&validators.StringIsPresent{Field: m.PhoneNumber, Name: "PhoneNumber"},
		&validators.StringIsPresent{Field: m.Street, Name: "Street", Message: "Street can't be empty"},
		&validators.StringIsPresent{Field: m.City, Name: "City"},
		&validators.StringIsPresent{Field: m.State, Name: "State"},
		&validators.StringIsPresent{Field: m.Country, Name: "Country"},
		&validators.FuncValidator{
			Field:   m.BusinessName,
			Name:    "BusinessName",
			Message: "%s is already taken",
			Fn: func() bool {
				var b bool
				q := tx.Where("business_name = ?", m.BusinessName)
				if m.ID != uuid.Nil {
					q = q.Where("id != ?", m.ID)
				}
				b, err = q.Exists(m)
				if err != nil {
					return false
				}
				return !b
			},
		},
	), err
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (m *Merchant) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: m.BusinessName, Name: m.BusinessName},
	), err
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (m *Merchant) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: m.BusinessName, Name: m.BusinessName},
	), err
}
