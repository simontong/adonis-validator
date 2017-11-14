'use strict'

const path = require('path')
const {Command} = require('@adonisjs/ace')

class MakeValidator extends Command {
  constructor (Helpers) {
    super()
    this.Helpers = Helpers
  }

  /**
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Src/Helpers']
  }

  /**
   * @return {String}
   */
  static get signature () {
    return 'make:validator {name : Validator name}'
  }

  /**
   * @return {String}
   */
  static get description () {
    return 'Make route validator'
  }

  /**
   * Handler
   *
   * @param name
   * @returns {Promise}
   */
  async handle ({name}) {
    name = name.replace(/Validator$/i, '')

    // get template
    const template = await this.readFile(path.join(__dirname, './templates/validator.mustache'), 'utf8')

    // get dir paths
    const relativePath = path.join('app/Validators', `${name}.js`)
    const validatorPath = path.join(this.Helpers.appRoot(), relativePath)

    // return response if not executed in cli
    if (!this.viaAce) {
      return this.generateFile(validatorPath, template, {name})
    }

    // output to cli
    try {
      await this.generateFile(validatorPath, template, {name})
      this.completed('create', relativePath)
    } catch (error) {
      this.error(`${relativePath} validator already exists`)
    }
  }
}

module.exports = MakeValidator
