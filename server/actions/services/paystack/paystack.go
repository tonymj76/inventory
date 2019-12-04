package paystack

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gobuffalo/envy"
)

// VerifyPayment uses a reference code from Paystack to verify payment for an order
func VerifyPayment(reference string) (map[string]interface{}, error) {
	client := &http.Client{}
	secretKey, err := envy.MustGet("PAYSTACK_TEST_SECRET_KEY")
	if err != nil {
		log.Printf("Paystack key not found: %v", err)
	}
	req, err := http.NewRequest("GET", "https://api.paystack.co/transaction/verify/"+reference, nil)
	req.Header.Add("Authorization", "Bearer "+secretKey)
	rr, err := client.Do(req)
	if err != nil {
		log.Println(err)
		data := map[string]interface{}{
			"error": "Failed to make request",
		}
		return data, err
	}
	defer rr.Body.Close()
	// Check the response body if it is what we expect.
	responseBody, err := ioutil.ReadAll(rr.Body)
	if err != nil {
		log.Println(err)
		data := map[string]interface{}{
			"error": "Cannot read response body",
		}
		return data, err
	}
	data := make(map[string]interface{})
	json.Unmarshal(responseBody, &data)
	log.Println(data["status"])
	log.Println(data["message"])
	return data, nil
}
