package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

// OrderVerificationRequest makes a request to verify payment for an order
type OrderVerificationRequest struct {
	Reference string `json:"reference"`
	Order     Order  `json:"order"`
}

// OrderRequest makes a request to create an order
type OrderRequest struct {
	AddressID  uuid.UUID  `json:"address_id"`
	OrderItems OrderItems `json:"order_items"`
	CourierID  uuid.UUID  `json:"courier_id"`
	UserID     uuid.UUID  `json:"user_id"`
}

// Order has many orderitem of a particular user
type Order struct {
	ID                uuid.UUID       `json:"id" db:"id"`
	CreatedAt         time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time       `json:"updated_at" db:"updated_at"`
	UserID            uuid.UUID       `json:"user_id" db:"user_id"`
	CourierID         uuid.UUID       `json:"courier_id" db:"courier_id"`
	ShippingAddressID uuid.UUID       `json:"shipping_address_id" db:"shipping_detail_id"`
	ShippingAddress   ShippingAddress `json:"shipping_address" belongs_to:"shipping_address" db:"-"`

	OrderItems OrderItems `json:"order_items" has_many:"order_items" order_by:"created_at desc" fk_id:"order_id"`

	Quantity   int     `json:"quantity" db:"quantity"`
	TotalPrice float64 `json:"total_price" db:"total_price"`
	PaymentRef string  `json:"payment_reference" db:"payment_ref"`
	Status     string  `json:"status" db:"status"`
}

// String is not required by pop and may be deleted
func (o Order) String() string {
	jo, _ := json.MarshalIndent(o, " ", "  ")
	return string(jo)
}

// Orders is not required by pop and may be deleted
type Orders []Order

// String is not required by pop and may be deleted
func (o Orders) String() string {
	jo, _ := json.Marshal(o)
	return string(jo)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (o *Order) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.UUIDIsPresent{Field: o.UserID, Name: "UserID"},
		&validators.UUIDIsPresent{Field: o.CourierID, Name: "CourierID"},
		&validators.UUIDIsPresent{Field: o.ShippingAddressID, Name: "ShippingAddressID"},
		&validators.StringIsPresent{Field: o.Status, Name: "Status"},
	), err
}
