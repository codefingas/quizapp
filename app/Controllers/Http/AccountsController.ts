import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccountsController {
  public async index({}: HttpContextContract) {
    return 'I am from the Accounts Controller'
  }
}
