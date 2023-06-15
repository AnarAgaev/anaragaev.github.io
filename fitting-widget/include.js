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
add('script','https://fandeco.ru/fitting/dist'); add('script','https://fandeco.ru/fitting/dist/@vite/client'); add('script','https://fandeco.ru/fitting/dist/src/main.tsx'); 

})()
