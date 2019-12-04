package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	forcessl "github.com/gobuffalo/mw-forcessl"
	paramlogger "github.com/gobuffalo/mw-paramlogger"
	"github.com/unrolled/secure"

	"github.com/gobuffalo/buffalo-pop/pop/popmw"
	contenttype "github.com/gobuffalo/mw-contenttype"
	"github.com/gobuffalo/x/sessions"
	"github.com/rs/cors"
	. "github.com/tonymj76/inventory/server/actions/middlewares"
	"github.com/tonymj76/inventory/server/models"
)

// ENV is used to help switch settings based on where the
// application is being run. Default is "development".
var ENV = envy.Get("GO_ENV", "development")
var app *buffalo.App

var corsPreware = cors.New(cors.Options{
	AllowedOrigins: []string{"http://0.0.0.0:5500"},
	AllowedMethods: []string{"POST", "GET", "OPTIONS", "DELETE", "PUT"},
	AllowOriginFunc: func(origin string) bool {
		return true
	},
	AllowedHeaders:   []string{"Authorization", "Content-Type"},
	AllowCredentials: true,
})

// App is where all routes and middleware for buffalo
// should be defined. This is the nerve center of your
// application.
//
// Routing, middleware, groups, etc... are declared TOP -> DOWN.
// This means if you add a middleware to `app` *after* declaring a
// group, that group will NOT have that new middleware. The same
// is true of resource declarations as well.
//
// It also means that routes are checked in the order they are declared.
// `ServeFiles` is a CATCH-ALL route, so it should always be
// placed last in the route declarations, as it will prevent routes
// declared after it to never be called.
func App() *buffalo.App {
	if app == nil {
		app = buffalo.New(buffalo.Options{
			Env:          ENV,
			SessionStore: sessions.Null{},
			PreWares:     []buffalo.PreWare{corsPreware.Handler},
			SessionName:  "_one_city_mart_session",
		})

		// Automatically redirect to SSL
		app.Use(forceSSL())

		// Log request parameters (filters apply).
		if ENV == "development" {
			app.Use(paramlogger.ParameterLogger)
		}

		// Set the request content type to JSON
		app.Use(contenttype.Set("application/json"))

		// Wraps each request in a transaction.
		//  c.Value("tx").(*pop.Connection)
		// Remove to disable this.
		app.Use(popmw.Transaction(models.DB))

		app.GET("/", HomeHandler)

		// the api route
		api := app.Group("/api/v1")
		apiImage := app.Group("/api/v1")
		apiImage.Use(contenttype.Set("multipart/form-data"))
		api.Use(RestrictedHandlerMiddleWare)

		// since am using resouce with interfaces with CRUD function
		api.GET("/login", AuthNew)
		api.POST("/login", AuthCreate)
		api.DELETE("/signout", AuthDestroy)

		api.GET("/categories", CategoriesList)
		api.GET("/categories/products", CategoriesListWithProducts)
		api.POST("/category", CategoriesCreate)
		api.PUT("/category/{category_id}", CategoriesUpdate)
		api.GET("/category/{category_id}", CategoriesShow)
		api.DELETE("/category/{category_id}", CategoriesDestroy)
		api.POST("/order", OrderCreate)
		api.GET("/order", OrderList)
		api.GET("/order/user", GetCustomerOrders)
		api.POST("/order/verify_payment", OrderVerifyPaymentAndUpdate)
		api.GET("/order/{user_id}", GetMerchantOrders)
		api.DELETE("/order/{order_id}", OrderDestroy)
		api.GET("/display_products", ListMerchantsAndProductsBaseOnLocation)
		api.GET("/query", Search)
		api.GET("/filter", FilterProductsByPriceRange)
		api.GET("/merchants/location", GetMerchantsByLocation) // GET /merchants?state=?&city=?
		api.POST("/merchant/form", CreateForm)
		api.POST("/courier/form", CreateCourierForm)
		api.GET("/merchant/view", ViewOrderDetails)
		api.GET("/courier/view", ViewOrderDetailsCourier)
		api.PUT("/merchant/order_item/{order_item_id}", UpdateOrderItemToProcessed)
		api.GET("/courier/order/{user_id}", GetCourierOrders)
		apiImage.POST("/images", CreateProductImage)
		api.GET("/images", GetProductImage)

		users := UsersResource{&buffalo.BaseResource{}}
		uw := api.Resource("/users", users)
		uw.Middleware.Skip(RestrictedHandlerMiddleWare,
			users.Create,
		)

		api.Middleware.Skip(RestrictedHandlerMiddleWare,
			AuthNew,
			AuthCreate,
			AuthDestroy,
			CategoriesListWithProducts,
			CategoriesList,
			CategoriesShow,
			ListMerchantsAndProductsBaseOnLocation,
			Search,
			FilterProductsByPriceRange,
			CreateForm,
			CreateCourierForm,
			GetMerchantsByLocation,
		)

		addressAPI := api.Group("/addresses")
		addressAPI.Resource("/", AddressesResource{&buffalo.BaseResource{}})

		couriers := CouriersResource{&buffalo.BaseResource{}}
		courierAPI := api.Group("/couriers")
		courierAPI.Use(IsCourier)
		cw := courierAPI.Resource("/", couriers)
		cw.Middleware.Skip(IsCourier, couriers.Create, couriers.List)
		cw.Middleware.Skip(RestrictedHandlerMiddleWare, couriers.List)

		merchants := MerchantsResource{&buffalo.BaseResource{}}
		mercantAPI := api.Group("/merchants")
		mercantAPI.Use(IsMerchant)
		mw := mercantAPI.Resource("/", merchants)
		mw.Middleware.Skip(IsMerchant, merchants.Create, CreateForm, GetMerchantsByLocation)

		products := ProductsResource{&buffalo.BaseResource{}}
		productAPI := api.Group("/product")
		productAPI.Use(IsMerchant)
		pw := productAPI.Resource("/", products)
		pw.Middleware.Skip(IsMerchant, products.List, products.Show)
		pw.Middleware.Skip(RestrictedHandlerMiddleWare, products.List, products.Show)

		statesResource := StatesResource{&buffalo.BaseResource{}}
		stateGroup := api.Group("/states")
		stateAPI := stateGroup.Resource("/", statesResource)
		stateAPI.Middleware.Skip(RestrictedHandlerMiddleWare, statesResource.List, statesResource.Show)

		cart := api.Group("/carts")
		cart.Resource("/", CartsResource{&buffalo.BaseResource{}})
	}
	return app
}

// forceSSL will return a middleware that will redirect an incoming request
// if it is not HTTPS. "http://example.com" => "https://example.com".
// This middleware does **not** enable SSL. for your application. To do that
// we recommend using a proxy: https://gobuffalo.io/en/docs/proxy
// for more information: https://github.com/unrolled/secure/
func forceSSL() buffalo.MiddlewareFunc {
	return forcessl.Middleware(secure.Options{
		SSLRedirect:     ENV == "production",
		SSLProxyHeaders: map[string]string{"X-Forwarded-Proto": "https"},
	})
}
