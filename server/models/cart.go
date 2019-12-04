package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

// Cart holdes the user cart items
type Cart struct {
	ID         uuid.UUID `json:"id" db:"id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
	UserID     uuid.UUID `json:"user_id" db:"user_id"`
	ProductID  uuid.UUID `json:"product_id" db:"product_id"`
	Status     string    `json:"status" db:"status"`
	Product    Product   `json:"product" belongs_to:"product" db:"-"`
	Quantity   int       `json:"quantity" db:"quantity"`
	TotalPrice float64   `json:"total_price" db:"total_price"`
}

// String is not required by pop and may be deleted
func (c Cart) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Carts is not required by pop and may be deleted
type Carts []Cart

// String is not required by pop and may be deleted
func (c Carts) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (c *Cart) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: c.Status, Name: "Status"},
		&validators.UUIDIsPresent{Field: c.UserID, Name: "UserID"},
		&validators.UUIDIsPresent{Field: c.ProductID, Name: "ProductID"},
	), err
}
