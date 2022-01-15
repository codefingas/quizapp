import { Schema, model } from '@ioc:Mongoose'

const QuizSchema: Schema = new Schema({
  question: { type: String, required: true },
  correct_answer: { type: String, required: true },
  incorrect_answers: { type: Array, required: true },
  created_by: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: false },
  deleted_at: { type: Date, required: false },
})

export default model('Quiz', QuizSchema)
