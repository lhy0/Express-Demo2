var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  let username = req.session.username;
  let { page = 1, pageCount = 3 } = req.query;

  model.connect((db) => {
    let data = {
      total: 0,
      list: [],
      pages: 0
    }
    db.collection('articles').find().toArray((err, all) => {
      if (err) {
        console.log(err);
      }else{
        data.total = all.length; 
        data.pages = Math.ceil(all.length/pageCount) 
      }

      model.connect((db) => {
        db.collection('articles').find().sort({_id: -1}).limit(pageCount)
          .skip((page-1)*pageCount).toArray((error, list) => {
            data.list = list;
            data.page = page;
            if (error) {
              console.log(error);
            }else {
              res.render('index', { username: username, articles: data });
            }
        })
      })
    })
  })
});

router.get('/regist.html', (req, res, next) => {
  res.render('regist', {})
})

router.get('/login.html', (req, res, next) => {
  res.render('login', {})
})

router.get('/write.html', (req, res, next) => {
  let id = parseInt(req.query.id);
  if (id) {
    model.connect((db) => {
      db.collection("articles").find({id}).toArray((err, data) => {
        if (err) {
          console.log("查找有误")
        }else{
          res.render('write', {article: data[0]})
        }
      })
    })
  }else {
    res.render('write', {article: {
      id: "",
      title: "",
      content: ""
    }})
  }
})

router.get('/details.html', (req, res, next) => {
  let id = parseInt(req.query.id);
  let username = req.session.username;
  model.connect((db) => {
    db.collection("articles").find({id}).toArray((err, data) => {
      if (err) {
        console.log("查找有误")
      }else{
        let detail = {
          title: data[0].title,
          author: username,
          content: data[0].content
        }
        res.render('details', {detail})
      }
    })
  })
})

module.exports = router;
