'use strict';

/**
 * Clear phone of spaces, brackets,
 * dashes and plus sign. Leave only numbers.
 *
 * @param {string} phone - The phone, that needs to clear.
 * @returns {number} - Phone number as a number type.
 */
window.clearPhone = (phone) => {
    return parseInt(phone.replace(/\D/g, ""))
}

/**
 * Formatting number to the local value
 *
 * @param {string | number} number - Value for formatting.
 */

window.formatNumber = (number) => {
    const value = parseInt(number.toString().replace(/\s/g, ""))
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Getting get parameter from the url
 *
 * @param {string} name - The name of the search parameter.
 * @param {string} [url] - The URL address. If this parameter is not passed, then the search, by default, will occur in the current URL.
 */
window.getUrlParameterByName = function(name, url) {
    if (!name) return

    if (!url) url = window.location.href

    name = name.replace(/[\[\]]/g, "\\$&")

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);

        if (!results) return null

    if (!results[2]) return ''

    return decodeURIComponent(results[2].replace(/\+/g, " "))
}

// This lib is from here place https://tildoshnaya.com/modification/softscroll
! function () {
    var s, i, c, a, o = {
            frameRate: 150,
            animationTime: 400,
            stepSize: 100,
            pulseAlgorithm: !0,
            pulseScale: 4,
            pulseNormalize: 1,
            accelerationDelta: 50,
            accelerationMax: 3,
            keyboardSupport: !0,
            arrowScroll: 50,
            fixedBackground: !0,
            excluded: ""
        },
        p = o,
        u = !1,
        d = !1,
        n = {
            x: 0,
            y: 0
        },
        f = !1,
        m = document.documentElement,
        l = [],
        h = /^Mac/.test(navigator.platform),
        w = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            spacebar: 32,
            pageup: 33,
            pagedown: 34,
            end: 35,
            home: 36
        },
        v = {
            37: 1,
            38: 1,
            39: 1,
            40: 1
        };

    function y() {
        if (!f && document.body) {
            f = !0;
            var e = document.body,
                t = document.documentElement,
                o = window.innerHeight,
                n = e.scrollHeight;
            if (m = 0 <= document.compatMode.indexOf("CSS") ? t : e, s = e, p.keyboardSupport && Y("keydown", x), top != self) d = !0;
            else if (Q && o < n && (e.offsetHeight <= o || t.offsetHeight <= o)) {
                var r, a = document.createElement("div");
                a.style.cssText = "position:absolute; z-index:-10000; top:0; left:0; right:0; height:" + m.scrollHeight + "px", document.body.appendChild(a), c = function () {
                    r = r || setTimeout(function () {
                        u || (a.style.height = "0", a.style.height = m.scrollHeight + "px", r = null)
                    }, 500)
                }, setTimeout(c, 10), Y("resize", c);
                if ((i = new R(c)).observe(e, {
                        attributes: !0,
                        childList: !0,
                        characterData: !1
                    }), m.offsetHeight <= o) {
                    var l = document.createElement("div");
                    l.style.clear = "both", e.appendChild(l)
                }
            }
            p.fixedBackground || u || (e.style.backgroundAttachment = "scroll", t.style.backgroundAttachment = "scroll")
        }
    }
    var b = [],
        g = !1,
        r = Date.now();

    function S(d, f, m) {
        if (function (e, t) {
                e = 0 < e ? 1 : -1, t = 0 < t ? 1 : -1, n.x === e && n.y === t || (n.x = e, n.y = t, b = [], r = 0)
            }(f, m), 1 != p.accelerationMax) {
            var e = Date.now() - r;
            if (e < p.accelerationDelta) {
                var t = (1 + 50 / e) / 2;
                1 < t && (t = Math.min(t, p.accelerationMax), f *= t, m *= t)
            }
            r = Date.now()
        }
        if (b.push({
                x: f,
                y: m,
                lastX: f < 0 ? .99 : -.99,
                lastY: m < 0 ? .99 : -.99,
                start: Date.now()
            }), !g) {
            var o = q(),
                h = d === o || d === document.body;
            null == d.$scrollBehavior && function (e) {
                var t = M(e);
                if (null == B[t]) {
                    var o = getComputedStyle(e, "")["scroll-behavior"];
                    B[t] = "smooth" == o
                }
                return B[t]
            }(d) && (d.$scrollBehavior = d.style.scrollBehavior, d.style.scrollBehavior = "auto");
            var w = function (e) {
                for (var t = Date.now(), o = 0, n = 0, r = 0; r < b.length; r++) {
                    var a = b[r],
                        l = t - a.start,
                        i = l >= p.animationTime,
                        c = i ? 1 : l / p.animationTime;
                    p.pulseAlgorithm && (c = F(c));
                    var s = a.x * c - a.lastX >> 0,
                        u = a.y * c - a.lastY >> 0;
                    o += s, n += u, a.lastX += s, a.lastY += u, i && (b.splice(r, 1), r--)
                }
                h ? window.scrollBy(o, n) : (o && (d.scrollLeft += o), n && (d.scrollTop += n)), f || m || (b = []), b.length ? j(w, d, 1e3 / p.frameRate + 1) : (g = !1, null != d.$scrollBehavior && (d.style.scrollBehavior = d.$scrollBehavior, d.$scrollBehavior = null))
            };
            j(w, d, 0), g = !0
        }
    }

    function e(e) {
        f || y();
        var t = e.target;
        if (e.defaultPrevented || e.ctrlKey) return !0;
        if (N(s, "embed") || N(t, "embed") && /\.pdf/i.test(t.src) || N(s, "object") || t.shadowRoot) return !0;
        var o = -e.wheelDeltaX || e.deltaX || 0,
            n = -e.wheelDeltaY || e.deltaY || 0;
        h && (e.wheelDeltaX && K(e.wheelDeltaX, 120) && (o = e.wheelDeltaX / Math.abs(e.wheelDeltaX) * -120), e.wheelDeltaY && K(e.wheelDeltaY, 120) && (n = e.wheelDeltaY / Math.abs(e.wheelDeltaY) * -120)), o || n || (n = -e.wheelDelta || 0), 1 === e.deltaMode && (o *= 40, n *= 40);
        var r = z(t);
        return r ? !! function (e) {
            if (!e) return;
            l.length || (l = [e, e, e]);
            e = Math.abs(e), l.push(e), l.shift(), clearTimeout(a), a = setTimeout(function () {
                try {
                    localStorage.SS_deltaBuffer = l.join(",")
                } catch (e) {}
            }, 1e3);
            var t = 120 < e && P(e),
                o = !P(120) && !P(100) && !t;
            return e < 50 || o
        }(n) || (1.2 < Math.abs(o) && (o *= p.stepSize / 120), 1.2 < Math.abs(n) && (n *= p.stepSize / 120), S(r, o, n), e.preventDefault(), void C()) : !d || !W || (Object.defineProperty(e, "target", {
            value: window.frameElement
        }), parent.wheel(e))
    }

    function x(e) {
        var t = e.target,
            o = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== w.spacebar;
        document.body.contains(s) || (s = document.activeElement);
        var n = /^(button|submit|radio|checkbox|file|color|image)$/i;
        if (e.defaultPrevented || /^(textarea|select|embed|object)$/i.test(t.nodeName) || N(t, "input") && !n.test(t.type) || N(s, "video") || function (e) {
                var t = e.target,
                    o = !1;
                if (-1 != document.URL.indexOf("www.youtube.com/watch"))
                    do {
                        if (o = t.classList && t.classList.contains("html5-video-controls")) break
                    } while (t = t.parentNode);
                return o
            }(e) || t.isContentEditable || o) return !0;
        if ((N(t, "button") || N(t, "input") && n.test(t.type)) && e.keyCode === w.spacebar) return !0;
        if (N(t, "input") && "radio" == t.type && v[e.keyCode]) return !0;
        var r = 0,
            a = 0,
            l = z(s);
        if (!l) return !d || !W || parent.keydown(e);
        var i = l.clientHeight;
        switch (l == document.body && (i = window.innerHeight), e.keyCode) {
            case w.up:
                a = -p.arrowScroll;
                break;
            case w.down:
                a = p.arrowScroll;
                break;
            case w.spacebar:
                a = -(e.shiftKey ? 1 : -1) * i * .9;
                break;
            case w.pageup:
                a = .9 * -i;
                break;
            case w.pagedown:
                a = .9 * i;
                break;
            case w.home:
                l == document.body && document.scrollingElement && (l = document.scrollingElement), a = -l.scrollTop;
                break;
            case w.end:
                var c = l.scrollHeight - l.scrollTop - i;
                a = 0 < c ? 10 + c : 0;
                break;
            case w.left:
                r = -p.arrowScroll;
                break;
            case w.right:
                r = p.arrowScroll;
                break;
            default:
                return !0
        }
        S(l, r, a), e.preventDefault(), C()
    }

    function t(e) {
        s = e.target
    }
    var k, D, M = (k = 0, function (e) {
            return e.uniqueID || (e.uniqueID = k++)
        }),
        E = {},
        T = {},
        B = {};

    function C() {
        clearTimeout(D), D = setInterval(function () {
            E = T = B = {}
        }, 1e3)
    }

    function H(e, t, o) {
        for (var n = o ? E : T, r = e.length; r--;) n[M(e[r])] = t;
        return t
    }

    function z(e) {
        var t = [],
            o = document.body,
            n = m.scrollHeight;
        do {
            var r = (!1 ? E : T)[M(e)];
            if (r) return H(t, r);
            if (t.push(e), n === e.scrollHeight) {
                var a = O(m) && O(o) || X(m);
                if (d && L(m) || !d && a) return H(t, q())
            } else if (L(e) && X(e)) return H(t, e)
        } while (e = e.parentElement)
    }

    function L(e) {
        return e.clientHeight + 10 < e.scrollHeight
    }

    function O(e) {
        return "hidden" !== getComputedStyle(e, "").getPropertyValue("overflow-y")
    }

    function X(e) {
        var t = getComputedStyle(e, "").getPropertyValue("overflow-y");
        return "scroll" === t || "auto" === t
    }

    function Y(e, t, o) {
        window.addEventListener(e, t, o || !1)
    }

    function A(e, t, o) {
        window.removeEventListener(e, t, o || !1)
    }

    function N(e, t) {
        return e && (e.nodeName || "").toLowerCase() === t.toLowerCase()
    }
    if (window.localStorage && localStorage.SS_deltaBuffer) try {
        l = localStorage.SS_deltaBuffer.split(",")
    } catch (e) {}

    function K(e, t) {
        return Math.floor(e / t) == e / t
    }

    function P(e) {
        return K(l[0], e) && K(l[1], e) && K(l[2], e)
    }
    var $, j = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e, t, o) {
            window.setTimeout(e, o || 1e3 / 60)
        },
        R = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
        q = ($ = document.scrollingElement, function () {
            if (!$) {
                var e = document.createElement("div");
                e.style.cssText = "height:10000px;width:1px;", document.body.appendChild(e);
                var t = document.body.scrollTop;
                document.documentElement.scrollTop, window.scrollBy(0, 3), $ = document.body.scrollTop != t ? document.body : document.documentElement, window.scrollBy(0, -3), document.body.removeChild(e)
            }
            return $
        });

    function V(e) {
        var t;
        return ((e *= p.pulseScale) < 1 ? e - (1 - Math.exp(-e)) : (e -= 1, (t = Math.exp(-1)) + (1 - Math.exp(-e)) * (1 - t))) * p.pulseNormalize
    }

    function F(e) {
        return 1 <= e ? 1 : e <= 0 ? 0 : (1 == p.pulseNormalize && (p.pulseNormalize /= V(1)), V(e))
    }
    var I = window.navigator.userAgent,
        _ = /Edge/.test(I),
        W = /chrome/i.test(I) && !_,
        U = /safari/i.test(I) && !_,
        G = /mobile/i.test(I),
        J = /Windows NT 6.1/i.test(I) && /rv:11/i.test(I),
        Q = U && (/Version\/8/i.test(I) || /Version\/9/i.test(I)),
        Z = (W || U || J) && !G,
        ee = !1;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, "passive", {
            get: function () {
                ee = !0
            }
        }))
    } catch (e) {}
    var te = !!ee && {
            passive: !1
        },
        oe = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

    function ne(e) {
        for (var t in e) o.hasOwnProperty(t) && (p[t] = e[t])
    }
    oe && Z && (Y(oe, e, te), Y("mousedown", t), Y("load", y)), ne.destroy = function () {
        i && i.disconnect(), A(oe, e), A("mousedown", t), A("keydown", x), A("resize", c), A("load", y)
    }, window.SmoothScrollOptions && ne(window.SmoothScrollOptions), "function" == typeof define && define.amd ? define(function () {
        return ne
    }) : "object" == typeof exports ? module.exports = ne : window.SmoothScroll = ne
}();
/**
 * Smoothly scrolls the page to the specified position.
 *
 * @param {number} position - The position to scroll to.
 * @param {number} [duration=500] - The duration of the animation in milliseconds.
 */
function smoothScrollTo(position, duration = 500) {
    const startPosition = window.pageYOffset
    const distance = position - startPosition
    let startTimestamp = null

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp

        const progress = timestamp - startTimestamp
        const scrollY = easeInOutCubic(progress, startPosition, distance, duration)

        window.scrollTo(0, scrollY)

        if (progress < duration) {
            window.requestAnimationFrame(step)
        }
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d
        t--
        return c * (t * t * t + 1) + b
    }

    window.requestAnimationFrame(step)
}

window.throttle = (func, ms) => {
    let isThrottled = false,
        savedArgs,
        savedThis

    function wrapper() {

        if (isThrottled) { // 2
            savedArgs = arguments
            savedThis = this
            return
        }

        func.apply(this, arguments) // 1

        isThrottled = true

        setTimeout(function() {
            isThrottled = false // 3
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs)
                savedArgs = savedThis = null
            }
        }, ms)
    }

    return wrapper
}
/**
 * Email address verification
 *
 * @param {string} email - The email, that needs to validating.
 */
window.validateEmail = (email) => {
    // Regular expression for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Phone number verification
 *
 * @param {string} phone - The phone, that needs to validating.
 */
window.validatePhone = (phone) => {
    // Regular expression for phone
    const phoneRegex = /^7\d{10}$/
    return phoneRegex.test(phone)
}

const initToggleVisibleFormPass = () => {
    const btns = Array.from(document.querySelectorAll('.toggle-visible-pass'))

    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        const input = this.parentElement.querySelector('input')
        const isText = input.type === 'text'

        input.type = isText ? 'password' : 'text'
        this.classList.toggle('pass-visible')
    }))
}

// const resetErrorOnAccountFormController = (inputNode) => {
//     const container = inputNode.closest('label')
//     container.classList.remove('has-error')
// }

// const setErrorOnAccountFormController = (inputNode, errorText) => {
//     const container = inputNode.closest('label')
//     const message = container.querySelector('.error-message')

//     container.classList.add('has-error')
//     message.innerText = errorText

//     inputNode.addEventListener('input', () => {
//         container.classList.remove('has-error')
//     })
// }

// const initAccountForm = () => {
//     const forms = Array.from(document.querySelectorAll('.account-form__form'))
//     if (forms.length === 0) return

//     forms.forEach(form => form.addEventListener('submit', function(e) {
//         e.preventDefault()

//         const formValid = {email: true, pass: true, }
//         const email = this.querySelector('[name="email"]')
//         const pass  = this.querySelector('[name="pass"]')
//         const formType = this.dataset.formType

//         resetErrorOnAccountFormController(email)
//         if (formType !== 'recovery') {
//             resetErrorOnAccountFormController(pass)
//         }

//         // Check email
//         if (email.value !== '') {
//             if (window.validateEmail(email.value)) {
//                 formValid.email = true
//             } else {
//                 setErrorOnAccountFormController(email, 'Некорректный адрес электронной почты!')
//                 formValid.email = false
//             }
//         } else {
//             setErrorOnAccountFormController(email, 'Необходимо указать адрес электронной почты!')
//             formValid.email = false
//         }

//         // Check pass
//         if (formType !== 'recovery') {
//             if (pass.value.length < 8) {
//                 setErrorOnAccountFormController(pass, 'Некорректный пароль. Длинна пароля должна быть не менее 8 символов!')
//                 formValid.pass = false
//             }
//         }

//         // Senging form data
//         if (formValid.email && formValid.pass) {
//             const formData = new FormData(form);

//             // Обязательно удалить после внедрения
//             for (let [name, value] of formData) {
//                 console.log(`${name}: ${value}`);
//             }

//             console.log('Fetching request for updating user data');
//         }
//     }))
// }

window.addEventListener('load', () => {
    // initAccountForm()
    initToggleVisibleFormPass()
})
// Add product to favorites
const addToFavoritesClickHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const _this = e.target
    const isSelected = _this.classList.contains('selected')
    const title = _this.dataset.title
    const message = _this.dataset.message
    const headerFavorites = document
        .querySelector('.header__buttons-link_favorites .header__buttons-count')
    const currentFavorutesCount = parseInt(headerFavorites.innerText)

    if (!isSelected) {
        _this.classList.add('selected')
        headerFavorites.innerText = currentFavorutesCount + 1
        headerFavorites.classList.add('selected')
        setTimeout(() => headerFavorites.classList.remove('selected'), 1000)

        showModalMsg(title, message)

        console.error('Async query to ADD selected product to Favorites');
        return
    }

    _this.classList.remove('selected')
    headerFavorites.innerText = currentFavorutesCount - 1
    console.error('Async query to DELETE selected product from Favorites');
}

const initAddToFavorites = () => {
    const btns = Array.from(document
        .querySelectorAll('.product-item__favorites'))

    btns.forEach(btn => btn.addEventListener('click', addToFavoritesClickHandler))
}

// Add product to cart
const addToCartClickHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const _this = e.target
    const isSelected = _this.classList.contains('selected')
    const title = _this.dataset.title
    const message = _this.dataset.message

    if (!isSelected) {
        _this.classList.add('selected')
        showModalMsg(title, message)

        // Push current product to Cart Global Object (window.CART)
        window.addProductToCart({ art: _this.dataset.productId, count: 1 })

        return
    }

    _this.classList.remove('selected')
    showModalMsg(title, 'Удален из корзины')

    // Remove current product from Cart Global Object (window.CART)
    window.removeProductFromCart({ art: _this.dataset.productId, count: 1 })
}
const initAddToCart = () => {
    const btns = Array.from(document
        .querySelectorAll('.product-item__cart'))

    btns.forEach(btn => btn.addEventListener('click', addToCartClickHandler))
}

window.addEventListener('load', () => {
    initAddToFavorites()
    initAddToCart()
})

