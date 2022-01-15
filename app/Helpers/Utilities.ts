import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class Utilities {
  // Get the CurrentDate
  public currentDate() {
    var today = new Date()
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  }

  // Get the CurrentDateime
  public currentDateTime() {
    var today = new Date()
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    var dateTime = date + ' ' + time

    return dateTime
  }

  // Return the validation Schema to be used for User Creation
  public validateUser() {
    return schema.create({
      email: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.email()]
      ),
      password: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.minLength(5), rules.required()]
      ),
      username: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.minLength(3), rules.required()]
      ),
    })
  }

  // Return the validation Schema to be used for Quiz Creation
  public validateQuiz() {
    return schema.create({
      question: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.minLength(3), rules.required()]
      ),
      incorrect_answers: schema.array([rules.minLength(1), rules.maxLength(5)]).anyMembers(),
      correct_answer: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.minLength(1), rules.required()]
      ),
    })
  }

  // Return the validation Schema to be used marking the answers
  public validateAnswer() {
    return schema.create({
      _id: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.minLength(3), rules.required()]
      ),
      correct_answer: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.minLength(1), rules.required()]
      ),
    })
  }

  // Return the validation Schema to be user for User Creation
  public loginUser() {
    return schema.create({
      email: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.email()]
      ),
      password: schema.string(
        {
          escape: true,
          trim: true,
        },
        [rules.minLength(5), rules.required()]
      ),
    })
  }

  // Return the custom validation rules to be used for the Application
  public validationMessages() {
    return {
      'username.unique': 'Username not available.',
      'required': 'Missing value for {{ field }}.',
      'minLength':
        'The minimum character length expected for {{ field }} is {{ options.minLength }} item(s) / character(s).',
    }
  }
}
