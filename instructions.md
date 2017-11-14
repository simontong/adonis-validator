## Register provider

Start by registering the provider inside `start/app.js` file.

```js
const providers = [
  'adonis-validator/providers/ValidatorProvider'
]
```

## Using the module:

```js
// on a single route
Route.post('/user', 'UserController.store').validator('UserSave')

// on resource routes
Route.resource('products', 'ProductController')
    .validator([[['products.store', 'products.update'], 'ProductStore']])
    
// manual validation
Route.post('/user', ({request, response}) => {
  const Validator = use('Validator')
  const rules = {name: 'required', age: 'numeric|min:18'}
  const validate = Validator.validate(request.only(['name', 'age']), rules)
  
  // return json response with 400 code
  if (validate.fails()) {
    response.status(400).send(validate.errors)
  }
})
```