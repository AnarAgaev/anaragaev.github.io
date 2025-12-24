const updateProductSum = (inputNode, isInc) => {

    const value = parseInt(inputNode.value)
    const calc = inputNode.closest('.cart__calc')

    const sumNode = calc.querySelector('[data-total]')

	if (!sumNode) return // If prices are hidden

    const priceNode = calc.querySelector('[data-price]')
    const price = parseFloat(priceNode.innerText.replace(/\s/g, ""))

    const totalNode = document.querySelector('#total')
    const total = parseFloat(totalNode.innerText.replace(/\s/g, ""))

    const totalValue = isInc ? total + price : total - price

    sumNode.innerText = formatNumber(price * value)
    totalNode.innerText = formatNumber(Math.abs(totalValue))
}

const cartRequest = window.throttle(function (code, val) {
    window.setProductToCart({art: code, count: val})
}, 3000)

const dotRequest = window.throttle(function (code, val) {
    window.setDotToCart({id: code, count: val})
}, 3000)

const initCartCounter = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc-counter button'))

    btns.forEach(el => {
        el.addEventListener('click', function () {
            const isInc = this.dataset.type === 'inc'
            const input = this.parentNode.querySelector('input')
            const decBtn = this.parentNode.querySelector('[data-type="dec"')
            let val = input.value

            val = isInc
                ? parseInt(val) + 1
                : parseInt(val) - 1

            if (val === 0) val++

            decBtn.disabled = !(val > 1)

            input.value = val

            updateProductSum(input, isInc)

            const cartItem = this.closest('.cart__item')
            const cartDot = this.closest('.cart__dot')

            if (!cartItem && !cartDot) return
            if (cartItem) cartRequest(cartItem.dataset.productId, val)
            if (cartDot) dotRequest(cartDot.dataset.productId, val)
        })
    })
}

const getTotalValue = () => {
    const cartTotal = document.getElementById('total')

    if (cartTotal) {
        const total = cartTotal.innerText
        return parseInt(total.replace(/\s/g, ""))
    }

    return 0
}

const updateTotalPrice = (val) => {
    const cartTotal = document.getElementById('total')

    if (cartTotal) {
        cartTotal.innerText = formatNumber(getTotalValue() + val)
    }
}

const resetTotalText = () => {
    const textWrap = document.querySelector('.cart__actions-total')
    textWrap.innerHTML = '<p>В корзине нет товаров</p>'

    const btnWrap = document.querySelector('.cart__actions-buttons')
    const btnSearch = btnWrap.querySelector('.btn_search')
    while (btnWrap.firstChild) btnWrap.removeChild(btnWrap.firstChild)
    btnWrap.appendChild(btnSearch)
}

const checkTotalPrice = () => {
    const total = getTotalValue()
    if (total <= 0) resetTotalText()
}

const delProduct = (el) => {
    let height = el.offsetHeight

    el.style.maxHeight = height + 'px'

    setTimeout(() => el.classList.add('removed'), 10)
    setTimeout(() => el.remove(), 1000)
    setTimeout(() => {
        showAnimElements()
        setAnimationElms()
    }, 300)
}

const initDelProdBtns = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc .btn_del'))

    btns.forEach(el => el.addEventListener('click', function () {
        const product = el.closest('[data-product]')

        if (!product) return

        const isDot = product.classList.contains('cart__dot')
        const input = product.querySelector('input')
        const code = product.dataset.productId

        const productName = isDot
            ? product.querySelector('.cart__title').innerText
            : product.querySelector('.cart__subtitle').innerText

        if (isDot) {
            // Удаляем DOT  асинхронно из БД
            window.removeDotFromCart({id: code, count: parseInt(input.value)})
        } else {
            // Удаляем продукт асинхронно из БД
            window.removeProductFromCart({art: code, count: parseInt(input.value)})
        }

        delProduct(product) // Удаляем продукт с экрана
        checkTotalPrice()
        showModalMsg(productName, 'Удален из корзины')

		// Updating total summary
		const totalNode = product.querySelector('[data-total]')

		if (!totalNode) return

		const totalText = totalNode.innerText
        const total = parseInt(totalText.replace(/\s/g, ""))
        updateTotalPrice(total * -1)
    }))
}

const setErrorOnController = (inputNode, errorText) => {
    const container = inputNode.parentNode
    const message = container.querySelector('.error-message')

    container.classList.add('has-error')
    message.innerText = errorText

    inputNode.addEventListener('input', () => {
        container.classList.remove('has-error')
    })
}

const resetErrorOnController = (inputNode) => {
    inputNode.parentNode.classList.remove('has-error')
}

const clearCart = () => {
    const products = Array.from(document.querySelectorAll('[data-product]'))
    products.forEach(el => delProduct(el))
    resetTotalText()
}

