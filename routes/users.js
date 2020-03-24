var express = require('express');
var router = express.Router();
var model = require("../model");

router.post('/regist', function(req, res, next) {
  let { username, password } = req.body;
  model.connect((db) => {
    db.collection("users").insertOne({username, password}, (err) => {
      if (err) {
        res.redirect("/regist.html");
      } else {
        console.log("文档插入成功");
        res.redirect("/login.html");
      }
    })
  })
});

router.post('/login', function(req, res, next) {
  let { username } = req.body;
  model.connect((db) => {
    db.collection("users").find({'username': username}).toArray((err, result) => {
      if (err) {
        res.redirect("/login.html");
      }else {
        if (result.length > 0) {
          //登陆成功，进行session会话存储
          req.session.username = username;
          res.redirect("/");
        } else {
          res.redirect("/login.html");
        }
      }
    })
  })
});

router.get('/logout', (req, res) => {
  req.session.username = null;
  res.redirect("/login.html");
})

module.exports = router;
