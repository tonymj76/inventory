package models

import (
	"encoding/json"
	"time"

	"github.com/gofrs/uuid"
)

// Merchantproduct many to many rel
type Merchantproduct struct {
	ID         uuid.UUID `json:"id" db:"id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
	MerchantID uuid.UUID `json:"merchant_id" db:"merchant_id"`
	ProductID  uuid.UUID `json:"product_id" db:"product_id"`
	Merchant   Merchant  `json:"merchant" belongs_to:"merchants" db:"-"`
	Product    Product   `json:"product" belongs_to:"products" db:"-"`
}

// String is not required by pop and may be deleted
func (m Merchantproduct) String() string {
	jm, _ := json.MarshalIndent(m, " ", "  ")
	return string(jm)
}

// Merchantproducts is not required by pop and may be deleted
type Merchantproducts []Merchantproduct

// String is not required by pop and may be deleted
func (m Merchantproducts) String() string {
	jm, _ := json.MarshalIndent(m, " ", "  ")
	return string(jm)
}
