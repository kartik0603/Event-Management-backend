const express = require("express");
const userRouter = express.Router();

const { register, login } = require("../controllers/user.controle.js");

userRouter.post("/register", register);
userRouter.post("/login", login);

module.exports = userRouter;
