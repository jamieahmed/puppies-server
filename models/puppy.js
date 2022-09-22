import mongoose from 'mongoose'

const Schema = mongoose.Schema

const puppySchema = new Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  photo: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
}, {
  timestamps: true
})

const Puppy = mongoose.model('Puppy', puppySchema)

export {
  Puppy
}