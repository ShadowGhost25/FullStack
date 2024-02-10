import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true, //Это свойство обязательно при создание поста
  },
  email: {
    type: String,
    required: true, //Это свойство обязательно при создание поста
    unique: true
  },
  password: {
    type: String,
    required: true, //Это свойство обязательно при создание поста
  },
  avatarUrl: String,
}, {
  timestamps: true,
})

export default mongoose.model('User', UserSchema)