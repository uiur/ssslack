/* global Parse */

var express = require('express')
var app = express()

app.set('views', 'cloud/views')
app.set('view engine', 'ejs')
app.use(express.bodyParser())

app.get('/:id', function (req, res) {
  var id = req.params.id
  var Snippet = Parse.Object.extend('Snippet')
  var query = new Parse.Query(Snippet)
  query.get(id, {
    success: function (snippet) {
      res.render('index', { snippet: snippet })
    },
    error: function (object, error) {
      res.status(404).send('Not Found')
    }
  })
})

app.listen()
