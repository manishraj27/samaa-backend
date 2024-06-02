# Samaa Music Streaming App API - Learn.md

## Introduction
Welcome to the Samaa Music Streaming App API Learn.md guide! This guide provides step-by-step instructions on how to utilize the Samaa Music Streaming App API to manage users, songs, playlists, and authentication.

## Table of Contents
1. [Signing Up](#1-signing-up)
2. [Logging In](#2-logging-in)
3. [Accessing Endpoints](#3-accessing-endpoints)
4. [Authentication](#4-authentication)
5. [Error Handling](#5-error-handling)

## 1. Signing Up
To sign up as a new user, follow these steps:
- Send a POST request to `/api/users/` endpoint.
- Provide your name, email, password, and gender in the request body.
- Upon successful registration, you will receive a confirmation message.

## 2. Logging In
After signing up, follow these steps to log in:
- Send a POST request to `/api/login` endpoint.
- Provide your email and password in the request body.
- Upon successful authentication, you will receive an authentication token (`x-auth-token`).

## 3. Accessing Endpoints
Once logged in, include the authentication token (`x-auth-token`) in the headers of your requests to access authorized endpoints.

### User Routes
- **GET /api/users/:id:** Get user details by ID (authentication required).
- **PUT /api/users/:id:** Update user details by ID (authentication required).
- **GET /api/users:** Get all users (admin only).
- **POST /api/users/:** Sign up a new user.

### Song Routes
- **POST /api/songs:** Create a new song (admin only).
- **PUT /api/songs/:id:** Update a song by ID (admin only).
- **DELETE /api/songs/:id:** Delete a song by ID (admin only).
- **GET /api/songs/like/:id:** Get liked songs by user ID (authentication required).
- **PUT /api/songs/like/:id:** Like a song by ID (authentication required).
- **GET /api/songs/like:** Get all liked songs (authentication required).
- **GET /api/songs:** Get all songs.
- **GET /api/songs/:id:** Get song details by ID.

### Playlist Routes
- **POST /api/playlists:** Create a new playlist (authentication required).
- **PUT /api/playlists/edit/:id:** Update a playlist by ID (authentication required).
- **GET /api/playlists/:id:** Get playlist details by ID.
- **GET /api/playlists/user-playlists:** Get playlists created by users (authentication required).

### Other Routes
- **GET /api/search/?search=:query:** Search for songs or playlists (authentication required).
- **GET /api/users/:id/verify/:token:** Verify email for user registration.

## 4. Authentication
Authentication for the API is done using JSON Web Tokens (JWT). Include the `x-auth-token` in the headers of your requests to access authorized endpoints. Tokens are obtained by signing up or logging in to the application.

## 5. Error Handling
The API returns appropriate HTTP status codes along with error messages in JSON format to indicate the success or failure of a request.

## Conclusion
Congratulations! You've learned how to interact with the Samaa Music Streaming App API. Start exploring and enjoy streaming your favorite music! 🎶🎧
