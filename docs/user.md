# User API Spec

## Register User

Endpoint: POST `/api/users`

Request Body:

```json
{
  "username": "dann",
  "password": "secret",
  "name": "dann"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "dann",
    "name": "dann"
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

Endpoint: POST `/api/users/login`

Request Body:

```json
{
  "username": "dann",
  "password": "secret"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "dann",
    "name": "dann",
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

## Update User

## Get User

## Logout User
