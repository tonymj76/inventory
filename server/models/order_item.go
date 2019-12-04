package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

// OrderItem specifies the details of a particular order item / product
type OrderItem struct {
	ID         uuid.UUID `json:"id" db:"id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
	UserID     uuid.UUID `json:"user_id" db:"user_id"`
	MerchantID uuid.UUID `json:"merchant_id" db:"merchant_id"`
	ProductID  uuid.UUID `json:"product_id" db:"product_id"`
	OrderID    uuid.UUID `json:"order_id" db:"order_id"`

	Order   Order   `json:"-" belongs_to:"order"`
	Product Product `json:"-" has_one:"product" fk_id:"order_item_id"`

	Quantity      int     `json:"quantity" db:"quantity"`
	TotalPrice    float64 `json:"total_price" db:"total_price"`
	DeliveryState string  `json:"delivery_state" db:"delivery_state"`
	Status        string  `json:"status" db:"status"`
}

// String is not required by pop and may be deleted
func (o OrderItem) String() string {
	jo, _ := json.MarshalIndent(o, " ", "  ")
	return string(jo)
}

// OrderItems is not required by pop and may be deleted
type OrderItems []OrderItem

// String is not required by pop and may be deleted
func (o OrderItems) String() string {
	jo, _ := json.MarshalIndent(o, " ", "  ")
	return string(jo)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (o *OrderItem) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: o.DeliveryState, Name: "DeliveryState"},
		&validators.StringIsPresent{Field: o.Status, Name: "Status"},
		&validators.IntIsPresent{Field: o.Quantity, Name: "Quantity"},
		&validators.UUIDIsPresent{Field: o.UserID, Name: "UserID"},
		&validators.UUIDIsPresent{Field: o.MerchantID, Name: "MerchantID"},
		&validators.UUIDIsPresent{Field: o.ProductID, Name: "ProductID"},
		&validators.UUIDIsPresent{Field: o.OrderID, Name: "OrderID"},
	), err
}
