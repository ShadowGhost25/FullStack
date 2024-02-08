import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import { registerValidator } from './validations/auth.js'

import userModel from './models/User.js'
import cheakAuth from './utils/cheakAuth.js'

mongoose
  .connect('mongodb+srv://admin:wwwwww@practic.gpq4sx8.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => { console.log('Ok Db') })
  .catch((err) => { console.log("Db err =>", err) })

const app = express();

app.use(express.json());

app.post('/auth/login', registerValidator, async (req, res) => {
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
})

app.post('/auth/register', registerValidator, async (req, res) => {
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
      message: "не удалость зарегистрироваться"
    })
  }
})

app.get('/auth/me', cheakAuth, async (req, res) => {
  try {
    res.json({ 
      success: true,
     })
    // const user = await userModel.findById(req.userId)

    // if (!user) {
    //   return res.status(404).json({
    //     message: 'Пользователь не найден'
    //   })
    // }
    // const { passwordHash, ...userData } = user._doc

    // res.json({ userData })
  } catch (error) {
    console.log("err => ", error)
    res.status(500).json({
      message: "Нет доступа"
    })
  }
})

app.listen(4445, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server Ok')
})