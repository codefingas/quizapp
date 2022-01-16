'use strict'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Utilities from 'App/Helpers/Utilities'
import Quizzes from 'App/Models/Mongoose/Quiz'
import Scores from 'App/Models/Mongoose/Scoring'

export default class QuizzesController {
  // Return a list of 5 random questions to the user
  public async play({ response }: HttpContextContract) {
    try {
      // Return a list of 5 random questions to the user
      let questions = await Quizzes.aggregate([{ $sample: { size: 5 } }]).exec()

      return response.json(questions)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  // Score and save the quiz result in the database
  public async score({ request, response }: HttpContextContract) {
    try {
      // Loop through the supplied answers and check if they match the correct answer
      let id = ''
      let correct = 0
      let answer = ''
      let existingQuiz
      let scoring = []

      for (const key in request.all()) {
        id = request.all()[key]['_id']
        answer = request.all()[key]['supplied_answer']

        // Get the quiz details from the database
        existingQuiz = await Quizzes.findById(id).exec()

        // If the quiz already exists, update the score object
        if (existingQuiz) {
          if (answer === existingQuiz.correct_answer) {
            correct++
            scoring.push({
              correct: true,
              question: existingQuiz.question,
              correct_answer: existingQuiz.correct_answer,
              supplied_answer: answer,
              incorrect_answers: existingQuiz.incorrect_answers,
            })
          } else {
            scoring.push({
              correct: false,
              question: existingQuiz.question,
              correct_answer: existingQuiz.correct_answer,
              supplied_answer: answer,
              incorrect_answers: existingQuiz.incorrect_answers,
            })
          }
        }
      }

      const score = new Scores({
        score: correct,
        details: scoring,
        total: scoring.length,
        created_by: request.user._id,
        created_at: new Utilities().currentDate(),
      })
      await score.save()

      return response.status(201).json({
        score: correct,
        total: scoring.length,
        attempted_on: new Utilities().currentDate(),
        breakdown: scoring,
      })
    } catch (error) {
      return response.badRequest(error)
    }
  }

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

      // Return the specific quiz with the given `id`, or `null` if not found
      return await Quizzes.findOne(query).exec()
    } catch (error) {
      return response.badRequest(error)
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

      return response.status(201).json({
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
      const updated = await Quizzes.findOneAndUpdate(query, {
        question: request.input('question'),
        correct_answer: request.input('correct_answer'),
        incorrect_answers: request.input('incorrect_answers'),
        created_by: request.user._id,
        updated_at: new Utilities().currentDate(),
      }).exec()

      return response.status(200).json(updated)
    } catch (error) {
      return response.badRequest(error)
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
      return response.badRequest(error)
    }
  }
}
