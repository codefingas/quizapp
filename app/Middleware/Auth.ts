'use strict'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    if (
      request.headers() &&
      request.headers().authorization &&
      request.headers().authorization.split(' ')[0] === 'Bearer'
    ) {
      try {
        let decoded = jwt.verify(request.headers().authorization.split(' ')[1], process.env.SECRET)
        request.user = decoded
        await next()
      } catch(err) {
        response.badRequest({ error: 'Access Denied.' })
      }
    } else {
      response.badRequest({ error: 'Invalid User Authentication details passed.' })
    }
  }
}
