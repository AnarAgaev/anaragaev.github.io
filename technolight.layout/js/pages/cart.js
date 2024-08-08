const updateProductSum = (inputNode, isInc) => {

    const value = parseInt(inputNode.value)
    const calc = inputNode.closest('.cart__calc')

    const sumNode = calc.querySelector('[data-total]')
    const priceNode = calc.querySelector('[data-price]')
    const price = parseFloat(priceNode.innerText.replace(/\s/g, ""))

    const totalNode = document.querySelector('#total')
    const total = parseFloat(totalNode.innerText.replace(/\s/g, ""))

    const totalValue = isInc ? total + price : total - price

    sumNode.innerText = formatNumber(price * value)
    totalNode.innerText = formatNumber(Math.abs(totalValue))
}

const cartRequest = window.throttle(function(code, val) {
    window.setProductToCart({ art: code, count: val })
}, 3000)

const dotRequest = window.throttle(function(code, val) {
    window.setDotToCart({ id: code, count: val })
}, 3000)

const initCartCounter = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc-counter button'))

    btns.forEach(el => {
        el.addEventListener('click', function() {
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

    btns.forEach(el => el.addEventListener('click', function() {
        const product = el.closest('[data-product]')

        if (!product) return

        const isDot = product.classList.contains('cart__dot')
        const totalText = product.querySelector('[data-total]').innerText
        const total = parseInt(totalText.replace(/\s/g, ""))
        const input = product.querySelector('input')
        const code = product.dataset.productId

        const productName = isDot
            ? product.querySelector('.cart__title').innerText
            : product.querySelector('.cart__subtitle').innerText

        if (isDot) {
            // Удаляем DOT  асинхронно из БД
            window.removeDotFromCart({ id: code, count: parseInt(input.value) })
        } else {
            // Удаляем продукт асинхронно из БД
            window.removeProductFromCart({ art: code, count: parseInt(input.value) })
        }

        delProduct(product) // Удаляем продукт с экрана
        updateTotalPrice(total * -1)
        checkTotalPrice()
        showModalMsg(productName, 'Удален из корзины')
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
    if (!form) {
        return;       
    }
    const formValid = {name: true, phone: true, email: true}
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

    form.addEventListener('submit', function(e) {
        e.preventDefault()

        const name  = this.querySelector('[name="name"]')
        const phone = this.querySelector('[name="phone"]')
        const email = this.querySelector('[name="email"]')

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

window.addEventListener('load', () => {
    window.safeCall(initCartCounter)
    window.safeCall(initDelProdBtns)
    window.safeCall(initOrderSubmit)
    window.safeCall(SaveAsPDF)
})


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjYXJ0L3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB1cGRhdGVQcm9kdWN0U3VtID0gKGlucHV0Tm9kZSwgaXNJbmMpID0+IHtcclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KGlucHV0Tm9kZS52YWx1ZSlcclxuICAgIGNvbnN0IGNhbGMgPSBpbnB1dE5vZGUuY2xvc2VzdCgnLmNhcnRfX2NhbGMnKVxyXG5cclxuICAgIGNvbnN0IHN1bU5vZGUgPSBjYWxjLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRvdGFsXScpXHJcbiAgICBjb25zdCBwcmljZU5vZGUgPSBjYWxjLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXByaWNlXScpXHJcbiAgICBjb25zdCBwcmljZSA9IHBhcnNlRmxvYXQocHJpY2VOb2RlLmlubmVyVGV4dC5yZXBsYWNlKC9cXHMvZywgXCJcIikpXHJcblxyXG4gICAgY29uc3QgdG90YWxOb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RvdGFsJylcclxuICAgIGNvbnN0IHRvdGFsID0gcGFyc2VGbG9hdCh0b3RhbE5vZGUuaW5uZXJUZXh0LnJlcGxhY2UoL1xccy9nLCBcIlwiKSlcclxuXHJcbiAgICBjb25zdCB0b3RhbFZhbHVlID0gaXNJbmMgPyB0b3RhbCArIHByaWNlIDogdG90YWwgLSBwcmljZVxyXG5cclxuICAgIHN1bU5vZGUuaW5uZXJUZXh0ID0gZm9ybWF0TnVtYmVyKHByaWNlICogdmFsdWUpXHJcbiAgICB0b3RhbE5vZGUuaW5uZXJUZXh0ID0gZm9ybWF0TnVtYmVyKE1hdGguYWJzKHRvdGFsVmFsdWUpKVxyXG59XHJcblxyXG5jb25zdCBjYXJ0UmVxdWVzdCA9IHdpbmRvdy50aHJvdHRsZShmdW5jdGlvbihjb2RlLCB2YWwpIHtcclxuICAgIHdpbmRvdy5zZXRQcm9kdWN0VG9DYXJ0KHsgYXJ0OiBjb2RlLCBjb3VudDogdmFsIH0pXHJcbn0sIDMwMDApXHJcblxyXG5jb25zdCBkb3RSZXF1ZXN0ID0gd2luZG93LnRocm90dGxlKGZ1bmN0aW9uKGNvZGUsIHZhbCkge1xyXG4gICAgd2luZG93LnNldERvdFRvQ2FydCh7IGlkOiBjb2RlLCBjb3VudDogdmFsIH0pXHJcbn0sIDMwMDApXHJcblxyXG5jb25zdCBpbml0Q2FydENvdW50ZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FydF9fY2FsYy1jb3VudGVyIGJ1dHRvbicpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaXNJbmMgPSB0aGlzLmRhdGFzZXQudHlwZSA9PT0gJ2luYydcclxuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgICAgICBjb25zdCBkZWNCdG4gPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignW2RhdGEtdHlwZT1cImRlY1wiJylcclxuICAgICAgICAgICAgbGV0IHZhbCA9IGlucHV0LnZhbHVlXHJcblxyXG4gICAgICAgICAgICB2YWwgPSBpc0luY1xyXG4gICAgICAgICAgICAgICAgPyBwYXJzZUludCh2YWwpICsgMVxyXG4gICAgICAgICAgICAgICAgOiBwYXJzZUludCh2YWwpIC0gMVxyXG5cclxuICAgICAgICAgICAgaWYgKHZhbCA9PT0gMCkgdmFsKytcclxuXHJcbiAgICAgICAgICAgIGRlY0J0bi5kaXNhYmxlZCA9ICEodmFsID4gMSlcclxuXHJcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gdmFsXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVQcm9kdWN0U3VtKGlucHV0LCBpc0luYylcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNhcnRJdGVtID0gdGhpcy5jbG9zZXN0KCcuY2FydF9faXRlbScpXHJcbiAgICAgICAgICAgIGNvbnN0IGNhcnREb3QgPSB0aGlzLmNsb3Nlc3QoJy5jYXJ0X19kb3QnKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFjYXJ0SXRlbSAmJiAhY2FydERvdCkgcmV0dXJuXHJcbiAgICAgICAgICAgIGlmIChjYXJ0SXRlbSkgY2FydFJlcXVlc3QoY2FydEl0ZW0uZGF0YXNldC5wcm9kdWN0SWQsIHZhbClcclxuICAgICAgICAgICAgaWYgKGNhcnREb3QpIGRvdFJlcXVlc3QoY2FydERvdC5kYXRhc2V0LnByb2R1Y3RJZCwgdmFsKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBnZXRUb3RhbFZhbHVlID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY2FydFRvdGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdGFsJylcclxuXHJcbiAgICBpZiAoY2FydFRvdGFsKSB7XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSBjYXJ0VG90YWwuaW5uZXJUZXh0XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRvdGFsLnJlcGxhY2UoL1xccy9nLCBcIlwiKSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gMFxyXG59XHJcblxyXG5jb25zdCB1cGRhdGVUb3RhbFByaWNlID0gKHZhbCkgPT4ge1xyXG4gICAgY29uc3QgY2FydFRvdGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdGFsJylcclxuXHJcbiAgICBpZiAoY2FydFRvdGFsKSB7XHJcbiAgICAgICAgY2FydFRvdGFsLmlubmVyVGV4dCA9IGZvcm1hdE51bWJlcihnZXRUb3RhbFZhbHVlKCkgKyB2YWwpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0VG90YWxUZXh0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGV4dFdyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fYWN0aW9ucy10b3RhbCcpXHJcbiAgICB0ZXh0V3JhcC5pbm5lckhUTUwgPSAnPHA+0JIg0LrQvtGA0LfQuNC90LUg0L3QtdGCINGC0L7QstCw0YDQvtCyPC9wPidcclxuXHJcbiAgICBjb25zdCBidG5XcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcnRfX2FjdGlvbnMtYnV0dG9ucycpXHJcbiAgICBjb25zdCBidG5TZWFyY2ggPSBidG5XcmFwLnF1ZXJ5U2VsZWN0b3IoJy5idG5fc2VhcmNoJylcclxuICAgIHdoaWxlIChidG5XcmFwLmZpcnN0Q2hpbGQpIGJ0bldyYXAucmVtb3ZlQ2hpbGQoYnRuV3JhcC5maXJzdENoaWxkKVxyXG4gICAgYnRuV3JhcC5hcHBlbmRDaGlsZChidG5TZWFyY2gpXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrVG90YWxQcmljZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHRvdGFsID0gZ2V0VG90YWxWYWx1ZSgpXHJcbiAgICBpZiAodG90YWwgPD0gMCkgcmVzZXRUb3RhbFRleHQoKVxyXG59XHJcblxyXG5jb25zdCBkZWxQcm9kdWN0ID0gKGVsKSA9PiB7XHJcbiAgICBsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0XHJcblxyXG4gICAgZWwuc3R5bGUubWF4SGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4J1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gZWwuY2xhc3NMaXN0LmFkZCgncmVtb3ZlZCcpLCAxMClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gZWwucmVtb3ZlKCksIDEwMDApXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBzaG93QW5pbUVsZW1lbnRzKClcclxuICAgICAgICBzZXRBbmltYXRpb25FbG1zKClcclxuICAgIH0sIDMwMClcclxufVxyXG5cclxuY29uc3QgaW5pdERlbFByb2RCdG5zID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcnRfX2NhbGMgLmJ0bl9kZWwnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBwcm9kdWN0ID0gZWwuY2xvc2VzdCgnW2RhdGEtcHJvZHVjdF0nKVxyXG5cclxuICAgICAgICBpZiAoIXByb2R1Y3QpIHJldHVyblxyXG5cclxuICAgICAgICBjb25zdCBpc0RvdCA9IHByb2R1Y3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJ0X19kb3QnKVxyXG4gICAgICAgIGNvbnN0IHRvdGFsVGV4dCA9IHByb2R1Y3QucXVlcnlTZWxlY3RvcignW2RhdGEtdG90YWxdJykuaW5uZXJUZXh0XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSBwYXJzZUludCh0b3RhbFRleHQucmVwbGFjZSgvXFxzL2csIFwiXCIpKVxyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gcHJvZHVjdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcbiAgICAgICAgY29uc3QgY29kZSA9IHByb2R1Y3QuZGF0YXNldC5wcm9kdWN0SWRcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZHVjdE5hbWUgPSBpc0RvdFxyXG4gICAgICAgICAgICA/IHByb2R1Y3QucXVlcnlTZWxlY3RvcignLmNhcnRfX3RpdGxlJykuaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIDogcHJvZHVjdC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fc3VidGl0bGUnKS5pbm5lclRleHRcclxuXHJcbiAgICAgICAgaWYgKGlzRG90KSB7XHJcbiAgICAgICAgICAgIC8vINCj0LTQsNC70Y/QtdC8IERPVCAg0LDRgdC40L3RhdGA0L7QvdC90L4g0LjQtyDQkdCUXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVEb3RGcm9tQ2FydCh7IGlkOiBjb2RlLCBjb3VudDogcGFyc2VJbnQoaW5wdXQudmFsdWUpIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8g0KPQtNCw0LvRj9C10Lwg0L/RgNC+0LTRg9C60YIg0LDRgdC40L3RhdGA0L7QvdC90L4g0LjQtyDQkdCUXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVQcm9kdWN0RnJvbUNhcnQoeyBhcnQ6IGNvZGUsIGNvdW50OiBwYXJzZUludChpbnB1dC52YWx1ZSkgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlbFByb2R1Y3QocHJvZHVjdCkgLy8g0KPQtNCw0LvRj9C10Lwg0L/RgNC+0LTRg9C60YIg0YEg0Y3QutGA0LDQvdCwXHJcbiAgICAgICAgdXBkYXRlVG90YWxQcmljZSh0b3RhbCAqIC0xKVxyXG4gICAgICAgIGNoZWNrVG90YWxQcmljZSgpXHJcbiAgICAgICAgc2hvd01vZGFsTXNnKHByb2R1Y3ROYW1lLCAn0KPQtNCw0LvQtdC9INC40Lcg0LrQvtGA0LfQuNC90YsnKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbmNvbnN0IHNldEVycm9yT25Db250cm9sbGVyID0gKGlucHV0Tm9kZSwgZXJyb3JUZXh0KSA9PiB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUucGFyZW50Tm9kZVxyXG4gICAgY29uc3QgbWVzc2FnZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZXJyb3ItbWVzc2FnZScpXHJcblxyXG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hhcy1lcnJvcicpXHJcbiAgICBtZXNzYWdlLmlubmVyVGV4dCA9IGVycm9yVGV4dFxyXG5cclxuICAgIGlucHV0Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJylcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0RXJyb3JPbkNvbnRyb2xsZXIgPSAoaW5wdXROb2RlKSA9PiB7XHJcbiAgICBpbnB1dE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxyXG59XHJcblxyXG5jb25zdCBjbGVhckNhcnQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBwcm9kdWN0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcHJvZHVjdF0nKSlcclxuICAgIHByb2R1Y3RzLmZvckVhY2goZWwgPT4gZGVsUHJvZHVjdChlbCkpXHJcbiAgICByZXNldFRvdGFsVGV4dCgpXHJcbn1cclxuXHJcbmNvbnN0IGluaXRPcmRlclN1Ym1pdCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0T3JkZXJGb3JtJylcclxuICAgIGlmICghZm9ybSkge1xyXG4gICAgICAgIHJldHVybjsgICAgICAgXHJcbiAgICB9XHJcbiAgICBjb25zdCBmb3JtVmFsaWQgPSB7bmFtZTogdHJ1ZSwgcGhvbmU6IHRydWUsIGVtYWlsOiB0cnVlfVxyXG4gICAgY29uc3QgcGhvbmVOdW1iZXIgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGhvbmVcIl0nKVxyXG5cclxuICAgIC8vIFBob25lIG1hc2tpbmdcclxuICAgIGNvbnN0IHBob25lTWFza09wdGlvbnMgPSB7XHJcbiAgICAgICAgbWFzazogJyt7N30gKDAwMCkgMDAwLTAwLTAwJyxcclxuICAgICAgICBsYXp5OiB0cnVlLFxyXG4gICAgICAgIHBsYWNlaG9sZGVyQ2hhcjogJyMnXHJcbiAgICB9XHJcbiAgICBjb25zdCBwaG9uZU1hc2sgPSBJTWFzayhcclxuICAgICAgICBwaG9uZU51bWJlcixcclxuICAgICAgICBwaG9uZU1hc2tPcHRpb25zXHJcbiAgICApXHJcblxyXG4gICAgcGhvbmVOdW1iZXIuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogZmFsc2V9KSlcclxuICAgIHBob25lTnVtYmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogdHJ1ZX0pKVxyXG5cclxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgICAgICBjb25zdCBuYW1lICA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJuYW1lXCJdJylcclxuICAgICAgICBjb25zdCBwaG9uZSA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJwaG9uZVwiXScpXHJcbiAgICAgICAgY29uc3QgZW1haWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZW1haWxcIl0nKVxyXG5cclxuICAgICAgICAvLyBDaGVjayBuYW1lXHJcbiAgICAgICAgaWYgKG5hbWUudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHNldEVycm9yT25Db250cm9sbGVyKG5hbWUsICfQl9Cw0L/QvtC70L3QuNGC0LUg0L/QvtC70LUg0KTQmNCeJylcclxuICAgICAgICAgICAgZm9ybVZhbGlkLm5hbWUgPSBmYWxzZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc2V0RXJyb3JPbkNvbnRyb2xsZXIobmFtZSlcclxuICAgICAgICAgICAgZm9ybVZhbGlkLm5hbWUgPSB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBwaG9uZVxyXG4gICAgICAgIGlmIChwaG9uZS52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgc2V0RXJyb3JPbkNvbnRyb2xsZXIocGhvbmUsICfQl9Cw0L/QvtC70L3QuNGC0LUg0L/QvtC70LUg0KLQtdC70LXRhNC+0L0nKVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQucGhvbmUgPSBmYWxzZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlUGhvbmUocGFyc2VJbnQocGhvbmVNYXNrLnVubWFza2VkVmFsdWUpKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvck9uQ29udHJvbGxlcihwaG9uZSlcclxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5waG9uZSA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldEVycm9yT25Db250cm9sbGVyKHBob25lLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC90L7QvNC10YAg0YLQtdC70LXRhNC+0L3QsCcpXHJcbiAgICAgICAgICAgICAgICBmb3JtVmFsaWQucGhvbmUgPSBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBlbWFpbFxyXG4gICAgICAgIGlmIChlbWFpbC52YWx1ZSAhPT0gJycpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy52YWxpZGF0ZUVtYWlsKGVtYWlsLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvck9uQ29udHJvbGxlcihlbWFpbClcclxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldEVycm9yT25Db250cm9sbGVyKGVtYWlsLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLJylcclxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNldEVycm9yT25Db250cm9sbGVyKGVtYWlsKVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTZW5kaW5nIGZvcm0gZGF0YVxyXG4gICAgICAgIGlmIChmb3JtVmFsaWQubmFtZSAmJiBmb3JtVmFsaWQucGhvbmUgJiYgZm9ybVZhbGlkLmVtYWlsKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VuZCBmcm9tRGF0YSB0byBiYWNrIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IFtuYW1lLCB2YWx1ZV0gb2YgZm9ybURhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke25hbWV9OiAke3ZhbHVlfWApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JtLnJlc2V0KClcclxuICAgICAgICAgICAgY2xlYXJDYXJ0KClcclxuICAgICAgICAgICAgdG9nZ2xlTW9kYWxEaWFsb2coJyNvcmRlclNlbnRNc2cnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IFNhdmVBc1BERiA9ICgpID0+IHtcclxuICAgIGNvbnN0IHNob3dIaWRkZW5FbGVtZW50cyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBhbmltYXRpb25FbG1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGlvbi1lbGVtZW50JykpXHJcblxyXG4gICAgICAgIGFuaW1hdGlvbkVsbXMuZm9yRWFjaChlbCA9PiBlbFxyXG4gICAgICAgICAgICAuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0aW9uLWVsZW1lbnQnKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwcmludFBhZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgc2hvd0hpZGRlbkVsZW1lbnRzKClcclxuICAgICAgICB3aW5kb3cucHJpbnQoKVxyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTYXZlQXNQREYnKVxyXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHByaW50UGFnZSlcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5rZXkgPT09ICdwJykge1xyXG4gICAgICAgICAgICBzaG93SGlkZGVuRWxlbWVudHMoKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXByaW50Jywgc2hvd0hpZGRlbkVsZW1lbnRzKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChpbml0Q2FydENvdW50ZXIpXHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoaW5pdERlbFByb2RCdG5zKVxyXG4gICAgd2luZG93LnNhZmVDYWxsKGluaXRPcmRlclN1Ym1pdClcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChTYXZlQXNQREYpXHJcbn0pXHJcblxyXG4iXSwiZmlsZSI6ImNhcnQuanMifQ==
