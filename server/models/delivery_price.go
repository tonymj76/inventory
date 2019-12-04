package models

import (
	"encoding/json"
	"time"

	"github.com/gofrs/uuid"
)

// DeliveryPrice for the couriers
type DeliveryPrice struct {
	ID                 uuid.UUID `json:"id" db:"id"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time `json:"updated_at" db:"updated_at"`
	DefaultPrice       float64   `json:"default_price" db:"default_price"`
	DefaultWeight      float64   `json:"default_weight" db:"default_weight"`
	OrderDeliveryPrice float64   `json:"order_delivery_price" db:"order_delivery_price"`
	OrderWeight        float64   `json:"order_weight" db:"order_weight"`
	CourierID          uuid.UUID `json:"courier_id" db:"courier_id"`
}

// String is not required by pop and may be deleted
func (d DeliveryPrice) String() string {
	jd, _ := json.Marshal(d)
	return string(jd)
}

// DeliveryPrices is not required by pop and may be deleted
type DeliveryPrices []DeliveryPrice

// String is not required by pop and may be deleted
func (d DeliveryPrices) String() string {
	jd, _ := json.Marshal(d)
	return string(jd)
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
// func (d *DeliveryPrice) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
// 	var err error
// 	return validate.Validate(
// 		&validators.FuncValidator{
// 			Field:   d.DefaultPrice,
// 			Name:    "Default Price",
// 			Message: "%s can not be empty",
// 			Fn: func() bool {
// 				if d.OrderDeliveryPrice < 1.0 {
// 					return false
// 				}
// 				return true
// 			},
// 		},
// 	), err
// }
