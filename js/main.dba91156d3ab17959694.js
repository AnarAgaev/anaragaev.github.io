!function(e){function t(t){for(var o,a,l=t[0],s=t[1],c=t[2],u=0,m=[];u<l.length;u++)a=l[u],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&m.push(i[a][0]),i[a]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);for(d&&d(t);m.length;)m.shift()();return r.push.apply(r,c||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,l=1;l<n.length;l++){var s=n[l];0!==i[s]&&(o=!1)}o&&(r.splice(t--,1),e=a(a.s=n[0]))}return e}var o={},i={0:0},r=[];function a(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=o,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)a.d(n,o,function(t){return e[t]}.bind(null,o));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/";var l=window.webpackJsonp=window.webpackJsonp||[],s=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var d=s;r.push([1,1]),n()}([,function(e,t,n){"use strict";n.r(t);n(2),n(3),n(5),n(7)},function(e,t){if(document.addEventListener("DOMContentLoaded",(function(){var e=document.body,t=document.querySelectorAll(".products__link.drop"),n=document.querySelectorAll(".nav__item.drop"),o=document.getElementsByClassName("faq__item"),i=window.innerWidth;window.addEventListener("resize",(function(n){i=window.innerWidth,c(i>=768),y(i>=1250),u(i>=768);for(var o=0;o<t.length;++o)t[o].parentElement.classList.remove("visible");e.classList.remove("phone-visible"),e.classList.remove("nav-visible")}));document.getElementById("headerPhoneBtn").addEventListener("click",(function(){e.classList.toggle("phone-visible"),e.classList.remove("nav-visible"),r()}));document.getElementById("navTgglr").addEventListener("click",(function(){e.classList.toggle("nav-visible"),e.classList.remove("phone-visible"),r()}));var r=function(){for(var e=0;e<t.length;++e)t[e].parentElement.classList.remove("visible");for(var o=0;o<n.length;++o)n[o].classList.remove("visible")},a=document.getElementById("cart"),l=document.getElementById("headerBottom"),s=document.getElementById("headerTop").firstChild,c=function(e){e?s.appendChild(a):l.appendChild(a)};c(i>=768);var d=document.getElementById("operating"),u=function(t){t?l.appendChild(d):e.prepend(d)};u(i>=768);var m=document.getElementById("headerBottomContainer"),v=document.getElementById("headerTopNav"),f=document.getElementById("nav"),p=document.getElementById("region"),g=document.getElementById("logo"),y=function(e){e?(g.after(f),p.after(v)):(f.appendChild(v),m.prepend(f))};if(y(i>=1250),i<=1250){for(var b=0;b<t.length;++b)t[b].addEventListener("click",(function(e){e.preventDefault();var t=e.target.parentElement.classList,n=t.contains("visible");r(),n?t.remove("visible"):t.add("visible")}));for(var h=0;h<n.length;++h)n[h].addEventListener("click",(function(e){var t=e.target.classList,n=t.contains("visible");r(),n?t.remove("visible"):t.add("visible")}))}var L=function(){for(var e=0;e<o.length;++e)o[e].classList.remove("visible")};if(o.length>0)for(var E=0;E<o.length;++E)o[E].addEventListener("click",(function(e){var t=e.target.closest("li"),n=t.classList.contains("visible");L(),n?t.classList.remove("visible"):t.classList.add("visible")}));for(var I=document.querySelectorAll(".label_file input"),w=function(e){var t=I[e].nextElementSibling;I[e].addEventListener("change",(function(e){t.innerHTML=e.target.value.split("\\").pop()}))},k=0;k<I.length;k++)w(k);for(var B=document.getElementsByClassName("btn-modal"),_=function(t,n){n?(e.classList.add("modal-open"),t.classList.add("show")):(e.classList.remove("modal-open"),t.classList.remove("show"))},O=0;O<B.length;O++)B[O].addEventListener("click",(function(e){e.preventDefault();var t=e.target.dataset.modalId,n=document.getElementById(t);n&&(n.querySelector(".modal__close").addEventListener("click",(function(){return _(n,!1)})),n.addEventListener("click",(function(e){e.target.id===t&&_(n,!1)})),_(n,!0))}));var S=document.querySelector(".product .description__toggler");if(S){var P=S.closest(".description");S.addEventListener("click",(function(){P.classList.toggle("show"),"Развернуть"===S.innerHTML?S.innerHTML="Свернуть":S.innerHTML="Развернуть"}))}})),document.getElementById("map")){ymaps.ready((function(){var e=new ymaps.Map("map",{center:[54.90063335092027,51.65889470515492],zoom:4,controls:[]}),t=new ymaps.Placemark([55.76,37.64],{},{iconLayout:"default#image",iconImageHref:"/img/placemark-asfaltobeton.png",iconImageSize:[200,43],iconImageOffset:[-16,-43]}),n=new ymaps.Placemark([56.78875104810377,60.60157099999987],{},{iconLayout:"default#image",iconImageHref:"/img/placemark-ekaterinburg.png",iconImageSize:[236,43],iconImageOffset:[-15,-43]}),o=new ymaps.Placemark([52.60358425779388,39.59623749999995],{},{iconLayout:"default#image",iconImageHref:"/img/placemark-lipeck.png",iconImageSize:[183,43],iconImageOffset:[-15,-43]});e.geoObjects.add(t).add(n).add(o),e.controls.add("zoomControl",{size:"small"}),e.behaviors.disable("scrollZoom")}))}},,,,,function(e,t,n){var o=n(8);"string"==typeof o&&(o=[[e.i,o,""]]);var i={insert:"head",singleton:!1};n(0)(o,i);o.locals&&(e.exports=o.locals)},function(e,t,n){}]);