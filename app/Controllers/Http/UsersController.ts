'use strict'
import dotenv from 'dotenv'
dotenv.config()

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import jwt from 'jsonwebtoken'

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

  // Login a user
  public async login({ request, response }: HttpContextContract) {
    try {
      // Validate the user
      await request.validate({
        schema: new Utilities().loginUser(),
        messages: new Utilities().validationMessages(),
      })

      // Find the user
      let user = await Users.findOne({
        email: request.input('email'),
      }).exec()

      // Check if user exists
      if (!user) {
        return response.badRequest({ Error: 'User does not exist.' })
      }

      // Check if password is correct
      if (!(await Hash.verify(user.password, String(request.input('password'))))) {
        return response.badRequest({ Error: 'Password is incorrect.' })
      }

      // Return the user
      return response.json({
        id: user.id,
        email: user.email,
        username: user.username,
        token: jwt.sign(
          { email: user.email, username: user.username, _id: user._id },
          process.env.SECRET
        ),
      })
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  // Logout a user
  public async logout({ request, response }: HttpContextContract) {
    try {
      return response.noContent()
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
