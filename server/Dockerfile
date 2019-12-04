FROM golang:latest

FROM gobuffalo/buffalo:latest as builder

ENV EP=/go/src/github.com/tonymj76/inventory
RUN mkdir -p ${EP}
WORKDIR ${EP}

ENV GO111MODULE=on


COPY . .
# RUN dep ensure
RUN go get $(go list ./... | grep -v /vendor/)
RUN go get ./...
# RUN buffalo build --static -o /bin/app
COPY . .

# FROM alpine
# RUN apk add --no-cache bash
# RUN apk add --no-cache ca-certificates
# WORKDIR /bin/

# COPY --from=builder /bin/app .

# # Uncomment to run the binary in "production" mode:
# # ENV GO_ENV=production

# Bind the app to 0.0.0.0 so it can be seen from outside the container
ENV ADDR=0.0.0.0

EXPOSE 3001

# Uncomment to run the migrations before running the binary:
# CMD /bin/app migrate; /bin/app/
# CMD exec /bin/app
CMD [ "bash" ]
