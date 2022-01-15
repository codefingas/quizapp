'use strict'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Utilities from 'App/Helpers/Utilities'
import Quizzes from 'App/Models/Mongoose/Quiz'

export default class QuizzesController {
  // Return the list of all quizzes
  public async index({ request }: HttpContextContract) {
    let limit = request.qs().limit

    // Return list of all users
    let quizzes = Quizzes.find()

    // Apply limit if valid
    if (limit > 0) {
      quizzes = quizzes.limit(limit)
    }

    return await quizzes
  }

  // Get a specific quiz belonging to the user
  public async getByID({ request, response }: HttpContextContract) {
    try {
      const query = { created_by: request.user._id, _id: request.param('id') }

      // Return the specific user with the given `id`, or `null` if not found
      return await Quizzes.findOne(query).exec()
    } catch (error) {
      response.badRequest(error)
    }
  }

  // Create a new quiz
  public async create({ request, response }: HttpContextContract) {
    try {
      // Validate the quiz
      await request.validate({
        schema: new Utilities().validateQuiz(),
        messages: new Utilities().validationMessages(),
      })

      // Create the required quiz
      const quiz = new Quizzes({
        question: request.input('question'),
        correct_answer: request.input('correct_answer'),
        incorrect_answers: request.input('incorrect_answers'),
        created_by: request.user._id,
        created_at: new Utilities().currentDate(),
        updated_at: null,
        deleted_at: null,
      })

      // Save the quiz
      const savedQuiz = await quiz.save()

      response.status(201).json({
        id: savedQuiz.id,
        question: savedQuiz.question,
        correct_answer: savedQuiz.correct_answer,
        incorrect_answers: savedQuiz.incorrect_answers,
      })
    } catch (error) {
      response.badRequest(error)
    }
  }

  // Update user quiz
  public async update({ request, response }: HttpContextContract) {
    try {
      // Validate the user
      await request.validate({
        schema: new Utilities().validateQuiz(),
        messages: new Utilities().validationMessages(),
      })

      const query = { created_by: request.user._id, _id: request.param('id') }

      // Update the quiz
      return await Quizzes.findOneAndUpdate(query, {
        question: request.input('question'),
        correct_answer: request.input('correct_answer'),
        incorrect_answers: request.input('incorrect_answers'),
        created_by: request.user._id,
        updated_at: new Utilities().currentDate(),
      }).exec()
    } catch (error) {
      response.badRequest(error)
    }
  }

  // Delete quiz only belonging to the user
  public async delete({ request, response }: HttpContextContract) {
    try {
      const query = Quizzes.findOne({
        created_by: request.user._id,
        _id: request.param('id'),
      })

      // Query hasn't been executed yet, so Mongoose hasn't casted the filter.
      query.getFilter()

      const doc = await query.exec()
      if (doc === null) {
        return response.notFound()
      }

      // Delete the quiz since we know it belongs to the user
      await Quizzes.findByIdAndRemove(doc._id).exec()

      return response.noContent()
    } catch (error) {
      response.badRequest(error)
    }
  }
}
