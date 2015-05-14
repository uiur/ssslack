var express = require('express')
var app = express()

// Global app configuration section
app.set('views', 'cloud/views')  // Specify the folder to find templates
app.set('view engine', 'ejs')    // Set the template engine
app.use(express.bodyParser())    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/:id', function (req, res) {
  var id = req.params.id
  var Snippet = Parse.Object.extend("Snippet")
  var query = new Parse.Query(Snippet)
  query.get(id, {
    success: function (snippet) {
      res.render('index', { snippet: snippet })
    },
    error: function (object, error) {
      throw error
    }
  })
})

app.listen();
