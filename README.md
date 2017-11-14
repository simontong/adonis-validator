# adonis-validator
Form validator for AdonisJS. Validate form values with ease.
Set custom attribute names for error messages.
Validate multiple depth arrays/objects.

## How to use

Install npm module:

```bash
$ adonis install adonis-validator
```

## Register provider

Once you have installed adonis-validator, make sure to register the provider inside `start/app.js` in order to make use of it.

```js
const providers = [
  'adonis-validator/providers/ValidatorProvider'
]
```

## Using the module:

Create a validator object (saves to `app/Validators`) by executing: 
```bash
# change 'UserSave' to the name you wish to use
$ adonis make:validator UserSave
```
You can now add rules to the `app/Validators/UserSave` class.

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

## Custom validation rules

Custom rule without asynchronicity:
```js
const Validator = use('Validator')
Validator.registerAsync('equalsFooBar', function (value, args, attribute) {
  return value === 'FooBar'
}, ':attribute does not equal FooBar')
```

Asynchronous rules:
```js
const Validator = use('Validator')
Validator.registerAsync('exists', function (value, attribute, args, passes) {
    // get arguments
    const params = this.getParameters() // or args.split(',')
    const dbTable = params[0]
    const dbField = params[1] || 'id'
  
    // query function
    const fn = value instanceof Array ? 'whereIn' : 'where'
  
    // check if exists
    Database.table(dbTable)[fn](dbField, value)
      .then(exists => passes(exists && exists.length > 0))
  }, ':attribute does not exist')
```

## Built With

* [AdonisJS](http://adonisjs.com) - The web framework used.
* [validatorjs](https://github.com/skaterdav85/validatorjs) - validatorJS for validation rules.

## Versioning

[SemVer](http://semver.org/) is used for versioning. For the versions available, see the [tags on this repository](https://github.com/simontong/adonis-validator/tags).  

## Authors

* **Simon Tong** - *Developer* - [simontong](https://github.com/simontong)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Changelog

- v1.0.0
  - Initial release.
  