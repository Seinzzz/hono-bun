# Address API Spec

## Create Address

Endpoint : `POST` `/api/contacts/{contactId}/addresses`

Request Header:

- Authorization : `token`

Request Body:

```json
{
  "street": "123 Main St",
  "city": "Solo",
  "province": "Central Java",
  "country": "Indonesia",
  "postal_code": "12345"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "street": "123 Main St",
    "city": "Solo",
    "province": "Central Java",
    "country": "Indonesia",
    "postal_code": "12345"
  }
}
```

## Get Address

Endpoint : `GET` `/api/contacts/{contactId}/addresses/{id}`

Request Header:

- Authorization : `token`

Response Body :

```json
{
  "data": {
    "id": 1,
    "street": "123 Main St",
    "city": "Solo",
    "province": "Central Java",
    "country": "Indonesia",
    "postal_code": "12345"
  }
}
```

## Update Address

Endpoint : `PUT` `/api/contacts/{contactId}/addresses/{id}`

Request Header:

- Authorization : `token`

Request Body:

```json
{
  "street": "123 Main St",
  "city": "Solo",
  "province": "Central Java",
  "country": "Indonesia",
  "postal_code": "12345"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "street": "123 Main St",
    "city": "Solo",
    "province": "Central Java",
    "country": "Indonesia",
    "postal_code": "12345"
  }
}
```

## Delete Address

Endpoint : `DELETE` `/api/contacts/{contactId}/addresses/{id}`

Request Header:

- Authorization : `token`

Response Body :

```json
{
  "data": true
}
```

## List Addresses

Endpoint : `GET` `/api/contacts/{id}/addresses`

Request Header:

- Authorization : `token`

Response Body :

```json
{
  "data": [
    {
      "id": 1,
      "street": "123 Main St",
      "city": "Solo",
      "province": "Central Java",
      "country": "Indonesia",
      "postal_code": "12345"
    },
    {
      "id": 2,
      "street": "456 Elm St",
      "city": "Jakarta",
      "province": "DKI Jakarta",
      "country": "Indonesia",
      "postal_code": "67890"
    }
  ]
}
```
