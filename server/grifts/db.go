package grifts

import (
	"math"
	"strconv"

	"github.com/bxcodec/faker/v3"
	"github.com/gobuffalo/pop"
	"github.com/gofrs/uuid"
	. "github.com/markbates/grift/grift"
	"github.com/pkg/errors"
	"github.com/tonymj76/inventory/server/models"
	"golang.org/x/crypto/bcrypt"
)

var _ = Namespace("db", func() {

	Desc("seed", "Seeds a database")
	Add("seed", func(c *Context) error {
		return models.DB.Transaction(func(tx *pop.Connection) error {
			err := tx.TruncateAll()
			if err != nil {
				return errors.WithStack(err)
			}

			c.Set("tx", tx)
			if err := Run("db:user", c); err != nil {
				return errors.WithStack(err)
			}
			if err := Run("db:admin", c); err != nil {
				return errors.WithStack(err)
			}
			if err := Run("db:merchant", c); err != nil {
				return errors.WithStack(err)
			}
			if err := Run("db:states", c); err != nil {
				return errors.WithStack(err)
			}
			if err := Run("db:category", c); err != nil {
				return errors.WithStack(err)
			}
			if err := Run("db:product", c); err != nil {
				return errors.WithStack(err)
			}
			if err := Run("db:courier", c); err != nil {
				return errors.WithStack(err)
			}

			return nil
		})
	})

	//Add user
	Desc("user", "seeding user")
	Add("user", func(c *Context) error {
		db := models.DB
		tx, ok := c.Value("tx").(*pop.Connection)
		if ok {
			db = tx
		}
		user := &models.User{
			FirstName:            faker.FirstName(),
			LastName:             faker.LastName(),
			UserName:             faker.Username(),
			Email:                "user@gmail.com",
			Password:             "password",
			PasswordConfirmation: "password",
		}
		ph, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return errors.WithStack(err)
		}
		user.PasswordHash = string(ph)
		if err := db.Create(user); err != nil {
			return errors.WithStack(err)
		}

		// uuidString := faker.UUIDHyphenated()
		// uuid, err := uuid.FromString(uuidString)
		// if err != nil {
		// 	log.Printf("failed to parse UUID %q: %v", uuidString, err)
		// }

		// seed state and city
		state := &models.State{
			Name: faker.Name(),
		}
		if err := db.Create(state); err != nil {
			return errors.WithStack(err)
		}
		city := &models.City{
			Name:    faker.Name(),
			StateID: state.ID,
		}
		if err := db.Create(city); err != nil {
			return errors.WithStack(err)
		}
		// seed user address
		address := &models.Address{
			FirstName:   faker.FirstName(),
			LastName:    faker.LastName(),
			HouseNumber: faker.DayOfMonth(),
			Street:      faker.Sentence(),
			City:        city.Name,
			State:       state.Name,
			Country:     faker.Word(),
			Phone:       faker.Phonenumber(),
			UserID:      user.ID,
		}
		if err := db.Create(address); err != nil {
			return errors.WithStack(err)
		}

		// seed user shipping address
		shippingAddress := &models.ShippingAddress{
			AddressID: address.ID,
			UserID:    user.ID,
		}
		if err := db.Create(shippingAddress); err != nil {
			return errors.WithStack(err)
		}
		return nil
	})
	//Add Admin
	Desc("admin", "seeding admin")
	Add("admin", func(c *Context) error {
		db := models.DB
		tx, ok := c.Value("tx").(*pop.Connection)
		if ok {
			db = tx
		}
		user := &models.User{
			FirstName:            faker.FirstName(),
			LastName:             faker.LastName(),
			UserName:             faker.Username(),
			Email:                "admin@gmail.com",
			Password:             "password",
			PasswordConfirmation: "password",
			IsAdmin:              true,
			IsMerchant:           true,
			IsCourier:            true,
		}
		ph, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return errors.WithStack(err)
		}
		user.PasswordHash = string(ph)
		if err := db.Create(user); err != nil {
			return errors.WithStack(err)
		}
		return nil
	})

	//Merchant
	Desc("merchant", "seeading merchant")
	Add("merchant", func(c *Context) error {
		db := models.DB
		tx, ok := c.Value("tx").(*pop.Connection)
		if ok {
			db = tx
		}
		// seed state and city
		state := &models.State{
			Name: faker.Name(),
		}
		if err := db.Create(state); err != nil {
			return errors.WithStack(err)
		}
		city := &models.City{
			Name:    faker.Name(),
			StateID: state.ID,
		}
		if err := db.Create(city); err != nil {
			return errors.WithStack(err)
		}

		user := &models.User{
			FirstName:            faker.FirstName(),
			LastName:             faker.LastName(),
			UserName:             faker.Username(),
			Email:                "merchant@gmail.com",
			Password:             "password",
			PasswordConfirmation: "password",
			IsMerchant:           true,
		}
		ph, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return errors.WithStack(err)
		}
		user.PasswordHash = string(ph)
		if err := db.Create(user); err != nil {
			return errors.WithStack(err)
		}
		if err := db.Reload(user); err != nil {
			return errors.WithStack(err)
		}
		merchant := &models.Merchant{
			UserID:        user.ID,
			BusinessName:  faker.CCType(),
			PhoneNumber:   faker.Phonenumber(),
			HouseNumber:   "W54 Busa-Soji",
			Street:        "St mary",
			City:          city.Name,
			State:         state.Name,
			Country:       "Nigeria",
			BusinessEmail: "build2day@gmail.com",
		}
		if err := db.Create(merchant); err != nil {
			return errors.WithStack(err)
		}
		if err := db.Reload(merchant); err != nil {
			return errors.WithStack(err)
		}
		c.Set("merchant", merchant)
		return nil
	})

	//states
	Desc("states", "seeding states and cities")
	Add("states", func(c *Context) error {
		db := models.DB
		tx, ok := c.Value("tx").(*pop.Connection)
		if ok {
			db = tx
		}
		state := &models.State{
			Name: "Cross River",
		}
		if err := db.Create(state); err != nil {
			return errors.WithStack(err)
		}

		// seed cities
		crsCities := [48]string{
			"Abi",
			"Akamkpa",
			"Akpabuyo",
			"Bakassi",
			"Bekwarra",
			"Biase",
			"Boki",
			"Calabar",
			"Calabar-Barracks Road",
			"Calabar-Federal Housing",
			"Calabar-MM Highway",
			"Calabar-Parliamentary",
			"Calabar-Parliamentary Extension",
			"Calabar-Satelite Town",
			"Calabar Municipal-4 Miles",
			"Calabar Municipal-Asari Eso",
			"Calabar Municipal-Atimbo",
			"Calabar Municipal-Diamond Hill",
			"Calabar Municipal-Ediba Road",
			"Calabar Municipal-Ekorinim",
			"Calabar Municipal-EPZ",
			"Calabar Municipal-Essien Town",
			"Calabar Municipal-Etta Agbor",
			"Calabar Municipal-Ikot Ansa",
			"Calabar Municipal-Ikot Ishie",
			"Calabar Municipal-Marian",
			"Calabar Municipal-Nassarawa",
			"Calabar Municipal-Tinapa",
			"Calabar South-Anantigha",
			"Calabar South-Crutech",
			"Calabar South-Ekpo Abasi",
			"Calabar South-Goldie",
			"Calabar South-Jebs",
			"Calabar South-Marina Resort",
			"Calabar South-Mary Slessor",
			"Calabar South-Mount Zion",
			"Calabar South-Unical",
			"Calabar South-White House",
			"Calabar-State Housing",
			"Etung",
			"Ikom",
			"Obanliku",
			"Obubra",
			"Obudu",
			"Odukpani",
			"Ogoja",
			"Yakuur",
			"Yala",
		}

		cities := models.Cities{}
		for _, c := range crsCities {
			city := &models.City{
				Name:    c,
				StateID: state.ID,
			}
			cities = append(cities, *city)
		}
		if err := db.Create(cities); err != nil {
			return errors.WithStack(err)
		}
		return nil
	})

	//category
	Desc("category", "seeding category")
	Add("category", func(c *Context) error {
		db := models.DB
		tx, ok := c.Value("tx").(*pop.Connection)
		if ok {
			db = tx
		}
		nigeria := &models.Category{
			Name: "Nigerian",
		}
		db.Save(nigeria)

		spanish := &models.Category{
			Name: "Spanish",
		}
		db.Save(spanish)
		chinese := &models.Category{
			Name: "Chinese",
		}
		db.Save(chinese)
		italian := &models.Category{
			Name: "Italian",
		}
		db.Save(italian)
		nigerianRice := &models.Category{
			ParentID: nigeria.ID,
			Name:     "Nigerian Rice",
		}
		db.Save(nigerianRice)
		nigerianSoup := &models.Category{
			ParentID: nigeria.ID,
			Name:     "Nigerian Soups",
		}
		db.Save(nigerianSoup)
		italianSoup := &models.Category{
			ParentID: italian.ID,
			Name:     "Italian Soups",
		}
		db.Save(italianSoup)
		chineseSoup := &models.Category{
			ParentID: chinese.ID,
			Name:     "Chinese Soups",
		}
		db.Save(chineseSoup)
		spanishSoup := &models.Category{
			ParentID: spanish.ID,
			Name:     "Spanish Soups",
		}
		db.Save(spanishSoup)

		// fashion := &models.Category{
		// 	Name: "Fashion",
		// }
		// db.Save(fashion)

		c.Set("nigeria_soup_category_id", nigerianSoup.ID)
		c.Set("nigeria_rice_category_id", nigerianRice.ID)
		c.Set("spanish_soup_category_id", spanishSoup.ID)
		c.Set("chinese_soup_category_id", chineseSoup.ID)
		c.Set("italian_soup_category_id", italianSoup.ID)
		return nil
	})

	//product
	Desc("product", "seeding product")
	Add("product", func(c *Context) error {
		cat := [25]string{"nigeria_soup_category_id", "nigeria_rice_category_id", "spanish_soup_category_id", "chinese_soup_category_id", "italian_soup_category_id",
			"nigeria_soup_category_id", "nigeria_rice_category_id", "spanish_soup_category_id", "chinese_soup_category_id", "italian_soup_category_id",
			"nigeria_soup_category_id", "nigeria_rice_category_id", "spanish_soup_category_id", "chinese_soup_category_id", "italian_soup_category_id",
			"nigeria_soup_category_id", "nigeria_rice_category_id", "spanish_soup_category_id", "chinese_soup_category_id", "italian_soup_category_id",
			"nigeria_soup_category_id", "nigeria_rice_category_id", "spanish_soup_category_id", "chinese_soup_category_id", "italian_soup_category_id"}
		tx := c.Value("tx").(*pop.Connection)
		m := c.Value("merchant").(*models.Merchant)
		products := models.Products{}
		mps := models.Merchantproducts{}

		for i := 0; i < 20; i++ {
			quantity, _ := strconv.ParseInt(faker.DayOfMonth(), 10, 64)
			price, _ := strconv.ParseFloat(faker.YearString(), 64)
			product := &models.Product{
				CategoryID:    c.Value(cat[i]).(uuid.UUID),
				MerchantID:    m.ID,
				Name:          faker.Word(),
				Description:   faker.Paragraph(),
				Quantity:      int(quantity),
				Price:         price,
				RefoundPolicy: faker.Sentence(),
			}
			products = append(products, *product)
		}

		if err := tx.Save(products); err != nil {
			return errors.WithStack(err)
		}
		for _, p := range products {
			mp := &models.Merchantproduct{
				ProductID:  p.ID,
				MerchantID: m.ID,
			}
			mps = append(mps, *mp)
		}
		if err := tx.Save(mps); err != nil {
			return errors.WithStack(err)
		}

		return nil
	})

	//Courier
	Desc("courier", "seeding courier")
	Add("courier", func(c *Context) error {
		users := models.Users{}

		tx, ok := c.Value("tx").(*pop.Connection)
		if !ok {
			return errors.WithStack(errors.New("Transection not found"))
		}

		for i := 0; i < 5; i++ {
			user := &models.User{
				FirstName:            faker.FirstName(),
				LastName:             faker.LastName(),
				UserName:             faker.Username(),
				Email:                faker.Email(),
				Password:             "password",
				PasswordConfirmation: "password",
				IsCourier:            true,
			}
			ph, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
			if err != nil {
				return errors.WithStack(err)
			}
			user.PasswordHash = string(ph)
			users = append(users, *user)
		}

		if err := tx.Save(users); err != nil {
			return errors.WithStack(err)
		}
		userss := models.Users{}
		for _, u := range users {
			us := &models.User{}
			if err := tx.Where("first_name = ?", u.FirstName).First(us); err != nil {
				return errors.WithStack(err)
			}
			userss = append(userss, *us)
		}
		couriers := models.Couriers{}
		for _, u := range userss {
			courier := &models.Courier{
				UserID:        u.ID,
				HouseNumber:   "W54 Busa-Soji",
				Street:        "St mary",
				City:          "Calabar",
				State:         "Cross River",
				Country:       "Nigeria",
				BusinessEmail: "build2day@gmail.com",
				CompanyName:   faker.Name(),
				PhoneNumber:   faker.Phonenumber(),
			}
			couriers = append(couriers, *courier)
		}
		if err := tx.Save(couriers); err != nil {
			return errors.WithStack(err)
		}
		dps := models.DeliveryPrices{}
		for _, c := range couriers {
			dp := &models.DeliveryPrice{
				CourierID:          c.ID,
				DefaultPrice:       math.Abs(faker.Latitude()),
				DefaultWeight:      math.Abs(faker.Latitude()),
				OrderDeliveryPrice: math.Abs(faker.Latitude()),
				OrderWeight:        math.Abs(faker.Latitude()),
			}
			dps = append(dps, *dp)
		}
		if err := tx.Save(dps); err != nil {
			return errors.WithStack(err)
		}
		return nil
	})
})
