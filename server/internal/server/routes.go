package server

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func (s *Server) RegisterRoutes() http.Handler {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", s.HelloHandler)

	e.GET("/health", s.healthHandler)

	// Auth0 OAuth Routes
	e.GET("/auth/login", s.authLoginHandler)
	e.GET("/auth/callback", s.authCallbackHandler)

	// Add a protected endpoint
	e.GET("/api/data", s.protectedDataHandler)

	return e
}

func (s *Server) HelloHandler(c echo.Context) error {
	resp := map[string]string{
		"message": "Hello from Postwork!",
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

func (s *Server) protectedDataHandler(c echo.Context) error {
	// Get the Authorization header
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Authorization header is required"})
	}

	// Extract the token from the header
	token := strings.TrimPrefix(authHeader, "Bearer ")
	if token == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token format"})
	}

	// Validate the token (this is a placeholder; you should use Auth0's token validation in production)
	// For now, we'll just check if the token is not empty.
	if token == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token"})
	}

	// Return some data
	data := map[string]string{
		"message": "This is protected data!",
		"user":    "Authenticated user", // You can decode the token to get user info
	}
	return c.JSON(http.StatusOK, data)
}
