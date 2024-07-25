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

window.debounce = (func, ms) => {
    let timeoutId

    return function() {
        const context = this
        const args = arguments

        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            func.apply(context, args)
        }, ms)
    }
}

/**
 * Downloads a file from the specified URL and triggers a download in the browser.
 * 
 * @param {string} url - The URL of the file to be downloaded.
 */
window.downloadFile = (url, filename=null, defaultExtension = 'bin')  => {
    if (url === undefined || url === null || url === "") {
        return;
    }
    // Показать спиннер
    if (window.spinner && typeof window.spinner.show === "function") {
        window.spinner.show();
    }

    // Создаем новый XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    // Обработчик завершения загрузки
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Попытка получить расширение из заголовков
            let extension = defaultExtension;
            const contentDisposition = xhr.getResponseHeader("Content-Disposition");
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?((.*)\.(.*))"?/);
                if (match && match[1]) {
                    if (!filename) {
                        filename = match[2];
                    }
                    extension = match[3];
                }
            }

            // Создаем URL для загруженного файла
            const blobUrl = URL.createObjectURL(xhr.response);

            // Создаем временный элемент <a> для скачивания файла
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `${filename}.${extension}`; // Устанавливаем имя файла с расширением

            // Добавляем элемент в DOM и инициируем скачивание
            document.body.appendChild(a);
            a.click();

            // Удаляем элемент из DOM
            document.body.removeChild(a);

            // Освобождаем URL объекта
            URL.revokeObjectURL(blobUrl);
        }

        // Скрыть спиннер
        if (window.spinner && typeof window.spinner.hide === "function") {
            window.spinner.hide();
        }
    };

    // Обработчик ошибок
    xhr.onerror = function() {
        console.error("Ошибка при загрузке файла");

        // Скрыть спиннер в случае ошибки
        if (window.spinner && typeof window.spinner.hide === "function") {
            window.spinner.hide();
        }
    };

    // Отправляем запрос
    xhr.send();
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

/**
 * безопасный вызов функции
 * @param fn function
 * @param {(*|*)[][]} args
 */
window.safeCall = function(fn, ...args) {
  try {
    fn.call(this || window, ...args);
  } catch (e) {
    console.warn("[Safe Call]: ", fn, e);
  }
};
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
    const currentFavoritesCount = parseInt(headerFavorites.innerText)

    if (!isSelected) {
        _this.classList.add('selected')
        headerFavorites.innerText = currentFavoritesCount + 1
        headerFavorites.classList.add('selected')
        setTimeout(() => headerFavorites.classList.remove('selected'), 1000)

        showModalMsg(title, message)

        console.error('Здесь надо будет написать асинхронный запрос добавления товара в избранные');
        return
    }

    _this.classList.remove('selected')
    headerFavorites.innerText = currentFavoritesCount - 1
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

window.addEventListener('load', initCardsTab)

