import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import userModel from '../models/User.js'
export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      password,
    })
    const user = await doc.save();

    const token = jwt.sign({
      _id: user._id,
    }, 'secret123', {
      expiresIn: '30d',
    })

    const { passwordHash, ...userData } = user._doc

    res.json({ ...userData, token })
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "не удалось зарегистрироваться"
    })
    return
  }
}

export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(400).json({
        message: 'Неверные логин или пароль'
      })
    }

    const isValidationPass = await bcrypt.compare(req.body.password, user._doc.password)

    if (!isValidationPass) {
      return res.status(400).json({
        message: 'Неверные логин или пароль'
      })
    }

    const token = jwt.sign({
      _id: user._id,
    }, 'secret123', {
      expiresIn: '30d',
    })

    const { passwordHash, ...userData } = user._doc

    res.json({ ...userData, token })
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "Не удалось авторизироваться"
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }
    const { passwordHash, ...userData } = user._doc

    res.json(userData)
  } catch (error) {
    console.log("err => ", error)
    res.status(400).json({
      message: "Нет доступа"
    })
    return
  }
}
