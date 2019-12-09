package models

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

//User holds all the info about who is using the app
type User struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`

	MerchantID uuid.UUID `json:"merchant_id" db:"merchant_id"`
	Courier    Courier   `json:"-" has_one:"courier" fk_id:"user_id"`
	Merchant   Merchant  `json:"-" has_one:"merchant" fk_id:"user_id"`

	FirstName            string `json:"first_name" db:"first_name"`
	LastName             string `json:"last_name" db:"last_name"`
	UserName             string `json:"user_name" db:"user_name"`
	Email                string `json:"email" db:"email"`
	PasswordHash         string `json:"-" db:"password_hash"`
	Password             string `json:"password" db:"-"`
	PasswordConfirmation string `json:"password_confirmation" db:"-"`
	IsMerchant           bool   `json:"is_merchant" db:"is_merchant"`
	IsCourier            bool   `json:"is_courier" db:"is_courier"`
	IsAdmin              bool   `json:"is_admin" db:"is_admin"`
}

// String is not required by pop and may be deleted
func (u User) String() string {
	ju, _ := json.MarshalIndent(u, " ", "   ")
	return string(ju)
}

// Create wraps up the pattern of encrypting the password and
// running validations. Useful when writing tests.
func (u *User) Create(tx *pop.Connection) (*validate.Errors, error) {
	u.Email = strings.ToLower(u.Email)
	ph, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return validate.NewErrors(), errors.WithStack(err)
	}
	u.PasswordHash = string(ph)
	return tx.ValidateAndCreate(u)
}

// Users is not required by pop and may be deleted
type Users []User

// String is not required by pop and may be deleted
func (u Users) String() string {
	ju, _ := json.Marshal(u)
	return string(ju)
}

// Validate gets run every time you call a "pop.Validate" method.
func (u *User) Validate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.EmailIsPresent{Field: u.Email, Name: "Email"},
		&validators.StringIsPresent{Field: u.FirstName, Name: "FirstName", Message: "First name can't be empty"},
		&validators.StringIsPresent{Field: u.LastName, Name: "LastName", Message: "Last name can't be empty"},
		// check to see if the email address is already taken:
		&validators.FuncValidator{
			Field:   u.Email,
			Name:    "Email",
			Message: "%s is already taken",
			Fn: func() bool {
				var b bool
				q := tx.Where("email = ?", u.Email)
				if u.ID != uuid.Nil {
					q = q.Where("id != ?", u.ID)
				}
				b, err = q.Exists(u)
				if err != nil {
					return false
				}
				return !b
			},
		},
	), err
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
func (u *User) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	var err error
	return validate.Validate(
		&validators.StringIsPresent{Field: u.Password, Name: "Password"},
		&validators.StringsMatch{Name: "Password", Field: u.Password, Field2: u.PasswordConfirmation, Message: "Password does not match confirmation"},
	), err
}
