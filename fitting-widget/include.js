(function() {
function add(type, value) {
let element
if(type === 'script') {
element = document.createElement('script')
element.type = 'module'
element.crossorigin = true
element.src = value
}
if(type === 'style') {
element = document.createElement('link')
element.rel = 'stylesheet'
element.href = value
}
document.body.appendChild(element)
}
add('script','assets/index-c20a865b.js');
add('style','assets/index-f88f29d6.css');
})()
