'use strict'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import jwt from 'jsonwebtoken'
import Users from 'App/Models/Mongoose/User'
import Utilities from 'App/Helpers/Utilities'
import Scores from 'App/Models/Mongoose/Scoring'

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

  // Allow user to be able to view statistics on quizzes attempted so far.
  public async getStatistics({ request, response }: HttpContextContract) {
    let userId = request.user._id

    // Get all user records from the scoring table ordered by date
    let userScores = await Scores.find({ created_by: userId }).sort({ created_at: -1 }).exec()

    // Select total, score for each user record order by date
    let userScoresTotal = userScores.map((score) => {
      return {
        total: score.total,
        score: score.score,
        created_at: score.created_at,
      }
    })

    // Return the user scores
    return response.json(userScoresTotal)
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

      return response
        .status(201)
        .json({ id: savedUser.id, email: savedUser.email, username: savedUser.username })
    } catch (error) {
      response.badRequest(error)
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
      response.badRequest(error)
    }
  }

  // Delete a specific user by ID
  public async delete({ request, response }: HttpContextContract) {
    try {
      // Delete a specific user
      await Users.findByIdAndRemove(request.param('id')).exec()

      return response.noContent()
    } catch (error) {
      response.badRequest(error)
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
      response.badRequest(error)
    }
  }
}
