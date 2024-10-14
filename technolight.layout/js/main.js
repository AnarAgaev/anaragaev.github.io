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
window.customEvent = {
  on: (eventName, eventCallback) => {
    window.document.addEventListener(eventName, eventCallback);
  },
  off: (eventName, eventCallback) => {
    window.document.removeEventListener(eventName, eventCallback);
  },
  once: (eventName, eventCallback) => {
    const handler = (event) => {
      eventCallback(event);
      this.off(eventName, handler);
    };
    this.on(eventName, handler);
  },
  emit: (eventName, eventData) => {
    const event = new CustomEvent(eventName, {
      detail: eventData,
      bubbles: false,
      cancelable: false
    });
    window.document.dispatchEvent(event);
    return event;
  }
};

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

        // console.error('Здесь надо будет написать асинхронный запрос добавления товара в избранные');
        return
    }

    _this.classList.remove('selected')
    headerFavorites.innerText = currentFavoritesCount - 1
    // console.error('Async query to DELETE selected product from Favorites');
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
    const filters = Array.from(document
      .querySelectorAll(".filters__list .filters__item"));

    filters.forEach(filter => {
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
class Informer {
    static _instances

    static getInstances() {
        if (!Informer._instances) {
            Informer._instances = new Informer()
        }
        return Informer._instances
    }

    constructor() {
        this.informer = document.getElementById("informer")
        if (!this.informer) {
            console.warn("На странице отсутствует html обертка для Информера")
            return false
        }
        this.informerBody = this.informer.querySelector(".informer__body")
        this.informerBack = this.informer.querySelector(".informer__back")
        this.informerClose = this.informer.querySelector(".informer__close")
        this.init()
    }
    init() {
        this.btns = Array.from(document.querySelectorAll("span[data-term]"))
        this.initEventListeners()
        return this
    }

    initEventListeners() {
        this.btns.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation()
                e.preventDefault()
                await this.getInformation(btn.dataset.term)
            })
        })

        this.informerBack.addEventListener("click", () => this.hideInformer())
        this.informerClose.addEventListener("click", () => this.hideInformer())
    }

    async getInformation(term) {
        window.spinner.show()

        const formData = new FormData()
        formData.append("term", term)

        const res = DEV_MODE ?
            await fetch("https://anaragaev.github.io/technolight.layout/mocks/inform.html") :
            await fetch("/api/term", {
                method: "POST",
                body: formData
            })

        if (res.ok) {
            const html = await res.text()
            this.updateInformerContent(html)
        } else {
            console.warn("Не удалось получить информацию для Термина", term)
            setTimeout(window.spinner.hide, 300)
        }
    }

    updateInformerContent(data) {
        const informerContent = this.informer.querySelector(".informer__content")

        while (informerContent.firstChild) {
            informerContent.removeChild(informerContent.firstChild)
        }

        informerContent.innerHTML = data
        this.showInformer()
        setTimeout(window.spinner.hide, 300)
    }

    showInformer() {
        this.informer.classList.add("visible")

        setTimeout(() => {
            this.informerBack.classList.add("visible")
            this.informerBody.classList.add("visible")
        }, 100)
    }

    hideInformer() {
        this.informerBack.classList.remove("visible")
        this.informerBody.classList.remove("visible")

        setTimeout(() => this.informer.classList.remove("visible"), 500)
    }
}
window.initInformers = () => Informer.getInstances().init()
window.addEventListener("load", () => window.informer = window.initInformers())
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

    if (document.querySelectorAll('.product-info .swiper').length === 0) return

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
        window.safeCall(checkProductInfoSlider)
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

    if (document.querySelectorAll('.recommendation__slider .swiper').length === 0) return

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
        window.safeCall(checkProductRecommSlider)
        window.safeCall(checkSlidersBottomOffset)
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
    navToggler.addEventListener('click', function () {
        if (this.classList.contains('active')) {
            toggleNav(false)
            return
        }

        toggleNav(true)
    })

    // Click on navigation close button
    navClose.forEach(btn => {
        btn.addEventListener('click', () => toggleNav(false))
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
        btn.addEventListener('click', function () {
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
        searchInput.focus()
    })

    searchClose.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
    })

    // const SEARCH_REQUEST_URL = 'https://anaragaev.github.io/technolight.layout/mocks/search.json'
    // const SEARCH_REQUEST_URL = 'https://test-technolightv2.massive.ru/api/product/search'

    const SEARCH_REQUEST_URL = '/api/product/search'
    // const SEARCH_REQUEST_URL = 'https://technolight.ru/api/product/search'
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

    const fetchSearchingData = async (query) => {
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

    function searchHandlerFormHelpersEventListeners() {
        if (this.value === '') {
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
    }
    
    searchInput.addEventListener('input', searchHandlerFormHelpersEventListeners)
    searchInput.addEventListener('focus', searchHandlerFormHelpersEventListeners)

    searchReset.addEventListener('click', (e) => {
        e.stopPropagation()
        searchReset.classList.remove('visible')
        searchHints.classList.remove('visible')
        resetHandlerFormHelpersEventListeners()
        document.body.classList.remove('modal-open')
    })

    document.querySelector('.header__search-form').addEventListener('submit', e => {
        e.preventDefault()
        try {
            let link = document.querySelector('.header__search-links a')?.getAttribute('href');
            if (link && link !== "#") {
                if (!link.startsWith('http')) {
                    //приводим к абсолютному пути
                    link = window.location.origin + `${link}`;
                }
                const url = new URL(link)
                url.searchParams.set('search', searchInput.value)
                console.log(url.href)
                setTimeout(() => {
                    window.location.href = url.href
                }, 500)
            }
        } catch (error) {
            console.warn(error)
        }
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

    // Toggle search panel
    const currentUrl = new URL(window.location.href)
    if (currentUrl.searchParams.has('search')) {
        searchInput.value = currentUrl.searchParams.get('search')
        toggleSearchPanel()
    }
})

// Cart update listening
const setCartUpdateListener = () => {
    const cartProductCountNode = document.querySelector('#cartProductCount')

    if (!cartProductCountNode) return

    cartProductCountNode.addEventListener('cartUpdateEvent', function (e) {

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

        if (!isTarget) closeAllTogglers()
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

window.addEventListener("DOMContentLoaded", () => {
    window.safeCall(showAnimElements)
    window.safeCall(setAnimationElms)
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
            products.push({article: dot.id, count: dot.count})
        });
    }

    if (data.products) {
        data.products.forEach(product => {
            products.push({article: product.article, count: product.count})
        });
    }

    return products
}

// Methods to work with cart for PRODUCTS
window.setProductToCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Размещаем фиксированное количество товара в корзине:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-set.json')
        : await fetch('/ajax/cart/set', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Разместили товар в корзине. Получили ответ', data)

        return data

    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка размещения товара в Корзине! Код ошибки:', res.status)
    }
}

window.addProductToCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Добавление товара в корзину:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-add.json')
        : await fetch('/ajax/cart/add', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Добавили товар в корзину. Получили данные', data)
        return data
    } else {
        // console.error('Ошибка добавления товара в Корзину! Код ошибки:', res.status)
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
    }
}

window.removeProductFromCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Удаление товара из корзины:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-del.json')
        : await fetch('/ajax/cart/del', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Удалили товар из корзины. Получили данные', data);
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка удаления товара из Корзины! Код ошибки:', res.status)
    }
}

