const bcrypt = require('bcrypt-nodejs')
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Followship = db.Followship

const userController = {
  //user登入
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  //user註冊
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user

      User.findOne({
        where: {
          $or: [{ email: req.body.email }, { account: req.body.account }],
        },
      }).then((user) => {
        if (user) {
          if (user.account === req.body.account) req.flash('error_messages', '帳號重複！')
          else if (user.email === req.body.email) req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            role: 'user',
          }).then((user) => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  //user編輯帳號
  editUser: (req, res) => {
    User.findByPk(req.params.id).then((user) => {
      return res.render('setting', {
        user: user.toJSON(),
      })
    })
  },

  putUser: (req, res) => {
    // if (!req.body.name) {
    //   req.flash("error_messages", "name didn't exist")
    //   return res.redirect("back")
    // }
    return User.findByPk(req.params.id).then((user) => {
      user
        .update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
        })
        .then(() => {
          req.flash('success_messages', '帳號修改成功')
          res.redirect('back')
        })
    })
  },

  addLike: (req, res) => {
    const UserId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    // console.log('req params: ' + req.params.id)
    // console.log('req body: ' + req.body.id)
    Tweet.findByPk(req.params.id)
      .then((tweet) => {
        return Like.create({
          UserId: UserId,
          TweetId: req.params.id,
        })
      })
      .then((user) => {
        return res.redirect('back')
      })
  },

  removeLike: (req, res) => {
    const UserId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    return Like.destroy({
      where: {
        UserId: UserId,
        TweetId: req.params.id,
      },
    }).then((like) => {
      return res.redirect('back')
    })
  },

  addFollowships: (req, res) => {
    const UserId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id

    if (req.body.id === UserId.toString()) {
      return res.send({ error: 'can not follow self' })
      // return res.redirect('back')
    } else {
      console.log('add 2')
      return Followship.create({
        followerId: UserId,
        followingId: req.body.id,
      }).then((followship) => {
        return res.redirect('back')
      })
    }
  },

  removeFollowing: (req, res) => {
    const UserId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    console.log('req params: ' + UserId)
    console.log('req body: ' + req.params.id)
    return Followship.destroy({
      where: {
        followerId: UserId,
        followingId: req.params.id,
      },
    }).then((followship) => {
      return res.redirect('back')
    })
  },
}
module.exports = userController
