'use strict'
const result = require('dotenv').config()

if (result.error) {
  throw result.error
}

import { ApplicationContract } from '@ioc:Adonis/Core/Application'
/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class MongoProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Create new Mongoose instance
    const mongoose = require('mongoose')

    // Connect the instance to DB
    mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    // Attach it to IOC container as singleton
    this.app.container.singleton('Mongoose', () => mongoose)
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
    await this.app.container.use('Mongoose').disconnect()
  }
}
