var content = document.getElementById('content')

var toc = [
  { name: '00-intro', title: 'Introduction', slug: 'intro' }
]

var files = toc.reduce(function (entries, entry) {
  entries[entry.slug] = entry
  return entries
}, {})

page('/', index)
page('/chapters', chapters)
page('/chapters/:name', check, fetchPage, render)
page('404', notfound)
page('*', notfound)
page()

function index() {
  return get('preface', render)
}

function notfound() {
  render('Page Not Found')
}

function chapters() {
  var frag = document.createDocumentFragment()

  toc.forEach(function (entry) {
    var li = document.createElement('li')
    var h3 = document.createElement('h3')
    var a = document.createElement('a')
    a.href = '/chapters/' + entry.slug
    a.textContent = entry.title

    h3.appendChild(a)
    li.appendChild(h3)
    frag.appendChild(li)
  })

  content.innerHTML = ''
  content.appendChild(frag)
}

function render(html) {
  content.innerHTML = html
}

function check(ctx, next) {
  var exists = !!files[ctx.params.name]

  if (!exists) {
    page.redirect('404')
  } else {
    next()
  }
}

function fetchPage(ctx) {
  get(files[ctx.params.name].name, render)
}

function get(name, cb) {
  var name = '/' + name + '.html'
  fetch(name)
    .then(function (response) {
      return response.text()
    })
    .then(cb)
}
