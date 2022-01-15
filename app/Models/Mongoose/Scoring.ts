import { Schema, model } from '@ioc:Mongoose'

const ScoringSchema: Schema = new Schema({
  total: { type: Number, required: true },
  score: { type: Number, required: true },
  details: { type: Array, required: true },
  created_by: { type: String, required: true },
  created_at: { type: Date, required: true },
})

export default model('Scoring', ScoringSchema)
