/* global Parse */
var domready = require('domready')
var purify = require('dompurify')

var h = require('virtual-dom/h')
var createElement = require('virtual-dom/create-element')

var hg = require('mercury')

var autolinker = require('autolinker')

var VNode = require('virtual-dom/vnode/vnode')
var VText = require('virtual-dom/vnode/vtext')

var page = require('page')

var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
})

var Form = require('./components/form.js')

page('/new', function newSnippet () {
  hg.app(document.querySelector('#root'), Form(), Form.render)
})

page('/:id', function show (ctx) {
  var id = ctx.params.id

  fetchSnippet(id, function (err, snippet) {
    if (err) { throw err }

    domready(function () {
      var tree = renderSnippet(snippet.attributes)
      var rootNode = createElement(tree)

      var root = document.querySelector('#root')
      root.innerHTML = ''
      root.appendChild(rootNode)
    })
  })
})

page()

function renderSnippet (snippet) {
  var messages = snippet.messages.map(function (message) {
    if (message.imageUrl) {
      // from chrome extension
      var image = h('img.image', { src: message.imageUrl })

      var pureContent = purify.sanitize(message.content, {
        ALLOWED_TAGS: ['a'],
        ALLOWED_ATTR: ['href'],
        ALLOW_DATA_ATTR: false
      })

      return h('.message', [image].concat([
        h('.right', [
          h('span.sender', message.sender),
          h('span.timestamp', message.timestamp),
          h('span.content', convertHTML('<span>' + pureContent + '</span>'))
        ])
      ]))
    } else {
      return h('.message.message-without-image', [
        h('span.sender', message.sender),
        h('span.timestamp', message.timestamp),
        h('span.content', convertHTML('<span>' + autolinker.link(message.content, { stripPrefix: false }) + '</span>'))
      ])
    }
  })

  var children = []
  if (snippet.title) {
    children.push(h('h1.title', snippet.title))
  }
  children.push(h('.messages', messages))

  return h('article.snippet', children)
}

function fetchSnippet (id, callback) {
  var Snippet = Parse.Object.extend('Snippet')
  var query = new Parse.Query(Snippet)

  query.get(id, {
    success: function (snippet) {
      callback(null, snippet)
    },
    error: function (object, error) {
      callback(error)
    }
  })
}