const initOrderSubmit = () => {
    const form = document.getElementById('setOrderForm')
    {
        if (!form) return
        // Если форма уже была инициализирована, не делаем этого повторно
        if (form.dataset.order === 'init') {
            return
        }
        form.dataset.order = 'init'
    }
    const formValid = {name: true, phone: true, email: true, city: true}
    const phoneNumber = form.querySelector('[name="phone"]')

    // Phone masking
    const phoneMaskOptions = {
        mask: '+{7} (000) 000-00-00',
        lazy: true,
        placeholderChar: '#'
    }
    const phoneMask = IMask(
        phoneNumber,
        phoneMaskOptions
    )

    phoneNumber.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
    phoneNumber.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        clearResponseCities(e.target)

        const name = this.querySelector('[name="name"]')
        const phone = this.querySelector('[name="phone"]')
        const email = this.querySelector('[name="email"]')
        const city = this.querySelector('[name="city"]')
        const cityId = this.querySelector('[name="city-id"]')

        // Check name
        if (name.value === '') {
            setErrorOnController(name, 'Заполните поле ФИО')
            formValid.name = false
        } else {
            resetErrorOnController(name)
            formValid.name = true
        }

        // Check phone
        if (phone.value === '') {
            setErrorOnController(phone, 'Заполните поле Телефон')
            formValid.phone = false
        } else {

            if (window.validatePhone(parseInt(phoneMask.unmaskedValue))) {
                resetErrorOnController(phone)
                formValid.phone = true
            } else {
                setErrorOnController(phone, 'Некорректный номер телефона')
                formValid.phone = false
            }
        }

        // Check email
        if (email.value !== '') {
            if (window.validateEmail(email.value)) {
                resetErrorOnController(email)
                formValid.email = true
            } else {
                setErrorOnController(email, 'Некорректный адрес электронной почты')
                formValid.email = false
            }
        } else {
            resetErrorOnController(email)
            formValid.email = true
        }

        // Check city
        if (!cityId) {
            setErrorOnController(city, 'Некорректно указан Город')
            formValid.city = false
        } else {
            resetErrorOnController(city)
            formValid.city = true
        }

        // Sending form data
        if (formValid.name && formValid.phone && formValid.email) {

            console.log('Send fromData to back -------------------------------------');
            const formData = new FormData(form);
            for (let [name, value] of formData) {
                console.log(`${name}: ${value}`);
            }

            form.reset()
            clearCart()
            toggleModalDialog('#orderSentMsg')
        }
    })
}

const SaveAsPDF = () => {
    const showHiddenElements = () => {
        const animationElms = Array.from(document
            .querySelectorAll('.animation-element'))

        animationElms.forEach(el => el
            .classList.remove('animation-element'))
    }

    const printPage = () => {
        showHiddenElements()
        window.print()
    }

    document.getElementById('SaveAsPDF')
        .addEventListener('click', printPage)

    window.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'p') {
            showHiddenElements()
        }
    })

    window.addEventListener('beforeprint', showHiddenElements)
}

const cityInputHandler = window.throttle(async function (e) {
    const container = e.target.parentNode
    const query = e.target.value.trim()

    const url = window.requestCityLink
    if (!url) {
        console.error('Некорректный URL API запроса города!')
        return
    }

    try {
        if (query === '') {
            clearResponseCities(e.target)
            return
        }

        container.classList.add('loading')

        const res = await fetch(url + `?query=${query}`)

        if (!res.ok) throw new Error('Ошибка запроса к API выбора города!')

        const data = await res.json()

        if (data.length === 0) return

        // Если в пришедших данные есть точно совпадение города, сразу ставим его
        const matchedCity = cityRequestChecker(query, data)

        if (matchedCity) {
            e.target.value = matchedCity.name
            return
        }

        // Если город введен некорректно, показываем список для выбора
        updateResponseCities(e.target, data)

    } catch (error) {
        console.error(error)
    } finally {
        container.classList.remove('loading')
    }
}, 1000)

function cityRequestChecker(query, cities) {
    const match = cities.filter(city =>
        city.name.toLowerCase() === query.toLowerCase())
    return match[0]
}

const initCitySelector = () => {
    {
        const form = document.getElementById('setOrderForm')
        if (!form) return
        // Если форма уже была инициализирована, не делаем этого повторно
        if (form.dataset.city === 'init') {
            return
        }
        form.dataset.city = 'init'
    }
    
    const selectors = document.querySelectorAll('label:has([name="city"])')

    if (selectors.length === 0) return

    selectors.forEach(el => {
        const input = el.querySelector('input')

        input.addEventListener('input', (e) => {
            if (input.value.trim() === '') clearResponseCities(input)
            if (e.isTrusted === false) return
            cityInputHandler(e) // отправляет запрос на сервер
        })
    })
}

