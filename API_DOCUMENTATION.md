# API DOCUMENTATION FOR TechProsNaija Backend endpoints

Welcome to the API documentation for the routes/endpoints in the backend for TechProsNaija. This documentation has been prepared to help the engineers/developers working on the client-side to know the required parameters for sending requests and the expected responses.

- Endpoints are split into sections i.e `User`, `Course` e.t.c.
- Status codes are sent in the response object. They are not part of the JSON data response.

## Sections
- [User](#user)
    - [Create a user](#create-a-user)

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