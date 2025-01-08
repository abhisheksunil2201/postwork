package server

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func (s *Server) RegisterRoutes() http.Handler {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", s.HelloWorldHandler)

	e.GET("/health", s.healthHandler)

	return e
}

func (s *Server) HelloWorldHandler(c echo.Context) error {
	resp := map[string]string{
		"message": "Hello World",
	}

	return c.JSON(http.StatusOK, resp)
}

func (s *Server) healthHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, s.db.Health())
}

func (s *Server) authLoginHandler(c echo.Context) error {
	// Redirect to Auth0 login page
	authURL := s.oauthConfig.AuthCodeURL("random-state")
	return c.Redirect(http.StatusTemporaryRedirect, authURL)
}

func (s *Server) authCallbackHandler(c echo.Context) error {
	// Verify state (for security)
	state := c.QueryParam("state")
	if state != "random-state" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid state"})
	}

	// Exchange code for token
	code := c.QueryParam("code")
	token, err := s.oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to exchange token"})
	}

	// Fetch user info from Auth0
	client := s.oauthConfig.Client(context.Background(), token)
	resp, err := client.Get(fmt.Sprintf("https://%s/userinfo", os.Getenv("AUTH0_DOMAIN")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to fetch user info"})
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to decode user info"})
	}

	// Return user info as JSON
	return c.JSON(http.StatusOK, userInfo)
}
