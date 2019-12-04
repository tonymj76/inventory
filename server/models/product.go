package models

import (
	"encoding/json"
	"time"

	"crypto/rand"
	"encoding/hex"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
	"github.com/gosimple/slug"
)

// Product contains all the item as service the merchant offer
type Product struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`

	CategoryID  uuid.UUID `json:"category_id" db:"category_id"`
	ParentID    uuid.UUID `json:"parent_id,omitempty" db:"parent_id"`
	MerchantID  uuid.UUID `json:"merchant_id,omitempty" db:"merchant_id"`
	CartID      uuid.UUID `json:"cart_id,omitempty" db:"cart_id"`
	OrderItemID uuid.UUID `json:"order_item_id,omitempty" db:"order_item_id"`
	Images      Images    `json:"images" has_many:"images" order_by:"created_at desc"`
	Category    Category  `json:"category" belongs_to:"category"`
	Merchant    Merchant  `json:"merchant" belongs_to:"merchant"`

	Name          string  `json:"name" db:"name"`
	Description   string  `json:"description" db:"description"`
	Quantity      int     `json:"quantity" db:"quantity"`
	Weight        int     `json:"weight" db:"weight"`
	Price         float64 `json:"price" db:"price"`
	Active        bool    `json:"active" db:"active"`
	RefoundPolicy string  `json:"refound_policy,omitempty" db:"refound_policy"`
	Tag           string  `json:"tag,omitempty" db:"tag"`
	Slug          string  `json:"slug,omitempty" db:"slug"`
}

// String is not required by pop and may be deleted
func (p Product) String() string {
	jp, _ := json.MarshalIndent(p, " ", "  ")
	return string(jp)
}

// Products is not required by pop and may be deleted
type Products []Product

// String is not required by pop and may be deleted
func (p Products) String() string {
	jp, _ := json.MarshalIndent(p, " ", " ")
	return string(jp)
}

// BeforeCreate adds slugs field before it creates it
func (p *Product) BeforeCreate(tx *pop.Connection) error {
	slug.CustomSub = map[string]string{
		"id": GenRanStr(),
	}
	p.Slug = slug.Make(p.Name + " id")
	return nil
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (p *Product) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: p.Name, Name: "Name"},
		&validators.StringIsPresent{Field: p.Description, Name: "Description"},
	), err
}

// GenRanStr is use in product slug field
func GenRanStr() string {
	buffer := make([]byte, 5)
	rand.Read(buffer)
	return hex.EncodeToString(buffer)
}
