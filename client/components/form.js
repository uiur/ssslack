/* global Parse */
var hg = require('mercury')
var h = require('mercury').h

function Form () {
  return hg.state({
    title: hg.value(''),
    body: hg.value(''),
    channels: {
      body: setBody,
      title: setTitle
    }
  })
}

function setBody (state, data) {
  state.body.set(data.body)
}

function setTitle (state, data) {
  state.title.set(data.title)
}

function parse (str) {
  if (str.trim().length === 0) return []

  return str.trim().split('\n\n').map(function (message) {
    var header = message.split('\n')[0]
    var match = (/^(.+)\s*\[(.+)\]\s*$/).exec(header)

    if (!match) return

    var content = message.split('\n').slice(1).join('\n')

    return {
      sender: match[1],
      timestamp: match[2],
      content: content
    }
  }).filter(function (message) { return message })
}

Form.render = function (state) {
  var messages = parse(state.body)

  return h('form.post-form.container', [
    h('input.form-control.input-title', {
      type: 'text',
      name: 'title',
      value: state.title,
      placeholder: 'Title (optional)',
      'ev-event': hg.sendChange(state.channels.title)
    }),
    h('.row', [
      h('.col-md-6',
        h('textarea.form-control.input-body', {
          name: 'body',
          placeholder: 'Paste here',
          value: state.body,
          'ev-event': hg.sendValue(state.channels.body)
        })
      ),
      h('.col-md-6',
        h('.input-preview', renderMessages(messages))
      )
    ]),
    h('input.btn.btn-primary.btn-lg.post-form-submit', {
      type: 'submit',
      value: 'Private Post',
      'ev-click': function (e) {
        e.preventDefault()

        var Snippet = Parse.Object.extend('Snippet')
        var snippet = new Snippet()

        snippet.save({
          title: state.title,
          messages: messages
        }, {
          success: function (newSnippet) {
            window.location.href = '/' + newSnippet.id
          }
        })
      }
    })
  ])
}

function renderMessages (messages) {
  if (messages.length === 0) return

  return messages.map(function (message) {
    return h('.message.message-without-image', [
      h('span.sender', message.sender),
      h('span.timestamp', message.timestamp),
      h('span.content', message.content)
    ])
  })
}

module.exports = Form
