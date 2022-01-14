import { Schema, model } from '@ioc:Mongoose'

const CategoriesSchema: Schema = new Schema({
  name: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  deleted_at: { type: Date, required: true },
})

export default model('Categories', CategoriesSchema)
