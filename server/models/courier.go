package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

// Courier Transporting Company
type Courier struct {
	ID            uuid.UUID     `json:"id" db:"id"`
	CreatedAt     time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at" db:"updated_at"`
	UserID        uuid.UUID     `json:"user_id" db:"user_id"`
	DeliveryPrice DeliveryPrice `json:"delivery_price" has_one:"delivery_price" fk_id:"courier_id"`
	CompanyName   string        `json:"company_name" db:"company_name"`
	PhoneNumber   string        `json:"phone_number" db:"phone_number"`
	HouseNumber   string        `json:"house_number" db:"house_number"`
	Street        string        `json:"street" db:"street"`
	City          string        `json:"city" db:"city"`
	State         string        `json:"state" db:"state"`
	Country       string        `json:"country" db:"country"`
	BusinessEmail string        `json:"business_email" db:"business_email"`
}

// String is not required by pop and may be deleted
func (c Courier) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Couriers is not required by pop and may be deleted
type Couriers []Courier

// String is not required by pop and may be deleted
func (c Couriers) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (c *Courier) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: c.CompanyName, Name: "company Name", Message: "company name must be present"},
		&validators.EmailIsPresent{Field: c.BusinessEmail, Name: "BusinessEmail"},
		&validators.StringIsPresent{Field: c.Street, Name: "Street", Message: "Street can't be empty"},
		&validators.StringIsPresent{Field: c.City, Name: "City"},
		&validators.StringIsPresent{Field: c.State, Name: "State"},
		&validators.StringIsPresent{Field: c.Country, Name: "Country"},
	), err
}
