const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const _ = require('lodash')

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
mongoose.connect('mongodb://localhost:27017/wikiDB')
const articleSchema = mongoose.Schema({
  title: String,
  content: String,
})
const Article = mongoose.model('Article', articleSchema)

app
  .route('/articles')
  .get((req, res) => {
    Article.find((err, article) => {
      if (!err) {
        res.send(article)
      } else {
        res.send(err)
      }
    })
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    })
    newArticle.save((err) => {
      if (!err) {
        res.send('Data added successfully.')
      } else {
        res.send(err)
      }
    })
  })
  .delete((req, res) => {
    Article.deleteMany((err, deleteAll) => {
      if (!err) {
        res.send('Successfully deleted all articles from DB.')
      } else {
        res.send(err)
      }
    })
  })

app
  .route('/articles/:articleTitle')
  .get((req, res) => {
    const titleArticle = req.params.articleTitle
    Article.findOne({ title: titleArticle }, (err, articleName) => {
      if (!err) {
        res.send(articleName)
      } else {
        res.send('no article found')
      }
    })
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send('Successfully updated data.')
        } else {
          res.send(err)
        }
      },
    )
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send('Successfully update data.')
        } else {
          res.send(err)
        }
      },
    )
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send('Successfully deteted data')
      } else {
        res.send(err)
      }
    })
  })

app.listen(3000, () => {
  console.log('server is running on port 3000.')
})
