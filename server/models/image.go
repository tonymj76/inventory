package models

import (
	"encoding/json"
	"time"

	"github.com/gofrs/uuid"
)

// Image for products
type Image struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Product   Product   `json:"-" db:"-" belongs_to:"product"`
	ProductID uuid.UUID `json:"product_id" db:"product_id" form:"product_id"`
	URL       string    `json:"url" db:"url"`
	// ProductImage binding.File `json:"product_image" db:"-" form:"product_image"`
}

// String is not required by pop and may be deleted
func (i Image) String() string {
	ji, _ := json.Marshal(i)
	return string(ji)
}

// Images is not required by pop and may be deleted
type Images []Image

// String is not required by pop and may be deleted
func (i Images) String() string {
	ji, _ := json.Marshal(i)
	return string(ji)
}

// // BeforeCreate save the image to path
// func (i *Image) BeforeCreate(tx *pop.Connection) error {
// 	if !i.ProductImage.Valid() {
// 		return nil
// 	}
// 	dir := filepath.Join(".", fmt.Sprintf("/uploads/%s", i.ProductID.String()))
// 	if err := os.MkdirAll(dir, 0755); err != nil {
// 		return errors.WithStack(err)
// 	}
// 	f, err := os.Create(filepath.Join(dir, i.ProductImage.Filename))
// 	i.URL = filepath.Join(dir, i.ProductImage.Filename)
// 	if err != nil {
// 		return errors.WithStack(err)
// 	}
// 	defer f.Close()
// 	_, err = io.Copy(f, i.ProductImage)
// 	return err
// }

// func (i *Image) BeforeCreate(tx *pop.Connection) error {

// }
