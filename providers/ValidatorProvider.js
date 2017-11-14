'use strict'

const {ServiceProvider} = require('@adonisjs/fold')
const _ = require('lodash')

class ValidatorProvider extends ServiceProvider {
  /**
   * Register bindings
   */
  register () {
    this._registerValidator()
    this._registerMiddleware()
    this._registerCommands()
  }

  /**
   * On boot
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    // define middleware in server
    const Server = this.app.use('Adonis/Src/Server')
    Server.registerNamed({
      addonValidator: 'MiddlewareValidator'
    })

    // extend Route so we can use .validator() on it
    const Route = this.app.use('Adonis/Src/Route')
    Route.Route.macro('validator', function (validatorClass) {
      this.middleware([`addonValidator:${validatorClass}`])
      return this
    })

    // extend Route.resource so we can use .validator() on it
    Route.RouteResource.macro('validator', function (validatorsMap) {
      const middlewareMap = new Map()

      for (const [routeNames, validators] of validatorsMap) {
        const middleware = _.castArray(validators).map((validator) => `addonValidator:${validator}`)
        middlewareMap.set(routeNames, middleware)
      }

      this.middleware(middlewareMap)
      return this
    })

    // register ace commands
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Make:Validator')
  }

  /**
   * Register validator
   *
   * @private
   */
  _registerValidator () {
    this.app.bind('Validator', () => require('../src/Validator'))
  }

  /**
   * Register middleware
   *
   * @private
   */
  _registerMiddleware () {
    this.app.bind('MiddlewareValidator', (app) => {
      const MiddlewareValidator = require('../src/Middleware/Validator')
      return new MiddlewareValidator(app.use('Validator'))
    })
  }

  /**
   * Register the `make:validator` command to the IoC container
   *
   * @private
   */
  _registerCommands () {
    this.app.bind('Adonis/Commands/Make:Validator', () => require('../commands/MakeValidator'))
  }
}

module.exports = ValidatorProvider
