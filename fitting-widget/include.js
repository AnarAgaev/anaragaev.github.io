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
add('script','assets/index-92d3ee6e.js');
add('style','assets/index-8a71ac4d.css');
})()
