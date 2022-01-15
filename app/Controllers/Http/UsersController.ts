'use strict'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'

// Import the user model
import Users from 'App/Models/Mongoose/User'
import Utilities from 'App/Helpers/Utilities'

export default class UsersController {
  // Get all users
  public async index({ request, response }: HttpContextContract) {
    let limit = request.qs().limit

    // Return list of all users
    let users = Users.find()

    // Apply limit if valid
    if (limit > 0) {
      users = users.limit(limit)
    }

    return await users
  }

  // Get a specific user
  public async getByID({ request, response }: HttpContextContract) {
    try {
      // Return the specific user with the given `id`, or `null` if not found
      return await Users.findById(request.param('id')).exec()
    } catch (error) {
      response.badRequest(error)
    }
  }

  // Register a new user
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

      // Check if user already exists before
      let existingUser = await Users.findOne({
        email: request.input('email'),
      }).exec()

      if (existingUser) {
        return response.badRequest({ Error: 'User already exists.' })
      }

      // Save the user
      const savedUser = await user.save()

      response
        .status(201)
        .json({ id: savedUser.id, email: savedUser.email, username: savedUser.username })
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  // Update a specific user by ID
  public async update({ request, response }: HttpContextContract) {
    try {
      // Validate the user
      await request.validate({
        schema: new Utilities().validateUser(),
        messages: new Utilities().validationMessages(),
      })

      // Update the user
      await Users.findByIdAndUpdate(request.param('id'), {
        email: request.input('email'),
        password: await Hash.make(String(request.input('password'))),
        username: request.input('username'),
        updated_at: new Utilities().currentDate(),
      }).exec()

      // Return the updated user
      return await Users.findById(request.param('id')).exec()
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  // Delete a specific user by ID
  public async delete({ request, response }: HttpContextContract) {
    try {
      // Delete a specific user
      await Users.findByIdAndRemove(request.param('id')).exec()

      return response.noContent()
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
