'use strict'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class QuizzesController {
  public async index({}: HttpContextContract) {
    return 'I am from the Quiz Controller'
  }
}
