package grifts

import (
	"github.com/gobuffalo/buffalo"
	"github.com/tonymj76/inventory/server/actions"
)

func init() {
	buffalo.Grifts(actions.App())
}
