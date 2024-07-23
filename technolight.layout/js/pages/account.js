// Для всех страниц кабнета добавляем один файл скрптов - account.js

// Change user password --- START
const initChangePassFormToggles = () => {
    let btns = document.querySelectorAll('#changePasswordForm .account__form-toggle-pass')
    btns = Array.from(btns)

    btns.forEach(el => el.addEventListener('click', function() {
        const input = this.parentNode.querySelector('input')

        if (input.type === 'text') {
            input.type = 'password'
            this.classList.remove('pass-visible')
        } else {
            input.type = 'text'
            this.classList.add('pass-visible')
        }
    }))
}

const blockChangePassForm = () => {
    let button = document.querySelector('#changePasswordForm .account__form-button button')
    button.disabled = true

    setTimeout(() => button.disabled = false, 5000)
}

const changePasswordFormData = {
    currentLength: true,
    newLength: true,
    isEqual: true
}

const resetAllErrorsPasswordForm = () => {
    let controllers = document.querySelectorAll('#changePasswordForm .account__form-controller')
    controllers = Array.from(controllers)
    controllers.forEach(el => el.classList.remove('has-error'))
}

const checkPassLength = (value) => {
    return value.length >= 8
}

const addInputPassHandler = (input) => {
    input.addEventListener('input', () => {
        const container = input.closest('.account__form-controller')
        container.classList.remove('has-error')
    })
}

const checkChangePassForm = (currentInput, newInput) => {
    const isFormValid = changePasswordFormData.currentLength
        && changePasswordFormData.newLength
        && changePasswordFormData.isEqual

    const controllerCurrent = currentInput.closest('.account__form-controller')
    const currentError = controllerCurrent.querySelector('.account__form-error')

    const controllerNew = newInput.closest('.account__form-controller')
    const newError = controllerNew.querySelector('.account__form-error')

    if (!changePasswordFormData.currentLength) {
        currentError.innerText = 'Пароль должен содержать минимум 8 символов'
        controllerCurrent.classList.add('has-error')
    }

    if (!changePasswordFormData.newLength) {
        newError.innerText = 'Пароль должен содержать минимум 8 символов'
        controllerNew.classList.add('has-error')
    } else {
        if(!changePasswordFormData.isEqual) {
            newError.innerText = 'Пароли должны совпадать'
            controllerNew.classList.add('has-error')
        }
    }

    changePasswordFormData.currentLength = true
    changePasswordFormData.newLength = true
    changePasswordFormData.isEqual = true

    return isFormValid
}

const initChangePasswordForm = () => {
    const form = document.querySelector('#changePasswordForm')

    if (!form) return

    const currentPass = form.querySelector('#currentPass')
    const newPass = form.querySelector('#newPass')

    // Handlers
    addInputPassHandler(currentPass)
    addInputPassHandler(newPass)

    form.addEventListener('submit', function(e) {

        // Check value length
        changePasswordFormData.currentLength = checkPassLength(currentPass.value)
        changePasswordFormData.newLength= checkPassLength(newPass.value)
        changePasswordFormData.isEqual = currentPass.value === newPass.value

        // Check form
        if (checkChangePassForm(currentPass, newPass)) {
            resetAllErrorsPasswordForm()
            console.log('Fetching request for updating user password');

            window.showModalMsg('Изменение пароля', 'Пароль был успешно изменен')
            blockChangePassForm()
        }
    })
}
// Change user password --- FINISH

// Update user data --- START
const setErrorOnUserDataController = (inputNode, errorText) => {
    const container = inputNode.closest('.account__form-controller')
    const message = container.querySelector('.account__form-error')

    container.classList.add('has-error')
    message.innerText = errorText

    inputNode.addEventListener('input', () => {
        container.classList.remove('has-error')
    })
}

const resetErrorOnUserDataController = (inputNode) => {
    const container = inputNode.closest('.account__form-controller')
    container.classList.remove('has-error')
}

const blockUserDataForm = () => {
    let button = document.querySelector('#changeUserDataForm .account__form-button button')
    button.disabled = true

    setTimeout(() => button.disabled = false, 5000)
}

