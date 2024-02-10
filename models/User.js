import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true, //Это свойство обязательно при создание пользователя
  },
  email: {
    type: String,
    required: true, //Это свойство обязательно при создание пользователя
    unique: true
  },
  password: {
    type: String,
    required: true, //Это свойство обязательно при создание пользователя
  },
  avatarUrl: {
    type:String,
    required:true, //Это свойство обязательно при создание пользователя
  },
}, {
  timestamps: true,
})

export default mongoose.model('User', UserSchema)