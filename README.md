# Samaa Music Streaming App API Documentation

Welcome to the documentation for the Samaa Music Streaming App API. This API provides various endpoints to manage users, songs, playlists, and authentication for the Samaa Music Streaming App.

## Postman API Documentation

For detailed documentation on how to use the Samaa Music Streaming App API, please visit the [Postman API Documentation](https://documenter.getpostman.com/view/33103855/2sA3BkcYVP).

## Getting Started

To get started with the API, please follow the instructions below:

1. **Sign Up**: If you are a new user, sign up using the `/api/users/` endpoint by providing your name, email, password, and gender in the request body.

2. **Login**: After signing up, login to your account using the `/api/login` endpoint by providing your email and password in the request body.

3. **Accessing Endpoints**: Once logged in, you will receive an authentication token (`x-auth-token`). Include this token in the headers of your requests to access authorized endpoints.

## Endpoints Overview

### User Routes

- **GET `/api/users/:id`**: Get user details by ID (authentication required).
- **PUT `/api/users/:id`**: Update user details by ID (authentication required).
- **GET `/api/users`**: Get all users (admin only).
- **POST `/api/users/`**: Sign up a new user.

### Song Routes

- **POST `/api/songs`**: Create a new song (admin only).
- **PUT `/api/songs/:id`**: Update a song by ID (admin only).
- **DELETE `/api/songs/:id`**: Delete a song by ID (admin only).
- **GET `/api/songs/like/:id`**: Get liked songs by user ID (authentication required).
- **PUT `/api/songs/like/:id`**: Like a song by ID (authentication required).
- **GET `/api/songs/like`**: Get all liked songs (authentication required).
- **GET `/api/songs`**: Get all songs.
- **GET `/api/songs/:id`**: Get song details by ID.

### Playlist Routes

- **POST `/api/playlists`**: Create a new playlist (authentication required).
- **PUT `/api/playlists/edit/:id`**: Update a playlist by ID (authentication required).
- **GET `/api/playlists/:id`**: Get playlist details by ID.
- **GET `/api/playlists/user-playlists`**: Get playlists created by users (authentication required).

### Other Routes

- **GET `/api/search/?search=:query`**: Search for songs or playlists (authentication required).
- **GET `/api/users/:id/verify/:token`**: Verify email for user registration.

## Authentication

Authentication for the API is done using JSON Web Tokens (JWT). Include the `x-auth-token` in the headers of your requests to access authorized endpoints. Tokens are obtained by signing up or logging in to the application.

## Error Handling

The API returns appropriate HTTP status codes along with error messages in JSON format to indicate the success or failure of a request.

## Contributing

We welcome contributions from the community to enhance and improve the Samaa Music Streaming App API. If you have any suggestions, feedback, or would like to report an issue, please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/manishraj27/samaa-backend/blob/main/LICENSE) file for details.

## Acknowledgements

We would like to acknowledge the contributions of all developers and contributors who have helped to build and maintain the Samaa Music Streaming App API.

Thank you for using the Samaa Music Streaming App API! Enjoy streaming your favorite music! 🎶🎧

## Frontend Repository

The frontend of the Samaa Music Streaming App is available on GitHub at [samaa-frontend](https://github.com/manishraj27/samaa-frontend). You can check it out to see how the API is integrated into the application.
