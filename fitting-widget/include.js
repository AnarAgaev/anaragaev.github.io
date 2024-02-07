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
add('script','/assets/index-8d4f669f.js'); add('script',''); 
add('style','/assets/index-ea5a1bee.css'); 
})()