const resetAllCardsPics = (node) => {
    const pics = Array.from(node.querySelectorAll('.cards-series__pic'))
    pics.forEach(node => node.classList.remove('active'))
}

const resetAllCardsTabs = (node) => {
    const tabs = Array.from(node.querySelectorAll('.cards-series__tab'))
    tabs.forEach(node => node.classList.remove('active'))
}

const getTargetCrdsPic = (node, dataTargetTypeVal) => {
    return node.querySelector(`[data-type=${dataTargetTypeVal}]`)
}

const initCardsTab = () => {
    const tabArr = Array.from(document
        .querySelectorAll('.cards-series__tab'))

    tabArr.forEach(node => {
        node.addEventListener('click', function(e) {
            e.preventDefault()
            e.stopPropagation()

            if (this.classList.contains('active')) return

            const paretn = this.closest('.cards-series__item')
            const targetPicType = this.dataset.targetType
            const targetPic = getTargetCrdsPic(paretn, targetPicType)

            // Set active tab
            resetAllCardsTabs(paretn)
            this.classList.add('active')


            // Set active image
            if (targetPic) {
                resetAllCardsPics(paretn)
                targetPic.classList.add('active')
            }
        })
    })
}

window.addEventListener('load', () => {
    initCardsTab()
})

// Filters
const showNoFilterMsg = () => {
    const msg = document.querySelector('.description__msg')

    if (!msg) return

    msg.classList.add('display')
    setTimeout(() => msg.classList.add('visible'), 100)
}

const hideNoFilterMsg = () => {
    const msg = document.querySelector('.description__msg')

    if (!msg) return

    msg.classList.remove('visible')
    msg.classList.remove('display')
}

const checkNoFilterMsg = () => {
    const items = document
        .querySelectorAll('[data-filter]:not(.hide)')

    items.length === 0
        ? showNoFilterMsg()
        : hideNoFilterMsg()
}

const hideFilterlist = (filterList) => {
    filterList.forEach(filter => {
        filter.classList.remove('dropped')
        setTimeout(() => filter.classList.remove('active'), 300)
    })
}

const showFilterDrop = (node) => {
    node.classList.add('active')
    setTimeout(() => node.classList.add('dropped'), 10)
}

const hideFilterDrop = (node) => {
    const filters = Array.from(document.querySelectorAll('.filters__item'))

    if (!node) {
        hideFilterlist(filters)
        return
    }
    const cleanedFilters = filters.filter(filter => filter !== node);
    hideFilterlist(cleanedFilters)
}

const initFiltersDrop = () => {
    const fitlers = Array.from(document
        .querySelectorAll('.filters__list .filters__item'))

    fitlers.forEach(filter => {
        filter.addEventListener('click', function() {
            const isActive = this.classList.contains('active')

            if (isActive) {
                hideFilterDrop()
                return
            }

            hideFilterDrop(this)
            showFilterDrop(this)
        })
    })
}

const initFiltersReset = () => {
    const isPageCatalog = document.querySelector('.page-catalog')
    if (isPageCatalog) return

    const reset = document.querySelector('.filters__reset .filters__item')

    if (!reset) return

    const filteredSection = document
        .querySelectorAll('.section_filtered')

    reset.addEventListener('click', function() {
        const container = this.closest('.filters')

        const siblingFilters = container
            .querySelectorAll('.filters__list .filters__item')

        const options = Array.from(document
            .querySelectorAll('.filters__options'))

        const controllers = Array.from(document
            .querySelectorAll('.filters input[type="radio"]:not([value="reset"])'))

        const cards = Array.from(document.querySelectorAll('[data-filter]'))

        const deletedTypes = JSON.parse(document
            .querySelector('[data-deleted-types]')
            .dataset.deletedTypes)

        hideFilterlist(siblingFilters)
        spinner.show()
        filteredSection.forEach(el => el.classList.add('filtering'))
        options.forEach(el => el.classList.remove('checked')) // hide rset option button
        controllers.forEach(controller => controller.checked = false) // reset all input controllers
        resetAllControllersInItems()
        reset.closest('.filters__reset').classList.add('disabled')

        setTimeout(() => {
            // show hidden cards as delete data-display attributes
            cards.forEach(card => {
                for (const type of deletedTypes) {
                    card.removeAttribute(`data-display-${type}`)
                    card.classList.remove('hide')
                }
            })

            checkFilteredSection()
        }, 1000)
    })
}

const checkFilteredSection = () => {
    const sections = Array.from(document.querySelectorAll('.section_filtered'))

    sections.forEach(section => {
        const filteredItems = Array.from(section.querySelectorAll('[data-filter]'))
        const shownItems = filteredItems.filter(i => !i.classList.contains('hide'))

        if (shownItems.length === 0) {
            section.classList.add('hide')
        } else {
            section.classList.remove('hide')
        }
    })

    spinner.hide()
    sections.forEach(el => el.classList.remove('filtering'))

    showAnimElements()
    setAnimationElms()
    checkNoFilterMsg()
}

const hasDataDisplayAttribute = (node) => {
    const attributes = node.attributes

    let hasDataDisplayAttribute = false

    for (let i = 0; i < attributes.length; i++) {
        const attributeName = attributes[i].name

        if (attributeName.startsWith('data-display')) {
            hasDataDisplayAttribute = true
            break
        }
    }

    return hasDataDisplayAttribute
}

const checkFilteredItem = (prop, val) => {
    const items = Array.from(document.querySelectorAll('[data-filter]'))

    setTimeout(() => {
        items.forEach(i => {
            const data = JSON.parse(i.dataset.filter)
            const isArray = Array.isArray(data[prop])

            const isMatched = isArray
                ? data[prop].includes(val)
                : data[prop] === val


            if (isMatched) {
                i.removeAttribute(`data-display-${prop}`)
                if (!hasDataDisplayAttribute(i)) i.classList.remove('hide')
            } else {
                i.classList.add('hide')
                i.setAttribute(`data-display-${prop}`, false)
            }

            checkFilteredSection()
        })
    }, 1000)
}

const activeColorInItem = (val) => {
    const items = Array.from(document
        .querySelectorAll(`[data-target-type="${val}"]`))

    items.forEach(i => i.click())
}

const initFilterSelect = () => {
    const isPageCatalog = document.querySelector('.page-catalog')
    if (isPageCatalog) return

    const controllers = Array.from(document
        .querySelectorAll('.filters input[type="radio"]:not([value="reset"])'))

    const filteredSection = document.querySelectorAll('.section_filtered')

    const resetBtn = document.querySelector('.filters__reset')

    controllers.forEach(el => el.addEventListener('change', function(e) {
        e.preventDefault()
        e.stopPropagation()

        filteredSection.forEach(el => el.classList.add('filtering'))
        spinner.show()
        checkFilteredItem(this.name, this.value)
        activeColorInItem(this.value)
        this.closest('.filters__options').classList.add('checked')
        resetBtn.classList.remove('disabled')
    }))
}

const removeDataFitlerAtribute = (prop) => {
    const items = Array.from(document
        .querySelectorAll(`[data-display-${prop}]`))

    items.forEach(i => {
        i.removeAttribute(`data-display-${prop}`)
    })
}

const checkAllItemsHasDisplayAtributes = () => {
    const items = Array.from(document
        .querySelectorAll('[data-filter]'))

    items.forEach(i => {
        if (!hasDataDisplayAttribute(i)) {
            i.classList.remove('hide')
        }
    })
}

const resetAllControllersByName = (name) => {
    const items = Array.from(document.querySelectorAll(`[name=${name}]`))
    items.forEach(i => i.checked = false)
}

const resetAllControllersInItems = () => {
    const tabLists = Array.from(document
        .querySelectorAll('.cards-series__controls'))

    tabLists.forEach(list => {
        const firstTab = list.querySelector('.cards-series__tab')

        firstTab.click()
    })
}

const checkAllFitlerResetBtn = () => {
    const isCheckedFilter = document
        .querySelectorAll('.filters__list input:checked')

    const reset = document.querySelector('.filters__reset')

    isCheckedFilter.length === 0
        ? reset.classList.add('disabled')
        : reset.classList.remove('disabled')
}

const initResetFilterProp = () => {
    const isPageCatalog = document.querySelector('.page-catalog')
    if (isPageCatalog) return

    const controllers = Array.from(document
        .querySelectorAll('.filters input[value="reset"]'))
    const sections = document.querySelectorAll('.section_filtered')

    controllers.forEach(el => el.addEventListener('change', function(e) {
        e.preventDefault()
        e.stopPropagation()

        sections.forEach(el => el.classList.add('filtering'))
        spinner.show()
        this.closest('.filters__options').classList.remove('checked')

        setTimeout(() => {
            removeDataFitlerAtribute(this.name)
            checkAllItemsHasDisplayAtributes()
            checkFilteredSection()
            resetAllControllersByName(this.name)
            resetAllControllersInItems()
            checkAllFitlerResetBtn()
        }, 1000)
    }))
}

window.addEventListener('load', () => {
    initFiltersDrop()
    initFiltersReset()
    initFilterSelect()
    initResetFilterProp()
})
const initModal = () => {
    const btns = Array.from(document.querySelectorAll('[data-modal]'))

    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const target = this.dataset.modalTarget
        const action = this.dataset.modalAction

        switch (action) {
            case 'show':
                showModalBack()
                showModalDialog(target)
                break;
            case 'toggle':
                toggleModalDialog(target)
                break;
            case 'close':
                hideModalDialog()
                setTimeout(hideModalBack, 200)
                break;
        }
    }))
}

const showModalBack = () => {
    const back = document.querySelector('.modal__back')
    const body = document.querySelector('#body')

    body.classList.add('modal-open')
    back.classList.remove('hide')

    setTimeout(() => back.classList.add('show'), 10)
}

const hideModalBack = () => {
    const back = document.querySelector('.modal__back')
    const body = document.querySelector('#body')
    const header = document.querySelector('#header')

    if (!back) return

    body.classList.remove('modal-open')
    back.classList.remove('show')
    header.style.transition = 'none'

    setTimeout(() => {
        back.classList.add('hide')
        header.removeAttribute('style');
    }, 100)
}

const showModalDialog = (id) => {
    const target = document.querySelector(id)
    const dialog = target.querySelector('.modal__dialog')

    target.classList.remove('hide')
    setTimeout(() => {
        target.classList.add('show')
        dialog.classList.add('show')
    }, 10)
}

const hideModalDialog = () => {
    const target = document.querySelector('.modal.show')
    if (!target) return

    const dialog = target.querySelector('.modal__dialog')

    target.classList.remove('show')
    dialog.classList.remove('show')
    setTimeout(() => target.classList.add('hide'), 100)
}

const initCloseModal = () => {
    document.addEventListener('click', (e) => {
        const isOnPopupModal = e.target.closest('.modal__dialog')

        if(isOnPopupModal) return

        hideModalDialog()
        setTimeout(hideModalBack, 200)
    })
}

const toggleModalDialog = (id) => {
    const target = document.querySelector(id)
    const dialog = target.querySelector('.modal__dialog')

    hideModalDialog()

    setTimeout(() => target.classList.remove('hide'), 200)
    setTimeout(() => {
        target.classList.add('show')
        dialog.classList.add('show')
    }, 300)
}

const initToggleVisiblePass = () => {
    const btns = Array.from(document.querySelectorAll('.modal__toggle-visible-pass'))

    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        const input = this.parentElement.querySelector('input')
        const isText = input.type === 'text'

        input.type = isText ? 'password' : 'text'
        this.classList.toggle('pass-visible')
    }))
}

const showModal = (id) => {
    showModalBack()
    showModalDialog(id)
}

window.addEventListener('load', () => {
    initModal()
    initCloseModal()
    initToggleVisiblePass()
})
// Product information slider
let productInfoSlider

const initProductInfoSlider = () => {
    productInfoSlider = new Swiper('.product-info .swiper', {
        loop: false,
        // slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,

        // autoHeight: true,
        // spaceBetween: 10,

        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        },

        breakpoints: {
            576: {
                slidesPerView: 'auto',
            }
        }
    })
}

const checkProductInfoSlider = () => {
    if (window.innerWidth > 991) {
        if (productInfoSlider) {
            productInfoSlider.destroy(true, true)
            productInfoSlider = undefined
        }
        return
    }

    if (!productInfoSlider) {
        initProductInfoSlider()
    }
}

window.addEventListener('load', () => {
    const isProductPage = document.querySelector('.page-product')
    const isArticlePage = document.querySelector('.page-article')
    const isDotsPage = document.querySelector('.page-dots')

    // Initialize Info slider only for Product, Article and Dots pages
    if (!isProductPage && !isArticlePage && !isDotsPage) return

    checkProductInfoSlider()

    window.addEventListener('resize', () => {
        checkProductInfoSlider()
    })
})

// Product recommendation slider
let productRecommSlider

const checkRecommSliderScrollbar = (swiper, scrollbar) => {
    if (!scrollbar || scrollbar.style.display === 'none') return

    const isScrollbarHide = scrollbar.classList
        .contains('swiper-scrollbar-lock')

    isScrollbarHide
        ? swiper.classList.add('scroll-hidden')
        : swiper.classList.remove('scroll-hidden')
}

const checkSlidersBottomOffset = () => {
    const swipers = Array.from(document.querySelectorAll('.swiper'))

    swipers.forEach(swiper => {
        const scrollbar = swiper.querySelector('.swiper-scrollbar')
        checkRecommSliderScrollbar(swiper, scrollbar)
    })
}

const initProductRecommSlider = () => {
    productRecommSlider = new Swiper('.recommendation__slider .swiper', {
        loop: false,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        // autoHeight: true,

        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        },

        breakpoints: {
            576: {
                slidesPerView: 2,
                spaceBetween: 10,
            },

            991: {
                slidesPerView: 3,
                spaceBetween: 10,
            },
            1200: {
                slidesPerView: 'auto',
                spaceBetween: 0,
            }
        },
        on: {
            init: function () {
                const swiper = this.el
                const scrollbar = this.scrollbar.el
                checkRecommSliderScrollbar(swiper, scrollbar)
            }
        }
    })
}

const checkProductRecommSlider = () => {
    if (window.innerWidth > 1200 && productRecommSlider) {
        Array.isArray(productRecommSlider)
            ? productRecommSlider.forEach(slider => slider.destroy(true, true))
            : productRecommSlider.destroy(true, true)

        productRecommSlider = undefined
        return
    }

    if (!productRecommSlider) {
        initProductRecommSlider()
    }
}

window.addEventListener('load', () => {
    const isProductPage = document.querySelector('.page-product')
    const isArticlePage = document.querySelector('.page-article')
    const isDotsPage = document.querySelector('.page-dots')

    // Initialize Recommendation slider only for Product, Article and Dots pages
    if (!isProductPage && !isArticlePage && !isDotsPage) return

    checkProductRecommSlider()

    window.addEventListener('resize', () => {
        checkProductRecommSlider()
        checkSlidersBottomOffset()
    })
})

/**
 * Show a small message with title and text in the top right corner of the screen.
 * The method expects at least one parameter per input.
 *
 * @param {string} [title=undefined] - The headline of the message in one line.
 * @param {string} [message=undefined] - One line message text.
 */
window.showModalMsg = function(title = '', message = '') {
    if (!title && !message) {
        console.error("There's no title or message for showing in modal window.")
        return
    }

    if (typeof title !== 'string') {
        console.error("Incorrect type of title. It should be string.")
        return
    }

    if (typeof message !== 'string') {
        console.error("Incorrect type of message. It should be string.")
        return
    }

    const container = document.querySelector('.header__msg-container')
    const [card, body] = createModalMsgCard(title, message)

    container.appendChild(card)
    checkModalMsgContainer()
    card.classList.add('display')

    setTimeout(() => card.classList.add('uncollapsed'), 50)

    setTimeout(() => {
        body.classList.add('visible')
    }, 100)

    hideModalMsg(card, body, 5000)
}

function checkModalMsgContainer() {
    const container = document.querySelector('.header__msg-container')
    const innerElms = container.querySelectorAll('.modal-msg__card')

    innerElms.length > 0
        ? container.classList.add('display')
        : container.classList.remove('display')
}

function createModalMsgCard(title, message) {
    const card = document.createElement('div')
    card.classList.add('modal-msg__card')

    const body = document.createElement('div')
    body.classList.add('modal-msg__body')

    const icon = document.createElement('i')

    const content = document.createElement('div')
    content.classList.add('modal-msg__content')

    const caption = document.createElement('p')
    caption.textContent = title

    const text = document.createElement('span')
    text.textContent = message

    if (title) content.appendChild(caption)
    if (message) content.appendChild(text)

    body.appendChild(icon)
    body.appendChild(content)

    card.appendChild(body)

    card.addEventListener('click', hideModalMsgHandler)

    return [card, body]
}

function hideModalMsgHandler() {
    const card = this
    const body = card.querySelector('.modal-msg__body')
    hideModalMsg(card, body)
}

function hideModalMsg(card, body, timeout = 0) {
    setTimeout(() => {
        body.classList.add('hidden')
    }, timeout)

    setTimeout(() => {
        body.classList.remove('visible', 'hidden')
        card.classList.remove('uncollapsed')
    }, timeout + 100)

    setTimeout(() => {
        card.remove();
        checkModalMsgContainer()
    }, timeout + 200)
}

const showSpinner = () => {
    const spinner = document.getElementById('spinner')
    spinner.classList.add('display')
    setTimeout(() => spinner.classList.add('visible'), 100)
}

const hideSpinner = () => {
    const spinner = document.getElementById('spinner')
    spinner.classList.remove('visible')
    setTimeout(() => spinner.classList.remove('display'), 1000)
}

window.addEventListener('load', () => {
    if (document.getElementById('spinner')) {
        window.spinner.show = showSpinner
        window.spinner.hide = hideSpinner
    }
})
const showButtonScrollToTop = (button) => {
    const windowHeight = window.innerHeight
    const scrollTop = window.scrollY

    if (scrollTop > windowHeight) {
        button.classList.add('display')
    } else {
        button.classList.remove('display')
    }
}

const initScrollToTop = () => {
    const button = document.getElementById('scrollToTop')

    if (!button) return

    button.addEventListener('click', () => smoothScrollTo(0))
    window.addEventListener('scroll', () => showButtonScrollToTop(button))
}

window.addEventListener('load', () => {
    initScrollToTop()
})

