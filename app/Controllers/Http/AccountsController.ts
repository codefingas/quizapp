'use strict'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Import the user model
import Users from 'App/Models/Mongoose/User'

export default class AccountsController {
  // Get all users
  public async index(ctx: HttpContextContract) {
    // Return list of all users
    return Users.find()
  }

  public async store(ctx: HttpContextContract) {
    // Create the required user
    const user = new Users({
      email: Math.random().toString(36).substring(7),
      password: Math.random().toString(36).substring(7),
      username: Math.random().toString(36).substring(7),
      created_at: Math.random().toString(36).substring(7),
      updated_at: null,
      deleted_at: null,
    })

    // Save the user
    const savedUser = await user.save()

    console.log(savedUser)
  }
}