// Filters
const showNoFilterMsg = () => {
  try {


    const msg = document.querySelector(".description__msg");

    if (!msg) return;
    msg.classList.add("display");
    setTimeout(() => msg.classList.add("visible"), 100);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideNoFilterMsg = () => {
  try {
    const msg = document.querySelector(".description__msg");

    if (!msg) return;

    msg.classList.remove("visible");
    msg.classList.remove("display");
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkNoFilterMsg = () => {
  try {
    const items = document
      .querySelectorAll("[data-filter]:not(.hide)");

    items.length === 0
      ? showNoFilterMsg()
      : hideNoFilterMsg();
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideFilterList = (filterList) => {
  try {
    filterList.forEach(filter => {
      filter.classList.remove("dropped");
      setTimeout(() => filter.classList.remove("active"), 300);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const showFilterDrop = (node) => {
  try {
    node.classList.add("active");
    setTimeout(() => node.classList.add("dropped"), 10);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideFilterDrop = (node) => {
  try {
    const filters = Array.from(document.querySelectorAll(".filters__item"));

    if (!node) {
      hideFilterList(filters);
      return;
    }
    const cleanedFilters = filters.filter(filter => filter !== node);
    hideFilterList(cleanedFilters);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFiltersDrop = () => {
  try {
    const fitlers = Array.from(document
      .querySelectorAll(".filters__list .filters__item"));

    fitlers.forEach(filter => {
      filter.addEventListener("click", function() {
        const isActive = this.classList.contains("active");

        if (isActive) {
          hideFilterDrop();
          return;
        }

        hideFilterDrop(this);
        showFilterDrop(this);
      });
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFiltersReset = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const reset = document.querySelector(".filters__reset .filters__item");

    if (!reset) return;

    const filteredSection = document
      .querySelectorAll(".section_filtered");

    reset.addEventListener("click", function() {
      const container = this.closest(".filters");

      const siblingFilters = container
        .querySelectorAll(".filters__list .filters__item");

      const options = Array.from(document
        .querySelectorAll(".filters__options"));

      const controllers = Array.from(document
        .querySelectorAll(".filters input[type=\"radio\"]:not([value=\"reset\"])"));

      const cards = Array.from(document.querySelectorAll("[data-filter]"));

      const deletedTypes = JSON.parse(document
        .querySelector("[data-deleted-types]")
        .dataset.deletedTypes);

      hideFilterList(siblingFilters);
      spinner.show();
      filteredSection.forEach(el => el.classList.add("filtering"));
      options.forEach(el => el.classList.remove("checked")); // hide rset option button
      controllers.forEach(controller => controller.checked = false); // reset all input controllers
      resetAllControllersInItems();
      reset.closest(".filters__reset").classList.add("disabled");

      setTimeout(() => {
        // show hidden cards as delete data-display attributes
        cards.forEach(card => {
          for (const type of deletedTypes) {
            card.removeAttribute(`data-display-${type}`);
            card.classList.remove("hide");
          }
        });

        checkFilteredSection();
      }, 1000);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkFilteredSection = () => {
  try {
    const sections = Array.from(document.querySelectorAll(".section_filtered"));

    sections.forEach(section => {
      const filteredItems = Array.from(section.querySelectorAll("[data-filter]"));
      const shownItems = filteredItems.filter(i => !i.classList.contains("hide"));

      if (shownItems.length === 0) {
        section.classList.add("hide");
      } else {
        section.classList.remove("hide");
      }
    });

    spinner.hide();
    sections.forEach(el => el.classList.remove("filtering"));

    showAnimElements();
    setAnimationElms();
    checkNoFilterMsg();
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hasDataDisplayAttribute = (node) => {
  try {
    const attributes = node.attributes;

    let hasDataDisplayAttribute = false;

    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributes[i].name;

      if (attributeName.startsWith("data-display")) {
        hasDataDisplayAttribute = true;
        break;
      }
    }

    return hasDataDisplayAttribute;
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkFilteredItem = (prop, val) => {
  try {
    const items = Array.from(document.querySelectorAll("[data-filter]"));

    setTimeout(() => {
      items.forEach(i => {
        const data = JSON.parse(i.dataset.filter);
        const isArray = Array.isArray(data[prop]);

        const isMatched = isArray
          ? data[prop].includes(val)
          : data[prop] === val;


        if (isMatched) {
          i.removeAttribute(`data-display-${prop}`);
          if (!hasDataDisplayAttribute(i)) i.classList.remove("hide");
        } else {
          i.classList.add("hide");
          i.setAttribute(`data-display-${prop}`, false);
        }

        checkFilteredSection();
      });
    }, 1000);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const activeColorInItem = (val) => {
  try {
    const items = Array.from(document
      .querySelectorAll(`[data-target-type="${val}"]`));

    items.forEach(i => i.click());
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFilterSelect = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const controllers = Array.from(document
      .querySelectorAll(".filters input[type=\"radio\"]:not([value=\"reset\"])"));

    const filteredSection = document.querySelectorAll(".section_filtered");

    const resetBtn = document.querySelector(".filters__reset");

    controllers.forEach(el => el.addEventListener("change", function(e) {
      e.preventDefault();
      e.stopPropagation();

      filteredSection.forEach(el => el.classList.add("filtering"));
      spinner.show();
      checkFilteredItem(this.name, this.value);
      activeColorInItem(this.value);
      this.closest(".filters__options").classList.add("checked");
      resetBtn.classList.remove("disabled");
    }));
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const removeDataFilterAttribute = (prop) => {
  try {
    const items = Array.from(document
      .querySelectorAll(`[data-display-${prop}]`));

    items.forEach(i => {
      i.removeAttribute(`data-display-${prop}`);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkAllItemsHasDisplayAttributes = () => {
  try {
    const items = Array.from(document
      .querySelectorAll("[data-filter]"));

    items.forEach(i => {
      if (!hasDataDisplayAttribute(i)) {
        i.classList.remove("hide");
      }
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const resetAllControllersByName = (name) => {
  try {
    const items = Array.from(document.querySelectorAll(`[name=${name}]`));
    items.forEach(i => i.checked = false);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const resetAllControllersInItems = () => {
  try {
    const tabLists = Array.from(document
      .querySelectorAll(".cards-series__controls"));

    tabLists.forEach(list => {
      list.querySelector(".cards-series__tab")?.click();
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkAllFilterResetBtn = () => {
  try {
    const isCheckedFilter = document
      .querySelectorAll(".filters__list input:checked");

    const reset = document.querySelector(".filters__reset");

    isCheckedFilter.length === 0
      ? reset.classList.add("disabled")
      : reset.classList.remove("disabled");
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initResetFilterProp = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const controllers = Array.from(document
      .querySelectorAll(".filters input[value=\"reset\"]"));
    const sections = document.querySelectorAll(".section_filtered");

    controllers.forEach(el => el.addEventListener("change", function(e) {
      e.preventDefault();
      e.stopPropagation();

      sections.forEach(el => el.classList.add("filtering"));
      spinner.show();
      this.closest(".filters__options").classList.remove("checked");

      setTimeout(() => {
        removeDataFilterAttribute(this.name);
        checkAllItemsHasDisplayAttributes();
        checkFilteredSection();
        resetAllControllersByName(this.name);
        resetAllControllersInItems();
        checkAllFilterResetBtn();
      }, 1000);
    }));
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

window.addEventListener("load", () => {
  try {
    initFiltersDrop();
    initFiltersReset();
    initFilterSelect();
    initResetFilterProp();
  } catch (e) {
    console.warn("вёрстка", e);
  }
});
window.initInformers = () => {
    const informer = document.getElementById('informer')

    if (!informer) {
        console.warn('На странице отсутствует html обертка для Информера');
        return false
    }

    const informerBody = informer.querySelector('.informer__body')
    const informerBack = informer.querySelector('.informer__back')
    const informerClose = informer.querySelector('.informer__close')
    const btns = Array.from(document.querySelectorAll('span[data-term]'))

    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            getInformation(btn.dataset.term)
        })
    })

    const getInformation = async (term) => {
        window.spinner.show()

        const formData = new FormData()
        formData.append('term', term)

        const res = DEV_MODE
            ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/inform.html')
            : await fetch("/api/term", { method: "POST", body: formData })

        if (res.ok) {
            const html = await res.text()
            updateInformerContent(html)
        } else {
            console.warn('Не удалось получить информацию для Термина', term)
            setTimeout(window.spinner.hide, 300)
        }
    }

    const updateInformerContent = (data) => {
        const informerContent = informer.querySelector('.informer__content')

        while (informerContent.firstChild) {
            informerContent.removeChild(informerContent.firstChild)
        }

        informerContent.innerHTML = data
        showInformer()
        setTimeout(window.spinner.hide, 300)
    }

    const showInformer = () => {
        informer.classList.add('visible')

        setTimeout(() => {
            informerBack.classList.add('visible')
            informerBody.classList.add('visible')
        }, 100)
    }

    // Hide informer
    const hideInformer = () => {
        informerBack.classList.remove('visible')
        informerBody.classList.remove('visible')

        setTimeout(
            () => informer.classList.remove('visible'),
            500
        )
    }
    informerBack.addEventListener('click', hideInformer)
    informerClose.addEventListener('click', hideInformer)
}

window.addEventListener('load', window.initInformers)
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
    // const SEARCH_REQUEST_URL = 'https://technolight.lightopt.ru/api/product/search'
    const THROTTLE_TIMEOUT = 300
    let searchRequestTimeoutId

    const setStrongText = (str, query) => {
        const regex = new RegExp(query, 'gi')
        return str.replace(regex, `<strong>$&</strong>`)
    }

    const printQueryResult = (data, query) => {

        console.log('Получили поисковую выдачу', data);

        // Reset all children nodes of search hints
        while (searchHints.firstChild) {
            searchHints.removeChild(searchHints.firstChild)
        }

        // Set link, similar or No Result
        const links = document.createElement('div')
        links.classList.add('header__search-links')

        const similar = document.createElement('div')
        similar.classList.add('header__search-similar')

        if (data.length === 0) {
            // No results
            const span = document.createElement('span')
            span.classList.add('no-results')
            span.innerText = 'По Вашему запросу ничего не найдено'
            links.appendChild(span)
        } else {
            // Links
            const hint = data[0]
            const link = document.createElement('a')
            link.href = hint.url
            link.innerHTML = setStrongText(hint.title, query)
            links.appendChild(link)

            // Similar
            similar.innerHTML = '<h5>смотрите похожие</h5>'

            for (const num in data) {
                if (num < 1) continue

                // Link
                const hint = data[num]
                const link = document.createElement('a')
                link.href = hint.url

                // Image
                const picSpan = document.createElement('span')
                picSpan.classList.add('pic')

                const img = document.createElement('img')
                img.src = hint.image
                img.alt = hint.title
                picSpan.appendChild(img)

                // Text
                const textSpan = document.createElement('span')
                textSpan.classList.add('text')
                textSpan.innerHTML = setStrongText(hint.title, query)

                link.appendChild(picSpan)
                link.appendChild(textSpan)
                similar.appendChild(link)

                if (num > 6) break
            }
        }

        searchHints.appendChild(links)
        searchHints.classList.add('visible')

        if (data.length > 1) {
            searchHints.appendChild(similar)
        }

        // Нужно только для полного меню
        // setHandlerToHelpers()

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
            printQueryResult(data, query)

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

        const isTachDevice = window.innerWidth < 992

        if (!isTachDevice && !isSearchPanel && !isSearchToggle) {
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
const setCartUpdateListener = () => {
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

window.addEventListener('load', setCartUpdateListener)

// Open and close subLists
const toggleSubNavLists = () => {
    const togglers = Array.from(document
        .querySelectorAll('.header__nav-inner-toggle'))

    const closeAllTogglers = () => {
        togglers.forEach(el => {
            const wrap = el.closest('.header__nav-inner-caption')
            wrap.classList.remove('dropped')

            const collapse = wrap.querySelector('.header__nav-sublist-collapse')
            collapse.classList.remove('open')

            el.classList.remove('active')
        })
    }

    togglers.forEach(el => el.addEventListener('click', () => {
        const wrap = el.closest('.header__nav-inner-caption')
        const collapse = wrap.querySelector('.header__nav-sublist-collapse')
        const isCurrentDropped = wrap.classList.contains('dropped')

        // closeAllTogglers()

        // Toggle current
        if (!isCurrentDropped) {
            wrap.classList.add('dropped')
            el.classList.add('active')
            collapse.classList.add('open')
        } else {
            wrap.classList.remove('dropped')
            el.classList.remove('active')
            collapse.classList.remove('open')
        }
    }))

    // Close all subnav list on out click
    document.addEventListener('click', e => {
        const isTarget = e.target
            .classList
            .contains('header__nav-inner-toggle')

        if(!isTarget) closeAllTogglers()
    })
}

window.addEventListener('load', toggleSubNavLists)

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
    window.safeCall(addAnimationBlocker)

    blockAnimationTimer = setTimeout(() => {
        window.safeCall(removeAnimationBlocker)
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
        window.safeCall(showAnimElements)
        window.safeCall(setAnimationElms)
    }, 100)
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
    window.safeCall(initPhonesMask)
})

// Fixing chat-24 widget position -- START
let chat24IntervalId = null
let chat24TimeoutId = null
let chart24StyleNode = null
let chart24Node = null

const fixChat24WidgetPosition = () => {
    chart24Node = document.querySelector('chat-24')

    if (!chart24Node) return

    if (window.innerWidth < 1024 && !chart24StyleNode) {
        chart24StyleNode = document.createElement('style')

        chart24StyleNode.innerHTML = `
            .startBtn.startBtn--outside.startBtn--bottom {
                bottom: 67px;
            }
            .startBtn.startBtn--open {
                transform: translateY(50%) scale(0.6) !important;
            }
        `;

        chart24Node.shadowRoot.prepend(chart24StyleNode)
    }

    if (window.innerWidth >= 1024 && chart24StyleNode !== null) {
        console.log('chart24StyleNode', chart24StyleNode);
        chart24StyleNode.remove()
        chart24StyleNode = null
    }

    clearInterval(chat24IntervalId)
    chat24IntervalId = null

    clearTimeout(chat24TimeoutId)
    chat24TimeoutId = null
}

const chat24RenderListener = () => {
    chat24IntervalId = setInterval(fixChat24WidgetPosition, 100)
}

const hardRemoveChat24RenderListener = () => {
    chat24TimeoutId = setTimeout(() => {
        if (chat24IntervalId) clearInterval(chat24IntervalId)
    }, 10000)
}

window.addEventListener('load', () => {
    window.safeCall(chat24RenderListener);
    window.safeCall(hardRemoveChat24RenderListener);
})

window.addEventListener('resize', () => {
    if (window.innerWidth < 1024) {
        window.safeCall(chat24RenderListener)
        return
    }

    if (chart24StyleNode) chart24StyleNode.remove()
})
// Fixing chat-24 widget position -- FINISH
/**
 * Флаг, указывающий на режим разработки.
 * @type {boolean}
 *
 * Для сервера верстки собирать и пушить в режиме DEV_MODE = true
 * На прод и дев собирать и пушить в режиме DEV_MODE = false
 *
 * В режиме DEV_MODE = true, при локальной разработке,
 * также необходимо править путь до файла main.js
 *
 * Прим.: <script src="http://localhost:номер_пота/js/main.js" defer></script>
 */
const DEV_MODE = window.MODE === 'dev' // dev - true, build - false

// Init cart custom Event
const cartEvent = new CustomEvent('cartUpdateEvent', {
    detail: {
        message: 'Fired cart product updated custom Event!'
    },
    bubbles: false,
    cancelable: false
})

const normalizeResponseCartData = (data) => {
    const products = []

    if (data.dots) {
        data.dots.forEach(dot => {
            products.push({ article: dot.id, count: dot.count })
        });
    }

    if (data.products) {
        data.products.forEach(product => {
            products.push({ article: product.article, count: product.count })
        });
    }

    return products
}

// Methods to work with cart for PRODUCTS
window.setProductToCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    console.log('Размещаем фиксированное количество товара в корзине:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-set.json')
        : await fetch('/ajax/cart/set', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Разместили товар в корзине. Получили ответ', data)

        return data

    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        console.error('Ошибка размещения товара в Корзине! Код ошибки:', res.status)
    }
}

window.addProductToCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    console.log('Добавление товара в корзину:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-add.json')
        : await fetch('/ajax/cart/add', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Добавили товар в корзину. Получили данные', data)
        return data
    } else {
        console.error('Ошибка добавления товара в Корзину! Код ошибки:', res.status)
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
    }
}

window.removeProductFromCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    console.log('Удаление товара из корзины:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-del.json')
        : await fetch('/ajax/cart/del', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Удалили товар из корзины. Получили данные', data);
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        console.error('Ошибка удаления товара из Корзины! Код ошибки:', res.status)
    }
}

// Methods to work with cart for DOTS
window.setDotToCart = async ({id, count}) => {
    window.safeCall(window.spinner.show)

    console.log('Размещаем фиксированное количество Дотов в корзине:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-setDot.json')
        : await fetch('/ajax/cart/set', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Разместили Доты в корзине. Получили ответ', data);

    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        console.error('Ошибка размещения Дотов в Корзине! Код ошибки:', res.status)
    }
}

window.addDotToCart = async (order) => {
    window.safeCall(window.spinner.show)

    console.log('Добавление дота в корзину. Отправляем данные:', order)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-addDot.json')
        : await fetch('/ajax/cart/addDot', { method: 'POST', body: JSON.stringify(order) })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]
        window.showModalMsg("Добавили Дот в корзину. Получили данные", data)

        return true
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        console.error('Ошибка добавления Дота в Корзину! Код ошибки:', res.status)
        return false
    }
}

window.removeDotFromCart = async ({id, count}) => {
    window.safeCall(window.spinner.show)

    console.log('Удаление Дота из корзины:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-delDot.json')
        : await fetch('/ajax/cart/delDot', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Удалили Dot из корзины. Получили данные', data);
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        console.error('Ошибка удаления Дота из Корзины! Код ошибки:', res.status)
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

        // Dispatching custom cart update Event
        const cartProductCountNode = document.querySelector('#cartProductCount')
        if (cartProductCountNode) cartProductCountNode.dispatchEvent(cartEvent)
    }

    return true
}

const initCart = async () => {
    if (!window.CART) {

        const res = DEV_MODE
            ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-get.json')
            : await fetch('/ajax/cart/get', { method: 'POST' })

        if (res.ok) {
            const data = await res.json()

            window.CART = new Proxy({
                products: [...normalizeResponseCartData(data)]
            }, {
                get: cartGet,
                set: cartSet
            })

            console.log('Инициализируем корзину -------------------------- START');
            console.log('Response data', data)
            console.log('window.CART', window.CART)
            console.log('Инициализируем корзину -------------------------- FINISH');

        } else {
            console.error('Ошибка запроса Корзины! Код ошибки:', res.status)
        }
    }
}

window.addEventListener('load', initCart)

window.cartUpdateInterval = setInterval(async () => {
    if (window.CART !== undefined && !DEV_MODE) {
        const res = DEV_MODE
            ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-get.json')
            : await fetch('/ajax/cart/get', { method: 'POST' })

        if (res.ok) {
            const data = await res.json()
            window.CART.products = [...normalizeResponseCartData(data)]
        }
    }
}, 5000)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJkZWJvdW5jZS5qcyIsImRvd25sb2FkRmlsZS5qcyIsImZvcm1hdE51bWJlci5qcyIsImdldFVybFBhcmFtZXRlckJ5TmFtZS5qcyIsInNhdmVDYWxsLmpzIiwic21vb3RoU2Nyb2xsVG8uanMiLCJ0aHJvdHRsZS5qcyIsInZhbGlkYXRlRW1haWwuanMiLCJ2YWxpZGF0ZVBob25lLmpzIiwiYWNjb3VudC1mb3Jtcy9zY3JpcHQuanMiLCJjYXJkcy1pdGVtL3NjcmlwdC5qcyIsImNhcmRzLXNlcmllcy9zY3JpcHQuanMiLCJmaWx0ZXJzL3NjcmlwdC5qcyIsImluZm9ybWVyL3Njcml0cC5qcyIsIm1vZGFscy9zY3JpcHQuanMiLCJwcm9kdWN0LWluZm8vc2NyaXB0LmpzIiwicmVjb21tZW5kYXRpb24vc2NyaXB0LmpzIiwic2Nyb2xsLXRvLXRvcC9zY3JpcHQuanMiLCJzaG93LW1vZGFsLW1zZy9zY3JpcHQuanMiLCJzcGlubmVyL3NjcmlwdC5qcyIsImZvb3Rlci9zY3JpcHQuanMiLCJoZWFkZXIvc2NyaXB0LmpzIiwibWFpbi5qcyIsImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdlhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ2xlYXIgcGhvbmUgb2Ygc3BhY2VzLCBicmFja2V0cyxcclxuICogZGFzaGVzIGFuZCBwbHVzIHNpZ24uIExlYXZlIG9ubHkgbnVtYmVycy5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHBob25lIC0gVGhlIHBob25lLCB0aGF0IG5lZWRzIHRvIGNsZWFyLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFBob25lIG51bWJlciBhcyBhIG51bWJlciB0eXBlLlxyXG4gKi9cclxud2luZG93LmNsZWFyUGhvbmUgPSAocGhvbmUpID0+IHtcclxuICAgIHJldHVybiBwYXJzZUludChwaG9uZS5yZXBsYWNlKC9cXEQvZywgXCJcIikpXHJcbn1cclxuIiwid2luZG93LmRlYm91bmNlID0gKGZ1bmMsIG1zKSA9PiB7XHJcbiAgICBsZXQgdGltZW91dElkXHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzXHJcbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50c1xyXG5cclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKVxyXG5cclxuICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxyXG4gICAgICAgIH0sIG1zKVxyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxuICogRG93bmxvYWRzIGEgZmlsZSBmcm9tIHRoZSBzcGVjaWZpZWQgVVJMIGFuZCB0cmlnZ2VycyBhIGRvd25sb2FkIGluIHRoZSBicm93c2VyLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgZmlsZSB0byBiZSBkb3dubG9hZGVkLlxuICovXG53aW5kb3cuZG93bmxvYWRGaWxlID0gKHVybCwgZmlsZW5hbWU9bnVsbCwgZGVmYXVsdEV4dGVuc2lvbiA9ICdiaW4nKSAgPT4ge1xuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwgfHwgdXJsID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8g0J/QvtC60LDQt9Cw0YLRjCDRgdC/0LjQvdC90LXRgFxuICAgIGlmICh3aW5kb3cuc3Bpbm5lciAmJiB0eXBlb2Ygd2luZG93LnNwaW5uZXIuc2hvdyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHdpbmRvdy5zcGlubmVyLnNob3coKTtcbiAgICB9XG5cbiAgICAvLyDQodC+0LfQtNCw0LXQvCDQvdC+0LLRi9C5IFhNTEh0dHBSZXF1ZXN0XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XG5cbiAgICAvLyDQntCx0YDQsNCx0L7RgtGH0LjQuiDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQt9Cw0LPRgNGD0LfQutC4XG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAvLyDQn9C+0L/Ri9GC0LrQsCDQv9C+0LvRg9GH0LjRgtGMINGA0LDRgdGI0LjRgNC10L3QuNC1INC40Lcg0LfQsNCz0L7Qu9C+0LLQutC+0LJcbiAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSBkZWZhdWx0RXh0ZW5zaW9uO1xuICAgICAgICAgICAgY29uc3QgY29udGVudERpc3Bvc2l0aW9uID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50RGlzcG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGNvbnRlbnREaXNwb3NpdGlvbi5tYXRjaCgvZmlsZW5hbWU9XCI/KCguKilcXC4oLiopKVwiPy8pO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaFsxXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IG1hdGNoWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0KHQvtC30LTQsNC10LwgVVJMINC00LvRjyDQt9Cw0LPRgNGD0LbQtdC90L3QvtCz0L4g0YTQsNC50LvQsFxuICAgICAgICAgICAgY29uc3QgYmxvYlVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoeGhyLnJlc3BvbnNlKTtcblxuICAgICAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0LLRgNC10LzQtdC90L3Ri9C5INGN0LvQtdC80LXQvdGCIDxhPiDQtNC70Y8g0YHQutCw0YfQuNCy0LDQvdC40Y8g0YTQsNC50LvQsFxuICAgICAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgYS5ocmVmID0gYmxvYlVybDtcbiAgICAgICAgICAgIGEuZG93bmxvYWQgPSBgJHtmaWxlbmFtZX0uJHtleHRlbnNpb259YDsgLy8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LjQvNGPINGE0LDQudC70LAg0YEg0YDQsNGB0YjQuNGA0LXQvdC40LXQvFxuXG4gICAgICAgICAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YIg0LIgRE9NINC4INC40L3QuNGG0LjQuNGA0YPQtdC8INGB0LrQsNGH0LjQstCw0L3QuNC1XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICAgICAgYS5jbGljaygpO1xuXG4gICAgICAgICAgICAvLyDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgiDQuNC3IERPTVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcblxuICAgICAgICAgICAgLy8g0J7RgdCy0L7QsdC+0LbQtNCw0LXQvCBVUkwg0L7QsdGK0LXQutGC0LBcbiAgICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoYmxvYlVybCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQodC60YDRi9GC0Ywg0YHQv9C40L3QvdC10YBcbiAgICAgICAgaWYgKHdpbmRvdy5zcGlubmVyICYmIHR5cGVvZiB3aW5kb3cuc3Bpbm5lci5oaWRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyDQntCx0YDQsNCx0L7RgtGH0LjQuiDQvtGI0LjQsdC+0LpcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwi0J7RiNC40LHQutCwINC/0YDQuCDQt9Cw0LPRgNGD0LfQutC1INGE0LDQudC70LBcIik7XG5cbiAgICAgICAgLy8g0KHQutGA0YvRgtGMINGB0L/QuNC90L3QtdGAINCyINGB0LvRg9GH0LDQtSDQvtGI0LjQsdC60LhcbiAgICAgICAgaWYgKHdpbmRvdy5zcGlubmVyICYmIHR5cGVvZiB3aW5kb3cuc3Bpbm5lci5oaWRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQt9Cw0L/RgNC+0YFcbiAgICB4aHIuc2VuZCgpO1xufSIsIi8qKlxyXG4gKiBGb3JtYXR0aW5nIG51bWJlciB0byB0aGUgbG9jYWwgdmFsdWVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXJ9IG51bWJlciAtIFZhbHVlIGZvciBmb3JtYXR0aW5nLlxyXG4gKi9cclxuXHJcbndpbmRvdy5mb3JtYXROdW1iZXIgPSAobnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KG51bWJlci50b1N0cmluZygpLnJlcGxhY2UoL1xccy9nLCBcIlwiKSlcclxuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiIFwiKTtcclxufVxyXG4iLCIvKipcclxuICogR2V0dGluZyBnZXQgcGFyYW1ldGVyIGZyb20gdGhlIHVybFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzZWFyY2ggcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3VybF0gLSBUaGUgVVJMIGFkZHJlc3MuIElmIHRoaXMgcGFyYW1ldGVyIGlzIG5vdCBwYXNzZWQsIHRoZW4gdGhlIHNlYXJjaCwgYnkgZGVmYXVsdCwgd2lsbCBvY2N1ciBpbiB0aGUgY3VycmVudCBVUkwuXHJcbiAqL1xyXG53aW5kb3cuZ2V0VXJsUGFyYW1ldGVyQnlOYW1lID0gZnVuY3Rpb24obmFtZSwgdXJsKSB7XHJcbiAgICBpZiAoIW5hbWUpIHJldHVyblxyXG5cclxuICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG5cclxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpXHJcblxyXG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLFxyXG4gICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcblxyXG4gICAgICAgIGlmICghcmVzdWx0cykgcmV0dXJuIG51bGxcclxuXHJcbiAgICBpZiAoIXJlc3VsdHNbMl0pIHJldHVybiAnJ1xyXG5cclxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKVxyXG59XHJcbiIsIi8qKlxuICog0LHQtdC30L7Qv9Cw0YHQvdGL0Lkg0LLRi9C30L7QsiDRhNGD0L3QutGG0LjQuFxuICogQHBhcmFtIGZuIGZ1bmN0aW9uXG4gKiBAcGFyYW0geygqfCopW11bXX0gYXJnc1xuICovXG53aW5kb3cuc2FmZUNhbGwgPSBmdW5jdGlvbihmbiwgLi4uYXJncykge1xuICB0cnkge1xuICAgIGZuLmNhbGwodGhpcyB8fCB3aW5kb3csIC4uLmFyZ3MpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwiW1NhZmUgQ2FsbF06IFwiLCBmbiwgZSk7XG4gIH1cbn07IiwiLyoqXHJcbiAqIFNtb290aGx5IHNjcm9sbHMgdGhlIHBhZ2UgdG8gdGhlIHNwZWNpZmllZCBwb3NpdGlvbi5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIC0gVGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0by5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj01MDBdIC0gVGhlIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxyXG4gKi9cclxuZnVuY3Rpb24gc21vb3RoU2Nyb2xsVG8ocG9zaXRpb24sIGR1cmF0aW9uID0gNTAwKSB7XHJcbiAgICBjb25zdCBzdGFydFBvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICBjb25zdCBkaXN0YW5jZSA9IHBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvblxyXG4gICAgbGV0IHN0YXJ0VGltZXN0YW1wID0gbnVsbFxyXG5cclxuICAgIGZ1bmN0aW9uIHN0ZXAodGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKCFzdGFydFRpbWVzdGFtcCkgc3RhcnRUaW1lc3RhbXAgPSB0aW1lc3RhbXBcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aW1lc3RhbXAgLSBzdGFydFRpbWVzdGFtcFxyXG4gICAgICAgIGNvbnN0IHNjcm9sbFkgPSBlYXNlSW5PdXRDdWJpYyhwcm9ncmVzcywgc3RhcnRQb3NpdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uKVxyXG5cclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsWSlcclxuXHJcbiAgICAgICAgaWYgKHByb2dyZXNzIDwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlYXNlSW5PdXRDdWJpYyh0LCBiLCBjLCBkKSB7XHJcbiAgICAgICAgdCAvPSBkXHJcbiAgICAgICAgdC0tXHJcbiAgICAgICAgcmV0dXJuIGMgKiAodCAqIHQgKiB0ICsgMSkgKyBiXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG59XHJcbiIsIndpbmRvdy50aHJvdHRsZSA9IChmdW5jLCBtcykgPT4ge1xyXG4gICAgbGV0IGlzVGhyb3R0bGVkID0gZmFsc2UsXHJcbiAgICAgICAgc2F2ZWRBcmdzLFxyXG4gICAgICAgIHNhdmVkVGhpc1xyXG5cclxuICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XHJcblxyXG4gICAgICAgIGlmIChpc1Rocm90dGxlZCkgeyAvLyAyXHJcbiAgICAgICAgICAgIHNhdmVkQXJncyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICBzYXZlZFRoaXMgPSB0aGlzXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpIC8vIDFcclxuXHJcbiAgICAgICAgaXNUaHJvdHRsZWQgPSB0cnVlXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlzVGhyb3R0bGVkID0gZmFsc2UgLy8gM1xyXG4gICAgICAgICAgICBpZiAoc2F2ZWRBcmdzKSB7XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGx5KHNhdmVkVGhpcywgc2F2ZWRBcmdzKVxyXG4gICAgICAgICAgICAgICAgc2F2ZWRBcmdzID0gc2F2ZWRUaGlzID0gbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgbXMpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXJcclxufSIsIi8qKlxyXG4gKiBFbWFpbCBhZGRyZXNzIHZlcmlmaWNhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwsIHRoYXQgbmVlZHMgdG8gdmFsaWRhdGluZy5cclxuICovXHJcbndpbmRvdy52YWxpZGF0ZUVtYWlsID0gKGVtYWlsKSA9PiB7XHJcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIGVtYWlsXHJcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bXlxcc0BdK0BbXlxcc0BdK1xcLlteXFxzQF0rJC9cclxuICAgIHJldHVybiBlbWFpbFJlZ2V4LnRlc3QoZW1haWwpXHJcbn1cclxuIiwiLyoqXHJcbiAqIFBob25lIG51bWJlciB2ZXJpZmljYXRpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHBob25lIC0gVGhlIHBob25lLCB0aGF0IG5lZWRzIHRvIHZhbGlkYXRpbmcuXHJcbiAqL1xyXG53aW5kb3cudmFsaWRhdGVQaG9uZSA9IChwaG9uZSkgPT4ge1xyXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBwaG9uZVxyXG4gICAgY29uc3QgcGhvbmVSZWdleCA9IC9eN1xcZHsxMH0kL1xyXG4gICAgcmV0dXJuIHBob25lUmVnZXgudGVzdChwaG9uZSlcclxufVxyXG4iLCJjb25zdCBpbml0VG9nZ2xlVmlzaWJsZUZvcm1QYXNzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvZ2dsZS12aXNpYmxlLXBhc3MnKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcbiAgICAgICAgY29uc3QgaXNUZXh0ID0gaW5wdXQudHlwZSA9PT0gJ3RleHQnXHJcblxyXG4gICAgICAgIGlucHV0LnR5cGUgPSBpc1RleHQgPyAncGFzc3dvcmQnIDogJ3RleHQnXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzLXZpc2libGUnKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbi8vIGNvbnN0IHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUpID0+IHtcclxuLy8gICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5jbG9zZXN0KCdsYWJlbCcpXHJcbi8vICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJylcclxuLy8gfVxyXG5cclxuLy8gY29uc3Qgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4vLyAgICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLmNsb3Nlc3QoJ2xhYmVsJylcclxuLy8gICAgIGNvbnN0IG1lc3NhZ2UgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmVycm9yLW1lc3NhZ2UnKVxyXG5cclxuLy8gICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxyXG4vLyAgICAgbWVzc2FnZS5pbm5lclRleHQgPSBlcnJvclRleHRcclxuXHJcbi8vICAgICBpbnB1dE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbi8vICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbi8vICAgICB9KVxyXG4vLyB9XHJcblxyXG4vLyBjb25zdCBpbml0QWNjb3VudEZvcm0gPSAoKSA9PiB7XHJcbi8vICAgICBjb25zdCBmb3JtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY291bnQtZm9ybV9fZm9ybScpKVxyXG4vLyAgICAgaWYgKGZvcm1zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4vLyAgICAgZm9ybXMuZm9yRWFjaChmb3JtID0+IGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4vLyAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuLy8gICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB7ZW1haWw6IHRydWUsIHBhc3M6IHRydWUsIH1cclxuLy8gICAgICAgICBjb25zdCBlbWFpbCA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJlbWFpbFwiXScpXHJcbi8vICAgICAgICAgY29uc3QgcGFzcyAgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFzc1wiXScpXHJcbi8vICAgICAgICAgY29uc3QgZm9ybVR5cGUgPSB0aGlzLmRhdGFzZXQuZm9ybVR5cGVcclxuXHJcbi8vICAgICAgICAgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsKVxyXG4vLyAgICAgICAgIGlmIChmb3JtVHlwZSAhPT0gJ3JlY292ZXJ5Jykge1xyXG4vLyAgICAgICAgICAgICByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIocGFzcylcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIC8vIENoZWNrIGVtYWlsXHJcbi8vICAgICAgICAgaWYgKGVtYWlsLnZhbHVlICE9PSAnJykge1xyXG4vLyAgICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlRW1haWwoZW1haWwudmFsdWUpKSB7XHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSB0cnVlXHJcbi8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSBmYWxzZVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbCwgJ9Cd0LXQvtCx0YXQvtC00LjQvNC+INGD0LrQsNC30LDRgtGMINCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXHJcbi8vICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IGZhbHNlXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAvLyBDaGVjayBwYXNzXHJcbi8vICAgICAgICAgaWYgKGZvcm1UeXBlICE9PSAncmVjb3ZlcnknKSB7XHJcbi8vICAgICAgICAgICAgIGlmIChwYXNzLnZhbHVlLmxlbmd0aCA8IDgpIHtcclxuLy8gICAgICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIocGFzcywgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9Cw0YDQvtC70YwuINCU0LvQuNC90L3QsCDQv9Cw0YDQvtC70Y8g0LTQvtC70LbQvdCwINCx0YvRgtGMINC90LUg0LzQtdC90LXQtSA4INGB0LjQvNCy0L7Qu9C+0LIhJylcclxuLy8gICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5wYXNzID0gZmFsc2VcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgLy8gU2VuZ2luZyBmb3JtIGRhdGFcclxuLy8gICAgICAgICBpZiAoZm9ybVZhbGlkLmVtYWlsICYmIGZvcm1WYWxpZC5wYXNzKSB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8g0J7QsdGP0LfQsNGC0LXQu9GM0L3QviDRg9C00LDQu9C40YLRjCDQv9C+0YHQu9C1INCy0L3QtdC00YDQtdC90LjRj1xyXG4vLyAgICAgICAgICAgICBmb3IgKGxldCBbbmFtZSwgdmFsdWVdIG9mIGZvcm1EYXRhKSB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfTogJHt2YWx1ZX1gKTtcclxuLy8gICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIHJlcXVlc3QgZm9yIHVwZGF0aW5nIHVzZXIgZGF0YScpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH0pKVxyXG4vLyB9XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIC8vIGluaXRBY2NvdW50Rm9ybSgpXHJcbiAgICBpbml0VG9nZ2xlVmlzaWJsZUZvcm1QYXNzKClcclxufSkiLCIvLyBBZGQgcHJvZHVjdCB0byBmYXZvcml0ZXNcclxuY29uc3QgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSBlLnRhcmdldFxyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IF90aGlzLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBfdGhpcy5kYXRhc2V0LnRpdGxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gX3RoaXMuZGF0YXNldC5tZXNzYWdlXHJcbiAgICBjb25zdCBoZWFkZXJGYXZvcml0ZXMgPSBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idXR0b25zLWxpbmtfZmF2b3JpdGVzIC5oZWFkZXJfX2J1dHRvbnMtY291bnQnKVxyXG4gICAgY29uc3QgY3VycmVudEZhdm9yaXRlc0NvdW50ID0gcGFyc2VJbnQoaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dClcclxuXHJcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHtcclxuICAgICAgICBfdGhpcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dCA9IGN1cnJlbnRGYXZvcml0ZXNDb3VudCArIDFcclxuICAgICAgICBoZWFkZXJGYXZvcml0ZXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gaGVhZGVyRmF2b3JpdGVzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0JfQtNC10YHRjCDQvdCw0LTQviDQsdGD0LTQtdGCINC90LDQv9C40YHQsNGC0Ywg0LDRgdC40L3RhdGA0L7QvdC90YvQuSDQt9Cw0L/RgNC+0YEg0LTQvtCx0LDQstC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINC40LfQsdGA0LDQvdC90YvQtScpO1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIF90aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgIGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQgPSBjdXJyZW50RmF2b3JpdGVzQ291bnQgLSAxXHJcbiAgICBjb25zb2xlLmVycm9yKCdBc3luYyBxdWVyeSB0byBERUxFVEUgc2VsZWN0ZWQgcHJvZHVjdCBmcm9tIEZhdm9yaXRlcycpO1xyXG59XHJcblxyXG5jb25zdCBpbml0QWRkVG9GYXZvcml0ZXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdC1pdGVtX19mYXZvcml0ZXMnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFRvRmF2b3JpdGVzQ2xpY2tIYW5kbGVyKSlcclxufVxyXG5cclxuLy8gQWRkIHByb2R1Y3QgdG8gY2FydFxyXG5jb25zdCBhZGRUb0NhcnRDbGlja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSBlLnRhcmdldFxyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IF90aGlzLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBfdGhpcy5kYXRhc2V0LnRpdGxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gX3RoaXMuZGF0YXNldC5tZXNzYWdlXHJcblxyXG4gICAgaWYgKCFpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgX3RoaXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICAgICAgLy8gUHVzaCBjdXJyZW50IHByb2R1Y3QgdG8gQ2FydCBHbG9iYWwgT2JqZWN0ICh3aW5kb3cuQ0FSVClcclxuICAgICAgICB3aW5kb3cuYWRkUHJvZHVjdFRvQ2FydCh7IGFydDogX3RoaXMuZGF0YXNldC5wcm9kdWN0SWQsIGNvdW50OiAxIH0pXHJcblxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIF90aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgJ9Cj0LTQsNC70LXQvSDQuNC3INC60L7RgNC30LjQvdGLJylcclxuXHJcbiAgICAvLyBSZW1vdmUgY3VycmVudCBwcm9kdWN0IGZyb20gQ2FydCBHbG9iYWwgT2JqZWN0ICh3aW5kb3cuQ0FSVClcclxuICAgIHdpbmRvdy5yZW1vdmVQcm9kdWN0RnJvbUNhcnQoeyBhcnQ6IF90aGlzLmRhdGFzZXQucHJvZHVjdElkLCBjb3VudDogMSB9KVxyXG59XHJcbmNvbnN0IGluaXRBZGRUb0NhcnQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdC1pdGVtX19jYXJ0JykpXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGJ0biA9PiBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRUb0NhcnRDbGlja0hhbmRsZXIpKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRBZGRUb0Zhdm9yaXRlcygpXHJcbiAgICBpbml0QWRkVG9DYXJ0KClcclxufSkiLCJcclxuY29uc3QgcmVzZXRBbGxDYXJkc1BpY3MgPSAobm9kZSkgPT4ge1xyXG4gICAgY29uc3QgcGljcyA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX19waWMnKSlcclxuICAgIHBpY3MuZm9yRWFjaChub2RlID0+IG5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsQ2FyZHNUYWJzID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IHRhYnMgPSBBcnJheS5mcm9tKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fdGFiJykpXHJcbiAgICB0YWJzLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG59XHJcblxyXG5jb25zdCBnZXRUYXJnZXRDYXJkc1BpYyA9IChub2RlLCBkYXRhVGFyZ2V0VHlwZVZhbCkgPT4ge1xyXG4gICAgcmV0dXJuIG5vZGUucXVlcnlTZWxlY3RvcihgW2RhdGEtdHlwZT0ke2RhdGFUYXJnZXRUeXBlVmFsfV1gKVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2FyZHNUYWIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0YWJBcnIgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3RhYicpKVxyXG5cclxuICAgIHRhYkFyci5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuY2xvc2VzdCgnLmNhcmRzLXNlcmllc19faXRlbScpXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFBpY1R5cGUgPSB0aGlzLmRhdGFzZXQudGFyZ2V0VHlwZVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQaWMgPSBnZXRUYXJnZXRDYXJkc1BpYyhwYXJlbnQsIHRhcmdldFBpY1R5cGUpXHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWN0aXZlIHRhYlxyXG4gICAgICAgICAgICByZXNldEFsbENhcmRzVGFicyhwYXJlbnQpXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWN0aXZlIGltYWdlXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRQaWMpIHtcclxuICAgICAgICAgICAgICAgIHJlc2V0QWxsQ2FyZHNQaWNzKHBhcmVudClcclxuICAgICAgICAgICAgICAgIHRhcmdldFBpYy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdENhcmRzVGFiKVxyXG4iLCIvLyBGaWx0ZXJzXG5jb25zdCBzaG93Tm9GaWx0ZXJNc2cgPSAoKSA9PiB7XG4gIHRyeSB7XG5cblxuICAgIGNvbnN0IG1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25fX21zZ1wiKTtcblxuICAgIGlmICghbXNnKSByZXR1cm47XG4gICAgbXNnLmNsYXNzTGlzdC5hZGQoXCJkaXNwbGF5XCIpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbXNnLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAxMDApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGhpZGVOb0ZpbHRlck1zZyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBtc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uX19tc2dcIik7XG5cbiAgICBpZiAoIW1zZykgcmV0dXJuO1xuXG4gICAgbXNnLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgIG1zZy5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzcGxheVwiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBjaGVja05vRmlsdGVyTXNnID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXTpub3QoLmhpZGUpXCIpO1xuXG4gICAgaXRlbXMubGVuZ3RoID09PSAwXG4gICAgICA/IHNob3dOb0ZpbHRlck1zZygpXG4gICAgICA6IGhpZGVOb0ZpbHRlck1zZygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGhpZGVGaWx0ZXJMaXN0ID0gKGZpbHRlckxpc3QpID0+IHtcbiAgdHJ5IHtcbiAgICBmaWx0ZXJMaXN0LmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHBlZFwiKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIiksIDMwMCk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3Qgc2hvd0ZpbHRlckRyb3AgPSAobm9kZSkgPT4ge1xuICB0cnkge1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IG5vZGUuY2xhc3NMaXN0LmFkZChcImRyb3BwZWRcIiksIDEwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBoaWRlRmlsdGVyRHJvcCA9IChub2RlKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZmlsdGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19pdGVtXCIpKTtcblxuICAgIGlmICghbm9kZSkge1xuICAgICAgaGlkZUZpbHRlckxpc3QoZmlsdGVycyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNsZWFuZWRGaWx0ZXJzID0gZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+IGZpbHRlciAhPT0gbm9kZSk7XG4gICAgaGlkZUZpbHRlckxpc3QoY2xlYW5lZEZpbHRlcnMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGluaXRGaWx0ZXJzRHJvcCA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmaXRsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fbGlzdCAuZmlsdGVyc19faXRlbVwiKSk7XG5cbiAgICBmaXRsZXJzLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIGZpbHRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG5cbiAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgaGlkZUZpbHRlckRyb3AoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlRmlsdGVyRHJvcCh0aGlzKTtcbiAgICAgICAgc2hvd0ZpbHRlckRyb3AodGhpcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBpbml0RmlsdGVyc1Jlc2V0ID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtY2F0YWxvZ1wiKTtcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuO1xuXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbHRlcnNfX3Jlc2V0IC5maWx0ZXJzX19pdGVtXCIpO1xuXG4gICAgaWYgKCFyZXNldCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZmlsdGVyZWRTZWN0aW9uID0gZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIik7XG5cbiAgICByZXNldC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNsb3Nlc3QoXCIuZmlsdGVyc1wiKTtcblxuICAgICAgY29uc3Qgc2libGluZ0ZpbHRlcnMgPSBjb250YWluZXJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fbGlzdCAuZmlsdGVyc19faXRlbVwiKTtcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fb3B0aW9uc1wiKSk7XG5cbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzIGlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl06bm90KFt2YWx1ZT1cXFwicmVzZXRcXFwiXSlcIikpO1xuXG4gICAgICBjb25zdCBjYXJkcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xuXG4gICAgICBjb25zdCBkZWxldGVkVHlwZXMgPSBKU09OLnBhcnNlKGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZGVsZXRlZC10eXBlc11cIilcbiAgICAgICAgLmRhdGFzZXQuZGVsZXRlZFR5cGVzKTtcblxuICAgICAgaGlkZUZpbHRlckxpc3Qoc2libGluZ0ZpbHRlcnMpO1xuICAgICAgc3Bpbm5lci5zaG93KCk7XG4gICAgICBmaWx0ZXJlZFNlY3Rpb24uZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKFwiZmlsdGVyaW5nXCIpKTtcbiAgICAgIG9wdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiY2hlY2tlZFwiKSk7IC8vIGhpZGUgcnNldCBvcHRpb24gYnV0dG9uXG4gICAgICBjb250cm9sbGVycy5mb3JFYWNoKGNvbnRyb2xsZXIgPT4gY29udHJvbGxlci5jaGVja2VkID0gZmFsc2UpOyAvLyByZXNldCBhbGwgaW5wdXQgY29udHJvbGxlcnNcbiAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zKCk7XG4gICAgICByZXNldC5jbG9zZXN0KFwiLmZpbHRlcnNfX3Jlc2V0XCIpLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIHNob3cgaGlkZGVuIGNhcmRzIGFzIGRlbGV0ZSBkYXRhLWRpc3BsYXkgYXR0cmlidXRlc1xuICAgICAgICBjYXJkcy5mb3JFYWNoKGNhcmQgPT4ge1xuICAgICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBkZWxldGVkVHlwZXMpIHtcbiAgICAgICAgICAgIGNhcmQucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHt0eXBlfWApO1xuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBjaGVja0ZpbHRlcmVkU2VjdGlvbiA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZWN0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpKTtcblxuICAgIHNlY3Rpb25zLmZvckVhY2goc2VjdGlvbiA9PiB7XG4gICAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gQXJyYXkuZnJvbShzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcbiAgICAgIGNvbnN0IHNob3duSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+ICFpLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIikpO1xuXG4gICAgICBpZiAoc2hvd25JdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzcGlubmVyLmhpZGUoKTtcbiAgICBzZWN0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmaWx0ZXJpbmdcIikpO1xuXG4gICAgc2hvd0FuaW1FbGVtZW50cygpO1xuICAgIHNldEFuaW1hdGlvbkVsbXMoKTtcbiAgICBjaGVja05vRmlsdGVyTXNnKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSAobm9kZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICBsZXQgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUuc3RhcnRzV2l0aChcImRhdGEtZGlzcGxheVwiKSkge1xuICAgICAgICBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBjaGVja0ZpbHRlcmVkSXRlbSA9IChwcm9wLCB2YWwpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShpLmRhdGFzZXQuZmlsdGVyKTtcbiAgICAgICAgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoZGF0YVtwcm9wXSk7XG5cbiAgICAgICAgY29uc3QgaXNNYXRjaGVkID0gaXNBcnJheVxuICAgICAgICAgID8gZGF0YVtwcm9wXS5pbmNsdWRlcyh2YWwpXG4gICAgICAgICAgOiBkYXRhW3Byb3BdID09PSB2YWw7XG5cblxuICAgICAgICBpZiAoaXNNYXRjaGVkKSB7XG4gICAgICAgICAgaS5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YCk7XG4gICAgICAgICAgaWYgKCFoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZShpKSkgaS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICAgIGkuc2V0QXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWAsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9LCAxMDAwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBhY3RpdmVDb2xvckluSXRlbSA9ICh2YWwpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10YXJnZXQtdHlwZT1cIiR7dmFsfVwiXWApKTtcblxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiBpLmNsaWNrKCkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGluaXRGaWx0ZXJTZWxlY3QgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1jYXRhbG9nXCIpO1xuICAgIGlmIChpc1BhZ2VDYXRhbG9nKSByZXR1cm47XG5cbiAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnMgaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXTpub3QoW3ZhbHVlPVxcXCJyZXNldFxcXCJdKVwiKSk7XG5cbiAgICBjb25zdCBmaWx0ZXJlZFNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIik7XG5cbiAgICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyc19fcmVzZXRcIik7XG5cbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgZmlsdGVyZWRTZWN0aW9uLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChcImZpbHRlcmluZ1wiKSk7XG4gICAgICBzcGlubmVyLnNob3coKTtcbiAgICAgIGNoZWNrRmlsdGVyZWRJdGVtKHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7XG4gICAgICBhY3RpdmVDb2xvckluSXRlbSh0aGlzLnZhbHVlKTtcbiAgICAgIHRoaXMuY2xvc2VzdChcIi5maWx0ZXJzX19vcHRpb25zXCIpLmNsYXNzTGlzdC5hZGQoXCJjaGVja2VkXCIpO1xuICAgICAgcmVzZXRCdG4uY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgIH0pKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCByZW1vdmVEYXRhRmlsdGVyQXR0cmlidXRlID0gKHByb3ApID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1kaXNwbGF5LSR7cHJvcH1dYCkpO1xuXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IHtcbiAgICAgIGkucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWApO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGNoZWNrQWxsSXRlbXNIYXNEaXNwbGF5QXR0cmlidXRlcyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XG5cbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xuICAgICAgaWYgKCFoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZShpKSkge1xuICAgICAgICBpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IHJlc2V0QWxsQ29udHJvbGxlcnNCeU5hbWUgPSAobmFtZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT0ke25hbWV9XWApKTtcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4gaS5jaGVja2VkID0gZmFsc2UpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHRhYkxpc3RzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZHMtc2VyaWVzX19jb250cm9sc1wiKSk7XG5cbiAgICB0YWJMaXN0cy5mb3JFYWNoKGxpc3QgPT4ge1xuICAgICAgbGlzdC5xdWVyeVNlbGVjdG9yKFwiLmNhcmRzLXNlcmllc19fdGFiXCIpPy5jbGljaygpO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGNoZWNrQWxsRmlsdGVyUmVzZXRCdG4gPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXNDaGVja2VkRmlsdGVyID0gZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2xpc3QgaW5wdXQ6Y2hlY2tlZFwiKTtcblxuICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWx0ZXJzX19yZXNldFwiKTtcblxuICAgIGlzQ2hlY2tlZEZpbHRlci5sZW5ndGggPT09IDBcbiAgICAgID8gcmVzZXQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpXG4gICAgICA6IHJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBpbml0UmVzZXRGaWx0ZXJQcm9wID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtY2F0YWxvZ1wiKTtcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuO1xuXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzIGlucHV0W3ZhbHVlPVxcXCJyZXNldFxcXCJdXCIpKTtcbiAgICBjb25zdCBzZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKTtcblxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBzZWN0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoXCJmaWx0ZXJpbmdcIikpO1xuICAgICAgc3Bpbm5lci5zaG93KCk7XG4gICAgICB0aGlzLmNsb3Nlc3QoXCIuZmlsdGVyc19fb3B0aW9uc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiY2hlY2tlZFwiKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlbW92ZURhdGFGaWx0ZXJBdHRyaWJ1dGUodGhpcy5uYW1lKTtcbiAgICAgICAgY2hlY2tBbGxJdGVtc0hhc0Rpc3BsYXlBdHRyaWJ1dGVzKCk7XG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XG4gICAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNCeU5hbWUodGhpcy5uYW1lKTtcbiAgICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMoKTtcbiAgICAgICAgY2hlY2tBbGxGaWx0ZXJSZXNldEJ0bigpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gIHRyeSB7XG4gICAgaW5pdEZpbHRlcnNEcm9wKCk7XG4gICAgaW5pdEZpbHRlcnNSZXNldCgpO1xuICAgIGluaXRGaWx0ZXJTZWxlY3QoKTtcbiAgICBpbml0UmVzZXRGaWx0ZXJQcm9wKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufSk7Iiwid2luZG93LmluaXRJbmZvcm1lcnMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpbmZvcm1lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvcm1lcicpXHJcblxyXG4gICAgaWYgKCFpbmZvcm1lcikge1xyXG4gICAgICAgIGNvbnNvbGUud2Fybign0J3QsCDRgdGC0YDQsNC90LjRhtC1INC+0YLRgdGD0YLRgdGC0LLRg9C10YIgaHRtbCDQvtCx0LXRgNGC0LrQsCDQtNC70Y8g0JjQvdGE0L7RgNC80LXRgNCwJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5mb3JtZXJCb2R5ID0gaW5mb3JtZXIucXVlcnlTZWxlY3RvcignLmluZm9ybWVyX19ib2R5JylcclxuICAgIGNvbnN0IGluZm9ybWVyQmFjayA9IGluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoJy5pbmZvcm1lcl9fYmFjaycpXHJcbiAgICBjb25zdCBpbmZvcm1lckNsb3NlID0gaW5mb3JtZXIucXVlcnlTZWxlY3RvcignLmluZm9ybWVyX19jbG9zZScpXHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuW2RhdGEtdGVybV0nKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBnZXRJbmZvcm1hdGlvbihidG4uZGF0YXNldC50ZXJtKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGdldEluZm9ybWF0aW9uID0gYXN5bmMgKHRlcm0pID0+IHtcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93KClcclxuXHJcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgndGVybScsIHRlcm0pXHJcblxyXG4gICAgICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvaW5mb3JtLmh0bWwnKVxyXG4gICAgICAgICAgICA6IGF3YWl0IGZldGNoKFwiL2FwaS90ZXJtXCIsIHsgbWV0aG9kOiBcIlBPU1RcIiwgYm9keTogZm9ybURhdGEgfSlcclxuXHJcbiAgICAgICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gYXdhaXQgcmVzLnRleHQoKVxyXG4gICAgICAgICAgICB1cGRhdGVJbmZvcm1lckNvbnRlbnQoaHRtbClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ9Cd0LUg0YPQtNCw0LvQvtGB0Ywg0L/QvtC70YPRh9C40YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQtNC70Y8g0KLQtdGA0LzQuNC90LAnLCB0ZXJtKVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zcGlubmVyLmhpZGUsIDMwMClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdXBkYXRlSW5mb3JtZXJDb250ZW50ID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCBpbmZvcm1lckNvbnRlbnQgPSBpbmZvcm1lci5xdWVyeVNlbGVjdG9yKCcuaW5mb3JtZXJfX2NvbnRlbnQnKVxyXG5cclxuICAgICAgICB3aGlsZSAoaW5mb3JtZXJDb250ZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgaW5mb3JtZXJDb250ZW50LnJlbW92ZUNoaWxkKGluZm9ybWVyQ29udGVudC5maXJzdENoaWxkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5mb3JtZXJDb250ZW50LmlubmVySFRNTCA9IGRhdGFcclxuICAgICAgICBzaG93SW5mb3JtZXIoKVxyXG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnNwaW5uZXIuaGlkZSwgMzAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNob3dJbmZvcm1lciA9ICgpID0+IHtcclxuICAgICAgICBpbmZvcm1lci5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGluZm9ybWVyQmFjay5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgaW5mb3JtZXJCb2R5LmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgICAgIH0sIDEwMClcclxuICAgIH1cclxuXHJcbiAgICAvLyBIaWRlIGluZm9ybWVyXHJcbiAgICBjb25zdCBoaWRlSW5mb3JtZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgaW5mb3JtZXJCYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIGluZm9ybWVyQm9keS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gaW5mb3JtZXIuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpLFxyXG4gICAgICAgICAgICA1MDBcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBpbmZvcm1lckJhY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoaWRlSW5mb3JtZXIpXHJcbiAgICBpbmZvcm1lckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGlkZUluZm9ybWVyKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHdpbmRvdy5pbml0SW5mb3JtZXJzKSIsImNvbnN0IGluaXRNb2RhbCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZGFsXScpKVxyXG5cclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5kYXRhc2V0Lm1vZGFsVGFyZ2V0XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5kYXRhc2V0Lm1vZGFsQWN0aW9uXHJcblxyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxyXG4gICAgICAgICAgICAgICAgc2hvd01vZGFsQmFjaygpXHJcbiAgICAgICAgICAgICAgICBzaG93TW9kYWxEaWFsb2codGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvZ2dsZSc6XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNb2RhbERpYWxvZyh0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2xvc2UnOlxyXG4gICAgICAgICAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoaGlkZU1vZGFsQmFjaywgMjAwKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbmNvbnN0IHNob3dNb2RhbEJhY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19iYWNrJylcclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYm9keScpXHJcblxyXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcclxuICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBiYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKSwgMTApXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVNb2RhbEJhY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19iYWNrJylcclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYm9keScpXHJcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGVhZGVyJylcclxuXHJcbiAgICBpZiAoIWJhY2spIHJldHVyblxyXG5cclxuICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSdcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgIGhlYWRlci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICB9LCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IHNob3dNb2RhbERpYWxvZyA9IChpZCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgIH0sIDEwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlTW9kYWxEaWFsb2cgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwuc2hvdycpXHJcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgZGlhbG9nID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcbiAgICBkaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRhcmdldC5jbGFzc0xpc3QuYWRkKCdoaWRlJyksIDEwMClcclxufVxyXG5cclxuY29uc3QgaW5pdENsb3NlTW9kYWwgPSAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNPblBvcHVwTW9kYWwgPSBlLnRhcmdldC5jbG9zZXN0KCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgICAgIGlmKGlzT25Qb3B1cE1vZGFsKSByZXR1cm5cclxuXHJcbiAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcclxuICAgICAgICBzZXRUaW1lb3V0KGhpZGVNb2RhbEJhY2ssIDIwMClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHRvZ2dsZU1vZGFsRGlhbG9nID0gKGlkKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxyXG4gICAgY29uc3QgZGlhbG9nID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICBoaWRlTW9kYWxEaWFsb2coKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSwgMjAwKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgIH0sIDMwMClcclxufVxyXG5cclxuY29uc3QgaW5pdFRvZ2dsZVZpc2libGVQYXNzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsX190b2dnbGUtdmlzaWJsZS1wYXNzJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgIGNvbnN0IGlzVGV4dCA9IGlucHV0LnR5cGUgPT09ICd0ZXh0J1xyXG5cclxuICAgICAgICBpbnB1dC50eXBlID0gaXNUZXh0ID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0J1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgncGFzcy12aXNpYmxlJylcclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWwgPSAoaWQpID0+IHtcclxuICAgIHNob3dNb2RhbEJhY2soKVxyXG4gICAgc2hvd01vZGFsRGlhbG9nKGlkKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRNb2RhbCgpXHJcbiAgICBpbml0Q2xvc2VNb2RhbCgpXHJcbiAgICBpbml0VG9nZ2xlVmlzaWJsZVBhc3MoKVxyXG59KSIsIi8vIFByb2R1Y3QgaW5mb3JtYXRpb24gc2xpZGVyXHJcbmxldCBwcm9kdWN0SW5mb1NsaWRlclxyXG5cclxuY29uc3QgaW5pdFByb2R1Y3RJbmZvU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgcHJvZHVjdEluZm9TbGlkZXIgPSBuZXcgU3dpcGVyKCcucHJvZHVjdC1pbmZvIC5zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgLy8gc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcblxyXG4gICAgICAgIC8vIGF1dG9IZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgLy8gc3BhY2VCZXR3ZWVuOiAxMCxcclxuXHJcbiAgICAgICAgc2Nyb2xsYmFyOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1zY3JvbGxiYXInLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA1NzY6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUHJvZHVjdEluZm9TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5OTEpIHtcclxuICAgICAgICBpZiAocHJvZHVjdEluZm9TbGlkZXIpIHtcclxuICAgICAgICAgICAgcHJvZHVjdEluZm9TbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKVxyXG4gICAgICAgICAgICBwcm9kdWN0SW5mb1NsaWRlciA9IHVuZGVmaW5lZFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXByb2R1Y3RJbmZvU2xpZGVyKSB7XHJcbiAgICAgICAgaW5pdFByb2R1Y3RJbmZvU2xpZGVyKClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1Byb2R1Y3RQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtcHJvZHVjdCcpXHJcbiAgICBjb25zdCBpc0FydGljbGVQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtYXJ0aWNsZScpXHJcbiAgICBjb25zdCBpc0RvdHNQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtZG90cycpXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBJbmZvIHNsaWRlciBvbmx5IGZvciBQcm9kdWN0LCBBcnRpY2xlIGFuZCBEb3RzIHBhZ2VzXHJcbiAgICBpZiAoIWlzUHJvZHVjdFBhZ2UgJiYgIWlzQXJ0aWNsZVBhZ2UgJiYgIWlzRG90c1BhZ2UpIHJldHVyblxyXG5cclxuICAgIGNoZWNrUHJvZHVjdEluZm9TbGlkZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgY2hlY2tQcm9kdWN0SW5mb1NsaWRlcigpXHJcbiAgICB9KVxyXG59KVxyXG4iLCIvLyBQcm9kdWN0IHJlY29tbWVuZGF0aW9uIHNsaWRlclxyXG5sZXQgcHJvZHVjdFJlY29tbVNsaWRlclxyXG5cclxuY29uc3QgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIgPSAoc3dpcGVyLCBzY3JvbGxiYXIpID0+IHtcclxuICAgIGlmICghc2Nyb2xsYmFyIHx8IHNjcm9sbGJhci5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGlzU2Nyb2xsYmFySGlkZSA9IHNjcm9sbGJhci5jbGFzc0xpc3RcclxuICAgICAgICAuY29udGFpbnMoJ3N3aXBlci1zY3JvbGxiYXItbG9jaycpXHJcblxyXG4gICAgaXNTY3JvbGxiYXJIaWRlXHJcbiAgICAgICAgPyBzd2lwZXIuY2xhc3NMaXN0LmFkZCgnc2Nyb2xsLWhpZGRlbicpXHJcbiAgICAgICAgOiBzd2lwZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsLWhpZGRlbicpXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrU2xpZGVyc0JvdHRvbU9mZnNldCA9ICgpID0+IHtcclxuICAgIGNvbnN0IHN3aXBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXInKSlcclxuXHJcbiAgICBzd2lwZXJzLmZvckVhY2goc3dpcGVyID0+IHtcclxuICAgICAgICBjb25zdCBzY3JvbGxiYXIgPSBzd2lwZXIucXVlcnlTZWxlY3RvcignLnN3aXBlci1zY3JvbGxiYXInKVxyXG4gICAgICAgIGNoZWNrUmVjb21tU2xpZGVyU2Nyb2xsYmFyKHN3aXBlciwgc2Nyb2xsYmFyKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgaW5pdFByb2R1Y3RSZWNvbW1TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBwcm9kdWN0UmVjb21tU2xpZGVyID0gbmV3IFN3aXBlcignLnJlY29tbWVuZGF0aW9uX19zbGlkZXIgLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICAvLyBhdXRvSGVpZ2h0OiB0cnVlLFxyXG5cclxuICAgICAgICBzY3JvbGxiYXI6IHtcclxuICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXNjcm9sbGJhcicsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDU3Njoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICA5OTE6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAxMjAwOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXMuZWxcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjcm9sbGJhciA9IHRoaXMuc2Nyb2xsYmFyLmVsXHJcbiAgICAgICAgICAgICAgICBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhcihzd2lwZXIsIHNjcm9sbGJhcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlciA9ICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEyMDAgJiYgcHJvZHVjdFJlY29tbVNsaWRlcikge1xyXG4gICAgICAgIEFycmF5LmlzQXJyYXkocHJvZHVjdFJlY29tbVNsaWRlcilcclxuICAgICAgICAgICAgPyBwcm9kdWN0UmVjb21tU2xpZGVyLmZvckVhY2goc2xpZGVyID0+IHNsaWRlci5kZXN0cm95KHRydWUsIHRydWUpKVxyXG4gICAgICAgICAgICA6IHByb2R1Y3RSZWNvbW1TbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKVxyXG5cclxuICAgICAgICBwcm9kdWN0UmVjb21tU2xpZGVyID0gdW5kZWZpbmVkXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcm9kdWN0UmVjb21tU2xpZGVyKSB7XHJcbiAgICAgICAgaW5pdFByb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGNvbnN0IGlzUHJvZHVjdFBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1wcm9kdWN0JylcclxuICAgIGNvbnN0IGlzQXJ0aWNsZVBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1hcnRpY2xlJylcclxuICAgIGNvbnN0IGlzRG90c1BhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1kb3RzJylcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIFJlY29tbWVuZGF0aW9uIHNsaWRlciBvbmx5IGZvciBQcm9kdWN0LCBBcnRpY2xlIGFuZCBEb3RzIHBhZ2VzXHJcbiAgICBpZiAoIWlzUHJvZHVjdFBhZ2UgJiYgIWlzQXJ0aWNsZVBhZ2UgJiYgIWlzRG90c1BhZ2UpIHJldHVyblxyXG5cclxuICAgIGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlcigpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG4gICAgICAgIGNoZWNrU2xpZGVyc0JvdHRvbU9mZnNldCgpXHJcbiAgICB9KVxyXG59KVxyXG4iLCJjb25zdCBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AgPSAoYnV0dG9uKSA9PiB7XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0U2Nyb2xsVG9Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsVG9Ub3AnKVxyXG5cclxuICAgIGlmICghYnV0dG9uKSByZXR1cm5cclxuXHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzbW9vdGhTY3JvbGxUbygwKSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AoYnV0dG9uKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0U2Nyb2xsVG9Ub3AoKVxyXG59KSIsIi8qKlxyXG4gKiBTaG93IGEgc21hbGwgbWVzc2FnZSB3aXRoIHRpdGxlIGFuZCB0ZXh0IGluIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSBzY3JlZW4uXHJcbiAqIFRoZSBtZXRob2QgZXhwZWN0cyBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyIHBlciBpbnB1dC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IFt0aXRsZT11bmRlZmluZWRdIC0gVGhlIGhlYWRsaW5lIG9mIHRoZSBtZXNzYWdlIGluIG9uZSBsaW5lLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2U9dW5kZWZpbmVkXSAtIE9uZSBsaW5lIG1lc3NhZ2UgdGV4dC5cclxuICovXHJcbndpbmRvdy5zaG93TW9kYWxNc2cgPSBmdW5jdGlvbih0aXRsZSA9ICcnLCBtZXNzYWdlID0gJycpIHtcclxuICAgIGlmICghdGl0bGUgJiYgIW1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlcmUncyBubyB0aXRsZSBvciBtZXNzYWdlIGZvciBzaG93aW5nIGluIG1vZGFsIHdpbmRvdy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHRpdGxlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbmNvcnJlY3QgdHlwZSBvZiB0aXRsZS4gSXQgc2hvdWxkIGJlIHN0cmluZy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkluY29ycmVjdCB0eXBlIG9mIG1lc3NhZ2UuIEl0IHNob3VsZCBiZSBzdHJpbmcuXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbXNnLWNvbnRhaW5lcicpXHJcbiAgICBjb25zdCBbY2FyZCwgYm9keV0gPSBjcmVhdGVNb2RhbE1zZ0NhcmQodGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhcmQpXHJcbiAgICBjaGVja01vZGFsTXNnQ29udGFpbmVyKClcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBjYXJkLmNsYXNzTGlzdC5hZGQoJ3VuY29sbGFwc2VkJyksIDUwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcbiAgICB9LCAxMDApXHJcblxyXG4gICAgaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHksIDUwMDApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKSB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tc2ctY29udGFpbmVyJylcclxuICAgIGNvbnN0IGlubmVyRWxtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtbXNnX19jYXJkJylcclxuXHJcbiAgICBpbm5lckVsbXMubGVuZ3RoID4gMFxyXG4gICAgICAgID8gY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG4gICAgICAgIDogY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNb2RhbE1zZ0NhcmQodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2NhcmQnKVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2JvZHknKVxyXG5cclxuICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcclxuXHJcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtbXNnX19jb250ZW50JylcclxuXHJcbiAgICBjb25zdCBjYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXHJcbiAgICBjYXB0aW9uLnRleHRDb250ZW50ID0gdGl0bGVcclxuXHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICB0ZXh0LnRleHRDb250ZW50ID0gbWVzc2FnZVxyXG5cclxuICAgIGlmICh0aXRsZSkgY29udGVudC5hcHBlbmRDaGlsZChjYXB0aW9uKVxyXG4gICAgaWYgKG1lc3NhZ2UpIGNvbnRlbnQuYXBwZW5kQ2hpbGQodGV4dClcclxuXHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGljb24pXHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGNvbnRlbnQpXHJcblxyXG4gICAgY2FyZC5hcHBlbmRDaGlsZChib2R5KVxyXG5cclxuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoaWRlTW9kYWxNc2dIYW5kbGVyKVxyXG5cclxuICAgIHJldHVybiBbY2FyZCwgYm9keV1cclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZU1vZGFsTXNnSGFuZGxlcigpIHtcclxuICAgIGNvbnN0IGNhcmQgPSB0aGlzXHJcbiAgICBjb25zdCBib2R5ID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtbXNnX19ib2R5JylcclxuICAgIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5KVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSwgdGltZW91dCA9IDApIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcclxuICAgIH0sIHRpbWVvdXQpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJywgJ2hpZGRlbicpXHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd1bmNvbGxhcHNlZCcpXHJcbiAgICB9LCB0aW1lb3V0ICsgMTAwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNhcmQucmVtb3ZlKCk7XHJcbiAgICAgICAgY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpXHJcbiAgICB9LCB0aW1lb3V0ICsgMjAwKVxyXG59XHJcbiIsImNvbnN0IHNob3dTcGlubmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHNwaW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNwaW5uZXIuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpLCAxMDApXG59XG5cbmNvbnN0IGhpZGVTcGlubmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHNwaW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpLCAxMDAwKVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKSkge1xuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93ID0gc2hvd1NwaW5uZXJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSA9IGhpZGVTcGlubmVyXG4gICAgfVxufSkiLCIiLCIvLyBPcGVuIGFuZCBjbG9zZSBtb2JpbGUgbmF2aWdhdGlvblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgbmF2Q2xvc2UgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jbG9zZScpKVxyXG4gICAgY29uc3QgbmF2VG9nZ2xlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXJfX25hdi1saW5rX21lbnUnKVxyXG4gICAgY29uc3QgaGVhZGVyTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2JylcclxuICAgIGNvbnN0IG1vZGFsQmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21vZGFsLWJhY2snKVxyXG4gICAgY29uc3QgbmF2UHJvZExpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtbGlua19wcm9kdWN0JylcclxuICAgIGNvbnN0IG5hdkl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtaXRlbV93aXRoLWlubmVyJykpXHJcbiAgICBjb25zdCBuYXZMaW5rcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWxpbmsnKSlcclxuICAgIGNvbnN0IG5hdkNvbGxhcHNlcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNvbGxhcHNlJykpXHJcblxyXG4gICAgaWYgKCFuYXZUb2dnbGVyKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCB0b2dnbGVOYXYgPSAoZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgICAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgLy8gbW9kYWxCYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuYXZQcm9kTGluay5jbGljaygpXHJcbiAgICAgICAgICAgIH0sIDEwMClcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJylcclxuICAgICAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKVxyXG4gICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuXHJcbiAgICAgICAgY29sbGFwc0FsbE5hdkl0ZW0oKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENsaWNrIG9uIG5hdmlnYXRpb24gYnVyZ2VyXHJcbiAgICBuYXZUb2dnbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICB0b2dnbGVOYXYoZmFsc2UpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9nZ2xlTmF2KHRydWUpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIENsaWNrIG9uIG5hdmlnYXRpb24gY2xvc2UgYnV0dG9uXHJcbiAgICBuYXZDbG9zZS5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT50b2dnbGVOYXYoZmFsc2UpKVxyXG4gICAgfSlcclxuXHJcbiAgICBtb2RhbEJhY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBPcGVuIGFuZCBjbG9zZSBOYXZpZ2F0aW9uIGl0ZW1zXHJcbiAgICBjb25zdCBjb2xsYXBzQWxsTmF2SXRlbSA9ICgpID0+IHtcclxuICAgICAgICBuYXZJdGVtcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wcGVkJykpXHJcbiAgICAgICAgbmF2TGlua3MuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbiAgICAgICAgbmF2Q29sbGFwc2VzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0b2dnbGVOYXZJdGVtID0gKGJ0bikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gYnRuLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuXHJcbiAgICAgICAgY29sbGFwc0FsbE5hdkl0ZW0oKVxyXG5cclxuICAgICAgICBpZiAoIWlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbmF2SXRlbSA9IGJ0bi5jbG9zZXN0KCcuaGVhZGVyX19uYXYtaXRlbV93aXRoLWlubmVyJylcclxuXHJcbiAgICAgICAgICAgIGlmIChuYXZJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYXZDb2xsYXBzZSA9IG5hdkl0ZW0ucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LWNvbGxhcHNlJylcclxuXHJcbiAgICAgICAgICAgICAgICBuYXZJdGVtLmNsYXNzTGlzdC5hZGQoJ2Ryb3BwZWQnKVxyXG4gICAgICAgICAgICAgICAgbmF2Q29sbGFwc2UuY2xhc3NMaXN0LmFkZCgnb3BlbicpXHJcbiAgICAgICAgICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmF2TGlua3MuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0b2dnbGVOYXZJdGVtKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBTZWFyY2hpbmcgYW5kIFN0aWNreSBoZWFkZXJcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKVxyXG4gICAgY29uc3Qgc2VhcmNoVG9nZ2xlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2J1dHRvbnMtbGlua19zZWFyY2gnKVxyXG4gICAgY29uc3Qgc2VhcmNoQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtY2xvc2UnKVxyXG4gICAgY29uc3Qgc2VhcmNoUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gnKVxyXG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtaW5wdXQnKVxyXG4gICAgY29uc3Qgc2VhcmNoUmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtcmVzZXQnKVxyXG4gICAgY29uc3Qgc2VhcmNoSGludHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtaGludHMnKVxyXG5cclxuICAgIGlmICghc2VhcmNoVG9nZ2xlcikgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgdG9nZ2xlU2VhcmNoUGFuZWwgPSAoaGlkZSA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNWaXNpYmxlID0gc2VhcmNoUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJylcclxuICAgICAgICBjb25zdCB0aW1lb3V0ID0gMTAwXHJcblxyXG4gICAgICAgIGlmICghaXNWaXNpYmxlICYmICFoaWRlKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGUnKVxyXG4gICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX3dpdGgtc2VhcmNoLXBhbmVsJylcclxuICAgICAgICAgICAgc2VhcmNoVG9nZ2xlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgfSwgdGltZW91dClcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoVG9nZ2xlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA5OTIpIHtcclxuICAgICAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIHNlYXJjaFJlc2V0LmNsaWNrKClcclxuICAgICAgICAgICAgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycygpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZScpXHJcbiAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkZXJfd2l0aC1zZWFyY2gtcGFuZWwnKVxyXG4gICAgICAgIH0sIDIwMClcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hUb2dnbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKClcclxuICAgIH0pXHJcblxyXG4gICAgc2VhcmNoQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9zZWFyY2guanNvbidcclxuICAgIC8vIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICdodHRwczovL3Rlc3QtdGVjaG5vbGlnaHR2Mi5tYXNzaXZlLnJ1L2FwaS9wcm9kdWN0L3NlYXJjaCdcclxuXHJcbiAgICBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnL2FwaS9wcm9kdWN0L3NlYXJjaCdcclxuICAgIC8vIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICdodHRwczovL3RlY2hub2xpZ2h0LmxpZ2h0b3B0LnJ1L2FwaS9wcm9kdWN0L3NlYXJjaCdcclxuICAgIGNvbnN0IFRIUk9UVExFX1RJTUVPVVQgPSAzMDBcclxuICAgIGxldCBzZWFyY2hSZXF1ZXN0VGltZW91dElkXHJcblxyXG4gICAgY29uc3Qgc2V0U3Ryb25nVGV4dCA9IChzdHIsIHF1ZXJ5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHF1ZXJ5LCAnZ2knKVxyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShyZWdleCwgYDxzdHJvbmc+JCY8L3N0cm9uZz5gKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByaW50UXVlcnlSZXN1bHQgPSAoZGF0YSwgcXVlcnkpID0+IHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Cf0L7Qu9GD0YfQuNC70Lgg0L/QvtC40YHQutC+0LLRg9GOINCy0YvQtNCw0YfRgycsIGRhdGEpO1xyXG5cclxuICAgICAgICAvLyBSZXNldCBhbGwgY2hpbGRyZW4gbm9kZXMgb2Ygc2VhcmNoIGhpbnRzXHJcbiAgICAgICAgd2hpbGUgKHNlYXJjaEhpbnRzLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgc2VhcmNoSGludHMucmVtb3ZlQ2hpbGQoc2VhcmNoSGludHMuZmlyc3RDaGlsZClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCBsaW5rLCBzaW1pbGFyIG9yIE5vIFJlc3VsdFxyXG4gICAgICAgIGNvbnN0IGxpbmtzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICBsaW5rcy5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX3NlYXJjaC1saW5rcycpXHJcblxyXG4gICAgICAgIGNvbnN0IHNpbWlsYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIHNpbWlsYXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19zZWFyY2gtc2ltaWxhcicpXHJcblxyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvLyBObyByZXN1bHRzXHJcbiAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKCduby1yZXN1bHRzJylcclxuICAgICAgICAgICAgc3Bhbi5pbm5lclRleHQgPSAn0J/QviDQktCw0YjQtdC80YMg0LfQsNC/0YDQvtGB0YMg0L3QuNGH0LXQs9C+INC90LUg0L3QsNC50LTQtdC90L4nXHJcbiAgICAgICAgICAgIGxpbmtzLmFwcGVuZENoaWxkKHNwYW4pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTGlua3NcclxuICAgICAgICAgICAgY29uc3QgaGludCA9IGRhdGFbMF1cclxuICAgICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxyXG4gICAgICAgICAgICBsaW5rLmhyZWYgPSBoaW50LnVybFxyXG4gICAgICAgICAgICBsaW5rLmlubmVySFRNTCA9IHNldFN0cm9uZ1RleHQoaGludC50aXRsZSwgcXVlcnkpXHJcbiAgICAgICAgICAgIGxpbmtzLmFwcGVuZENoaWxkKGxpbmspXHJcblxyXG4gICAgICAgICAgICAvLyBTaW1pbGFyXHJcbiAgICAgICAgICAgIHNpbWlsYXIuaW5uZXJIVE1MID0gJzxoNT7RgdC80L7RgtGA0LjRgtC1INC/0L7RhdC+0LbQuNC1PC9oNT4nXHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG51bSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVtIDwgMSkgY29udGludWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMaW5rXHJcbiAgICAgICAgICAgICAgICBjb25zdCBoaW50ID0gZGF0YVtudW1dXHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBoaW50LnVybFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEltYWdlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwaWNTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICAgICAgICAgICAgICBwaWNTcGFuLmNsYXNzTGlzdC5hZGQoJ3BpYycpXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBoaW50LmltYWdlXHJcbiAgICAgICAgICAgICAgICBpbWcuYWx0ID0gaGludC50aXRsZVxyXG4gICAgICAgICAgICAgICAgcGljU3Bhbi5hcHBlbmRDaGlsZChpbWcpXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGV4dFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICAgICAgICAgIHRleHRTcGFuLmNsYXNzTGlzdC5hZGQoJ3RleHQnKVxyXG4gICAgICAgICAgICAgICAgdGV4dFNwYW4uaW5uZXJIVE1MID0gc2V0U3Ryb25nVGV4dChoaW50LnRpdGxlLCBxdWVyeSlcclxuXHJcbiAgICAgICAgICAgICAgICBsaW5rLmFwcGVuZENoaWxkKHBpY1NwYW4pXHJcbiAgICAgICAgICAgICAgICBsaW5rLmFwcGVuZENoaWxkKHRleHRTcGFuKVxyXG4gICAgICAgICAgICAgICAgc2ltaWxhci5hcHBlbmRDaGlsZChsaW5rKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChudW0gPiA2KSBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hIaW50cy5hcHBlbmRDaGlsZChsaW5rcylcclxuICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5hcHBlbmRDaGlsZChzaW1pbGFyKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0J3Rg9C20L3QviDRgtC+0LvRjNC60L4g0LTQu9GPINC/0L7Qu9C90L7Qs9C+INC80LXQvdGOXHJcbiAgICAgICAgLy8gc2V0SGFuZGxlclRvSGVscGVycygpXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmZXRjaFNlYXJjaGluZ0RhdGEgPSBhc3luYyhxdWVyeSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKFNFQVJDSF9SRVFVRVNUX1VSTCArIGA/cXVlcnk9JHtxdWVyeX1gKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINC/0L7QuNGB0LrQsCcpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgICAgIHByaW50UXVlcnlSZXN1bHQoZGF0YSwgcXVlcnkpXHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09ICcnICkge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXNldC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChzZWFyY2hSZXF1ZXN0VGltZW91dElkKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICAvLyAqKiogRmV0Y2hpbmcgc2VhcmNoIHJlcXVlc3RzIGFuZCBzaG93IHJlc3VsdHMgLS0tIFNUQVJUXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQpXHJcbiAgICAgICAgc2VhcmNoUmVxdWVzdFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICgpID0+IGZldGNoU2VhcmNoaW5nRGF0YSh0aGlzLnZhbHVlKSxcclxuICAgICAgICAgICAgVEhST1RUTEVfVElNRU9VVFxyXG4gICAgICAgIClcclxuICAgICAgICAvLyAqKiogRmV0Y2hpbmcgc2VhcmNoIHJlcXVlc3RzIGFuZCBzaG93IHJlc3VsdHMgLS0tIEZJTklTSFxyXG4gICAgfSlcclxuXHJcbiAgICBzZWFyY2hSZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIHJlc2V0SGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICB9KVxyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNTZWFyY2hUb2dnbGUgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xvc2VzdCgnLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcblxyXG4gICAgICAgIGNvbnN0IGlzU2VhcmNoUGFuZWwgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xvc2VzdCgnLmhlYWRlcl9fc2VhcmNoJylcclxuXHJcbiAgICAgICAgY29uc3QgaXNUYWNoRGV2aWNlID0gd2luZG93LmlubmVyV2lkdGggPCA5OTJcclxuXHJcbiAgICAgICAgaWYgKCFpc1RhY2hEZXZpY2UgJiYgIWlzU2VhcmNoUGFuZWwgJiYgIWlzU2VhcmNoVG9nZ2xlKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBTZXQgaGVscCB0ZXh0IGZyb20gaGVscGVyIGJ1dHRvbiB1bmRlciB0aGUgc2VhcmNoIGlucHV0IHRvIHRoZSBzZWFyY2ggdmFsdWVcclxuICAgIGNvbnN0IHJlcXVlc3RDb21wbGV0aW9uID0gKGUpID0+IHtcclxuICAgICAgICBjb25zdCBhZGRpdGlvblZhbHVlID0gZS50YXJnZXQuaW5uZXJUZXh0XHJcbiAgICAgICAgc2VhcmNoSW5wdXQudmFsdWUgPSBgJHtzZWFyY2hJbnB1dC52YWx1ZX0gJHthZGRpdGlvblZhbHVlfWBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZXRIYW5kbGVyVG9IZWxwZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEhlbHBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19zZWFyY2gtaGVscHMgc3BhbicpKVxyXG5cclxuICAgICAgICBzZWFyY2hIZWxwZXJzLmZvckVhY2goYnRuID0+IGJ0blxyXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXF1ZXN0Q29tcGxldGlvbikpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBzZWFyY2hIZWxwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fc2VhcmNoLWhlbHBzIHNwYW4nKSlcclxuXHJcbiAgICAgICAgc2VhcmNoSGVscGVycy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgICAgIGJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlcXVlc3RDb21wbGV0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RpY2t5IGhlYWRlclxyXG4gICAgbGV0IGJlZm9yZVNjcm9sbFRvcCA9IDBcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZGVyXCIpXHJcbiAgICAgICAgY29uc3QgaGVhZGVySGVpZ2h0ID0gaGVhZGVyLmNsaWVudEhlaWdodFxyXG4gICAgICAgIGNvbnN0IGRlbGF5ID0gJy43cydcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRTY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWVxyXG5cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5OTEpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTY3JvbGxUb3AgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnY29tcHJlc3NlZCcpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdjb21wcmVzc2VkJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IDEwMCAmJiBjdXJyZW50U2Nyb2xsVG9wID4gYmVmb3JlU2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzVmlzaWJsZVNlYXJjaCA9IHNlYXJjaFBhbmVsXHJcbiAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbElkXHJcblxyXG4gICAgICAgICAgICBpZiAoaXNWaXNpYmxlU2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXlcclxuICAgICAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSAnMHMnXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IGAtJHtoZWFkZXJIZWlnaHR9cHhgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJlZm9yZVNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgfSk7XHJcbn0pXHJcblxyXG4vLyBDYXJ0IHVwZGF0ZSBsaXN0ZW5pbmdcclxuY29uc3Qgc2V0Q2FydFVwZGF0ZUxpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY2FydFByb2R1Y3RDb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FydFByb2R1Y3RDb3VudCcpXHJcblxyXG4gICAgaWYgKCFjYXJ0UHJvZHVjdENvdW50Tm9kZSkgcmV0dXJuXHJcblxyXG4gICAgY2FydFByb2R1Y3RDb3VudE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2FydFVwZGF0ZUV2ZW50JywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IHdpbmRvdy5DQVJULnByb2R1Y3RzXHJcbiAgICAgICAgbGV0IHByb2R1Y3RDb3VudCA9IDBcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVyYXRvciBvZiBwcm9kdWN0cykge1xyXG4gICAgICAgICAgICBwcm9kdWN0Q291bnQgKz0gaXRlcmF0b3IuY291bnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmlubmVyVGV4dCA9IHByb2R1Y3RDb3VudFxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmRhdGFzZXQuY291bnQgPSBwcm9kdWN0Q291bnQudG9TdHJpbmcoKVxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNhcnRQcm9kdWN0Q291bnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLm1lc3NhZ2UpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHNldENhcnRVcGRhdGVMaXN0ZW5lcilcclxuXHJcbi8vIE9wZW4gYW5kIGNsb3NlIHN1Ykxpc3RzXHJcbmNvbnN0IHRvZ2dsZVN1Yk5hdkxpc3RzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdG9nZ2xlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pbm5lci10b2dnbGUnKSlcclxuXHJcbiAgICBjb25zdCBjbG9zZUFsbFRvZ2dsZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZXJzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3cmFwID0gZWwuY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWlubmVyLWNhcHRpb24nKVxyXG4gICAgICAgICAgICB3cmFwLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY29sbGFwc2UgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1zdWJsaXN0LWNvbGxhcHNlJylcclxuICAgICAgICAgICAgY29sbGFwc2UuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcblxyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb25zdCB3cmFwID0gZWwuY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWlubmVyLWNhcHRpb24nKVxyXG4gICAgICAgIGNvbnN0IGNvbGxhcHNlID0gd3JhcC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtc3VibGlzdC1jb2xsYXBzZScpXHJcbiAgICAgICAgY29uc3QgaXNDdXJyZW50RHJvcHBlZCA9IHdyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wcGVkJylcclxuXHJcbiAgICAgICAgLy8gY2xvc2VBbGxUb2dnbGVycygpXHJcblxyXG4gICAgICAgIC8vIFRvZ2dsZSBjdXJyZW50XHJcbiAgICAgICAgaWYgKCFpc0N1cnJlbnREcm9wcGVkKSB7XHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGNvbGxhcHNlLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKVxyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG5cclxuICAgIC8vIENsb3NlIGFsbCBzdWJuYXYgbGlzdCBvbiBvdXQgY2xpY2tcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNUYXJnZXQgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xhc3NMaXN0XHJcbiAgICAgICAgICAgIC5jb250YWlucygnaGVhZGVyX19uYXYtaW5uZXItdG9nZ2xlJylcclxuXHJcbiAgICAgICAgaWYoIWlzVGFyZ2V0KSBjbG9zZUFsbFRvZ2dsZXJzKClcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdG9nZ2xlU3ViTmF2TGlzdHMpXHJcbiIsIi8vIERlbGV0aW5nIGJsb2NraW5nIG9mIGFsbCBhbmltYXRpb24gZm9yIGZpeCBhbmltYXRpb24gYXJ0ZWZhY3RzXHJcbmNvbnN0IHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIgPSAoKSA9PiB7XHJcbiAgICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmFuc2l0aW9uLWJsb2NrZXInKSlcclxuICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc2l0aW9uLWJsb2NrZXInKSlcclxufVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIpXHJcblxyXG4vLyBCbG9ja2luZyBhbGwgYW5pbWF0aW9uIGF0IHRoZSB3aW5kb3cgcmVzaXppbmcgcHJvY2Vzc1xyXG5jb25zdCBhZGRBbmltYXRpb25CbG9ja2VyID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0cmFuc2l0aW9uLWJsb2NrZXInKVxyXG59XHJcblxyXG5sZXQgYmxvY2tBbmltYXRpb25UaW1lclxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgY2xlYXJUaW1lb3V0KGJsb2NrQW5pbWF0aW9uVGltZXIpXHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoYWRkQW5pbWF0aW9uQmxvY2tlcilcclxuXHJcbiAgICBibG9ja0FuaW1hdGlvblRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIpXHJcbiAgICB9LCAzMDApXHJcbn0pXHJcblxyXG4vLyBIYW5kbGUgbGluayB3aXRoIHNtb290aCBhbmltYXRpb24gdG8gYW5jaG9yIHBsYWNlIG9uIHRoZSBwYWdlXHJcbmNvbnN0IHNtb290aExpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXj1cIiNcIl0nKVxyXG5mb3IgKGxldCBzbW9vdGhMaW5rIG9mIHNtb290aExpbmtzKSB7XHJcbiAgICBzbW9vdGhMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgY29uc3QgaWQgPSBzbW9vdGhMaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpXHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2lkfWApXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IHRhcmdldE5vZGUub2Zmc2V0VG9wXHJcbiAgICAgICAgICAgIGNvbnN0IGRldmljZU9mZnNldCA9IHdpbmRvdy5vdXRlcldpZHRoID4gNzY4ID8gLTEwMCA6IC0yMFxyXG5cclxuICAgICAgICAgICAgc21vb3RoU2Nyb2xsVG8odGFyZ2V0T2Zmc2V0ICsgZGV2aWNlT2Zmc2V0LCA3MDApXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZXJlJ3Mgbm8gdGFyZ2V0IG5vZGUgZm9yIHNjcm9sbGluZyB0byBwbGFjZS4gVGhlIHNlbGVjdG9yIGlzbid0IGNvcnJlY3QhXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn07XHJcblxyXG4vLyBBbmltYXRpb24gaXRlbXMgd2hlbiB1c2VyIGhhcyBzY3JvbGxlZCBzY3JlZW4gdG8gcGxhY2Ugb2YgaXRlbVxyXG5jb25zdCBjaGVja0FuaW1hdGlvbkVsbXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBhbmltYXRpb25FbG1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5pbWF0aW9uLWVsZW1lbnQnKSlcclxuXHJcbiAgICByZXR1cm4gYW5pbWF0aW9uRWxtcy5sZW5ndGggPiAwXHJcbn1cclxuXHJcbmNvbnN0IHNob3dBbmltRWxlbWVudHMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBlbG1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5pbWF0aW9uLWVsZW1lbnQnKSlcclxuXHJcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXRcclxuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgLy8gY29uc3QgcG9pbnRPZkRpc3BsYXkgPSB3aW5kb3dIZWlnaHQgLyAxLjIgLy8gZm9yIHNob3cgb24gdGhlIGhhbGYgb2YgdGhlIHNjcmVlblxyXG4gICAgY29uc3QgcG9pbnRPZkRpc3BsYXkgPSB3aW5kb3dIZWlnaHRcclxuXHJcbiAgICBlbG1zLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tVG9wID0gcmVjdC50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXRcclxuXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlRnJvbVRvcCAtIHBvaW50T2ZEaXNwbGF5IDwgc2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGlvbi1lbGVtZW50JylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGlmICghY2hlY2tBbmltYXRpb25FbG1zKCkpIHtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2hvd0FuaW1FbGVtZW50cylcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2V0QW5pbWF0aW9uRWxtcyA9ICgpID0+IHtcclxuICAgIGlmIChjaGVja0FuaW1hdGlvbkVsbXMoKSkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChzZXRBbmltYXRpb25FbG1zKVxyXG4gICAgfSwgMTAwKVxyXG59KVxyXG5cclxuLy8gUGhvbmUgbWFza2luZ1xyXG5jb25zdCBpbml0UGhvbmVzTWFzayA9ICgpID0+IHtcclxuICAgIGNvbnN0IHBob25lSW5wdXRzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1cInRlbFwiXTpub3QoLmNhcnRfX2NhbGMgW3R5cGU9XCJ0ZWxcIl0pJykpXHJcblxyXG4gICAgcGhvbmVJbnB1dHMuZm9yRWFjaChwaG9uZSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGhvbmVNYXNrT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbWFzazogJyt7N30gKDAwMCkgMDAwLTAwLTAwJyxcclxuICAgICAgICAgICAgbGF6eTogdHJ1ZSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJDaGFyOiAnIydcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGhvbmVNYXNrID0gSU1hc2soXHJcbiAgICAgICAgICAgIHBob25lLFxyXG4gICAgICAgICAgICBwaG9uZU1hc2tPcHRpb25zXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBwaG9uZS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiBmYWxzZX0pKVxyXG4gICAgICAgIHBob25lLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogdHJ1ZX0pKVxyXG4gICAgfSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoaW5pdFBob25lc01hc2spXHJcbn0pXHJcblxyXG4vLyBGaXhpbmcgY2hhdC0yNCB3aWRnZXQgcG9zaXRpb24gLS0gU1RBUlRcclxubGV0IGNoYXQyNEludGVydmFsSWQgPSBudWxsXHJcbmxldCBjaGF0MjRUaW1lb3V0SWQgPSBudWxsXHJcbmxldCBjaGFydDI0U3R5bGVOb2RlID0gbnVsbFxyXG5sZXQgY2hhcnQyNE5vZGUgPSBudWxsXHJcblxyXG5jb25zdCBmaXhDaGF0MjRXaWRnZXRQb3NpdGlvbiA9ICgpID0+IHtcclxuICAgIGNoYXJ0MjROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2hhdC0yNCcpXHJcblxyXG4gICAgaWYgKCFjaGFydDI0Tm9kZSkgcmV0dXJuXHJcblxyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgMTAyNCAmJiAhY2hhcnQyNFN0eWxlTm9kZSkge1xyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcblxyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAuc3RhcnRCdG4uc3RhcnRCdG4tLW91dHNpZGUuc3RhcnRCdG4tLWJvdHRvbSB7XHJcbiAgICAgICAgICAgICAgICBib3R0b206IDY3cHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLnN0YXJ0QnRuLnN0YXJ0QnRuLS1vcGVuIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg1MCUpIHNjYWxlKDAuNikgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGNoYXJ0MjROb2RlLnNoYWRvd1Jvb3QucHJlcGVuZChjaGFydDI0U3R5bGVOb2RlKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSAxMDI0ICYmIGNoYXJ0MjRTdHlsZU5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2hhcnQyNFN0eWxlTm9kZScsIGNoYXJ0MjRTdHlsZU5vZGUpO1xyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUucmVtb3ZlKClcclxuICAgICAgICBjaGFydDI0U3R5bGVOb2RlID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW50ZXJ2YWwoY2hhdDI0SW50ZXJ2YWxJZClcclxuICAgIGNoYXQyNEludGVydmFsSWQgPSBudWxsXHJcblxyXG4gICAgY2xlYXJUaW1lb3V0KGNoYXQyNFRpbWVvdXRJZClcclxuICAgIGNoYXQyNFRpbWVvdXRJZCA9IG51bGxcclxufVxyXG5cclxuY29uc3QgY2hhdDI0UmVuZGVyTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjaGF0MjRJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoZml4Q2hhdDI0V2lkZ2V0UG9zaXRpb24sIDEwMClcclxufVxyXG5cclxuY29uc3QgaGFyZFJlbW92ZUNoYXQyNFJlbmRlckxpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgY2hhdDI0VGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGNoYXQyNEludGVydmFsSWQpIGNsZWFySW50ZXJ2YWwoY2hhdDI0SW50ZXJ2YWxJZClcclxuICAgIH0sIDEwMDAwKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChjaGF0MjRSZW5kZXJMaXN0ZW5lcik7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoaGFyZFJlbW92ZUNoYXQyNFJlbmRlckxpc3RlbmVyKTtcclxufSlcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCAxMDI0KSB7XHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKGNoYXQyNFJlbmRlckxpc3RlbmVyKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFydDI0U3R5bGVOb2RlKSBjaGFydDI0U3R5bGVOb2RlLnJlbW92ZSgpXHJcbn0pXHJcbi8vIEZpeGluZyBjaGF0LTI0IHdpZGdldCBwb3NpdGlvbiAtLSBGSU5JU0giLCIvKipcclxuICog0KTQu9Cw0LMsINGD0LrQsNC30YvQstCw0Y7RidC40Lkg0L3QsCDRgNC10LbQuNC8INGA0LDQt9GA0LDQsdC+0YLQutC4LlxyXG4gKiBAdHlwZSB7Ym9vbGVhbn1cclxuICpcclxuICog0JTQu9GPINGB0LXRgNCy0LXRgNCwINCy0LXRgNGB0YLQutC4INGB0L7QsdC40YDQsNGC0Ywg0Lgg0L/Rg9GI0LjRgtGMINCyINGA0LXQttC40LzQtSBERVZfTU9ERSA9IHRydWVcclxuICog0J3QsCDQv9GA0L7QtCDQuCDQtNC10LIg0YHQvtCx0LjRgNCw0YLRjCDQuCDQv9GD0YjQuNGC0Ywg0LIg0YDQtdC20LjQvNC1IERFVl9NT0RFID0gZmFsc2VcclxuICpcclxuICog0JIg0YDQtdC20LjQvNC1IERFVl9NT0RFID0gdHJ1ZSwg0L/RgNC4INC70L7QutCw0LvRjNC90L7QuSDRgNCw0LfRgNCw0LHQvtGC0LrQtSxcclxuICog0YLQsNC60LbQtSDQvdC10L7QsdGF0L7QtNC40LzQviDQv9GA0LDQstC40YLRjCDQv9GD0YLRjCDQtNC+INGE0LDQudC70LAgbWFpbi5qc1xyXG4gKlxyXG4gKiDQn9GA0LjQvC46IDxzY3JpcHQgc3JjPVwiaHR0cDovL2xvY2FsaG9zdDrQvdC+0LzQtdGAX9C/0L7RgtCwL2pzL21haW4uanNcIiBkZWZlcj48L3NjcmlwdD5cclxuICovXHJcbmNvbnN0IERFVl9NT0RFID0gd2luZG93Lk1PREUgPT09ICdkZXYnIC8vIGRldiAtIHRydWUsIGJ1aWxkIC0gZmFsc2VcclxuXHJcbi8vIEluaXQgY2FydCBjdXN0b20gRXZlbnRcclxuY29uc3QgY2FydEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjYXJ0VXBkYXRlRXZlbnQnLCB7XHJcbiAgICBkZXRhaWw6IHtcclxuICAgICAgICBtZXNzYWdlOiAnRmlyZWQgY2FydCBwcm9kdWN0IHVwZGF0ZWQgY3VzdG9tIEV2ZW50ISdcclxuICAgIH0sXHJcbiAgICBidWJibGVzOiBmYWxzZSxcclxuICAgIGNhbmNlbGFibGU6IGZhbHNlXHJcbn0pXHJcblxyXG5jb25zdCBub3JtYWxpemVSZXNwb25zZUNhcnREYXRhID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3RzID0gW11cclxuXHJcbiAgICBpZiAoZGF0YS5kb3RzKSB7XHJcbiAgICAgICAgZGF0YS5kb3RzLmZvckVhY2goZG90ID0+IHtcclxuICAgICAgICAgICAgcHJvZHVjdHMucHVzaCh7IGFydGljbGU6IGRvdC5pZCwgY291bnQ6IGRvdC5jb3VudCB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnByb2R1Y3RzKSB7XHJcbiAgICAgICAgZGF0YS5wcm9kdWN0cy5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG4gICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHsgYXJ0aWNsZTogcHJvZHVjdC5hcnRpY2xlLCBjb3VudDogcHJvZHVjdC5jb3VudCB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwcm9kdWN0c1xyXG59XHJcblxyXG4vLyBNZXRob2RzIHRvIHdvcmsgd2l0aCBjYXJ0IGZvciBQUk9EVUNUU1xyXG53aW5kb3cuc2V0UHJvZHVjdFRvQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YnQsNC10Lwg0YTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YLQvtCy0LDRgNCwINCyINC60L7RgNC30LjQvdC1OicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1zZXQuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9zZXQnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YSB9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgdGC0LjQu9C4INGC0L7QstCw0YAg0LIg0LrQvtGA0LfQuNC90LUuINCf0L7Qu9GD0YfQuNC70Lgg0L7RgtCy0LXRgicsIGRhdGEpXHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhXHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgNCw0LfQvNC10YnQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LIg0JrQvtGA0LfQuNC90LUhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZFByb2R1Y3RUb0NhcnQgPSBhc3luYyAoe2FydCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0JTQvtCx0LDQstC70LXQvdC40LUg0YLQvtCy0LDRgNCwINCyINC60L7RgNC30LjQvdGDOicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1hZGQuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9hZGQnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YSB9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQuNC70Lgg0YLQvtCy0LDRgCDQsiDQutC+0YDQt9C40L3Rgy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LUnLCBkYXRhKVxyXG4gICAgICAgIHJldHVybiBkYXRhXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDQtNC+0LHQsNCy0LvQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LIg0JrQvtGA0LfQuNC90YMhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cucmVtb3ZlUHJvZHVjdEZyb21DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgY29uc29sZS5sb2coJ9Cj0LTQsNC70LXQvdC40LUg0YLQvtCy0LDRgNCwINC40Lcg0LrQvtGA0LfQuNC90Ys6JywgYXJ0LCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnYXJ0JywgYXJ0KVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWRlbC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2RlbCcsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KPQtNCw0LvQuNC70Lgg0YLQvtCy0LDRgCDQuNC3INC60L7RgNC30LjQvdGLLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtScsIGRhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRg9C00LDQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQuNC3INCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIE1ldGhvZHMgdG8gd29yayB3aXRoIGNhcnQgZm9yIERPVFNcclxud2luZG93LnNldERvdFRvQ2FydCA9IGFzeW5jICh7aWQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRidCw0LXQvCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQlNC+0YLQvtCyINCyINC60L7RgNC30LjQvdC1OicsIGlkLCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnaWQnLCBpZClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1zZXREb3QuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9zZXQnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YSB9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgdGC0LjQu9C4INCU0L7RgtGLINCyINC60L7RgNC30LjQvdC1LiDQn9C+0LvRg9GH0LjQu9C4INC+0YLQstC10YInLCBkYXRhKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGA0LDQt9C80LXRidC10L3QuNGPINCU0L7RgtC+0LIg0LIg0JrQvtGA0LfQuNC90LUhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZERvdFRvQ2FydCA9IGFzeW5jIChvcmRlcikgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQu9C10L3QuNC1INC00L7RgtCwINCyINC60L7RgNC30LjQvdGDLiDQntGC0L/RgNCw0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LU6Jywgb3JkZXIpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtYWRkRG90Lmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvYWRkRG90JywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkob3JkZXIpIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG4gICAgICAgIHdpbmRvdy5zaG93TW9kYWxNc2coXCLQlNC+0LHQsNCy0LjQu9C4INCU0L7RgiDQsiDQutC+0YDQt9C40L3Rgy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LVcIiwgZGF0YSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LTQvtCx0LDQstC70LXQvdC40Y8g0JTQvtGC0LAg0LIg0JrQvtGA0LfQuNC90YMhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LnJlbW92ZURvdEZyb21DYXJ0ID0gYXN5bmMgKHtpZCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0KPQtNCw0LvQtdC90LjQtSDQlNC+0YLQsCDQuNC3INC60L7RgNC30LjQvdGLOicsIGlkLCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnaWQnLCBpZClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1kZWxEb3QuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9kZWxEb3QnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YSB9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Cj0LTQsNC70LjQu9C4IERvdCDQuNC3INC60L7RgNC30LjQvdGLLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtScsIGRhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRg9C00LDQu9C10L3QuNGPINCU0L7RgtCwINC40Lcg0JrQvtGA0LfQuNC90YshINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIENhcnQgUHJveHlcclxuY29uc3QgY2FydEdldCA9ICh0YXJnZXQsIHByb3ApID0+IHtcclxuICAgIHJldHVybiB0YXJnZXRbcHJvcF1cclxufVxyXG5cclxuY29uc3QgY2FydFNldCA9ICh0YXJnZXQsIHByb3AsIHZhbCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ1NFVFRJTkcnKTtcclxuICAgIGNvbnNvbGUubG9nKCd0YXJnZXQnLCB0YXJnZXQpO1xyXG4gICAgY29uc29sZS5sb2coJ3Byb3AnLCBwcm9wKTtcclxuICAgIGNvbnNvbGUubG9nKCd2YWwnLCB2YWwpO1xyXG5cclxuICAgIGlmIChwcm9wID09PSAncHJvZHVjdHMnKSB7XHJcbiAgICAgICAgdGFyZ2V0LnByb2R1Y3RzID0gWy4uLnZhbF1cclxuXHJcbiAgICAgICAgLy8gRGlzcGF0Y2hpbmcgY3VzdG9tIGNhcnQgdXBkYXRlIEV2ZW50XHJcbiAgICAgICAgY29uc3QgY2FydFByb2R1Y3RDb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FydFByb2R1Y3RDb3VudCcpXHJcbiAgICAgICAgaWYgKGNhcnRQcm9kdWN0Q291bnROb2RlKSBjYXJ0UHJvZHVjdENvdW50Tm9kZS5kaXNwYXRjaEV2ZW50KGNhcnRFdmVudClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2FydCA9IGFzeW5jICgpID0+IHtcclxuICAgIGlmICghd2luZG93LkNBUlQpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWdldC5qc29uJylcclxuICAgICAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9nZXQnLCB7IG1ldGhvZDogJ1BPU1QnIH0pXHJcblxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5DQVJUID0gbmV3IFByb3h5KHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzOiBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBjYXJ0R2V0LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBjYXJ0U2V0XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVEFSVCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVzcG9uc2UgZGF0YScsIGRhdGEpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aW5kb3cuQ0FSVCcsIHdpbmRvdy5DQVJUKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGSU5JU0gnKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRDYXJ0KVxyXG5cclxud2luZG93LmNhcnRVcGRhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuQ0FSVCAhPT0gdW5kZWZpbmVkICYmICFERVZfTU9ERSkge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1nZXQuanNvbicpXHJcbiAgICAgICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZ2V0JywgeyBtZXRob2Q6ICdQT1NUJyB9KVxyXG5cclxuICAgICAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59LCA1MDAwKSJdfQ==
