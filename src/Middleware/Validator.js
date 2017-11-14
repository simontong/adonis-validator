'use strict'
const {resolver} = require('@adonisjs/fold')
const _ = require('lodash')
const CE = require('../Exceptions')

class ValidatorMiddleware {
  constructor (Validator) {
    this.Validator = Validator
  }

  /**
   * Handler
   *
   * @param ctx
   * @param next
   * @param validator
   * @returns {Promise}
   */
  async handle (ctx, next, validator) {
    validator = validator instanceof Array === true ? validator[0] : validator

    // if no validator found then bail
    if (!validator) {
      throw new Error('Cannot validate request without a validator. Make sure to call Route.validator(\'validatorPath\')')
    }

    // get validator instance for this request
    const validatorInstance = resolver.forDir('validators').resolve(validator)
    validatorInstance.ctx = ctx

    // run validation
    const validate = await this._runValidations(ctx.request, validatorInstance)

    // if validation failed then send response
    if (!validate) {
      this._endResponseIfCan(ctx.response, 'Validation failed', 400)
      return
    }

    await next()
  }

  /**
   * Run validation for current request
   *
   * @param request
   * @param validator
   * @returns {Promise}
   * @private
   */
  async _runValidations (request, validator) {
    // if no rules then skip validation
    if (!validator.rules || !_.size(validator.rules)) {
      return true
    }

    // run validator
    const validation = await this.Validator.validate(
      validator.data || request.all(),
      validator.rules,
      validator.messages
    )

    // wrap promise around validatorjs (doesn't support async/await currently)
    const passes = await new Promise(resolve => {
      validation.passes(() => resolve(true))
      validation.fails(() => resolve(false))
    })

    // if passed
    if (passes) {
      return true
    }

    // custom error parser on validator
    if (typeof validator.fails === 'function') {
      await validator.fails(validation.errors)
      return false
    }

    // throw exception and pass back validation errors
    throw CE.ValidationException.validationFailed(validation.errors)
  }

  /**
   * End response
   *
   * @param response
   * @param message
   * @param status
   * @private
   */
  _endResponseIfCan (response, message, status) {
    if ((!response.lazyBody.content || !response.lazyBody.method) && response.isPending) {
      response.status(status).send(message)
    }
  }
}

module.exports = ValidatorMiddleware