// Open and close mobile navigation
window.addEventListener("load", () => {
    const navClose = Array.from(document.querySelectorAll('.header__nav-close'))
    const navToggler = document.querySelector('.footer__nav-link_menu')
    const headerNav = document.querySelector('.header__nav')
    const modalBack = document.querySelector('.header__modal-back')
    const navProdLink = document.querySelector('.header__nav-link_product')
    const navItems = Array.from(document.querySelectorAll('.header__nav-item_with-inner'))
    const navLinks = Array.from(document.querySelectorAll('.header__nav-link'))
    const navCollapses = Array.from(document.querySelectorAll('.header__nav-collapse'))

    if (!navToggler) return

    const toggleNav = (direction) => {
        if (direction) {
            document.body.classList.add('modal-open')
            navToggler.classList.add('active')
            headerNav.classList.add('open')
            // modalBack.classList.add('show')

            setTimeout(() => {
                navProdLink.click()
            }, 100)

            return
        }

        document.body.classList.remove('modal-open')
        navToggler.classList.remove('active')
        headerNav.classList.remove('open')
        modalBack.classList.remove('show')

        collapsAllNavItem()
    }

    // Click on navigation burger
    navToggler.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            toggleNav(false)
            return
        }

        toggleNav(true)
    })

    // Click on navigation close button
    navClose.forEach(btn => {
        btn.addEventListener('click', () =>toggleNav(false))
    })

    modalBack.addEventListener('click', () => {
        toggleNav(false)
    })

    // Open and close Navigation items
    const collapsAllNavItem = () => {
        navItems.forEach(i => i.classList.remove('dropped'))
        navLinks.forEach(i => i.classList.remove('active'))
        navCollapses.forEach(i => i.classList.remove('open'))
    }

    const toggleNavItem = (btn) => {
        const isActive = btn.classList.contains('active')

        collapsAllNavItem()

        if (!isActive) {
            btn.classList.add('active')

            const navItem = btn.closest('.header__nav-item_with-inner')

            if (navItem) {
                const navCollapse = navItem.querySelector('.header__nav-collapse')

                navItem.classList.add('dropped')
                navCollapse.classList.add('open')
                modalBack.classList.add('show')
            }
        }
    }

    navLinks.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleNavItem(this)
        })
    })
})

// Searching and Sticky header
window.addEventListener("load", () => {
    const header = document.querySelector('.header')
    const searchToggler = document.querySelector('.header__buttons-link_search')
    const searchClose = document.querySelector('.header__search-close')
    const searchPanel = document.querySelector('.header__search')
    const searchInput = document.querySelector('.header__search-input')
    const searchReset = document.querySelector('.header__search-reset')
    const searchHints = document.querySelector('.header__search-hints')

    if (!searchToggler) return

    const toggleSearchPanel = (hide = false) => {
        const isVisible = searchPanel.classList.contains('visible')
        const timeout = 100

        if (!isVisible && !hide) {
            searchPanel.classList.remove('disable')
            header.classList.add('header_with-search-panel')
            searchToggler.classList.add('active')

            setTimeout(() => {
                searchPanel.classList.add('visible')
            }, timeout)

            return
        }

        searchToggler.classList.remove('active')
        searchPanel.classList.remove('visible')

        if (window.innerWidth < 992) {
            searchHints.classList.remove('visible')
            searchReset.click()
            resetHandlerFormHelpersEventListeners()
        }

        setTimeout(() => {
            searchPanel.classList.add('disable')
            header.classList.remove('header_with-search-panel')
        }, 200)
    }

    searchToggler.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
    })

    searchClose.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
    })

    // const SEARCH_REQUEST_URL = 'https://anaragaev.github.io/technolight.layout/mocks/search.json'
    // const SEARCH_REQUEST_URL = 'https://test-technolightv2.massive.ru/api/product/search'
    const SEARCH_REQUEST_URL = '/api/product/search'
    const THROTTLE_TIMEOUT = 300
    let searchRequestTimeoutId

    const printQueryResult = (data) => {
        // Reset all children nodes of search hints
        while (searchHints.firstChild) {
            searchHints.removeChild(searchHints.firstChild)
        }

        const hints = document.createElement('div')
        hints.classList.add('header__search-links')

        for (const num in data) {
            const hint = data[num]
            const link = document.createElement('a')
            link.href = hint.url
            link.innerText = hint.title
            hints.appendChild(link)

            if (num > 8) break
        }

        searchHints.appendChild(hints)
        searchHints.classList.add('visible')
        setHandlerToHelpers()

        if (window.innerWidth < 992) {
            document.body.classList.add('modal-open')
        }
    }

    const fetchSearchingData = async(query) => {
        try {
            const res = await fetch(SEARCH_REQUEST_URL + `?query=${query}`)

            if (!res.ok) {
                throw new Error('Ошибка запроса поиска')
            }

            const data = await res.json()
            printQueryResult(data)

        } catch (error) {
            console.error(error)
        }
    }

    searchInput.addEventListener('input', function() {
        if (this.value === '' ) {
            searchReset.classList.remove('visible')
            searchHints.classList.remove('visible')
            clearTimeout(searchRequestTimeoutId)
            return
        }

        searchReset.classList.add('visible')

        // *** Fetching search requests and show results --- START
        clearTimeout(searchRequestTimeoutId)
        searchRequestTimeoutId = setTimeout(
            () => fetchSearchingData(this.value),
            THROTTLE_TIMEOUT
        )
        // *** Fetching search requests and show results --- FINISH
    })

    searchReset.addEventListener('click', (e) => {
        e.stopPropagation()
        searchReset.classList.remove('visible')
        searchHints.classList.remove('visible')
        resetHandlerFormHelpersEventListeners()
        document.body.classList.remove('modal-open')
    })

    document.addEventListener('click', e => {
        const isSearchToggle = e.target
            .closest('.header__buttons-link_search')

        const isSearchPanel = e.target
            .closest('.header__search')

        const isTuchDevice = window.innerWidth < 992

        if (!isTuchDevice && !isSearchPanel && !isSearchToggle) {
            toggleSearchPanel(true)
        }
    })

    // Set help text from helper button under the search input to the search value
    const requestCompletion = (e) => {
        const additionValue = e.target.innerText
        searchInput.value = `${searchInput.value} ${additionValue}`
    }

    const setHandlerToHelpers = () => {
        const searchHelpers = Array.from(document
            .querySelectorAll('.header__search-helps span'))

        searchHelpers.forEach(btn => btn
            .addEventListener('click', requestCompletion))
    }

    const resetHandlerFormHelpersEventListeners = () => {
        const searchHelpers = Array.from(document
            .querySelectorAll('.header__search-helps span'))

        searchHelpers.forEach(btn => {
            btn.removeEventListener('click', requestCompletion)
        })
    }

    // Sticky header
    let beforeScrollTop = 0

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight
        const header = document.getElementById("header")
        const headerHeight = header.clientHeight
        const delay = '.7s'

        let currentScrollTop = window.scrollY

        if (window.innerWidth > 991) {
            if (currentScrollTop > windowHeight) {
                    header.classList.add('compressed')
                } else {
                    header.classList.remove('compressed')
                }
            return
        }

        if (currentScrollTop > 100 && currentScrollTop > beforeScrollTop) {
            const isVisibleSearch = searchPanel
                .classList.contains('visible')

            let intervalId

            if (isVisibleSearch) {
                header.style.transitionDelay = delay
                toggleSearchPanel(true)
                intervalId = setInterval(() => {
                    header.style.transitionDelay = '0s'
                    clearInterval(intervalId)
                }, 1000)
            }

            header.style.top = `-${headerHeight}px`
        } else {
            header.style.top = 0
        }

        beforeScrollTop = window.pageYOffset
    });
})

// Cart update listening
const setCartUpdageListener = () => {
    const cartProductCountNode = document.querySelector('#cartProductCount')

    if (!cartProductCountNode) return

    cartProductCountNode.addEventListener('cartUpdateEvent', function(e) {

        const products = window.CART.products
        let productCount = 0

        for (const iterator of products) {
            productCount += iterator.count
        }

        cartProductCountNode.innerText = productCount
        cartProductCountNode.dataset.count = productCount.toString()
        cartProductCountNode.classList.add('selected')
        setTimeout(() => cartProductCountNode.classList.remove('selected'), 1000)

        console.log(e.detail.message)
    })
}

window.addEventListener('load', () => {
    setCartUpdageListener()
})

// Deleting blocking of all animation for fix animation artefacts
const removeAnimationBlocker = () => {
    Array.from(document.querySelectorAll('.transition-blocker'))
        .forEach(el => el.classList.remove('transition-blocker'))
}
window.addEventListener('load', removeAnimationBlocker)

// Blocking all animation at the window resizing process
const addAnimationBlocker = () => {
    document.body.classList.add('transition-blocker')
}

let blockAnimationTimer

window.addEventListener("resize", () => {
    clearTimeout(blockAnimationTimer)
    addAnimationBlocker()

    blockAnimationTimer = setTimeout(() => {
        removeAnimationBlocker()
    }, 300)
})

// Handle link with smooth animation to anchor place on the page
const smoothLinks = document.querySelectorAll('a[href^="#"]')
for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        const id = smoothLink.getAttribute('href')

        try {
            const targetNode = document.querySelector(`${id}`)
            const targetOffset = targetNode.offsetTop
            const deviceOffset = window.outerWidth > 768 ? -100 : -20

            smoothScrollTo(targetOffset + deviceOffset, 700)
        } catch (error) {
            console.error("There's no target node for scrolling to place. The selector isn't correct!");
            console.error(error)
        }
    })
};

// Animation items when user has scrolled screen to place of item
const checkAnimationElms = () => {
    const animationElms = Array.from(document
        .querySelectorAll('.animation-element'))

    return animationElms.length > 0
}

const showAnimElements = () => {
    const elms = Array.from(document
        .querySelectorAll('.animation-element'))

    const scrollTop = window.pageYOffset
    const windowHeight = window.innerHeight
    // const pointOfDisplay = windowHeight / 1.2 // for show on the half of the screen
    const pointOfDisplay = windowHeight

    elms.forEach(function (el) {
        const rect = el.getBoundingClientRect()
        const distanceFromTop = rect.top + window.pageYOffset

        if (distanceFromTop - pointOfDisplay < scrollTop) {
            el.classList.remove('animation-element')
        }
    })

    if (!checkAnimationElms()) {
        window.removeEventListener('scroll', showAnimElements)
    }
}

const setAnimationElms = () => {
    if (checkAnimationElms()) {
        window.addEventListener('scroll', showAnimElements)
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        showAnimElements()
        setAnimationElms()
    }, 100)
})

// Lazy croll on all page
//=require utils/SmoothScroll.min.js
window.addEventListener('load', () => {
    SmoothScroll({
        // Время скролла 400 = 0.4 секунды
        animationTime    : 800,
        // Размер шага в пикселях
        stepSize         : 75,

        // Дополнительные настройки:
        // Ускорение
        accelerationDelta : 30,
        // Максимальное ускорение
        accelerationMax   : 2,

        // Поддержка клавиатуры
        keyboardSupport   : true,
        // Шаг скролла стрелками на клавиатуре в пикселях
        arrowScroll       : 50,

        // Pulse (less tweakable)
        // ratio of "tail" to "acceleration"
        pulseAlgorithm   : true,
        pulseScale       : 4,
        pulseNormalize   : 1,

        // Поддержка тачпада
        touchpadSupport   : true,
    })
})


// Phone masking
const initPhonesMask = () => {
    const phoneIntpus = Array.from(document
        .querySelectorAll('[type="tel"]'))

    phoneIntpus.forEach(phone => {
        const phoneMaskOptions = {
            mask: '+{7} (000) 000-00-00',
            lazy: true,
            placeholderChar: '#'
        }
        const phoneMask = IMask(
            phone,
            phoneMaskOptions
        )

        phone.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
        phone.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))
    })
}

window.addEventListener('load', () => {
    initPhonesMask()
})

// Init cart custom Event
const cartEvent = new CustomEvent('cartUpdateEvent', {
    detail: {
        message: 'Fired cart product updated custom Event!'
    },
    bubbles: false,
    cancelable: false
})

// Methods for work with cart
window.setProductToCart = async ({art, count}) => {

    console.log('Размещаем фиксированное количество товара в корзине:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = await fetch('/ajax/cart/set', { // /ajax/cart/set --- https://anaragaev.github.io/technolight.layout/mocks/cart-set.json
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...data]

        console.log('Размещаем товары в корзине', data);

    } else {
        console.error('Ошибка размещения товара в Корзине! Код ошибки:', res.status)
    }
}

window.addProductToCart = async ({art, count}) => {

    console.log('Добавление товара в корзину:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = await fetch('/ajax/cart/add', { // /ajax/cart/add --- https://anaragaev.github.io/technolight.layout/mocks/cart-add.json
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...data]

        console.log('Добавление товара в корзину', data);

    } else {
        console.error('Ошибка добавления товара в Корзину! Код ошибки:', res.status)
    }
}

window.removeProductFromCart = async ({art, count}) => {

    console.log('Удаление товара из корзины:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = await fetch('/ajax/cart/del', { // /ajax/cart/del --- https://anaragaev.github.io/technolight.layout/mocks/cart-del.json
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...data]

        console.log('Удаление товара из корзины', data);

    } else {
        console.error('Ошибка удаления товара из Корзины! Код ошибки:', res.status)
    }
}


// Cart Proxy
const cartGet = (target, prop) => {
    return target[prop]
}

const cartSet = (target, prop, val) => {
    console.log('SETTING');
    console.log('target', target);
    console.log('prop', prop);
    console.log('val', val);

    if (prop === 'products') {
        target.products = [...val]

        // Dispathcing custom cart update Event
        const cartProductCountNode = document.querySelector('#cartProductCount')
        if (cartProductCountNode) cartProductCountNode.dispatchEvent(cartEvent)
    }

    return true
}

const initCart = async () => {

    console.log('window.CART before', window.CART);

    if (!window.CART) {
        const res = await fetch('/ajax/cart/get', { // /ajax/cart/get --- https://anaragaev.github.io/technolight.layout/mocks/cart-get.json
            method: 'POST'
        })

        if (res.ok) {
            const data = await res.json()

            window.CART = new Proxy({
                products: [...data]
            }, {
                get: cartGet,
                set: cartSet
            })


            console.log('Inicializing cart -------------------------- START');
            console.log('Response data', data)
            console.log('window.CART', window.CART)
            console.log('Inicializing cart -------------------------- FINISH');



        } else {
            console.error('Ошибка запроса Корзины! Код ошибки:', res.status)
        }
    }
}

window.addEventListener('load', () => {
    initCart()
})