const initChangeUserDataForm = () => {
    const form = document.getElementById('changeUserDataForm')

    if (!form) return

    const formValid = {name: true, phone: true, email: true}
    
    
    
    
    // const phoneNumber = form.querySelector('[name="phone"]')

    // // Phone masking
    // const phoneMaskOptions = {
    //     mask: '+{7} (000) 000-00-00',
    //     lazy: true,
    //     placeholderChar: '#'
    // }
    // const phoneMask = IMask(
    //     phoneNumber,
    //     phoneMaskOptions
    // )

    // phoneNumber.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
    // phoneNumber.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))







    form.addEventListener('submit', function(e) {

        const name  = this.querySelector('[name="name"]')
        const phone = this.querySelector('[name="phone"]')
        const email = this.querySelector('[name="email"]')

        // Check name
        if (name.value === '') {
            setErrorOnUserDataController(name, 'Заполните поле ФИО')
            formValid.name = false
        } else {
            resetErrorOnUserDataController(name)
            formValid.name = true
        }

        // Check phone
        if (phone.value === '') {
            setErrorOnUserDataController(phone, 'Заполните поле Телефон')
            formValid.phone = false
        } else {
            if (window.validatePhone(window.clearPhone(phone.value))) {
                resetErrorOnUserDataController(phone)
                formValid.phone = true
            } else {
                setErrorOnUserDataController(phone, 'Некорректный номер телефона')
                formValid.phone = false
            }
        }

        // Check email
        if (email.value !== '') {
            if (window.validateEmail(email.value)) {
                resetErrorOnUserDataController(email)
                formValid.email = true
            } else {
                setErrorOnUserDataController(email, 'Некорректный адрес электронной почты')
                formValid.email = false
            }
        } else {
            resetErrorOnUserDataController(email)
            formValid.email = true
        }

        // Senging form data
        if (formValid.name && formValid.phone && formValid.email) {

            const formData = new FormData(form);

            // Обязательно удалить после внедрения
            for (let [name, value] of formData) {
                console.log(`${name}: ${value}`);
            }

            console.log('Fetching request for updating user data');

            window.showModalMsg('Личные данные', 'Личные данные изменены')
            blockUserDataForm()
        }
    })
}
// Update user data --- FINISH

