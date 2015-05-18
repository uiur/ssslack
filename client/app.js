/* global Parse */
require('es5-shim')

Parse.initialize('d0AdLsVEqFJsTX9XTuoz3YXluUVZ6mbRdOWM7ea6', 'ywwkjYyVSODKbZkH0G5Y4Ly7IqwWfahsWOPYfrHI')

var domready = require('domready')
var purify = require('dompurify')

var h = require('virtual-dom/h')
var createElement = require('virtual-dom/create-element')

var VNode = require('virtual-dom/vnode/vnode')
var VText = require('virtual-dom/vnode/vtext')

var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
})

function render (snippet) {
  var messages = snippet.messages.map(function (message) {
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
  })

  return h('article.snippet', messages)
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

fetchSnippet(window.location.pathname.slice(1), function (err, snippet) {
  if (err) { throw err }

  domready(function () {
    var tree = render(snippet.attributes)
    var rootNode = createElement(tree)

    var root = document.querySelector('#root')
    root.innerHTML = ''
    root.appendChild(rootNode)
  })
})
