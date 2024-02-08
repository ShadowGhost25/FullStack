import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator';

import { registerValidator } from './validations/auth.js'

import userModel from './models/User.js'

mongoose
  .connect('mongodb+srv://admin:wwwwww@practic.gpq4sx8.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => { console.log('Ok Db') })
  .catch((err) => { console.log("Db err =>", err) })

const app = express();

app.use(express.json());


app.post('/auth/register', registerValidator, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt)

  const doc = new userModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    password,
  })
  const user = await doc.save();

  res.json(user)
})

app.listen(4445, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server Ok')
})