window.addEventListener('load', () => {
    // Change user password
    initChangePassFormToggles()
    initChangePasswordForm()

    // Update user data
    initChangeUserDataForm()
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhY2NvdW50L3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDQlNC70Y8g0LLRgdC10YUg0YHRgtGA0LDQvdC40YYg0LrQsNCx0L3QtdGC0LAg0LTQvtCx0LDQstC70Y/QtdC8INC+0LTQuNC9INGE0LDQudC7INGB0LrRgNC/0YLQvtCyIC0gYWNjb3VudC5qc1xuXG4vLyBDaGFuZ2UgdXNlciBwYXNzd29yZCAtLS0gU1RBUlRcbmNvbnN0IGluaXRDaGFuZ2VQYXNzRm9ybVRvZ2dsZXMgPSAoKSA9PiB7XG4gICAgbGV0IGJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY2hhbmdlUGFzc3dvcmRGb3JtIC5hY2NvdW50X19mb3JtLXRvZ2dsZS1wYXNzJylcbiAgICBidG5zID0gQXJyYXkuZnJvbShidG5zKVxuXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcblxuICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBpbnB1dC50eXBlID0gJ3Bhc3N3b3JkJ1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdwYXNzLXZpc2libGUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXQudHlwZSA9ICd0ZXh0J1xuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdwYXNzLXZpc2libGUnKVxuICAgICAgICB9XG4gICAgfSkpXG59XG5cbmNvbnN0IGJsb2NrQ2hhbmdlUGFzc0Zvcm0gPSAoKSA9PiB7XG4gICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGFuZ2VQYXNzd29yZEZvcm0gLmFjY291bnRfX2Zvcm0tYnV0dG9uIGJ1dHRvbicpXG4gICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiBidXR0b24uZGlzYWJsZWQgPSBmYWxzZSwgNTAwMClcbn1cblxuY29uc3QgY2hhbmdlUGFzc3dvcmRGb3JtRGF0YSA9IHtcbiAgICBjdXJyZW50TGVuZ3RoOiB0cnVlLFxuICAgIG5ld0xlbmd0aDogdHJ1ZSxcbiAgICBpc0VxdWFsOiB0cnVlXG59XG5cbmNvbnN0IHJlc2V0QWxsRXJyb3JzUGFzc3dvcmRGb3JtID0gKCkgPT4ge1xuICAgIGxldCBjb250cm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjaGFuZ2VQYXNzd29yZEZvcm0gLmFjY291bnRfX2Zvcm0tY29udHJvbGxlcicpXG4gICAgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGNvbnRyb2xsZXJzKVxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJykpXG59XG5cbmNvbnN0IGNoZWNrUGFzc0xlbmd0aCA9ICh2YWx1ZSkgPT4ge1xuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPj0gOFxufVxuXG5jb25zdCBhZGRJbnB1dFBhc3NIYW5kbGVyID0gKGlucHV0KSA9PiB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0LmNsb3Nlc3QoJy5hY2NvdW50X19mb3JtLWNvbnRyb2xsZXInKVxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJylcbiAgICB9KVxufVxuXG5jb25zdCBjaGVja0NoYW5nZVBhc3NGb3JtID0gKGN1cnJlbnRJbnB1dCwgbmV3SW5wdXQpID0+IHtcbiAgICBjb25zdCBpc0Zvcm1WYWxpZCA9IGNoYW5nZVBhc3N3b3JkRm9ybURhdGEuY3VycmVudExlbmd0aFxuICAgICAgICAmJiBjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLm5ld0xlbmd0aFxuICAgICAgICAmJiBjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLmlzRXF1YWxcblxuICAgIGNvbnN0IGNvbnRyb2xsZXJDdXJyZW50ID0gY3VycmVudElucHV0LmNsb3Nlc3QoJy5hY2NvdW50X19mb3JtLWNvbnRyb2xsZXInKVxuICAgIGNvbnN0IGN1cnJlbnRFcnJvciA9IGNvbnRyb2xsZXJDdXJyZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvdW50X19mb3JtLWVycm9yJylcblxuICAgIGNvbnN0IGNvbnRyb2xsZXJOZXcgPSBuZXdJbnB1dC5jbG9zZXN0KCcuYWNjb3VudF9fZm9ybS1jb250cm9sbGVyJylcbiAgICBjb25zdCBuZXdFcnJvciA9IGNvbnRyb2xsZXJOZXcucXVlcnlTZWxlY3RvcignLmFjY291bnRfX2Zvcm0tZXJyb3InKVxuXG4gICAgaWYgKCFjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLmN1cnJlbnRMZW5ndGgpIHtcbiAgICAgICAgY3VycmVudEVycm9yLmlubmVyVGV4dCA9ICfQn9Cw0YDQvtC70Ywg0LTQvtC70LbQtdC9INGB0L7QtNC10YDQttCw0YLRjCDQvNC40L3QuNC80YPQvCA4INGB0LjQvNCy0L7Qu9C+0LInXG4gICAgICAgIGNvbnRyb2xsZXJDdXJyZW50LmNsYXNzTGlzdC5hZGQoJ2hhcy1lcnJvcicpXG4gICAgfVxuXG4gICAgaWYgKCFjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLm5ld0xlbmd0aCkge1xuICAgICAgICBuZXdFcnJvci5pbm5lclRleHQgPSAn0J/QsNGA0L7Qu9GMINC00L7Qu9C20LXQvSDRgdC+0LTQtdGA0LbQsNGC0Ywg0LzQuNC90LjQvNGD0LwgOCDRgdC40LzQstC+0LvQvtCyJ1xuICAgICAgICBjb250cm9sbGVyTmV3LmNsYXNzTGlzdC5hZGQoJ2hhcy1lcnJvcicpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIWNoYW5nZVBhc3N3b3JkRm9ybURhdGEuaXNFcXVhbCkge1xuICAgICAgICAgICAgbmV3RXJyb3IuaW5uZXJUZXh0ID0gJ9Cf0LDRgNC+0LvQuCDQtNC+0LvQttC90Ysg0YHQvtCy0L/QsNC00LDRgtGMJ1xuICAgICAgICAgICAgY29udHJvbGxlck5ldy5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhbmdlUGFzc3dvcmRGb3JtRGF0YS5jdXJyZW50TGVuZ3RoID0gdHJ1ZVxuICAgIGNoYW5nZVBhc3N3b3JkRm9ybURhdGEubmV3TGVuZ3RoID0gdHJ1ZVxuICAgIGNoYW5nZVBhc3N3b3JkRm9ybURhdGEuaXNFcXVhbCA9IHRydWVcblxuICAgIHJldHVybiBpc0Zvcm1WYWxpZFxufVxuXG5jb25zdCBpbml0Q2hhbmdlUGFzc3dvcmRGb3JtID0gKCkgPT4ge1xuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhbmdlUGFzc3dvcmRGb3JtJylcblxuICAgIGlmICghZm9ybSkgcmV0dXJuXG5cbiAgICBjb25zdCBjdXJyZW50UGFzcyA9IGZvcm0ucXVlcnlTZWxlY3RvcignI2N1cnJlbnRQYXNzJylcbiAgICBjb25zdCBuZXdQYXNzID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcjbmV3UGFzcycpXG5cbiAgICAvLyBIYW5kbGVyc1xuICAgIGFkZElucHV0UGFzc0hhbmRsZXIoY3VycmVudFBhc3MpXG4gICAgYWRkSW5wdXRQYXNzSGFuZGxlcihuZXdQYXNzKVxuXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgLy8gQ2hlY2sgdmFsdWUgbGVuZ3RoXG4gICAgICAgIGNoYW5nZVBhc3N3b3JkRm9ybURhdGEuY3VycmVudExlbmd0aCA9IGNoZWNrUGFzc0xlbmd0aChjdXJyZW50UGFzcy52YWx1ZSlcbiAgICAgICAgY2hhbmdlUGFzc3dvcmRGb3JtRGF0YS5uZXdMZW5ndGg9IGNoZWNrUGFzc0xlbmd0aChuZXdQYXNzLnZhbHVlKVxuICAgICAgICBjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLmlzRXF1YWwgPSBjdXJyZW50UGFzcy52YWx1ZSA9PT0gbmV3UGFzcy52YWx1ZVxuXG4gICAgICAgIC8vIENoZWNrIGZvcm1cbiAgICAgICAgaWYgKGNoZWNrQ2hhbmdlUGFzc0Zvcm0oY3VycmVudFBhc3MsIG5ld1Bhc3MpKSB7XG4gICAgICAgICAgICByZXNldEFsbEVycm9yc1Bhc3N3b3JkRm9ybSgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgcmVxdWVzdCBmb3IgdXBkYXRpbmcgdXNlciBwYXNzd29yZCcpO1xuXG4gICAgICAgICAgICB3aW5kb3cuc2hvd01vZGFsTXNnKCfQmNC30LzQtdC90LXQvdC40LUg0L/QsNGA0L7Qu9GPJywgJ9Cf0LDRgNC+0LvRjCDQsdGL0Lsg0YPRgdC/0LXRiNC90L4g0LjQt9C80LXQvdC10L0nKVxuICAgICAgICAgICAgYmxvY2tDaGFuZ2VQYXNzRm9ybSgpXG4gICAgICAgIH1cbiAgICB9KVxufVxuLy8gQ2hhbmdlIHVzZXIgcGFzc3dvcmQgLS0tIEZJTklTSFxuXG4vLyBVcGRhdGUgdXNlciBkYXRhIC0tLSBTVEFSVFxuY29uc3Qgc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlciA9IChpbnB1dE5vZGUsIGVycm9yVGV4dCkgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5jbG9zZXN0KCcuYWNjb3VudF9fZm9ybS1jb250cm9sbGVyJylcbiAgICBjb25zdCBtZXNzYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvdW50X19mb3JtLWVycm9yJylcblxuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxuICAgIG1lc3NhZ2UuaW5uZXJUZXh0ID0gZXJyb3JUZXh0XG5cbiAgICBpbnB1dE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxuICAgIH0pXG59XG5cbmNvbnN0IHJlc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlciA9IChpbnB1dE5vZGUpID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUuY2xvc2VzdCgnLmFjY291bnRfX2Zvcm0tY29udHJvbGxlcicpXG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXG59XG5cbmNvbnN0IGJsb2NrVXNlckRhdGFGb3JtID0gKCkgPT4ge1xuICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhbmdlVXNlckRhdGFGb3JtIC5hY2NvdW50X19mb3JtLWJ1dHRvbiBidXR0b24nKVxuICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcblxuICAgIHNldFRpbWVvdXQoKCkgPT4gYnV0dG9uLmRpc2FibGVkID0gZmFsc2UsIDUwMDApXG59XG5cbmNvbnN0IGluaXRDaGFuZ2VVc2VyRGF0YUZvcm0gPSAoKSA9PiB7XG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFuZ2VVc2VyRGF0YUZvcm0nKVxuXG4gICAgaWYgKCFmb3JtKSByZXR1cm5cblxuICAgIGNvbnN0IGZvcm1WYWxpZCA9IHtuYW1lOiB0cnVlLCBwaG9uZTogdHJ1ZSwgZW1haWw6IHRydWV9XG4gICAgXG4gICAgXG4gICAgXG4gICAgXG4gICAgLy8gY29uc3QgcGhvbmVOdW1iZXIgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGhvbmVcIl0nKVxuXG4gICAgLy8gLy8gUGhvbmUgbWFza2luZ1xuICAgIC8vIGNvbnN0IHBob25lTWFza09wdGlvbnMgPSB7XG4gICAgLy8gICAgIG1hc2s6ICcrezd9ICgwMDApIDAwMC0wMC0wMCcsXG4gICAgLy8gICAgIGxhenk6IHRydWUsXG4gICAgLy8gICAgIHBsYWNlaG9sZGVyQ2hhcjogJyMnXG4gICAgLy8gfVxuICAgIC8vIGNvbnN0IHBob25lTWFzayA9IElNYXNrKFxuICAgIC8vICAgICBwaG9uZU51bWJlcixcbiAgICAvLyAgICAgcGhvbmVNYXNrT3B0aW9uc1xuICAgIC8vIClcblxuICAgIC8vIHBob25lTnVtYmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IGZhbHNlfSkpXG4gICAgLy8gcGhvbmVOdW1iZXIuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiB0cnVlfSkpXG5cblxuXG5cblxuXG5cbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBjb25zdCBuYW1lICA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJuYW1lXCJdJylcbiAgICAgICAgY29uc3QgcGhvbmUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGhvbmVcIl0nKVxuICAgICAgICBjb25zdCBlbWFpbCA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJlbWFpbFwiXScpXG5cbiAgICAgICAgLy8gQ2hlY2sgbmFtZVxuICAgICAgICBpZiAobmFtZS52YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHNldEVycm9yT25Vc2VyRGF0YUNvbnRyb2xsZXIobmFtZSwgJ9CX0LDQv9C+0LvQvdC40YLQtSDQv9C+0LvQtSDQpNCY0J4nKVxuICAgICAgICAgICAgZm9ybVZhbGlkLm5hbWUgPSBmYWxzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzZXRFcnJvck9uVXNlckRhdGFDb250cm9sbGVyKG5hbWUpXG4gICAgICAgICAgICBmb3JtVmFsaWQubmFtZSA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIHBob25lXG4gICAgICAgIGlmIChwaG9uZS52YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHNldEVycm9yT25Vc2VyRGF0YUNvbnRyb2xsZXIocGhvbmUsICfQl9Cw0L/QvtC70L3QuNGC0LUg0L/QvtC70LUg0KLQtdC70LXRhNC+0L0nKVxuICAgICAgICAgICAgZm9ybVZhbGlkLnBob25lID0gZmFsc2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cudmFsaWRhdGVQaG9uZSh3aW5kb3cuY2xlYXJQaG9uZShwaG9uZS52YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvck9uVXNlckRhdGFDb250cm9sbGVyKHBob25lKVxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5waG9uZSA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlcihwaG9uZSwgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQvdC+0LzQtdGAINGC0LXQu9C10YTQvtC90LAnKVxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5waG9uZSA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBlbWFpbFxuICAgICAgICBpZiAoZW1haWwudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlRW1haWwoZW1haWwudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvck9uVXNlckRhdGFDb250cm9sbGVyKGVtYWlsKVxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlcihlbWFpbCwgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiycpXG4gICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlcihlbWFpbClcbiAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlbmdpbmcgZm9ybSBkYXRhXG4gICAgICAgIGlmIChmb3JtVmFsaWQubmFtZSAmJiBmb3JtVmFsaWQucGhvbmUgJiYgZm9ybVZhbGlkLmVtYWlsKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xuXG4gICAgICAgICAgICAvLyDQntCx0Y/Qt9Cw0YLQtdC70YzQvdC+INGD0LTQsNC70LjRgtGMINC/0L7RgdC70LUg0LLQvdC10LTRgNC10L3QuNGPXG4gICAgICAgICAgICBmb3IgKGxldCBbbmFtZSwgdmFsdWVdIG9mIGZvcm1EYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7bmFtZX06ICR7dmFsdWV9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyByZXF1ZXN0IGZvciB1cGRhdGluZyB1c2VyIGRhdGEnKTtcblxuICAgICAgICAgICAgd2luZG93LnNob3dNb2RhbE1zZygn0JvQuNGH0L3Ri9C1INC00LDQvdC90YvQtScsICfQm9C40YfQvdGL0LUg0LTQsNC90L3Ri9C1INC40LfQvNC10L3QtdC90YsnKVxuICAgICAgICAgICAgYmxvY2tVc2VyRGF0YUZvcm0oKVxuICAgICAgICB9XG4gICAgfSlcbn1cbi8vIFVwZGF0ZSB1c2VyIGRhdGEgLS0tIEZJTklTSFxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAvLyBDaGFuZ2UgdXNlciBwYXNzd29yZFxuICAgIGluaXRDaGFuZ2VQYXNzRm9ybVRvZ2dsZXMoKVxuICAgIGluaXRDaGFuZ2VQYXNzd29yZEZvcm0oKVxuXG4gICAgLy8gVXBkYXRlIHVzZXIgZGF0YVxuICAgIGluaXRDaGFuZ2VVc2VyRGF0YUZvcm0oKVxufSkiXSwiZmlsZSI6ImFjY291bnQuanMifQ==