window.cartUpdateInterval = setInterval(async () => {
    if (window.CART !== undefined) {
        const res = await fetch('/ajax/cart/get', { // /ajax/cart/get --- https://anaragaev.github.io/technolight.layout/mocks/cart-get.json
            method: 'POST',
        })
        if (res.ok) {
            const data = await res.json()
            window.CART.products = [...data];
        }
    }
}, 5000)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJmb3JtYXROdW1iZXIuanMiLCJnZXRVcmxQYXJhbWV0ZXJCeU5hbWUuanMiLCJTbW9vdGhTY3JvbGwubWluLmpzIiwic21vb3RoU2Nyb2xsVG8uanMiLCJ0aHJvdHRsZS5qcyIsInZhbGlkYXRlRW1haWwuanMiLCJ2YWxpZGF0ZVBob25lLmpzIiwiYWNjb3VudC1mb3Jtcy9zY3JpcHQuanMiLCJjYXJkcy1pdGVtL3NjcmlwdC5qcyIsImNhcmRzLXNlcmllcy9zY3JpcHQuanMiLCJmaWx0ZXJzL3NjcmlwdC5qcyIsIm1vZGFscy9zY3JpcHQuanMiLCJwcm9kdWN0LWluZm8vc2NyaXB0LmpzIiwicmVjb21tZW5kYXRpb24vc2NyaXB0LmpzIiwic2hvdy1tb2RhbC1tc2cvc2NyaXB0LmpzIiwic3Bpbm5lci9zY3JpcHQuanMiLCJzY3JvbGwtdG8tdG9wL3NjcmlwdC5qcyIsImZvb3Rlci9zY3JpcHQuanMiLCJoZWFkZXIvc2NyaXB0LmpzIiwibWFpbi5qcyIsImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25VQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDbGVhciBwaG9uZSBvZiBzcGFjZXMsIGJyYWNrZXRzLFxyXG4gKiBkYXNoZXMgYW5kIHBsdXMgc2lnbi4gTGVhdmUgb25seSBudW1iZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcGhvbmUgLSBUaGUgcGhvbmUsIHRoYXQgbmVlZHMgdG8gY2xlYXIuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gUGhvbmUgbnVtYmVyIGFzIGEgbnVtYmVyIHR5cGUuXHJcbiAqL1xyXG53aW5kb3cuY2xlYXJQaG9uZSA9IChwaG9uZSkgPT4ge1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KHBob25lLnJlcGxhY2UoL1xcRC9nLCBcIlwiKSlcclxufVxyXG4iLCIvKipcclxuICogRm9ybWF0dGluZyBudW1iZXIgdG8gdGhlIGxvY2FsIHZhbHVlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyfSBudW1iZXIgLSBWYWx1ZSBmb3IgZm9ybWF0dGluZy5cclxuICovXHJcblxyXG53aW5kb3cuZm9ybWF0TnVtYmVyID0gKG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUludChudW1iZXIudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMvZywgXCJcIikpXHJcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIiBcIik7XHJcbn1cclxuIiwiLyoqXHJcbiAqIEdldHRpbmcgZ2V0IHBhcmFtZXRlciBmcm9tIHRoZSB1cmxcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2VhcmNoIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtzdHJpbmd9IFt1cmxdIC0gVGhlIFVSTCBhZGRyZXNzLiBJZiB0aGlzIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCB0aGVuIHRoZSBzZWFyY2gsIGJ5IGRlZmF1bHQsIHdpbGwgb2NjdXIgaW4gdGhlIGN1cnJlbnQgVVJMLlxyXG4gKi9cclxud2luZG93LmdldFVybFBhcmFtZXRlckJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUsIHVybCkge1xyXG4gICAgaWYgKCFuYW1lKSByZXR1cm5cclxuXHJcbiAgICBpZiAoIXVybCkgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKVxyXG5cclxuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsXHJcblxyXG4gICAgaWYgKCFyZXN1bHRzWzJdKSByZXR1cm4gJydcclxuXHJcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSlcclxufVxyXG4iLCIvLyBUaGlzIGxpYiBpcyBmcm9tIGhlcmUgcGxhY2UgaHR0cHM6Ly90aWxkb3NobmF5YS5jb20vbW9kaWZpY2F0aW9uL3NvZnRzY3JvbGxcclxuISBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcywgaSwgYywgYSwgbyA9IHtcclxuICAgICAgICAgICAgZnJhbWVSYXRlOiAxNTAsXHJcbiAgICAgICAgICAgIGFuaW1hdGlvblRpbWU6IDQwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDEwMCxcclxuICAgICAgICAgICAgcHVsc2VBbGdvcml0aG06ICEwLFxyXG4gICAgICAgICAgICBwdWxzZVNjYWxlOiA0LFxyXG4gICAgICAgICAgICBwdWxzZU5vcm1hbGl6ZTogMSxcclxuICAgICAgICAgICAgYWNjZWxlcmF0aW9uRGVsdGE6IDUwLFxyXG4gICAgICAgICAgICBhY2NlbGVyYXRpb25NYXg6IDMsXHJcbiAgICAgICAgICAgIGtleWJvYXJkU3VwcG9ydDogITAsXHJcbiAgICAgICAgICAgIGFycm93U2Nyb2xsOiA1MCxcclxuICAgICAgICAgICAgZml4ZWRCYWNrZ3JvdW5kOiAhMCxcclxuICAgICAgICAgICAgZXhjbHVkZWQ6IFwiXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHAgPSBvLFxyXG4gICAgICAgIHUgPSAhMSxcclxuICAgICAgICBkID0gITEsXHJcbiAgICAgICAgbiA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZiA9ICExLFxyXG4gICAgICAgIG0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXHJcbiAgICAgICAgbCA9IFtdLFxyXG4gICAgICAgIGggPSAvXk1hYy8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pLFxyXG4gICAgICAgIHcgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IDM3LFxyXG4gICAgICAgICAgICB1cDogMzgsXHJcbiAgICAgICAgICAgIHJpZ2h0OiAzOSxcclxuICAgICAgICAgICAgZG93bjogNDAsXHJcbiAgICAgICAgICAgIHNwYWNlYmFyOiAzMixcclxuICAgICAgICAgICAgcGFnZXVwOiAzMyxcclxuICAgICAgICAgICAgcGFnZWRvd246IDM0LFxyXG4gICAgICAgICAgICBlbmQ6IDM1LFxyXG4gICAgICAgICAgICBob21lOiAzNlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdiA9IHtcclxuICAgICAgICAgICAgMzc6IDEsXHJcbiAgICAgICAgICAgIDM4OiAxLFxyXG4gICAgICAgICAgICAzOTogMSxcclxuICAgICAgICAgICAgNDA6IDFcclxuICAgICAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHkoKSB7XHJcbiAgICAgICAgaWYgKCFmICYmIGRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgZiA9ICEwO1xyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmJvZHksXHJcbiAgICAgICAgICAgICAgICB0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgbyA9IHdpbmRvdy5pbm5lckhlaWdodCxcclxuICAgICAgICAgICAgICAgIG4gPSBlLnNjcm9sbEhlaWdodDtcclxuICAgICAgICAgICAgaWYgKG0gPSAwIDw9IGRvY3VtZW50LmNvbXBhdE1vZGUuaW5kZXhPZihcIkNTU1wiKSA/IHQgOiBlLCBzID0gZSwgcC5rZXlib2FyZFN1cHBvcnQgJiYgWShcImtleWRvd25cIiwgeCksIHRvcCAhPSBzZWxmKSBkID0gITA7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKFEgJiYgbyA8IG4gJiYgKGUub2Zmc2V0SGVpZ2h0IDw9IG8gfHwgdC5vZmZzZXRIZWlnaHQgPD0gbykpIHtcclxuICAgICAgICAgICAgICAgIHZhciByLCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGEuc3R5bGUuY3NzVGV4dCA9IFwicG9zaXRpb246YWJzb2x1dGU7IHotaW5kZXg6LTEwMDAwOyB0b3A6MDsgbGVmdDowOyByaWdodDowOyBoZWlnaHQ6XCIgKyBtLnNjcm9sbEhlaWdodCArIFwicHhcIiwgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKSwgYyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByID0gciB8fCBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdSB8fCAoYS5zdHlsZS5oZWlnaHQgPSBcIjBcIiwgYS5zdHlsZS5oZWlnaHQgPSBtLnNjcm9sbEhlaWdodCArIFwicHhcIiwgciA9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKVxyXG4gICAgICAgICAgICAgICAgfSwgc2V0VGltZW91dChjLCAxMCksIFkoXCJyZXNpemVcIiwgYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGkgPSBuZXcgUihjKSkub2JzZXJ2ZShlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6ICEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6ICEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiAhMVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLCBtLm9mZnNldEhlaWdodCA8PSBvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGwuc3R5bGUuY2xlYXIgPSBcImJvdGhcIiwgZS5hcHBlbmRDaGlsZChsKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHAuZml4ZWRCYWNrZ3JvdW5kIHx8IHUgfHwgKGUuc3R5bGUuYmFja2dyb3VuZEF0dGFjaG1lbnQgPSBcInNjcm9sbFwiLCB0LnN0eWxlLmJhY2tncm91bmRBdHRhY2htZW50ID0gXCJzY3JvbGxcIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgYiA9IFtdLFxyXG4gICAgICAgIGcgPSAhMSxcclxuICAgICAgICByID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICBmdW5jdGlvbiBTKGQsIGYsIG0pIHtcclxuICAgICAgICBpZiAoZnVuY3Rpb24gKGUsIHQpIHtcclxuICAgICAgICAgICAgICAgIGUgPSAwIDwgZSA/IDEgOiAtMSwgdCA9IDAgPCB0ID8gMSA6IC0xLCBuLnggPT09IGUgJiYgbi55ID09PSB0IHx8IChuLnggPSBlLCBuLnkgPSB0LCBiID0gW10sIHIgPSAwKVxyXG4gICAgICAgICAgICB9KGYsIG0pLCAxICE9IHAuYWNjZWxlcmF0aW9uTWF4KSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gRGF0ZS5ub3coKSAtIHI7XHJcbiAgICAgICAgICAgIGlmIChlIDwgcC5hY2NlbGVyYXRpb25EZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSAoMSArIDUwIC8gZSkgLyAyO1xyXG4gICAgICAgICAgICAgICAgMSA8IHQgJiYgKHQgPSBNYXRoLm1pbih0LCBwLmFjY2VsZXJhdGlvbk1heCksIGYgKj0gdCwgbSAqPSB0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHIgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChiLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgeDogZixcclxuICAgICAgICAgICAgICAgIHk6IG0sXHJcbiAgICAgICAgICAgICAgICBsYXN0WDogZiA8IDAgPyAuOTkgOiAtLjk5LFxyXG4gICAgICAgICAgICAgICAgbGFzdFk6IG0gPCAwID8gLjk5IDogLS45OSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgIH0pLCAhZykge1xyXG4gICAgICAgICAgICB2YXIgbyA9IHEoKSxcclxuICAgICAgICAgICAgICAgIGggPSBkID09PSBvIHx8IGQgPT09IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIG51bGwgPT0gZC4kc2Nyb2xsQmVoYXZpb3IgJiYgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ID0gTShlKTtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IEJbdF0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGdldENvbXB1dGVkU3R5bGUoZSwgXCJcIilbXCJzY3JvbGwtYmVoYXZpb3JcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgQlt0XSA9IFwic21vb3RoXCIgPT0gb1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEJbdF1cclxuICAgICAgICAgICAgfShkKSAmJiAoZC4kc2Nyb2xsQmVoYXZpb3IgPSBkLnN0eWxlLnNjcm9sbEJlaGF2aW9yLCBkLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICB2YXIgdyA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0ID0gRGF0ZS5ub3coKSwgbyA9IDAsIG4gPSAwLCByID0gMDsgciA8IGIubGVuZ3RoOyByKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IGJbcl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSB0IC0gYS5zdGFydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGwgPj0gcC5hbmltYXRpb25UaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gaSA/IDEgOiBsIC8gcC5hbmltYXRpb25UaW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHAucHVsc2VBbGdvcml0aG0gJiYgKGMgPSBGKGMpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGEueCAqIGMgLSBhLmxhc3RYID4+IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBhLnkgKiBjIC0gYS5sYXN0WSA+PiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG8gKz0gcywgbiArPSB1LCBhLmxhc3RYICs9IHMsIGEubGFzdFkgKz0gdSwgaSAmJiAoYi5zcGxpY2UociwgMSksIHItLSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGggPyB3aW5kb3cuc2Nyb2xsQnkobywgbikgOiAobyAmJiAoZC5zY3JvbGxMZWZ0ICs9IG8pLCBuICYmIChkLnNjcm9sbFRvcCArPSBuKSksIGYgfHwgbSB8fCAoYiA9IFtdKSwgYi5sZW5ndGggPyBqKHcsIGQsIDFlMyAvIHAuZnJhbWVSYXRlICsgMSkgOiAoZyA9ICExLCBudWxsICE9IGQuJHNjcm9sbEJlaGF2aW9yICYmIChkLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gZC4kc2Nyb2xsQmVoYXZpb3IsIGQuJHNjcm9sbEJlaGF2aW9yID0gbnVsbCkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGoodywgZCwgMCksIGcgPSAhMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlKGUpIHtcclxuICAgICAgICBmIHx8IHkoKTtcclxuICAgICAgICB2YXIgdCA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgfHwgZS5jdHJsS2V5KSByZXR1cm4gITA7XHJcbiAgICAgICAgaWYgKE4ocywgXCJlbWJlZFwiKSB8fCBOKHQsIFwiZW1iZWRcIikgJiYgL1xcLnBkZi9pLnRlc3QodC5zcmMpIHx8IE4ocywgXCJvYmplY3RcIikgfHwgdC5zaGFkb3dSb290KSByZXR1cm4gITA7XHJcbiAgICAgICAgdmFyIG8gPSAtZS53aGVlbERlbHRhWCB8fCBlLmRlbHRhWCB8fCAwLFxyXG4gICAgICAgICAgICBuID0gLWUud2hlZWxEZWx0YVkgfHwgZS5kZWx0YVkgfHwgMDtcclxuICAgICAgICBoICYmIChlLndoZWVsRGVsdGFYICYmIEsoZS53aGVlbERlbHRhWCwgMTIwKSAmJiAobyA9IGUud2hlZWxEZWx0YVggLyBNYXRoLmFicyhlLndoZWVsRGVsdGFYKSAqIC0xMjApLCBlLndoZWVsRGVsdGFZICYmIEsoZS53aGVlbERlbHRhWSwgMTIwKSAmJiAobiA9IGUud2hlZWxEZWx0YVkgLyBNYXRoLmFicyhlLndoZWVsRGVsdGFZKSAqIC0xMjApKSwgbyB8fCBuIHx8IChuID0gLWUud2hlZWxEZWx0YSB8fCAwKSwgMSA9PT0gZS5kZWx0YU1vZGUgJiYgKG8gKj0gNDAsIG4gKj0gNDApO1xyXG4gICAgICAgIHZhciByID0geih0KTtcclxuICAgICAgICByZXR1cm4gciA/ICEhIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmICghZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBsLmxlbmd0aCB8fCAobCA9IFtlLCBlLCBlXSk7XHJcbiAgICAgICAgICAgIGUgPSBNYXRoLmFicyhlKSwgbC5wdXNoKGUpLCBsLnNoaWZ0KCksIGNsZWFyVGltZW91dChhKSwgYSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuU1NfZGVsdGFCdWZmZXIgPSBsLmpvaW4oXCIsXCIpXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxyXG4gICAgICAgICAgICB9LCAxZTMpO1xyXG4gICAgICAgICAgICB2YXIgdCA9IDEyMCA8IGUgJiYgUChlKSxcclxuICAgICAgICAgICAgICAgIG8gPSAhUCgxMjApICYmICFQKDEwMCkgJiYgIXQ7XHJcbiAgICAgICAgICAgIHJldHVybiBlIDwgNTAgfHwgb1xyXG4gICAgICAgIH0obikgfHwgKDEuMiA8IE1hdGguYWJzKG8pICYmIChvICo9IHAuc3RlcFNpemUgLyAxMjApLCAxLjIgPCBNYXRoLmFicyhuKSAmJiAobiAqPSBwLnN0ZXBTaXplIC8gMTIwKSwgUyhyLCBvLCBuKSwgZS5wcmV2ZW50RGVmYXVsdCgpLCB2b2lkIEMoKSkgOiAhZCB8fCAhVyB8fCAoT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsIFwidGFyZ2V0XCIsIHtcclxuICAgICAgICAgICAgdmFsdWU6IHdpbmRvdy5mcmFtZUVsZW1lbnRcclxuICAgICAgICB9KSwgcGFyZW50LndoZWVsKGUpKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHgoZSkge1xyXG4gICAgICAgIHZhciB0ID0gZS50YXJnZXQsXHJcbiAgICAgICAgICAgIG8gPSBlLmN0cmxLZXkgfHwgZS5hbHRLZXkgfHwgZS5tZXRhS2V5IHx8IGUuc2hpZnRLZXkgJiYgZS5rZXlDb2RlICE9PSB3LnNwYWNlYmFyO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY29udGFpbnMocykgfHwgKHMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuICAgICAgICB2YXIgbiA9IC9eKGJ1dHRvbnxzdWJtaXR8cmFkaW98Y2hlY2tib3h8ZmlsZXxjb2xvcnxpbWFnZSkkL2k7XHJcbiAgICAgICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCB8fCAvXih0ZXh0YXJlYXxzZWxlY3R8ZW1iZWR8b2JqZWN0KSQvaS50ZXN0KHQubm9kZU5hbWUpIHx8IE4odCwgXCJpbnB1dFwiKSAmJiAhbi50ZXN0KHQudHlwZSkgfHwgTihzLCBcInZpZGVvXCIpIHx8IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9IGUudGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIG8gPSAhMTtcclxuICAgICAgICAgICAgICAgIGlmICgtMSAhPSBkb2N1bWVudC5VUkwuaW5kZXhPZihcInd3dy55b3V0dWJlLmNvbS93YXRjaFwiKSlcclxuICAgICAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvID0gdC5jbGFzc0xpc3QgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoXCJodG1sNS12aWRlby1jb250cm9sc1wiKSkgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICh0ID0gdC5wYXJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvXHJcbiAgICAgICAgICAgIH0oZSkgfHwgdC5pc0NvbnRlbnRFZGl0YWJsZSB8fCBvKSByZXR1cm4gITA7XHJcbiAgICAgICAgaWYgKChOKHQsIFwiYnV0dG9uXCIpIHx8IE4odCwgXCJpbnB1dFwiKSAmJiBuLnRlc3QodC50eXBlKSkgJiYgZS5rZXlDb2RlID09PSB3LnNwYWNlYmFyKSByZXR1cm4gITA7XHJcbiAgICAgICAgaWYgKE4odCwgXCJpbnB1dFwiKSAmJiBcInJhZGlvXCIgPT0gdC50eXBlICYmIHZbZS5rZXlDb2RlXSkgcmV0dXJuICEwO1xyXG4gICAgICAgIHZhciByID0gMCxcclxuICAgICAgICAgICAgYSA9IDAsXHJcbiAgICAgICAgICAgIGwgPSB6KHMpO1xyXG4gICAgICAgIGlmICghbCkgcmV0dXJuICFkIHx8ICFXIHx8IHBhcmVudC5rZXlkb3duKGUpO1xyXG4gICAgICAgIHZhciBpID0gbC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgc3dpdGNoIChsID09IGRvY3VtZW50LmJvZHkgJiYgKGkgPSB3aW5kb3cuaW5uZXJIZWlnaHQpLCBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgY2FzZSB3LnVwOlxyXG4gICAgICAgICAgICAgICAgYSA9IC1wLmFycm93U2Nyb2xsO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugdy5kb3duOlxyXG4gICAgICAgICAgICAgICAgYSA9IHAuYXJyb3dTY3JvbGw7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3LnNwYWNlYmFyOlxyXG4gICAgICAgICAgICAgICAgYSA9IC0oZS5zaGlmdEtleSA/IDEgOiAtMSkgKiBpICogLjk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3LnBhZ2V1cDpcclxuICAgICAgICAgICAgICAgIGEgPSAuOSAqIC1pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugdy5wYWdlZG93bjpcclxuICAgICAgICAgICAgICAgIGEgPSAuOSAqIGk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3LmhvbWU6XHJcbiAgICAgICAgICAgICAgICBsID09IGRvY3VtZW50LmJvZHkgJiYgZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudCAmJiAobCA9IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQpLCBhID0gLWwuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugdy5lbmQ6XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGwuc2Nyb2xsSGVpZ2h0IC0gbC5zY3JvbGxUb3AgLSBpO1xyXG4gICAgICAgICAgICAgICAgYSA9IDAgPCBjID8gMTAgKyBjIDogMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHcubGVmdDpcclxuICAgICAgICAgICAgICAgIHIgPSAtcC5hcnJvd1Njcm9sbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHcucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICByID0gcC5hcnJvd1Njcm9sbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFMobCwgciwgYSksIGUucHJldmVudERlZmF1bHQoKSwgQygpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdChlKSB7XHJcbiAgICAgICAgcyA9IGUudGFyZ2V0XHJcbiAgICB9XHJcbiAgICB2YXIgaywgRCwgTSA9IChrID0gMCwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGUudW5pcXVlSUQgfHwgKGUudW5pcXVlSUQgPSBrKyspXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgRSA9IHt9LFxyXG4gICAgICAgIFQgPSB7fSxcclxuICAgICAgICBCID0ge307XHJcblxyXG4gICAgZnVuY3Rpb24gQygpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQoRCksIEQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIEUgPSBUID0gQiA9IHt9XHJcbiAgICAgICAgfSwgMWUzKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEgoZSwgdCwgbykge1xyXG4gICAgICAgIGZvciAodmFyIG4gPSBvID8gRSA6IFQsIHIgPSBlLmxlbmd0aDsgci0tOykgbltNKGVbcl0pXSA9IHQ7XHJcbiAgICAgICAgcmV0dXJuIHRcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB6KGUpIHtcclxuICAgICAgICB2YXIgdCA9IFtdLFxyXG4gICAgICAgICAgICBvID0gZG9jdW1lbnQuYm9keSxcclxuICAgICAgICAgICAgbiA9IG0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdmFyIHIgPSAoITEgPyBFIDogVClbTShlKV07XHJcbiAgICAgICAgICAgIGlmIChyKSByZXR1cm4gSCh0LCByKTtcclxuICAgICAgICAgICAgaWYgKHQucHVzaChlKSwgbiA9PT0gZS5zY3JvbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gTyhtKSAmJiBPKG8pIHx8IFgobSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZCAmJiBMKG0pIHx8ICFkICYmIGEpIHJldHVybiBIKHQsIHEoKSlcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChMKGUpICYmIFgoZSkpIHJldHVybiBIKHQsIGUpXHJcbiAgICAgICAgfSB3aGlsZSAoZSA9IGUucGFyZW50RWxlbWVudClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBMKGUpIHtcclxuICAgICAgICByZXR1cm4gZS5jbGllbnRIZWlnaHQgKyAxMCA8IGUuc2Nyb2xsSGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gTyhlKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiaGlkZGVuXCIgIT09IGdldENvbXB1dGVkU3R5bGUoZSwgXCJcIikuZ2V0UHJvcGVydHlWYWx1ZShcIm92ZXJmbG93LXlcIilcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBYKGUpIHtcclxuICAgICAgICB2YXIgdCA9IGdldENvbXB1dGVkU3R5bGUoZSwgXCJcIikuZ2V0UHJvcGVydHlWYWx1ZShcIm92ZXJmbG93LXlcIik7XHJcbiAgICAgICAgcmV0dXJuIFwic2Nyb2xsXCIgPT09IHQgfHwgXCJhdXRvXCIgPT09IHRcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBZKGUsIHQsIG8pIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihlLCB0LCBvIHx8ICExKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEEoZSwgdCwgbykge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGUsIHQsIG8gfHwgITEpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gTihlLCB0KSB7XHJcbiAgICAgICAgcmV0dXJuIGUgJiYgKGUubm9kZU5hbWUgfHwgXCJcIikudG9Mb3dlckNhc2UoKSA9PT0gdC50b0xvd2VyQ2FzZSgpXHJcbiAgICB9XHJcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZSAmJiBsb2NhbFN0b3JhZ2UuU1NfZGVsdGFCdWZmZXIpIHRyeSB7XHJcbiAgICAgICAgbCA9IGxvY2FsU3RvcmFnZS5TU19kZWx0YUJ1ZmZlci5zcGxpdChcIixcIilcclxuICAgIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gICAgZnVuY3Rpb24gSyhlLCB0KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoZSAvIHQpID09IGUgLyB0XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gUChlKSB7XHJcbiAgICAgICAgcmV0dXJuIEsobFswXSwgZSkgJiYgSyhsWzFdLCBlKSAmJiBLKGxbMl0sIGUpXHJcbiAgICB9XHJcbiAgICB2YXIgJCwgaiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IGZ1bmN0aW9uIChlLCB0LCBvKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGUsIG8gfHwgMWUzIC8gNjApXHJcbiAgICAgICAgfSxcclxuICAgICAgICBSID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXIsXHJcbiAgICAgICAgcSA9ICgkID0gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoISQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUuY3NzVGV4dCA9IFwiaGVpZ2h0OjEwMDAwcHg7d2lkdGg6MXB4O1wiLCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsIHdpbmRvdy5zY3JvbGxCeSgwLCAzKSwgJCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICE9IHQgPyBkb2N1bWVudC5ib2R5IDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB3aW5kb3cuc2Nyb2xsQnkoMCwgLTMpLCBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBWKGUpIHtcclxuICAgICAgICB2YXIgdDtcclxuICAgICAgICByZXR1cm4gKChlICo9IHAucHVsc2VTY2FsZSkgPCAxID8gZSAtICgxIC0gTWF0aC5leHAoLWUpKSA6IChlIC09IDEsICh0ID0gTWF0aC5leHAoLTEpKSArICgxIC0gTWF0aC5leHAoLWUpKSAqICgxIC0gdCkpKSAqIHAucHVsc2VOb3JtYWxpemVcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBGKGUpIHtcclxuICAgICAgICByZXR1cm4gMSA8PSBlID8gMSA6IGUgPD0gMCA/IDAgOiAoMSA9PSBwLnB1bHNlTm9ybWFsaXplICYmIChwLnB1bHNlTm9ybWFsaXplIC89IFYoMSkpLCBWKGUpKVxyXG4gICAgfVxyXG4gICAgdmFyIEkgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCxcclxuICAgICAgICBfID0gL0VkZ2UvLnRlc3QoSSksXHJcbiAgICAgICAgVyA9IC9jaHJvbWUvaS50ZXN0KEkpICYmICFfLFxyXG4gICAgICAgIFUgPSAvc2FmYXJpL2kudGVzdChJKSAmJiAhXyxcclxuICAgICAgICBHID0gL21vYmlsZS9pLnRlc3QoSSksXHJcbiAgICAgICAgSiA9IC9XaW5kb3dzIE5UIDYuMS9pLnRlc3QoSSkgJiYgL3J2OjExL2kudGVzdChJKSxcclxuICAgICAgICBRID0gVSAmJiAoL1ZlcnNpb25cXC84L2kudGVzdChJKSB8fCAvVmVyc2lvblxcLzkvaS50ZXN0KEkpKSxcclxuICAgICAgICBaID0gKFcgfHwgVSB8fCBKKSAmJiAhRyxcclxuICAgICAgICBlZSA9ICExO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIiwgbnVsbCwgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCBcInBhc3NpdmVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGVlID0gITBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKVxyXG4gICAgfSBjYXRjaCAoZSkge31cclxuICAgIHZhciB0ZSA9ICEhZWUgJiYge1xyXG4gICAgICAgICAgICBwYXNzaXZlOiAhMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb2UgPSBcIm9ud2hlZWxcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpID8gXCJ3aGVlbFwiIDogXCJtb3VzZXdoZWVsXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gbmUoZSkge1xyXG4gICAgICAgIGZvciAodmFyIHQgaW4gZSkgby5oYXNPd25Qcm9wZXJ0eSh0KSAmJiAocFt0XSA9IGVbdF0pXHJcbiAgICB9XHJcbiAgICBvZSAmJiBaICYmIChZKG9lLCBlLCB0ZSksIFkoXCJtb3VzZWRvd25cIiwgdCksIFkoXCJsb2FkXCIsIHkpKSwgbmUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpICYmIGkuZGlzY29ubmVjdCgpLCBBKG9lLCBlKSwgQShcIm1vdXNlZG93blwiLCB0KSwgQShcImtleWRvd25cIiwgeCksIEEoXCJyZXNpemVcIiwgYyksIEEoXCJsb2FkXCIsIHkpXHJcbiAgICB9LCB3aW5kb3cuU21vb3RoU2Nyb2xsT3B0aW9ucyAmJiBuZSh3aW5kb3cuU21vb3RoU2Nyb2xsT3B0aW9ucyksIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZGVmaW5lICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZVxyXG4gICAgfSkgOiBcIm9iamVjdFwiID09IHR5cGVvZiBleHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBuZSA6IHdpbmRvdy5TbW9vdGhTY3JvbGwgPSBuZVxyXG59KCk7IiwiLyoqXHJcbiAqIFNtb290aGx5IHNjcm9sbHMgdGhlIHBhZ2UgdG8gdGhlIHNwZWNpZmllZCBwb3NpdGlvbi5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIC0gVGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0by5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj01MDBdIC0gVGhlIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxyXG4gKi9cclxuZnVuY3Rpb24gc21vb3RoU2Nyb2xsVG8ocG9zaXRpb24sIGR1cmF0aW9uID0gNTAwKSB7XHJcbiAgICBjb25zdCBzdGFydFBvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICBjb25zdCBkaXN0YW5jZSA9IHBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvblxyXG4gICAgbGV0IHN0YXJ0VGltZXN0YW1wID0gbnVsbFxyXG5cclxuICAgIGZ1bmN0aW9uIHN0ZXAodGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKCFzdGFydFRpbWVzdGFtcCkgc3RhcnRUaW1lc3RhbXAgPSB0aW1lc3RhbXBcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aW1lc3RhbXAgLSBzdGFydFRpbWVzdGFtcFxyXG4gICAgICAgIGNvbnN0IHNjcm9sbFkgPSBlYXNlSW5PdXRDdWJpYyhwcm9ncmVzcywgc3RhcnRQb3NpdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uKVxyXG5cclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsWSlcclxuXHJcbiAgICAgICAgaWYgKHByb2dyZXNzIDwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlYXNlSW5PdXRDdWJpYyh0LCBiLCBjLCBkKSB7XHJcbiAgICAgICAgdCAvPSBkXHJcbiAgICAgICAgdC0tXHJcbiAgICAgICAgcmV0dXJuIGMgKiAodCAqIHQgKiB0ICsgMSkgKyBiXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG59XHJcbiIsIndpbmRvdy50aHJvdHRsZSA9IChmdW5jLCBtcykgPT4ge1xyXG4gICAgbGV0IGlzVGhyb3R0bGVkID0gZmFsc2UsXHJcbiAgICAgICAgc2F2ZWRBcmdzLFxyXG4gICAgICAgIHNhdmVkVGhpc1xyXG5cclxuICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XHJcblxyXG4gICAgICAgIGlmIChpc1Rocm90dGxlZCkgeyAvLyAyXHJcbiAgICAgICAgICAgIHNhdmVkQXJncyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICBzYXZlZFRoaXMgPSB0aGlzXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpIC8vIDFcclxuXHJcbiAgICAgICAgaXNUaHJvdHRsZWQgPSB0cnVlXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlzVGhyb3R0bGVkID0gZmFsc2UgLy8gM1xyXG4gICAgICAgICAgICBpZiAoc2F2ZWRBcmdzKSB7XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGx5KHNhdmVkVGhpcywgc2F2ZWRBcmdzKVxyXG4gICAgICAgICAgICAgICAgc2F2ZWRBcmdzID0gc2F2ZWRUaGlzID0gbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgbXMpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXJcclxufSIsIi8qKlxyXG4gKiBFbWFpbCBhZGRyZXNzIHZlcmlmaWNhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwsIHRoYXQgbmVlZHMgdG8gdmFsaWRhdGluZy5cclxuICovXHJcbndpbmRvdy52YWxpZGF0ZUVtYWlsID0gKGVtYWlsKSA9PiB7XHJcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIGVtYWlsXHJcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bXlxcc0BdK0BbXlxcc0BdK1xcLlteXFxzQF0rJC9cclxuICAgIHJldHVybiBlbWFpbFJlZ2V4LnRlc3QoZW1haWwpXHJcbn1cclxuIiwiLyoqXHJcbiAqIFBob25lIG51bWJlciB2ZXJpZmljYXRpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHBob25lIC0gVGhlIHBob25lLCB0aGF0IG5lZWRzIHRvIHZhbGlkYXRpbmcuXHJcbiAqL1xyXG53aW5kb3cudmFsaWRhdGVQaG9uZSA9IChwaG9uZSkgPT4ge1xyXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBwaG9uZVxyXG4gICAgY29uc3QgcGhvbmVSZWdleCA9IC9eN1xcZHsxMH0kL1xyXG4gICAgcmV0dXJuIHBob25lUmVnZXgudGVzdChwaG9uZSlcclxufVxyXG4iLCJjb25zdCBpbml0VG9nZ2xlVmlzaWJsZUZvcm1QYXNzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvZ2dsZS12aXNpYmxlLXBhc3MnKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcbiAgICAgICAgY29uc3QgaXNUZXh0ID0gaW5wdXQudHlwZSA9PT0gJ3RleHQnXHJcblxyXG4gICAgICAgIGlucHV0LnR5cGUgPSBpc1RleHQgPyAncGFzc3dvcmQnIDogJ3RleHQnXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzLXZpc2libGUnKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbi8vIGNvbnN0IHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUpID0+IHtcclxuLy8gICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5jbG9zZXN0KCdsYWJlbCcpXHJcbi8vICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJylcclxuLy8gfVxyXG5cclxuLy8gY29uc3Qgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4vLyAgICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLmNsb3Nlc3QoJ2xhYmVsJylcclxuLy8gICAgIGNvbnN0IG1lc3NhZ2UgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmVycm9yLW1lc3NhZ2UnKVxyXG5cclxuLy8gICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxyXG4vLyAgICAgbWVzc2FnZS5pbm5lclRleHQgPSBlcnJvclRleHRcclxuXHJcbi8vICAgICBpbnB1dE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbi8vICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbi8vICAgICB9KVxyXG4vLyB9XHJcblxyXG4vLyBjb25zdCBpbml0QWNjb3VudEZvcm0gPSAoKSA9PiB7XHJcbi8vICAgICBjb25zdCBmb3JtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY291bnQtZm9ybV9fZm9ybScpKVxyXG4vLyAgICAgaWYgKGZvcm1zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4vLyAgICAgZm9ybXMuZm9yRWFjaChmb3JtID0+IGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4vLyAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuLy8gICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB7ZW1haWw6IHRydWUsIHBhc3M6IHRydWUsIH1cclxuLy8gICAgICAgICBjb25zdCBlbWFpbCA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJlbWFpbFwiXScpXHJcbi8vICAgICAgICAgY29uc3QgcGFzcyAgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFzc1wiXScpXHJcbi8vICAgICAgICAgY29uc3QgZm9ybVR5cGUgPSB0aGlzLmRhdGFzZXQuZm9ybVR5cGVcclxuXHJcbi8vICAgICAgICAgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsKVxyXG4vLyAgICAgICAgIGlmIChmb3JtVHlwZSAhPT0gJ3JlY292ZXJ5Jykge1xyXG4vLyAgICAgICAgICAgICByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIocGFzcylcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIC8vIENoZWNrIGVtYWlsXHJcbi8vICAgICAgICAgaWYgKGVtYWlsLnZhbHVlICE9PSAnJykge1xyXG4vLyAgICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlRW1haWwoZW1haWwudmFsdWUpKSB7XHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSB0cnVlXHJcbi8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSBmYWxzZVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbCwgJ9Cd0LXQvtCx0YXQvtC00LjQvNC+INGD0LrQsNC30LDRgtGMINCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXHJcbi8vICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IGZhbHNlXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAvLyBDaGVjayBwYXNzXHJcbi8vICAgICAgICAgaWYgKGZvcm1UeXBlICE9PSAncmVjb3ZlcnknKSB7XHJcbi8vICAgICAgICAgICAgIGlmIChwYXNzLnZhbHVlLmxlbmd0aCA8IDgpIHtcclxuLy8gICAgICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIocGFzcywgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9Cw0YDQvtC70YwuINCU0LvQuNC90L3QsCDQv9Cw0YDQvtC70Y8g0LTQvtC70LbQvdCwINCx0YvRgtGMINC90LUg0LzQtdC90LXQtSA4INGB0LjQvNCy0L7Qu9C+0LIhJylcclxuLy8gICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5wYXNzID0gZmFsc2VcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgLy8gU2VuZ2luZyBmb3JtIGRhdGFcclxuLy8gICAgICAgICBpZiAoZm9ybVZhbGlkLmVtYWlsICYmIGZvcm1WYWxpZC5wYXNzKSB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8g0J7QsdGP0LfQsNGC0LXQu9GM0L3QviDRg9C00LDQu9C40YLRjCDQv9C+0YHQu9C1INCy0L3QtdC00YDQtdC90LjRj1xyXG4vLyAgICAgICAgICAgICBmb3IgKGxldCBbbmFtZSwgdmFsdWVdIG9mIGZvcm1EYXRhKSB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfTogJHt2YWx1ZX1gKTtcclxuLy8gICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIHJlcXVlc3QgZm9yIHVwZGF0aW5nIHVzZXIgZGF0YScpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH0pKVxyXG4vLyB9XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIC8vIGluaXRBY2NvdW50Rm9ybSgpXHJcbiAgICBpbml0VG9nZ2xlVmlzaWJsZUZvcm1QYXNzKClcclxufSkiLCIvLyBBZGQgcHJvZHVjdCB0byBmYXZvcml0ZXNcclxuY29uc3QgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSBlLnRhcmdldFxyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IF90aGlzLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBfdGhpcy5kYXRhc2V0LnRpdGxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gX3RoaXMuZGF0YXNldC5tZXNzYWdlXHJcbiAgICBjb25zdCBoZWFkZXJGYXZvcml0ZXMgPSBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idXR0b25zLWxpbmtfZmF2b3JpdGVzIC5oZWFkZXJfX2J1dHRvbnMtY291bnQnKVxyXG4gICAgY29uc3QgY3VycmVudEZhdm9ydXRlc0NvdW50ID0gcGFyc2VJbnQoaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dClcclxuXHJcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHtcclxuICAgICAgICBfdGhpcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dCA9IGN1cnJlbnRGYXZvcnV0ZXNDb3VudCArIDFcclxuICAgICAgICBoZWFkZXJGYXZvcml0ZXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gaGVhZGVyRmF2b3JpdGVzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvcignQXN5bmMgcXVlcnkgdG8gQUREIHNlbGVjdGVkIHByb2R1Y3QgdG8gRmF2b3JpdGVzJyk7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgX3RoaXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dCA9IGN1cnJlbnRGYXZvcnV0ZXNDb3VudCAtIDFcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0FzeW5jIHF1ZXJ5IHRvIERFTEVURSBzZWxlY3RlZCBwcm9kdWN0IGZyb20gRmF2b3JpdGVzJyk7XHJcbn1cclxuXHJcbmNvbnN0IGluaXRBZGRUb0Zhdm9yaXRlcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0LWl0ZW1fX2Zhdm9yaXRlcycpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChidG4gPT4gYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXIpKVxyXG59XHJcblxyXG4vLyBBZGQgcHJvZHVjdCB0byBjYXJ0XHJcbmNvbnN0IGFkZFRvQ2FydENsaWNrSGFuZGxlciA9IChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICBjb25zdCBfdGhpcyA9IGUudGFyZ2V0XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gX3RoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpXHJcbiAgICBjb25zdCB0aXRsZSA9IF90aGlzLmRhdGFzZXQudGl0bGVcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBfdGhpcy5kYXRhc2V0Lm1lc3NhZ2VcclxuXHJcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHtcclxuICAgICAgICBfdGhpcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgc2hvd01vZGFsTXNnKHRpdGxlLCBtZXNzYWdlKVxyXG5cclxuICAgICAgICAvLyBQdXNoIGN1cnJlbnQgcHJvZHVjdCB0byBDYXJ0IEdsb2JhbCBPYmplY3QgKHdpbmRvdy5DQVJUKVxyXG4gICAgICAgIHdpbmRvdy5hZGRQcm9kdWN0VG9DYXJ0KHsgYXJ0OiBfdGhpcy5kYXRhc2V0LnByb2R1Y3RJZCwgY291bnQ6IDEgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgX3RoaXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgc2hvd01vZGFsTXNnKHRpdGxlLCAn0KPQtNCw0LvQtdC9INC40Lcg0LrQvtGA0LfQuNC90YsnKVxyXG5cclxuICAgIC8vIFJlbW92ZSBjdXJyZW50IHByb2R1Y3QgZnJvbSBDYXJ0IEdsb2JhbCBPYmplY3QgKHdpbmRvdy5DQVJUKVxyXG4gICAgd2luZG93LnJlbW92ZVByb2R1Y3RGcm9tQ2FydCh7IGFydDogX3RoaXMuZGF0YXNldC5wcm9kdWN0SWQsIGNvdW50OiAxIH0pXHJcbn1cclxuY29uc3QgaW5pdEFkZFRvQ2FydCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0LWl0ZW1fX2NhcnQnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFRvQ2FydENsaWNrSGFuZGxlcikpXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdEFkZFRvRmF2b3JpdGVzKClcclxuICAgIGluaXRBZGRUb0NhcnQoKVxyXG59KSIsIlxyXG5jb25zdCByZXNldEFsbENhcmRzUGljcyA9IChub2RlKSA9PiB7XHJcbiAgICBjb25zdCBwaWNzID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3BpYycpKVxyXG4gICAgcGljcy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxufVxyXG5cclxuY29uc3QgcmVzZXRBbGxDYXJkc1RhYnMgPSAobm9kZSkgPT4ge1xyXG4gICAgY29uc3QgdGFicyA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX190YWInKSlcclxuICAgIHRhYnMuZm9yRWFjaChub2RlID0+IG5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbn1cclxuXHJcbmNvbnN0IGdldFRhcmdldENyZHNQaWMgPSAobm9kZSwgZGF0YVRhcmdldFR5cGVWYWwpID0+IHtcclxuICAgIHJldHVybiBub2RlLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXR5cGU9JHtkYXRhVGFyZ2V0VHlwZVZhbH1dYClcclxufVxyXG5cclxuY29uc3QgaW5pdENhcmRzVGFiID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFiQXJyID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX190YWInKSlcclxuXHJcbiAgICB0YWJBcnIuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJldG4gPSB0aGlzLmNsb3Nlc3QoJy5jYXJkcy1zZXJpZXNfX2l0ZW0nKVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQaWNUeXBlID0gdGhpcy5kYXRhc2V0LnRhcmdldFR5cGVcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UGljID0gZ2V0VGFyZ2V0Q3Jkc1BpYyhwYXJldG4sIHRhcmdldFBpY1R5cGUpXHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWN0aXZlIHRhYlxyXG4gICAgICAgICAgICByZXNldEFsbENhcmRzVGFicyhwYXJldG4pXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWN0aXZlIGltYWdlXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRQaWMpIHtcclxuICAgICAgICAgICAgICAgIHJlc2V0QWxsQ2FyZHNQaWNzKHBhcmV0bilcclxuICAgICAgICAgICAgICAgIHRhcmdldFBpYy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdENhcmRzVGFiKClcclxufSlcclxuIiwiLy8gRmlsdGVyc1xyXG5jb25zdCBzaG93Tm9GaWx0ZXJNc2cgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBtc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVzY3JpcHRpb25fX21zZycpXHJcblxyXG4gICAgaWYgKCFtc2cpIHJldHVyblxyXG5cclxuICAgIG1zZy5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gbXNnLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKSwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlTm9GaWx0ZXJNc2cgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBtc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVzY3JpcHRpb25fX21zZycpXHJcblxyXG4gICAgaWYgKCFtc2cpIHJldHVyblxyXG5cclxuICAgIG1zZy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgIG1zZy5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5JylcclxufVxyXG5cclxuY29uc3QgY2hlY2tOb0ZpbHRlck1zZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZmlsdGVyXTpub3QoLmhpZGUpJylcclxuXHJcbiAgICBpdGVtcy5sZW5ndGggPT09IDBcclxuICAgICAgICA/IHNob3dOb0ZpbHRlck1zZygpXHJcbiAgICAgICAgOiBoaWRlTm9GaWx0ZXJNc2coKVxyXG59XHJcblxyXG5jb25zdCBoaWRlRmlsdGVybGlzdCA9IChmaWx0ZXJMaXN0KSA9PiB7XHJcbiAgICBmaWx0ZXJMaXN0LmZvckVhY2goZmlsdGVyID0+IHtcclxuICAgICAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyksIDMwMClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHNob3dGaWx0ZXJEcm9wID0gKG5vZGUpID0+IHtcclxuICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gbm9kZS5jbGFzc0xpc3QuYWRkKCdkcm9wcGVkJyksIDEwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlRmlsdGVyRHJvcCA9IChub2RlKSA9PiB7XHJcbiAgICBjb25zdCBmaWx0ZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVyc19faXRlbScpKVxyXG5cclxuICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgIGhpZGVGaWx0ZXJsaXN0KGZpbHRlcnMpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb25zdCBjbGVhbmVkRmlsdGVycyA9IGZpbHRlcnMuZmlsdGVyKGZpbHRlciA9PiBmaWx0ZXIgIT09IG5vZGUpO1xyXG4gICAgaGlkZUZpbHRlcmxpc3QoY2xlYW5lZEZpbHRlcnMpXHJcbn1cclxuXHJcbmNvbnN0IGluaXRGaWx0ZXJzRHJvcCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGZpdGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJzX19saXN0IC5maWx0ZXJzX19pdGVtJykpXHJcblxyXG4gICAgZml0bGVycy5mb3JFYWNoKGZpbHRlciA9PiB7XHJcbiAgICAgICAgZmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBpZiAoaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIGhpZGVGaWx0ZXJEcm9wKClcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoaWRlRmlsdGVyRHJvcCh0aGlzKVxyXG4gICAgICAgICAgICBzaG93RmlsdGVyRHJvcCh0aGlzKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBpbml0RmlsdGVyc1Jlc2V0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNhdGFsb2cnKVxyXG4gICAgaWYgKGlzUGFnZUNhdGFsb2cpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbHRlcnNfX3Jlc2V0IC5maWx0ZXJzX19pdGVtJylcclxuXHJcbiAgICBpZiAoIXJlc2V0KSByZXR1cm5cclxuXHJcbiAgICBjb25zdCBmaWx0ZXJlZFNlY3Rpb24gPSBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbl9maWx0ZXJlZCcpXHJcblxyXG4gICAgcmVzZXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNsb3Nlc3QoJy5maWx0ZXJzJylcclxuXHJcbiAgICAgICAgY29uc3Qgc2libGluZ0ZpbHRlcnMgPSBjb250YWluZXJcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJzX19saXN0IC5maWx0ZXJzX19pdGVtJylcclxuXHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJzX19vcHRpb25zJykpXHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcnMgaW5wdXRbdHlwZT1cInJhZGlvXCJdOm5vdChbdmFsdWU9XCJyZXNldFwiXSknKSlcclxuXHJcbiAgICAgICAgY29uc3QgY2FyZHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWZpbHRlcl0nKSlcclxuXHJcbiAgICAgICAgY29uc3QgZGVsZXRlZFR5cGVzID0gSlNPTi5wYXJzZShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcignW2RhdGEtZGVsZXRlZC10eXBlc10nKVxyXG4gICAgICAgICAgICAuZGF0YXNldC5kZWxldGVkVHlwZXMpXHJcblxyXG4gICAgICAgIGhpZGVGaWx0ZXJsaXN0KHNpYmxpbmdGaWx0ZXJzKVxyXG4gICAgICAgIHNwaW5uZXIuc2hvdygpXHJcbiAgICAgICAgZmlsdGVyZWRTZWN0aW9uLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZCgnZmlsdGVyaW5nJykpXHJcbiAgICAgICAgb3B0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKSkgLy8gaGlkZSByc2V0IG9wdGlvbiBidXR0b25cclxuICAgICAgICBjb250cm9sbGVycy5mb3JFYWNoKGNvbnRyb2xsZXIgPT4gY29udHJvbGxlci5jaGVja2VkID0gZmFsc2UpIC8vIHJlc2V0IGFsbCBpbnB1dCBjb250cm9sbGVyc1xyXG4gICAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zKClcclxuICAgICAgICByZXNldC5jbG9zZXN0KCcuZmlsdGVyc19fcmVzZXQnKS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBzaG93IGhpZGRlbiBjYXJkcyBhcyBkZWxldGUgZGF0YS1kaXNwbGF5IGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgY2FyZHMuZm9yRWFjaChjYXJkID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBkZWxldGVkVHlwZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7dHlwZX1gKVxyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBjaGVja0ZpbHRlcmVkU2VjdGlvbigpXHJcbiAgICAgICAgfSwgMTAwMClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrRmlsdGVyZWRTZWN0aW9uID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc2VjdGlvbnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uX2ZpbHRlcmVkJykpXHJcblxyXG4gICAgc2VjdGlvbnMuZm9yRWFjaChzZWN0aW9uID0+IHtcclxuICAgICAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gQXJyYXkuZnJvbShzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWZpbHRlcl0nKSlcclxuICAgICAgICBjb25zdCBzaG93bkl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiAhaS5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSlcclxuXHJcbiAgICAgICAgaWYgKHNob3duSXRlbXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCgnaGlkZScpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHNwaW5uZXIuaGlkZSgpXHJcbiAgICBzZWN0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbHRlcmluZycpKVxyXG5cclxuICAgIHNob3dBbmltRWxlbWVudHMoKVxyXG4gICAgc2V0QW5pbWF0aW9uRWxtcygpXHJcbiAgICBjaGVja05vRmlsdGVyTXNnKClcclxufVxyXG5cclxuY29uc3QgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSAobm9kZSkgPT4ge1xyXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlc1xyXG5cclxuICAgIGxldCBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IGZhbHNlXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZVxyXG5cclxuICAgICAgICBpZiAoYXR0cmlidXRlTmFtZS5zdGFydHNXaXRoKCdkYXRhLWRpc3BsYXknKSkge1xyXG4gICAgICAgICAgICBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IHRydWVcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrRmlsdGVyZWRJdGVtID0gKHByb3AsIHZhbCkgPT4ge1xyXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWZpbHRlcl0nKSlcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShpLmRhdGFzZXQuZmlsdGVyKVxyXG4gICAgICAgICAgICBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShkYXRhW3Byb3BdKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaXNNYXRjaGVkID0gaXNBcnJheVxyXG4gICAgICAgICAgICAgICAgPyBkYXRhW3Byb3BdLmluY2x1ZGVzKHZhbClcclxuICAgICAgICAgICAgICAgIDogZGF0YVtwcm9wXSA9PT0gdmFsXHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKGlzTWF0Y2hlZCkge1xyXG4gICAgICAgICAgICAgICAgaS5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YClcclxuICAgICAgICAgICAgICAgIGlmICghaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUoaSkpIGkuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgICAgICAgICAgaS5zZXRBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YCwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKClcclxuICAgICAgICB9KVxyXG4gICAgfSwgMTAwMClcclxufVxyXG5cclxuY29uc3QgYWN0aXZlQ29sb3JJbkl0ZW0gPSAodmFsKSA9PiB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdGFyZ2V0LXR5cGU9XCIke3ZhbH1cIl1gKSlcclxuXHJcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4gaS5jbGljaygpKVxyXG59XHJcblxyXG5jb25zdCBpbml0RmlsdGVyU2VsZWN0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNhdGFsb2cnKVxyXG4gICAgaWYgKGlzUGFnZUNhdGFsb2cpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVycyBpbnB1dFt0eXBlPVwicmFkaW9cIl06bm90KFt2YWx1ZT1cInJlc2V0XCJdKScpKVxyXG5cclxuICAgIGNvbnN0IGZpbHRlcmVkU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uX2ZpbHRlcmVkJylcclxuXHJcbiAgICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXJzX19yZXNldCcpXHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICBmaWx0ZXJlZFNlY3Rpb24uZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKCdmaWx0ZXJpbmcnKSlcclxuICAgICAgICBzcGlubmVyLnNob3coKVxyXG4gICAgICAgIGNoZWNrRmlsdGVyZWRJdGVtKHRoaXMubmFtZSwgdGhpcy52YWx1ZSlcclxuICAgICAgICBhY3RpdmVDb2xvckluSXRlbSh0aGlzLnZhbHVlKVxyXG4gICAgICAgIHRoaXMuY2xvc2VzdCgnLmZpbHRlcnNfX29wdGlvbnMnKS5jbGFzc0xpc3QuYWRkKCdjaGVja2VkJylcclxuICAgICAgICByZXNldEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpXHJcbiAgICB9KSlcclxufVxyXG5cclxuY29uc3QgcmVtb3ZlRGF0YUZpdGxlckF0cmlidXRlID0gKHByb3ApID0+IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1kaXNwbGF5LSR7cHJvcH1dYCkpXHJcblxyXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICBpLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgY2hlY2tBbGxJdGVtc0hhc0Rpc3BsYXlBdHJpYnV0ZXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZmlsdGVyXScpKVxyXG5cclxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgaWYgKCFoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZShpKSkge1xyXG4gICAgICAgICAgICBpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsQ29udHJvbGxlcnNCeU5hbWUgPSAobmFtZSkgPT4ge1xyXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7bmFtZX1dYCkpXHJcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4gaS5jaGVja2VkID0gZmFsc2UpXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFiTGlzdHMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX2NvbnRyb2xzJykpXHJcblxyXG4gICAgdGFiTGlzdHMuZm9yRWFjaChsaXN0ID0+IHtcclxuICAgICAgICBjb25zdCBmaXJzdFRhYiA9IGxpc3QucXVlcnlTZWxlY3RvcignLmNhcmRzLXNlcmllc19fdGFiJylcclxuXHJcbiAgICAgICAgZmlyc3RUYWIuY2xpY2soKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgY2hlY2tBbGxGaXRsZXJSZXNldEJ0biA9ICgpID0+IHtcclxuICAgIGNvbnN0IGlzQ2hlY2tlZEZpbHRlciA9IGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJzX19saXN0IGlucHV0OmNoZWNrZWQnKVxyXG5cclxuICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbHRlcnNfX3Jlc2V0JylcclxuXHJcbiAgICBpc0NoZWNrZWRGaWx0ZXIubGVuZ3RoID09PSAwXHJcbiAgICAgICAgPyByZXNldC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXHJcbiAgICAgICAgOiByZXNldC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpXHJcbn1cclxuXHJcbmNvbnN0IGluaXRSZXNldEZpbHRlclByb3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY2F0YWxvZycpXHJcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJzIGlucHV0W3ZhbHVlPVwicmVzZXRcIl0nKSlcclxuICAgIGNvbnN0IHNlY3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb25fZmlsdGVyZWQnKVxyXG5cclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgc2VjdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKCdmaWx0ZXJpbmcnKSlcclxuICAgICAgICBzcGlubmVyLnNob3coKVxyXG4gICAgICAgIHRoaXMuY2xvc2VzdCgnLmZpbHRlcnNfX29wdGlvbnMnKS5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJylcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlbW92ZURhdGFGaXRsZXJBdHJpYnV0ZSh0aGlzLm5hbWUpXHJcbiAgICAgICAgICAgIGNoZWNrQWxsSXRlbXNIYXNEaXNwbGF5QXRyaWJ1dGVzKClcclxuICAgICAgICAgICAgY2hlY2tGaWx0ZXJlZFNlY3Rpb24oKVxyXG4gICAgICAgICAgICByZXNldEFsbENvbnRyb2xsZXJzQnlOYW1lKHRoaXMubmFtZSlcclxuICAgICAgICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMoKVxyXG4gICAgICAgICAgICBjaGVja0FsbEZpdGxlclJlc2V0QnRuKClcclxuICAgICAgICB9LCAxMDAwKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdEZpbHRlcnNEcm9wKClcclxuICAgIGluaXRGaWx0ZXJzUmVzZXQoKVxyXG4gICAgaW5pdEZpbHRlclNlbGVjdCgpXHJcbiAgICBpbml0UmVzZXRGaWx0ZXJQcm9wKClcclxufSkiLCJjb25zdCBpbml0TW9kYWwgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbF0nKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZGF0YXNldC5tb2RhbFRhcmdldFxyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuZGF0YXNldC5tb2RhbEFjdGlvblxyXG5cclxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlICdzaG93JzpcclxuICAgICAgICAgICAgICAgIHNob3dNb2RhbEJhY2soKVxyXG4gICAgICAgICAgICAgICAgc2hvd01vZGFsRGlhbG9nKHRhcmdldClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd0b2dnbGUnOlxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlTW9kYWxEaWFsb2codGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Nsb3NlJzpcclxuICAgICAgICAgICAgICAgIGhpZGVNb2RhbERpYWxvZygpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGhpZGVNb2RhbEJhY2ssIDIwMClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWxCYWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxyXG5cclxuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gYmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JyksIDEwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlTW9kYWxCYWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hlYWRlcicpXHJcblxyXG4gICAgaWYgKCFiYWNrKSByZXR1cm5cclxuXHJcbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYmFjay5jbGFzc0xpc3QuYWRkKCdoaWRlJylcclxuICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgfSwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWxEaWFsb2cgPSAoaWQpID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXHJcbiAgICBjb25zdCBkaWFsb2cgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsX19kaWFsb2cnKVxyXG5cclxuICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICB9LCAxMClcclxufVxyXG5cclxuY29uc3QgaGlkZU1vZGFsRGlhbG9nID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLnNob3cnKVxyXG4gICAgaWYgKCF0YXJnZXQpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnaGlkZScpLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGluaXRDbG9zZU1vZGFsID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzT25Qb3B1cE1vZGFsID0gZS50YXJnZXQuY2xvc2VzdCgnLm1vZGFsX19kaWFsb2cnKVxyXG5cclxuICAgICAgICBpZihpc09uUG9wdXBNb2RhbCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGhpZGVNb2RhbERpYWxvZygpXHJcbiAgICAgICAgc2V0VGltZW91dChoaWRlTW9kYWxCYWNrLCAyMDApXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCB0b2dnbGVNb2RhbERpYWxvZyA9IChpZCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgaGlkZU1vZGFsRGlhbG9nKClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyksIDIwMClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICB9LCAzMDApXHJcbn1cclxuXHJcbmNvbnN0IGluaXRUb2dnbGVWaXNpYmxlUGFzcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbF9fdG9nZ2xlLXZpc2libGUtcGFzcycpKVxyXG5cclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcclxuICAgICAgICBjb25zdCBpc1RleHQgPSBpbnB1dC50eXBlID09PSAndGV4dCdcclxuXHJcbiAgICAgICAgaW5wdXQudHlwZSA9IGlzVGV4dCA/ICdwYXNzd29yZCcgOiAndGV4dCdcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ3Bhc3MtdmlzaWJsZScpXHJcbiAgICB9KSlcclxufVxyXG5cclxuY29uc3Qgc2hvd01vZGFsID0gKGlkKSA9PiB7XHJcbiAgICBzaG93TW9kYWxCYWNrKClcclxuICAgIHNob3dNb2RhbERpYWxvZyhpZClcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0TW9kYWwoKVxyXG4gICAgaW5pdENsb3NlTW9kYWwoKVxyXG4gICAgaW5pdFRvZ2dsZVZpc2libGVQYXNzKClcclxufSkiLCIvLyBQcm9kdWN0IGluZm9ybWF0aW9uIHNsaWRlclxyXG5sZXQgcHJvZHVjdEluZm9TbGlkZXJcclxuXHJcbmNvbnN0IGluaXRQcm9kdWN0SW5mb1NsaWRlciA9ICgpID0+IHtcclxuICAgIHByb2R1Y3RJbmZvU2xpZGVyID0gbmV3IFN3aXBlcignLnByb2R1Y3QtaW5mbyAuc3dpcGVyJywge1xyXG4gICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIC8vIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBhdXRvSGVpZ2h0OiB0cnVlLFxyXG4gICAgICAgIC8vIHNwYWNlQmV0d2VlbjogMTAsXHJcblxyXG4gICAgICAgIHNjcm9sbGJhcjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItc2Nyb2xsYmFyJyxcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICAgICAgNTc2OiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTkxKSB7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJbmZvU2xpZGVyKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RJbmZvU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSlcclxuICAgICAgICAgICAgcHJvZHVjdEluZm9TbGlkZXIgPSB1bmRlZmluZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcm9kdWN0SW5mb1NsaWRlcikge1xyXG4gICAgICAgIGluaXRQcm9kdWN0SW5mb1NsaWRlcigpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgaXNQcm9kdWN0UGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLXByb2R1Y3QnKVxyXG4gICAgY29uc3QgaXNBcnRpY2xlUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWFydGljbGUnKVxyXG4gICAgY29uc3QgaXNEb3RzUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWRvdHMnKVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgSW5mbyBzbGlkZXIgb25seSBmb3IgUHJvZHVjdCwgQXJ0aWNsZSBhbmQgRG90cyBwYWdlc1xyXG4gICAgaWYgKCFpc1Byb2R1Y3RQYWdlICYmICFpc0FydGljbGVQYWdlICYmICFpc0RvdHNQYWdlKSByZXR1cm5cclxuXHJcbiAgICBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyKClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIGNoZWNrUHJvZHVjdEluZm9TbGlkZXIoKVxyXG4gICAgfSlcclxufSlcclxuIiwiLy8gUHJvZHVjdCByZWNvbW1lbmRhdGlvbiBzbGlkZXJcclxubGV0IHByb2R1Y3RSZWNvbW1TbGlkZXJcclxuXHJcbmNvbnN0IGNoZWNrUmVjb21tU2xpZGVyU2Nyb2xsYmFyID0gKHN3aXBlciwgc2Nyb2xsYmFyKSA9PiB7XHJcbiAgICBpZiAoIXNjcm9sbGJhciB8fCBzY3JvbGxiYXIuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCBpc1Njcm9sbGJhckhpZGUgPSBzY3JvbGxiYXIuY2xhc3NMaXN0XHJcbiAgICAgICAgLmNvbnRhaW5zKCdzd2lwZXItc2Nyb2xsYmFyLWxvY2snKVxyXG5cclxuICAgIGlzU2Nyb2xsYmFySGlkZVxyXG4gICAgICAgID8gc3dpcGVyLmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1oaWRkZW4nKVxyXG4gICAgICAgIDogc3dpcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1oaWRkZW4nKVxyXG59XHJcblxyXG5jb25zdCBjaGVja1NsaWRlcnNCb3R0b21PZmZzZXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzd2lwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyJykpXHJcblxyXG4gICAgc3dpcGVycy5mb3JFYWNoKHN3aXBlciA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsYmFyID0gc3dpcGVyLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2Nyb2xsYmFyJylcclxuICAgICAgICBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhcihzd2lwZXIsIHNjcm9sbGJhcilcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXRQcm9kdWN0UmVjb21tU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgcHJvZHVjdFJlY29tbVNsaWRlciA9IG5ldyBTd2lwZXIoJy5yZWNvbW1lbmRhdGlvbl9fc2xpZGVyIC5zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgLy8gYXV0b0hlaWdodDogdHJ1ZSxcclxuXHJcbiAgICAgICAgc2Nyb2xsYmFyOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1zY3JvbGxiYXInLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA1NzY6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgOTkxOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMTIwMDoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzd2lwZXIgPSB0aGlzLmVsXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGxiYXIgPSB0aGlzLnNjcm9sbGJhci5lbFxyXG4gICAgICAgICAgICAgICAgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIoc3dpcGVyLCBzY3JvbGxiYXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiAxMjAwICYmIHByb2R1Y3RSZWNvbW1TbGlkZXIpIHtcclxuICAgICAgICBBcnJheS5pc0FycmF5KHByb2R1Y3RSZWNvbW1TbGlkZXIpXHJcbiAgICAgICAgICAgID8gcHJvZHVjdFJlY29tbVNsaWRlci5mb3JFYWNoKHNsaWRlciA9PiBzbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKSlcclxuICAgICAgICAgICAgOiBwcm9kdWN0UmVjb21tU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSlcclxuXHJcbiAgICAgICAgcHJvZHVjdFJlY29tbVNsaWRlciA9IHVuZGVmaW5lZFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJvZHVjdFJlY29tbVNsaWRlcikge1xyXG4gICAgICAgIGluaXRQcm9kdWN0UmVjb21tU2xpZGVyKClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1Byb2R1Y3RQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtcHJvZHVjdCcpXHJcbiAgICBjb25zdCBpc0FydGljbGVQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtYXJ0aWNsZScpXHJcbiAgICBjb25zdCBpc0RvdHNQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtZG90cycpXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBSZWNvbW1lbmRhdGlvbiBzbGlkZXIgb25seSBmb3IgUHJvZHVjdCwgQXJ0aWNsZSBhbmQgRG90cyBwYWdlc1xyXG4gICAgaWYgKCFpc1Byb2R1Y3RQYWdlICYmICFpc0FydGljbGVQYWdlICYmICFpc0RvdHNQYWdlKSByZXR1cm5cclxuXHJcbiAgICBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgY2hlY2tQcm9kdWN0UmVjb21tU2xpZGVyKClcclxuICAgICAgICBjaGVja1NsaWRlcnNCb3R0b21PZmZzZXQoKVxyXG4gICAgfSlcclxufSlcclxuIiwiLyoqXHJcbiAqIFNob3cgYSBzbWFsbCBtZXNzYWdlIHdpdGggdGl0bGUgYW5kIHRleHQgaW4gdGhlIHRvcCByaWdodCBjb3JuZXIgb2YgdGhlIHNjcmVlbi5cclxuICogVGhlIG1ldGhvZCBleHBlY3RzIGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXIgcGVyIGlucHV0LlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3RpdGxlPXVuZGVmaW5lZF0gLSBUaGUgaGVhZGxpbmUgb2YgdGhlIG1lc3NhZ2UgaW4gb25lIGxpbmUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZT11bmRlZmluZWRdIC0gT25lIGxpbmUgbWVzc2FnZSB0ZXh0LlxyXG4gKi9cclxud2luZG93LnNob3dNb2RhbE1zZyA9IGZ1bmN0aW9uKHRpdGxlID0gJycsIG1lc3NhZ2UgPSAnJykge1xyXG4gICAgaWYgKCF0aXRsZSAmJiAhbWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSdzIG5vIHRpdGxlIG9yIG1lc3NhZ2UgZm9yIHNob3dpbmcgaW4gbW9kYWwgd2luZG93LlwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgdGl0bGUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkluY29ycmVjdCB0eXBlIG9mIHRpdGxlLiBJdCBzaG91bGQgYmUgc3RyaW5nLlwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgbWVzc2FnZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW5jb3JyZWN0IHR5cGUgb2YgbWVzc2FnZS4gSXQgc2hvdWxkIGJlIHN0cmluZy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tc2ctY29udGFpbmVyJylcclxuICAgIGNvbnN0IFtjYXJkLCBib2R5XSA9IGNyZWF0ZU1vZGFsTXNnQ2FyZCh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FyZClcclxuICAgIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKVxyXG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGNhcmQuY2xhc3NMaXN0LmFkZCgndW5jb2xsYXBzZWQnKSwgNTApXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuICAgIH0sIDEwMClcclxuXHJcbiAgICBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSwgNTAwMClcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21zZy1jb250YWluZXInKVxyXG4gICAgY29uc3QgaW5uZXJFbG1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1tc2dfX2NhcmQnKVxyXG5cclxuICAgIGlubmVyRWxtcy5sZW5ndGggPiAwXHJcbiAgICAgICAgPyBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcbiAgICAgICAgOiBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU1vZGFsTXNnQ2FyZCh0aXRsZSwgbWVzc2FnZSkge1xyXG4gICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW1zZ19fY2FyZCcpXHJcblxyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW1zZ19fYm9keScpXHJcblxyXG4gICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgY29udGVudC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2NvbnRlbnQnKVxyXG5cclxuICAgIGNvbnN0IGNhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcclxuICAgIGNhcHRpb24udGV4dENvbnRlbnQgPSB0aXRsZVxyXG5cclxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIHRleHQudGV4dENvbnRlbnQgPSBtZXNzYWdlXHJcblxyXG4gICAgaWYgKHRpdGxlKSBjb250ZW50LmFwcGVuZENoaWxkKGNhcHRpb24pXHJcbiAgICBpZiAobWVzc2FnZSkgY29udGVudC5hcHBlbmRDaGlsZCh0ZXh0KVxyXG5cclxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoaWNvbilcclxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoY29udGVudClcclxuXHJcbiAgICBjYXJkLmFwcGVuZENoaWxkKGJvZHkpXHJcblxyXG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhpZGVNb2RhbE1zZ0hhbmRsZXIpXHJcblxyXG4gICAgcmV0dXJuIFtjYXJkLCBib2R5XVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTW9kYWxNc2dIYW5kbGVyKCkge1xyXG4gICAgY29uc3QgY2FyZCA9IHRoaXNcclxuICAgIGNvbnN0IGJvZHkgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1tc2dfX2JvZHknKVxyXG4gICAgaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHkpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5LCB0aW1lb3V0ID0gMCkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxyXG4gICAgfSwgdGltZW91dClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnLCAnaGlkZGVuJylcclxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3VuY29sbGFwc2VkJylcclxuICAgIH0sIHRpbWVvdXQgKyAxMDApXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY2FyZC5yZW1vdmUoKTtcclxuICAgICAgICBjaGVja01vZGFsTXNnQ29udGFpbmVyKClcclxuICAgIH0sIHRpbWVvdXQgKyAyMDApXHJcbn1cclxuIiwiY29uc3Qgc2hvd1NwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzcGlubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKVxyXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyksIDEwMClcclxufVxyXG5cclxuY29uc3QgaGlkZVNwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzcGlubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKVxyXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5JyksIDEwMDApXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJykpIHtcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93ID0gc2hvd1NwaW5uZXJcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlID0gaGlkZVNwaW5uZXJcclxuICAgIH1cclxufSkiLCJjb25zdCBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AgPSAoYnV0dG9uKSA9PiB7XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0U2Nyb2xsVG9Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsVG9Ub3AnKVxyXG5cclxuICAgIGlmICghYnV0dG9uKSByZXR1cm5cclxuXHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzbW9vdGhTY3JvbGxUbygwKSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AoYnV0dG9uKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0U2Nyb2xsVG9Ub3AoKVxyXG59KSIsIiIsIi8vIE9wZW4gYW5kIGNsb3NlIG1vYmlsZSBuYXZpZ2F0aW9uXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBuYXZDbG9zZSA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNsb3NlJykpXHJcbiAgICBjb25zdCBuYXZUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3Rlcl9fbmF2LWxpbmtfbWVudScpXHJcbiAgICBjb25zdCBoZWFkZXJOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYnKVxyXG4gICAgY29uc3QgbW9kYWxCYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbW9kYWwtYmFjaycpXHJcbiAgICBjb25zdCBuYXZQcm9kTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1saW5rX3Byb2R1Y3QnKVxyXG4gICAgY29uc3QgbmF2SXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKSlcclxuICAgIGNvbnN0IG5hdkxpbmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtbGluaycpKVxyXG4gICAgY29uc3QgbmF2Q29sbGFwc2VzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKSlcclxuXHJcbiAgICBpZiAoIW5hdlRvZ2dsZXIpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdiA9IChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAvLyBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG5hdlByb2RMaW5rLmNsaWNrKClcclxuICAgICAgICAgICAgfSwgMTAwKVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcbiAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBidXJnZXJcclxuICAgIG5hdlRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZU5hdihmYWxzZSlcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b2dnbGVOYXYodHJ1ZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBjbG9zZSBidXR0b25cclxuICAgIG5hdkNsb3NlLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PnRvZ2dsZU5hdihmYWxzZSkpXHJcbiAgICB9KVxyXG5cclxuICAgIG1vZGFsQmFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICB0b2dnbGVOYXYoZmFsc2UpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE9wZW4gYW5kIGNsb3NlIE5hdmlnYXRpb24gaXRlbXNcclxuICAgIGNvbnN0IGNvbGxhcHNBbGxOYXZJdGVtID0gKCkgPT4ge1xyXG4gICAgICAgIG5hdkl0ZW1zLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKSlcclxuICAgICAgICBuYXZMaW5rcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxuICAgICAgICBuYXZDb2xsYXBzZXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdkl0ZW0gPSAoYnRuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcblxyXG4gICAgICAgIGlmICghaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBjb25zdCBuYXZJdGVtID0gYnRuLmNsb3Nlc3QoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKVxyXG5cclxuICAgICAgICAgICAgaWYgKG5hdkl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hdkNvbGxhcHNlID0gbmF2SXRlbS5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKVxyXG5cclxuICAgICAgICAgICAgICAgIG5hdkl0ZW0uY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgICAgICBuYXZDb2xsYXBzZS5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZMaW5rcy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZU5hdkl0ZW0odGhpcylcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFNlYXJjaGluZyBhbmQgU3RpY2t5IGhlYWRlclxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXHJcbiAgICBjb25zdCBzZWFyY2hUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1jbG9zZScpXHJcbiAgICBjb25zdCBzZWFyY2hQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1pbnB1dCcpXHJcbiAgICBjb25zdCBzZWFyY2hSZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1yZXNldCcpXHJcbiAgICBjb25zdCBzZWFyY2hIaW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1oaW50cycpXHJcblxyXG4gICAgaWYgKCFzZWFyY2hUb2dnbGVyKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCB0b2dnbGVTZWFyY2hQYW5lbCA9IChoaWRlID0gZmFsc2UpID0+IHtcclxuICAgICAgICBjb25zdCBpc1Zpc2libGUgPSBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSAxMDBcclxuXHJcbiAgICAgICAgaWYgKCFpc1Zpc2libGUgJiYgIWhpZGUpIHtcclxuICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZScpXHJcbiAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfd2l0aC1zZWFyY2gtcGFuZWwnKVxyXG4gICAgICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoUmVzZXQuY2xpY2soKVxyXG4gICAgICAgICAgICByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJylcclxuICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl93aXRoLXNlYXJjaC1wYW5lbCcpXHJcbiAgICAgICAgfSwgMjAwKVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaFRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgfSlcclxuXHJcbiAgICBzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCgpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL3NlYXJjaC5qc29uJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVzdC10ZWNobm9saWdodHYyLm1hc3NpdmUucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJy9hcGkvcHJvZHVjdC9zZWFyY2gnXHJcbiAgICBjb25zdCBUSFJPVFRMRV9USU1FT1VUID0gMzAwXHJcbiAgICBsZXQgc2VhcmNoUmVxdWVzdFRpbWVvdXRJZFxyXG5cclxuICAgIGNvbnN0IHByaW50UXVlcnlSZXN1bHQgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIC8vIFJlc2V0IGFsbCBjaGlsZHJlbiBub2RlcyBvZiBzZWFyY2ggaGludHNcclxuICAgICAgICB3aGlsZSAoc2VhcmNoSGludHMuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5yZW1vdmVDaGlsZChzZWFyY2hIaW50cy5maXJzdENoaWxkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaGludHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIGhpbnRzLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fc2VhcmNoLWxpbmtzJylcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBudW0gaW4gZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zdCBoaW50ID0gZGF0YVtudW1dXHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcclxuICAgICAgICAgICAgbGluay5ocmVmID0gaGludC51cmxcclxuICAgICAgICAgICAgbGluay5pbm5lclRleHQgPSBoaW50LnRpdGxlXHJcbiAgICAgICAgICAgIGhpbnRzLmFwcGVuZENoaWxkKGxpbmspXHJcblxyXG4gICAgICAgICAgICBpZiAobnVtID4gOCkgYnJlYWtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKGhpbnRzKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgICAgIHNldEhhbmRsZXJUb0hlbHBlcnMoKVxyXG5cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA5OTIpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZmV0Y2hTZWFyY2hpbmdEYXRhID0gYXN5bmMocXVlcnkpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChTRUFSQ0hfUkVRVUVTVF9VUkwgKyBgP3F1ZXJ5PSR7cXVlcnl9YClcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQt9Cw0L/RgNC+0YHQsCDQv9C+0LjRgdC60LAnKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgICAgICBwcmludFF1ZXJ5UmVzdWx0KGRhdGEpXHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09ICcnICkge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXNldC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChzZWFyY2hSZXF1ZXN0VGltZW91dElkKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICAvLyAqKiogRmV0Y2hpbmcgc2VhcmNoIHJlcXVlc3RzIGFuZCBzaG93IHJlc3VsdHMgLS0tIFNUQVJUXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQpXHJcbiAgICAgICAgc2VhcmNoUmVxdWVzdFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICgpID0+IGZldGNoU2VhcmNoaW5nRGF0YSh0aGlzLnZhbHVlKSxcclxuICAgICAgICAgICAgVEhST1RUTEVfVElNRU9VVFxyXG4gICAgICAgIClcclxuICAgICAgICAvLyAqKiogRmV0Y2hpbmcgc2VhcmNoIHJlcXVlc3RzIGFuZCBzaG93IHJlc3VsdHMgLS0tIEZJTklTSFxyXG4gICAgfSlcclxuXHJcbiAgICBzZWFyY2hSZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIHJlc2V0SGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICB9KVxyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNTZWFyY2hUb2dnbGUgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xvc2VzdCgnLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcblxyXG4gICAgICAgIGNvbnN0IGlzU2VhcmNoUGFuZWwgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xvc2VzdCgnLmhlYWRlcl9fc2VhcmNoJylcclxuXHJcbiAgICAgICAgY29uc3QgaXNUdWNoRGV2aWNlID0gd2luZG93LmlubmVyV2lkdGggPCA5OTJcclxuXHJcbiAgICAgICAgaWYgKCFpc1R1Y2hEZXZpY2UgJiYgIWlzU2VhcmNoUGFuZWwgJiYgIWlzU2VhcmNoVG9nZ2xlKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBTZXQgaGVscCB0ZXh0IGZyb20gaGVscGVyIGJ1dHRvbiB1bmRlciB0aGUgc2VhcmNoIGlucHV0IHRvIHRoZSBzZWFyY2ggdmFsdWVcclxuICAgIGNvbnN0IHJlcXVlc3RDb21wbGV0aW9uID0gKGUpID0+IHtcclxuICAgICAgICBjb25zdCBhZGRpdGlvblZhbHVlID0gZS50YXJnZXQuaW5uZXJUZXh0XHJcbiAgICAgICAgc2VhcmNoSW5wdXQudmFsdWUgPSBgJHtzZWFyY2hJbnB1dC52YWx1ZX0gJHthZGRpdGlvblZhbHVlfWBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZXRIYW5kbGVyVG9IZWxwZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEhlbHBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19zZWFyY2gtaGVscHMgc3BhbicpKVxyXG5cclxuICAgICAgICBzZWFyY2hIZWxwZXJzLmZvckVhY2goYnRuID0+IGJ0blxyXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXF1ZXN0Q29tcGxldGlvbikpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBzZWFyY2hIZWxwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fc2VhcmNoLWhlbHBzIHNwYW4nKSlcclxuXHJcbiAgICAgICAgc2VhcmNoSGVscGVycy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgICAgIGJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlcXVlc3RDb21wbGV0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RpY2t5IGhlYWRlclxyXG4gICAgbGV0IGJlZm9yZVNjcm9sbFRvcCA9IDBcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZGVyXCIpXHJcbiAgICAgICAgY29uc3QgaGVhZGVySGVpZ2h0ID0gaGVhZGVyLmNsaWVudEhlaWdodFxyXG4gICAgICAgIGNvbnN0IGRlbGF5ID0gJy43cydcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRTY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWVxyXG5cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5OTEpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTY3JvbGxUb3AgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnY29tcHJlc3NlZCcpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdjb21wcmVzc2VkJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IDEwMCAmJiBjdXJyZW50U2Nyb2xsVG9wID4gYmVmb3JlU2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzVmlzaWJsZVNlYXJjaCA9IHNlYXJjaFBhbmVsXHJcbiAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbElkXHJcblxyXG4gICAgICAgICAgICBpZiAoaXNWaXNpYmxlU2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXlcclxuICAgICAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSAnMHMnXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IGAtJHtoZWFkZXJIZWlnaHR9cHhgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJlZm9yZVNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgfSk7XHJcbn0pXHJcblxyXG4vLyBDYXJ0IHVwZGF0ZSBsaXN0ZW5pbmdcclxuY29uc3Qgc2V0Q2FydFVwZGFnZUxpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY2FydFByb2R1Y3RDb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FydFByb2R1Y3RDb3VudCcpXHJcblxyXG4gICAgaWYgKCFjYXJ0UHJvZHVjdENvdW50Tm9kZSkgcmV0dXJuXHJcblxyXG4gICAgY2FydFByb2R1Y3RDb3VudE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2FydFVwZGF0ZUV2ZW50JywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IHdpbmRvdy5DQVJULnByb2R1Y3RzXHJcbiAgICAgICAgbGV0IHByb2R1Y3RDb3VudCA9IDBcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVyYXRvciBvZiBwcm9kdWN0cykge1xyXG4gICAgICAgICAgICBwcm9kdWN0Q291bnQgKz0gaXRlcmF0b3IuY291bnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmlubmVyVGV4dCA9IHByb2R1Y3RDb3VudFxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmRhdGFzZXQuY291bnQgPSBwcm9kdWN0Q291bnQudG9TdHJpbmcoKVxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNhcnRQcm9kdWN0Q291bnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLm1lc3NhZ2UpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHNldENhcnRVcGRhZ2VMaXN0ZW5lcigpXHJcbn0pXHJcbiIsIi8vIERlbGV0aW5nIGJsb2NraW5nIG9mIGFsbCBhbmltYXRpb24gZm9yIGZpeCBhbmltYXRpb24gYXJ0ZWZhY3RzXHJcbmNvbnN0IHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIgPSAoKSA9PiB7XHJcbiAgICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmFuc2l0aW9uLWJsb2NrZXInKSlcclxuICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc2l0aW9uLWJsb2NrZXInKSlcclxufVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIpXHJcblxyXG4vLyBCbG9ja2luZyBhbGwgYW5pbWF0aW9uIGF0IHRoZSB3aW5kb3cgcmVzaXppbmcgcHJvY2Vzc1xyXG5jb25zdCBhZGRBbmltYXRpb25CbG9ja2VyID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0cmFuc2l0aW9uLWJsb2NrZXInKVxyXG59XHJcblxyXG5sZXQgYmxvY2tBbmltYXRpb25UaW1lclxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgY2xlYXJUaW1lb3V0KGJsb2NrQW5pbWF0aW9uVGltZXIpXHJcbiAgICBhZGRBbmltYXRpb25CbG9ja2VyKClcclxuXHJcbiAgICBibG9ja0FuaW1hdGlvblRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlcigpXHJcbiAgICB9LCAzMDApXHJcbn0pXHJcblxyXG4vLyBIYW5kbGUgbGluayB3aXRoIHNtb290aCBhbmltYXRpb24gdG8gYW5jaG9yIHBsYWNlIG9uIHRoZSBwYWdlXHJcbmNvbnN0IHNtb290aExpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXj1cIiNcIl0nKVxyXG5mb3IgKGxldCBzbW9vdGhMaW5rIG9mIHNtb290aExpbmtzKSB7XHJcbiAgICBzbW9vdGhMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgY29uc3QgaWQgPSBzbW9vdGhMaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpXHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2lkfWApXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IHRhcmdldE5vZGUub2Zmc2V0VG9wXHJcbiAgICAgICAgICAgIGNvbnN0IGRldmljZU9mZnNldCA9IHdpbmRvdy5vdXRlcldpZHRoID4gNzY4ID8gLTEwMCA6IC0yMFxyXG5cclxuICAgICAgICAgICAgc21vb3RoU2Nyb2xsVG8odGFyZ2V0T2Zmc2V0ICsgZGV2aWNlT2Zmc2V0LCA3MDApXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZXJlJ3Mgbm8gdGFyZ2V0IG5vZGUgZm9yIHNjcm9sbGluZyB0byBwbGFjZS4gVGhlIHNlbGVjdG9yIGlzbid0IGNvcnJlY3QhXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn07XHJcblxyXG4vLyBBbmltYXRpb24gaXRlbXMgd2hlbiB1c2VyIGhhcyBzY3JvbGxlZCBzY3JlZW4gdG8gcGxhY2Ugb2YgaXRlbVxyXG5jb25zdCBjaGVja0FuaW1hdGlvbkVsbXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBhbmltYXRpb25FbG1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5pbWF0aW9uLWVsZW1lbnQnKSlcclxuXHJcbiAgICByZXR1cm4gYW5pbWF0aW9uRWxtcy5sZW5ndGggPiAwXHJcbn1cclxuXHJcbmNvbnN0IHNob3dBbmltRWxlbWVudHMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBlbG1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5pbWF0aW9uLWVsZW1lbnQnKSlcclxuXHJcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXRcclxuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgLy8gY29uc3QgcG9pbnRPZkRpc3BsYXkgPSB3aW5kb3dIZWlnaHQgLyAxLjIgLy8gZm9yIHNob3cgb24gdGhlIGhhbGYgb2YgdGhlIHNjcmVlblxyXG4gICAgY29uc3QgcG9pbnRPZkRpc3BsYXkgPSB3aW5kb3dIZWlnaHRcclxuXHJcbiAgICBlbG1zLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tVG9wID0gcmVjdC50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXRcclxuXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlRnJvbVRvcCAtIHBvaW50T2ZEaXNwbGF5IDwgc2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGlvbi1lbGVtZW50JylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGlmICghY2hlY2tBbmltYXRpb25FbG1zKCkpIHtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2hvd0FuaW1FbGVtZW50cylcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2V0QW5pbWF0aW9uRWxtcyA9ICgpID0+IHtcclxuICAgIGlmIChjaGVja0FuaW1hdGlvbkVsbXMoKSkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHNob3dBbmltRWxlbWVudHMoKVxyXG4gICAgICAgIHNldEFuaW1hdGlvbkVsbXMoKVxyXG4gICAgfSwgMTAwKVxyXG59KVxyXG5cclxuLy8gTGF6eSBjcm9sbCBvbiBhbGwgcGFnZVxyXG4vLz1yZXF1aXJlIHV0aWxzL1Ntb290aFNjcm9sbC5taW4uanNcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBTbW9vdGhTY3JvbGwoe1xyXG4gICAgICAgIC8vINCS0YDQtdC80Y8g0YHQutGA0L7Qu9C70LAgNDAwID0gMC40INGB0LXQutGD0L3QtNGLXHJcbiAgICAgICAgYW5pbWF0aW9uVGltZSAgICA6IDgwMCxcclxuICAgICAgICAvLyDQoNCw0LfQvNC10YAg0YjQsNCz0LAg0LIg0L/QuNC60YHQtdC70Y/RhVxyXG4gICAgICAgIHN0ZXBTaXplICAgICAgICAgOiA3NSxcclxuXHJcbiAgICAgICAgLy8g0JTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQvdCw0YHRgtGA0L7QudC60Lg6XHJcbiAgICAgICAgLy8g0KPRgdC60L7RgNC10L3QuNC1XHJcbiAgICAgICAgYWNjZWxlcmF0aW9uRGVsdGEgOiAzMCxcclxuICAgICAgICAvLyDQnNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0YPRgdC60L7RgNC10L3QuNC1XHJcbiAgICAgICAgYWNjZWxlcmF0aW9uTWF4ICAgOiAyLFxyXG5cclxuICAgICAgICAvLyDQn9C+0LTQtNC10YDQttC60LAg0LrQu9Cw0LLQuNCw0YLRg9GA0YtcclxuICAgICAgICBrZXlib2FyZFN1cHBvcnQgICA6IHRydWUsXHJcbiAgICAgICAgLy8g0KjQsNCzINGB0LrRgNC+0LvQu9CwINGB0YLRgNC10LvQutCw0LzQuCDQvdCwINC60LvQsNCy0LjQsNGC0YPRgNC1INCyINC/0LjQutGB0LXQu9GP0YVcclxuICAgICAgICBhcnJvd1Njcm9sbCAgICAgICA6IDUwLFxyXG5cclxuICAgICAgICAvLyBQdWxzZSAobGVzcyB0d2Vha2FibGUpXHJcbiAgICAgICAgLy8gcmF0aW8gb2YgXCJ0YWlsXCIgdG8gXCJhY2NlbGVyYXRpb25cIlxyXG4gICAgICAgIHB1bHNlQWxnb3JpdGhtICAgOiB0cnVlLFxyXG4gICAgICAgIHB1bHNlU2NhbGUgICAgICAgOiA0LFxyXG4gICAgICAgIHB1bHNlTm9ybWFsaXplICAgOiAxLFxyXG5cclxuICAgICAgICAvLyDQn9C+0LTQtNC10YDQttC60LAg0YLQsNGH0L/QsNC00LBcclxuICAgICAgICB0b3VjaHBhZFN1cHBvcnQgICA6IHRydWUsXHJcbiAgICB9KVxyXG59KVxyXG5cclxuXHJcbi8vIFBob25lIG1hc2tpbmdcclxuY29uc3QgaW5pdFBob25lc01hc2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBwaG9uZUludHB1cyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9XCJ0ZWxcIl0nKSlcclxuXHJcbiAgICBwaG9uZUludHB1cy5mb3JFYWNoKHBob25lID0+IHtcclxuICAgICAgICBjb25zdCBwaG9uZU1hc2tPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtYXNrOiAnK3s3fSAoMDAwKSAwMDAtMDAtMDAnLFxyXG4gICAgICAgICAgICBsYXp5OiB0cnVlLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlckNoYXI6ICcjJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwaG9uZU1hc2sgPSBJTWFzayhcclxuICAgICAgICAgICAgcGhvbmUsXHJcbiAgICAgICAgICAgIHBob25lTWFza09wdGlvbnNcclxuICAgICAgICApXHJcblxyXG4gICAgICAgIHBob25lLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IGZhbHNlfSkpXHJcbiAgICAgICAgcGhvbmUuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiB0cnVlfSkpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRQaG9uZXNNYXNrKClcclxufSlcclxuIiwiLy8gSW5pdCBjYXJ0IGN1c3RvbSBFdmVudFxyXG5jb25zdCBjYXJ0RXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2NhcnRVcGRhdGVFdmVudCcsIHtcclxuICAgIGRldGFpbDoge1xyXG4gICAgICAgIG1lc3NhZ2U6ICdGaXJlZCBjYXJ0IHByb2R1Y3QgdXBkYXRlZCBjdXN0b20gRXZlbnQhJ1xyXG4gICAgfSxcclxuICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgY2FuY2VsYWJsZTogZmFsc2VcclxufSlcclxuXHJcbi8vIE1ldGhvZHMgZm9yIHdvcmsgd2l0aCBjYXJ0XHJcbndpbmRvdy5zZXRQcm9kdWN0VG9DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YnQsNC10Lwg0YTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YLQvtCy0LDRgNCwINCyINC60L7RgNC30LjQvdC1OicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9zZXQnLCB7IC8vIC9hamF4L2NhcnQvc2V0IC0tLSBodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtc2V0Lmpzb25cclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5kYXRhXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGJ0LDQtdC8INGC0L7QstCw0YDRiyDQsiDQutC+0YDQt9C40L3QtScsIGRhdGEpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGA0LDQt9C80LXRidC10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQmtC+0YDQt9C40L3QtSEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkUHJvZHVjdFRvQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0JTQvtCx0LDQstC70LXQvdC40LUg0YLQvtCy0LDRgNCwINCyINC60L7RgNC30LjQvdGDOicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9hZGQnLCB7IC8vIC9hamF4L2NhcnQvYWRkIC0tLSBodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtYWRkLmpzb25cclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5kYXRhXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0JTQvtCx0LDQstC70LXQvdC40LUg0YLQvtCy0LDRgNCwINCyINC60L7RgNC30LjQvdGDJywgZGF0YSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LTQvtCx0LDQstC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINCa0L7RgNC30LjQvdGDISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5yZW1vdmVQcm9kdWN0RnJvbUNhcnQgPSBhc3luYyAoe2FydCwgY291bnR9KSA9PiB7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ9Cj0LTQsNC70LXQvdC40LUg0YLQvtCy0LDRgNCwINC40Lcg0LrQvtGA0LfQuNC90Ys6JywgYXJ0LCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnYXJ0JywgYXJ0KVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2RlbCcsIHsgLy8gL2FqYXgvY2FydC9kZWwgLS0tIGh0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1kZWwuanNvblxyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLmRhdGFdXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCfQo9C00LDQu9C10L3QuNC1INGC0L7QstCw0YDQsCDQuNC3INC60L7RgNC30LjQvdGLJywgZGF0YSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YPQtNCw0LvQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LjQtyDQmtC+0YDQt9C40L3RiyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gQ2FydCBQcm94eVxyXG5jb25zdCBjYXJ0R2V0ID0gKHRhcmdldCwgcHJvcCkgPT4ge1xyXG4gICAgcmV0dXJuIHRhcmdldFtwcm9wXVxyXG59XHJcblxyXG5jb25zdCBjYXJ0U2V0ID0gKHRhcmdldCwgcHJvcCwgdmFsKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnU0VUVElORycpO1xyXG4gICAgY29uc29sZS5sb2coJ3RhcmdldCcsIHRhcmdldCk7XHJcbiAgICBjb25zb2xlLmxvZygncHJvcCcsIHByb3ApO1xyXG4gICAgY29uc29sZS5sb2coJ3ZhbCcsIHZhbCk7XHJcblxyXG4gICAgaWYgKHByb3AgPT09ICdwcm9kdWN0cycpIHtcclxuICAgICAgICB0YXJnZXQucHJvZHVjdHMgPSBbLi4udmFsXVxyXG5cclxuICAgICAgICAvLyBEaXNwYXRoY2luZyBjdXN0b20gY2FydCB1cGRhdGUgRXZlbnRcclxuICAgICAgICBjb25zdCBjYXJ0UHJvZHVjdENvdW50Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJ0UHJvZHVjdENvdW50JylcclxuICAgICAgICBpZiAoY2FydFByb2R1Y3RDb3VudE5vZGUpIGNhcnRQcm9kdWN0Q291bnROb2RlLmRpc3BhdGNoRXZlbnQoY2FydEV2ZW50KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlXHJcbn1cclxuXHJcbmNvbnN0IGluaXRDYXJ0ID0gYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCd3aW5kb3cuQ0FSVCBiZWZvcmUnLCB3aW5kb3cuQ0FSVCk7XHJcblxyXG4gICAgaWYgKCF3aW5kb3cuQ0FSVCkge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2dldCcsIHsgLy8gL2FqYXgvY2FydC9nZXQgLS0tIGh0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1nZXQuanNvblxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5DQVJUID0gbmV3IFByb3h5KHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzOiBbLi4uZGF0YV1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBjYXJ0R2V0LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBjYXJ0U2V0XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0luaWNpYWxpemluZyBjYXJ0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFNUQVJUJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZSBkYXRhJywgZGF0YSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3dpbmRvdy5DQVJUJywgd2luZG93LkNBUlQpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbmljaWFsaXppbmcgY2FydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGSU5JU0gnKTtcclxuXHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LfQsNC/0YDQvtGB0LAg0JrQvtGA0LfQuNC90YshINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdENhcnQoKVxyXG59KVxyXG5cclxud2luZG93LmNhcnRVcGRhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuQ0FSVCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZ2V0JywgeyAvLyAvYWpheC9jYXJ0L2dldCAtLS0gaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWdldC5qc29uXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5kYXRhXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0sIDUwMDApIl19
