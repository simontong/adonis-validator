'use strict'

const GE = require('@adonisjs/generic-exceptions')

class ValidationException extends GE.RuntimeException {
  static validationFailed (messages) {
    const error = new this('Validation failed', 400, 'E_VALIDATION_FAILED')
    error.messages = messages
    return error
  }

  /**
   * @param messages
   * @param request
   * @param response
   * @param session
   * @returns {Promise}
   */
  async handle ({messages}, {request, response, session}) {
    const isJSON = request.accepts(['html', 'json']) === 'json'

    // json response
    if (isJSON) {
      return response.status(400).send(messages)
    }

    // flash errors into session
    if (session && session.withErrors) {
      session.withErrors(messages).flashAll()
      await session.commit()
      response.redirect('back')
      return
    }

    // send 400 response if all other options exhausted
    response.status(400).send('Validation failed')
  }
}

module.exports = {ValidationException}
