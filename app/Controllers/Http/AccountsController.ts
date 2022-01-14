'use strict'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'

// Import the user model
import Users from 'App/Models/Mongoose/User'
import Utilities from 'App/Helpers/Utilities'

export default class AccountsController {
  // Get all users
  public async index(ctx: HttpContextContract) {
    // Return list of all users
    return Users.find()
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      // Validate the user
      await request.validate({
        schema: new Utilities().validateUser(),
        messages: new Utilities().validationMessages(),
      })

      // Create the required user
      const user = new Users({
        email: request.input('email'),
        password: await Hash.make(String(request.input('password'))),
        username: request.input('username'),
        created_at: new Utilities().currentDate(),
        updated_at: null,
        deleted_at: null,
      })

      // Save the user
      const savedUser = await user.save()

      response
        .status(201)
        .json({ id: savedUser.id, email: savedUser.email, username: savedUser.username })
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
