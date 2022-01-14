import { Schema, model } from '@ioc:Mongoose'

const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  deleted_at: { type: Date, required: true },
})

export default model('User', UserSchema)
