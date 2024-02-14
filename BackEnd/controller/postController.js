import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate(({ path: "user", select: ["fullName", "avatarUrl"] })).exec();
    res.json(posts)
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "Не удалось получить статьи"
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndUpdate({
      _id: postId
    }, {
      $inc: { viewsCount: 1 },
    }, {
      returnDocument: 'after'
    },)
    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена"
      })
    }
    res.json(post)
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "Не удалось получить статью"
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndDelete({
      _id: postId,
    })
    if (!post) {
      return res.status(404).json({
        message: "Не удалось удалить статью"
      })
    }
    res.json({
      success: true
    })
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "Не удалось получить статью"
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId, // Получает id c chechAuth 
    })

    const post = await doc.save();

    res.json(post)
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "Не удалось создать статью"
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne({
      _id: postId,
    }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId, // Получает id c chechAuth 
    },)
    res.json({
      success: true
    })
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "Не удалось обновить статью"
    })
  }
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    
    const tags = posts.map(obj => obj.tags).flat().slice(0, 5)
    
    res.json(tags)
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "Не удалось получить статьи"
    })
  }
}