package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

// City model struct
type City struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Name string `json:"name" db:"name"`
	StateID uuid.UUID `json:"state_id" db:"state_id"`
}

// String is not required by pop and may be deleted
func (c City) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Cities is not required by pop and may be deleted
type Cities []City

// String is not required by pop and may be deleted
func (c Cities) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (c *City) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.UUIDIsPresent{Field: c.StateID, Name: "StateID"},
		&validators.StringIsPresent{Field: c.Name, Name: "Name"},
	), err
}
