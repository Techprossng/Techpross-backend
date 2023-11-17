# API DOCUMENTATION FOR TechProsNaija Backend endpoints

Welcome to the API documentation for the routes/endpoints in the backend for TechProsNaija. This documentation has been prepared to help the engineers/developers working on the client-side to know the required parameters for sending requests and the expected responses.

## Content
- [Note](#note)
- [Sections](#sections)

### Note
- Endpoints are split into sections i.e `User`, `Course` e.t.c.
- Status codes are sent in the response object. They are not part of the JSON data, but they can accessed with the `response.statusCode` property.
- If there is an error in the response, the JSON data sent to the client will only contain the `error` property and will be of this format:
```js
{ error: 'error description' }
```
- Non-error responses will contain a `message` property, and will be of this format:
```js
{ message: 'message description', ...rest }
```
- If the request supports pagination, a page query parameter will be appended as part of the API endpoint. For example, consider an api `GET /api/v1/users` that fetches all the users data in `GET` request; if the request sent does not contain a `page` query parameter, a default value of `1` will be given to the `page`. Number values can be put in place to specify the page you want to fetch:

`GET /api/v1/users?page=4` -  **Only number values are allowed.**


## Sections
- [User](#user)
    - [Create a user](#create-a-user)
- [Subscriber](#subscriber)
    - [Add a subscriber](#add-a-subscriber)
    - [Get a subscriber](#get-a-subscriber)
    - [Delete a subscriber](#delete-a-subscriber)
    - [Get all subscribers](#get-all-subscribers)
- [Contact](#contact)
    - [Add a contact](#add-a-contact)
    - [Get a contact](#get-a-contact)
    - [Delete a contact](#delete-a-contact)
    - [Get all contacts](#get-all-contacts)

## User

### Create a user
- `POST /api/v1/auth/users/signUp`

Required `body` properties in `application/json` format:
- `firstName`: `string`
- `lastName`: `string`
- `email`: `string`
- `password`: `string`

If the body is not in `application/json` format - status code: `400`
```js
{ error: 'Not a JSON' }
```

Any missing parameter returns - status code: `400`
```js
{ error: 'Missing <parameter_name>' }
```

if `firstName` is missing - status code: `400`
```js
{ error: 'Missing first name' }
```

On successful user registration - status code: `201`
```js
{ 
    message: 'Registration successful',
    userId,
    firstName,
    lastName,
    email 
}
```

## Subscriber

### Add a subscriber
- `POST /api/v1/subscribers`

Required `body` properties in `application/json` format:
- `email`: `string`

Missing parameter returns - status code: `400`
```js
{ error: 'Missing email' }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid email' }
```
If email already exists - status code: `400`
```js
{ error: 'Email already exists' }
```
Successful response - status code - `200`
```js
{ 
    message: "Subscriber added successfully",
    id: "subscriber's id",
    email :"subscriber's email"
}
```

### Get a subscriber
- `GET /api/v1/subscribers/:id` - `Get by id` **default endpoint**

Missing parameter returns - status code: `400`
```js
{ error: 'Missing id' }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid id' }
```
If id does not exists - status code: `404`
```js
{ error: 'Not found' }
```
Successful response - status code - `200`
```js
{ 
    message: "success",
    id: number,  // subscriber's id
    email : string // subscriber's email
}
```

- `GET /api/v1/subscribers/emails/:email` - `Get by email`


Missing parameter returns - status code: `400`
```js
{ error: 'Missing email' }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid email' }
```
If email does not exists - status code: `404`
```js
{ error: 'Not found' }
```
Successful response - status code - `200`
```js
{ 
    message: "success",
    id: number,  // subscriber's id
    email : string // subscriber's email
}
```

### Delete a subscriber

- **_These endpoints are idempotent_**

- `DELETE /api/v1/subscribers/:id` - Delete by id **Default endpoint**

Missing parameter returns - status code: `400`
```js
{ error: 'Missing id' }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid id' }
```
If email does not exists - status code: `404`
```js
{}
```
Successful response - status code - `200`
```ts
{ 
    message: "Subscriber removed successfully",
    id : number // subscriber's id
}

- `DELETE /api/v1/subscribers/emails/:email` - Delete by email

Missing parameter returns - status code: `400`
```js
{ error: 'Missing email' }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid email' }
```
If email does not exists - status code: `404`
```js
{}
```
Successful response - status code - `200`
```ts
{ 
    message: "Subscriber removed successfully",
    email : string // subscriber's email
}
```

### Get all subscribers
- `GET /api/v1/subscribers?page=1`

**_This endpoint supports pagination_**

Successful response - status code - `200`

```ts
{ 
    message: "success",
    data: [], // An array of { id, email }
    current: number, // current page number
    next: number // next page number or null
}
```


## Contact

### Add a contact
- `POST /api/v1/contacts`

Required `body` properties in `application/json` format:
- `email`: `string`
- `firstName`: `string`
- `lastName`: `string`
- `description`: `string`
- `website`: `string` (optional)

Missing parameter returns - status code: `400`
```js
{ error: 'Missing paramter name' } // website can be omitted
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid paramter name' }
```
If email already exists - status code: `400`
```js
{ error: 'Contact already exists' }
```
Successful response - status code - `200`
```ts
{ 
    message: "Subscriber added successfully",
    id: string,
    email: string
    firstName: string,
    lastName: string,
    website: string | null,
    description: string
}
```

### Get a Contact
- `GET /api/v1/contacts/:id` - `Get by id` **default endpoint**

Missing parameter returns - status code: `400`
```js
{ error: 'Missing id' }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid id' }
```
If id does not exists - status code: `404`
```js
{ error: 'Not found' }
```
Successful response - status code - `200`
```ts
{ 
    message: "success",
    id: number,
    createdAt: Date,
    updatedAt: Date,
    firstName: string,
    lastName: string,
    email : string,
    description: string,
    website: string | null
}
```

- `GET /api/v1/subscribers/emails/:email` - `Get by email`


Missing parameter returns - status code: `400`
```js
{ error: 'Missing email' }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid email' }
```
If email does not exists - status code: `404`
```js
{ error: 'Not found' }
```
Successful response - status code - `200`
```ts
{ 

    message: "success",
    id: number,
    createdAt: Date,
    updatedAt: Date,
    firstName: string,
    lastName: string,
    email : string,
    description: string,
    website: string | null

}
```

### Delete a contact

- **_These endpoints are idempotent_**

- `DELETE /api/v1/subscribers/:id` - Delete by id **Default endpoint**

Missing parameter returns - status code: `400`
```js
{ error: 'Missing id' }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid id' }
```
If email does not exists - status code: `404`
```js
{}
```
Successful response - status code - `200`
```ts
{ 
    message: "success",
    id : number
}

- `DELETE /api/v1/subscribers/emails/:email` - Delete by email

Missing parameter returns - status code: `400`
```ts
{ error: "Missing email" }
```

An invalid parameter returns - status code: `400`
```js
{ error: 'Invalid email' }
```
If email does not exists - status code: `404`
```js
{}
```
Successful response - status code - `200`
```ts
{ 
    message: "success",
    email : string
}
```

### Get all contacts

- `GET /api/v1/contacts?page=1`

**_This endpoint supports pagination_**

Successful response - status code - `200`

```ts
{ 
    message: "success",
    data: [], // An array of { id, firstName, lastName, description, website, email }
    current: number, // current page number
    next: number // next page number or null
}
```
