# User API Spec

## Register User

Endpoint : `POST` `/api/users`

Request Body:

```json
{
  "username": "JohnDoe",
  "password": "secret",
  "name": "John Doe"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "JohnDoe",
    "name": "John Doe"
  }
}
```

Response Body (Error):

```json
{
  "errors": "Username already exists"
}
```

## Login User

Endpoint : `POST` `/api/users/login`

Request Body:

```json
{
  "username": "JohnDoe",
  "password": "secret"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "JohnDoe",
    "name": "John Doe",
    "token": "token"
  }
}
```

Response Body (Error):

```json
{
  "errors": "Username already exists"
}
```

## Get User

Endpoint : `GET` `/api/users/current`

Request Header:

- Authorization: `token`

Response Body (Success):

```json
{
  "data": {
    "username": "JohnDoe",
    "name": "John Doe"
  }
}
```

Response Body (Error):

```json
{
  "errors": "Unauthorized"
}
```

## Update User

Endpoint : `PATCH` `/api/users/current`

Request Header:

- Authorization: `token`

Request Body:

```json
{
  "name": "John Doe Natio",
  "password": "newsecret"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "JohnDoe",
    "name": "John Doe updated"
  }
}
```

Response Body (Error):

```json
{
  "errors": "Invalid password"
}
```

## Logout User

Endpoint : `DELETE` `/api/users/logout`

Request Header:

- Authorization: `token`

Response Body (Success):

```json
{
  "data": true
}
```
