# One City Mart!

Instruction on how  to set up one city mart for development

## Server Side

### Get Dependencies

 - [Go](https://golang.org/dl/) programming language
 - [buffalo](https://gobuffalo.io/en/docs/getting-started/installation) go web flamework

Clone the repo make sure you cd into /server folder before you start the server with the command below

```bash
  go get -u ./...
```

## Database Setup

one city mart is using **mysql**. To create the database for test, development and production

```bash
  buffalo db create -a
```

**Run migration**

```bash
  buffalo pop migrate -a
```

**Reset db**

```bash
  buffalo pop reset -a
```

**Seeding db**

```bash
  buffalo task db:seed
```

## Starting the Server

connect to the server

```bash
 buffalo dev
```

If you point your browser to [http://127.0.0.1:3001](http://127.0.0.1:3001) you should see a "Welcome to one city mart!" page.


## Client Side (Frontend)

Clone the repo make sure you cd into /client folder 

install packages
```bash
  yarn install
```

make sure to skip Semantic UI installation
then start the server with the command below
```bash
  yarn app:dev
```

The app should now be running on [http://127.0.0.1:5500](http://127.0.0.1:5500)