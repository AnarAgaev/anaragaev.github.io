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

const getTargetCardsPic = (node, dataTargetTypeVal) => {
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

            const parent = this.closest('.cards-series__item')
            const targetPicType = this.dataset.targetType
            const targetPic = getTargetCardsPic(parent, targetPicType)

            // Set active tab
            resetAllCardsTabs(parent)
            this.classList.add('active')


            // Set active image
            if (targetPic) {
                resetAllCardsPics(parent)
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
    const phoneInputs = Array.from(document
        .querySelectorAll('[type="tel"]:not(.cart__calc [type="tel"])'))

    phoneInputs.forEach(phone => {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJmb3JtYXROdW1iZXIuanMiLCJnZXRVcmxQYXJhbWV0ZXJCeU5hbWUuanMiLCJTbW9vdGhTY3JvbGwubWluLmpzIiwic21vb3RoU2Nyb2xsVG8uanMiLCJ0aHJvdHRsZS5qcyIsInZhbGlkYXRlRW1haWwuanMiLCJ2YWxpZGF0ZVBob25lLmpzIiwiYWNjb3VudC1mb3Jtcy9zY3JpcHQuanMiLCJjYXJkcy1pdGVtL3NjcmlwdC5qcyIsImNhcmRzLXNlcmllcy9zY3JpcHQuanMiLCJmaWx0ZXJzL3NjcmlwdC5qcyIsIm1vZGFscy9zY3JpcHQuanMiLCJwcm9kdWN0LWluZm8vc2NyaXB0LmpzIiwicmVjb21tZW5kYXRpb24vc2NyaXB0LmpzIiwic2Nyb2xsLXRvLXRvcC9zY3JpcHQuanMiLCJzaG93LW1vZGFsLW1zZy9zY3JpcHQuanMiLCJzcGlubmVyL3NjcmlwdC5qcyIsImZvb3Rlci9zY3JpcHQuanMiLCJoZWFkZXIvc2NyaXB0LmpzIiwibWFpbi5qcyIsImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25VQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDbGVhciBwaG9uZSBvZiBzcGFjZXMsIGJyYWNrZXRzLFxyXG4gKiBkYXNoZXMgYW5kIHBsdXMgc2lnbi4gTGVhdmUgb25seSBudW1iZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcGhvbmUgLSBUaGUgcGhvbmUsIHRoYXQgbmVlZHMgdG8gY2xlYXIuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gUGhvbmUgbnVtYmVyIGFzIGEgbnVtYmVyIHR5cGUuXHJcbiAqL1xyXG53aW5kb3cuY2xlYXJQaG9uZSA9IChwaG9uZSkgPT4ge1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KHBob25lLnJlcGxhY2UoL1xcRC9nLCBcIlwiKSlcclxufVxyXG4iLCIvKipcclxuICogRm9ybWF0dGluZyBudW1iZXIgdG8gdGhlIGxvY2FsIHZhbHVlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyfSBudW1iZXIgLSBWYWx1ZSBmb3IgZm9ybWF0dGluZy5cclxuICovXHJcblxyXG53aW5kb3cuZm9ybWF0TnVtYmVyID0gKG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUludChudW1iZXIudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMvZywgXCJcIikpXHJcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIiBcIik7XHJcbn1cclxuIiwiLyoqXHJcbiAqIEdldHRpbmcgZ2V0IHBhcmFtZXRlciBmcm9tIHRoZSB1cmxcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2VhcmNoIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtzdHJpbmd9IFt1cmxdIC0gVGhlIFVSTCBhZGRyZXNzLiBJZiB0aGlzIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCB0aGVuIHRoZSBzZWFyY2gsIGJ5IGRlZmF1bHQsIHdpbGwgb2NjdXIgaW4gdGhlIGN1cnJlbnQgVVJMLlxyXG4gKi9cclxud2luZG93LmdldFVybFBhcmFtZXRlckJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUsIHVybCkge1xyXG4gICAgaWYgKCFuYW1lKSByZXR1cm5cclxuXHJcbiAgICBpZiAoIXVybCkgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKVxyXG5cclxuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsXHJcblxyXG4gICAgaWYgKCFyZXN1bHRzWzJdKSByZXR1cm4gJydcclxuXHJcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSlcclxufVxyXG4iLCIvLyBUaGlzIGxpYiBpcyBmcm9tIGhlcmUgcGxhY2UgaHR0cHM6Ly90aWxkb3NobmF5YS5jb20vbW9kaWZpY2F0aW9uL3NvZnRzY3JvbGxcclxuISBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcywgaSwgYywgYSwgbyA9IHtcclxuICAgICAgICAgICAgZnJhbWVSYXRlOiAxNTAsXHJcbiAgICAgICAgICAgIGFuaW1hdGlvblRpbWU6IDQwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDEwMCxcclxuICAgICAgICAgICAgcHVsc2VBbGdvcml0aG06ICEwLFxyXG4gICAgICAgICAgICBwdWxzZVNjYWxlOiA0LFxyXG4gICAgICAgICAgICBwdWxzZU5vcm1hbGl6ZTogMSxcclxuICAgICAgICAgICAgYWNjZWxlcmF0aW9uRGVsdGE6IDUwLFxyXG4gICAgICAgICAgICBhY2NlbGVyYXRpb25NYXg6IDMsXHJcbiAgICAgICAgICAgIGtleWJvYXJkU3VwcG9ydDogITAsXHJcbiAgICAgICAgICAgIGFycm93U2Nyb2xsOiA1MCxcclxuICAgICAgICAgICAgZml4ZWRCYWNrZ3JvdW5kOiAhMCxcclxuICAgICAgICAgICAgZXhjbHVkZWQ6IFwiXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHAgPSBvLFxyXG4gICAgICAgIHUgPSAhMSxcclxuICAgICAgICBkID0gITEsXHJcbiAgICAgICAgbiA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZiA9ICExLFxyXG4gICAgICAgIG0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXHJcbiAgICAgICAgbCA9IFtdLFxyXG4gICAgICAgIGggPSAvXk1hYy8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pLFxyXG4gICAgICAgIHcgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IDM3LFxyXG4gICAgICAgICAgICB1cDogMzgsXHJcbiAgICAgICAgICAgIHJpZ2h0OiAzOSxcclxuICAgICAgICAgICAgZG93bjogNDAsXHJcbiAgICAgICAgICAgIHNwYWNlYmFyOiAzMixcclxuICAgICAgICAgICAgcGFnZXVwOiAzMyxcclxuICAgICAgICAgICAgcGFnZWRvd246IDM0LFxyXG4gICAgICAgICAgICBlbmQ6IDM1LFxyXG4gICAgICAgICAgICBob21lOiAzNlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdiA9IHtcclxuICAgICAgICAgICAgMzc6IDEsXHJcbiAgICAgICAgICAgIDM4OiAxLFxyXG4gICAgICAgICAgICAzOTogMSxcclxuICAgICAgICAgICAgNDA6IDFcclxuICAgICAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHkoKSB7XHJcbiAgICAgICAgaWYgKCFmICYmIGRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgZiA9ICEwO1xyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmJvZHksXHJcbiAgICAgICAgICAgICAgICB0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgbyA9IHdpbmRvdy5pbm5lckhlaWdodCxcclxuICAgICAgICAgICAgICAgIG4gPSBlLnNjcm9sbEhlaWdodDtcclxuICAgICAgICAgICAgaWYgKG0gPSAwIDw9IGRvY3VtZW50LmNvbXBhdE1vZGUuaW5kZXhPZihcIkNTU1wiKSA/IHQgOiBlLCBzID0gZSwgcC5rZXlib2FyZFN1cHBvcnQgJiYgWShcImtleWRvd25cIiwgeCksIHRvcCAhPSBzZWxmKSBkID0gITA7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKFEgJiYgbyA8IG4gJiYgKGUub2Zmc2V0SGVpZ2h0IDw9IG8gfHwgdC5vZmZzZXRIZWlnaHQgPD0gbykpIHtcclxuICAgICAgICAgICAgICAgIHZhciByLCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGEuc3R5bGUuY3NzVGV4dCA9IFwicG9zaXRpb246YWJzb2x1dGU7IHotaW5kZXg6LTEwMDAwOyB0b3A6MDsgbGVmdDowOyByaWdodDowOyBoZWlnaHQ6XCIgKyBtLnNjcm9sbEhlaWdodCArIFwicHhcIiwgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKSwgYyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByID0gciB8fCBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdSB8fCAoYS5zdHlsZS5oZWlnaHQgPSBcIjBcIiwgYS5zdHlsZS5oZWlnaHQgPSBtLnNjcm9sbEhlaWdodCArIFwicHhcIiwgciA9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKVxyXG4gICAgICAgICAgICAgICAgfSwgc2V0VGltZW91dChjLCAxMCksIFkoXCJyZXNpemVcIiwgYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGkgPSBuZXcgUihjKSkub2JzZXJ2ZShlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6ICEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6ICEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiAhMVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLCBtLm9mZnNldEhlaWdodCA8PSBvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGwuc3R5bGUuY2xlYXIgPSBcImJvdGhcIiwgZS5hcHBlbmRDaGlsZChsKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHAuZml4ZWRCYWNrZ3JvdW5kIHx8IHUgfHwgKGUuc3R5bGUuYmFja2dyb3VuZEF0dGFjaG1lbnQgPSBcInNjcm9sbFwiLCB0LnN0eWxlLmJhY2tncm91bmRBdHRhY2htZW50ID0gXCJzY3JvbGxcIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgYiA9IFtdLFxyXG4gICAgICAgIGcgPSAhMSxcclxuICAgICAgICByID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICBmdW5jdGlvbiBTKGQsIGYsIG0pIHtcclxuICAgICAgICBpZiAoZnVuY3Rpb24gKGUsIHQpIHtcclxuICAgICAgICAgICAgICAgIGUgPSAwIDwgZSA/IDEgOiAtMSwgdCA9IDAgPCB0ID8gMSA6IC0xLCBuLnggPT09IGUgJiYgbi55ID09PSB0IHx8IChuLnggPSBlLCBuLnkgPSB0LCBiID0gW10sIHIgPSAwKVxyXG4gICAgICAgICAgICB9KGYsIG0pLCAxICE9IHAuYWNjZWxlcmF0aW9uTWF4KSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gRGF0ZS5ub3coKSAtIHI7XHJcbiAgICAgICAgICAgIGlmIChlIDwgcC5hY2NlbGVyYXRpb25EZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSAoMSArIDUwIC8gZSkgLyAyO1xyXG4gICAgICAgICAgICAgICAgMSA8IHQgJiYgKHQgPSBNYXRoLm1pbih0LCBwLmFjY2VsZXJhdGlvbk1heCksIGYgKj0gdCwgbSAqPSB0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHIgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChiLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgeDogZixcclxuICAgICAgICAgICAgICAgIHk6IG0sXHJcbiAgICAgICAgICAgICAgICBsYXN0WDogZiA8IDAgPyAuOTkgOiAtLjk5LFxyXG4gICAgICAgICAgICAgICAgbGFzdFk6IG0gPCAwID8gLjk5IDogLS45OSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgIH0pLCAhZykge1xyXG4gICAgICAgICAgICB2YXIgbyA9IHEoKSxcclxuICAgICAgICAgICAgICAgIGggPSBkID09PSBvIHx8IGQgPT09IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIG51bGwgPT0gZC4kc2Nyb2xsQmVoYXZpb3IgJiYgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ID0gTShlKTtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IEJbdF0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGdldENvbXB1dGVkU3R5bGUoZSwgXCJcIilbXCJzY3JvbGwtYmVoYXZpb3JcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgQlt0XSA9IFwic21vb3RoXCIgPT0gb1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEJbdF1cclxuICAgICAgICAgICAgfShkKSAmJiAoZC4kc2Nyb2xsQmVoYXZpb3IgPSBkLnN0eWxlLnNjcm9sbEJlaGF2aW9yLCBkLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICB2YXIgdyA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0ID0gRGF0ZS5ub3coKSwgbyA9IDAsIG4gPSAwLCByID0gMDsgciA8IGIubGVuZ3RoOyByKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IGJbcl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSB0IC0gYS5zdGFydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGwgPj0gcC5hbmltYXRpb25UaW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gaSA/IDEgOiBsIC8gcC5hbmltYXRpb25UaW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHAucHVsc2VBbGdvcml0aG0gJiYgKGMgPSBGKGMpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGEueCAqIGMgLSBhLmxhc3RYID4+IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBhLnkgKiBjIC0gYS5sYXN0WSA+PiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG8gKz0gcywgbiArPSB1LCBhLmxhc3RYICs9IHMsIGEubGFzdFkgKz0gdSwgaSAmJiAoYi5zcGxpY2UociwgMSksIHItLSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGggPyB3aW5kb3cuc2Nyb2xsQnkobywgbikgOiAobyAmJiAoZC5zY3JvbGxMZWZ0ICs9IG8pLCBuICYmIChkLnNjcm9sbFRvcCArPSBuKSksIGYgfHwgbSB8fCAoYiA9IFtdKSwgYi5sZW5ndGggPyBqKHcsIGQsIDFlMyAvIHAuZnJhbWVSYXRlICsgMSkgOiAoZyA9ICExLCBudWxsICE9IGQuJHNjcm9sbEJlaGF2aW9yICYmIChkLnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gZC4kc2Nyb2xsQmVoYXZpb3IsIGQuJHNjcm9sbEJlaGF2aW9yID0gbnVsbCkpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGoodywgZCwgMCksIGcgPSAhMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlKGUpIHtcclxuICAgICAgICBmIHx8IHkoKTtcclxuICAgICAgICB2YXIgdCA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgfHwgZS5jdHJsS2V5KSByZXR1cm4gITA7XHJcbiAgICAgICAgaWYgKE4ocywgXCJlbWJlZFwiKSB8fCBOKHQsIFwiZW1iZWRcIikgJiYgL1xcLnBkZi9pLnRlc3QodC5zcmMpIHx8IE4ocywgXCJvYmplY3RcIikgfHwgdC5zaGFkb3dSb290KSByZXR1cm4gITA7XHJcbiAgICAgICAgdmFyIG8gPSAtZS53aGVlbERlbHRhWCB8fCBlLmRlbHRhWCB8fCAwLFxyXG4gICAgICAgICAgICBuID0gLWUud2hlZWxEZWx0YVkgfHwgZS5kZWx0YVkgfHwgMDtcclxuICAgICAgICBoICYmIChlLndoZWVsRGVsdGFYICYmIEsoZS53aGVlbERlbHRhWCwgMTIwKSAmJiAobyA9IGUud2hlZWxEZWx0YVggLyBNYXRoLmFicyhlLndoZWVsRGVsdGFYKSAqIC0xMjApLCBlLndoZWVsRGVsdGFZICYmIEsoZS53aGVlbERlbHRhWSwgMTIwKSAmJiAobiA9IGUud2hlZWxEZWx0YVkgLyBNYXRoLmFicyhlLndoZWVsRGVsdGFZKSAqIC0xMjApKSwgbyB8fCBuIHx8IChuID0gLWUud2hlZWxEZWx0YSB8fCAwKSwgMSA9PT0gZS5kZWx0YU1vZGUgJiYgKG8gKj0gNDAsIG4gKj0gNDApO1xyXG4gICAgICAgIHZhciByID0geih0KTtcclxuICAgICAgICByZXR1cm4gciA/ICEhIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmICghZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBsLmxlbmd0aCB8fCAobCA9IFtlLCBlLCBlXSk7XHJcbiAgICAgICAgICAgIGUgPSBNYXRoLmFicyhlKSwgbC5wdXNoKGUpLCBsLnNoaWZ0KCksIGNsZWFyVGltZW91dChhKSwgYSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuU1NfZGVsdGFCdWZmZXIgPSBsLmpvaW4oXCIsXCIpXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxyXG4gICAgICAgICAgICB9LCAxZTMpO1xyXG4gICAgICAgICAgICB2YXIgdCA9IDEyMCA8IGUgJiYgUChlKSxcclxuICAgICAgICAgICAgICAgIG8gPSAhUCgxMjApICYmICFQKDEwMCkgJiYgIXQ7XHJcbiAgICAgICAgICAgIHJldHVybiBlIDwgNTAgfHwgb1xyXG4gICAgICAgIH0obikgfHwgKDEuMiA8IE1hdGguYWJzKG8pICYmIChvICo9IHAuc3RlcFNpemUgLyAxMjApLCAxLjIgPCBNYXRoLmFicyhuKSAmJiAobiAqPSBwLnN0ZXBTaXplIC8gMTIwKSwgUyhyLCBvLCBuKSwgZS5wcmV2ZW50RGVmYXVsdCgpLCB2b2lkIEMoKSkgOiAhZCB8fCAhVyB8fCAoT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsIFwidGFyZ2V0XCIsIHtcclxuICAgICAgICAgICAgdmFsdWU6IHdpbmRvdy5mcmFtZUVsZW1lbnRcclxuICAgICAgICB9KSwgcGFyZW50LndoZWVsKGUpKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHgoZSkge1xyXG4gICAgICAgIHZhciB0ID0gZS50YXJnZXQsXHJcbiAgICAgICAgICAgIG8gPSBlLmN0cmxLZXkgfHwgZS5hbHRLZXkgfHwgZS5tZXRhS2V5IHx8IGUuc2hpZnRLZXkgJiYgZS5rZXlDb2RlICE9PSB3LnNwYWNlYmFyO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY29udGFpbnMocykgfHwgKHMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuICAgICAgICB2YXIgbiA9IC9eKGJ1dHRvbnxzdWJtaXR8cmFkaW98Y2hlY2tib3h8ZmlsZXxjb2xvcnxpbWFnZSkkL2k7XHJcbiAgICAgICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCB8fCAvXih0ZXh0YXJlYXxzZWxlY3R8ZW1iZWR8b2JqZWN0KSQvaS50ZXN0KHQubm9kZU5hbWUpIHx8IE4odCwgXCJpbnB1dFwiKSAmJiAhbi50ZXN0KHQudHlwZSkgfHwgTihzLCBcInZpZGVvXCIpIHx8IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9IGUudGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIG8gPSAhMTtcclxuICAgICAgICAgICAgICAgIGlmICgtMSAhPSBkb2N1bWVudC5VUkwuaW5kZXhPZihcInd3dy55b3V0dWJlLmNvbS93YXRjaFwiKSlcclxuICAgICAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvID0gdC5jbGFzc0xpc3QgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoXCJodG1sNS12aWRlby1jb250cm9sc1wiKSkgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICh0ID0gdC5wYXJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvXHJcbiAgICAgICAgICAgIH0oZSkgfHwgdC5pc0NvbnRlbnRFZGl0YWJsZSB8fCBvKSByZXR1cm4gITA7XHJcbiAgICAgICAgaWYgKChOKHQsIFwiYnV0dG9uXCIpIHx8IE4odCwgXCJpbnB1dFwiKSAmJiBuLnRlc3QodC50eXBlKSkgJiYgZS5rZXlDb2RlID09PSB3LnNwYWNlYmFyKSByZXR1cm4gITA7XHJcbiAgICAgICAgaWYgKE4odCwgXCJpbnB1dFwiKSAmJiBcInJhZGlvXCIgPT0gdC50eXBlICYmIHZbZS5rZXlDb2RlXSkgcmV0dXJuICEwO1xyXG4gICAgICAgIHZhciByID0gMCxcclxuICAgICAgICAgICAgYSA9IDAsXHJcbiAgICAgICAgICAgIGwgPSB6KHMpO1xyXG4gICAgICAgIGlmICghbCkgcmV0dXJuICFkIHx8ICFXIHx8IHBhcmVudC5rZXlkb3duKGUpO1xyXG4gICAgICAgIHZhciBpID0gbC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgc3dpdGNoIChsID09IGRvY3VtZW50LmJvZHkgJiYgKGkgPSB3aW5kb3cuaW5uZXJIZWlnaHQpLCBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgY2FzZSB3LnVwOlxyXG4gICAgICAgICAgICAgICAgYSA9IC1wLmFycm93U2Nyb2xsO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugdy5kb3duOlxyXG4gICAgICAgICAgICAgICAgYSA9IHAuYXJyb3dTY3JvbGw7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3LnNwYWNlYmFyOlxyXG4gICAgICAgICAgICAgICAgYSA9IC0oZS5zaGlmdEtleSA/IDEgOiAtMSkgKiBpICogLjk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3LnBhZ2V1cDpcclxuICAgICAgICAgICAgICAgIGEgPSAuOSAqIC1pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugdy5wYWdlZG93bjpcclxuICAgICAgICAgICAgICAgIGEgPSAuOSAqIGk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3LmhvbWU6XHJcbiAgICAgICAgICAgICAgICBsID09IGRvY3VtZW50LmJvZHkgJiYgZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudCAmJiAobCA9IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQpLCBhID0gLWwuc2Nyb2xsVG9wO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugdy5lbmQ6XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGwuc2Nyb2xsSGVpZ2h0IC0gbC5zY3JvbGxUb3AgLSBpO1xyXG4gICAgICAgICAgICAgICAgYSA9IDAgPCBjID8gMTAgKyBjIDogMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHcubGVmdDpcclxuICAgICAgICAgICAgICAgIHIgPSAtcC5hcnJvd1Njcm9sbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHcucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICByID0gcC5hcnJvd1Njcm9sbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFMobCwgciwgYSksIGUucHJldmVudERlZmF1bHQoKSwgQygpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdChlKSB7XHJcbiAgICAgICAgcyA9IGUudGFyZ2V0XHJcbiAgICB9XHJcbiAgICB2YXIgaywgRCwgTSA9IChrID0gMCwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGUudW5pcXVlSUQgfHwgKGUudW5pcXVlSUQgPSBrKyspXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgRSA9IHt9LFxyXG4gICAgICAgIFQgPSB7fSxcclxuICAgICAgICBCID0ge307XHJcblxyXG4gICAgZnVuY3Rpb24gQygpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQoRCksIEQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIEUgPSBUID0gQiA9IHt9XHJcbiAgICAgICAgfSwgMWUzKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEgoZSwgdCwgbykge1xyXG4gICAgICAgIGZvciAodmFyIG4gPSBvID8gRSA6IFQsIHIgPSBlLmxlbmd0aDsgci0tOykgbltNKGVbcl0pXSA9IHQ7XHJcbiAgICAgICAgcmV0dXJuIHRcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB6KGUpIHtcclxuICAgICAgICB2YXIgdCA9IFtdLFxyXG4gICAgICAgICAgICBvID0gZG9jdW1lbnQuYm9keSxcclxuICAgICAgICAgICAgbiA9IG0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdmFyIHIgPSAoITEgPyBFIDogVClbTShlKV07XHJcbiAgICAgICAgICAgIGlmIChyKSByZXR1cm4gSCh0LCByKTtcclxuICAgICAgICAgICAgaWYgKHQucHVzaChlKSwgbiA9PT0gZS5zY3JvbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhID0gTyhtKSAmJiBPKG8pIHx8IFgobSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZCAmJiBMKG0pIHx8ICFkICYmIGEpIHJldHVybiBIKHQsIHEoKSlcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChMKGUpICYmIFgoZSkpIHJldHVybiBIKHQsIGUpXHJcbiAgICAgICAgfSB3aGlsZSAoZSA9IGUucGFyZW50RWxlbWVudClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBMKGUpIHtcclxuICAgICAgICByZXR1cm4gZS5jbGllbnRIZWlnaHQgKyAxMCA8IGUuc2Nyb2xsSGVpZ2h0XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gTyhlKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiaGlkZGVuXCIgIT09IGdldENvbXB1dGVkU3R5bGUoZSwgXCJcIikuZ2V0UHJvcGVydHlWYWx1ZShcIm92ZXJmbG93LXlcIilcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBYKGUpIHtcclxuICAgICAgICB2YXIgdCA9IGdldENvbXB1dGVkU3R5bGUoZSwgXCJcIikuZ2V0UHJvcGVydHlWYWx1ZShcIm92ZXJmbG93LXlcIik7XHJcbiAgICAgICAgcmV0dXJuIFwic2Nyb2xsXCIgPT09IHQgfHwgXCJhdXRvXCIgPT09IHRcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBZKGUsIHQsIG8pIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihlLCB0LCBvIHx8ICExKVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEEoZSwgdCwgbykge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGUsIHQsIG8gfHwgITEpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gTihlLCB0KSB7XHJcbiAgICAgICAgcmV0dXJuIGUgJiYgKGUubm9kZU5hbWUgfHwgXCJcIikudG9Mb3dlckNhc2UoKSA9PT0gdC50b0xvd2VyQ2FzZSgpXHJcbiAgICB9XHJcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZSAmJiBsb2NhbFN0b3JhZ2UuU1NfZGVsdGFCdWZmZXIpIHRyeSB7XHJcbiAgICAgICAgbCA9IGxvY2FsU3RvcmFnZS5TU19kZWx0YUJ1ZmZlci5zcGxpdChcIixcIilcclxuICAgIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gICAgZnVuY3Rpb24gSyhlLCB0KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoZSAvIHQpID09IGUgLyB0XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gUChlKSB7XHJcbiAgICAgICAgcmV0dXJuIEsobFswXSwgZSkgJiYgSyhsWzFdLCBlKSAmJiBLKGxbMl0sIGUpXHJcbiAgICB9XHJcbiAgICB2YXIgJCwgaiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IGZ1bmN0aW9uIChlLCB0LCBvKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGUsIG8gfHwgMWUzIC8gNjApXHJcbiAgICAgICAgfSxcclxuICAgICAgICBSID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXIsXHJcbiAgICAgICAgcSA9ICgkID0gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoISQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUuY3NzVGV4dCA9IFwiaGVpZ2h0OjEwMDAwcHg7d2lkdGg6MXB4O1wiLCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsIHdpbmRvdy5zY3JvbGxCeSgwLCAzKSwgJCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICE9IHQgPyBkb2N1bWVudC5ib2R5IDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB3aW5kb3cuc2Nyb2xsQnkoMCwgLTMpLCBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBWKGUpIHtcclxuICAgICAgICB2YXIgdDtcclxuICAgICAgICByZXR1cm4gKChlICo9IHAucHVsc2VTY2FsZSkgPCAxID8gZSAtICgxIC0gTWF0aC5leHAoLWUpKSA6IChlIC09IDEsICh0ID0gTWF0aC5leHAoLTEpKSArICgxIC0gTWF0aC5leHAoLWUpKSAqICgxIC0gdCkpKSAqIHAucHVsc2VOb3JtYWxpemVcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBGKGUpIHtcclxuICAgICAgICByZXR1cm4gMSA8PSBlID8gMSA6IGUgPD0gMCA/IDAgOiAoMSA9PSBwLnB1bHNlTm9ybWFsaXplICYmIChwLnB1bHNlTm9ybWFsaXplIC89IFYoMSkpLCBWKGUpKVxyXG4gICAgfVxyXG4gICAgdmFyIEkgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCxcclxuICAgICAgICBfID0gL0VkZ2UvLnRlc3QoSSksXHJcbiAgICAgICAgVyA9IC9jaHJvbWUvaS50ZXN0KEkpICYmICFfLFxyXG4gICAgICAgIFUgPSAvc2FmYXJpL2kudGVzdChJKSAmJiAhXyxcclxuICAgICAgICBHID0gL21vYmlsZS9pLnRlc3QoSSksXHJcbiAgICAgICAgSiA9IC9XaW5kb3dzIE5UIDYuMS9pLnRlc3QoSSkgJiYgL3J2OjExL2kudGVzdChJKSxcclxuICAgICAgICBRID0gVSAmJiAoL1ZlcnNpb25cXC84L2kudGVzdChJKSB8fCAvVmVyc2lvblxcLzkvaS50ZXN0KEkpKSxcclxuICAgICAgICBaID0gKFcgfHwgVSB8fCBKKSAmJiAhRyxcclxuICAgICAgICBlZSA9ICExO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRlc3RcIiwgbnVsbCwgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCBcInBhc3NpdmVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGVlID0gITBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKVxyXG4gICAgfSBjYXRjaCAoZSkge31cclxuICAgIHZhciB0ZSA9ICEhZWUgJiYge1xyXG4gICAgICAgICAgICBwYXNzaXZlOiAhMVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb2UgPSBcIm9ud2hlZWxcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpID8gXCJ3aGVlbFwiIDogXCJtb3VzZXdoZWVsXCI7XHJcblxyXG4gICAgZnVuY3Rpb24gbmUoZSkge1xyXG4gICAgICAgIGZvciAodmFyIHQgaW4gZSkgby5oYXNPd25Qcm9wZXJ0eSh0KSAmJiAocFt0XSA9IGVbdF0pXHJcbiAgICB9XHJcbiAgICBvZSAmJiBaICYmIChZKG9lLCBlLCB0ZSksIFkoXCJtb3VzZWRvd25cIiwgdCksIFkoXCJsb2FkXCIsIHkpKSwgbmUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpICYmIGkuZGlzY29ubmVjdCgpLCBBKG9lLCBlKSwgQShcIm1vdXNlZG93blwiLCB0KSwgQShcImtleWRvd25cIiwgeCksIEEoXCJyZXNpemVcIiwgYyksIEEoXCJsb2FkXCIsIHkpXHJcbiAgICB9LCB3aW5kb3cuU21vb3RoU2Nyb2xsT3B0aW9ucyAmJiBuZSh3aW5kb3cuU21vb3RoU2Nyb2xsT3B0aW9ucyksIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZGVmaW5lICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZVxyXG4gICAgfSkgOiBcIm9iamVjdFwiID09IHR5cGVvZiBleHBvcnRzID8gbW9kdWxlLmV4cG9ydHMgPSBuZSA6IHdpbmRvdy5TbW9vdGhTY3JvbGwgPSBuZVxyXG59KCk7IiwiLyoqXHJcbiAqIFNtb290aGx5IHNjcm9sbHMgdGhlIHBhZ2UgdG8gdGhlIHNwZWNpZmllZCBwb3NpdGlvbi5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIC0gVGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0by5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj01MDBdIC0gVGhlIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxyXG4gKi9cclxuZnVuY3Rpb24gc21vb3RoU2Nyb2xsVG8ocG9zaXRpb24sIGR1cmF0aW9uID0gNTAwKSB7XHJcbiAgICBjb25zdCBzdGFydFBvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICBjb25zdCBkaXN0YW5jZSA9IHBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvblxyXG4gICAgbGV0IHN0YXJ0VGltZXN0YW1wID0gbnVsbFxyXG5cclxuICAgIGZ1bmN0aW9uIHN0ZXAodGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKCFzdGFydFRpbWVzdGFtcCkgc3RhcnRUaW1lc3RhbXAgPSB0aW1lc3RhbXBcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aW1lc3RhbXAgLSBzdGFydFRpbWVzdGFtcFxyXG4gICAgICAgIGNvbnN0IHNjcm9sbFkgPSBlYXNlSW5PdXRDdWJpYyhwcm9ncmVzcywgc3RhcnRQb3NpdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uKVxyXG5cclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsWSlcclxuXHJcbiAgICAgICAgaWYgKHByb2dyZXNzIDwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlYXNlSW5PdXRDdWJpYyh0LCBiLCBjLCBkKSB7XHJcbiAgICAgICAgdCAvPSBkXHJcbiAgICAgICAgdC0tXHJcbiAgICAgICAgcmV0dXJuIGMgKiAodCAqIHQgKiB0ICsgMSkgKyBiXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG59XHJcbiIsIndpbmRvdy50aHJvdHRsZSA9IChmdW5jLCBtcykgPT4ge1xyXG4gICAgbGV0IGlzVGhyb3R0bGVkID0gZmFsc2UsXHJcbiAgICAgICAgc2F2ZWRBcmdzLFxyXG4gICAgICAgIHNhdmVkVGhpc1xyXG5cclxuICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XHJcblxyXG4gICAgICAgIGlmIChpc1Rocm90dGxlZCkgeyAvLyAyXHJcbiAgICAgICAgICAgIHNhdmVkQXJncyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICBzYXZlZFRoaXMgPSB0aGlzXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpIC8vIDFcclxuXHJcbiAgICAgICAgaXNUaHJvdHRsZWQgPSB0cnVlXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlzVGhyb3R0bGVkID0gZmFsc2UgLy8gM1xyXG4gICAgICAgICAgICBpZiAoc2F2ZWRBcmdzKSB7XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGx5KHNhdmVkVGhpcywgc2F2ZWRBcmdzKVxyXG4gICAgICAgICAgICAgICAgc2F2ZWRBcmdzID0gc2F2ZWRUaGlzID0gbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgbXMpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXJcclxufSIsIi8qKlxyXG4gKiBFbWFpbCBhZGRyZXNzIHZlcmlmaWNhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwsIHRoYXQgbmVlZHMgdG8gdmFsaWRhdGluZy5cclxuICovXHJcbndpbmRvdy52YWxpZGF0ZUVtYWlsID0gKGVtYWlsKSA9PiB7XHJcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIGVtYWlsXHJcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bXlxcc0BdK0BbXlxcc0BdK1xcLlteXFxzQF0rJC9cclxuICAgIHJldHVybiBlbWFpbFJlZ2V4LnRlc3QoZW1haWwpXHJcbn1cclxuIiwiLyoqXHJcbiAqIFBob25lIG51bWJlciB2ZXJpZmljYXRpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHBob25lIC0gVGhlIHBob25lLCB0aGF0IG5lZWRzIHRvIHZhbGlkYXRpbmcuXHJcbiAqL1xyXG53aW5kb3cudmFsaWRhdGVQaG9uZSA9IChwaG9uZSkgPT4ge1xyXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBwaG9uZVxyXG4gICAgY29uc3QgcGhvbmVSZWdleCA9IC9eN1xcZHsxMH0kL1xyXG4gICAgcmV0dXJuIHBob25lUmVnZXgudGVzdChwaG9uZSlcclxufVxyXG4iLCJjb25zdCBpbml0VG9nZ2xlVmlzaWJsZUZvcm1QYXNzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvZ2dsZS12aXNpYmxlLXBhc3MnKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcbiAgICAgICAgY29uc3QgaXNUZXh0ID0gaW5wdXQudHlwZSA9PT0gJ3RleHQnXHJcblxyXG4gICAgICAgIGlucHV0LnR5cGUgPSBpc1RleHQgPyAncGFzc3dvcmQnIDogJ3RleHQnXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzLXZpc2libGUnKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbi8vIGNvbnN0IHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUpID0+IHtcclxuLy8gICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5jbG9zZXN0KCdsYWJlbCcpXHJcbi8vICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJylcclxuLy8gfVxyXG5cclxuLy8gY29uc3Qgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4vLyAgICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLmNsb3Nlc3QoJ2xhYmVsJylcclxuLy8gICAgIGNvbnN0IG1lc3NhZ2UgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmVycm9yLW1lc3NhZ2UnKVxyXG5cclxuLy8gICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxyXG4vLyAgICAgbWVzc2FnZS5pbm5lclRleHQgPSBlcnJvclRleHRcclxuXHJcbi8vICAgICBpbnB1dE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbi8vICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbi8vICAgICB9KVxyXG4vLyB9XHJcblxyXG4vLyBjb25zdCBpbml0QWNjb3VudEZvcm0gPSAoKSA9PiB7XHJcbi8vICAgICBjb25zdCBmb3JtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY291bnQtZm9ybV9fZm9ybScpKVxyXG4vLyAgICAgaWYgKGZvcm1zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4vLyAgICAgZm9ybXMuZm9yRWFjaChmb3JtID0+IGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4vLyAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuLy8gICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB7ZW1haWw6IHRydWUsIHBhc3M6IHRydWUsIH1cclxuLy8gICAgICAgICBjb25zdCBlbWFpbCA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJlbWFpbFwiXScpXHJcbi8vICAgICAgICAgY29uc3QgcGFzcyAgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFzc1wiXScpXHJcbi8vICAgICAgICAgY29uc3QgZm9ybVR5cGUgPSB0aGlzLmRhdGFzZXQuZm9ybVR5cGVcclxuXHJcbi8vICAgICAgICAgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsKVxyXG4vLyAgICAgICAgIGlmIChmb3JtVHlwZSAhPT0gJ3JlY292ZXJ5Jykge1xyXG4vLyAgICAgICAgICAgICByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIocGFzcylcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIC8vIENoZWNrIGVtYWlsXHJcbi8vICAgICAgICAgaWYgKGVtYWlsLnZhbHVlICE9PSAnJykge1xyXG4vLyAgICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlRW1haWwoZW1haWwudmFsdWUpKSB7XHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSB0cnVlXHJcbi8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSBmYWxzZVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbCwgJ9Cd0LXQvtCx0YXQvtC00LjQvNC+INGD0LrQsNC30LDRgtGMINCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXHJcbi8vICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IGZhbHNlXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAvLyBDaGVjayBwYXNzXHJcbi8vICAgICAgICAgaWYgKGZvcm1UeXBlICE9PSAncmVjb3ZlcnknKSB7XHJcbi8vICAgICAgICAgICAgIGlmIChwYXNzLnZhbHVlLmxlbmd0aCA8IDgpIHtcclxuLy8gICAgICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIocGFzcywgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9Cw0YDQvtC70YwuINCU0LvQuNC90L3QsCDQv9Cw0YDQvtC70Y8g0LTQvtC70LbQvdCwINCx0YvRgtGMINC90LUg0LzQtdC90LXQtSA4INGB0LjQvNCy0L7Qu9C+0LIhJylcclxuLy8gICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5wYXNzID0gZmFsc2VcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgLy8gU2VuZ2luZyBmb3JtIGRhdGFcclxuLy8gICAgICAgICBpZiAoZm9ybVZhbGlkLmVtYWlsICYmIGZvcm1WYWxpZC5wYXNzKSB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8g0J7QsdGP0LfQsNGC0LXQu9GM0L3QviDRg9C00LDQu9C40YLRjCDQv9C+0YHQu9C1INCy0L3QtdC00YDQtdC90LjRj1xyXG4vLyAgICAgICAgICAgICBmb3IgKGxldCBbbmFtZSwgdmFsdWVdIG9mIGZvcm1EYXRhKSB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfTogJHt2YWx1ZX1gKTtcclxuLy8gICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIHJlcXVlc3QgZm9yIHVwZGF0aW5nIHVzZXIgZGF0YScpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH0pKVxyXG4vLyB9XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIC8vIGluaXRBY2NvdW50Rm9ybSgpXHJcbiAgICBpbml0VG9nZ2xlVmlzaWJsZUZvcm1QYXNzKClcclxufSkiLCIvLyBBZGQgcHJvZHVjdCB0byBmYXZvcml0ZXNcclxuY29uc3QgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSBlLnRhcmdldFxyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IF90aGlzLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBfdGhpcy5kYXRhc2V0LnRpdGxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gX3RoaXMuZGF0YXNldC5tZXNzYWdlXHJcbiAgICBjb25zdCBoZWFkZXJGYXZvcml0ZXMgPSBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idXR0b25zLWxpbmtfZmF2b3JpdGVzIC5oZWFkZXJfX2J1dHRvbnMtY291bnQnKVxyXG4gICAgY29uc3QgY3VycmVudEZhdm9ydXRlc0NvdW50ID0gcGFyc2VJbnQoaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dClcclxuXHJcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHtcclxuICAgICAgICBfdGhpcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dCA9IGN1cnJlbnRGYXZvcnV0ZXNDb3VudCArIDFcclxuICAgICAgICBoZWFkZXJGYXZvcml0ZXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gaGVhZGVyRmF2b3JpdGVzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvcignQXN5bmMgcXVlcnkgdG8gQUREIHNlbGVjdGVkIHByb2R1Y3QgdG8gRmF2b3JpdGVzJyk7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgX3RoaXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dCA9IGN1cnJlbnRGYXZvcnV0ZXNDb3VudCAtIDFcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0FzeW5jIHF1ZXJ5IHRvIERFTEVURSBzZWxlY3RlZCBwcm9kdWN0IGZyb20gRmF2b3JpdGVzJyk7XHJcbn1cclxuXHJcbmNvbnN0IGluaXRBZGRUb0Zhdm9yaXRlcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0LWl0ZW1fX2Zhdm9yaXRlcycpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChidG4gPT4gYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXIpKVxyXG59XHJcblxyXG4vLyBBZGQgcHJvZHVjdCB0byBjYXJ0XHJcbmNvbnN0IGFkZFRvQ2FydENsaWNrSGFuZGxlciA9IChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICBjb25zdCBfdGhpcyA9IGUudGFyZ2V0XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gX3RoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpXHJcbiAgICBjb25zdCB0aXRsZSA9IF90aGlzLmRhdGFzZXQudGl0bGVcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBfdGhpcy5kYXRhc2V0Lm1lc3NhZ2VcclxuXHJcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHtcclxuICAgICAgICBfdGhpcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgc2hvd01vZGFsTXNnKHRpdGxlLCBtZXNzYWdlKVxyXG5cclxuICAgICAgICAvLyBQdXNoIGN1cnJlbnQgcHJvZHVjdCB0byBDYXJ0IEdsb2JhbCBPYmplY3QgKHdpbmRvdy5DQVJUKVxyXG4gICAgICAgIHdpbmRvdy5hZGRQcm9kdWN0VG9DYXJ0KHsgYXJ0OiBfdGhpcy5kYXRhc2V0LnByb2R1Y3RJZCwgY291bnQ6IDEgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgX3RoaXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgc2hvd01vZGFsTXNnKHRpdGxlLCAn0KPQtNCw0LvQtdC9INC40Lcg0LrQvtGA0LfQuNC90YsnKVxyXG5cclxuICAgIC8vIFJlbW92ZSBjdXJyZW50IHByb2R1Y3QgZnJvbSBDYXJ0IEdsb2JhbCBPYmplY3QgKHdpbmRvdy5DQVJUKVxyXG4gICAgd2luZG93LnJlbW92ZVByb2R1Y3RGcm9tQ2FydCh7IGFydDogX3RoaXMuZGF0YXNldC5wcm9kdWN0SWQsIGNvdW50OiAxIH0pXHJcbn1cclxuY29uc3QgaW5pdEFkZFRvQ2FydCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0LWl0ZW1fX2NhcnQnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFRvQ2FydENsaWNrSGFuZGxlcikpXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdEFkZFRvRmF2b3JpdGVzKClcclxuICAgIGluaXRBZGRUb0NhcnQoKVxyXG59KSIsIlxyXG5jb25zdCByZXNldEFsbENhcmRzUGljcyA9IChub2RlKSA9PiB7XHJcbiAgICBjb25zdCBwaWNzID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3BpYycpKVxyXG4gICAgcGljcy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxufVxyXG5cclxuY29uc3QgcmVzZXRBbGxDYXJkc1RhYnMgPSAobm9kZSkgPT4ge1xyXG4gICAgY29uc3QgdGFicyA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX190YWInKSlcclxuICAgIHRhYnMuZm9yRWFjaChub2RlID0+IG5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbn1cclxuXHJcbmNvbnN0IGdldFRhcmdldENhcmRzUGljID0gKG5vZGUsIGRhdGFUYXJnZXRUeXBlVmFsKSA9PiB7XHJcbiAgICByZXR1cm4gbm9kZS5xdWVyeVNlbGVjdG9yKGBbZGF0YS10eXBlPSR7ZGF0YVRhcmdldFR5cGVWYWx9XWApXHJcbn1cclxuXHJcbmNvbnN0IGluaXRDYXJkc1RhYiA9ICgpID0+IHtcclxuICAgIGNvbnN0IHRhYkFyciA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fdGFiJykpXHJcblxyXG4gICAgdGFiQXJyLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5jbG9zZXN0KCcuY2FyZHMtc2VyaWVzX19pdGVtJylcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UGljVHlwZSA9IHRoaXMuZGF0YXNldC50YXJnZXRUeXBlXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFBpYyA9IGdldFRhcmdldENhcmRzUGljKHBhcmVudCwgdGFyZ2V0UGljVHlwZSlcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBhY3RpdmUgdGFiXHJcbiAgICAgICAgICAgIHJlc2V0QWxsQ2FyZHNUYWJzKHBhcmVudClcclxuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBhY3RpdmUgaW1hZ2VcclxuICAgICAgICAgICAgaWYgKHRhcmdldFBpYykge1xyXG4gICAgICAgICAgICAgICAgcmVzZXRBbGxDYXJkc1BpY3MocGFyZW50KVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UGljLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0Q2FyZHNUYWIoKVxyXG59KVxyXG4iLCIvLyBGaWx0ZXJzXHJcbmNvbnN0IHNob3dOb0ZpbHRlck1zZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IG1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXNjcmlwdGlvbl9fbXNnJylcclxuXHJcbiAgICBpZiAoIW1zZykgcmV0dXJuXHJcblxyXG4gICAgbXNnLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBtc2cuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVOb0ZpbHRlck1zZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IG1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXNjcmlwdGlvbl9fbXNnJylcclxuXHJcbiAgICBpZiAoIW1zZykgcmV0dXJuXHJcblxyXG4gICAgbXNnLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgbXNnLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG59XHJcblxyXG5jb25zdCBjaGVja05vRmlsdGVyTXNnID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaXRlbXMgPSBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1maWx0ZXJdOm5vdCguaGlkZSknKVxyXG5cclxuICAgIGl0ZW1zLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgID8gc2hvd05vRmlsdGVyTXNnKClcclxuICAgICAgICA6IGhpZGVOb0ZpbHRlck1zZygpXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVGaWx0ZXJsaXN0ID0gKGZpbHRlckxpc3QpID0+IHtcclxuICAgIGZpbHRlckxpc3QuZm9yRWFjaChmaWx0ZXIgPT4ge1xyXG4gICAgICAgIGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wcGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSwgMzAwKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3Qgc2hvd0ZpbHRlckRyb3AgPSAobm9kZSkgPT4ge1xyXG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBub2RlLmNsYXNzTGlzdC5hZGQoJ2Ryb3BwZWQnKSwgMTApXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVGaWx0ZXJEcm9wID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IGZpbHRlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJzX19pdGVtJykpXHJcblxyXG4gICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgaGlkZUZpbHRlcmxpc3QoZmlsdGVycylcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGNsZWFuZWRGaWx0ZXJzID0gZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+IGZpbHRlciAhPT0gbm9kZSk7XHJcbiAgICBoaWRlRmlsdGVybGlzdChjbGVhbmVkRmlsdGVycylcclxufVxyXG5cclxuY29uc3QgaW5pdEZpbHRlcnNEcm9wID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZml0bGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcnNfX2xpc3QgLmZpbHRlcnNfX2l0ZW0nKSlcclxuXHJcbiAgICBmaXRsZXJzLmZvckVhY2goZmlsdGVyID0+IHtcclxuICAgICAgICBmaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgIGlmIChpc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgaGlkZUZpbHRlckRyb3AoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhpZGVGaWx0ZXJEcm9wKHRoaXMpXHJcbiAgICAgICAgICAgIHNob3dGaWx0ZXJEcm9wKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXRGaWx0ZXJzUmVzZXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY2F0YWxvZycpXHJcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyc19fcmVzZXQgLmZpbHRlcnNfX2l0ZW0nKVxyXG5cclxuICAgIGlmICghcmVzZXQpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGZpbHRlcmVkU2VjdGlvbiA9IGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uX2ZpbHRlcmVkJylcclxuXHJcbiAgICByZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY2xvc2VzdCgnLmZpbHRlcnMnKVxyXG5cclxuICAgICAgICBjb25zdCBzaWJsaW5nRmlsdGVycyA9IGNvbnRhaW5lclxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcnNfX2xpc3QgLmZpbHRlcnNfX2l0ZW0nKVxyXG5cclxuICAgICAgICBjb25zdCBvcHRpb25zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcnNfX29wdGlvbnMnKSlcclxuXHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVycyBpbnB1dFt0eXBlPVwicmFkaW9cIl06bm90KFt2YWx1ZT1cInJlc2V0XCJdKScpKVxyXG5cclxuICAgICAgICBjb25zdCBjYXJkcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZmlsdGVyXScpKVxyXG5cclxuICAgICAgICBjb25zdCBkZWxldGVkVHlwZXMgPSBKU09OLnBhcnNlKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1kZWxldGVkLXR5cGVzXScpXHJcbiAgICAgICAgICAgIC5kYXRhc2V0LmRlbGV0ZWRUeXBlcylcclxuXHJcbiAgICAgICAgaGlkZUZpbHRlcmxpc3Qoc2libGluZ0ZpbHRlcnMpXHJcbiAgICAgICAgc3Bpbm5lci5zaG93KClcclxuICAgICAgICBmaWx0ZXJlZFNlY3Rpb24uZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKCdmaWx0ZXJpbmcnKSlcclxuICAgICAgICBvcHRpb25zLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpKSAvLyBoaWRlIHJzZXQgb3B0aW9uIGJ1dHRvblxyXG4gICAgICAgIGNvbnRyb2xsZXJzLmZvckVhY2goY29udHJvbGxlciA9PiBjb250cm9sbGVyLmNoZWNrZWQgPSBmYWxzZSkgLy8gcmVzZXQgYWxsIGlucHV0IGNvbnRyb2xsZXJzXHJcbiAgICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMoKVxyXG4gICAgICAgIHJlc2V0LmNsb3Nlc3QoJy5maWx0ZXJzX19yZXNldCcpLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJylcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHNob3cgaGlkZGVuIGNhcmRzIGFzIGRlbGV0ZSBkYXRhLWRpc3BsYXkgYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBjYXJkcy5mb3JFYWNoKGNhcmQgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB0eXBlIG9mIGRlbGV0ZWRUeXBlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHt0eXBlfWApXHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKClcclxuICAgICAgICB9LCAxMDAwKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgY2hlY2tGaWx0ZXJlZFNlY3Rpb24gPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzZWN0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb25fZmlsdGVyZWQnKSlcclxuXHJcbiAgICBzZWN0aW9ucy5mb3JFYWNoKHNlY3Rpb24gPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkSXRlbXMgPSBBcnJheS5mcm9tKHNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZmlsdGVyXScpKVxyXG4gICAgICAgIGNvbnN0IHNob3duSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+ICFpLmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpKVxyXG5cclxuICAgICAgICBpZiAoc2hvd25JdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdoaWRlJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgc3Bpbm5lci5oaWRlKClcclxuICAgIHNlY3Rpb25zLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmlsdGVyaW5nJykpXHJcblxyXG4gICAgc2hvd0FuaW1FbGVtZW50cygpXHJcbiAgICBzZXRBbmltYXRpb25FbG1zKClcclxuICAgIGNoZWNrTm9GaWx0ZXJNc2coKVxyXG59XHJcblxyXG5jb25zdCBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IChub2RlKSA9PiB7XHJcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzXHJcblxyXG4gICAgbGV0IGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlID0gZmFsc2VcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lXHJcblxyXG4gICAgICAgIGlmIChhdHRyaWJ1dGVOYW1lLnN0YXJ0c1dpdGgoJ2RhdGEtZGlzcGxheScpKSB7XHJcbiAgICAgICAgICAgIGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlID0gdHJ1ZVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGVcclxufVxyXG5cclxuY29uc3QgY2hlY2tGaWx0ZXJlZEl0ZW0gPSAocHJvcCwgdmFsKSA9PiB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZmlsdGVyXScpKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGkuZGF0YXNldC5maWx0ZXIpXHJcbiAgICAgICAgICAgIGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGRhdGFbcHJvcF0pXHJcblxyXG4gICAgICAgICAgICBjb25zdCBpc01hdGNoZWQgPSBpc0FycmF5XHJcbiAgICAgICAgICAgICAgICA/IGRhdGFbcHJvcF0uaW5jbHVkZXModmFsKVxyXG4gICAgICAgICAgICAgICAgOiBkYXRhW3Byb3BdID09PSB2YWxcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoaXNNYXRjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICBpLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gKVxyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZShpKSkgaS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGkuY2xhc3NMaXN0LmFkZCgnaGlkZScpXHJcbiAgICAgICAgICAgICAgICBpLnNldEF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gLCBmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2hlY2tGaWx0ZXJlZFNlY3Rpb24oKVxyXG4gICAgICAgIH0pXHJcbiAgICB9LCAxMDAwKVxyXG59XHJcblxyXG5jb25zdCBhY3RpdmVDb2xvckluSXRlbSA9ICh2YWwpID0+IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10YXJnZXQtdHlwZT1cIiR7dmFsfVwiXWApKVxyXG5cclxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiBpLmNsaWNrKCkpXHJcbn1cclxuXHJcbmNvbnN0IGluaXRGaWx0ZXJTZWxlY3QgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY2F0YWxvZycpXHJcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJzIGlucHV0W3R5cGU9XCJyYWRpb1wiXTpub3QoW3ZhbHVlPVwicmVzZXRcIl0pJykpXHJcblxyXG4gICAgY29uc3QgZmlsdGVyZWRTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb25fZmlsdGVyZWQnKVxyXG5cclxuICAgIGNvbnN0IHJlc2V0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbHRlcnNfX3Jlc2V0JylcclxuXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgIGZpbHRlcmVkU2VjdGlvbi5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoJ2ZpbHRlcmluZycpKVxyXG4gICAgICAgIHNwaW5uZXIuc2hvdygpXHJcbiAgICAgICAgY2hlY2tGaWx0ZXJlZEl0ZW0odGhpcy5uYW1lLCB0aGlzLnZhbHVlKVxyXG4gICAgICAgIGFjdGl2ZUNvbG9ySW5JdGVtKHRoaXMudmFsdWUpXHJcbiAgICAgICAgdGhpcy5jbG9zZXN0KCcuZmlsdGVyc19fb3B0aW9ucycpLmNsYXNzTGlzdC5hZGQoJ2NoZWNrZWQnKVxyXG4gICAgICAgIHJlc2V0QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJylcclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCByZW1vdmVEYXRhRml0bGVyQXRyaWJ1dGUgPSAocHJvcCkgPT4ge1xyXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLWRpc3BsYXktJHtwcm9wfV1gKSlcclxuXHJcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgIGkucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWApXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja0FsbEl0ZW1zSGFzRGlzcGxheUF0cmlidXRlcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1maWx0ZXJdJykpXHJcblxyXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICBpZiAoIWhhc0RhdGFEaXNwbGF5QXR0cmlidXRlKGkpKSB7XHJcbiAgICAgICAgICAgIGkuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgcmVzZXRBbGxDb250cm9sbGVyc0J5TmFtZSA9IChuYW1lKSA9PiB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtuYW1lfV1gKSlcclxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiBpLmNoZWNrZWQgPSBmYWxzZSlcclxufVxyXG5cclxuY29uc3QgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0YWJMaXN0cyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fY29udHJvbHMnKSlcclxuXHJcbiAgICB0YWJMaXN0cy5mb3JFYWNoKGxpc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0VGFiID0gbGlzdC5xdWVyeVNlbGVjdG9yKCcuY2FyZHMtc2VyaWVzX190YWInKVxyXG5cclxuICAgICAgICBmaXJzdFRhYi5jbGljaygpXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja0FsbEZpdGxlclJlc2V0QnRuID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaXNDaGVja2VkRmlsdGVyID0gZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcnNfX2xpc3QgaW5wdXQ6Y2hlY2tlZCcpXHJcblxyXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyc19fcmVzZXQnKVxyXG5cclxuICAgIGlzQ2hlY2tlZEZpbHRlci5sZW5ndGggPT09IDBcclxuICAgICAgICA/IHJlc2V0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJylcclxuICAgICAgICA6IHJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJylcclxufVxyXG5cclxuY29uc3QgaW5pdFJlc2V0RmlsdGVyUHJvcCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jYXRhbG9nJylcclxuICAgIGlmIChpc1BhZ2VDYXRhbG9nKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcnMgaW5wdXRbdmFsdWU9XCJyZXNldFwiXScpKVxyXG4gICAgY29uc3Qgc2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbl9maWx0ZXJlZCcpXHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICBzZWN0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoJ2ZpbHRlcmluZycpKVxyXG4gICAgICAgIHNwaW5uZXIuc2hvdygpXHJcbiAgICAgICAgdGhpcy5jbG9zZXN0KCcuZmlsdGVyc19fb3B0aW9ucycpLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgcmVtb3ZlRGF0YUZpdGxlckF0cmlidXRlKHRoaXMubmFtZSlcclxuICAgICAgICAgICAgY2hlY2tBbGxJdGVtc0hhc0Rpc3BsYXlBdHJpYnV0ZXMoKVxyXG4gICAgICAgICAgICBjaGVja0ZpbHRlcmVkU2VjdGlvbigpXHJcbiAgICAgICAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNCeU5hbWUodGhpcy5uYW1lKVxyXG4gICAgICAgICAgICByZXNldEFsbENvbnRyb2xsZXJzSW5JdGVtcygpXHJcbiAgICAgICAgICAgIGNoZWNrQWxsRml0bGVyUmVzZXRCdG4oKVxyXG4gICAgICAgIH0sIDEwMDApXHJcbiAgICB9KSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0RmlsdGVyc0Ryb3AoKVxyXG4gICAgaW5pdEZpbHRlcnNSZXNldCgpXHJcbiAgICBpbml0RmlsdGVyU2VsZWN0KClcclxuICAgIGluaXRSZXNldEZpbHRlclByb3AoKVxyXG59KSIsImNvbnN0IGluaXRNb2RhbCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZGFsXScpKVxyXG5cclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5kYXRhc2V0Lm1vZGFsVGFyZ2V0XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5kYXRhc2V0Lm1vZGFsQWN0aW9uXHJcblxyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxyXG4gICAgICAgICAgICAgICAgc2hvd01vZGFsQmFjaygpXHJcbiAgICAgICAgICAgICAgICBzaG93TW9kYWxEaWFsb2codGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvZ2dsZSc6XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNb2RhbERpYWxvZyh0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2xvc2UnOlxyXG4gICAgICAgICAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoaGlkZU1vZGFsQmFjaywgMjAwKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbmNvbnN0IHNob3dNb2RhbEJhY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19iYWNrJylcclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYm9keScpXHJcblxyXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcclxuICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBiYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKSwgMTApXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVNb2RhbEJhY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19iYWNrJylcclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYm9keScpXHJcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGVhZGVyJylcclxuXHJcbiAgICBpZiAoIWJhY2spIHJldHVyblxyXG5cclxuICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSdcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgIGhlYWRlci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICB9LCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IHNob3dNb2RhbERpYWxvZyA9IChpZCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgIH0sIDEwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlTW9kYWxEaWFsb2cgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwuc2hvdycpXHJcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgZGlhbG9nID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcbiAgICBkaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRhcmdldC5jbGFzc0xpc3QuYWRkKCdoaWRlJyksIDEwMClcclxufVxyXG5cclxuY29uc3QgaW5pdENsb3NlTW9kYWwgPSAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNPblBvcHVwTW9kYWwgPSBlLnRhcmdldC5jbG9zZXN0KCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgICAgIGlmKGlzT25Qb3B1cE1vZGFsKSByZXR1cm5cclxuXHJcbiAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcclxuICAgICAgICBzZXRUaW1lb3V0KGhpZGVNb2RhbEJhY2ssIDIwMClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHRvZ2dsZU1vZGFsRGlhbG9nID0gKGlkKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxyXG4gICAgY29uc3QgZGlhbG9nID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICBoaWRlTW9kYWxEaWFsb2coKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSwgMjAwKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgIH0sIDMwMClcclxufVxyXG5cclxuY29uc3QgaW5pdFRvZ2dsZVZpc2libGVQYXNzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsX190b2dnbGUtdmlzaWJsZS1wYXNzJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgIGNvbnN0IGlzVGV4dCA9IGlucHV0LnR5cGUgPT09ICd0ZXh0J1xyXG5cclxuICAgICAgICBpbnB1dC50eXBlID0gaXNUZXh0ID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0J1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgncGFzcy12aXNpYmxlJylcclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWwgPSAoaWQpID0+IHtcclxuICAgIHNob3dNb2RhbEJhY2soKVxyXG4gICAgc2hvd01vZGFsRGlhbG9nKGlkKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRNb2RhbCgpXHJcbiAgICBpbml0Q2xvc2VNb2RhbCgpXHJcbiAgICBpbml0VG9nZ2xlVmlzaWJsZVBhc3MoKVxyXG59KSIsIi8vIFByb2R1Y3QgaW5mb3JtYXRpb24gc2xpZGVyXHJcbmxldCBwcm9kdWN0SW5mb1NsaWRlclxyXG5cclxuY29uc3QgaW5pdFByb2R1Y3RJbmZvU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgcHJvZHVjdEluZm9TbGlkZXIgPSBuZXcgU3dpcGVyKCcucHJvZHVjdC1pbmZvIC5zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgLy8gc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcblxyXG4gICAgICAgIC8vIGF1dG9IZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgLy8gc3BhY2VCZXR3ZWVuOiAxMCxcclxuXHJcbiAgICAgICAgc2Nyb2xsYmFyOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1zY3JvbGxiYXInLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA1NzY6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUHJvZHVjdEluZm9TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5OTEpIHtcclxuICAgICAgICBpZiAocHJvZHVjdEluZm9TbGlkZXIpIHtcclxuICAgICAgICAgICAgcHJvZHVjdEluZm9TbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKVxyXG4gICAgICAgICAgICBwcm9kdWN0SW5mb1NsaWRlciA9IHVuZGVmaW5lZFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXByb2R1Y3RJbmZvU2xpZGVyKSB7XHJcbiAgICAgICAgaW5pdFByb2R1Y3RJbmZvU2xpZGVyKClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1Byb2R1Y3RQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtcHJvZHVjdCcpXHJcbiAgICBjb25zdCBpc0FydGljbGVQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtYXJ0aWNsZScpXHJcbiAgICBjb25zdCBpc0RvdHNQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtZG90cycpXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBJbmZvIHNsaWRlciBvbmx5IGZvciBQcm9kdWN0LCBBcnRpY2xlIGFuZCBEb3RzIHBhZ2VzXHJcbiAgICBpZiAoIWlzUHJvZHVjdFBhZ2UgJiYgIWlzQXJ0aWNsZVBhZ2UgJiYgIWlzRG90c1BhZ2UpIHJldHVyblxyXG5cclxuICAgIGNoZWNrUHJvZHVjdEluZm9TbGlkZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgY2hlY2tQcm9kdWN0SW5mb1NsaWRlcigpXHJcbiAgICB9KVxyXG59KVxyXG4iLCIvLyBQcm9kdWN0IHJlY29tbWVuZGF0aW9uIHNsaWRlclxyXG5sZXQgcHJvZHVjdFJlY29tbVNsaWRlclxyXG5cclxuY29uc3QgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIgPSAoc3dpcGVyLCBzY3JvbGxiYXIpID0+IHtcclxuICAgIGlmICghc2Nyb2xsYmFyIHx8IHNjcm9sbGJhci5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGlzU2Nyb2xsYmFySGlkZSA9IHNjcm9sbGJhci5jbGFzc0xpc3RcclxuICAgICAgICAuY29udGFpbnMoJ3N3aXBlci1zY3JvbGxiYXItbG9jaycpXHJcblxyXG4gICAgaXNTY3JvbGxiYXJIaWRlXHJcbiAgICAgICAgPyBzd2lwZXIuY2xhc3NMaXN0LmFkZCgnc2Nyb2xsLWhpZGRlbicpXHJcbiAgICAgICAgOiBzd2lwZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsLWhpZGRlbicpXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrU2xpZGVyc0JvdHRvbU9mZnNldCA9ICgpID0+IHtcclxuICAgIGNvbnN0IHN3aXBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXInKSlcclxuXHJcbiAgICBzd2lwZXJzLmZvckVhY2goc3dpcGVyID0+IHtcclxuICAgICAgICBjb25zdCBzY3JvbGxiYXIgPSBzd2lwZXIucXVlcnlTZWxlY3RvcignLnN3aXBlci1zY3JvbGxiYXInKVxyXG4gICAgICAgIGNoZWNrUmVjb21tU2xpZGVyU2Nyb2xsYmFyKHN3aXBlciwgc2Nyb2xsYmFyKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgaW5pdFByb2R1Y3RSZWNvbW1TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBwcm9kdWN0UmVjb21tU2xpZGVyID0gbmV3IFN3aXBlcignLnJlY29tbWVuZGF0aW9uX19zbGlkZXIgLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICAvLyBhdXRvSGVpZ2h0OiB0cnVlLFxyXG5cclxuICAgICAgICBzY3JvbGxiYXI6IHtcclxuICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXNjcm9sbGJhcicsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDU3Njoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICA5OTE6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAxMjAwOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXMuZWxcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjcm9sbGJhciA9IHRoaXMuc2Nyb2xsYmFyLmVsXHJcbiAgICAgICAgICAgICAgICBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhcihzd2lwZXIsIHNjcm9sbGJhcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlciA9ICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEyMDAgJiYgcHJvZHVjdFJlY29tbVNsaWRlcikge1xyXG4gICAgICAgIEFycmF5LmlzQXJyYXkocHJvZHVjdFJlY29tbVNsaWRlcilcclxuICAgICAgICAgICAgPyBwcm9kdWN0UmVjb21tU2xpZGVyLmZvckVhY2goc2xpZGVyID0+IHNsaWRlci5kZXN0cm95KHRydWUsIHRydWUpKVxyXG4gICAgICAgICAgICA6IHByb2R1Y3RSZWNvbW1TbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKVxyXG5cclxuICAgICAgICBwcm9kdWN0UmVjb21tU2xpZGVyID0gdW5kZWZpbmVkXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcm9kdWN0UmVjb21tU2xpZGVyKSB7XHJcbiAgICAgICAgaW5pdFByb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGNvbnN0IGlzUHJvZHVjdFBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1wcm9kdWN0JylcclxuICAgIGNvbnN0IGlzQXJ0aWNsZVBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1hcnRpY2xlJylcclxuICAgIGNvbnN0IGlzRG90c1BhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1kb3RzJylcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIFJlY29tbWVuZGF0aW9uIHNsaWRlciBvbmx5IGZvciBQcm9kdWN0LCBBcnRpY2xlIGFuZCBEb3RzIHBhZ2VzXHJcbiAgICBpZiAoIWlzUHJvZHVjdFBhZ2UgJiYgIWlzQXJ0aWNsZVBhZ2UgJiYgIWlzRG90c1BhZ2UpIHJldHVyblxyXG5cclxuICAgIGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlcigpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG4gICAgICAgIGNoZWNrU2xpZGVyc0JvdHRvbU9mZnNldCgpXHJcbiAgICB9KVxyXG59KVxyXG4iLCJjb25zdCBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AgPSAoYnV0dG9uKSA9PiB7XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0U2Nyb2xsVG9Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsVG9Ub3AnKVxyXG5cclxuICAgIGlmICghYnV0dG9uKSByZXR1cm5cclxuXHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzbW9vdGhTY3JvbGxUbygwKSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AoYnV0dG9uKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0U2Nyb2xsVG9Ub3AoKVxyXG59KSIsIi8qKlxyXG4gKiBTaG93IGEgc21hbGwgbWVzc2FnZSB3aXRoIHRpdGxlIGFuZCB0ZXh0IGluIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSBzY3JlZW4uXHJcbiAqIFRoZSBtZXRob2QgZXhwZWN0cyBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyIHBlciBpbnB1dC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IFt0aXRsZT11bmRlZmluZWRdIC0gVGhlIGhlYWRsaW5lIG9mIHRoZSBtZXNzYWdlIGluIG9uZSBsaW5lLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2U9dW5kZWZpbmVkXSAtIE9uZSBsaW5lIG1lc3NhZ2UgdGV4dC5cclxuICovXHJcbndpbmRvdy5zaG93TW9kYWxNc2cgPSBmdW5jdGlvbih0aXRsZSA9ICcnLCBtZXNzYWdlID0gJycpIHtcclxuICAgIGlmICghdGl0bGUgJiYgIW1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlcmUncyBubyB0aXRsZSBvciBtZXNzYWdlIGZvciBzaG93aW5nIGluIG1vZGFsIHdpbmRvdy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHRpdGxlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbmNvcnJlY3QgdHlwZSBvZiB0aXRsZS4gSXQgc2hvdWxkIGJlIHN0cmluZy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkluY29ycmVjdCB0eXBlIG9mIG1lc3NhZ2UuIEl0IHNob3VsZCBiZSBzdHJpbmcuXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbXNnLWNvbnRhaW5lcicpXHJcbiAgICBjb25zdCBbY2FyZCwgYm9keV0gPSBjcmVhdGVNb2RhbE1zZ0NhcmQodGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhcmQpXHJcbiAgICBjaGVja01vZGFsTXNnQ29udGFpbmVyKClcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBjYXJkLmNsYXNzTGlzdC5hZGQoJ3VuY29sbGFwc2VkJyksIDUwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcbiAgICB9LCAxMDApXHJcblxyXG4gICAgaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHksIDUwMDApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKSB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tc2ctY29udGFpbmVyJylcclxuICAgIGNvbnN0IGlubmVyRWxtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtbXNnX19jYXJkJylcclxuXHJcbiAgICBpbm5lckVsbXMubGVuZ3RoID4gMFxyXG4gICAgICAgID8gY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG4gICAgICAgIDogY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNb2RhbE1zZ0NhcmQodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2NhcmQnKVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2JvZHknKVxyXG5cclxuICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcclxuXHJcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtbXNnX19jb250ZW50JylcclxuXHJcbiAgICBjb25zdCBjYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXHJcbiAgICBjYXB0aW9uLnRleHRDb250ZW50ID0gdGl0bGVcclxuXHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICB0ZXh0LnRleHRDb250ZW50ID0gbWVzc2FnZVxyXG5cclxuICAgIGlmICh0aXRsZSkgY29udGVudC5hcHBlbmRDaGlsZChjYXB0aW9uKVxyXG4gICAgaWYgKG1lc3NhZ2UpIGNvbnRlbnQuYXBwZW5kQ2hpbGQodGV4dClcclxuXHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGljb24pXHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGNvbnRlbnQpXHJcblxyXG4gICAgY2FyZC5hcHBlbmRDaGlsZChib2R5KVxyXG5cclxuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoaWRlTW9kYWxNc2dIYW5kbGVyKVxyXG5cclxuICAgIHJldHVybiBbY2FyZCwgYm9keV1cclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZU1vZGFsTXNnSGFuZGxlcigpIHtcclxuICAgIGNvbnN0IGNhcmQgPSB0aGlzXHJcbiAgICBjb25zdCBib2R5ID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtbXNnX19ib2R5JylcclxuICAgIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5KVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSwgdGltZW91dCA9IDApIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcclxuICAgIH0sIHRpbWVvdXQpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJywgJ2hpZGRlbicpXHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd1bmNvbGxhcHNlZCcpXHJcbiAgICB9LCB0aW1lb3V0ICsgMTAwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNhcmQucmVtb3ZlKCk7XHJcbiAgICAgICAgY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpXHJcbiAgICB9LCB0aW1lb3V0ICsgMjAwKVxyXG59XHJcbiIsImNvbnN0IHNob3dTcGlubmVyID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJylcclxuICAgIHNwaW5uZXIuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNwaW5uZXIuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVTcGlubmVyID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJylcclxuICAgIHNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpLCAxMDAwKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpKSB7XHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuc2hvdyA9IHNob3dTcGlubmVyXHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSA9IGhpZGVTcGlubmVyXHJcbiAgICB9XHJcbn0pIiwiIiwiLy8gT3BlbiBhbmQgY2xvc2UgbW9iaWxlIG5hdmlnYXRpb25cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgIGNvbnN0IG5hdkNsb3NlID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtY2xvc2UnKSlcclxuICAgIGNvbnN0IG5hdlRvZ2dsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyX19uYXYtbGlua19tZW51JylcclxuICAgIGNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdicpXHJcbiAgICBjb25zdCBtb2RhbEJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tb2RhbC1iYWNrJylcclxuICAgIGNvbnN0IG5hdlByb2RMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LWxpbmtfcHJvZHVjdCcpXHJcbiAgICBjb25zdCBuYXZJdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWl0ZW1fd2l0aC1pbm5lcicpKVxyXG4gICAgY29uc3QgbmF2TGlua3MgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1saW5rJykpXHJcbiAgICBjb25zdCBuYXZDb2xsYXBzZXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jb2xsYXBzZScpKVxyXG5cclxuICAgIGlmICghbmF2VG9nZ2xlcikgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgdG9nZ2xlTmF2ID0gKGRpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcclxuICAgICAgICAgICAgbmF2VG9nZ2xlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LmFkZCgnb3BlbicpXHJcbiAgICAgICAgICAgIC8vIG1vZGFsQmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmF2UHJvZExpbmsuY2xpY2soKVxyXG4gICAgICAgICAgICB9LCAxMDApXHJcblxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgbmF2VG9nZ2xlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJylcclxuICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcblxyXG4gICAgICAgIGNvbGxhcHNBbGxOYXZJdGVtKClcclxuICAgIH1cclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGJ1cmdlclxyXG4gICAgbmF2VG9nZ2xlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvZ2dsZU5hdih0cnVlKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGNsb3NlIGJ1dHRvblxyXG4gICAgbmF2Q2xvc2UuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+dG9nZ2xlTmF2KGZhbHNlKSlcclxuICAgIH0pXHJcblxyXG4gICAgbW9kYWxCYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZU5hdihmYWxzZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gT3BlbiBhbmQgY2xvc2UgTmF2aWdhdGlvbiBpdGVtc1xyXG4gICAgY29uc3QgY29sbGFwc0FsbE5hdkl0ZW0gPSAoKSA9PiB7XHJcbiAgICAgICAgbmF2SXRlbXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpKVxyXG4gICAgICAgIG5hdkxpbmtzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG4gICAgICAgIG5hdkNvbGxhcHNlcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJykpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlTmF2SXRlbSA9IChidG4pID0+IHtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgIGNvbGxhcHNBbGxOYXZJdGVtKClcclxuXHJcbiAgICAgICAgaWYgKCFpc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5hdkl0ZW0gPSBidG4uY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWl0ZW1fd2l0aC1pbm5lcicpXHJcblxyXG4gICAgICAgICAgICBpZiAobmF2SXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmF2Q29sbGFwc2UgPSBuYXZJdGVtLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1jb2xsYXBzZScpXHJcblxyXG4gICAgICAgICAgICAgICAgbmF2SXRlbS5jbGFzc0xpc3QuYWRkKCdkcm9wcGVkJylcclxuICAgICAgICAgICAgICAgIG5hdkNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5hdkxpbmtzLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2SXRlbSh0aGlzKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gU2VhcmNoaW5nIGFuZCBTdGlja3kgaGVhZGVyXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJylcclxuICAgIGNvbnN0IHNlYXJjaFRvZ2dsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idXR0b25zLWxpbmtfc2VhcmNoJylcclxuICAgIGNvbnN0IHNlYXJjaENsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLWNsb3NlJylcclxuICAgIGNvbnN0IHNlYXJjaFBhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoJylcclxuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLWlucHV0JylcclxuICAgIGNvbnN0IHNlYXJjaFJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLXJlc2V0JylcclxuICAgIGNvbnN0IHNlYXJjaEhpbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLWhpbnRzJylcclxuXHJcbiAgICBpZiAoIXNlYXJjaFRvZ2dsZXIpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZVNlYXJjaFBhbmVsID0gKGhpZGUgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpXHJcbiAgICAgICAgY29uc3QgdGltZW91dCA9IDEwMFxyXG5cclxuICAgICAgICBpZiAoIWlzVmlzaWJsZSAmJiAhaGlkZSkge1xyXG4gICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlJylcclxuICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl93aXRoLXNlYXJjaC1wYW5lbCcpXHJcbiAgICAgICAgICAgIHNlYXJjaFRvZ2dsZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpXHJcblxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaFRvZ2dsZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICBzZWFyY2hSZXNldC5jbGljaygpXHJcbiAgICAgICAgICAgIHJlc2V0SGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKVxyXG4gICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX3dpdGgtc2VhcmNoLXBhbmVsJylcclxuICAgICAgICB9LCAyMDApXHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoVG9nZ2xlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCgpXHJcbiAgICB9KVxyXG5cclxuICAgIHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKClcclxuICAgIH0pXHJcblxyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3Mvc2VhcmNoLmpzb24nXHJcbiAgICAvLyBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnaHR0cHM6Ly90ZXN0LXRlY2hub2xpZ2h0djIubWFzc2l2ZS5ydS9hcGkvcHJvZHVjdC9zZWFyY2gnXHJcbiAgICBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnL2FwaS9wcm9kdWN0L3NlYXJjaCdcclxuICAgIGNvbnN0IFRIUk9UVExFX1RJTUVPVVQgPSAzMDBcclxuICAgIGxldCBzZWFyY2hSZXF1ZXN0VGltZW91dElkXHJcblxyXG4gICAgY29uc3QgcHJpbnRRdWVyeVJlc3VsdCA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gUmVzZXQgYWxsIGNoaWxkcmVuIG5vZGVzIG9mIHNlYXJjaCBoaW50c1xyXG4gICAgICAgIHdoaWxlIChzZWFyY2hIaW50cy5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLnJlbW92ZUNoaWxkKHNlYXJjaEhpbnRzLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBoaW50cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgaGludHMuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19zZWFyY2gtbGlua3MnKVxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG51bSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhpbnQgPSBkYXRhW251bV1cclxuICAgICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxyXG4gICAgICAgICAgICBsaW5rLmhyZWYgPSBoaW50LnVybFxyXG4gICAgICAgICAgICBsaW5rLmlubmVyVGV4dCA9IGhpbnQudGl0bGVcclxuICAgICAgICAgICAgaGludHMuYXBwZW5kQ2hpbGQobGluaylcclxuXHJcbiAgICAgICAgICAgIGlmIChudW0gPiA4KSBicmVha1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoSGludHMuYXBwZW5kQ2hpbGQoaGludHMpXHJcbiAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcbiAgICAgICAgc2V0SGFuZGxlclRvSGVscGVycygpXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmZXRjaFNlYXJjaGluZ0RhdGEgPSBhc3luYyhxdWVyeSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKFNFQVJDSF9SRVFVRVNUX1VSTCArIGA/cXVlcnk9JHtxdWVyeX1gKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINC/0L7QuNGB0LrQsCcpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgICAgIHByaW50UXVlcnlSZXN1bHQoZGF0YSlcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gJycgKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gU1RBUlRcclxuICAgICAgICBjbGVhclRpbWVvdXQoc2VhcmNoUmVxdWVzdFRpbWVvdXRJZClcclxuICAgICAgICBzZWFyY2hSZXF1ZXN0VGltZW91dElkID0gc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gZmV0Y2hTZWFyY2hpbmdEYXRhKHRoaXMudmFsdWUpLFxyXG4gICAgICAgICAgICBUSFJPVFRMRV9USU1FT1VUXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gRklOSVNIXHJcbiAgICB9KVxyXG5cclxuICAgIHNlYXJjaFJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycygpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJylcclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBjb25zdCBpc1NlYXJjaFRvZ2dsZSA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuaGVhZGVyX19idXR0b25zLWxpbmtfc2VhcmNoJylcclxuXHJcbiAgICAgICAgY29uc3QgaXNTZWFyY2hQYW5lbCA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuaGVhZGVyX19zZWFyY2gnKVxyXG5cclxuICAgICAgICBjb25zdCBpc1R1Y2hEZXZpY2UgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDk5MlxyXG5cclxuICAgICAgICBpZiAoIWlzVHVjaERldmljZSAmJiAhaXNTZWFyY2hQYW5lbCAmJiAhaXNTZWFyY2hUb2dnbGUpIHtcclxuICAgICAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwodHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFNldCBoZWxwIHRleHQgZnJvbSBoZWxwZXIgYnV0dG9uIHVuZGVyIHRoZSBzZWFyY2ggaW5wdXQgdG8gdGhlIHNlYXJjaCB2YWx1ZVxyXG4gICAgY29uc3QgcmVxdWVzdENvbXBsZXRpb24gPSAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFkZGl0aW9uVmFsdWUgPSBlLnRhcmdldC5pbm5lclRleHRcclxuICAgICAgICBzZWFyY2hJbnB1dC52YWx1ZSA9IGAke3NlYXJjaElucHV0LnZhbHVlfSAke2FkZGl0aW9uVmFsdWV9YFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEhhbmRsZXJUb0hlbHBlcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoSGVscGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX3NlYXJjaC1oZWxwcyBzcGFuJykpXHJcblxyXG4gICAgICAgIHNlYXJjaEhlbHBlcnMuZm9yRWFjaChidG4gPT4gYnRuXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlcXVlc3RDb21wbGV0aW9uKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEhlbHBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19zZWFyY2gtaGVscHMgc3BhbicpKVxyXG5cclxuICAgICAgICBzZWFyY2hIZWxwZXJzLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgYnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVxdWVzdENvbXBsZXRpb24pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGlja3kgaGVhZGVyXHJcbiAgICBsZXQgYmVmb3JlU2Nyb2xsVG9wID0gMFxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkZXJcIilcclxuICAgICAgICBjb25zdCBoZWFkZXJIZWlnaHQgPSBoZWFkZXIuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgY29uc3QgZGVsYXkgPSAnLjdzJ1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDk5MSkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdjb21wcmVzc2VkJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbXByZXNzZWQnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50U2Nyb2xsVG9wID4gMTAwICYmIGN1cnJlbnRTY3JvbGxUb3AgPiBiZWZvcmVTY3JvbGxUb3ApIHtcclxuICAgICAgICAgICAgY29uc3QgaXNWaXNpYmxlU2VhcmNoID0gc2VhcmNoUGFuZWxcclxuICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICAgICAgbGV0IGludGVydmFsSWRcclxuXHJcbiAgICAgICAgICAgIGlmIChpc1Zpc2libGVTZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwodHJ1ZSlcclxuICAgICAgICAgICAgICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9ICcwcydcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXIuc3R5bGUudG9wID0gYC0ke2hlYWRlckhlaWdodH1weGBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBoZWFkZXIuc3R5bGUudG9wID0gMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmVmb3JlU2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICB9KTtcclxufSlcclxuXHJcbi8vIENhcnQgdXBkYXRlIGxpc3RlbmluZ1xyXG5jb25zdCBzZXRDYXJ0VXBkYWdlTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0UHJvZHVjdENvdW50Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJ0UHJvZHVjdENvdW50JylcclxuXHJcbiAgICBpZiAoIWNhcnRQcm9kdWN0Q291bnROb2RlKSByZXR1cm5cclxuXHJcbiAgICBjYXJ0UHJvZHVjdENvdW50Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdjYXJ0VXBkYXRlRXZlbnQnLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzID0gd2luZG93LkNBUlQucHJvZHVjdHNcclxuICAgICAgICBsZXQgcHJvZHVjdENvdW50ID0gMFxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZXJhdG9yIG9mIHByb2R1Y3RzKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RDb3VudCArPSBpdGVyYXRvci5jb3VudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuaW5uZXJUZXh0ID0gcHJvZHVjdENvdW50XHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuZGF0YXNldC5jb3VudCA9IHByb2R1Y3RDb3VudC50b1N0cmluZygpXHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2FydFByb2R1Y3RDb3VudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSwgMTAwMClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZS5kZXRhaWwubWVzc2FnZSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgc2V0Q2FydFVwZGFnZUxpc3RlbmVyKClcclxufSlcclxuIiwiLy8gRGVsZXRpbmcgYmxvY2tpbmcgb2YgYWxsIGFuaW1hdGlvbiBmb3IgZml4IGFuaW1hdGlvbiBhcnRlZmFjdHNcclxuY29uc3QgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlciA9ICgpID0+IHtcclxuICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRyYW5zaXRpb24tYmxvY2tlcicpKVxyXG4gICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RyYW5zaXRpb24tYmxvY2tlcicpKVxyXG59XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlcilcclxuXHJcbi8vIEJsb2NraW5nIGFsbCBhbmltYXRpb24gYXQgdGhlIHdpbmRvdyByZXNpemluZyBwcm9jZXNzXHJcbmNvbnN0IGFkZEFuaW1hdGlvbkJsb2NrZXIgPSAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RyYW5zaXRpb24tYmxvY2tlcicpXHJcbn1cclxuXHJcbmxldCBibG9ja0FuaW1hdGlvblRpbWVyXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XHJcbiAgICBjbGVhclRpbWVvdXQoYmxvY2tBbmltYXRpb25UaW1lcilcclxuICAgIGFkZEFuaW1hdGlvbkJsb2NrZXIoKVxyXG5cclxuICAgIGJsb2NrQW5pbWF0aW9uVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICByZW1vdmVBbmltYXRpb25CbG9ja2VyKClcclxuICAgIH0sIDMwMClcclxufSlcclxuXHJcbi8vIEhhbmRsZSBsaW5rIHdpdGggc21vb3RoIGFuaW1hdGlvbiB0byBhbmNob3IgcGxhY2Ugb24gdGhlIHBhZ2VcclxuY29uc3Qgc21vb3RoTGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZePVwiI1wiXScpXHJcbmZvciAobGV0IHNtb290aExpbmsgb2Ygc21vb3RoTGlua3MpIHtcclxuICAgIHNtb290aExpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICBjb25zdCBpZCA9IHNtb290aExpbmsuZ2V0QXR0cmlidXRlKCdocmVmJylcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7aWR9YClcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gdGFyZ2V0Tm9kZS5vZmZzZXRUb3BcclxuICAgICAgICAgICAgY29uc3QgZGV2aWNlT2Zmc2V0ID0gd2luZG93Lm91dGVyV2lkdGggPiA3NjggPyAtMTAwIDogLTIwXHJcblxyXG4gICAgICAgICAgICBzbW9vdGhTY3JvbGxUbyh0YXJnZXRPZmZzZXQgKyBkZXZpY2VPZmZzZXQsIDcwMClcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlcmUncyBubyB0YXJnZXQgbm9kZSBmb3Igc2Nyb2xsaW5nIHRvIHBsYWNlLiBUaGUgc2VsZWN0b3IgaXNuJ3QgY29ycmVjdCFcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufTtcclxuXHJcbi8vIEFuaW1hdGlvbiBpdGVtcyB3aGVuIHVzZXIgaGFzIHNjcm9sbGVkIHNjcmVlbiB0byBwbGFjZSBvZiBpdGVtXHJcbmNvbnN0IGNoZWNrQW5pbWF0aW9uRWxtcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGFuaW1hdGlvbkVsbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbmltYXRpb24tZWxlbWVudCcpKVxyXG5cclxuICAgIHJldHVybiBhbmltYXRpb25FbG1zLmxlbmd0aCA+IDBcclxufVxyXG5cclxuY29uc3Qgc2hvd0FuaW1FbGVtZW50cyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGVsbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbmltYXRpb24tZWxlbWVudCcpKVxyXG5cclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAvLyBjb25zdCBwb2ludE9mRGlzcGxheSA9IHdpbmRvd0hlaWdodCAvIDEuMiAvLyBmb3Igc2hvdyBvbiB0aGUgaGFsZiBvZiB0aGUgc2NyZWVuXHJcbiAgICBjb25zdCBwb2ludE9mRGlzcGxheSA9IHdpbmRvd0hlaWdodFxyXG5cclxuICAgIGVsbXMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICBjb25zdCBkaXN0YW5jZUZyb21Ub3AgPSByZWN0LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxyXG5cclxuICAgICAgICBpZiAoZGlzdGFuY2VGcm9tVG9wIC0gcG9pbnRPZkRpc3BsYXkgPCBzY3JvbGxUb3ApIHtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0aW9uLWVsZW1lbnQnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgaWYgKCFjaGVja0FuaW1hdGlvbkVsbXMoKSkge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZXRBbmltYXRpb25FbG1zID0gKCkgPT4ge1xyXG4gICAgaWYgKGNoZWNrQW5pbWF0aW9uRWxtcygpKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNob3dBbmltRWxlbWVudHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgc2hvd0FuaW1FbGVtZW50cygpXHJcbiAgICAgICAgc2V0QW5pbWF0aW9uRWxtcygpXHJcbiAgICB9LCAxMDApXHJcbn0pXHJcblxyXG4vLyBMYXp5IGNyb2xsIG9uIGFsbCBwYWdlXHJcbi8vPXJlcXVpcmUgdXRpbHMvU21vb3RoU2Nyb2xsLm1pbi5qc1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIFNtb290aFNjcm9sbCh7XHJcbiAgICAgICAgLy8g0JLRgNC10LzRjyDRgdC60YDQvtC70LvQsCA0MDAgPSAwLjQg0YHQtdC60YPQvdC00YtcclxuICAgICAgICBhbmltYXRpb25UaW1lICAgIDogODAwLFxyXG4gICAgICAgIC8vINCg0LDQt9C80LXRgCDRiNCw0LPQsCDQsiDQv9C40LrRgdC10LvRj9GFXHJcbiAgICAgICAgc3RlcFNpemUgICAgICAgICA6IDc1LFxyXG5cclxuICAgICAgICAvLyDQlNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC90LDRgdGC0YDQvtC50LrQuDpcclxuICAgICAgICAvLyDQo9GB0LrQvtGA0LXQvdC40LVcclxuICAgICAgICBhY2NlbGVyYXRpb25EZWx0YSA6IDMwLFxyXG4gICAgICAgIC8vINCc0LDQutGB0LjQvNCw0LvRjNC90L7QtSDRg9GB0LrQvtGA0LXQvdC40LVcclxuICAgICAgICBhY2NlbGVyYXRpb25NYXggICA6IDIsXHJcblxyXG4gICAgICAgIC8vINCf0L7QtNC00LXRgNC20LrQsCDQutC70LDQstC40LDRgtGD0YDRi1xyXG4gICAgICAgIGtleWJvYXJkU3VwcG9ydCAgIDogdHJ1ZSxcclxuICAgICAgICAvLyDQqNCw0LMg0YHQutGA0L7Qu9C70LAg0YHRgtGA0LXQu9C60LDQvNC4INC90LAg0LrQu9Cw0LLQuNCw0YLRg9GA0LUg0LIg0L/QuNC60YHQtdC70Y/RhVxyXG4gICAgICAgIGFycm93U2Nyb2xsICAgICAgIDogNTAsXHJcblxyXG4gICAgICAgIC8vIFB1bHNlIChsZXNzIHR3ZWFrYWJsZSlcclxuICAgICAgICAvLyByYXRpbyBvZiBcInRhaWxcIiB0byBcImFjY2VsZXJhdGlvblwiXHJcbiAgICAgICAgcHVsc2VBbGdvcml0aG0gICA6IHRydWUsXHJcbiAgICAgICAgcHVsc2VTY2FsZSAgICAgICA6IDQsXHJcbiAgICAgICAgcHVsc2VOb3JtYWxpemUgICA6IDEsXHJcblxyXG4gICAgICAgIC8vINCf0L7QtNC00LXRgNC20LrQsCDRgtCw0YfQv9Cw0LTQsFxyXG4gICAgICAgIHRvdWNocGFkU3VwcG9ydCAgIDogdHJ1ZSxcclxuICAgIH0pXHJcbn0pXHJcblxyXG5cclxuLy8gUGhvbmUgbWFza2luZ1xyXG5jb25zdCBpbml0UGhvbmVzTWFzayA9ICgpID0+IHtcclxuICAgIGNvbnN0IHBob25lSW5wdXRzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1cInRlbFwiXTpub3QoLmNhcnRfX2NhbGMgW3R5cGU9XCJ0ZWxcIl0pJykpXHJcblxyXG4gICAgcGhvbmVJbnB1dHMuZm9yRWFjaChwaG9uZSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGhvbmVNYXNrT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbWFzazogJyt7N30gKDAwMCkgMDAwLTAwLTAwJyxcclxuICAgICAgICAgICAgbGF6eTogdHJ1ZSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJDaGFyOiAnIydcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGhvbmVNYXNrID0gSU1hc2soXHJcbiAgICAgICAgICAgIHBob25lLFxyXG4gICAgICAgICAgICBwaG9uZU1hc2tPcHRpb25zXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBwaG9uZS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiBmYWxzZX0pKVxyXG4gICAgICAgIHBob25lLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogdHJ1ZX0pKVxyXG4gICAgfSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0UGhvbmVzTWFzaygpXHJcbn0pXHJcbiIsIi8vIEluaXQgY2FydCBjdXN0b20gRXZlbnRcclxuY29uc3QgY2FydEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjYXJ0VXBkYXRlRXZlbnQnLCB7XHJcbiAgICBkZXRhaWw6IHtcclxuICAgICAgICBtZXNzYWdlOiAnRmlyZWQgY2FydCBwcm9kdWN0IHVwZGF0ZWQgY3VzdG9tIEV2ZW50ISdcclxuICAgIH0sXHJcbiAgICBidWJibGVzOiBmYWxzZSxcclxuICAgIGNhbmNlbGFibGU6IGZhbHNlXHJcbn0pXHJcblxyXG4vLyBNZXRob2RzIGZvciB3b3JrIHdpdGggY2FydFxyXG53aW5kb3cuc2V0UHJvZHVjdFRvQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGJ0LDQtdC8INGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGC0L7QstCw0YDQsCDQsiDQutC+0YDQt9C40L3QtTonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvc2V0JywgeyAvLyAvYWpheC9jYXJ0L3NldCAtLS0gaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LXNldC5qc29uXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGFcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4uZGF0YV1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRidCw0LXQvCDRgtC+0LLQsNGA0Ysg0LIg0LrQvtGA0LfQuNC90LUnLCBkYXRhKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgNCw0LfQvNC10YnQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LIg0JrQvtGA0LfQuNC90LUhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZFByb2R1Y3RUb0NhcnQgPSBhc3luYyAoe2FydCwgY291bnR9KSA9PiB7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQu9C10L3QuNC1INGC0L7QstCw0YDQsCDQsiDQutC+0YDQt9C40L3RgzonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvYWRkJywgeyAvLyAvYWpheC9jYXJ0L2FkZCAtLS0gaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWFkZC5qc29uXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGFcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4uZGF0YV1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQu9C10L3QuNC1INGC0L7QstCw0YDQsCDQsiDQutC+0YDQt9C40L3RgycsIGRhdGEpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC00L7QsdCw0LLQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQmtC+0YDQt9C40L3RgyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cucmVtb3ZlUHJvZHVjdEZyb21DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCfQo9C00LDQu9C10L3QuNC1INGC0L7QstCw0YDQsCDQuNC3INC60L7RgNC30LjQvdGLOicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9kZWwnLCB7IC8vIC9hamF4L2NhcnQvZGVsIC0tLSBodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtZGVsLmpzb25cclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5kYXRhXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KPQtNCw0LvQtdC90LjQtSDRgtC+0LLQsNGA0LAg0LjQtyDQutC+0YDQt9C40L3RiycsIGRhdGEpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGD0LTQsNC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINC40Lcg0JrQvtGA0LfQuNC90YshINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIENhcnQgUHJveHlcclxuY29uc3QgY2FydEdldCA9ICh0YXJnZXQsIHByb3ApID0+IHtcclxuICAgIHJldHVybiB0YXJnZXRbcHJvcF1cclxufVxyXG5cclxuY29uc3QgY2FydFNldCA9ICh0YXJnZXQsIHByb3AsIHZhbCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ1NFVFRJTkcnKTtcclxuICAgIGNvbnNvbGUubG9nKCd0YXJnZXQnLCB0YXJnZXQpO1xyXG4gICAgY29uc29sZS5sb2coJ3Byb3AnLCBwcm9wKTtcclxuICAgIGNvbnNvbGUubG9nKCd2YWwnLCB2YWwpO1xyXG5cclxuICAgIGlmIChwcm9wID09PSAncHJvZHVjdHMnKSB7XHJcbiAgICAgICAgdGFyZ2V0LnByb2R1Y3RzID0gWy4uLnZhbF1cclxuXHJcbiAgICAgICAgLy8gRGlzcGF0aGNpbmcgY3VzdG9tIGNhcnQgdXBkYXRlIEV2ZW50XHJcbiAgICAgICAgY29uc3QgY2FydFByb2R1Y3RDb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FydFByb2R1Y3RDb3VudCcpXHJcbiAgICAgICAgaWYgKGNhcnRQcm9kdWN0Q291bnROb2RlKSBjYXJ0UHJvZHVjdENvdW50Tm9kZS5kaXNwYXRjaEV2ZW50KGNhcnRFdmVudClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2FydCA9IGFzeW5jICgpID0+IHtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnd2luZG93LkNBUlQgYmVmb3JlJywgd2luZG93LkNBUlQpO1xyXG5cclxuICAgIGlmICghd2luZG93LkNBUlQpIHtcclxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9nZXQnLCB7IC8vIC9hamF4L2NhcnQvZ2V0IC0tLSBodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtZ2V0Lmpzb25cclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuQ0FSVCA9IG5ldyBQcm94eSh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0czogWy4uLmRhdGFdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGdldDogY2FydEdldCxcclxuICAgICAgICAgICAgICAgIHNldDogY2FydFNldFxyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbmljaWFsaXppbmcgY2FydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVEFSVCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVzcG9uc2UgZGF0YScsIGRhdGEpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aW5kb3cuQ0FSVCcsIHdpbmRvdy5DQVJUKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSW5pY2lhbGl6aW5nIGNhcnQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRklOSVNIJyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRDYXJ0KClcclxufSlcclxuXHJcbndpbmRvdy5jYXJ0VXBkYXRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LkNBUlQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2dldCcsIHsgLy8gL2FqYXgvY2FydC9nZXQgLS0tIGh0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1nZXQuanNvblxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4uZGF0YV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59LCA1MDAwKSJdfQ==
