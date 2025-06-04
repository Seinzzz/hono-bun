# User API Spec

## Register User

Endpoint : `POST` `/api/users`

Request Body:

```json
{
  "username": "johndoe",
  "password": "secret",
  "name": "john doe"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "johndoe",
    "name": "john doe"
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
  "username": "johndoe",
  "password": "secret"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "johndoe",
    "name": "john doe",
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
    "username": "johndoe",
    "name": "john doe"
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
  "name": "john doe natio",
  "password": "newsecret"
}
```

Response Body (Success):

```json
{
  "data": {
    "username": "johndoe",
    "name": "john doe natio"
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
