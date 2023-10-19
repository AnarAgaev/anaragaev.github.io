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
add('script','/assets/index-c2306a22.js'); 
add('style','/assets/index-130cc17a.css'); 
})()
