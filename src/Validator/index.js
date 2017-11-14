'use strict'

const Validator = require('validatorjs')

module.exports = {
  validate: (...args) => new Validator(...args),
  register: Validator.register,
  registerAsync: Validator.registerAsync,
  setMessages: Validator.setMessages,
  useLang: Validator.useLang,
  getDefaultLang: Validator.getDefaultLang,
}
