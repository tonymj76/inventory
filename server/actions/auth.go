package actions

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/pop"
	"github.com/markbates/going/validate"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"github.com/tonymj76/inventory/server/models"
	"golang.org/x/crypto/bcrypt"
)

// AuthNew loads the signup page
func AuthNew(c buffalo.Context) error {
	c.Set("user", models.User{})
	return c.Render(200, r.JSON(map[string]string{"message": "Welcome to sign in page"}))
}

// AuthCreate attemts to log the user in with an existing account
func AuthCreate(c buffalo.Context) error {
	user := &models.User{}
	currentUser := &models.User{}
	if err := c.Bind(user); err != nil {
		return errors.WithStack(err)
	}

	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		return errors.WithStack(errors.New("No Transection found"))
	}

	// find a user with the email
	err := tx.Eager().Where("email = ?", strings.ToLower(user.Email)).Order("created_at desc").First(currentUser)

	// helper func to handle bad attemts
	bad := func() error {
		c.Set("currentUser", currentUser)
		verrs := validate.NewErrors()
		verrs.Add("email", "invalid email/password")
		return c.Render(433, r.JSON(verrs))
	}
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			// couldn't find an user with the supplied emaiil address
			return bad()
		}
		return errors.WithStack(err)
	}

	// confirm that the given password matches the hashed password from the db
	if err = bcrypt.CompareHashAndPassword([]byte(currentUser.PasswordHash), []byte(user.Password)); err != nil {
		return bad()
	}
	claims := struct {
		FirstName string `json:"first_name"`
		jwt.StandardClaims
	}{
		FirstName: currentUser.FirstName,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(oneWeek()).Unix(),
			Issuer:    fmt.Sprintf("%s.api.ocm-key.it", envy.Get("GO_ENV", "development")),
			Id:        currentUser.ID.String(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signingKey := []byte(envy.Get("JWT_SECRET", "secret"))
	// signingKey, err := ioutil.ReadFile(envy.Get("JWT_SECRET", "../ocm-key-ecdsa.key"))
	// if err != nil {
	// 	return fmt.Errorf("could not open jwt key, %v", err)
	// }
	tokenString, err := token.SignedString(signingKey)

	if err != nil {
		return fmt.Errorf("could not sign token, %v", err)
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{"token": tokenString, "current_user": currentUser}))
}

// AuthDestroy clears the session and logs a user out
func AuthDestroy(c buffalo.Context) error {
	c.Set("user", models.User{})
	return c.Render(http.StatusOK, r.JSON("successfully logout"))
}

func oneWeek() time.Duration {
	return 7 * 24 * time.Hour
}

// RestrictedHandlerMiddleWare searches and parses the jwt token in order to authenticate
// the request and populate the Context with the user container in the claims
func RestrictedHandlerMiddleWare(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		tokenStringWithBearer := c.Request().Header.Get("Authorization")
		tokenString := strings.Split(tokenStringWithBearer, " ")[1]

		if len(tokenString) < 1 {
			return c.Error(http.StatusUnauthorized, fmt.Errorf("No token set in headers"))
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			mySignedKey := []byte(envy.Get("JWT_SECRET", "secret"))
			// mySignedKey, err := ioutil.ReadFile(envy.Get("JWT_SECRET", "../ocm-key-ecdsa.key"))
			// if err != nil {
			// 	return nil, fmt.Errorf("Could not open jwt key, %v", err)
			// }
			return mySignedKey, nil
		})
		if err != nil {
			return c.Error(http.StatusUnauthorized, fmt.Errorf("Could not parse the token, %v", err))
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			log.Debugf("Claims: %v", claims)

			user, err := GetUserByID(claims["jti"].(string), c)
			if err != nil {
				return c.Error(http.StatusUnauthorized, fmt.Errorf("Could not find the user, %v", err))
			}
			c.Set("user", user)
		} else {
			return c.Error(http.StatusUnauthorized, fmt.Errorf("Failed to validate token: %v", claims))
		}
		return next(c)
	}
}