function clearResponseCities(inputNode) {
    const container = inputNode.parentNode
    const list = container.querySelector('.city-selector')

    if (!list) return

    list.remove()
}

function updateResponseCities(inputNode, cities) {
    const container = inputNode.parentNode
    const selector = document.createElement('span')
    selector.classList.add('city-selector')

    const wrap = document.createElement('span')
    wrap.classList.add('city-selector__wrap')
    selector.appendChild(wrap)

    const list = document.createElement('span')
    list.classList.add('city-selector__list')
    wrap.appendChild(list)
    cities.forEach(city => {
        const item = document.createElement('span')
        item.classList.add('city-selector__item')
        item.setAttribute('data-id', city.id)
        item.textContent = city.name
        list.appendChild(item)

        item.addEventListener('click', e => cityItemClickHandler(e, inputNode))
    })

    clearResponseCities(inputNode)
    container.appendChild(selector)
}

function cityItemClickHandler(e, inputNode) {
    e.preventDefault()
    e.stopPropagation()

    const city = e.target.innerText
    const id = e.target.dataset.id

    inputNode.value = city
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    inputNode.dispatchEvent(event);
    const container = inputNode.parentNode
    const selector = container.querySelector('.city-selector')
    selector.remove()
}


window.addEventListener('load', () => {
    window.safeCall(initCartCounter)
    window.safeCall(initDelProdBtns)
    window.safeCall(initOrderSubmit)
    window.safeCall(SaveAsPDF)
    window.safeCall(initCitySelector)
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjYXJ0L3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB1cGRhdGVQcm9kdWN0U3VtID0gKGlucHV0Tm9kZSwgaXNJbmMpID0+IHtcclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KGlucHV0Tm9kZS52YWx1ZSlcclxuICAgIGNvbnN0IGNhbGMgPSBpbnB1dE5vZGUuY2xvc2VzdCgnLmNhcnRfX2NhbGMnKVxyXG5cclxuICAgIGNvbnN0IHN1bU5vZGUgPSBjYWxjLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRvdGFsXScpXHJcblxyXG5cdGlmICghc3VtTm9kZSkgcmV0dXJuIC8vIElmIHByaWNlcyBhcmUgaGlkZGVuXHJcblxyXG4gICAgY29uc3QgcHJpY2VOb2RlID0gY2FsYy5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wcmljZV0nKVxyXG4gICAgY29uc3QgcHJpY2UgPSBwYXJzZUZsb2F0KHByaWNlTm9kZS5pbm5lclRleHQucmVwbGFjZSgvXFxzL2csIFwiXCIpKVxyXG5cclxuICAgIGNvbnN0IHRvdGFsTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b3RhbCcpXHJcbiAgICBjb25zdCB0b3RhbCA9IHBhcnNlRmxvYXQodG90YWxOb2RlLmlubmVyVGV4dC5yZXBsYWNlKC9cXHMvZywgXCJcIikpXHJcblxyXG4gICAgY29uc3QgdG90YWxWYWx1ZSA9IGlzSW5jID8gdG90YWwgKyBwcmljZSA6IHRvdGFsIC0gcHJpY2VcclxuXHJcbiAgICBzdW1Ob2RlLmlubmVyVGV4dCA9IGZvcm1hdE51bWJlcihwcmljZSAqIHZhbHVlKVxyXG4gICAgdG90YWxOb2RlLmlubmVyVGV4dCA9IGZvcm1hdE51bWJlcihNYXRoLmFicyh0b3RhbFZhbHVlKSlcclxufVxyXG5cclxuY29uc3QgY2FydFJlcXVlc3QgPSB3aW5kb3cudGhyb3R0bGUoZnVuY3Rpb24gKGNvZGUsIHZhbCkge1xyXG4gICAgd2luZG93LnNldFByb2R1Y3RUb0NhcnQoe2FydDogY29kZSwgY291bnQ6IHZhbH0pXHJcbn0sIDMwMDApXHJcblxyXG5jb25zdCBkb3RSZXF1ZXN0ID0gd2luZG93LnRocm90dGxlKGZ1bmN0aW9uIChjb2RlLCB2YWwpIHtcclxuICAgIHdpbmRvdy5zZXREb3RUb0NhcnQoe2lkOiBjb2RlLCBjb3VudDogdmFsfSlcclxufSwgMzAwMClcclxuXHJcbmNvbnN0IGluaXRDYXJ0Q291bnRlciA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJ0X19jYWxjLWNvdW50ZXIgYnV0dG9uJykpXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc3QgaXNJbmMgPSB0aGlzLmRhdGFzZXQudHlwZSA9PT0gJ2luYydcclxuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgICAgICBjb25zdCBkZWNCdG4gPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignW2RhdGEtdHlwZT1cImRlY1wiJylcclxuICAgICAgICAgICAgbGV0IHZhbCA9IGlucHV0LnZhbHVlXHJcblxyXG4gICAgICAgICAgICB2YWwgPSBpc0luY1xyXG4gICAgICAgICAgICAgICAgPyBwYXJzZUludCh2YWwpICsgMVxyXG4gICAgICAgICAgICAgICAgOiBwYXJzZUludCh2YWwpIC0gMVxyXG5cclxuICAgICAgICAgICAgaWYgKHZhbCA9PT0gMCkgdmFsKytcclxuXHJcbiAgICAgICAgICAgIGRlY0J0bi5kaXNhYmxlZCA9ICEodmFsID4gMSlcclxuXHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gdmFsXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVQcm9kdWN0U3VtKGlucHV0LCBpc0luYylcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNhcnRJdGVtID0gdGhpcy5jbG9zZXN0KCcuY2FydF9faXRlbScpXHJcbiAgICAgICAgICAgIGNvbnN0IGNhcnREb3QgPSB0aGlzLmNsb3Nlc3QoJy5jYXJ0X19kb3QnKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFjYXJ0SXRlbSAmJiAhY2FydERvdCkgcmV0dXJuXHJcbiAgICAgICAgICAgIGlmIChjYXJ0SXRlbSkgY2FydFJlcXVlc3QoY2FydEl0ZW0uZGF0YXNldC5wcm9kdWN0SWQsIHZhbClcclxuICAgICAgICAgICAgaWYgKGNhcnREb3QpIGRvdFJlcXVlc3QoY2FydERvdC5kYXRhc2V0LnByb2R1Y3RJZCwgdmFsKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBnZXRUb3RhbFZhbHVlID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY2FydFRvdGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdGFsJylcclxuXHJcbiAgICBpZiAoY2FydFRvdGFsKSB7XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSBjYXJ0VG90YWwuaW5uZXJUZXh0XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRvdGFsLnJlcGxhY2UoL1xccy9nLCBcIlwiKSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gMFxyXG59XHJcblxyXG5jb25zdCB1cGRhdGVUb3RhbFByaWNlID0gKHZhbCkgPT4ge1xyXG4gICAgY29uc3QgY2FydFRvdGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdGFsJylcclxuXHJcbiAgICBpZiAoY2FydFRvdGFsKSB7XHJcbiAgICAgICAgY2FydFRvdGFsLmlubmVyVGV4dCA9IGZvcm1hdE51bWJlcihnZXRUb3RhbFZhbHVlKCkgKyB2YWwpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0VG90YWxUZXh0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGV4dFdyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fYWN0aW9ucy10b3RhbCcpXHJcbiAgICB0ZXh0V3JhcC5pbm5lckhUTUwgPSAnPHA+0JIg0LrQvtGA0LfQuNC90LUg0L3QtdGCINGC0L7QstCw0YDQvtCyPC9wPidcclxuXHJcbiAgICBjb25zdCBidG5XcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2FjdGlvbnMtYnV0dG9ucycpXHJcbiAgICBjb25zdCBidG5TZWFyY2ggPSBidG5XcmFwLnF1ZXJ5U2VsZWN0b3IoJy5idG5fc2VhcmNoJylcclxuICAgIHdoaWxlIChidG5XcmFwLmZpcnN0Q2hpbGQpIGJ0bldyYXAucmVtb3ZlQ2hpbGQoYnRuV3JhcC5maXJzdENoaWxkKVxyXG4gICAgYnRuV3JhcC5hcHBlbmRDaGlsZChidG5TZWFyY2gpXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrVG90YWxQcmljZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHRvdGFsID0gZ2V0VG90YWxWYWx1ZSgpXHJcbiAgICBpZiAodG90YWwgPD0gMCkgcmVzZXRUb3RhbFRleHQoKVxyXG59XHJcblxyXG5jb25zdCBkZWxQcm9kdWN0ID0gKGVsKSA9PiB7XHJcbiAgICBsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0XHJcblxyXG4gICAgZWwuc3R5bGUubWF4SGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4J1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gZWwuY2xhc3NMaXN0LmFkZCgncmVtb3ZlZCcpLCAxMClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gZWwucmVtb3ZlKCksIDEwMDApXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBzaG93QW5pbUVsZW1lbnRzKClcclxuICAgICAgICBzZXRBbmltYXRpb25FbG1zKClcclxuICAgIH0sIDMwMClcclxufVxyXG5cclxuY29uc3QgaW5pdERlbFByb2RCdG5zID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcnRfX2NhbGMgLmJ0bl9kZWwnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IGVsLmNsb3Nlc3QoJ1tkYXRhLXByb2R1Y3RdJylcclxuXHJcbiAgICAgICAgaWYgKCFwcm9kdWN0KSByZXR1cm5cclxuXHJcbiAgICAgICAgY29uc3QgaXNEb3QgPSBwcm9kdWN0LmNsYXNzTGlzdC5jb250YWlucygnY2FydF9fZG90JylcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHByb2R1Y3QucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBwcm9kdWN0LmRhdGFzZXQucHJvZHVjdElkXHJcblxyXG4gICAgICAgIGNvbnN0IHByb2R1Y3ROYW1lID0gaXNEb3RcclxuICAgICAgICAgICAgPyBwcm9kdWN0LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X190aXRsZScpLmlubmVyVGV4dFxyXG4gICAgICAgICAgICA6IHByb2R1Y3QucXVlcnlTZWxlY3RvcignLmNhcnRfX3N1YnRpdGxlJykuaW5uZXJUZXh0XHJcblxyXG4gICAgICAgIGlmIChpc0RvdCkge1xyXG4gICAgICAgICAgICAvLyDQo9C00LDQu9GP0LXQvCBET1QgINCw0YHQuNC90YXRgNC+0L3QvdC+INC40Lcg0JHQlFxyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRG90RnJvbUNhcnQoe2lkOiBjb2RlLCBjb3VudDogcGFyc2VJbnQoaW5wdXQudmFsdWUpfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyDQo9C00LDQu9GP0LXQvCDQv9GA0L7QtNGD0LrRgiDQsNGB0LjQvdGF0YDQvtC90L3QviDQuNC3INCR0JRcclxuICAgICAgICAgICAgd2luZG93LnJlbW92ZVByb2R1Y3RGcm9tQ2FydCh7YXJ0OiBjb2RlLCBjb3VudDogcGFyc2VJbnQoaW5wdXQudmFsdWUpfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlbFByb2R1Y3QocHJvZHVjdCkgLy8g0KPQtNCw0LvRj9C10Lwg0L/RgNC+0LTRg9C60YIg0YEg0Y3QutGA0LDQvdCwXHJcbiAgICAgICAgY2hlY2tUb3RhbFByaWNlKClcclxuICAgICAgICBzaG93TW9kYWxNc2cocHJvZHVjdE5hbWUsICfQo9C00LDQu9C10L0g0LjQtyDQutC+0YDQt9C40L3RiycpXHJcblxyXG5cdFx0Ly8gVXBkYXRpbmcgdG90YWwgc3VtbWFyeVxyXG5cdFx0Y29uc3QgdG90YWxOb2RlID0gcHJvZHVjdC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10b3RhbF0nKVxyXG5cclxuXHRcdGlmICghdG90YWxOb2RlKSByZXR1cm5cclxuXHJcblx0XHRjb25zdCB0b3RhbFRleHQgPSB0b3RhbE5vZGUuaW5uZXJUZXh0XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSBwYXJzZUludCh0b3RhbFRleHQucmVwbGFjZSgvXFxzL2csIFwiXCIpKVxyXG4gICAgICAgIHVwZGF0ZVRvdGFsUHJpY2UodG90YWwgKiAtMSlcclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzZXRFcnJvck9uQ29udHJvbGxlciA9IChpbnB1dE5vZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLnBhcmVudE5vZGVcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmVycm9yLW1lc3NhZ2UnKVxyXG5cclxuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxyXG4gICAgbWVzc2FnZS5pbm5lclRleHQgPSBlcnJvclRleHRcclxuXHJcbiAgICBpbnB1dE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCByZXNldEVycm9yT25Db250cm9sbGVyID0gKGlucHV0Tm9kZSkgPT4ge1xyXG4gICAgaW5wdXROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJylcclxufVxyXG5cclxuY29uc3QgY2xlYXJDYXJ0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXByb2R1Y3RdJykpXHJcbiAgICBwcm9kdWN0cy5mb3JFYWNoKGVsID0+IGRlbFByb2R1Y3QoZWwpKVxyXG4gICAgcmVzZXRUb3RhbFRleHQoKVxyXG59XHJcblxyXG5jb25zdCBpbml0T3JkZXJTdWJtaXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldE9yZGVyRm9ybScpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFmb3JtKSByZXR1cm5cclxuICAgICAgICAvLyDQldGB0LvQuCDRhNC+0YDQvNCwINGD0LbQtSDQsdGL0LvQsCDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0L3QsCwg0L3QtSDQtNC10LvQsNC10Lwg0Y3RgtC+0LPQviDQv9C+0LLRgtC+0YDQvdC+XHJcbiAgICAgICAgaWYgKGZvcm0uZGF0YXNldC5vcmRlciA9PT0gJ2luaXQnKSB7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3JtLmRhdGFzZXQub3JkZXIgPSAnaW5pdCdcclxuICAgIH1cclxuICAgIGNvbnN0IGZvcm1WYWxpZCA9IHtuYW1lOiB0cnVlLCBwaG9uZTogdHJ1ZSwgZW1haWw6IHRydWUsIGNpdHk6IHRydWV9XHJcbiAgICBjb25zdCBwaG9uZU51bWJlciA9IGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCJwaG9uZVwiXScpXHJcblxyXG4gICAgLy8gUGhvbmUgbWFza2luZ1xyXG4gICAgY29uc3QgcGhvbmVNYXNrT3B0aW9ucyA9IHtcclxuICAgICAgICBtYXNrOiAnK3s3fSAoMDAwKSAwMDAtMDAtMDAnLFxyXG4gICAgICAgIGxhenk6IHRydWUsXHJcbiAgICAgICAgcGxhY2Vob2xkZXJDaGFyOiAnIydcclxuICAgIH1cclxuICAgIGNvbnN0IHBob25lTWFzayA9IElNYXNrKFxyXG4gICAgICAgIHBob25lTnVtYmVyLFxyXG4gICAgICAgIHBob25lTWFza09wdGlvbnNcclxuICAgIClcclxuXHJcbiAgICBwaG9uZU51bWJlci5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiBmYWxzZX0pKVxyXG4gICAgcGhvbmVOdW1iZXIuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiB0cnVlfSkpXHJcblxyXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgICAgICBjbGVhclJlc3BvbnNlQ2l0aWVzKGUudGFyZ2V0KVxyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cIm5hbWVcIl0nKVxyXG4gICAgICAgIGNvbnN0IHBob25lID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBob25lXCJdJylcclxuICAgICAgICBjb25zdCBlbWFpbCA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJlbWFpbFwiXScpXHJcbiAgICAgICAgY29uc3QgY2l0eSA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJjaXR5XCJdJylcclxuICAgICAgICBjb25zdCBjaXR5SWQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiY2l0eS1pZFwiXScpXHJcblxyXG4gICAgICAgIC8vIENoZWNrIG5hbWVcclxuICAgICAgICBpZiAobmFtZS52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgc2V0RXJyb3JPbkNvbnRyb2xsZXIobmFtZSwgJ9CX0LDQv9C+0LvQvdC40YLQtSDQv9C+0LvQtSDQpNCY0J4nKVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQubmFtZSA9IGZhbHNlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzZXRFcnJvck9uQ29udHJvbGxlcihuYW1lKVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQubmFtZSA9IHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIHBob25lXHJcbiAgICAgICAgaWYgKHBob25lLnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICBzZXRFcnJvck9uQ29udHJvbGxlcihwaG9uZSwgJ9CX0LDQv9C+0LvQvdC40YLQtSDQv9C+0LvQtSDQotC10LvQtdGE0L7QvScpXHJcbiAgICAgICAgICAgIGZvcm1WYWxpZC5waG9uZSA9IGZhbHNlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cudmFsaWRhdGVQaG9uZShwYXJzZUludChwaG9uZU1hc2sudW5tYXNrZWRWYWx1ZSkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNldEVycm9yT25Db250cm9sbGVyKHBob25lKVxyXG4gICAgICAgICAgICAgICAgZm9ybVZhbGlkLnBob25lID0gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0RXJyb3JPbkNvbnRyb2xsZXIocGhvbmUsICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L3QvtC80LXRgCDRgtC10LvQtdGE0L7QvdCwJylcclxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5waG9uZSA9IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGVtYWlsXHJcbiAgICAgICAgaWYgKGVtYWlsLnZhbHVlICE9PSAnJykge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlRW1haWwoZW1haWwudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXNldEVycm9yT25Db250cm9sbGVyKGVtYWlsKVxyXG4gICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0RXJyb3JPbkNvbnRyb2xsZXIoZW1haWwsICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YsnKVxyXG4gICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc2V0RXJyb3JPbkNvbnRyb2xsZXIoZW1haWwpXHJcbiAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGNpdHlcclxuICAgICAgICBpZiAoIWNpdHlJZCkge1xyXG4gICAgICAgICAgICBzZXRFcnJvck9uQ29udHJvbGxlcihjaXR5LCAn0J3QtdC60L7RgNGA0LXQutGC0L3QviDRg9C60LDQt9Cw0L0g0JPQvtGA0L7QtCcpXHJcbiAgICAgICAgICAgIGZvcm1WYWxpZC5jaXR5ID0gZmFsc2VcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNldEVycm9yT25Db250cm9sbGVyKGNpdHkpXHJcbiAgICAgICAgICAgIGZvcm1WYWxpZC5jaXR5ID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2VuZGluZyBmb3JtIGRhdGFcclxuICAgICAgICBpZiAoZm9ybVZhbGlkLm5hbWUgJiYgZm9ybVZhbGlkLnBob25lICYmIGZvcm1WYWxpZC5lbWFpbCkge1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlbmQgZnJvbURhdGEgdG8gYmFjayAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBbbmFtZSwgdmFsdWVdIG9mIGZvcm1EYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfTogJHt2YWx1ZX1gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9ybS5yZXNldCgpXHJcbiAgICAgICAgICAgIGNsZWFyQ2FydCgpXHJcbiAgICAgICAgICAgIHRvZ2dsZU1vZGFsRGlhbG9nKCcjb3JkZXJTZW50TXNnJylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBTYXZlQXNQREYgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzaG93SGlkZGVuRWxlbWVudHMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uRWxtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbmltYXRpb24tZWxlbWVudCcpKVxyXG5cclxuICAgICAgICBhbmltYXRpb25FbG1zLmZvckVhY2goZWwgPT4gZWxcclxuICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGlvbi1lbGVtZW50JykpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJpbnRQYWdlID0gKCkgPT4ge1xyXG4gICAgICAgIHNob3dIaWRkZW5FbGVtZW50cygpXHJcbiAgICAgICAgd2luZG93LnByaW50KClcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnU2F2ZUFzUERGJylcclxuICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwcmludFBhZ2UpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcclxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUua2V5ID09PSAncCcpIHtcclxuICAgICAgICAgICAgc2hvd0hpZGRlbkVsZW1lbnRzKClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmVwcmludCcsIHNob3dIaWRkZW5FbGVtZW50cylcclxufVxyXG5cclxuY29uc3QgY2l0eUlucHV0SGFuZGxlciA9IHdpbmRvdy50aHJvdHRsZShhc3luYyBmdW5jdGlvbiAoZSkge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZS50YXJnZXQucGFyZW50Tm9kZVxyXG4gICAgY29uc3QgcXVlcnkgPSBlLnRhcmdldC52YWx1ZS50cmltKClcclxuXHJcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cucmVxdWVzdENpdHlMaW5rXHJcbiAgICBpZiAoIXVybCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSBVUkwgQVBJINC30LDQv9GA0L7RgdCwINCz0L7RgNC+0LTQsCEnKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKHF1ZXJ5ID09PSAnJykge1xyXG4gICAgICAgICAgICBjbGVhclJlc3BvbnNlQ2l0aWVzKGUudGFyZ2V0KVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nJylcclxuXHJcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsICsgYD9xdWVyeT0ke3F1ZXJ5fWApXHJcblxyXG4gICAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQt9Cw0L/RgNC+0YHQsCDQuiBBUEkg0LLRi9Cx0L7RgNCwINCz0L7RgNC+0LTQsCEnKVxyXG5cclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgICAgICAvLyDQldGB0LvQuCDQsiDQv9GA0LjRiNC10LTRiNC40YUg0LTQsNC90L3Ri9C1INC10YHRgtGMINGC0L7Rh9C90L4g0YHQvtCy0L/QsNC00LXQvdC40LUg0LPQvtGA0L7QtNCwLCDRgdGA0LDQt9GDINGB0YLQsNCy0LjQvCDQtdCz0L5cclxuICAgICAgICBjb25zdCBtYXRjaGVkQ2l0eSA9IGNpdHlSZXF1ZXN0Q2hlY2tlcihxdWVyeSwgZGF0YSlcclxuXHJcbiAgICAgICAgaWYgKG1hdGNoZWRDaXR5KSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gbWF0Y2hlZENpdHkubmFtZVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCV0YHQu9C4INCz0L7RgNC+0LQg0LLQstC10LTQtdC9INC90LXQutC+0YDRgNC10LrRgtC90L4sINC/0L7QutCw0LfRi9Cy0LDQtdC8INGB0L/QuNGB0L7QuiDQtNC70Y8g0LLRi9Cx0L7RgNCwXHJcbiAgICAgICAgdXBkYXRlUmVzcG9uc2VDaXRpZXMoZS50YXJnZXQsIGRhdGEpXHJcblxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZycpXHJcbiAgICB9XHJcbn0sIDEwMDApXHJcblxyXG5mdW5jdGlvbiBjaXR5UmVxdWVzdENoZWNrZXIocXVlcnksIGNpdGllcykge1xyXG4gICAgY29uc3QgbWF0Y2ggPSBjaXRpZXMuZmlsdGVyKGNpdHkgPT5cclxuICAgICAgICBjaXR5Lm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gcXVlcnkudG9Mb3dlckNhc2UoKSlcclxuICAgIHJldHVybiBtYXRjaFswXVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2l0eVNlbGVjdG9yID0gKCkgPT4ge1xyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0T3JkZXJGb3JtJylcclxuICAgICAgICBpZiAoIWZvcm0pIHJldHVyblxyXG4gICAgICAgIC8vINCV0YHQu9C4INGE0L7RgNC80LAg0YPQttC1INCx0YvQu9CwINC40L3QuNGG0LjQsNC70LjQt9C40YDQvtCy0LDQvdCwLCDQvdC1INC00LXQu9Cw0LXQvCDRjdGC0L7Qs9C+INC/0L7QstGC0L7RgNC90L5cclxuICAgICAgICBpZiAoZm9ybS5kYXRhc2V0LmNpdHkgPT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9ybS5kYXRhc2V0LmNpdHkgPSAnaW5pdCdcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3Qgc2VsZWN0b3JzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGFiZWw6aGFzKFtuYW1lPVwiY2l0eVwiXSknKVxyXG5cclxuICAgIGlmIChzZWxlY3RvcnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBzZWxlY3RvcnMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSBlbC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcblxyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlucHV0LnZhbHVlLnRyaW0oKSA9PT0gJycpIGNsZWFyUmVzcG9uc2VDaXRpZXMoaW5wdXQpXHJcbiAgICAgICAgICAgIGlmIChlLmlzVHJ1c3RlZCA9PT0gZmFsc2UpIHJldHVyblxyXG4gICAgICAgICAgICBjaXR5SW5wdXRIYW5kbGVyKGUpIC8vINC+0YLQv9GA0LDQstC70Y/QtdGCINC30LDQv9GA0L7RgSDQvdCwINGB0LXRgNCy0LXRgFxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhclJlc3BvbnNlQ2l0aWVzKGlucHV0Tm9kZSkge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLnBhcmVudE5vZGVcclxuICAgIGNvbnN0IGxpc3QgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmNpdHktc2VsZWN0b3InKVxyXG5cclxuICAgIGlmICghbGlzdCkgcmV0dXJuXHJcblxyXG4gICAgbGlzdC5yZW1vdmUoKVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVSZXNwb25zZUNpdGllcyhpbnB1dE5vZGUsIGNpdGllcykge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLnBhcmVudE5vZGVcclxuICAgIGNvbnN0IHNlbGVjdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICBzZWxlY3Rvci5jbGFzc0xpc3QuYWRkKCdjaXR5LXNlbGVjdG9yJylcclxuXHJcbiAgICBjb25zdCB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICB3cmFwLmNsYXNzTGlzdC5hZGQoJ2NpdHktc2VsZWN0b3JfX3dyYXAnKVxyXG4gICAgc2VsZWN0b3IuYXBwZW5kQ2hpbGQod3JhcClcclxuXHJcbiAgICBjb25zdCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICBsaXN0LmNsYXNzTGlzdC5hZGQoJ2NpdHktc2VsZWN0b3JfX2xpc3QnKVxyXG4gICAgd3JhcC5hcHBlbmRDaGlsZChsaXN0KVxyXG4gICAgY2l0aWVzLmZvckVhY2goY2l0eSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnY2l0eS1zZWxlY3Rvcl9faXRlbScpXHJcbiAgICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBjaXR5LmlkKVxyXG4gICAgICAgIGl0ZW0udGV4dENvbnRlbnQgPSBjaXR5Lm5hbWVcclxuICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGl0ZW0pXHJcblxyXG4gICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IGNpdHlJdGVtQ2xpY2tIYW5kbGVyKGUsIGlucHV0Tm9kZSkpXHJcbiAgICB9KVxyXG5cclxuICAgIGNsZWFyUmVzcG9uc2VDaXRpZXMoaW5wdXROb2RlKVxyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNlbGVjdG9yKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaXR5SXRlbUNsaWNrSGFuZGxlcihlLCBpbnB1dE5vZGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIGNvbnN0IGNpdHkgPSBlLnRhcmdldC5pbm5lclRleHRcclxuICAgIGNvbnN0IGlkID0gZS50YXJnZXQuZGF0YXNldC5pZFxyXG5cclxuICAgIGlucHV0Tm9kZS52YWx1ZSA9IGNpdHlcclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KCdpbnB1dCcsIHtcclxuICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIGlucHV0Tm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5wYXJlbnROb2RlXHJcbiAgICBjb25zdCBzZWxlY3RvciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY2l0eS1zZWxlY3RvcicpXHJcbiAgICBzZWxlY3Rvci5yZW1vdmUoKVxyXG59XHJcblxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoaW5pdENhcnRDb3VudGVyKVxyXG4gICAgd2luZG93LnNhZmVDYWxsKGluaXREZWxQcm9kQnRucylcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChpbml0T3JkZXJTdWJtaXQpXHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoU2F2ZUFzUERGKVxyXG4gICAgd2luZG93LnNhZmVDYWxsKGluaXRDaXR5U2VsZWN0b3IpXHJcbn0pIl0sImZpbGUiOiJjYXJ0LmpzIn0=
