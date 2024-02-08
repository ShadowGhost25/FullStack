import express from 'express';
import mongoose from 'mongoose';

import { registerValidator } from './validations/auth.js'

import cheakAuth from './utils/cheakAuth.js'
import * as userController from './controller/userController.js';

mongoose
  .connect('mongodb+srv://admin:wwwwww@practic.gpq4sx8.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => { console.log('Ok Db') })
  .catch((err) => { console.log("Db err =>", err) })

const app = express();

app.use(express.json());

app.post('/auth/login', userController.login)

app.post('/auth/register', registerValidator, userController.register)

app.get('/auth/me', cheakAuth, userController.getMe)

app.listen(4445, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server Ok')
})