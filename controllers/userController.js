const bcrypt = require("bcrypt-nodejs")
const db = require("../models")
const User = db.User

const userController = {
  //user登入
  signInPage: (req, res) => {
    return res.render("signin")
  },

  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！")
    res.redirect("/tweets")
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！")
    req.logout()
    res.redirect("/signin")
  },

  //user註冊
  signUpPage: (req, res) => {
    return res.render("signup")
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！")
      return res.redirect("/signup")
    } else {
      // confirm unique user

      User.findOne({
        where: {
          $or: [{ email: req.body.email }, { account: req.body.account }],
        },
      }).then((user) => {
        if (user) {
          if (user.account === req.body.account) req.flash("error_messages", "帳號重複！")
          else if (user.email === req.body.email) req.flash("error_messages", "信箱重複！")
          return res.redirect("/signup")
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            role: "user",
          }).then((user) => {
            req.flash("success_messages", "成功註冊帳號！")
            return res.redirect("/signin")
          })
        }
      })
    }
  },
}
module.exports = userController