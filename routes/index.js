var express = require('express');
var router = express.Router();
const userModel = require('./users')
const localStrategy = require('passport-local');
const passport = require('passport');

passport.use(new localStrategy(userModel.authenticate()))

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile')
})
router.post('/register', async (req, res) => {
  var userData = new userModel({
    username: req.body.username,
    secret: req.body.secret,
  });

  console.log('hello')

  userModel.register(userData, req.body.password)
    .then((registereduser) => {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/profile')
      })
    })
})

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }), function (req, res) {

  }
)

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/')
  })
})

router.get('/users', async (req, res) => {
  let user = await userModel.find({
    $expr: {
      $and: [
        { $gte: [{ $strLenCP: "$name" }, 0] },
        { $lte: [{ $strLenCP: "$name" }, 22] }
      ]
    }
  })
  res.send({ length: user.length, user })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}

module.exports = router;
