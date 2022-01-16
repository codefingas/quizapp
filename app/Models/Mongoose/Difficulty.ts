import { Schema, model } from '@ioc:Mongoose'

const DifficultySchema: Schema = new Schema({
  name: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: false },
  deleted_at: { type: Date, required: false },
})

export default model('Difficulty', DifficultySchema)
