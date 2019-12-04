package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

// State model struct
type State struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Name string `json:"name" db:"name"`
	Cities Cities `json:"cities" has_many:"cities"`
}

// String is not required by pop and may be deleted
func (s State) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}

// States is not required by pop and may be deleted
type States []State

// String is not required by pop and may be deleted
func (s States) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (s *State) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: s.Name, Name: "Name"},
	), err
}
