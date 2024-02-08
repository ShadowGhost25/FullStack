import { body } from "express-validator"

export const registerValidator = [
  body('email', "Неверный email").isEmail(),
  body('password', "Пароль составляет меньше 5 символов").isLength({ min: 5 }),
  body('fullName', 'Имя пользователя составляет менее 3 символом').isLength({ min: 3 }),
  body('avatarURL', "Указан не верный URL адресс").optional().isURL(),
]