# Contact API Spec

## Create Contact

Endpoint: `POST` `/api/contacts`

Request Header:

- Authorization : `token`

Request Body:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "08123456789"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@email.com",
    "phone": "08123456789"
  }
}
```

## Get Contact

Endpoint: `GET` `/api/contacts/{id}`

Request Header:

- Authorization : `token`

Response Body (Success):

```json
{
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@email.com",
    "phone": "08123456789"
  }
}
```

## Update Contact

Endpoint: `PUT` `/api/contacts/{id}`

Request Header:

- Authorization : `token`

Request Body:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "johndoe@email.com",
  "phone": "08123456789"
}
```

Response Body (Success):

```json
{
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@email.com",
    "phone": "08123456789"
  }
}
```

## Delete Contact

Endpoint: `DELETE` `/api/contacts/{id}`

Request Header:

- Authorization : `token`

Response Body (Success):

```json
{
  "data": true
}
```

## Search Contact

Endpoint: `GET` `/api/contacts`

Request Header:

- Authorization : `token`

Query Parameters:

- name : `string`
- email : `string`
- phone : `string`
- page : `number` || default `1`
- size : `number` || default `10`

Response Body (Success):

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "johndoe@email.com",
      "phone": "08123456789"
    },
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "janedoe@email.com",
      "phone": "08123456780"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```