// Methods to work with cart for DOTS
window.setDotToCart = async ({id, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Размещаем фиксированное количество Дотов в корзине:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-setDot.json')
        : await fetch('/ajax/cart/set', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Разместили Доты в корзине. Получили ответ', data);

    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка размещения Дотов в Корзине! Код ошибки:', res.status)
    }
}

window.addDotToCart = async (order) => {
    window.safeCall(window.spinner.show)

    // console.log('Добавление дота в корзину. Отправляем данные:', order)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-addDot.json')
        : await fetch('/ajax/cart/addDot', {method: 'POST', body: JSON.stringify(order)})

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

    // console.log('Удаление Дота из корзины:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-delDot.json')
        : await fetch('/ajax/cart/delDot', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Удалили Dot из корзины. Получили данные', data);
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка удаления Дота из Корзины! Код ошибки:', res.status)
    }
}


// Cart Proxy
const cartGet = (target, prop) => {
    return target[prop]
}

const cartSet = (target, prop, val) => {


    if (prop === 'products') {
        // Проверьте, отличается ли новое значение от старого значения.
        const is_same = (target.products.length === val.length) && target.products.every(
            function (element, index) {
                return element.article === val[index].article && element.count === val[index].count;
            }
        );
        if (!is_same) {
            // console.log('SETTING');
            // console.log('target', target);
            // console.log('prop', prop);
            // console.log('val', val);

            target.products = [...val];
            cartEvent.detail.products = target.products;
            // Dispatching custom cart update Event
            const cartProductCountNode = document.querySelector("#cartProductCount");
            if (cartProductCountNode) cartProductCountNode.dispatchEvent(cartEvent);
        }
    }

    return true
}

const initCart = async () => {
    if (!window.CART) {

        const res = DEV_MODE
            ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-get.json')
            : await fetch('/ajax/cart/get', {method: 'POST'})

        if (res.ok) {
            const data = await res.json()

            window.CART = new Proxy({
                products: [...normalizeResponseCartData(data)]
            }, {
                get: cartGet,
                set: cartSet
            })

            // console.log('Инициализируем корзину -------------------------- START');
            // console.log('Response data', data)
            // console.log('window.CART', window.CART)
            // console.log('Инициализируем корзину -------------------------- FINISH');

        } else {
            console.error('Ошибка запроса Корзины! Код ошибки:', res.status)
        }
    }
}

window.addEventListener('load', initCart)

// setTimeout(() => {
//     // откладываем на 1 минуту
//     window.cartUpdateInterval = setInterval(async () => {
//         if (window.CART !== undefined && !DEV_MODE) {
//             const res = await fetch('/ajax/cart/get', {method: 'POST'})
//             if (res.ok) {
//                 const data = await res.json()
//                 window.CART.products = [...normalizeResponseCartData(data)]
//             }
//         }
//     }, 30000)
// }, 60000)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJkZWJvdW5jZS5qcyIsImRvd25sb2FkRmlsZS5qcyIsImV2ZW50LmpzIiwiZm9ybWF0TnVtYmVyLmpzIiwiZ2V0VXJsUGFyYW1ldGVyQnlOYW1lLmpzIiwic2F2ZUNhbGwuanMiLCJzbW9vdGhTY3JvbGxUby5qcyIsInRocm90dGxlLmpzIiwidmFsaWRhdGVFbWFpbC5qcyIsInZhbGlkYXRlUGhvbmUuanMiLCJhY2NvdW50LWZvcm1zL3NjcmlwdC5qcyIsImNhcmRzLWl0ZW0vc2NyaXB0LmpzIiwiY2FyZHMtc2VyaWVzL3NjcmlwdC5qcyIsImZpbHRlcnMvc2NyaXB0LmpzIiwiaW5mb3JtZXIvc2NyaXRwLmpzIiwibW9kYWxzL3NjcmlwdC5qcyIsInByb2R1Y3QtaW5mby9zY3JpcHQuanMiLCJyZWNvbW1lbmRhdGlvbi9zY3JpcHQuanMiLCJzY3JvbGwtdG8tdG9wL3NjcmlwdC5qcyIsInNob3ctbW9kYWwtbXNnL3NjcmlwdC5qcyIsInNwaW5uZXIvc2NyaXB0LmpzIiwiZm9vdGVyL3NjcmlwdC5qcyIsImhlYWRlci9zY3JpcHQuanMiLCJtYWluLmpzIiwiY2FydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ2xlYXIgcGhvbmUgb2Ygc3BhY2VzLCBicmFja2V0cyxcclxuICogZGFzaGVzIGFuZCBwbHVzIHNpZ24uIExlYXZlIG9ubHkgbnVtYmVycy5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHBob25lIC0gVGhlIHBob25lLCB0aGF0IG5lZWRzIHRvIGNsZWFyLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFBob25lIG51bWJlciBhcyBhIG51bWJlciB0eXBlLlxyXG4gKi9cclxud2luZG93LmNsZWFyUGhvbmUgPSAocGhvbmUpID0+IHtcclxuICAgIHJldHVybiBwYXJzZUludChwaG9uZS5yZXBsYWNlKC9cXEQvZywgXCJcIikpXHJcbn1cclxuIiwid2luZG93LmRlYm91bmNlID0gKGZ1bmMsIG1zKSA9PiB7XHJcbiAgICBsZXQgdGltZW91dElkXHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzXHJcbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50c1xyXG5cclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKVxyXG5cclxuICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxyXG4gICAgICAgIH0sIG1zKVxyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxuICogRG93bmxvYWRzIGEgZmlsZSBmcm9tIHRoZSBzcGVjaWZpZWQgVVJMIGFuZCB0cmlnZ2VycyBhIGRvd25sb2FkIGluIHRoZSBicm93c2VyLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgZmlsZSB0byBiZSBkb3dubG9hZGVkLlxuICovXG53aW5kb3cuZG93bmxvYWRGaWxlID0gKHVybCwgZmlsZW5hbWU9bnVsbCwgZGVmYXVsdEV4dGVuc2lvbiA9ICdiaW4nKSAgPT4ge1xuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwgfHwgdXJsID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8g0J/QvtC60LDQt9Cw0YLRjCDRgdC/0LjQvdC90LXRgFxuICAgIGlmICh3aW5kb3cuc3Bpbm5lciAmJiB0eXBlb2Ygd2luZG93LnNwaW5uZXIuc2hvdyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHdpbmRvdy5zcGlubmVyLnNob3coKTtcbiAgICB9XG5cbiAgICAvLyDQodC+0LfQtNCw0LXQvCDQvdC+0LLRi9C5IFhNTEh0dHBSZXF1ZXN0XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XG5cbiAgICAvLyDQntCx0YDQsNCx0L7RgtGH0LjQuiDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQt9Cw0LPRgNGD0LfQutC4XG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAvLyDQn9C+0L/Ri9GC0LrQsCDQv9C+0LvRg9GH0LjRgtGMINGA0LDRgdGI0LjRgNC10L3QuNC1INC40Lcg0LfQsNCz0L7Qu9C+0LLQutC+0LJcbiAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSBkZWZhdWx0RXh0ZW5zaW9uO1xuICAgICAgICAgICAgY29uc3QgY29udGVudERpc3Bvc2l0aW9uID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50RGlzcG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGNvbnRlbnREaXNwb3NpdGlvbi5tYXRjaCgvZmlsZW5hbWU9XCI/KCguKilcXC4oLiopKVwiPy8pO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaFsxXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IG1hdGNoWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0KHQvtC30LTQsNC10LwgVVJMINC00LvRjyDQt9Cw0LPRgNGD0LbQtdC90L3QvtCz0L4g0YTQsNC50LvQsFxuICAgICAgICAgICAgY29uc3QgYmxvYlVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoeGhyLnJlc3BvbnNlKTtcblxuICAgICAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0LLRgNC10LzQtdC90L3Ri9C5INGN0LvQtdC80LXQvdGCIDxhPiDQtNC70Y8g0YHQutCw0YfQuNCy0LDQvdC40Y8g0YTQsNC50LvQsFxuICAgICAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgYS5ocmVmID0gYmxvYlVybDtcbiAgICAgICAgICAgIGEuZG93bmxvYWQgPSBgJHtmaWxlbmFtZX0uJHtleHRlbnNpb259YDsgLy8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LjQvNGPINGE0LDQudC70LAg0YEg0YDQsNGB0YjQuNGA0LXQvdC40LXQvFxuXG4gICAgICAgICAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YIg0LIgRE9NINC4INC40L3QuNGG0LjQuNGA0YPQtdC8INGB0LrQsNGH0LjQstCw0L3QuNC1XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICAgICAgYS5jbGljaygpO1xuXG4gICAgICAgICAgICAvLyDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgiDQuNC3IERPTVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcblxuICAgICAgICAgICAgLy8g0J7RgdCy0L7QsdC+0LbQtNCw0LXQvCBVUkwg0L7QsdGK0LXQutGC0LBcbiAgICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoYmxvYlVybCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQodC60YDRi9GC0Ywg0YHQv9C40L3QvdC10YBcbiAgICAgICAgaWYgKHdpbmRvdy5zcGlubmVyICYmIHR5cGVvZiB3aW5kb3cuc3Bpbm5lci5oaWRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyDQntCx0YDQsNCx0L7RgtGH0LjQuiDQvtGI0LjQsdC+0LpcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwi0J7RiNC40LHQutCwINC/0YDQuCDQt9Cw0LPRgNGD0LfQutC1INGE0LDQudC70LBcIik7XG5cbiAgICAgICAgLy8g0KHQutGA0YvRgtGMINGB0L/QuNC90L3QtdGAINCyINGB0LvRg9GH0LDQtSDQvtGI0LjQsdC60LhcbiAgICAgICAgaWYgKHdpbmRvdy5zcGlubmVyICYmIHR5cGVvZiB3aW5kb3cuc3Bpbm5lci5oaWRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQt9Cw0L/RgNC+0YFcbiAgICB4aHIuc2VuZCgpO1xufSIsIndpbmRvdy5jdXN0b21FdmVudCA9IHtcbiAgb246IChldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spID0+IHtcbiAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spO1xuICB9LFxuICBvZmY6IChldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spID0+IHtcbiAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spO1xuICB9LFxuICBvbmNlOiAoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgZXZlbnRDYWxsYmFjayhldmVudCk7XG4gICAgICB0aGlzLm9mZihldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG4gICAgdGhpcy5vbihldmVudE5hbWUsIGhhbmRsZXIpO1xuICB9LFxuICBlbWl0OiAoZXZlbnROYW1lLCBldmVudERhdGEpID0+IHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcbiAgICAgIGRldGFpbDogZXZlbnREYXRhLFxuICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHdpbmRvdy5kb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cbn07XG4iLCIvKipcclxuICogRm9ybWF0dGluZyBudW1iZXIgdG8gdGhlIGxvY2FsIHZhbHVlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyfSBudW1iZXIgLSBWYWx1ZSBmb3IgZm9ybWF0dGluZy5cclxuICovXHJcblxyXG53aW5kb3cuZm9ybWF0TnVtYmVyID0gKG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUludChudW1iZXIudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMvZywgXCJcIikpXHJcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIiBcIik7XHJcbn1cclxuIiwiLyoqXHJcbiAqIEdldHRpbmcgZ2V0IHBhcmFtZXRlciBmcm9tIHRoZSB1cmxcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2VhcmNoIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtzdHJpbmd9IFt1cmxdIC0gVGhlIFVSTCBhZGRyZXNzLiBJZiB0aGlzIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCB0aGVuIHRoZSBzZWFyY2gsIGJ5IGRlZmF1bHQsIHdpbGwgb2NjdXIgaW4gdGhlIGN1cnJlbnQgVVJMLlxyXG4gKi9cclxud2luZG93LmdldFVybFBhcmFtZXRlckJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUsIHVybCkge1xyXG4gICAgaWYgKCFuYW1lKSByZXR1cm5cclxuXHJcbiAgICBpZiAoIXVybCkgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKVxyXG5cclxuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsXHJcblxyXG4gICAgaWYgKCFyZXN1bHRzWzJdKSByZXR1cm4gJydcclxuXHJcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSlcclxufVxyXG4iLCIvKipcbiAqINCx0LXQt9C+0L/QsNGB0L3Ri9C5INCy0YvQt9C+0LIg0YTRg9C90LrRhtC40LhcbiAqIEBwYXJhbSBmbiBmdW5jdGlvblxuICogQHBhcmFtIHsoKnwqKVtdW119IGFyZ3NcbiAqL1xud2luZG93LnNhZmVDYWxsID0gZnVuY3Rpb24oZm4sIC4uLmFyZ3MpIHtcbiAgdHJ5IHtcbiAgICBmbi5jYWxsKHRoaXMgfHwgd2luZG93LCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltTYWZlIENhbGxdOiBcIiwgZm4sIGUpO1xuICB9XG59OyIsIi8qKlxyXG4gKiBTbW9vdGhseSBzY3JvbGxzIHRoZSBwYWdlIHRvIHRoZSBzcGVjaWZpZWQgcG9zaXRpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBwb3NpdGlvbiB0byBzY3JvbGwgdG8uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb249NTAwXSAtIFRoZSBkdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uIGluIG1pbGxpc2Vjb25kcy5cclxuICovXHJcbmZ1bmN0aW9uIHNtb290aFNjcm9sbFRvKHBvc2l0aW9uLCBkdXJhdGlvbiA9IDUwMCkge1xyXG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb25cclxuICAgIGxldCBzdGFydFRpbWVzdGFtcCA9IG51bGxcclxuXHJcbiAgICBmdW5jdGlvbiBzdGVwKHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICghc3RhcnRUaW1lc3RhbXApIHN0YXJ0VGltZXN0YW1wID0gdGltZXN0YW1wXHJcblxyXG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gdGltZXN0YW1wIC0gc3RhcnRUaW1lc3RhbXBcclxuICAgICAgICBjb25zdCBzY3JvbGxZID0gZWFzZUluT3V0Q3ViaWMocHJvZ3Jlc3MsIHN0YXJ0UG9zaXRpb24sIGRpc3RhbmNlLCBkdXJhdGlvbilcclxuXHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbFkpXHJcblxyXG4gICAgICAgIGlmIChwcm9ncmVzcyA8IGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZWFzZUluT3V0Q3ViaWModCwgYiwgYywgZCkge1xyXG4gICAgICAgIHQgLz0gZFxyXG4gICAgICAgIHQtLVxyXG4gICAgICAgIHJldHVybiBjICogKHQgKiB0ICogdCArIDEpICsgYlxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxufVxyXG4iLCJ3aW5kb3cudGhyb3R0bGUgPSAoZnVuYywgbXMpID0+IHtcclxuICAgIGxldCBpc1Rocm90dGxlZCA9IGZhbHNlLFxyXG4gICAgICAgIHNhdmVkQXJncyxcclxuICAgICAgICBzYXZlZFRoaXNcclxuXHJcbiAgICBmdW5jdGlvbiB3cmFwcGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoaXNUaHJvdHRsZWQpIHsgLy8gMlxyXG4gICAgICAgICAgICBzYXZlZEFyZ3MgPSBhcmd1bWVudHNcclxuICAgICAgICAgICAgc2F2ZWRUaGlzID0gdGhpc1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSAvLyAxXHJcblxyXG4gICAgICAgIGlzVGhyb3R0bGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpc1Rocm90dGxlZCA9IGZhbHNlIC8vIDNcclxuICAgICAgICAgICAgaWYgKHNhdmVkQXJncykge1xyXG4gICAgICAgICAgICAgICAgd3JhcHBlci5hcHBseShzYXZlZFRoaXMsIHNhdmVkQXJncylcclxuICAgICAgICAgICAgICAgIHNhdmVkQXJncyA9IHNhdmVkVGhpcyA9IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIG1zKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3cmFwcGVyXHJcbn0iLCIvKipcclxuICogRW1haWwgYWRkcmVzcyB2ZXJpZmljYXRpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsLCB0aGF0IG5lZWRzIHRvIHZhbGlkYXRpbmcuXHJcbiAqL1xyXG53aW5kb3cudmFsaWRhdGVFbWFpbCA9IChlbWFpbCkgPT4ge1xyXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBlbWFpbFxyXG4gICAgY29uc3QgZW1haWxSZWdleCA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvXHJcbiAgICByZXR1cm4gZW1haWxSZWdleC50ZXN0KGVtYWlsKVxyXG59XHJcbiIsIi8qKlxyXG4gKiBQaG9uZSBudW1iZXIgdmVyaWZpY2F0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZSAtIFRoZSBwaG9uZSwgdGhhdCBuZWVkcyB0byB2YWxpZGF0aW5nLlxyXG4gKi9cclxud2luZG93LnZhbGlkYXRlUGhvbmUgPSAocGhvbmUpID0+IHtcclxuICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgcGhvbmVcclxuICAgIGNvbnN0IHBob25lUmVnZXggPSAvXjdcXGR7MTB9JC9cclxuICAgIHJldHVybiBwaG9uZVJlZ2V4LnRlc3QocGhvbmUpXHJcbn1cclxuIiwiY29uc3QgaW5pdFRvZ2dsZVZpc2libGVGb3JtUGFzcyA9ICgpID0+IHtcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9nZ2xlLXZpc2libGUtcGFzcycpKVxuXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxuICAgICAgICBjb25zdCBpc1RleHQgPSBpbnB1dC50eXBlID09PSAndGV4dCdcblxuICAgICAgICBpbnB1dC50eXBlID0gaXNUZXh0ID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0J1xuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ3Bhc3MtdmlzaWJsZScpXG4gICAgfSkpXG59XG5cbi8vIGNvbnN0IHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUpID0+IHtcbi8vICAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUuY2xvc2VzdCgnbGFiZWwnKVxuLy8gICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxuLy8gfVxuXG4vLyBjb25zdCBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyID0gKGlucHV0Tm9kZSwgZXJyb3JUZXh0KSA9PiB7XG4vLyAgICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLmNsb3Nlc3QoJ2xhYmVsJylcbi8vICAgICBjb25zdCBtZXNzYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJylcblxuLy8gICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxuLy8gICAgIG1lc3NhZ2UuaW5uZXJUZXh0ID0gZXJyb3JUZXh0XG5cbi8vICAgICBpbnB1dE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4vLyAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxuLy8gICAgIH0pXG4vLyB9XG5cbi8vIGNvbnN0IGluaXRBY2NvdW50Rm9ybSA9ICgpID0+IHtcbi8vICAgICBjb25zdCBmb3JtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY291bnQtZm9ybV9fZm9ybScpKVxuLy8gICAgIGlmIChmb3Jtcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4vLyAgICAgZm9ybXMuZm9yRWFjaChmb3JtID0+IGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuLy8gICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuLy8gICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB7ZW1haWw6IHRydWUsIHBhc3M6IHRydWUsIH1cbi8vICAgICAgICAgY29uc3QgZW1haWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZW1haWxcIl0nKVxuLy8gICAgICAgICBjb25zdCBwYXNzICA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXNzXCJdJylcbi8vICAgICAgICAgY29uc3QgZm9ybVR5cGUgPSB0aGlzLmRhdGFzZXQuZm9ybVR5cGVcblxuLy8gICAgICAgICByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIoZW1haWwpXG4vLyAgICAgICAgIGlmIChmb3JtVHlwZSAhPT0gJ3JlY292ZXJ5Jykge1xuLy8gICAgICAgICAgICAgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKHBhc3MpXG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICAvLyBDaGVjayBlbWFpbFxuLy8gICAgICAgICBpZiAoZW1haWwudmFsdWUgIT09ICcnKSB7XG4vLyAgICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlRW1haWwoZW1haWwudmFsdWUpKSB7XG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gdHJ1ZVxuLy8gICAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2Vcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIoZW1haWwsICfQndC10L7QsdGF0L7QtNC40LzQviDRg9C60LDQt9Cw0YLRjCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyEnKVxuLy8gICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2Vcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIC8vIENoZWNrIHBhc3Ncbi8vICAgICAgICAgaWYgKGZvcm1UeXBlICE9PSAncmVjb3ZlcnknKSB7XG4vLyAgICAgICAgICAgICBpZiAocGFzcy52YWx1ZS5sZW5ndGggPCA4KSB7XG4vLyAgICAgICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihwYXNzLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC/0LDRgNC+0LvRjC4g0JTQu9C40L3QvdCwINC/0LDRgNC+0LvRjyDQtNC+0LvQttC90LAg0LHRi9GC0Ywg0L3QtSDQvNC10L3QtdC1IDgg0YHQuNC80LLQvtC70L7QsiEnKVxuLy8gICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5wYXNzID0gZmFsc2Vcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIC8vIFNlbmdpbmcgZm9ybSBkYXRhXG4vLyAgICAgICAgIGlmIChmb3JtVmFsaWQuZW1haWwgJiYgZm9ybVZhbGlkLnBhc3MpIHtcbi8vICAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xuXG4vLyAgICAgICAgICAgICAvLyDQntCx0Y/Qt9Cw0YLQtdC70YzQvdC+INGD0LTQsNC70LjRgtGMINC/0L7RgdC70LUg0LLQvdC10LTRgNC10L3QuNGPXG4vLyAgICAgICAgICAgICBmb3IgKGxldCBbbmFtZSwgdmFsdWVdIG9mIGZvcm1EYXRhKSB7XG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7bmFtZX06ICR7dmFsdWV9YCk7XG4vLyAgICAgICAgICAgICB9XG5cbi8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyByZXF1ZXN0IGZvciB1cGRhdGluZyB1c2VyIGRhdGEnKTtcbi8vICAgICAgICAgfVxuLy8gICAgIH0pKVxuLy8gfVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAvLyBpbml0QWNjb3VudEZvcm0oKVxuICAgIGluaXRUb2dnbGVWaXNpYmxlRm9ybVBhc3MoKVxufSkiLCIvLyBBZGQgcHJvZHVjdCB0byBmYXZvcml0ZXNcclxuY29uc3QgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSBlLnRhcmdldFxyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IF90aGlzLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBfdGhpcy5kYXRhc2V0LnRpdGxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gX3RoaXMuZGF0YXNldC5tZXNzYWdlXHJcbiAgICBjb25zdCBoZWFkZXJGYXZvcml0ZXMgPSBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idXR0b25zLWxpbmtfZmF2b3JpdGVzIC5oZWFkZXJfX2J1dHRvbnMtY291bnQnKVxyXG4gICAgY29uc3QgY3VycmVudEZhdm9yaXRlc0NvdW50ID0gcGFyc2VJbnQoaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dClcclxuXHJcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHtcclxuICAgICAgICBfdGhpcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dCA9IGN1cnJlbnRGYXZvcml0ZXNDb3VudCArIDFcclxuICAgICAgICBoZWFkZXJGYXZvcml0ZXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gaGVhZGVyRmF2b3JpdGVzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcign0JfQtNC10YHRjCDQvdCw0LTQviDQsdGD0LTQtdGCINC90LDQv9C40YHQsNGC0Ywg0LDRgdC40L3RhdGA0L7QvdC90YvQuSDQt9Cw0L/RgNC+0YEg0LTQvtCx0LDQstC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINC40LfQsdGA0LDQvdC90YvQtScpO1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIF90aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgIGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQgPSBjdXJyZW50RmF2b3JpdGVzQ291bnQgLSAxXHJcbiAgICAvLyBjb25zb2xlLmVycm9yKCdBc3luYyBxdWVyeSB0byBERUxFVEUgc2VsZWN0ZWQgcHJvZHVjdCBmcm9tIEZhdm9yaXRlcycpO1xyXG59XHJcblxyXG5jb25zdCBpbml0QWRkVG9GYXZvcml0ZXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdC1pdGVtX19mYXZvcml0ZXMnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFRvRmF2b3JpdGVzQ2xpY2tIYW5kbGVyKSlcclxufVxyXG5cclxuLy8gQWRkIHByb2R1Y3QgdG8gY2FydFxyXG5jb25zdCBhZGRUb0NhcnRDbGlja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSBlLnRhcmdldFxyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IF90aGlzLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBfdGhpcy5kYXRhc2V0LnRpdGxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gX3RoaXMuZGF0YXNldC5tZXNzYWdlXHJcblxyXG4gICAgaWYgKCFpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgX3RoaXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICAgICAgLy8gUHVzaCBjdXJyZW50IHByb2R1Y3QgdG8gQ2FydCBHbG9iYWwgT2JqZWN0ICh3aW5kb3cuQ0FSVClcclxuICAgICAgICB3aW5kb3cuYWRkUHJvZHVjdFRvQ2FydCh7IGFydDogX3RoaXMuZGF0YXNldC5wcm9kdWN0SWQsIGNvdW50OiAxIH0pXHJcblxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIF90aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgJ9Cj0LTQsNC70LXQvSDQuNC3INC60L7RgNC30LjQvdGLJylcclxuXHJcbiAgICAvLyBSZW1vdmUgY3VycmVudCBwcm9kdWN0IGZyb20gQ2FydCBHbG9iYWwgT2JqZWN0ICh3aW5kb3cuQ0FSVClcclxuICAgIHdpbmRvdy5yZW1vdmVQcm9kdWN0RnJvbUNhcnQoeyBhcnQ6IF90aGlzLmRhdGFzZXQucHJvZHVjdElkLCBjb3VudDogMSB9KVxyXG59XHJcbmNvbnN0IGluaXRBZGRUb0NhcnQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdC1pdGVtX19jYXJ0JykpXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGJ0biA9PiBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRUb0NhcnRDbGlja0hhbmRsZXIpKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRBZGRUb0Zhdm9yaXRlcygpXHJcbiAgICBpbml0QWRkVG9DYXJ0KClcclxufSkiLCJcclxuY29uc3QgcmVzZXRBbGxDYXJkc1BpY3MgPSAobm9kZSkgPT4ge1xyXG4gICAgY29uc3QgcGljcyA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX19waWMnKSlcclxuICAgIHBpY3MuZm9yRWFjaChub2RlID0+IG5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsQ2FyZHNUYWJzID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IHRhYnMgPSBBcnJheS5mcm9tKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fdGFiJykpXHJcbiAgICB0YWJzLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG59XHJcblxyXG5jb25zdCBnZXRUYXJnZXRDYXJkc1BpYyA9IChub2RlLCBkYXRhVGFyZ2V0VHlwZVZhbCkgPT4ge1xyXG4gICAgcmV0dXJuIG5vZGUucXVlcnlTZWxlY3RvcihgW2RhdGEtdHlwZT0ke2RhdGFUYXJnZXRUeXBlVmFsfV1gKVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2FyZHNUYWIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0YWJBcnIgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3RhYicpKVxyXG5cclxuICAgIHRhYkFyci5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuY2xvc2VzdCgnLmNhcmRzLXNlcmllc19faXRlbScpXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFBpY1R5cGUgPSB0aGlzLmRhdGFzZXQudGFyZ2V0VHlwZVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQaWMgPSBnZXRUYXJnZXRDYXJkc1BpYyhwYXJlbnQsIHRhcmdldFBpY1R5cGUpXHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWN0aXZlIHRhYlxyXG4gICAgICAgICAgICByZXNldEFsbENhcmRzVGFicyhwYXJlbnQpXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWN0aXZlIGltYWdlXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRQaWMpIHtcclxuICAgICAgICAgICAgICAgIHJlc2V0QWxsQ2FyZHNQaWNzKHBhcmVudClcclxuICAgICAgICAgICAgICAgIHRhcmdldFBpYy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdENhcmRzVGFiKVxyXG4iLCIvLyBGaWx0ZXJzXG5jb25zdCBzaG93Tm9GaWx0ZXJNc2cgPSAoKSA9PiB7XG4gIHRyeSB7XG5cblxuICAgIGNvbnN0IG1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25fX21zZ1wiKTtcblxuICAgIGlmICghbXNnKSByZXR1cm47XG4gICAgbXNnLmNsYXNzTGlzdC5hZGQoXCJkaXNwbGF5XCIpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbXNnLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAxMDApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGhpZGVOb0ZpbHRlck1zZyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBtc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uX19tc2dcIik7XG5cbiAgICBpZiAoIW1zZykgcmV0dXJuO1xuXG4gICAgbXNnLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgIG1zZy5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzcGxheVwiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBjaGVja05vRmlsdGVyTXNnID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXTpub3QoLmhpZGUpXCIpO1xuXG4gICAgaXRlbXMubGVuZ3RoID09PSAwXG4gICAgICA/IHNob3dOb0ZpbHRlck1zZygpXG4gICAgICA6IGhpZGVOb0ZpbHRlck1zZygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGhpZGVGaWx0ZXJMaXN0ID0gKGZpbHRlckxpc3QpID0+IHtcbiAgdHJ5IHtcbiAgICBmaWx0ZXJMaXN0LmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHBlZFwiKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIiksIDMwMCk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3Qgc2hvd0ZpbHRlckRyb3AgPSAobm9kZSkgPT4ge1xuICB0cnkge1xuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IG5vZGUuY2xhc3NMaXN0LmFkZChcImRyb3BwZWRcIiksIDEwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBoaWRlRmlsdGVyRHJvcCA9IChub2RlKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZmlsdGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19pdGVtXCIpKTtcblxuICAgIGlmICghbm9kZSkge1xuICAgICAgaGlkZUZpbHRlckxpc3QoZmlsdGVycyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNsZWFuZWRGaWx0ZXJzID0gZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+IGZpbHRlciAhPT0gbm9kZSk7XG4gICAgaGlkZUZpbHRlckxpc3QoY2xlYW5lZEZpbHRlcnMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGluaXRGaWx0ZXJzRHJvcCA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmaWx0ZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fbGlzdCAuZmlsdGVyc19faXRlbVwiKSk7XG5cbiAgICBmaWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIGZpbHRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XG5cbiAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgaGlkZUZpbHRlckRyb3AoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlRmlsdGVyRHJvcCh0aGlzKTtcbiAgICAgICAgc2hvd0ZpbHRlckRyb3AodGhpcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBpbml0RmlsdGVyc1Jlc2V0ID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtY2F0YWxvZ1wiKTtcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuO1xuXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbHRlcnNfX3Jlc2V0IC5maWx0ZXJzX19pdGVtXCIpO1xuXG4gICAgaWYgKCFyZXNldCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZmlsdGVyZWRTZWN0aW9uID0gZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIik7XG5cbiAgICByZXNldC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNsb3Nlc3QoXCIuZmlsdGVyc1wiKTtcblxuICAgICAgY29uc3Qgc2libGluZ0ZpbHRlcnMgPSBjb250YWluZXJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fbGlzdCAuZmlsdGVyc19faXRlbVwiKTtcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fb3B0aW9uc1wiKSk7XG5cbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzIGlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl06bm90KFt2YWx1ZT1cXFwicmVzZXRcXFwiXSlcIikpO1xuXG4gICAgICBjb25zdCBjYXJkcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xuXG4gICAgICBjb25zdCBkZWxldGVkVHlwZXMgPSBKU09OLnBhcnNlKGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZGVsZXRlZC10eXBlc11cIilcbiAgICAgICAgLmRhdGFzZXQuZGVsZXRlZFR5cGVzKTtcblxuICAgICAgaGlkZUZpbHRlckxpc3Qoc2libGluZ0ZpbHRlcnMpO1xuICAgICAgc3Bpbm5lci5zaG93KCk7XG4gICAgICBmaWx0ZXJlZFNlY3Rpb24uZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKFwiZmlsdGVyaW5nXCIpKTtcbiAgICAgIG9wdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiY2hlY2tlZFwiKSk7IC8vIGhpZGUgcnNldCBvcHRpb24gYnV0dG9uXG4gICAgICBjb250cm9sbGVycy5mb3JFYWNoKGNvbnRyb2xsZXIgPT4gY29udHJvbGxlci5jaGVja2VkID0gZmFsc2UpOyAvLyByZXNldCBhbGwgaW5wdXQgY29udHJvbGxlcnNcbiAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zKCk7XG4gICAgICByZXNldC5jbG9zZXN0KFwiLmZpbHRlcnNfX3Jlc2V0XCIpLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIHNob3cgaGlkZGVuIGNhcmRzIGFzIGRlbGV0ZSBkYXRhLWRpc3BsYXkgYXR0cmlidXRlc1xuICAgICAgICBjYXJkcy5mb3JFYWNoKGNhcmQgPT4ge1xuICAgICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBkZWxldGVkVHlwZXMpIHtcbiAgICAgICAgICAgIGNhcmQucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHt0eXBlfWApO1xuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBjaGVja0ZpbHRlcmVkU2VjdGlvbiA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZWN0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpKTtcblxuICAgIHNlY3Rpb25zLmZvckVhY2goc2VjdGlvbiA9PiB7XG4gICAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gQXJyYXkuZnJvbShzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcbiAgICAgIGNvbnN0IHNob3duSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+ICFpLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIikpO1xuXG4gICAgICBpZiAoc2hvd25JdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzcGlubmVyLmhpZGUoKTtcbiAgICBzZWN0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmaWx0ZXJpbmdcIikpO1xuXG4gICAgc2hvd0FuaW1FbGVtZW50cygpO1xuICAgIHNldEFuaW1hdGlvbkVsbXMoKTtcbiAgICBjaGVja05vRmlsdGVyTXNnKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSAobm9kZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICBsZXQgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUuc3RhcnRzV2l0aChcImRhdGEtZGlzcGxheVwiKSkge1xuICAgICAgICBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBjaGVja0ZpbHRlcmVkSXRlbSA9IChwcm9wLCB2YWwpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShpLmRhdGFzZXQuZmlsdGVyKTtcbiAgICAgICAgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoZGF0YVtwcm9wXSk7XG5cbiAgICAgICAgY29uc3QgaXNNYXRjaGVkID0gaXNBcnJheVxuICAgICAgICAgID8gZGF0YVtwcm9wXS5pbmNsdWRlcyh2YWwpXG4gICAgICAgICAgOiBkYXRhW3Byb3BdID09PSB2YWw7XG5cblxuICAgICAgICBpZiAoaXNNYXRjaGVkKSB7XG4gICAgICAgICAgaS5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YCk7XG4gICAgICAgICAgaWYgKCFoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZShpKSkgaS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICAgIGkuc2V0QXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWAsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9LCAxMDAwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBhY3RpdmVDb2xvckluSXRlbSA9ICh2YWwpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10YXJnZXQtdHlwZT1cIiR7dmFsfVwiXWApKTtcblxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiBpLmNsaWNrKCkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGluaXRGaWx0ZXJTZWxlY3QgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1jYXRhbG9nXCIpO1xuICAgIGlmIChpc1BhZ2VDYXRhbG9nKSByZXR1cm47XG5cbiAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnMgaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXTpub3QoW3ZhbHVlPVxcXCJyZXNldFxcXCJdKVwiKSk7XG5cbiAgICBjb25zdCBmaWx0ZXJlZFNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIik7XG5cbiAgICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyc19fcmVzZXRcIik7XG5cbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgZmlsdGVyZWRTZWN0aW9uLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChcImZpbHRlcmluZ1wiKSk7XG4gICAgICBzcGlubmVyLnNob3coKTtcbiAgICAgIGNoZWNrRmlsdGVyZWRJdGVtKHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7XG4gICAgICBhY3RpdmVDb2xvckluSXRlbSh0aGlzLnZhbHVlKTtcbiAgICAgIHRoaXMuY2xvc2VzdChcIi5maWx0ZXJzX19vcHRpb25zXCIpLmNsYXNzTGlzdC5hZGQoXCJjaGVja2VkXCIpO1xuICAgICAgcmVzZXRCdG4uY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgIH0pKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCByZW1vdmVEYXRhRmlsdGVyQXR0cmlidXRlID0gKHByb3ApID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1kaXNwbGF5LSR7cHJvcH1dYCkpO1xuXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IHtcbiAgICAgIGkucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWApO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGNoZWNrQWxsSXRlbXNIYXNEaXNwbGF5QXR0cmlidXRlcyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XG5cbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xuICAgICAgaWYgKCFoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZShpKSkge1xuICAgICAgICBpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IHJlc2V0QWxsQ29udHJvbGxlcnNCeU5hbWUgPSAobmFtZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT0ke25hbWV9XWApKTtcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4gaS5jaGVja2VkID0gZmFsc2UpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHRhYkxpc3RzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZHMtc2VyaWVzX19jb250cm9sc1wiKSk7XG5cbiAgICB0YWJMaXN0cy5mb3JFYWNoKGxpc3QgPT4ge1xuICAgICAgbGlzdC5xdWVyeVNlbGVjdG9yKFwiLmNhcmRzLXNlcmllc19fdGFiXCIpPy5jbGljaygpO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGNoZWNrQWxsRmlsdGVyUmVzZXRCdG4gPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXNDaGVja2VkRmlsdGVyID0gZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2xpc3QgaW5wdXQ6Y2hlY2tlZFwiKTtcblxuICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWx0ZXJzX19yZXNldFwiKTtcblxuICAgIGlzQ2hlY2tlZEZpbHRlci5sZW5ndGggPT09IDBcbiAgICAgID8gcmVzZXQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpXG4gICAgICA6IHJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBpbml0UmVzZXRGaWx0ZXJQcm9wID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtY2F0YWxvZ1wiKTtcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuO1xuXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzIGlucHV0W3ZhbHVlPVxcXCJyZXNldFxcXCJdXCIpKTtcbiAgICBjb25zdCBzZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKTtcblxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBzZWN0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoXCJmaWx0ZXJpbmdcIikpO1xuICAgICAgc3Bpbm5lci5zaG93KCk7XG4gICAgICB0aGlzLmNsb3Nlc3QoXCIuZmlsdGVyc19fb3B0aW9uc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiY2hlY2tlZFwiKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlbW92ZURhdGFGaWx0ZXJBdHRyaWJ1dGUodGhpcy5uYW1lKTtcbiAgICAgICAgY2hlY2tBbGxJdGVtc0hhc0Rpc3BsYXlBdHRyaWJ1dGVzKCk7XG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XG4gICAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNCeU5hbWUodGhpcy5uYW1lKTtcbiAgICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMoKTtcbiAgICAgICAgY2hlY2tBbGxGaWx0ZXJSZXNldEJ0bigpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gIHRyeSB7XG4gICAgaW5pdEZpbHRlcnNEcm9wKCk7XG4gICAgaW5pdEZpbHRlcnNSZXNldCgpO1xuICAgIGluaXRGaWx0ZXJTZWxlY3QoKTtcbiAgICBpbml0UmVzZXRGaWx0ZXJQcm9wKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufSk7IiwiY2xhc3MgSW5mb3JtZXIge1xyXG4gICAgc3RhdGljIF9pbnN0YW5jZXNcclxuXHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2VzKCkge1xyXG4gICAgICAgIGlmICghSW5mb3JtZXIuX2luc3RhbmNlcykge1xyXG4gICAgICAgICAgICBJbmZvcm1lci5faW5zdGFuY2VzID0gbmV3IEluZm9ybWVyKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIEluZm9ybWVyLl9pbnN0YW5jZXNcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluZm9ybWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvcm1lclwiKVxyXG4gICAgICAgIGlmICghdGhpcy5pbmZvcm1lcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLQndCwINGB0YLRgNCw0L3QuNGG0LUg0L7RgtGB0YPRgtGB0YLQstGD0LXRgiBodG1sINC+0LHQtdGA0YLQutCwINC00LvRjyDQmNC90YTQvtGA0LzQtdGA0LBcIilcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJCb2R5ID0gdGhpcy5pbmZvcm1lci5xdWVyeVNlbGVjdG9yKFwiLmluZm9ybWVyX19ib2R5XCIpXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJhY2sgPSB0aGlzLmluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb3JtZXJfX2JhY2tcIilcclxuICAgICAgICB0aGlzLmluZm9ybWVyQ2xvc2UgPSB0aGlzLmluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb3JtZXJfX2Nsb3NlXCIpXHJcbiAgICAgICAgdGhpcy5pbml0KClcclxuICAgIH1cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5idG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwic3BhbltkYXRhLXRlcm1dXCIpKVxyXG4gICAgICAgIHRoaXMuaW5pdEV2ZW50TGlzdGVuZXJzKClcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgICB0aGlzLmJ0bnMuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZ2V0SW5mb3JtYXRpb24oYnRuLmRhdGFzZXQudGVybSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLmluZm9ybWVyQmFjay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5oaWRlSW5mb3JtZXIoKSlcclxuICAgICAgICB0aGlzLmluZm9ybWVyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuaGlkZUluZm9ybWVyKCkpXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZ2V0SW5mb3JtYXRpb24odGVybSkge1xyXG4gICAgICAgIHdpbmRvdy5zcGlubmVyLnNob3coKVxyXG5cclxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwidGVybVwiLCB0ZXJtKVxyXG5cclxuICAgICAgICBjb25zdCByZXMgPSBERVZfTU9ERSA/XHJcbiAgICAgICAgICAgIGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9pbmZvcm0uaHRtbFwiKSA6XHJcbiAgICAgICAgICAgIGF3YWl0IGZldGNoKFwiL2FwaS90ZXJtXCIsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZXMudGV4dCgpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5mb3JtZXJDb250ZW50KGh0bWwpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi0J3QtSDRg9C00LDQu9C+0YHRjCDQv9C+0LvRg9GH0LjRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC00LvRjyDQotC10YDQvNC40L3QsFwiLCB0ZXJtKVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zcGlubmVyLmhpZGUsIDMwMClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSW5mb3JtZXJDb250ZW50KGRhdGEpIHtcclxuICAgICAgICBjb25zdCBpbmZvcm1lckNvbnRlbnQgPSB0aGlzLmluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb3JtZXJfX2NvbnRlbnRcIilcclxuXHJcbiAgICAgICAgd2hpbGUgKGluZm9ybWVyQ29udGVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIGluZm9ybWVyQ29udGVudC5yZW1vdmVDaGlsZChpbmZvcm1lckNvbnRlbnQuZmlyc3RDaGlsZClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluZm9ybWVyQ29udGVudC5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAgICAgdGhpcy5zaG93SW5mb3JtZXIoKVxyXG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnNwaW5uZXIuaGlkZSwgMzAwKVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dJbmZvcm1lcigpIHtcclxuICAgICAgICB0aGlzLmluZm9ybWVyLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluZm9ybWVyQmFjay5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKVxyXG4gICAgICAgICAgICB0aGlzLmluZm9ybWVyQm9keS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKVxyXG4gICAgICAgIH0sIDEwMClcclxuICAgIH1cclxuXHJcbiAgICBoaWRlSW5mb3JtZXIoKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJhY2suY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIilcclxuICAgICAgICB0aGlzLmluZm9ybWVyQm9keS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaW5mb3JtZXIuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIiksIDUwMClcclxuICAgIH1cclxufVxyXG53aW5kb3cuaW5pdEluZm9ybWVycyA9ICgpID0+IEluZm9ybWVyLmdldEluc3RhbmNlcygpLmluaXQoKVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gd2luZG93LmluZm9ybWVyID0gd2luZG93LmluaXRJbmZvcm1lcnMoKSkiLCJjb25zdCBpbml0TW9kYWwgPSAoKSA9PiB7XG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWxdJykpXG5cbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZGF0YXNldC5tb2RhbFRhcmdldFxuICAgICAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmRhdGFzZXQubW9kYWxBY3Rpb25cblxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSAnc2hvdyc6XG4gICAgICAgICAgICAgICAgc2hvd01vZGFsQmFjaygpXG4gICAgICAgICAgICAgICAgc2hvd01vZGFsRGlhbG9nKHRhcmdldClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3RvZ2dsZSc6XG4gICAgICAgICAgICAgICAgdG9nZ2xlTW9kYWxEaWFsb2codGFyZ2V0KVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2xvc2UnOlxuICAgICAgICAgICAgICAgIGhpZGVNb2RhbERpYWxvZygpXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChoaWRlTW9kYWxCYWNrLCAyMDApXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9KSlcbn1cblxuY29uc3Qgc2hvd01vZGFsQmFjayA9ICgpID0+IHtcbiAgICBjb25zdCBiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19iYWNrJylcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxuXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiBiYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKSwgMTApXG59XG5cbmNvbnN0IGhpZGVNb2RhbEJhY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNib2R5JylcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGVhZGVyJylcblxuICAgIGlmICghYmFjaykgcmV0dXJuXG5cbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxuICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSdcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgIH0sIDEwMClcbn1cblxuY29uc3Qgc2hvd01vZGFsRGlhbG9nID0gKGlkKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcbiAgICBjb25zdCBkaWFsb2cgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsX19kaWFsb2cnKVxuXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG4gICAgICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93JylcbiAgICB9LCAxMClcbn1cblxuY29uc3QgaGlkZU1vZGFsRGlhbG9nID0gKCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC5zaG93JylcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuXG5cbiAgICBjb25zdCBkaWFsb2cgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsX19kaWFsb2cnKVxuXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuICAgIGRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRhcmdldC5jbGFzc0xpc3QuYWRkKCdoaWRlJyksIDEwMClcbn1cblxuY29uc3QgaW5pdENsb3NlTW9kYWwgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBjb25zdCBpc09uUG9wdXBNb2RhbCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbF9fZGlhbG9nJylcblxuICAgICAgICBpZihpc09uUG9wdXBNb2RhbCkgcmV0dXJuXG5cbiAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcbiAgICAgICAgc2V0VGltZW91dChoaWRlTW9kYWxCYWNrLCAyMDApXG4gICAgfSlcbn1cblxuY29uc3QgdG9nZ2xlTW9kYWxEaWFsb2cgPSAoaWQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXG5cbiAgICBoaWRlTW9kYWxEaWFsb2coKVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpLCAyMDApXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93JylcbiAgICAgICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICAgIH0sIDMwMClcbn1cblxuY29uc3QgaW5pdFRvZ2dsZVZpc2libGVQYXNzID0gKCkgPT4ge1xuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbF9fdG9nZ2xlLXZpc2libGUtcGFzcycpKVxuXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcbiAgICAgICAgY29uc3QgaXNUZXh0ID0gaW5wdXQudHlwZSA9PT0gJ3RleHQnXG5cbiAgICAgICAgaW5wdXQudHlwZSA9IGlzVGV4dCA/ICdwYXNzd29yZCcgOiAndGV4dCdcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzLXZpc2libGUnKVxuICAgIH0pKVxufVxuXG5jb25zdCBzaG93TW9kYWwgPSAoaWQpID0+IHtcbiAgICBzaG93TW9kYWxCYWNrKClcbiAgICBzaG93TW9kYWxEaWFsb2coaWQpXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgIGluaXRNb2RhbCgpXG4gICAgaW5pdENsb3NlTW9kYWwoKVxuICAgIGluaXRUb2dnbGVWaXNpYmxlUGFzcygpXG59KSIsIi8vIFByb2R1Y3QgaW5mb3JtYXRpb24gc2xpZGVyXHJcbmxldCBwcm9kdWN0SW5mb1NsaWRlclxyXG5cclxuY29uc3QgaW5pdFByb2R1Y3RJbmZvU2xpZGVyID0gKCkgPT4ge1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdC1pbmZvIC5zd2lwZXInKS5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIHByb2R1Y3RJbmZvU2xpZGVyID0gbmV3IFN3aXBlcignLnByb2R1Y3QtaW5mbyAuc3dpcGVyJywge1xyXG4gICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIC8vIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBhdXRvSGVpZ2h0OiB0cnVlLFxyXG4gICAgICAgIC8vIHNwYWNlQmV0d2VlbjogMTAsXHJcblxyXG4gICAgICAgIHNjcm9sbGJhcjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItc2Nyb2xsYmFyJyxcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICAgICAgNTc2OiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTkxKSB7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJbmZvU2xpZGVyKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RJbmZvU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSlcclxuICAgICAgICAgICAgcHJvZHVjdEluZm9TbGlkZXIgPSB1bmRlZmluZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcm9kdWN0SW5mb1NsaWRlcikge1xyXG4gICAgICAgIGluaXRQcm9kdWN0SW5mb1NsaWRlcigpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgaXNQcm9kdWN0UGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLXByb2R1Y3QnKVxyXG4gICAgY29uc3QgaXNBcnRpY2xlUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWFydGljbGUnKVxyXG4gICAgY29uc3QgaXNEb3RzUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWRvdHMnKVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgSW5mbyBzbGlkZXIgb25seSBmb3IgUHJvZHVjdCwgQXJ0aWNsZSBhbmQgRG90cyBwYWdlc1xyXG4gICAgaWYgKCFpc1Byb2R1Y3RQYWdlICYmICFpc0FydGljbGVQYWdlICYmICFpc0RvdHNQYWdlKSByZXR1cm5cclxuXHJcbiAgICBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyKClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChjaGVja1Byb2R1Y3RJbmZvU2xpZGVyKVxyXG4gICAgfSlcclxufSlcclxuIiwiLy8gUHJvZHVjdCByZWNvbW1lbmRhdGlvbiBzbGlkZXJcclxubGV0IHByb2R1Y3RSZWNvbW1TbGlkZXJcclxuXHJcbmNvbnN0IGNoZWNrUmVjb21tU2xpZGVyU2Nyb2xsYmFyID0gKHN3aXBlciwgc2Nyb2xsYmFyKSA9PiB7XHJcbiAgICBpZiAoIXNjcm9sbGJhciB8fCBzY3JvbGxiYXIuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCBpc1Njcm9sbGJhckhpZGUgPSBzY3JvbGxiYXIuY2xhc3NMaXN0XHJcbiAgICAgICAgLmNvbnRhaW5zKCdzd2lwZXItc2Nyb2xsYmFyLWxvY2snKVxyXG5cclxuICAgIGlzU2Nyb2xsYmFySGlkZVxyXG4gICAgICAgID8gc3dpcGVyLmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1oaWRkZW4nKVxyXG4gICAgICAgIDogc3dpcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1oaWRkZW4nKVxyXG59XHJcblxyXG5jb25zdCBjaGVja1NsaWRlcnNCb3R0b21PZmZzZXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzd2lwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyJykpXHJcblxyXG4gICAgc3dpcGVycy5mb3JFYWNoKHN3aXBlciA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsYmFyID0gc3dpcGVyLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2Nyb2xsYmFyJylcclxuICAgICAgICBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhcihzd2lwZXIsIHNjcm9sbGJhcilcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXRQcm9kdWN0UmVjb21tU2xpZGVyID0gKCkgPT4ge1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVjb21tZW5kYXRpb25fX3NsaWRlciAuc3dpcGVyJykubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBwcm9kdWN0UmVjb21tU2xpZGVyID0gbmV3IFN3aXBlcignLnJlY29tbWVuZGF0aW9uX19zbGlkZXIgLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICAvLyBhdXRvSGVpZ2h0OiB0cnVlLFxyXG5cclxuICAgICAgICBzY3JvbGxiYXI6IHtcclxuICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXNjcm9sbGJhcicsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDU3Njoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICA5OTE6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAxMjAwOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXMuZWxcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjcm9sbGJhciA9IHRoaXMuc2Nyb2xsYmFyLmVsXHJcbiAgICAgICAgICAgICAgICBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhcihzd2lwZXIsIHNjcm9sbGJhcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlciA9ICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEyMDAgJiYgcHJvZHVjdFJlY29tbVNsaWRlcikge1xyXG4gICAgICAgIEFycmF5LmlzQXJyYXkocHJvZHVjdFJlY29tbVNsaWRlcilcclxuICAgICAgICAgICAgPyBwcm9kdWN0UmVjb21tU2xpZGVyLmZvckVhY2goc2xpZGVyID0+IHNsaWRlci5kZXN0cm95KHRydWUsIHRydWUpKVxyXG4gICAgICAgICAgICA6IHByb2R1Y3RSZWNvbW1TbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKVxyXG5cclxuICAgICAgICBwcm9kdWN0UmVjb21tU2xpZGVyID0gdW5kZWZpbmVkXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcm9kdWN0UmVjb21tU2xpZGVyKSB7XHJcbiAgICAgICAgaW5pdFByb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGNvbnN0IGlzUHJvZHVjdFBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1wcm9kdWN0JylcclxuICAgIGNvbnN0IGlzQXJ0aWNsZVBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1hcnRpY2xlJylcclxuICAgIGNvbnN0IGlzRG90c1BhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1kb3RzJylcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIFJlY29tbWVuZGF0aW9uIHNsaWRlciBvbmx5IGZvciBQcm9kdWN0LCBBcnRpY2xlIGFuZCBEb3RzIHBhZ2VzXHJcbiAgICBpZiAoIWlzUHJvZHVjdFBhZ2UgJiYgIWlzQXJ0aWNsZVBhZ2UgJiYgIWlzRG90c1BhZ2UpIHJldHVyblxyXG5cclxuICAgIGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlcigpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwoY2hlY2tQcm9kdWN0UmVjb21tU2xpZGVyKVxyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChjaGVja1NsaWRlcnNCb3R0b21PZmZzZXQpXHJcbiAgICB9KVxyXG59KVxyXG4iLCJjb25zdCBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AgPSAoYnV0dG9uKSA9PiB7XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0U2Nyb2xsVG9Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsVG9Ub3AnKVxyXG5cclxuICAgIGlmICghYnV0dG9uKSByZXR1cm5cclxuXHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzbW9vdGhTY3JvbGxUbygwKSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AoYnV0dG9uKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0U2Nyb2xsVG9Ub3AoKVxyXG59KSIsIi8qKlxyXG4gKiBTaG93IGEgc21hbGwgbWVzc2FnZSB3aXRoIHRpdGxlIGFuZCB0ZXh0IGluIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSBzY3JlZW4uXHJcbiAqIFRoZSBtZXRob2QgZXhwZWN0cyBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyIHBlciBpbnB1dC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IFt0aXRsZT11bmRlZmluZWRdIC0gVGhlIGhlYWRsaW5lIG9mIHRoZSBtZXNzYWdlIGluIG9uZSBsaW5lLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2U9dW5kZWZpbmVkXSAtIE9uZSBsaW5lIG1lc3NhZ2UgdGV4dC5cclxuICovXHJcbndpbmRvdy5zaG93TW9kYWxNc2cgPSBmdW5jdGlvbih0aXRsZSA9ICcnLCBtZXNzYWdlID0gJycpIHtcclxuICAgIGlmICghdGl0bGUgJiYgIW1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlcmUncyBubyB0aXRsZSBvciBtZXNzYWdlIGZvciBzaG93aW5nIGluIG1vZGFsIHdpbmRvdy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHRpdGxlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbmNvcnJlY3QgdHlwZSBvZiB0aXRsZS4gSXQgc2hvdWxkIGJlIHN0cmluZy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkluY29ycmVjdCB0eXBlIG9mIG1lc3NhZ2UuIEl0IHNob3VsZCBiZSBzdHJpbmcuXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbXNnLWNvbnRhaW5lcicpXHJcbiAgICBjb25zdCBbY2FyZCwgYm9keV0gPSBjcmVhdGVNb2RhbE1zZ0NhcmQodGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhcmQpXHJcbiAgICBjaGVja01vZGFsTXNnQ29udGFpbmVyKClcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBjYXJkLmNsYXNzTGlzdC5hZGQoJ3VuY29sbGFwc2VkJyksIDUwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcbiAgICB9LCAxMDApXHJcblxyXG4gICAgaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHksIDUwMDApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKSB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tc2ctY29udGFpbmVyJylcclxuICAgIGNvbnN0IGlubmVyRWxtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtbXNnX19jYXJkJylcclxuXHJcbiAgICBpbm5lckVsbXMubGVuZ3RoID4gMFxyXG4gICAgICAgID8gY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG4gICAgICAgIDogY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNb2RhbE1zZ0NhcmQodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2NhcmQnKVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2JvZHknKVxyXG5cclxuICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcclxuXHJcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtbXNnX19jb250ZW50JylcclxuXHJcbiAgICBjb25zdCBjYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXHJcbiAgICBjYXB0aW9uLnRleHRDb250ZW50ID0gdGl0bGVcclxuXHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICB0ZXh0LnRleHRDb250ZW50ID0gbWVzc2FnZVxyXG5cclxuICAgIGlmICh0aXRsZSkgY29udGVudC5hcHBlbmRDaGlsZChjYXB0aW9uKVxyXG4gICAgaWYgKG1lc3NhZ2UpIGNvbnRlbnQuYXBwZW5kQ2hpbGQodGV4dClcclxuXHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGljb24pXHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGNvbnRlbnQpXHJcblxyXG4gICAgY2FyZC5hcHBlbmRDaGlsZChib2R5KVxyXG5cclxuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoaWRlTW9kYWxNc2dIYW5kbGVyKVxyXG5cclxuICAgIHJldHVybiBbY2FyZCwgYm9keV1cclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZU1vZGFsTXNnSGFuZGxlcigpIHtcclxuICAgIGNvbnN0IGNhcmQgPSB0aGlzXHJcbiAgICBjb25zdCBib2R5ID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtbXNnX19ib2R5JylcclxuICAgIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5KVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSwgdGltZW91dCA9IDApIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcclxuICAgIH0sIHRpbWVvdXQpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJywgJ2hpZGRlbicpXHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd1bmNvbGxhcHNlZCcpXHJcbiAgICB9LCB0aW1lb3V0ICsgMTAwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNhcmQucmVtb3ZlKCk7XHJcbiAgICAgICAgY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpXHJcbiAgICB9LCB0aW1lb3V0ICsgMjAwKVxyXG59XHJcbiIsImNvbnN0IHNob3dTcGlubmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHNwaW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNwaW5uZXIuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpLCAxMDApXG59XG5cbmNvbnN0IGhpZGVTcGlubmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHNwaW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpLCAxMDAwKVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKSkge1xuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93ID0gc2hvd1NwaW5uZXJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSA9IGhpZGVTcGlubmVyXG4gICAgfVxufSkiLCIiLCIvLyBPcGVuIGFuZCBjbG9zZSBtb2JpbGUgbmF2aWdhdGlvblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgbmF2Q2xvc2UgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jbG9zZScpKVxyXG4gICAgY29uc3QgbmF2VG9nZ2xlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXJfX25hdi1saW5rX21lbnUnKVxyXG4gICAgY29uc3QgaGVhZGVyTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2JylcclxuICAgIGNvbnN0IG1vZGFsQmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21vZGFsLWJhY2snKVxyXG4gICAgY29uc3QgbmF2UHJvZExpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtbGlua19wcm9kdWN0JylcclxuICAgIGNvbnN0IG5hdkl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtaXRlbV93aXRoLWlubmVyJykpXHJcbiAgICBjb25zdCBuYXZMaW5rcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWxpbmsnKSlcclxuICAgIGNvbnN0IG5hdkNvbGxhcHNlcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNvbGxhcHNlJykpXHJcblxyXG4gICAgaWYgKCFuYXZUb2dnbGVyKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCB0b2dnbGVOYXYgPSAoZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgICAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgLy8gbW9kYWxCYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuYXZQcm9kTGluay5jbGljaygpXHJcbiAgICAgICAgICAgIH0sIDEwMClcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJylcclxuICAgICAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKVxyXG4gICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuXHJcbiAgICAgICAgY29sbGFwc0FsbE5hdkl0ZW0oKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENsaWNrIG9uIG5hdmlnYXRpb24gYnVyZ2VyXHJcbiAgICBuYXZUb2dnbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvZ2dsZU5hdih0cnVlKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGNsb3NlIGJ1dHRvblxyXG4gICAgbmF2Q2xvc2UuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZU5hdihmYWxzZSkpXHJcbiAgICB9KVxyXG5cclxuICAgIG1vZGFsQmFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICB0b2dnbGVOYXYoZmFsc2UpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE9wZW4gYW5kIGNsb3NlIE5hdmlnYXRpb24gaXRlbXNcclxuICAgIGNvbnN0IGNvbGxhcHNBbGxOYXZJdGVtID0gKCkgPT4ge1xyXG4gICAgICAgIG5hdkl0ZW1zLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKSlcclxuICAgICAgICBuYXZMaW5rcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxuICAgICAgICBuYXZDb2xsYXBzZXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdkl0ZW0gPSAoYnRuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcblxyXG4gICAgICAgIGlmICghaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBjb25zdCBuYXZJdGVtID0gYnRuLmNsb3Nlc3QoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKVxyXG5cclxuICAgICAgICAgICAgaWYgKG5hdkl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hdkNvbGxhcHNlID0gbmF2SXRlbS5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKVxyXG5cclxuICAgICAgICAgICAgICAgIG5hdkl0ZW0uY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgICAgICBuYXZDb2xsYXBzZS5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZMaW5rcy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0b2dnbGVOYXZJdGVtKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBTZWFyY2hpbmcgYW5kIFN0aWNreSBoZWFkZXJcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgIFxyXG4gICBcclxuICAgIFxyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXHJcbiAgICBjb25zdCBzZWFyY2hUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1jbG9zZScpXHJcbiAgICBjb25zdCBzZWFyY2hQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1pbnB1dCcpXHJcbiAgICBjb25zdCBzZWFyY2hSZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1yZXNldCcpXHJcbiAgICBjb25zdCBzZWFyY2hIaW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1oaW50cycpXHJcblxyXG4gICAgaWYgKCFzZWFyY2hUb2dnbGVyKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCB0b2dnbGVTZWFyY2hQYW5lbCA9IChoaWRlID0gZmFsc2UpID0+IHtcclxuICAgICAgICBjb25zdCBpc1Zpc2libGUgPSBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSAxMDBcclxuXHJcbiAgICAgICAgaWYgKCFpc1Zpc2libGUgJiYgIWhpZGUpIHtcclxuICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZScpXHJcbiAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfd2l0aC1zZWFyY2gtcGFuZWwnKVxyXG4gICAgICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoUmVzZXQuY2xpY2soKVxyXG4gICAgICAgICAgICByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJylcclxuICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl93aXRoLXNlYXJjaC1wYW5lbCcpXHJcbiAgICAgICAgfSwgMjAwKVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaFRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgICAgIHNlYXJjaElucHV0LmZvY3VzKClcclxuICAgIH0pXHJcblxyXG4gICAgc2VhcmNoQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9zZWFyY2guanNvbidcclxuICAgIC8vIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICdodHRwczovL3Rlc3QtdGVjaG5vbGlnaHR2Mi5tYXNzaXZlLnJ1L2FwaS9wcm9kdWN0L3NlYXJjaCdcclxuXHJcbiAgICBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnL2FwaS9wcm9kdWN0L3NlYXJjaCdcclxuICAgIC8vIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICdodHRwczovL3RlY2hub2xpZ2h0LnJ1L2FwaS9wcm9kdWN0L3NlYXJjaCdcclxuICAgIGNvbnN0IFRIUk9UVExFX1RJTUVPVVQgPSAzMDBcclxuICAgIGxldCBzZWFyY2hSZXF1ZXN0VGltZW91dElkXHJcblxyXG4gICAgY29uc3Qgc2V0U3Ryb25nVGV4dCA9IChzdHIsIHF1ZXJ5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHF1ZXJ5LCAnZ2knKVxyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShyZWdleCwgYDxzdHJvbmc+JCY8L3N0cm9uZz5gKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByaW50UXVlcnlSZXN1bHQgPSAoZGF0YSwgcXVlcnkpID0+IHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9Cf0L7Qu9GD0YfQuNC70Lgg0L/QvtC40YHQutC+0LLRg9GOINCy0YvQtNCw0YfRgycsIGRhdGEpO1xyXG5cclxuICAgICAgICAvLyBSZXNldCBhbGwgY2hpbGRyZW4gbm9kZXMgb2Ygc2VhcmNoIGhpbnRzXHJcbiAgICAgICAgd2hpbGUgKHNlYXJjaEhpbnRzLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgc2VhcmNoSGludHMucmVtb3ZlQ2hpbGQoc2VhcmNoSGludHMuZmlyc3RDaGlsZClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCBsaW5rLCBzaW1pbGFyIG9yIE5vIFJlc3VsdFxyXG4gICAgICAgIGNvbnN0IGxpbmtzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICBsaW5rcy5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX3NlYXJjaC1saW5rcycpXHJcblxyXG4gICAgICAgIGNvbnN0IHNpbWlsYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIHNpbWlsYXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19zZWFyY2gtc2ltaWxhcicpXHJcblxyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAvLyBObyByZXN1bHRzXHJcbiAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKCduby1yZXN1bHRzJylcclxuICAgICAgICAgICAgc3Bhbi5pbm5lclRleHQgPSAn0J/QviDQktCw0YjQtdC80YMg0LfQsNC/0YDQvtGB0YMg0L3QuNGH0LXQs9C+INC90LUg0L3QsNC50LTQtdC90L4nXHJcbiAgICAgICAgICAgIGxpbmtzLmFwcGVuZENoaWxkKHNwYW4pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTGlua3NcclxuICAgICAgICAgICAgY29uc3QgaGludCA9IGRhdGFbMF1cclxuICAgICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxyXG4gICAgICAgICAgICBsaW5rLmhyZWYgPSBoaW50LnVybFxyXG4gICAgICAgICAgICBsaW5rLmlubmVySFRNTCA9IHNldFN0cm9uZ1RleHQoaGludC50aXRsZSwgcXVlcnkpXHJcbiAgICAgICAgICAgIGxpbmtzLmFwcGVuZENoaWxkKGxpbmspXHJcblxyXG4gICAgICAgICAgICAvLyBTaW1pbGFyXHJcbiAgICAgICAgICAgIHNpbWlsYXIuaW5uZXJIVE1MID0gJzxoNT7RgdC80L7RgtGA0LjRgtC1INC/0L7RhdC+0LbQuNC1PC9oNT4nXHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG51bSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVtIDwgMSkgY29udGludWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBMaW5rXHJcbiAgICAgICAgICAgICAgICBjb25zdCBoaW50ID0gZGF0YVtudW1dXHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBoaW50LnVybFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEltYWdlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwaWNTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICAgICAgICAgICAgICBwaWNTcGFuLmNsYXNzTGlzdC5hZGQoJ3BpYycpXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBoaW50LmltYWdlXHJcbiAgICAgICAgICAgICAgICBpbWcuYWx0ID0gaGludC50aXRsZVxyXG4gICAgICAgICAgICAgICAgcGljU3Bhbi5hcHBlbmRDaGlsZChpbWcpXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGV4dFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICAgICAgICAgIHRleHRTcGFuLmNsYXNzTGlzdC5hZGQoJ3RleHQnKVxyXG4gICAgICAgICAgICAgICAgdGV4dFNwYW4uaW5uZXJIVE1MID0gc2V0U3Ryb25nVGV4dChoaW50LnRpdGxlLCBxdWVyeSlcclxuXHJcbiAgICAgICAgICAgICAgICBsaW5rLmFwcGVuZENoaWxkKHBpY1NwYW4pXHJcbiAgICAgICAgICAgICAgICBsaW5rLmFwcGVuZENoaWxkKHRleHRTcGFuKVxyXG4gICAgICAgICAgICAgICAgc2ltaWxhci5hcHBlbmRDaGlsZChsaW5rKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChudW0gPiA2KSBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hIaW50cy5hcHBlbmRDaGlsZChsaW5rcylcclxuICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5hcHBlbmRDaGlsZChzaW1pbGFyKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0J3Rg9C20L3QviDRgtC+0LvRjNC60L4g0LTQu9GPINC/0L7Qu9C90L7Qs9C+INC80LXQvdGOXHJcbiAgICAgICAgLy8gc2V0SGFuZGxlclRvSGVscGVycygpXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmZXRjaFNlYXJjaGluZ0RhdGEgPSBhc3luYyAocXVlcnkpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChTRUFSQ0hfUkVRVUVTVF9VUkwgKyBgP3F1ZXJ5PSR7cXVlcnl9YClcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDQt9Cw0L/RgNC+0YHQsCDQv9C+0LjRgdC60LAnKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgICAgICBwcmludFF1ZXJ5UmVzdWx0KGRhdGEsIHF1ZXJ5KVxyXG5cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZWFyY2hIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoc2VhcmNoUmVxdWVzdFRpbWVvdXRJZClcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hSZXNldC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgLy8gKioqIEZldGNoaW5nIHNlYXJjaCByZXF1ZXN0cyBhbmQgc2hvdyByZXN1bHRzIC0tLSBTVEFSVFxyXG4gICAgICAgIGNsZWFyVGltZW91dChzZWFyY2hSZXF1ZXN0VGltZW91dElkKVxyXG4gICAgICAgIHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAoKSA9PiBmZXRjaFNlYXJjaGluZ0RhdGEodGhpcy52YWx1ZSksXHJcbiAgICAgICAgICAgIFRIUk9UVExFX1RJTUVPVVRcclxuICAgICAgICApXHJcbiAgICAgICAgLy8gKioqIEZldGNoaW5nIHNlYXJjaCByZXF1ZXN0cyBhbmQgc2hvdyByZXN1bHRzIC0tLSBGSU5JU0hcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBzZWFyY2hIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycylcclxuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgc2VhcmNoSGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMpXHJcblxyXG4gICAgc2VhcmNoUmVzZXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICBzZWFyY2hSZXNldC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKClcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgfSlcclxuXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtZm9ybScpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLWxpbmtzIGEnKT8uZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcbiAgICAgICAgICAgIGlmIChsaW5rICYmIGxpbmsgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWxpbmsuc3RhcnRzV2l0aCgnaHR0cCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/Qv9GA0LjQstC+0LTQuNC8INC6INCw0LHRgdC+0LvRjtGC0L3QvtC80YMg0L/Rg9GC0LhcclxuICAgICAgICAgICAgICAgICAgICBsaW5rID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIGAke2xpbmt9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwobGluaylcclxuICAgICAgICAgICAgICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KCdzZWFyY2gnLCBzZWFyY2hJbnB1dC52YWx1ZSlcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVybC5ocmVmKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmwuaHJlZlxyXG4gICAgICAgICAgICAgICAgfSwgNTAwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBjb25zdCBpc1NlYXJjaFRvZ2dsZSA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuaGVhZGVyX19idXR0b25zLWxpbmtfc2VhcmNoJylcclxuXHJcbiAgICAgICAgY29uc3QgaXNTZWFyY2hQYW5lbCA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuaGVhZGVyX19zZWFyY2gnKVxyXG5cclxuICAgICAgICBjb25zdCBpc1RhY2hEZXZpY2UgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDk5MlxyXG5cclxuICAgICAgICBpZiAoIWlzVGFjaERldmljZSAmJiAhaXNTZWFyY2hQYW5lbCAmJiAhaXNTZWFyY2hUb2dnbGUpIHtcclxuICAgICAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwodHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFNldCBoZWxwIHRleHQgZnJvbSBoZWxwZXIgYnV0dG9uIHVuZGVyIHRoZSBzZWFyY2ggaW5wdXQgdG8gdGhlIHNlYXJjaCB2YWx1ZVxyXG4gICAgY29uc3QgcmVxdWVzdENvbXBsZXRpb24gPSAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFkZGl0aW9uVmFsdWUgPSBlLnRhcmdldC5pbm5lclRleHRcclxuICAgICAgICBzZWFyY2hJbnB1dC52YWx1ZSA9IGAke3NlYXJjaElucHV0LnZhbHVlfSAke2FkZGl0aW9uVmFsdWV9YFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEhhbmRsZXJUb0hlbHBlcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoSGVscGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX3NlYXJjaC1oZWxwcyBzcGFuJykpXHJcblxyXG4gICAgICAgIHNlYXJjaEhlbHBlcnMuZm9yRWFjaChidG4gPT4gYnRuXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlcXVlc3RDb21wbGV0aW9uKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEhlbHBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19zZWFyY2gtaGVscHMgc3BhbicpKVxyXG5cclxuICAgICAgICBzZWFyY2hIZWxwZXJzLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgYnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVxdWVzdENvbXBsZXRpb24pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGlja3kgaGVhZGVyXHJcbiAgICBsZXQgYmVmb3JlU2Nyb2xsVG9wID0gMFxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkZXJcIilcclxuICAgICAgICBjb25zdCBoZWFkZXJIZWlnaHQgPSBoZWFkZXIuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgY29uc3QgZGVsYXkgPSAnLjdzJ1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDk5MSkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2NvbXByZXNzZWQnKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbXByZXNzZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnRTY3JvbGxUb3AgPiAxMDAgJiYgY3VycmVudFNjcm9sbFRvcCA+IGJlZm9yZVNjcm9sbFRvcCkge1xyXG4gICAgICAgICAgICBjb25zdCBpc1Zpc2libGVTZWFyY2ggPSBzZWFyY2hQYW5lbFxyXG4gICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpXHJcblxyXG4gICAgICAgICAgICBsZXQgaW50ZXJ2YWxJZFxyXG5cclxuICAgICAgICAgICAgaWYgKGlzVmlzaWJsZVNlYXJjaCkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGRlbGF5XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCh0cnVlKVxyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gJzBzJ1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZClcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGhlYWRlci5zdHlsZS50b3AgPSBgLSR7aGVhZGVySGVpZ2h0fXB4YFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGhlYWRlci5zdHlsZS50b3AgPSAwXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiZWZvcmVTY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXRcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFRvZ2dsZSBzZWFyY2ggcGFuZWxcclxuICAgIGNvbnN0IGN1cnJlbnRVcmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxyXG4gICAgaWYgKGN1cnJlbnRVcmwuc2VhcmNoUGFyYW1zLmhhcygnc2VhcmNoJykpIHtcclxuICAgICAgICBzZWFyY2hJbnB1dC52YWx1ZSA9IGN1cnJlbnRVcmwuc2VhcmNoUGFyYW1zLmdldCgnc2VhcmNoJylcclxuICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCgpXHJcbiAgICB9XHJcbn0pXHJcblxyXG4vLyBDYXJ0IHVwZGF0ZSBsaXN0ZW5pbmdcclxuY29uc3Qgc2V0Q2FydFVwZGF0ZUxpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY2FydFByb2R1Y3RDb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FydFByb2R1Y3RDb3VudCcpXHJcblxyXG4gICAgaWYgKCFjYXJ0UHJvZHVjdENvdW50Tm9kZSkgcmV0dXJuXHJcblxyXG4gICAgY2FydFByb2R1Y3RDb3VudE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2FydFVwZGF0ZUV2ZW50JywgZnVuY3Rpb24gKGUpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZHVjdHMgPSB3aW5kb3cuQ0FSVC5wcm9kdWN0c1xyXG4gICAgICAgIGxldCBwcm9kdWN0Q291bnQgPSAwXHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlcmF0b3Igb2YgcHJvZHVjdHMpIHtcclxuICAgICAgICAgICAgcHJvZHVjdENvdW50ICs9IGl0ZXJhdG9yLmNvdW50XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYXJ0UHJvZHVjdENvdW50Tm9kZS5pbm5lclRleHQgPSBwcm9kdWN0Q291bnRcclxuICAgICAgICBjYXJ0UHJvZHVjdENvdW50Tm9kZS5kYXRhc2V0LmNvdW50ID0gcHJvZHVjdENvdW50LnRvU3RyaW5nKClcclxuICAgICAgICBjYXJ0UHJvZHVjdENvdW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjYXJ0UHJvZHVjdENvdW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpLCAxMDAwKVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhlLmRldGFpbC5tZXNzYWdlKVxyXG4gICAgfSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBzZXRDYXJ0VXBkYXRlTGlzdGVuZXIpXHJcblxyXG4vLyBPcGVuIGFuZCBjbG9zZSBzdWJMaXN0c1xyXG5jb25zdCB0b2dnbGVTdWJOYXZMaXN0cyA9ICgpID0+IHtcclxuICAgIGNvbnN0IHRvZ2dsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtaW5uZXItdG9nZ2xlJykpXHJcblxyXG4gICAgY29uc3QgY2xvc2VBbGxUb2dnbGVycyA9ICgpID0+IHtcclxuICAgICAgICB0b2dnbGVycy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgd3JhcCA9IGVsLmNsb3Nlc3QoJy5oZWFkZXJfX25hdi1pbm5lci1jYXB0aW9uJylcclxuICAgICAgICAgICAgd3JhcC5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wcGVkJylcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbGxhcHNlID0gd3JhcC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtc3VibGlzdC1jb2xsYXBzZScpXHJcbiAgICAgICAgICAgIGNvbGxhcHNlLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKVxyXG5cclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZXJzLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgd3JhcCA9IGVsLmNsb3Nlc3QoJy5oZWFkZXJfX25hdi1pbm5lci1jYXB0aW9uJylcclxuICAgICAgICBjb25zdCBjb2xsYXBzZSA9IHdyYXAucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LXN1Ymxpc3QtY29sbGFwc2UnKVxyXG4gICAgICAgIGNvbnN0IGlzQ3VycmVudERyb3BwZWQgPSB3cmFwLmNsYXNzTGlzdC5jb250YWlucygnZHJvcHBlZCcpXHJcblxyXG4gICAgICAgIC8vIGNsb3NlQWxsVG9nZ2xlcnMoKVxyXG5cclxuICAgICAgICAvLyBUb2dnbGUgY3VycmVudFxyXG4gICAgICAgIGlmICghaXNDdXJyZW50RHJvcHBlZCkge1xyXG4gICAgICAgICAgICB3cmFwLmNsYXNzTGlzdC5hZGQoJ2Ryb3BwZWQnKVxyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBjb2xsYXBzZS5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3cmFwLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKVxyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBjb2xsYXBzZS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJylcclxuICAgICAgICB9XHJcbiAgICB9KSlcclxuXHJcbiAgICAvLyBDbG9zZSBhbGwgc3VibmF2IGxpc3Qgb24gb3V0IGNsaWNrXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzVGFyZ2V0ID0gZS50YXJnZXRcclxuICAgICAgICAgICAgLmNsYXNzTGlzdFxyXG4gICAgICAgICAgICAuY29udGFpbnMoJ2hlYWRlcl9fbmF2LWlubmVyLXRvZ2dsZScpXHJcblxyXG4gICAgICAgIGlmICghaXNUYXJnZXQpIGNsb3NlQWxsVG9nZ2xlcnMoKVxyXG4gICAgfSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0b2dnbGVTdWJOYXZMaXN0cylcclxuIiwiLy8gRGVsZXRpbmcgYmxvY2tpbmcgb2YgYWxsIGFuaW1hdGlvbiBmb3IgZml4IGFuaW1hdGlvbiBhcnRlZmFjdHNcclxuY29uc3QgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlciA9ICgpID0+IHtcclxuICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRyYW5zaXRpb24tYmxvY2tlcicpKVxyXG4gICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RyYW5zaXRpb24tYmxvY2tlcicpKVxyXG59XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlcilcclxuXHJcbi8vIEJsb2NraW5nIGFsbCBhbmltYXRpb24gYXQgdGhlIHdpbmRvdyByZXNpemluZyBwcm9jZXNzXHJcbmNvbnN0IGFkZEFuaW1hdGlvbkJsb2NrZXIgPSAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RyYW5zaXRpb24tYmxvY2tlcicpXHJcbn1cclxuXHJcbmxldCBibG9ja0FuaW1hdGlvblRpbWVyXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XHJcbiAgICBjbGVhclRpbWVvdXQoYmxvY2tBbmltYXRpb25UaW1lcilcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChhZGRBbmltYXRpb25CbG9ja2VyKVxyXG5cclxuICAgIGJsb2NrQW5pbWF0aW9uVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwocmVtb3ZlQW5pbWF0aW9uQmxvY2tlcilcclxuICAgIH0sIDMwMClcclxufSlcclxuXHJcbi8vIEhhbmRsZSBsaW5rIHdpdGggc21vb3RoIGFuaW1hdGlvbiB0byBhbmNob3IgcGxhY2Ugb24gdGhlIHBhZ2VcclxuY29uc3Qgc21vb3RoTGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZePVwiI1wiXScpXHJcbmZvciAobGV0IHNtb290aExpbmsgb2Ygc21vb3RoTGlua3MpIHtcclxuICAgIHNtb290aExpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICBjb25zdCBpZCA9IHNtb290aExpbmsuZ2V0QXR0cmlidXRlKCdocmVmJylcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7aWR9YClcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gdGFyZ2V0Tm9kZS5vZmZzZXRUb3BcclxuICAgICAgICAgICAgY29uc3QgZGV2aWNlT2Zmc2V0ID0gd2luZG93Lm91dGVyV2lkdGggPiA3NjggPyAtMTAwIDogLTIwXHJcblxyXG4gICAgICAgICAgICBzbW9vdGhTY3JvbGxUbyh0YXJnZXRPZmZzZXQgKyBkZXZpY2VPZmZzZXQsIDcwMClcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlcmUncyBubyB0YXJnZXQgbm9kZSBmb3Igc2Nyb2xsaW5nIHRvIHBsYWNlLiBUaGUgc2VsZWN0b3IgaXNuJ3QgY29ycmVjdCFcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufTtcclxuXHJcbi8vIEFuaW1hdGlvbiBpdGVtcyB3aGVuIHVzZXIgaGFzIHNjcm9sbGVkIHNjcmVlbiB0byBwbGFjZSBvZiBpdGVtXHJcbmNvbnN0IGNoZWNrQW5pbWF0aW9uRWxtcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGFuaW1hdGlvbkVsbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbmltYXRpb24tZWxlbWVudCcpKVxyXG5cclxuICAgIHJldHVybiBhbmltYXRpb25FbG1zLmxlbmd0aCA+IDBcclxufVxyXG5cclxuY29uc3Qgc2hvd0FuaW1FbGVtZW50cyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGVsbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbmltYXRpb24tZWxlbWVudCcpKVxyXG5cclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAvLyBjb25zdCBwb2ludE9mRGlzcGxheSA9IHdpbmRvd0hlaWdodCAvIDEuMiAvLyBmb3Igc2hvdyBvbiB0aGUgaGFsZiBvZiB0aGUgc2NyZWVuXHJcbiAgICBjb25zdCBwb2ludE9mRGlzcGxheSA9IHdpbmRvd0hlaWdodFxyXG5cclxuICAgIGVsbXMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICBjb25zdCBkaXN0YW5jZUZyb21Ub3AgPSByZWN0LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxyXG5cclxuICAgICAgICBpZiAoZGlzdGFuY2VGcm9tVG9wIC0gcG9pbnRPZkRpc3BsYXkgPCBzY3JvbGxUb3ApIHtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0aW9uLWVsZW1lbnQnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgaWYgKCFjaGVja0FuaW1hdGlvbkVsbXMoKSkge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZXRBbmltYXRpb25FbG1zID0gKCkgPT4ge1xyXG4gICAgaWYgKGNoZWNrQW5pbWF0aW9uRWxtcygpKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNob3dBbmltRWxlbWVudHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoc2hvd0FuaW1FbGVtZW50cylcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChzZXRBbmltYXRpb25FbG1zKVxyXG59KVxyXG5cclxuLy8gUGhvbmUgbWFza2luZ1xyXG5jb25zdCBpbml0UGhvbmVzTWFzayA9ICgpID0+IHtcclxuICAgIGNvbnN0IHBob25lSW5wdXRzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1cInRlbFwiXTpub3QoLmNhcnRfX2NhbGMgW3R5cGU9XCJ0ZWxcIl0pJykpXHJcblxyXG4gICAgcGhvbmVJbnB1dHMuZm9yRWFjaChwaG9uZSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGhvbmVNYXNrT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbWFzazogJyt7N30gKDAwMCkgMDAwLTAwLTAwJyxcclxuICAgICAgICAgICAgbGF6eTogdHJ1ZSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJDaGFyOiAnIydcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcGhvbmVNYXNrID0gSU1hc2soXHJcbiAgICAgICAgICAgIHBob25lLFxyXG4gICAgICAgICAgICBwaG9uZU1hc2tPcHRpb25zXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBwaG9uZS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiBmYWxzZX0pKVxyXG4gICAgICAgIHBob25lLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogdHJ1ZX0pKVxyXG4gICAgfSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoaW5pdFBob25lc01hc2spXHJcbn0pXHJcblxyXG4vLyBGaXhpbmcgY2hhdC0yNCB3aWRnZXQgcG9zaXRpb24gLS0gU1RBUlRcclxubGV0IGNoYXQyNEludGVydmFsSWQgPSBudWxsXHJcbmxldCBjaGF0MjRUaW1lb3V0SWQgPSBudWxsXHJcbmxldCBjaGFydDI0U3R5bGVOb2RlID0gbnVsbFxyXG5sZXQgY2hhcnQyNE5vZGUgPSBudWxsXHJcblxyXG5jb25zdCBmaXhDaGF0MjRXaWRnZXRQb3NpdGlvbiA9ICgpID0+IHtcclxuICAgIGNoYXJ0MjROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2hhdC0yNCcpXHJcblxyXG4gICAgaWYgKCFjaGFydDI0Tm9kZSkgcmV0dXJuXHJcblxyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgMTAyNCAmJiAhY2hhcnQyNFN0eWxlTm9kZSkge1xyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcblxyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAuc3RhcnRCdG4uc3RhcnRCdG4tLW91dHNpZGUuc3RhcnRCdG4tLWJvdHRvbSB7XHJcbiAgICAgICAgICAgICAgICBib3R0b206IDY3cHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLnN0YXJ0QnRuLnN0YXJ0QnRuLS1vcGVuIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg1MCUpIHNjYWxlKDAuNikgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGNoYXJ0MjROb2RlLnNoYWRvd1Jvb3QucHJlcGVuZChjaGFydDI0U3R5bGVOb2RlKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSAxMDI0ICYmIGNoYXJ0MjRTdHlsZU5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2hhcnQyNFN0eWxlTm9kZScsIGNoYXJ0MjRTdHlsZU5vZGUpO1xyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUucmVtb3ZlKClcclxuICAgICAgICBjaGFydDI0U3R5bGVOb2RlID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW50ZXJ2YWwoY2hhdDI0SW50ZXJ2YWxJZClcclxuICAgIGNoYXQyNEludGVydmFsSWQgPSBudWxsXHJcblxyXG4gICAgY2xlYXJUaW1lb3V0KGNoYXQyNFRpbWVvdXRJZClcclxuICAgIGNoYXQyNFRpbWVvdXRJZCA9IG51bGxcclxufVxyXG5cclxuY29uc3QgY2hhdDI0UmVuZGVyTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjaGF0MjRJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoZml4Q2hhdDI0V2lkZ2V0UG9zaXRpb24sIDEwMClcclxufVxyXG5cclxuY29uc3QgaGFyZFJlbW92ZUNoYXQyNFJlbmRlckxpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgY2hhdDI0VGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGNoYXQyNEludGVydmFsSWQpIGNsZWFySW50ZXJ2YWwoY2hhdDI0SW50ZXJ2YWxJZClcclxuICAgIH0sIDEwMDAwKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChjaGF0MjRSZW5kZXJMaXN0ZW5lcik7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoaGFyZFJlbW92ZUNoYXQyNFJlbmRlckxpc3RlbmVyKTtcclxufSlcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCAxMDI0KSB7XHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKGNoYXQyNFJlbmRlckxpc3RlbmVyKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFydDI0U3R5bGVOb2RlKSBjaGFydDI0U3R5bGVOb2RlLnJlbW92ZSgpXHJcbn0pXHJcbi8vIEZpeGluZyBjaGF0LTI0IHdpZGdldCBwb3NpdGlvbiAtLSBGSU5JU0giLCIvKipcclxuICog0KTQu9Cw0LMsINGD0LrQsNC30YvQstCw0Y7RidC40Lkg0L3QsCDRgNC10LbQuNC8INGA0LDQt9GA0LDQsdC+0YLQutC4LlxyXG4gKiBAdHlwZSB7Ym9vbGVhbn1cclxuICpcclxuICog0JTQu9GPINGB0LXRgNCy0LXRgNCwINCy0LXRgNGB0YLQutC4INGB0L7QsdC40YDQsNGC0Ywg0Lgg0L/Rg9GI0LjRgtGMINCyINGA0LXQttC40LzQtSBERVZfTU9ERSA9IHRydWVcclxuICog0J3QsCDQv9GA0L7QtCDQuCDQtNC10LIg0YHQvtCx0LjRgNCw0YLRjCDQuCDQv9GD0YjQuNGC0Ywg0LIg0YDQtdC20LjQvNC1IERFVl9NT0RFID0gZmFsc2VcclxuICpcclxuICog0JIg0YDQtdC20LjQvNC1IERFVl9NT0RFID0gdHJ1ZSwg0L/RgNC4INC70L7QutCw0LvRjNC90L7QuSDRgNCw0LfRgNCw0LHQvtGC0LrQtSxcclxuICog0YLQsNC60LbQtSDQvdC10L7QsdGF0L7QtNC40LzQviDQv9GA0LDQstC40YLRjCDQv9GD0YLRjCDQtNC+INGE0LDQudC70LAgbWFpbi5qc1xyXG4gKlxyXG4gKiDQn9GA0LjQvC46IDxzY3JpcHQgc3JjPVwiaHR0cDovL2xvY2FsaG9zdDrQvdC+0LzQtdGAX9C/0L7RgtCwL2pzL21haW4uanNcIiBkZWZlcj48L3NjcmlwdD5cclxuICovXHJcbmNvbnN0IERFVl9NT0RFID0gd2luZG93Lk1PREUgPT09ICdkZXYnIC8vIGRldiAtIHRydWUsIGJ1aWxkIC0gZmFsc2VcclxuXHJcbi8vIEluaXQgY2FydCBjdXN0b20gRXZlbnRcclxuY29uc3QgY2FydEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjYXJ0VXBkYXRlRXZlbnQnLCB7XHJcbiAgICBkZXRhaWw6IHtcclxuICAgICAgICBtZXNzYWdlOiAnRmlyZWQgY2FydCBwcm9kdWN0IHVwZGF0ZWQgY3VzdG9tIEV2ZW50ISdcclxuICAgIH0sXHJcbiAgICBidWJibGVzOiBmYWxzZSxcclxuICAgIGNhbmNlbGFibGU6IGZhbHNlXHJcbn0pXHJcblxyXG5jb25zdCBub3JtYWxpemVSZXNwb25zZUNhcnREYXRhID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3RzID0gW11cclxuXHJcbiAgICBpZiAoZGF0YS5kb3RzKSB7XHJcbiAgICAgICAgZGF0YS5kb3RzLmZvckVhY2goZG90ID0+IHtcclxuICAgICAgICAgICAgcHJvZHVjdHMucHVzaCh7YXJ0aWNsZTogZG90LmlkLCBjb3VudDogZG90LmNvdW50fSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5wcm9kdWN0cykge1xyXG4gICAgICAgIGRhdGEucHJvZHVjdHMuZm9yRWFjaChwcm9kdWN0ID0+IHtcclxuICAgICAgICAgICAgcHJvZHVjdHMucHVzaCh7YXJ0aWNsZTogcHJvZHVjdC5hcnRpY2xlLCBjb3VudDogcHJvZHVjdC5jb3VudH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHByb2R1Y3RzXHJcbn1cclxuXHJcbi8vIE1ldGhvZHMgdG8gd29yayB3aXRoIGNhcnQgZm9yIFBST0RVQ1RTXHJcbndpbmRvdy5zZXRQcm9kdWN0VG9DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRidCw0LXQvCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgtC+0LLQsNGA0LAg0LIg0LrQvtGA0LfQuNC90LU6JywgYXJ0LCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnYXJ0JywgYXJ0KVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LXNldC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L3NldCcsIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgdGC0LjQu9C4INGC0L7QstCw0YAg0LIg0LrQvtGA0LfQuNC90LUuINCf0L7Qu9GD0YfQuNC70Lgg0L7RgtCy0LXRgicsIGRhdGEpXHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhXHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgNCw0LfQvNC10YnQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LIg0JrQvtGA0LfQuNC90LUhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZFByb2R1Y3RUb0NhcnQgPSBhc3luYyAoe2FydCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygn0JTQvtCx0LDQstC70LXQvdC40LUg0YLQvtCy0LDRgNCwINCyINC60L7RgNC30LjQvdGDOicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1hZGQuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9hZGQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQlNC+0LHQsNCy0LjQu9C4INGC0L7QstCw0YAg0LIg0LrQvtGA0LfQuNC90YMuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1JywgZGF0YSlcclxuICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LTQvtCx0LDQstC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINCa0L7RgNC30LjQvdGDISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LnJlbW92ZVByb2R1Y3RGcm9tQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQo9C00LDQu9C10L3QuNC1INGC0L7QstCw0YDQsCDQuNC3INC60L7RgNC30LjQvdGLOicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1kZWwuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9kZWwnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQo9C00LDQu9C40LvQuCDRgtC+0LLQsNGAINC40Lcg0LrQvtGA0LfQuNC90YsuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1JywgZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGD0LTQsNC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINC40Lcg0JrQvtGA0LfQuNC90YshINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxuLy8gTWV0aG9kcyB0byB3b3JrIHdpdGggY2FydCBmb3IgRE9UU1xyXG53aW5kb3cuc2V0RG90VG9DYXJ0ID0gYXN5bmMgKHtpZCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGJ0LDQtdC8INGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INCU0L7RgtC+0LIg0LIg0LrQvtGA0LfQuNC90LU6JywgaWQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdpZCcsIGlkKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LXNldERvdC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L3NldCcsIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRgdGC0LjQu9C4INCU0L7RgtGLINCyINC60L7RgNC30LjQvdC1LiDQn9C+0LvRg9GH0LjQu9C4INC+0YLQstC10YInLCBkYXRhKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGA0LDQt9C80LXRidC10L3QuNGPINCU0L7RgtC+0LIg0LIg0JrQvtGA0LfQuNC90LUhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZERvdFRvQ2FydCA9IGFzeW5jIChvcmRlcikgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQu9C10L3QuNC1INC00L7RgtCwINCyINC60L7RgNC30LjQvdGDLiDQntGC0L/RgNCw0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LU6Jywgb3JkZXIpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtYWRkRG90Lmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvYWRkRG90Jywge21ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeShvcmRlcil9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuICAgICAgICB3aW5kb3cuc2hvd01vZGFsTXNnKFwi0JTQvtCx0LDQstC40LvQuCDQlNC+0YIg0LIg0LrQvtGA0LfQuNC90YMuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1XCIsIGRhdGEpXHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC00L7QsdCw0LLQu9C10L3QuNGPINCU0L7RgtCwINCyINCa0L7RgNC30LjQvdGDISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5yZW1vdmVEb3RGcm9tQ2FydCA9IGFzeW5jICh7aWQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ9Cj0LTQsNC70LXQvdC40LUg0JTQvtGC0LAg0LjQtyDQutC+0YDQt9C40L3RizonLCBpZCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2lkJywgaWQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtZGVsRG90Lmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZGVsRG90Jywge21ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YX0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygn0KPQtNCw0LvQuNC70LggRG90INC40Lcg0LrQvtGA0LfQuNC90YsuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1JywgZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGD0LTQsNC70LXQvdC40Y8g0JTQvtGC0LAg0LjQtyDQmtC+0YDQt9C40L3RiyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gQ2FydCBQcm94eVxyXG5jb25zdCBjYXJ0R2V0ID0gKHRhcmdldCwgcHJvcCkgPT4ge1xyXG4gICAgcmV0dXJuIHRhcmdldFtwcm9wXVxyXG59XHJcblxyXG5jb25zdCBjYXJ0U2V0ID0gKHRhcmdldCwgcHJvcCwgdmFsKSA9PiB7XHJcblxyXG5cclxuICAgIGlmIChwcm9wID09PSAncHJvZHVjdHMnKSB7XHJcbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0YzRgtC1LCDQvtGC0LvQuNGH0LDQtdGC0YHRjyDQu9C4INC90L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQvtGCINGB0YLQsNGA0L7Qs9C+INC30L3QsNGH0LXQvdC40Y8uXHJcbiAgICAgICAgY29uc3QgaXNfc2FtZSA9ICh0YXJnZXQucHJvZHVjdHMubGVuZ3RoID09PSB2YWwubGVuZ3RoKSAmJiB0YXJnZXQucHJvZHVjdHMuZXZlcnkoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuYXJ0aWNsZSA9PT0gdmFsW2luZGV4XS5hcnRpY2xlICYmIGVsZW1lbnQuY291bnQgPT09IHZhbFtpbmRleF0uY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIGlmICghaXNfc2FtZSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnU0VUVElORycpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndGFyZ2V0JywgdGFyZ2V0KTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Byb3AnLCBwcm9wKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3ZhbCcsIHZhbCk7XHJcblxyXG4gICAgICAgICAgICB0YXJnZXQucHJvZHVjdHMgPSBbLi4udmFsXTtcclxuICAgICAgICAgICAgY2FydEV2ZW50LmRldGFpbC5wcm9kdWN0cyA9IHRhcmdldC5wcm9kdWN0cztcclxuICAgICAgICAgICAgLy8gRGlzcGF0Y2hpbmcgY3VzdG9tIGNhcnQgdXBkYXRlIEV2ZW50XHJcbiAgICAgICAgICAgIGNvbnN0IGNhcnRQcm9kdWN0Q291bnROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYXJ0UHJvZHVjdENvdW50XCIpO1xyXG4gICAgICAgICAgICBpZiAoY2FydFByb2R1Y3RDb3VudE5vZGUpIGNhcnRQcm9kdWN0Q291bnROb2RlLmRpc3BhdGNoRXZlbnQoY2FydEV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuY29uc3QgaW5pdENhcnQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAoIXdpbmRvdy5DQVJUKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1nZXQuanNvbicpXHJcbiAgICAgICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZ2V0Jywge21ldGhvZDogJ1BPU1QnfSlcclxuXHJcbiAgICAgICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG5cclxuICAgICAgICAgICAgd2luZG93LkNBUlQgPSBuZXcgUHJveHkoe1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdHM6IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGNhcnRHZXQsXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGNhcnRTZXRcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC60L7RgNC30LjQvdGDIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFNUQVJUJyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdSZXNwb25zZSBkYXRhJywgZGF0YSlcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3dpbmRvdy5DQVJUJywgd2luZG93LkNBUlQpXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC60L7RgNC30LjQvdGDIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEZJTklTSCcpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LfQsNC/0YDQvtGB0LAg0JrQvtGA0LfQuNC90YshINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdENhcnQpXHJcblxyXG4vLyBzZXRUaW1lb3V0KCgpID0+IHtcclxuLy8gICAgIC8vINC+0YLQutC70LDQtNGL0LLQsNC10Lwg0L3QsCAxINC80LjQvdGD0YLRg1xyXG4vLyAgICAgd2luZG93LmNhcnRVcGRhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcclxuLy8gICAgICAgICBpZiAod2luZG93LkNBUlQgIT09IHVuZGVmaW5lZCAmJiAhREVWX01PREUpIHtcclxuLy8gICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZ2V0Jywge21ldGhvZDogJ1BPU1QnfSlcclxuLy8gICAgICAgICAgICAgaWYgKHJlcy5vaykge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuLy8gICAgICAgICAgICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9LCAzMDAwMClcclxuLy8gfSwgNjAwMDApIl19
