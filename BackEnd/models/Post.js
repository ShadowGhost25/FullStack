import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, //Это свойство обязательно при создание поста
  },
  text: {
    type: String,
    required: true, //Это свойство обязательно при создание поста
    unique: true
  },
  tags: {
    type: Array,
    default: []
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', //Ссылается на модель user
    required: true, //Это свойство обязательно при создание поста
  },
  imageUrl: String,
}, {
  timestamps: true,
})

export default mongoose.model('Post', PostSchema)