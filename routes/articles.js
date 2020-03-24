var express = require('express');
var router = express.Router();
var model = require("../model");
var moment = require("moment");
var multiparty = require("multiparty");
var fs = require("fs");

router.post('/add', function(req, res, next) {
  let { title, content, id } = req.body;
  id = parseInt(id);
  let username = req.session.username;
  if (id) {
    model.connect((db) => {
      db.collection("articles").updateOne({id}, {$set: {
        title,
        content
      }} , (err) => {
        console.log(2222222222)
        console.log(err)
        if (err) {
          res.redirect(`/write.html?id=${id}`);
        } else {
          res.redirect("/");
        }
      })
    })
  } else {
    let writeData = {
      title,
      content,
      username,
      time: moment().format('YYYY-MM-DD h:mm:ss'),
      id: new Date().getTime()
    }
    model.connect((db) => {
      db.collection("articles").insertOne(writeData, (err) => {
        if (err) {
          res.redirect("/write.html");
        } else {
          res.redirect("/");
        }
      })
    })
  }
});

router.get('/delete', (req, res, next) => {
  let id = parseInt(req.query.id);
  model.connect((db) => {
    db.collection("articles").deleteOne({id: id}, (err) => {
      console.log("删除成功！")
      res.redirect("/");
    })
  })
})

router.post('/upload', (req, res, next) => {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log("上传出错")
    }else {
      let file = files.filedata[0];
      let rs = fs.createReadStream(file.path);
      let newPath = `/uploads/${file.originalFilename}`;
      let ws = fs.createWriteStream(`./public/${newPath}`);
      rs.pipe(ws);
      ws.on("close", (err) => {
        console.log("上传成功");
        res.send({err: "", msg: newPath});
      })
    }
  });
})

module.exports = router;
