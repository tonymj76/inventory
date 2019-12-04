package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

//Category of product
type Category struct {
	ID        uuid.UUID `json:"id" db:"id"`
	ParentID  uuid.UUID `json:"parent_id" db:"parent_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Name      string    `json:"name" db:"name"`

	Products Products `has_many:"products"`
}

// String is not required by pop and may be deleted
func (c Category) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Categories is not required by pop and may be deleted
type Categories []Category

// String is not required by pop and may be deleted
func (c Categories) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (c *Category) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: c.Name, Name: "Name"},
		&validators.FuncValidator{
			Field:   c.Name,
			Name:    "Name",
			Message: "%s is already taken",
			Fn: func() bool {
				var b bool
				q := tx.Where("name = ?", c.Name)
				if c.ID != uuid.Nil {
					q = q.Where("id != ?", c.ID)
				}
				b, err = q.Exists(c)
				if err != nil {
					return false
				}
				return !b
			},
		},
	), err
}
