package models

import (
	"encoding/json"
	"github.com/gofrs/uuid"
	"time"
)

// Useraddress holder user addresses
type Useraddress struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UserID    uuid.UUID `json:"user_id,omitempty" db:"user_id"`
	AddressID uuid.UUID `json:"address_id,omitempty" db:"address_id"`
}

// String is not required by pop and may be deleted
func (u Useraddress) String() string {
	ju, _ := json.Marshal(u)
	return string(ju)
}

// Useraddresses is not required by pop and may be deleted
type Useraddresses []Useraddress

// String is not required by pop and may be deleted
func (u Useraddresses) String() string {
	ju, _ := json.Marshal(u)
	return string(ju)
}
