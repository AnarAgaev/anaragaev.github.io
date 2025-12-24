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
            await fetch("https://anaragaev.github.io/technolight-ru/mocks/inform.html") :
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
                clearModalVideo()
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

const clearModalVideo = () => {
    const modal = document.querySelector('#modalVideo')

    const modal__title = modal?.querySelector('.modal__title')
    const modal__video = modal?.querySelector('.modal__video')
    if (modal__video) {
        modal__video.innerHTML = '';
    }
    if (modal__title) {
        modal__title.innerHTML = '';
    }
}

const initCloseModal = () => {
    document.addEventListener('click', (e) => {
        const isOnPopupModal = e.target.closest('.modal__dialog')
        const downloadTablePreview = e.target.closest('.download__table-preview');

        if(isOnPopupModal) return
        if(downloadTablePreview) return

        hideModalDialog()
        clearModalVideo()
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

const insertVideoIntoTarget = (videoUrl, targetSelector) => {
    const videoId = videoUrl.split('/').filter(Boolean).pop();
    const embedLink = `https://rutube.ru/play/embed/${videoId}/`
    const videoElement = document.createElement('iframe');
    videoElement.src = embedLink;
    videoElement.frameBorder = 0;
    videoElement.allow = 'clipboard-write; autoplay';
    videoElement.setAttribute('webkitAllowFullScreen', '');
    videoElement.setAttribute('mozallowfullscreen', '');
    videoElement.setAttribute('allowFullScreen', '');

    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
        targetElement.appendChild(videoElement);
    } else {
        console.error('Элемент с указанным селектором не найден.');
    }
}


window.addEventListener('load', () => {
    initModal()
    initCloseModal()
    initToggleVisiblePass()

    document.addEventListener('click', function (event) {
        const downloadTablePreview = event.target.closest('.download__table-preview');
        if (downloadTablePreview) {
            showModalBack();

            const urlVideo = downloadTablePreview.dataset.video;
            const body = document.querySelector('#body');
            body.classList.add('modal-open');

            const modalVideo = document.querySelector('#modalVideo');
            modalVideo.classList.remove('hide');
            modalVideo.classList.add('show');

            modalVideo.querySelector('.modal__title').innerHTML = downloadTablePreview.querySelector('img').getAttribute('alt');

            insertVideoIntoTarget(urlVideo, '.modal__video');
        }
    });
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

    // const SEARCH_REQUEST_URL = 'https://anaragaev.github.io/technolight-ru/mocks/search.json'
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
        ? await fetch('https://anaragaev.github.io/technolight-ru/mocks/cart-set.json')
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
        ? await fetch('https://anaragaev.github.io/technolight-ru/mocks/cart-add.json')
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
        ? await fetch('https://anaragaev.github.io/technolight-ru/mocks/cart-del.json')
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
        ? await fetch('https://anaragaev.github.io/technolight-ru/mocks/cart-setDot.json')
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
        ? await fetch('https://anaragaev.github.io/technolight-ru/mocks/cart-addDot.json')
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
        ? await fetch('https://anaragaev.github.io/technolight-ru/mocks/cart-delDot.json')
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
            ? await fetch('https://anaragaev.github.io/technolight-ru/mocks/cart-get.json')
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJkZWJvdW5jZS5qcyIsImRvd25sb2FkRmlsZS5qcyIsImV2ZW50LmpzIiwiZm9ybWF0TnVtYmVyLmpzIiwiZ2V0VXJsUGFyYW1ldGVyQnlOYW1lLmpzIiwic2F2ZUNhbGwuanMiLCJzbW9vdGhTY3JvbGxUby5qcyIsInRocm90dGxlLmpzIiwidmFsaWRhdGVFbWFpbC5qcyIsInZhbGlkYXRlUGhvbmUuanMiLCJhY2NvdW50LWZvcm1zL3NjcmlwdC5qcyIsImNhcmRzLWl0ZW0vc2NyaXB0LmpzIiwiY2FyZHMtc2VyaWVzL3NjcmlwdC5qcyIsImZpbHRlcnMvc2NyaXB0LmpzIiwiaW5mb3JtZXIvc2NyaXRwLmpzIiwibW9kYWxzL3NjcmlwdC5qcyIsInByb2R1Y3QtaW5mby9zY3JpcHQuanMiLCJzY3JvbGwtdG8tdG9wL3NjcmlwdC5qcyIsInNob3ctbW9kYWwtbXNnL3NjcmlwdC5qcyIsInJlY29tbWVuZGF0aW9uL3NjcmlwdC5qcyIsInNwaW5uZXIvc2NyaXB0LmpzIiwiZm9vdGVyL3NjcmlwdC5qcyIsImhlYWRlci9zY3JpcHQuanMiLCJtYWluLmpzIiwiY2FydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDbGVhciBwaG9uZSBvZiBzcGFjZXMsIGJyYWNrZXRzLFxyXG4gKiBkYXNoZXMgYW5kIHBsdXMgc2lnbi4gTGVhdmUgb25seSBudW1iZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcGhvbmUgLSBUaGUgcGhvbmUsIHRoYXQgbmVlZHMgdG8gY2xlYXIuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gUGhvbmUgbnVtYmVyIGFzIGEgbnVtYmVyIHR5cGUuXHJcbiAqL1xyXG53aW5kb3cuY2xlYXJQaG9uZSA9IChwaG9uZSkgPT4ge1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KHBob25lLnJlcGxhY2UoL1xcRC9nLCBcIlwiKSlcclxufVxyXG4iLCJ3aW5kb3cuZGVib3VuY2UgPSAoZnVuYywgbXMpID0+IHtcclxuICAgIGxldCB0aW1lb3V0SWRcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXNcclxuICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzXHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpXHJcblxyXG4gICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXHJcbiAgICAgICAgfSwgbXMpXHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIERvd25sb2FkcyBhIGZpbGUgZnJvbSB0aGUgc3BlY2lmaWVkIFVSTCBhbmQgdHJpZ2dlcnMgYSBkb3dubG9hZCBpbiB0aGUgYnJvd3Nlci5cclxuICogXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgVVJMIG9mIHRoZSBmaWxlIHRvIGJlIGRvd25sb2FkZWQuXHJcbiAqL1xyXG53aW5kb3cuZG93bmxvYWRGaWxlID0gKHVybCwgZmlsZW5hbWU9bnVsbCwgZGVmYXVsdEV4dGVuc2lvbiA9ICdiaW4nKSAgPT4ge1xyXG4gICAgaWYgKHVybCA9PT0gdW5kZWZpbmVkIHx8IHVybCA9PT0gbnVsbCB8fCB1cmwgPT09IFwiXCIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyDQn9C+0LrQsNC30LDRgtGMINGB0L/QuNC90L3QtdGAXHJcbiAgICBpZiAod2luZG93LnNwaW5uZXIgJiYgdHlwZW9mIHdpbmRvdy5zcGlubmVyLnNob3cgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIHdpbmRvdy5zcGlubmVyLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQodC+0LfQtNCw0LXQvCDQvdC+0LLRi9C5IFhNTEh0dHBSZXF1ZXN0XHJcbiAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XHJcblxyXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LfQsNCz0YDRg9C30LrQuFxyXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgLy8g0J/QvtC/0YvRgtC60LAg0L/QvtC70YPRh9C40YLRjCDRgNCw0YHRiNC40YDQtdC90LjQtSDQuNC3INC30LDQs9C+0LvQvtCy0LrQvtCyXHJcbiAgICAgICAgICAgIGxldCBleHRlbnNpb24gPSBkZWZhdWx0RXh0ZW5zaW9uO1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50RGlzcG9zaXRpb24gPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIpO1xyXG4gICAgICAgICAgICBpZiAoY29udGVudERpc3Bvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGNvbnRlbnREaXNwb3NpdGlvbi5tYXRjaCgvZmlsZW5hbWU9XCI/KCguKilcXC4oLiopKVwiPy8pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWxlbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBtYXRjaFszXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g0KHQvtC30LTQsNC10LwgVVJMINC00LvRjyDQt9Cw0LPRgNGD0LbQtdC90L3QvtCz0L4g0YTQsNC50LvQsFxyXG4gICAgICAgICAgICBjb25zdCBibG9iVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTCh4aHIucmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0LLRgNC10LzQtdC90L3Ri9C5INGN0LvQtdC80LXQvdGCIDxhPiDQtNC70Y8g0YHQutCw0YfQuNCy0LDQvdC40Y8g0YTQsNC50LvQsFxyXG4gICAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IGJsb2JVcmw7XHJcbiAgICAgICAgICAgIGEuZG93bmxvYWQgPSBgJHtmaWxlbmFtZX0uJHtleHRlbnNpb259YDsgLy8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LjQvNGPINGE0LDQudC70LAg0YEg0YDQsNGB0YjQuNGA0LXQvdC40LXQvFxyXG5cclxuICAgICAgICAgICAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGN0LvQtdC80LXQvdGCINCyIERPTSDQuCDQuNC90LjRhtC40LjRgNGD0LXQvCDRgdC60LDRh9C40LLQsNC90LjQtVxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICBhLmNsaWNrKCk7XHJcblxyXG4gICAgICAgICAgICAvLyDQo9C00LDQu9GP0LXQvCDRjdC70LXQvNC10L3RgiDQuNC3IERPTVxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xyXG5cclxuICAgICAgICAgICAgLy8g0J7RgdCy0L7QsdC+0LbQtNCw0LXQvCBVUkwg0L7QsdGK0LXQutGC0LBcclxuICAgICAgICAgICAgVVJMLnJldm9rZU9iamVjdFVSTChibG9iVXJsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCh0LrRgNGL0YLRjCDRgdC/0LjQvdC90LXRgFxyXG4gICAgICAgIGlmICh3aW5kb3cuc3Bpbm5lciAmJiB0eXBlb2Ygd2luZG93LnNwaW5uZXIuaGlkZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCe0LHRgNCw0LHQvtGC0YfQuNC6INC+0YjQuNCx0L7QulxyXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwi0J7RiNC40LHQutCwINC/0YDQuCDQt9Cw0LPRgNGD0LfQutC1INGE0LDQudC70LBcIik7XHJcblxyXG4gICAgICAgIC8vINCh0LrRgNGL0YLRjCDRgdC/0LjQvdC90LXRgCDQsiDRgdC70YPRh9Cw0LUg0L7RiNC40LHQutC4XHJcbiAgICAgICAgaWYgKHdpbmRvdy5zcGlubmVyICYmIHR5cGVvZiB3aW5kb3cuc3Bpbm5lci5oaWRlID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LfQsNC/0YDQvtGBXHJcbiAgICB4aHIuc2VuZCgpO1xyXG59Iiwid2luZG93LmN1c3RvbUV2ZW50ID0ge1xyXG4gIG9uOiAoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSA9PiB7XHJcbiAgICB3aW5kb3cuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spO1xyXG4gIH0sXHJcbiAgb2ZmOiAoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSA9PiB7XHJcbiAgICB3aW5kb3cuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spO1xyXG4gIH0sXHJcbiAgb25jZTogKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykgPT4ge1xyXG4gICAgY29uc3QgaGFuZGxlciA9IChldmVudCkgPT4ge1xyXG4gICAgICBldmVudENhbGxiYWNrKGV2ZW50KTtcclxuICAgICAgdGhpcy5vZmYoZXZlbnROYW1lLCBoYW5kbGVyKTtcclxuICAgIH07XHJcbiAgICB0aGlzLm9uKGV2ZW50TmFtZSwgaGFuZGxlcik7XHJcbiAgfSxcclxuICBlbWl0OiAoZXZlbnROYW1lLCBldmVudERhdGEpID0+IHtcclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xyXG4gICAgICBkZXRhaWw6IGV2ZW50RGF0YSxcclxuICAgICAgYnViYmxlczogZmFsc2UsXHJcbiAgICAgIGNhbmNlbGFibGU6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIHdpbmRvdy5kb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIHJldHVybiBldmVudDtcclxuICB9XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBGb3JtYXR0aW5nIG51bWJlciB0byB0aGUgbG9jYWwgdmFsdWVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXJ9IG51bWJlciAtIFZhbHVlIGZvciBmb3JtYXR0aW5nLlxyXG4gKi9cclxuXHJcbndpbmRvdy5mb3JtYXROdW1iZXIgPSAobnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KG51bWJlci50b1N0cmluZygpLnJlcGxhY2UoL1xccy9nLCBcIlwiKSlcclxuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiIFwiKTtcclxufVxyXG4iLCIvKipcclxuICogR2V0dGluZyBnZXQgcGFyYW1ldGVyIGZyb20gdGhlIHVybFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzZWFyY2ggcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3VybF0gLSBUaGUgVVJMIGFkZHJlc3MuIElmIHRoaXMgcGFyYW1ldGVyIGlzIG5vdCBwYXNzZWQsIHRoZW4gdGhlIHNlYXJjaCwgYnkgZGVmYXVsdCwgd2lsbCBvY2N1ciBpbiB0aGUgY3VycmVudCBVUkwuXHJcbiAqL1xyXG53aW5kb3cuZ2V0VXJsUGFyYW1ldGVyQnlOYW1lID0gZnVuY3Rpb24obmFtZSwgdXJsKSB7XHJcbiAgICBpZiAoIW5hbWUpIHJldHVyblxyXG5cclxuICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG5cclxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpXHJcblxyXG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLFxyXG4gICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcblxyXG4gICAgICAgIGlmICghcmVzdWx0cykgcmV0dXJuIG51bGxcclxuXHJcbiAgICBpZiAoIXJlc3VsdHNbMl0pIHJldHVybiAnJ1xyXG5cclxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKVxyXG59XHJcbiIsIi8qKlxyXG4gKiDQsdC10LfQvtC/0LDRgdC90YvQuSDQstGL0LfQvtCyINGE0YPQvdC60YbQuNC4XHJcbiAqIEBwYXJhbSBmbiBmdW5jdGlvblxyXG4gKiBAcGFyYW0geygqfCopW11bXX0gYXJnc1xyXG4gKi9cclxud2luZG93LnNhZmVDYWxsID0gZnVuY3Rpb24oZm4sIC4uLmFyZ3MpIHtcclxuICB0cnkge1xyXG4gICAgZm4uY2FsbCh0aGlzIHx8IHdpbmRvdywgLi4uYXJncyk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwiW1NhZmUgQ2FsbF06IFwiLCBmbiwgZSk7XHJcbiAgfVxyXG59OyIsIi8qKlxyXG4gKiBTbW9vdGhseSBzY3JvbGxzIHRoZSBwYWdlIHRvIHRoZSBzcGVjaWZpZWQgcG9zaXRpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBwb3NpdGlvbiB0byBzY3JvbGwgdG8uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb249NTAwXSAtIFRoZSBkdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uIGluIG1pbGxpc2Vjb25kcy5cclxuICovXHJcbmZ1bmN0aW9uIHNtb290aFNjcm9sbFRvKHBvc2l0aW9uLCBkdXJhdGlvbiA9IDUwMCkge1xyXG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb25cclxuICAgIGxldCBzdGFydFRpbWVzdGFtcCA9IG51bGxcclxuXHJcbiAgICBmdW5jdGlvbiBzdGVwKHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICghc3RhcnRUaW1lc3RhbXApIHN0YXJ0VGltZXN0YW1wID0gdGltZXN0YW1wXHJcblxyXG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gdGltZXN0YW1wIC0gc3RhcnRUaW1lc3RhbXBcclxuICAgICAgICBjb25zdCBzY3JvbGxZID0gZWFzZUluT3V0Q3ViaWMocHJvZ3Jlc3MsIHN0YXJ0UG9zaXRpb24sIGRpc3RhbmNlLCBkdXJhdGlvbilcclxuXHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbFkpXHJcblxyXG4gICAgICAgIGlmIChwcm9ncmVzcyA8IGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZWFzZUluT3V0Q3ViaWModCwgYiwgYywgZCkge1xyXG4gICAgICAgIHQgLz0gZFxyXG4gICAgICAgIHQtLVxyXG4gICAgICAgIHJldHVybiBjICogKHQgKiB0ICogdCArIDEpICsgYlxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxufVxyXG4iLCJ3aW5kb3cudGhyb3R0bGUgPSAoZnVuYywgbXMpID0+IHtcclxuICAgIGxldCBpc1Rocm90dGxlZCA9IGZhbHNlLFxyXG4gICAgICAgIHNhdmVkQXJncyxcclxuICAgICAgICBzYXZlZFRoaXNcclxuXHJcbiAgICBmdW5jdGlvbiB3cmFwcGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoaXNUaHJvdHRsZWQpIHsgLy8gMlxyXG4gICAgICAgICAgICBzYXZlZEFyZ3MgPSBhcmd1bWVudHNcclxuICAgICAgICAgICAgc2F2ZWRUaGlzID0gdGhpc1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSAvLyAxXHJcblxyXG4gICAgICAgIGlzVGhyb3R0bGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpc1Rocm90dGxlZCA9IGZhbHNlIC8vIDNcclxuICAgICAgICAgICAgaWYgKHNhdmVkQXJncykge1xyXG4gICAgICAgICAgICAgICAgd3JhcHBlci5hcHBseShzYXZlZFRoaXMsIHNhdmVkQXJncylcclxuICAgICAgICAgICAgICAgIHNhdmVkQXJncyA9IHNhdmVkVGhpcyA9IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIG1zKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3cmFwcGVyXHJcbn0iLCIvKipcclxuICogRW1haWwgYWRkcmVzcyB2ZXJpZmljYXRpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsLCB0aGF0IG5lZWRzIHRvIHZhbGlkYXRpbmcuXHJcbiAqL1xyXG53aW5kb3cudmFsaWRhdGVFbWFpbCA9IChlbWFpbCkgPT4ge1xyXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBlbWFpbFxyXG4gICAgY29uc3QgZW1haWxSZWdleCA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvXHJcbiAgICByZXR1cm4gZW1haWxSZWdleC50ZXN0KGVtYWlsKVxyXG59XHJcbiIsIi8qKlxyXG4gKiBQaG9uZSBudW1iZXIgdmVyaWZpY2F0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZSAtIFRoZSBwaG9uZSwgdGhhdCBuZWVkcyB0byB2YWxpZGF0aW5nLlxyXG4gKi9cclxud2luZG93LnZhbGlkYXRlUGhvbmUgPSAocGhvbmUpID0+IHtcclxuICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgcGhvbmVcclxuICAgIGNvbnN0IHBob25lUmVnZXggPSAvXjdcXGR7MTB9JC9cclxuICAgIHJldHVybiBwaG9uZVJlZ2V4LnRlc3QocGhvbmUpXHJcbn1cclxuIiwiY29uc3QgaW5pdFRvZ2dsZVZpc2libGVGb3JtUGFzcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2dnbGUtdmlzaWJsZS1wYXNzJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgIGNvbnN0IGlzVGV4dCA9IGlucHV0LnR5cGUgPT09ICd0ZXh0J1xyXG5cclxuICAgICAgICBpbnB1dC50eXBlID0gaXNUZXh0ID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0J1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgncGFzcy12aXNpYmxlJylcclxuICAgIH0pKVxyXG59XHJcblxyXG4vLyBjb25zdCByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIgPSAoaW5wdXROb2RlKSA9PiB7XHJcbi8vICAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUuY2xvc2VzdCgnbGFiZWwnKVxyXG4vLyAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbi8vIH1cclxuXHJcbi8vIGNvbnN0IHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIgPSAoaW5wdXROb2RlLCBlcnJvclRleHQpID0+IHtcclxuLy8gICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5jbG9zZXN0KCdsYWJlbCcpXHJcbi8vICAgICBjb25zdCBtZXNzYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJylcclxuXHJcbi8vICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGFzLWVycm9yJylcclxuLy8gICAgIG1lc3NhZ2UuaW5uZXJUZXh0ID0gZXJyb3JUZXh0XHJcblxyXG4vLyAgICAgaW5wdXROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4vLyAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxyXG4vLyAgICAgfSlcclxuLy8gfVxyXG5cclxuLy8gY29uc3QgaW5pdEFjY291bnRGb3JtID0gKCkgPT4ge1xyXG4vLyAgICAgY29uc3QgZm9ybXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvdW50LWZvcm1fX2Zvcm0nKSlcclxuLy8gICAgIGlmIChmb3Jtcy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuLy8gICAgIGZvcm1zLmZvckVhY2goZm9ybSA9PiBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuLy8gICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbi8vICAgICAgICAgY29uc3QgZm9ybVZhbGlkID0ge2VtYWlsOiB0cnVlLCBwYXNzOiB0cnVlLCB9XHJcbi8vICAgICAgICAgY29uc3QgZW1haWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZW1haWxcIl0nKVxyXG4vLyAgICAgICAgIGNvbnN0IHBhc3MgID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBhc3NcIl0nKVxyXG4vLyAgICAgICAgIGNvbnN0IGZvcm1UeXBlID0gdGhpcy5kYXRhc2V0LmZvcm1UeXBlXHJcblxyXG4vLyAgICAgICAgIHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbClcclxuLy8gICAgICAgICBpZiAoZm9ybVR5cGUgIT09ICdyZWNvdmVyeScpIHtcclxuLy8gICAgICAgICAgICAgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKHBhc3MpXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAvLyBDaGVjayBlbWFpbFxyXG4vLyAgICAgICAgIGlmIChlbWFpbC52YWx1ZSAhPT0gJycpIHtcclxuLy8gICAgICAgICAgICAgaWYgKHdpbmRvdy52YWxpZGF0ZUVtYWlsKGVtYWlsLnZhbHVlKSkge1xyXG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gdHJ1ZVxyXG4vLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbCwgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyEnKVxyXG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2VcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIoZW1haWwsICfQndC10L7QsdGF0L7QtNC40LzQviDRg9C60LDQt9Cw0YLRjCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyEnKVxyXG4vLyAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSBmYWxzZVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgLy8gQ2hlY2sgcGFzc1xyXG4vLyAgICAgICAgIGlmIChmb3JtVHlwZSAhPT0gJ3JlY292ZXJ5Jykge1xyXG4vLyAgICAgICAgICAgICBpZiAocGFzcy52YWx1ZS5sZW5ndGggPCA4KSB7XHJcbi8vICAgICAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKHBhc3MsICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QsNGA0L7Qu9GMLiDQlNC70LjQvdC90LAg0L/QsNGA0L7Qu9GPINC00L7Qu9C20L3QsCDQsdGL0YLRjCDQvdC1INC80LXQvdC10LUgOCDRgdC40LzQstC+0LvQvtCyIScpXHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQucGFzcyA9IGZhbHNlXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIC8vIFNlbmdpbmcgZm9ybSBkYXRhXHJcbi8vICAgICAgICAgaWYgKGZvcm1WYWxpZC5lbWFpbCAmJiBmb3JtVmFsaWQucGFzcykge1xyXG4vLyAgICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcclxuXHJcbi8vICAgICAgICAgICAgIC8vINCe0LHRj9C30LDRgtC10LvRjNC90L4g0YPQtNCw0LvQuNGC0Ywg0L/QvtGB0LvQtSDQstC90LXQtNGA0LXQvdC40Y9cclxuLy8gICAgICAgICAgICAgZm9yIChsZXQgW25hbWUsIHZhbHVlXSBvZiBmb3JtRGF0YSkge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7bmFtZX06ICR7dmFsdWV9YCk7XHJcbi8vICAgICAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyByZXF1ZXN0IGZvciB1cGRhdGluZyB1c2VyIGRhdGEnKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9KSlcclxuLy8gfVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAvLyBpbml0QWNjb3VudEZvcm0oKVxyXG4gICAgaW5pdFRvZ2dsZVZpc2libGVGb3JtUGFzcygpXHJcbn0pIiwiLy8gQWRkIHByb2R1Y3QgdG8gZmF2b3JpdGVzXHJcbmNvbnN0IGFkZFRvRmF2b3JpdGVzQ2xpY2tIYW5kbGVyID0gKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIGNvbnN0IF90aGlzID0gZS50YXJnZXRcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBfdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJylcclxuICAgIGNvbnN0IHRpdGxlID0gX3RoaXMuZGF0YXNldC50aXRsZVxyXG4gICAgY29uc3QgbWVzc2FnZSA9IF90aGlzLmRhdGFzZXQubWVzc2FnZVxyXG4gICAgY29uc3QgaGVhZGVyRmF2b3JpdGVzID0gZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnV0dG9ucy1saW5rX2Zhdm9yaXRlcyAuaGVhZGVyX19idXR0b25zLWNvdW50JylcclxuICAgIGNvbnN0IGN1cnJlbnRGYXZvcml0ZXNDb3VudCA9IHBhcnNlSW50KGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQpXHJcblxyXG4gICAgaWYgKCFpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgX3RoaXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQgPSBjdXJyZW50RmF2b3JpdGVzQ291bnQgKyAxXHJcbiAgICAgICAgaGVhZGVyRmF2b3JpdGVzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGhlYWRlckZhdm9yaXRlcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpLCAxMDAwKVxyXG5cclxuICAgICAgICBzaG93TW9kYWxNc2codGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ9CX0LTQtdGB0Ywg0L3QsNC00L4g0LHRg9C00LXRgiDQvdCw0L/QuNGB0LDRgtGMINCw0YHQuNC90YXRgNC+0L3QvdGL0Lkg0LfQsNC/0YDQvtGBINC00L7QsdCw0LLQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQuNC30LHRgNCw0L3QvdGL0LUnKTtcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBfdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICBoZWFkZXJGYXZvcml0ZXMuaW5uZXJUZXh0ID0gY3VycmVudEZhdm9yaXRlc0NvdW50IC0gMVxyXG4gICAgLy8gY29uc29sZS5lcnJvcignQXN5bmMgcXVlcnkgdG8gREVMRVRFIHNlbGVjdGVkIHByb2R1Y3QgZnJvbSBGYXZvcml0ZXMnKTtcclxufVxyXG5cclxuY29uc3QgaW5pdEFkZFRvRmF2b3JpdGVzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3QtaXRlbV9fZmF2b3JpdGVzJykpXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGJ0biA9PiBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRUb0Zhdm9yaXRlc0NsaWNrSGFuZGxlcikpXHJcbn1cclxuXHJcbi8vIEFkZCBwcm9kdWN0IHRvIGNhcnRcclxuY29uc3QgYWRkVG9DYXJ0Q2xpY2tIYW5kbGVyID0gKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIGNvbnN0IF90aGlzID0gZS50YXJnZXRcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBfdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJylcclxuICAgIGNvbnN0IHRpdGxlID0gX3RoaXMuZGF0YXNldC50aXRsZVxyXG4gICAgY29uc3QgbWVzc2FnZSA9IF90aGlzLmRhdGFzZXQubWVzc2FnZVxyXG5cclxuICAgIGlmICghaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIF90aGlzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzaG93TW9kYWxNc2codGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgICAgIC8vIFB1c2ggY3VycmVudCBwcm9kdWN0IHRvIENhcnQgR2xvYmFsIE9iamVjdCAod2luZG93LkNBUlQpXHJcbiAgICAgICAgd2luZG93LmFkZFByb2R1Y3RUb0NhcnQoeyBhcnQ6IF90aGlzLmRhdGFzZXQucHJvZHVjdElkLCBjb3VudDogMSB9KVxyXG5cclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBfdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICBzaG93TW9kYWxNc2codGl0bGUsICfQo9C00LDQu9C10L0g0LjQtyDQutC+0YDQt9C40L3RiycpXHJcblxyXG4gICAgLy8gUmVtb3ZlIGN1cnJlbnQgcHJvZHVjdCBmcm9tIENhcnQgR2xvYmFsIE9iamVjdCAod2luZG93LkNBUlQpXHJcbiAgICB3aW5kb3cucmVtb3ZlUHJvZHVjdEZyb21DYXJ0KHsgYXJ0OiBfdGhpcy5kYXRhc2V0LnByb2R1Y3RJZCwgY291bnQ6IDEgfSlcclxufVxyXG5jb25zdCBpbml0QWRkVG9DYXJ0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3QtaXRlbV9fY2FydCcpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChidG4gPT4gYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWRkVG9DYXJ0Q2xpY2tIYW5kbGVyKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0QWRkVG9GYXZvcml0ZXMoKVxyXG4gICAgaW5pdEFkZFRvQ2FydCgpXHJcbn0pIiwiXHJcbmNvbnN0IHJlc2V0QWxsQ2FyZHNQaWNzID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IHBpY3MgPSBBcnJheS5mcm9tKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fcGljJykpXHJcbiAgICBwaWNzLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG59XHJcblxyXG5jb25zdCByZXNldEFsbENhcmRzVGFicyA9IChub2RlKSA9PiB7XHJcbiAgICBjb25zdCB0YWJzID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3RhYicpKVxyXG4gICAgdGFicy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxufVxyXG5cclxuY29uc3QgZ2V0VGFyZ2V0Q2FyZHNQaWMgPSAobm9kZSwgZGF0YVRhcmdldFR5cGVWYWwpID0+IHtcclxuICAgIHJldHVybiBub2RlLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXR5cGU9JHtkYXRhVGFyZ2V0VHlwZVZhbH1dYClcclxufVxyXG5cclxuY29uc3QgaW5pdENhcmRzVGFiID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFiQXJyID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX190YWInKSlcclxuXHJcbiAgICB0YWJBcnIuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmNsb3Nlc3QoJy5jYXJkcy1zZXJpZXNfX2l0ZW0nKVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQaWNUeXBlID0gdGhpcy5kYXRhc2V0LnRhcmdldFR5cGVcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UGljID0gZ2V0VGFyZ2V0Q2FyZHNQaWMocGFyZW50LCB0YXJnZXRQaWNUeXBlKVxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFjdGl2ZSB0YWJcclxuICAgICAgICAgICAgcmVzZXRBbGxDYXJkc1RhYnMocGFyZW50KVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFjdGl2ZSBpbWFnZVxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0UGljKSB7XHJcbiAgICAgICAgICAgICAgICByZXNldEFsbENhcmRzUGljcyhwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRQaWMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRDYXJkc1RhYilcclxuIiwiLy8gRmlsdGVyc1xyXG5jb25zdCBzaG93Tm9GaWx0ZXJNc2cgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuXHJcblxyXG4gICAgY29uc3QgbXNnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvbl9fbXNnXCIpO1xyXG5cclxuICAgIGlmICghbXNnKSByZXR1cm47XHJcbiAgICBtc2cuY2xhc3NMaXN0LmFkZChcImRpc3BsYXlcIik7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IG1zZy5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMTAwKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBoaWRlTm9GaWx0ZXJNc2cgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IG1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25fX21zZ1wiKTtcclxuXHJcbiAgICBpZiAoIW1zZykgcmV0dXJuO1xyXG5cclxuICAgIG1zZy5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcclxuICAgIG1zZy5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzcGxheVwiKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBjaGVja05vRmlsdGVyTXNnID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXTpub3QoLmhpZGUpXCIpO1xyXG5cclxuICAgIGl0ZW1zLmxlbmd0aCA9PT0gMFxyXG4gICAgICA/IHNob3dOb0ZpbHRlck1zZygpXHJcbiAgICAgIDogaGlkZU5vRmlsdGVyTXNnKCk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaGlkZUZpbHRlckxpc3QgPSAoZmlsdGVyTGlzdCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBmaWx0ZXJMaXN0LmZvckVhY2goZmlsdGVyID0+IHtcclxuICAgICAgZmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wcGVkXCIpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpLCAzMDApO1xyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3Qgc2hvd0ZpbHRlckRyb3AgPSAobm9kZSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IG5vZGUuY2xhc3NMaXN0LmFkZChcImRyb3BwZWRcIiksIDEwKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBoaWRlRmlsdGVyRHJvcCA9IChub2RlKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGZpbHRlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19faXRlbVwiKSk7XHJcblxyXG4gICAgaWYgKCFub2RlKSB7XHJcbiAgICAgIGhpZGVGaWx0ZXJMaXN0KGZpbHRlcnMpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBjbGVhbmVkRmlsdGVycyA9IGZpbHRlcnMuZmlsdGVyKGZpbHRlciA9PiBmaWx0ZXIgIT09IG5vZGUpO1xyXG4gICAgaGlkZUZpbHRlckxpc3QoY2xlYW5lZEZpbHRlcnMpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXRGaWx0ZXJzRHJvcCA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgZmlsdGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fbGlzdCAuZmlsdGVyc19faXRlbVwiKSk7XHJcblxyXG4gICAgZmlsdGVycy5mb3JFYWNoKGZpbHRlciA9PiB7XHJcbiAgICAgIGZpbHRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICAgICAgICBoaWRlRmlsdGVyRHJvcCgpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGlkZUZpbHRlckRyb3AodGhpcyk7XHJcbiAgICAgICAgc2hvd0ZpbHRlckRyb3AodGhpcyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaW5pdEZpbHRlcnNSZXNldCA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1jYXRhbG9nXCIpO1xyXG4gICAgaWYgKGlzUGFnZUNhdGFsb2cpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCByZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyc19fcmVzZXQgLmZpbHRlcnNfX2l0ZW1cIik7XHJcblxyXG4gICAgaWYgKCFyZXNldCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGZpbHRlcmVkU2VjdGlvbiA9IGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIik7XHJcblxyXG4gICAgcmVzZXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNsb3Nlc3QoXCIuZmlsdGVyc1wiKTtcclxuXHJcbiAgICAgIGNvbnN0IHNpYmxpbmdGaWx0ZXJzID0gY29udGFpbmVyXHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fbGlzdCAuZmlsdGVyc19faXRlbVwiKTtcclxuXHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fb3B0aW9uc1wiKSk7XHJcblxyXG4gICAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzIGlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl06bm90KFt2YWx1ZT1cXFwicmVzZXRcXFwiXSlcIikpO1xyXG5cclxuICAgICAgY29uc3QgY2FyZHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcclxuXHJcbiAgICAgIGNvbnN0IGRlbGV0ZWRUeXBlcyA9IEpTT04ucGFyc2UoZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIltkYXRhLWRlbGV0ZWQtdHlwZXNdXCIpXHJcbiAgICAgICAgLmRhdGFzZXQuZGVsZXRlZFR5cGVzKTtcclxuXHJcbiAgICAgIGhpZGVGaWx0ZXJMaXN0KHNpYmxpbmdGaWx0ZXJzKTtcclxuICAgICAgc3Bpbm5lci5zaG93KCk7XHJcbiAgICAgIGZpbHRlcmVkU2VjdGlvbi5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoXCJmaWx0ZXJpbmdcIikpO1xyXG4gICAgICBvcHRpb25zLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShcImNoZWNrZWRcIikpOyAvLyBoaWRlIHJzZXQgb3B0aW9uIGJ1dHRvblxyXG4gICAgICBjb250cm9sbGVycy5mb3JFYWNoKGNvbnRyb2xsZXIgPT4gY29udHJvbGxlci5jaGVja2VkID0gZmFsc2UpOyAvLyByZXNldCBhbGwgaW5wdXQgY29udHJvbGxlcnNcclxuICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMoKTtcclxuICAgICAgcmVzZXQuY2xvc2VzdChcIi5maWx0ZXJzX19yZXNldFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyBzaG93IGhpZGRlbiBjYXJkcyBhcyBkZWxldGUgZGF0YS1kaXNwbGF5IGF0dHJpYnV0ZXNcclxuICAgICAgICBjYXJkcy5mb3JFYWNoKGNhcmQgPT4ge1xyXG4gICAgICAgICAgZm9yIChjb25zdCB0eXBlIG9mIGRlbGV0ZWRUeXBlcykge1xyXG4gICAgICAgICAgICBjYXJkLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7dHlwZX1gKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2hlY2tGaWx0ZXJlZFNlY3Rpb24oKTtcclxuICAgICAgfSwgMTAwMCk7XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBjaGVja0ZpbHRlcmVkU2VjdGlvbiA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qgc2VjdGlvbnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKSk7XHJcblxyXG4gICAgc2VjdGlvbnMuZm9yRWFjaChzZWN0aW9uID0+IHtcclxuICAgICAgY29uc3QgZmlsdGVyZWRJdGVtcyA9IEFycmF5LmZyb20oc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XHJcbiAgICAgIGNvbnN0IHNob3duSXRlbXMgPSBmaWx0ZXJlZEl0ZW1zLmZpbHRlcihpID0+ICFpLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGVcIikpO1xyXG5cclxuICAgICAgaWYgKHNob3duSXRlbXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBzcGlubmVyLmhpZGUoKTtcclxuICAgIHNlY3Rpb25zLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShcImZpbHRlcmluZ1wiKSk7XHJcblxyXG4gICAgc2hvd0FuaW1FbGVtZW50cygpO1xyXG4gICAgc2V0QW5pbWF0aW9uRWxtcygpO1xyXG4gICAgY2hlY2tOb0ZpbHRlck1zZygpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlID0gKG5vZGUpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcclxuXHJcbiAgICBsZXQgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSBmYWxzZTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcclxuXHJcbiAgICAgIGlmIChhdHRyaWJ1dGVOYW1lLnN0YXJ0c1dpdGgoXCJkYXRhLWRpc3BsYXlcIikpIHtcclxuICAgICAgICBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGU7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgY2hlY2tGaWx0ZXJlZEl0ZW0gPSAocHJvcCwgdmFsKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGl0ZW1zLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoaS5kYXRhc2V0LmZpbHRlcik7XHJcbiAgICAgICAgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoZGF0YVtwcm9wXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlzTWF0Y2hlZCA9IGlzQXJyYXlcclxuICAgICAgICAgID8gZGF0YVtwcm9wXS5pbmNsdWRlcyh2YWwpXHJcbiAgICAgICAgICA6IGRhdGFbcHJvcF0gPT09IHZhbDtcclxuXHJcblxyXG4gICAgICAgIGlmIChpc01hdGNoZWQpIHtcclxuICAgICAgICAgIGkucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWApO1xyXG4gICAgICAgICAgaWYgKCFoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZShpKSkgaS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaS5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcclxuICAgICAgICAgIGkuc2V0QXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWAsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSwgMTAwMCk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgYWN0aXZlQ29sb3JJbkl0ZW0gPSAodmFsKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdGFyZ2V0LXR5cGU9XCIke3ZhbH1cIl1gKSk7XHJcblxyXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IGkuY2xpY2soKSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaW5pdEZpbHRlclNlbGVjdCA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1jYXRhbG9nXCIpO1xyXG4gICAgaWYgKGlzUGFnZUNhdGFsb2cpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVycyBpbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJdOm5vdChbdmFsdWU9XFxcInJlc2V0XFxcIl0pXCIpKTtcclxuXHJcbiAgICBjb25zdCBmaWx0ZXJlZFNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIik7XHJcblxyXG4gICAgY29uc3QgcmVzZXRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbHRlcnNfX3Jlc2V0XCIpO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGZpbHRlcmVkU2VjdGlvbi5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoXCJmaWx0ZXJpbmdcIikpO1xyXG4gICAgICBzcGlubmVyLnNob3coKTtcclxuICAgICAgY2hlY2tGaWx0ZXJlZEl0ZW0odGhpcy5uYW1lLCB0aGlzLnZhbHVlKTtcclxuICAgICAgYWN0aXZlQ29sb3JJbkl0ZW0odGhpcy52YWx1ZSk7XHJcbiAgICAgIHRoaXMuY2xvc2VzdChcIi5maWx0ZXJzX19vcHRpb25zXCIpLmNsYXNzTGlzdC5hZGQoXCJjaGVja2VkXCIpO1xyXG4gICAgICByZXNldEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XHJcbiAgICB9KSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlRGF0YUZpbHRlckF0dHJpYnV0ZSA9IChwcm9wKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtZGlzcGxheS0ke3Byb3B9XWApKTtcclxuXHJcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICBpLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gKTtcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNoZWNrQWxsSXRlbXNIYXNEaXNwbGF5QXR0cmlidXRlcyA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XHJcblxyXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgaWYgKCFoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZShpKSkge1xyXG4gICAgICAgIGkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHJlc2V0QWxsQ29udHJvbGxlcnNCeU5hbWUgPSAobmFtZSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtuYW1lfV1gKSk7XHJcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4gaS5jaGVja2VkID0gZmFsc2UpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB0YWJMaXN0cyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZHMtc2VyaWVzX19jb250cm9sc1wiKSk7XHJcblxyXG4gICAgdGFiTGlzdHMuZm9yRWFjaChsaXN0ID0+IHtcclxuICAgICAgbGlzdC5xdWVyeVNlbGVjdG9yKFwiLmNhcmRzLXNlcmllc19fdGFiXCIpPy5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgY2hlY2tBbGxGaWx0ZXJSZXNldEJ0biA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXNDaGVja2VkRmlsdGVyID0gZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fbGlzdCBpbnB1dDpjaGVja2VkXCIpO1xyXG5cclxuICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWx0ZXJzX19yZXNldFwiKTtcclxuXHJcbiAgICBpc0NoZWNrZWRGaWx0ZXIubGVuZ3RoID09PSAwXHJcbiAgICAgID8gcmVzZXQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpXHJcbiAgICAgIDogcmVzZXQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXRSZXNldEZpbHRlclByb3AgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtY2F0YWxvZ1wiKTtcclxuICAgIGlmIChpc1BhZ2VDYXRhbG9nKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnMgaW5wdXRbdmFsdWU9XFxcInJlc2V0XFxcIl1cIikpO1xyXG4gICAgY29uc3Qgc2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIik7XHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgc2VjdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKFwiZmlsdGVyaW5nXCIpKTtcclxuICAgICAgc3Bpbm5lci5zaG93KCk7XHJcbiAgICAgIHRoaXMuY2xvc2VzdChcIi5maWx0ZXJzX19vcHRpb25zXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJjaGVja2VkXCIpO1xyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgcmVtb3ZlRGF0YUZpbHRlckF0dHJpYnV0ZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIGNoZWNrQWxsSXRlbXNIYXNEaXNwbGF5QXR0cmlidXRlcygpO1xyXG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XHJcbiAgICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0J5TmFtZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zKCk7XHJcbiAgICAgICAgY2hlY2tBbGxGaWx0ZXJSZXNldEJ0bigpO1xyXG4gICAgICB9LCAxMDAwKTtcclxuICAgIH0pKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBpbml0RmlsdGVyc0Ryb3AoKTtcclxuICAgIGluaXRGaWx0ZXJzUmVzZXQoKTtcclxuICAgIGluaXRGaWx0ZXJTZWxlY3QoKTtcclxuICAgIGluaXRSZXNldEZpbHRlclByb3AoKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn0pOyIsImNsYXNzIEluZm9ybWVyIHtcclxuICAgIHN0YXRpYyBfaW5zdGFuY2VzXHJcblxyXG4gICAgc3RhdGljIGdldEluc3RhbmNlcygpIHtcclxuICAgICAgICBpZiAoIUluZm9ybWVyLl9pbnN0YW5jZXMpIHtcclxuICAgICAgICAgICAgSW5mb3JtZXIuX2luc3RhbmNlcyA9IG5ldyBJbmZvcm1lcigpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBJbmZvcm1lci5faW5zdGFuY2VzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvcm1lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb3JtZXJcIilcclxuICAgICAgICBpZiAoIXRoaXMuaW5mb3JtZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi0J3QsCDRgdGC0YDQsNC90LjRhtC1INC+0YLRgdGD0YLRgdGC0LLRg9C10YIgaHRtbCDQvtCx0LXRgNGC0LrQsCDQtNC70Y8g0JjQvdGE0L7RgNC80LXRgNCwXCIpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluZm9ybWVyQm9keSA9IHRoaXMuaW5mb3JtZXIucXVlcnlTZWxlY3RvcihcIi5pbmZvcm1lcl9fYm9keVwiKVxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJCYWNrID0gdGhpcy5pbmZvcm1lci5xdWVyeVNlbGVjdG9yKFwiLmluZm9ybWVyX19iYWNrXCIpXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckNsb3NlID0gdGhpcy5pbmZvcm1lci5xdWVyeVNlbGVjdG9yKFwiLmluZm9ybWVyX19jbG9zZVwiKVxyXG4gICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICB9XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNwYW5bZGF0YS10ZXJtXVwiKSlcclxuICAgICAgICB0aGlzLmluaXRFdmVudExpc3RlbmVycygpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBpbml0RXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhpcy5idG5zLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmdldEluZm9ybWF0aW9uKGJ0bi5kYXRhc2V0LnRlcm0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJhY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuaGlkZUluZm9ybWVyKCkpXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmhpZGVJbmZvcm1lcigpKVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGdldEluZm9ybWF0aW9uKHRlcm0pIHtcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93KClcclxuXHJcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInRlcm1cIiwgdGVybSlcclxuXHJcbiAgICAgICAgY29uc3QgcmVzID0gREVWX01PREUgP1xyXG4gICAgICAgICAgICBhd2FpdCBmZXRjaChcImh0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC1ydS9tb2Nrcy9pbmZvcm0uaHRtbFwiKSA6XHJcbiAgICAgICAgICAgIGF3YWl0IGZldGNoKFwiL2FwaS90ZXJtXCIsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZXMudGV4dCgpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5mb3JtZXJDb250ZW50KGh0bWwpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi0J3QtSDRg9C00LDQu9C+0YHRjCDQv9C+0LvRg9GH0LjRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC00LvRjyDQotC10YDQvNC40L3QsFwiLCB0ZXJtKVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zcGlubmVyLmhpZGUsIDMwMClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSW5mb3JtZXJDb250ZW50KGRhdGEpIHtcclxuICAgICAgICBjb25zdCBpbmZvcm1lckNvbnRlbnQgPSB0aGlzLmluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb3JtZXJfX2NvbnRlbnRcIilcclxuXHJcbiAgICAgICAgd2hpbGUgKGluZm9ybWVyQ29udGVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIGluZm9ybWVyQ29udGVudC5yZW1vdmVDaGlsZChpbmZvcm1lckNvbnRlbnQuZmlyc3RDaGlsZClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluZm9ybWVyQ29udGVudC5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAgICAgdGhpcy5zaG93SW5mb3JtZXIoKVxyXG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnNwaW5uZXIuaGlkZSwgMzAwKVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dJbmZvcm1lcigpIHtcclxuICAgICAgICB0aGlzLmluZm9ybWVyLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluZm9ybWVyQmFjay5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKVxyXG4gICAgICAgICAgICB0aGlzLmluZm9ybWVyQm9keS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKVxyXG4gICAgICAgIH0sIDEwMClcclxuICAgIH1cclxuXHJcbiAgICBoaWRlSW5mb3JtZXIoKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJhY2suY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIilcclxuICAgICAgICB0aGlzLmluZm9ybWVyQm9keS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaW5mb3JtZXIuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIiksIDUwMClcclxuICAgIH1cclxufVxyXG53aW5kb3cuaW5pdEluZm9ybWVycyA9ICgpID0+IEluZm9ybWVyLmdldEluc3RhbmNlcygpLmluaXQoKVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gd2luZG93LmluZm9ybWVyID0gd2luZG93LmluaXRJbmZvcm1lcnMoKSkiLCJjb25zdCBpbml0TW9kYWwgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbF0nKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5kYXRhc2V0Lm1vZGFsVGFyZ2V0XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5kYXRhc2V0Lm1vZGFsQWN0aW9uXHJcblxyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxyXG4gICAgICAgICAgICAgICAgc2hvd01vZGFsQmFjaygpXHJcbiAgICAgICAgICAgICAgICBzaG93TW9kYWxEaWFsb2codGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvZ2dsZSc6XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNb2RhbERpYWxvZyh0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2xvc2UnOlxyXG4gICAgICAgICAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcclxuICAgICAgICAgICAgICAgIGNsZWFyTW9kYWxWaWRlbygpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGhpZGVNb2RhbEJhY2ssIDIwMClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWxCYWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxyXG5cclxuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gYmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JyksIDEwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlTW9kYWxCYWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hlYWRlcicpXHJcblxyXG4gICAgaWYgKCFiYWNrKSByZXR1cm5cclxuXHJcbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYmFjay5jbGFzc0xpc3QuYWRkKCdoaWRlJylcclxuICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgfSwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWxEaWFsb2cgPSAoaWQpID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXHJcbiAgICBjb25zdCBkaWFsb2cgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsX19kaWFsb2cnKVxyXG5cclxuICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICB9LCAxMClcclxufVxyXG5cclxuY29uc3QgaGlkZU1vZGFsRGlhbG9nID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLnNob3cnKVxyXG4gICAgaWYgKCF0YXJnZXQpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnaGlkZScpLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGNsZWFyTW9kYWxWaWRlbyA9ICgpID0+IHtcclxuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vZGFsVmlkZW8nKVxyXG5cclxuICAgIGNvbnN0IG1vZGFsX190aXRsZSA9IG1vZGFsPy5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX3RpdGxlJylcclxuICAgIGNvbnN0IG1vZGFsX192aWRlbyA9IG1vZGFsPy5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX3ZpZGVvJylcclxuICAgIGlmIChtb2RhbF9fdmlkZW8pIHtcclxuICAgICAgICBtb2RhbF9fdmlkZW8uaW5uZXJIVE1MID0gJyc7XHJcbiAgICB9XHJcbiAgICBpZiAobW9kYWxfX3RpdGxlKSB7XHJcbiAgICAgICAgbW9kYWxfX3RpdGxlLmlubmVySFRNTCA9ICcnO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2xvc2VNb2RhbCA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBjb25zdCBpc09uUG9wdXBNb2RhbCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbF9fZGlhbG9nJylcclxuICAgICAgICBjb25zdCBkb3dubG9hZFRhYmxlUHJldmlldyA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5kb3dubG9hZF9fdGFibGUtcHJldmlldycpO1xyXG5cclxuICAgICAgICBpZihpc09uUG9wdXBNb2RhbCkgcmV0dXJuXHJcbiAgICAgICAgaWYoZG93bmxvYWRUYWJsZVByZXZpZXcpIHJldHVyblxyXG5cclxuICAgICAgICBoaWRlTW9kYWxEaWFsb2coKVxyXG4gICAgICAgIGNsZWFyTW9kYWxWaWRlbygpXHJcbiAgICAgICAgc2V0VGltZW91dChoaWRlTW9kYWxCYWNrLCAyMDApXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCB0b2dnbGVNb2RhbERpYWxvZyA9IChpZCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgaGlkZU1vZGFsRGlhbG9nKClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyksIDIwMClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICB9LCAzMDApXHJcbn1cclxuXHJcbmNvbnN0IGluaXRUb2dnbGVWaXNpYmxlUGFzcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbF9fdG9nZ2xlLXZpc2libGUtcGFzcycpKVxyXG5cclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcclxuICAgICAgICBjb25zdCBpc1RleHQgPSBpbnB1dC50eXBlID09PSAndGV4dCdcclxuXHJcbiAgICAgICAgaW5wdXQudHlwZSA9IGlzVGV4dCA/ICdwYXNzd29yZCcgOiAndGV4dCdcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ3Bhc3MtdmlzaWJsZScpXHJcbiAgICB9KSlcclxufVxyXG5cclxuY29uc3Qgc2hvd01vZGFsID0gKGlkKSA9PiB7XHJcbiAgICBzaG93TW9kYWxCYWNrKClcclxuICAgIHNob3dNb2RhbERpYWxvZyhpZClcclxufVxyXG5cclxuY29uc3QgaW5zZXJ0VmlkZW9JbnRvVGFyZ2V0ID0gKHZpZGVvVXJsLCB0YXJnZXRTZWxlY3RvcikgPT4ge1xyXG4gICAgY29uc3QgdmlkZW9JZCA9IHZpZGVvVXJsLnNwbGl0KCcvJykuZmlsdGVyKEJvb2xlYW4pLnBvcCgpO1xyXG4gICAgY29uc3QgZW1iZWRMaW5rID0gYGh0dHBzOi8vcnV0dWJlLnJ1L3BsYXkvZW1iZWQvJHt2aWRlb0lkfS9gXHJcbiAgICBjb25zdCB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgIHZpZGVvRWxlbWVudC5zcmMgPSBlbWJlZExpbms7XHJcbiAgICB2aWRlb0VsZW1lbnQuZnJhbWVCb3JkZXIgPSAwO1xyXG4gICAgdmlkZW9FbGVtZW50LmFsbG93ID0gJ2NsaXBib2FyZC13cml0ZTsgYXV0b3BsYXknO1xyXG4gICAgdmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZSgnd2Via2l0QWxsb3dGdWxsU2NyZWVuJywgJycpO1xyXG4gICAgdmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZSgnbW96YWxsb3dmdWxsc2NyZWVuJywgJycpO1xyXG4gICAgdmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZSgnYWxsb3dGdWxsU2NyZWVuJywgJycpO1xyXG5cclxuICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldFNlbGVjdG9yKTtcclxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XHJcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5hcHBlbmRDaGlsZCh2aWRlb0VsZW1lbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQrdC70LXQvNC10L3RgiDRgSDRg9C60LDQt9Cw0L3QvdGL0Lwg0YHQtdC70LXQutGC0L7RgNC+0Lwg0L3QtSDQvdCw0LnQtNC10L0uJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRNb2RhbCgpXHJcbiAgICBpbml0Q2xvc2VNb2RhbCgpXHJcbiAgICBpbml0VG9nZ2xlVmlzaWJsZVBhc3MoKVxyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgZG93bmxvYWRUYWJsZVByZXZpZXcgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmRvd25sb2FkX190YWJsZS1wcmV2aWV3Jyk7XHJcbiAgICAgICAgaWYgKGRvd25sb2FkVGFibGVQcmV2aWV3KSB7XHJcbiAgICAgICAgICAgIHNob3dNb2RhbEJhY2soKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVybFZpZGVvID0gZG93bmxvYWRUYWJsZVByZXZpZXcuZGF0YXNldC52aWRlbztcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNib2R5Jyk7XHJcbiAgICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbW9kYWxWaWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbFZpZGVvJyk7XHJcbiAgICAgICAgICAgIG1vZGFsVmlkZW8uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xyXG4gICAgICAgICAgICBtb2RhbFZpZGVvLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgIG1vZGFsVmlkZW8ucXVlcnlTZWxlY3RvcignLm1vZGFsX190aXRsZScpLmlubmVySFRNTCA9IGRvd25sb2FkVGFibGVQcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLmdldEF0dHJpYnV0ZSgnYWx0Jyk7XHJcblxyXG4gICAgICAgICAgICBpbnNlcnRWaWRlb0ludG9UYXJnZXQodXJsVmlkZW8sICcubW9kYWxfX3ZpZGVvJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pIiwiLy8gUHJvZHVjdCBpbmZvcm1hdGlvbiBzbGlkZXJcclxubGV0IHByb2R1Y3RJbmZvU2xpZGVyXHJcblxyXG5jb25zdCBpbml0UHJvZHVjdEluZm9TbGlkZXIgPSAoKSA9PiB7XHJcblxyXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0LWluZm8gLnN3aXBlcicpLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgcHJvZHVjdEluZm9TbGlkZXIgPSBuZXcgU3dpcGVyKCcucHJvZHVjdC1pbmZvIC5zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgLy8gc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcblxyXG4gICAgICAgIC8vIGF1dG9IZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgLy8gc3BhY2VCZXR3ZWVuOiAxMCxcclxuXHJcbiAgICAgICAgc2Nyb2xsYmFyOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1zY3JvbGxiYXInLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA1NzY6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUHJvZHVjdEluZm9TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5OTEpIHtcclxuICAgICAgICBpZiAocHJvZHVjdEluZm9TbGlkZXIpIHtcclxuICAgICAgICAgICAgcHJvZHVjdEluZm9TbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKVxyXG4gICAgICAgICAgICBwcm9kdWN0SW5mb1NsaWRlciA9IHVuZGVmaW5lZFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXByb2R1Y3RJbmZvU2xpZGVyKSB7XHJcbiAgICAgICAgaW5pdFByb2R1Y3RJbmZvU2xpZGVyKClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1Byb2R1Y3RQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtcHJvZHVjdCcpXHJcbiAgICBjb25zdCBpc0FydGljbGVQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtYXJ0aWNsZScpXHJcbiAgICBjb25zdCBpc0RvdHNQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtZG90cycpXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBJbmZvIHNsaWRlciBvbmx5IGZvciBQcm9kdWN0LCBBcnRpY2xlIGFuZCBEb3RzIHBhZ2VzXHJcbiAgICBpZiAoIWlzUHJvZHVjdFBhZ2UgJiYgIWlzQXJ0aWNsZVBhZ2UgJiYgIWlzRG90c1BhZ2UpIHJldHVyblxyXG5cclxuICAgIGNoZWNrUHJvZHVjdEluZm9TbGlkZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKGNoZWNrUHJvZHVjdEluZm9TbGlkZXIpXHJcbiAgICB9KVxyXG59KVxyXG4iLCJjb25zdCBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AgPSAoYnV0dG9uKSA9PiB7XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0U2Nyb2xsVG9Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsVG9Ub3AnKVxyXG5cclxuICAgIGlmICghYnV0dG9uKSByZXR1cm5cclxuXHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzbW9vdGhTY3JvbGxUbygwKSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AoYnV0dG9uKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0U2Nyb2xsVG9Ub3AoKVxyXG59KSIsIi8qKlxyXG4gKiBTaG93IGEgc21hbGwgbWVzc2FnZSB3aXRoIHRpdGxlIGFuZCB0ZXh0IGluIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSBzY3JlZW4uXHJcbiAqIFRoZSBtZXRob2QgZXhwZWN0cyBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyIHBlciBpbnB1dC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IFt0aXRsZT11bmRlZmluZWRdIC0gVGhlIGhlYWRsaW5lIG9mIHRoZSBtZXNzYWdlIGluIG9uZSBsaW5lLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2U9dW5kZWZpbmVkXSAtIE9uZSBsaW5lIG1lc3NhZ2UgdGV4dC5cclxuICovXHJcbndpbmRvdy5zaG93TW9kYWxNc2cgPSBmdW5jdGlvbih0aXRsZSA9ICcnLCBtZXNzYWdlID0gJycpIHtcclxuICAgIGlmICghdGl0bGUgJiYgIW1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlcmUncyBubyB0aXRsZSBvciBtZXNzYWdlIGZvciBzaG93aW5nIGluIG1vZGFsIHdpbmRvdy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHRpdGxlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbmNvcnJlY3QgdHlwZSBvZiB0aXRsZS4gSXQgc2hvdWxkIGJlIHN0cmluZy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkluY29ycmVjdCB0eXBlIG9mIG1lc3NhZ2UuIEl0IHNob3VsZCBiZSBzdHJpbmcuXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbXNnLWNvbnRhaW5lcicpXHJcbiAgICBjb25zdCBbY2FyZCwgYm9keV0gPSBjcmVhdGVNb2RhbE1zZ0NhcmQodGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhcmQpXHJcbiAgICBjaGVja01vZGFsTXNnQ29udGFpbmVyKClcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBjYXJkLmNsYXNzTGlzdC5hZGQoJ3VuY29sbGFwc2VkJyksIDUwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcbiAgICB9LCAxMDApXHJcblxyXG4gICAgaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHksIDUwMDApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKSB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tc2ctY29udGFpbmVyJylcclxuICAgIGNvbnN0IGlubmVyRWxtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtbXNnX19jYXJkJylcclxuXHJcbiAgICBpbm5lckVsbXMubGVuZ3RoID4gMFxyXG4gICAgICAgID8gY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG4gICAgICAgIDogY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNb2RhbE1zZ0NhcmQodGl0bGUsIG1lc3NhZ2UpIHtcclxuICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2NhcmQnKVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2JvZHknKVxyXG5cclxuICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcclxuXHJcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtbXNnX19jb250ZW50JylcclxuXHJcbiAgICBjb25zdCBjYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXHJcbiAgICBjYXB0aW9uLnRleHRDb250ZW50ID0gdGl0bGVcclxuXHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICB0ZXh0LnRleHRDb250ZW50ID0gbWVzc2FnZVxyXG5cclxuICAgIGlmICh0aXRsZSkgY29udGVudC5hcHBlbmRDaGlsZChjYXB0aW9uKVxyXG4gICAgaWYgKG1lc3NhZ2UpIGNvbnRlbnQuYXBwZW5kQ2hpbGQodGV4dClcclxuXHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGljb24pXHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGNvbnRlbnQpXHJcblxyXG4gICAgY2FyZC5hcHBlbmRDaGlsZChib2R5KVxyXG5cclxuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoaWRlTW9kYWxNc2dIYW5kbGVyKVxyXG5cclxuICAgIHJldHVybiBbY2FyZCwgYm9keV1cclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZU1vZGFsTXNnSGFuZGxlcigpIHtcclxuICAgIGNvbnN0IGNhcmQgPSB0aGlzXHJcbiAgICBjb25zdCBib2R5ID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtbXNnX19ib2R5JylcclxuICAgIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5KVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSwgdGltZW91dCA9IDApIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcclxuICAgIH0sIHRpbWVvdXQpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJywgJ2hpZGRlbicpXHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd1bmNvbGxhcHNlZCcpXHJcbiAgICB9LCB0aW1lb3V0ICsgMTAwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNhcmQucmVtb3ZlKCk7XHJcbiAgICAgICAgY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpXHJcbiAgICB9LCB0aW1lb3V0ICsgMjAwKVxyXG59XHJcbiIsIi8vIFByb2R1Y3QgcmVjb21tZW5kYXRpb24gc2xpZGVyXHJcbmxldCBwcm9kdWN0UmVjb21tU2xpZGVyXHJcblxyXG5jb25zdCBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhciA9IChzd2lwZXIsIHNjcm9sbGJhcikgPT4ge1xyXG4gICAgaWYgKCFzY3JvbGxiYXIgfHwgc2Nyb2xsYmFyLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgaXNTY3JvbGxiYXJIaWRlID0gc2Nyb2xsYmFyLmNsYXNzTGlzdFxyXG4gICAgICAgIC5jb250YWlucygnc3dpcGVyLXNjcm9sbGJhci1sb2NrJylcclxuXHJcbiAgICBpc1Njcm9sbGJhckhpZGVcclxuICAgICAgICA/IHN3aXBlci5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtaGlkZGVuJylcclxuICAgICAgICA6IHN3aXBlci5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtaGlkZGVuJylcclxufVxyXG5cclxuY29uc3QgY2hlY2tTbGlkZXJzQm90dG9tT2Zmc2V0ID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc3dpcGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlcicpKVxyXG5cclxuICAgIHN3aXBlcnMuZm9yRWFjaChzd2lwZXIgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbGJhciA9IHN3aXBlci5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNjcm9sbGJhcicpXHJcbiAgICAgICAgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIoc3dpcGVyLCBzY3JvbGxiYXIpXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBpbml0UHJvZHVjdFJlY29tbVNsaWRlciA9ICgpID0+IHtcclxuXHJcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlY29tbWVuZGF0aW9uX19zbGlkZXIgLnN3aXBlcicpLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgcHJvZHVjdFJlY29tbVNsaWRlciA9IG5ldyBTd2lwZXIoJy5yZWNvbW1lbmRhdGlvbl9fc2xpZGVyIC5zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgLy8gYXV0b0hlaWdodDogdHJ1ZSxcclxuXHJcbiAgICAgICAgc2Nyb2xsYmFyOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1zY3JvbGxiYXInLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA1NzY6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgOTkxOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMTIwMDoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzd2lwZXIgPSB0aGlzLmVsXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGxiYXIgPSB0aGlzLnNjcm9sbGJhci5lbFxyXG4gICAgICAgICAgICAgICAgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIoc3dpcGVyLCBzY3JvbGxiYXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiAxMjAwICYmIHByb2R1Y3RSZWNvbW1TbGlkZXIpIHtcclxuICAgICAgICBBcnJheS5pc0FycmF5KHByb2R1Y3RSZWNvbW1TbGlkZXIpXHJcbiAgICAgICAgICAgID8gcHJvZHVjdFJlY29tbVNsaWRlci5mb3JFYWNoKHNsaWRlciA9PiBzbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKSlcclxuICAgICAgICAgICAgOiBwcm9kdWN0UmVjb21tU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSlcclxuXHJcbiAgICAgICAgcHJvZHVjdFJlY29tbVNsaWRlciA9IHVuZGVmaW5lZFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJvZHVjdFJlY29tbVNsaWRlcikge1xyXG4gICAgICAgIGluaXRQcm9kdWN0UmVjb21tU2xpZGVyKClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1Byb2R1Y3RQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtcHJvZHVjdCcpXHJcbiAgICBjb25zdCBpc0FydGljbGVQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtYXJ0aWNsZScpXHJcbiAgICBjb25zdCBpc0RvdHNQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtZG90cycpXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBSZWNvbW1lbmRhdGlvbiBzbGlkZXIgb25seSBmb3IgUHJvZHVjdCwgQXJ0aWNsZSBhbmQgRG90cyBwYWdlc1xyXG4gICAgaWYgKCFpc1Byb2R1Y3RQYWdlICYmICFpc0FydGljbGVQYWdlICYmICFpc0RvdHNQYWdlKSByZXR1cm5cclxuXHJcbiAgICBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlcilcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwoY2hlY2tTbGlkZXJzQm90dG9tT2Zmc2V0KVxyXG4gICAgfSlcclxufSlcclxuIiwiY29uc3Qgc2hvd1NwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzcGlubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKVxyXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyksIDEwMClcclxufVxyXG5cclxuY29uc3QgaGlkZVNwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzcGlubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKVxyXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5JyksIDEwMDApXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJykpIHtcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93ID0gc2hvd1NwaW5uZXJcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlID0gaGlkZVNwaW5uZXJcclxuICAgIH1cclxufSkiLCIiLCIvLyBPcGVuIGFuZCBjbG9zZSBtb2JpbGUgbmF2aWdhdGlvblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgbmF2Q2xvc2UgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jbG9zZScpKVxyXG4gICAgY29uc3QgbmF2VG9nZ2xlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXJfX25hdi1saW5rX21lbnUnKVxyXG4gICAgY29uc3QgaGVhZGVyTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2JylcclxuICAgIGNvbnN0IG1vZGFsQmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21vZGFsLWJhY2snKVxyXG4gICAgY29uc3QgbmF2UHJvZExpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtbGlua19wcm9kdWN0JylcclxuICAgIGNvbnN0IG5hdkl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtaXRlbV93aXRoLWlubmVyJykpXHJcbiAgICBjb25zdCBuYXZMaW5rcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWxpbmsnKSlcclxuICAgIGNvbnN0IG5hdkNvbGxhcHNlcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNvbGxhcHNlJykpXHJcblxyXG4gICAgaWYgKCFuYXZUb2dnbGVyKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCB0b2dnbGVOYXYgPSAoZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgICAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgLy8gbW9kYWxCYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuYXZQcm9kTGluay5jbGljaygpXHJcbiAgICAgICAgICAgIH0sIDEwMClcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJylcclxuICAgICAgICBuYXZUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKVxyXG4gICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuXHJcbiAgICAgICAgY29sbGFwc0FsbE5hdkl0ZW0oKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENsaWNrIG9uIG5hdmlnYXRpb24gYnVyZ2VyXHJcbiAgICBuYXZUb2dnbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvZ2dsZU5hdih0cnVlKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGNsb3NlIGJ1dHRvblxyXG4gICAgbmF2Q2xvc2UuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZU5hdihmYWxzZSkpXHJcbiAgICB9KVxyXG5cclxuICAgIG1vZGFsQmFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICB0b2dnbGVOYXYoZmFsc2UpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE9wZW4gYW5kIGNsb3NlIE5hdmlnYXRpb24gaXRlbXNcclxuICAgIGNvbnN0IGNvbGxhcHNBbGxOYXZJdGVtID0gKCkgPT4ge1xyXG4gICAgICAgIG5hdkl0ZW1zLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKSlcclxuICAgICAgICBuYXZMaW5rcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxuICAgICAgICBuYXZDb2xsYXBzZXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdkl0ZW0gPSAoYnRuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcblxyXG4gICAgICAgIGlmICghaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBjb25zdCBuYXZJdGVtID0gYnRuLmNsb3Nlc3QoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKVxyXG5cclxuICAgICAgICAgICAgaWYgKG5hdkl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hdkNvbGxhcHNlID0gbmF2SXRlbS5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKVxyXG5cclxuICAgICAgICAgICAgICAgIG5hdkl0ZW0uY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgICAgICBuYXZDb2xsYXBzZS5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZMaW5rcy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0b2dnbGVOYXZJdGVtKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBTZWFyY2hpbmcgYW5kIFN0aWNreSBoZWFkZXJcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgIFxyXG4gICBcclxuICAgIFxyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXHJcbiAgICBjb25zdCBzZWFyY2hUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1jbG9zZScpXHJcbiAgICBjb25zdCBzZWFyY2hQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1pbnB1dCcpXHJcbiAgICBjb25zdCBzZWFyY2hSZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1yZXNldCcpXHJcbiAgICBjb25zdCBzZWFyY2hIaW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1oaW50cycpXHJcblxyXG4gICAgaWYgKCFzZWFyY2hUb2dnbGVyKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCB0b2dnbGVTZWFyY2hQYW5lbCA9IChoaWRlID0gZmFsc2UpID0+IHtcclxuICAgICAgICBjb25zdCBpc1Zpc2libGUgPSBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSAxMDBcclxuXHJcbiAgICAgICAgaWYgKCFpc1Zpc2libGUgJiYgIWhpZGUpIHtcclxuICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZScpXHJcbiAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfd2l0aC1zZWFyY2gtcGFuZWwnKVxyXG4gICAgICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoUmVzZXQuY2xpY2soKVxyXG4gICAgICAgICAgICByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJylcclxuICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl93aXRoLXNlYXJjaC1wYW5lbCcpXHJcbiAgICAgICAgfSwgMjAwKVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaFRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgICAgIHNlYXJjaElucHV0LmZvY3VzKClcclxuICAgIH0pXHJcblxyXG4gICAgc2VhcmNoQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LXJ1L21vY2tzL3NlYXJjaC5qc29uJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVzdC10ZWNobm9saWdodHYyLm1hc3NpdmUucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG5cclxuICAgIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICcvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVjaG5vbGlnaHQucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgY29uc3QgVEhST1RUTEVfVElNRU9VVCA9IDMwMFxyXG4gICAgbGV0IHNlYXJjaFJlcXVlc3RUaW1lb3V0SWRcclxuXHJcbiAgICBjb25zdCBzZXRTdHJvbmdUZXh0ID0gKHN0ciwgcXVlcnkpID0+IHtcclxuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAocXVlcnksICdnaScpXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4LCBgPHN0cm9uZz4kJjwvc3Ryb25nPmApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJpbnRRdWVyeVJlc3VsdCA9IChkYXRhLCBxdWVyeSkgPT4ge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0J/QvtC70YPRh9C40LvQuCDQv9C+0LjRgdC60L7QstGD0Y4g0LLRi9C00LDRh9GDJywgZGF0YSk7XHJcblxyXG4gICAgICAgIC8vIFJlc2V0IGFsbCBjaGlsZHJlbiBub2RlcyBvZiBzZWFyY2ggaGludHNcclxuICAgICAgICB3aGlsZSAoc2VhcmNoSGludHMuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5yZW1vdmVDaGlsZChzZWFyY2hIaW50cy5maXJzdENoaWxkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGxpbmssIHNpbWlsYXIgb3IgTm8gUmVzdWx0XHJcbiAgICAgICAgY29uc3QgbGlua3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIGxpbmtzLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fc2VhcmNoLWxpbmtzJylcclxuXHJcbiAgICAgICAgY29uc3Qgc2ltaWxhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgc2ltaWxhci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX3NlYXJjaC1zaW1pbGFyJylcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIE5vIHJlc3VsdHNcclxuICAgICAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ25vLXJlc3VsdHMnKVxyXG4gICAgICAgICAgICBzcGFuLmlubmVyVGV4dCA9ICfQn9C+INCS0LDRiNC10LzRgyDQt9Cw0L/RgNC+0YHRgyDQvdC40YfQtdCz0L4g0L3QtSDQvdCw0LnQtNC10L3QvidcclxuICAgICAgICAgICAgbGlua3MuYXBwZW5kQ2hpbGQoc3BhbilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMaW5rc1xyXG4gICAgICAgICAgICBjb25zdCBoaW50ID0gZGF0YVswXVxyXG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcbiAgICAgICAgICAgIGxpbmsuaHJlZiA9IGhpbnQudXJsXHJcbiAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2V0U3Ryb25nVGV4dChoaW50LnRpdGxlLCBxdWVyeSlcclxuICAgICAgICAgICAgbGlua3MuYXBwZW5kQ2hpbGQobGluaylcclxuXHJcbiAgICAgICAgICAgIC8vIFNpbWlsYXJcclxuICAgICAgICAgICAgc2ltaWxhci5pbm5lckhUTUwgPSAnPGg1PtGB0LzQvtGC0YDQuNGC0LUg0L/QvtGF0L7QttC40LU8L2g1PidcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbnVtIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudW0gPCAxKSBjb250aW51ZVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIExpbmtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhpbnQgPSBkYXRhW251bV1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcclxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IGhpbnQudXJsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSW1hZ2VcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBpY1NwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICAgICAgICAgIHBpY1NwYW4uY2xhc3NMaXN0LmFkZCgncGljJylcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IGhpbnQuaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltZy5hbHQgPSBoaW50LnRpdGxlXHJcbiAgICAgICAgICAgICAgICBwaWNTcGFuLmFwcGVuZENoaWxkKGltZylcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUZXh0XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAgICAgdGV4dFNwYW4uY2xhc3NMaXN0LmFkZCgndGV4dCcpXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3Bhbi5pbm5lckhUTUwgPSBzZXRTdHJvbmdUZXh0KGhpbnQudGl0bGUsIHF1ZXJ5KVxyXG5cclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQocGljU3BhbilcclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQodGV4dFNwYW4pXHJcbiAgICAgICAgICAgICAgICBzaW1pbGFyLmFwcGVuZENoaWxkKGxpbmspXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG51bSA+IDYpIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKGxpbmtzKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKHNpbWlsYXIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQndGD0LbQvdC+INGC0L7Qu9GM0LrQviDQtNC70Y8g0L/QvtC70L3QvtCz0L4g0LzQtdC90Y5cclxuICAgICAgICAvLyBzZXRIYW5kbGVyVG9IZWxwZXJzKClcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZldGNoU2VhcmNoaW5nRGF0YSA9IGFzeW5jIChxdWVyeSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKFNFQVJDSF9SRVFVRVNUX1VSTCArIGA/cXVlcnk9JHtxdWVyeX1gKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINC/0L7QuNGB0LrQsCcpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgICAgIHByaW50UXVlcnlSZXN1bHQoZGF0YSwgcXVlcnkpXHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXNldC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChzZWFyY2hSZXF1ZXN0VGltZW91dElkKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICAvLyAqKiogRmV0Y2hpbmcgc2VhcmNoIHJlcXVlc3RzIGFuZCBzaG93IHJlc3VsdHMgLS0tIFNUQVJUXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQpXHJcbiAgICAgICAgc2VhcmNoUmVxdWVzdFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICgpID0+IGZldGNoU2VhcmNoaW5nRGF0YSh0aGlzLnZhbHVlKSxcclxuICAgICAgICAgICAgVEhST1RUTEVfVElNRU9VVFxyXG4gICAgICAgIClcclxuICAgICAgICAvLyAqKiogRmV0Y2hpbmcgc2VhcmNoIHJlcXVlc3RzIGFuZCBzaG93IHJlc3VsdHMgLS0tIEZJTklTSFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHNlYXJjaEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKVxyXG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBzZWFyY2hIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycylcclxuXHJcbiAgICBzZWFyY2hSZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIHJlc2V0SGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICB9KVxyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1mb3JtJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtbGlua3MgYScpPy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuICAgICAgICAgICAgaWYgKGxpbmsgJiYgbGluayAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghbGluay5zdGFydHNXaXRoKCdodHRwJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL9C/0YDQuNCy0L7QtNC40Lwg0Log0LDQsdGB0L7Qu9GO0YLQvdC+0LzRgyDQv9GD0YLQuFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgYCR7bGlua31gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChsaW5rKVxyXG4gICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3NlYXJjaCcsIHNlYXJjaElucHV0LnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLmhyZWYpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybC5ocmVmXHJcbiAgICAgICAgICAgICAgICB9LCA1MDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzU2VhcmNoVG9nZ2xlID0gZS50YXJnZXRcclxuICAgICAgICAgICAgLmNsb3Nlc3QoJy5oZWFkZXJfX2J1dHRvbnMtbGlua19zZWFyY2gnKVxyXG5cclxuICAgICAgICBjb25zdCBpc1NlYXJjaFBhbmVsID0gZS50YXJnZXRcclxuICAgICAgICAgICAgLmNsb3Nlc3QoJy5oZWFkZXJfX3NlYXJjaCcpXHJcblxyXG4gICAgICAgIGNvbnN0IGlzVGFjaERldmljZSA9IHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyXHJcblxyXG4gICAgICAgIGlmICghaXNUYWNoRGV2aWNlICYmICFpc1NlYXJjaFBhbmVsICYmICFpc1NlYXJjaFRvZ2dsZSkge1xyXG4gICAgICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCh0cnVlKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgLy8gU2V0IGhlbHAgdGV4dCBmcm9tIGhlbHBlciBidXR0b24gdW5kZXIgdGhlIHNlYXJjaCBpbnB1dCB0byB0aGUgc2VhcmNoIHZhbHVlXHJcbiAgICBjb25zdCByZXF1ZXN0Q29tcGxldGlvbiA9IChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWRkaXRpb25WYWx1ZSA9IGUudGFyZ2V0LmlubmVyVGV4dFxyXG4gICAgICAgIHNlYXJjaElucHV0LnZhbHVlID0gYCR7c2VhcmNoSW5wdXQudmFsdWV9ICR7YWRkaXRpb25WYWx1ZX1gXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2V0SGFuZGxlclRvSGVscGVycyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBzZWFyY2hIZWxwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fc2VhcmNoLWhlbHBzIHNwYW4nKSlcclxuXHJcbiAgICAgICAgc2VhcmNoSGVscGVycy5mb3JFYWNoKGJ0biA9PiBidG5cclxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVxdWVzdENvbXBsZXRpb24pKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc2V0SGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoSGVscGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX3NlYXJjaC1oZWxwcyBzcGFuJykpXHJcblxyXG4gICAgICAgIHNlYXJjaEhlbHBlcnMuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgICAgICBidG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXF1ZXN0Q29tcGxldGlvbilcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0aWNreSBoZWFkZXJcclxuICAgIGxldCBiZWZvcmVTY3JvbGxUb3AgPSAwXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcclxuICAgICAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlYWRlclwiKVxyXG4gICAgICAgIGNvbnN0IGhlYWRlckhlaWdodCA9IGhlYWRlci5jbGllbnRIZWlnaHRcclxuICAgICAgICBjb25zdCBkZWxheSA9ICcuN3MnXHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50U2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFlcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTkxKSB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2Nyb2xsVG9wID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnY29tcHJlc3NlZCcpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnY29tcHJlc3NlZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IDEwMCAmJiBjdXJyZW50U2Nyb2xsVG9wID4gYmVmb3JlU2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzVmlzaWJsZVNlYXJjaCA9IHNlYXJjaFBhbmVsXHJcbiAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbElkXHJcblxyXG4gICAgICAgICAgICBpZiAoaXNWaXNpYmxlU2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXlcclxuICAgICAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSAnMHMnXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IGAtJHtoZWFkZXJIZWlnaHR9cHhgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJlZm9yZVNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVG9nZ2xlIHNlYXJjaCBwYW5lbFxyXG4gICAgY29uc3QgY3VycmVudFVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpXHJcbiAgICBpZiAoY3VycmVudFVybC5zZWFyY2hQYXJhbXMuaGFzKCdzZWFyY2gnKSkge1xyXG4gICAgICAgIHNlYXJjaElucHV0LnZhbHVlID0gY3VycmVudFVybC5zZWFyY2hQYXJhbXMuZ2V0KCdzZWFyY2gnKVxyXG4gICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKClcclxuICAgIH1cclxufSlcclxuXHJcbi8vIENhcnQgdXBkYXRlIGxpc3RlbmluZ1xyXG5jb25zdCBzZXRDYXJ0VXBkYXRlTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0UHJvZHVjdENvdW50Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJ0UHJvZHVjdENvdW50JylcclxuXHJcbiAgICBpZiAoIWNhcnRQcm9kdWN0Q291bnROb2RlKSByZXR1cm5cclxuXHJcbiAgICBjYXJ0UHJvZHVjdENvdW50Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdjYXJ0VXBkYXRlRXZlbnQnLCBmdW5jdGlvbiAoZSkge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IHdpbmRvdy5DQVJULnByb2R1Y3RzXHJcbiAgICAgICAgbGV0IHByb2R1Y3RDb3VudCA9IDBcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVyYXRvciBvZiBwcm9kdWN0cykge1xyXG4gICAgICAgICAgICBwcm9kdWN0Q291bnQgKz0gaXRlcmF0b3IuY291bnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmlubmVyVGV4dCA9IHByb2R1Y3RDb3VudFxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmRhdGFzZXQuY291bnQgPSBwcm9kdWN0Q291bnQudG9TdHJpbmcoKVxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNhcnRQcm9kdWN0Q291bnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLm1lc3NhZ2UpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHNldENhcnRVcGRhdGVMaXN0ZW5lcilcclxuXHJcbi8vIE9wZW4gYW5kIGNsb3NlIHN1Ykxpc3RzXHJcbmNvbnN0IHRvZ2dsZVN1Yk5hdkxpc3RzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdG9nZ2xlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pbm5lci10b2dnbGUnKSlcclxuXHJcbiAgICBjb25zdCBjbG9zZUFsbFRvZ2dsZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZXJzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3cmFwID0gZWwuY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWlubmVyLWNhcHRpb24nKVxyXG4gICAgICAgICAgICB3cmFwLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY29sbGFwc2UgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1zdWJsaXN0LWNvbGxhcHNlJylcclxuICAgICAgICAgICAgY29sbGFwc2UuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcblxyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb25zdCB3cmFwID0gZWwuY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWlubmVyLWNhcHRpb24nKVxyXG4gICAgICAgIGNvbnN0IGNvbGxhcHNlID0gd3JhcC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtc3VibGlzdC1jb2xsYXBzZScpXHJcbiAgICAgICAgY29uc3QgaXNDdXJyZW50RHJvcHBlZCA9IHdyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wcGVkJylcclxuXHJcbiAgICAgICAgLy8gY2xvc2VBbGxUb2dnbGVycygpXHJcblxyXG4gICAgICAgIC8vIFRvZ2dsZSBjdXJyZW50XHJcbiAgICAgICAgaWYgKCFpc0N1cnJlbnREcm9wcGVkKSB7XHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGNvbGxhcHNlLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKVxyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG5cclxuICAgIC8vIENsb3NlIGFsbCBzdWJuYXYgbGlzdCBvbiBvdXQgY2xpY2tcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNUYXJnZXQgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xhc3NMaXN0XHJcbiAgICAgICAgICAgIC5jb250YWlucygnaGVhZGVyX19uYXYtaW5uZXItdG9nZ2xlJylcclxuXHJcbiAgICAgICAgaWYgKCFpc1RhcmdldCkgY2xvc2VBbGxUb2dnbGVycygpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRvZ2dsZVN1Yk5hdkxpc3RzKVxyXG4iLCIvLyBEZWxldGluZyBibG9ja2luZyBvZiBhbGwgYW5pbWF0aW9uIGZvciBmaXggYW5pbWF0aW9uIGFydGVmYWN0c1xyXG5jb25zdCByZW1vdmVBbmltYXRpb25CbG9ja2VyID0gKCkgPT4ge1xyXG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHJhbnNpdGlvbi1ibG9ja2VyJykpXHJcbiAgICAgICAgLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgndHJhbnNpdGlvbi1ibG9ja2VyJykpXHJcbn1cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCByZW1vdmVBbmltYXRpb25CbG9ja2VyKVxyXG5cclxuLy8gQmxvY2tpbmcgYWxsIGFuaW1hdGlvbiBhdCB0aGUgd2luZG93IHJlc2l6aW5nIHByb2Nlc3NcclxuY29uc3QgYWRkQW5pbWF0aW9uQmxvY2tlciA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndHJhbnNpdGlvbi1ibG9ja2VyJylcclxufVxyXG5cclxubGV0IGJsb2NrQW5pbWF0aW9uVGltZXJcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgIGNsZWFyVGltZW91dChibG9ja0FuaW1hdGlvblRpbWVyKVxyXG4gICAgd2luZG93LnNhZmVDYWxsKGFkZEFuaW1hdGlvbkJsb2NrZXIpXHJcblxyXG4gICAgYmxvY2tBbmltYXRpb25UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChyZW1vdmVBbmltYXRpb25CbG9ja2VyKVxyXG4gICAgfSwgMzAwKVxyXG59KVxyXG5cclxuLy8gSGFuZGxlIGxpbmsgd2l0aCBzbW9vdGggYW5pbWF0aW9uIHRvIGFuY2hvciBwbGFjZSBvbiB0aGUgcGFnZVxyXG5jb25zdCBzbW9vdGhMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl49XCIjXCJdJylcclxuZm9yIChsZXQgc21vb3RoTGluayBvZiBzbW9vdGhMaW5rcykge1xyXG4gICAgc21vb3RoTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIGNvbnN0IGlkID0gc21vb3RoTGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtpZH1gKVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSB0YXJnZXROb2RlLm9mZnNldFRvcFxyXG4gICAgICAgICAgICBjb25zdCBkZXZpY2VPZmZzZXQgPSB3aW5kb3cub3V0ZXJXaWR0aCA+IDc2OCA/IC0xMDAgOiAtMjBcclxuXHJcbiAgICAgICAgICAgIHNtb290aFNjcm9sbFRvKHRhcmdldE9mZnNldCArIGRldmljZU9mZnNldCwgNzAwKVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSdzIG5vIHRhcmdldCBub2RlIGZvciBzY3JvbGxpbmcgdG8gcGxhY2UuIFRoZSBzZWxlY3RvciBpc24ndCBjb3JyZWN0IVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59O1xyXG5cclxuLy8gQW5pbWF0aW9uIGl0ZW1zIHdoZW4gdXNlciBoYXMgc2Nyb2xsZWQgc2NyZWVuIHRvIHBsYWNlIG9mIGl0ZW1cclxuY29uc3QgY2hlY2tBbmltYXRpb25FbG1zID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRWxtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGlvbi1lbGVtZW50JykpXHJcblxyXG4gICAgcmV0dXJuIGFuaW1hdGlvbkVsbXMubGVuZ3RoID4gMFxyXG59XHJcblxyXG5jb25zdCBzaG93QW5pbUVsZW1lbnRzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZWxtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGlvbi1lbGVtZW50JykpXHJcblxyXG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIC8vIGNvbnN0IHBvaW50T2ZEaXNwbGF5ID0gd2luZG93SGVpZ2h0IC8gMS4yIC8vIGZvciBzaG93IG9uIHRoZSBoYWxmIG9mIHRoZSBzY3JlZW5cclxuICAgIGNvbnN0IHBvaW50T2ZEaXNwbGF5ID0gd2luZG93SGVpZ2h0XHJcblxyXG4gICAgZWxtcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbVRvcCA9IHJlY3QudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XHJcblxyXG4gICAgICAgIGlmIChkaXN0YW5jZUZyb21Ub3AgLSBwb2ludE9mRGlzcGxheSA8IHNjcm9sbFRvcCkge1xyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRpb24tZWxlbWVudCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoIWNoZWNrQW5pbWF0aW9uRWxtcygpKSB7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNob3dBbmltRWxlbWVudHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNldEFuaW1hdGlvbkVsbXMgPSAoKSA9PiB7XHJcbiAgICBpZiAoY2hlY2tBbmltYXRpb25FbG1zKCkpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2hvd0FuaW1FbGVtZW50cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgd2luZG93LnNhZmVDYWxsKHNldEFuaW1hdGlvbkVsbXMpXHJcbn0pXHJcblxyXG4vLyBQaG9uZSBtYXNraW5nXHJcbmNvbnN0IGluaXRQaG9uZXNNYXNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcGhvbmVJbnB1dHMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPVwidGVsXCJdOm5vdCguY2FydF9fY2FsYyBbdHlwZT1cInRlbFwiXSknKSlcclxuXHJcbiAgICBwaG9uZUlucHV0cy5mb3JFYWNoKHBob25lID0+IHtcclxuICAgICAgICBjb25zdCBwaG9uZU1hc2tPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtYXNrOiAnK3s3fSAoMDAwKSAwMDAtMDAtMDAnLFxyXG4gICAgICAgICAgICBsYXp5OiB0cnVlLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlckNoYXI6ICcjJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwaG9uZU1hc2sgPSBJTWFzayhcclxuICAgICAgICAgICAgcGhvbmUsXHJcbiAgICAgICAgICAgIHBob25lTWFza09wdGlvbnNcclxuICAgICAgICApXHJcblxyXG4gICAgICAgIHBob25lLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IGZhbHNlfSkpXHJcbiAgICAgICAgcGhvbmUuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiB0cnVlfSkpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChpbml0UGhvbmVzTWFzaylcclxufSlcclxuXHJcbi8vIEZpeGluZyBjaGF0LTI0IHdpZGdldCBwb3NpdGlvbiAtLSBTVEFSVFxyXG5sZXQgY2hhdDI0SW50ZXJ2YWxJZCA9IG51bGxcclxubGV0IGNoYXQyNFRpbWVvdXRJZCA9IG51bGxcclxubGV0IGNoYXJ0MjRTdHlsZU5vZGUgPSBudWxsXHJcbmxldCBjaGFydDI0Tm9kZSA9IG51bGxcclxuXHJcbmNvbnN0IGZpeENoYXQyNFdpZGdldFBvc2l0aW9uID0gKCkgPT4ge1xyXG4gICAgY2hhcnQyNE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjaGF0LTI0JylcclxuXHJcbiAgICBpZiAoIWNoYXJ0MjROb2RlKSByZXR1cm5cclxuXHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCAxMDI0ICYmICFjaGFydDI0U3R5bGVOb2RlKSB7XHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcclxuXHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZS5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgIC5zdGFydEJ0bi5zdGFydEJ0bi0tb3V0c2lkZS5zdGFydEJ0bi0tYm90dG9tIHtcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogNjdweDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAuc3RhcnRCdG4uc3RhcnRCdG4tLW9wZW4ge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDUwJSkgc2NhbGUoMC42KSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY2hhcnQyNE5vZGUuc2hhZG93Um9vdC5wcmVwZW5kKGNoYXJ0MjRTdHlsZU5vZGUpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDEwMjQgJiYgY2hhcnQyNFN0eWxlTm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFydDI0U3R5bGVOb2RlJywgY2hhcnQyNFN0eWxlTm9kZSk7XHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZS5yZW1vdmUoKVxyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJJbnRlcnZhbChjaGF0MjRJbnRlcnZhbElkKVxyXG4gICAgY2hhdDI0SW50ZXJ2YWxJZCA9IG51bGxcclxuXHJcbiAgICBjbGVhclRpbWVvdXQoY2hhdDI0VGltZW91dElkKVxyXG4gICAgY2hhdDI0VGltZW91dElkID0gbnVsbFxyXG59XHJcblxyXG5jb25zdCBjaGF0MjRSZW5kZXJMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGNoYXQyNEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmaXhDaGF0MjRXaWRnZXRQb3NpdGlvbiwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBoYXJkUmVtb3ZlQ2hhdDI0UmVuZGVyTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjaGF0MjRUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpZiAoY2hhdDI0SW50ZXJ2YWxJZCkgY2xlYXJJbnRlcnZhbChjaGF0MjRJbnRlcnZhbElkKVxyXG4gICAgfSwgMTAwMDApXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKGNoYXQyNFJlbmRlckxpc3RlbmVyKTtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChoYXJkUmVtb3ZlQ2hhdDI0UmVuZGVyTGlzdGVuZXIpO1xyXG59KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDEwMjQpIHtcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwoY2hhdDI0UmVuZGVyTGlzdGVuZXIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYXJ0MjRTdHlsZU5vZGUpIGNoYXJ0MjRTdHlsZU5vZGUucmVtb3ZlKClcclxufSlcclxuLy8gRml4aW5nIGNoYXQtMjQgd2lkZ2V0IHBvc2l0aW9uIC0tIEZJTklTSCIsIi8qKlxyXG4gKiDQpNC70LDQsywg0YPQutCw0LfRi9Cy0LDRjtGJ0LjQuSDQvdCwINGA0LXQttC40Lwg0YDQsNC30YDQsNCx0L7RgtC60LguXHJcbiAqIEB0eXBlIHtib29sZWFufVxyXG4gKlxyXG4gKiDQlNC70Y8g0YHQtdGA0LLQtdGA0LAg0LLQtdGA0YHRgtC60Lgg0YHQvtCx0LjRgNCw0YLRjCDQuCDQv9GD0YjQuNGC0Ywg0LIg0YDQtdC20LjQvNC1IERFVl9NT0RFID0gdHJ1ZVxyXG4gKiDQndCwINC/0YDQvtC0INC4INC00LXQsiDRgdC+0LHQuNGA0LDRgtGMINC4INC/0YPRiNC40YLRjCDQsiDRgNC10LbQuNC80LUgREVWX01PREUgPSBmYWxzZVxyXG4gKlxyXG4gKiDQkiDRgNC10LbQuNC80LUgREVWX01PREUgPSB0cnVlLCDQv9GA0Lgg0LvQvtC60LDQu9GM0L3QvtC5INGA0LDQt9GA0LDQsdC+0YLQutC1LFxyXG4gKiDRgtCw0LrQttC1INC90LXQvtCx0YXQvtC00LjQvNC+INC/0YDQsNCy0LjRgtGMINC/0YPRgtGMINC00L4g0YTQsNC50LvQsCBtYWluLmpzXHJcbiAqXHJcbiAqINCf0YDQuNC8LjogPHNjcmlwdCBzcmM9XCJodHRwOi8vbG9jYWxob3N0OtC90L7QvNC10YBf0L/QvtGC0LAvanMvbWFpbi5qc1wiIGRlZmVyPjwvc2NyaXB0PlxyXG4gKi9cclxuY29uc3QgREVWX01PREUgPSB3aW5kb3cuTU9ERSA9PT0gJ2RldicgLy8gZGV2IC0gdHJ1ZSwgYnVpbGQgLSBmYWxzZVxyXG5cclxuLy8gSW5pdCBjYXJ0IGN1c3RvbSBFdmVudFxyXG5jb25zdCBjYXJ0RXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2NhcnRVcGRhdGVFdmVudCcsIHtcclxuICAgIGRldGFpbDoge1xyXG4gICAgICAgIG1lc3NhZ2U6ICdGaXJlZCBjYXJ0IHByb2R1Y3QgdXBkYXRlZCBjdXN0b20gRXZlbnQhJ1xyXG4gICAgfSxcclxuICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgY2FuY2VsYWJsZTogZmFsc2VcclxufSlcclxuXHJcbmNvbnN0IG5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEgPSAoZGF0YSkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdHMgPSBbXVxyXG5cclxuICAgIGlmIChkYXRhLmRvdHMpIHtcclxuICAgICAgICBkYXRhLmRvdHMuZm9yRWFjaChkb3QgPT4ge1xyXG4gICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHthcnRpY2xlOiBkb3QuaWQsIGNvdW50OiBkb3QuY291bnR9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnByb2R1Y3RzKSB7XHJcbiAgICAgICAgZGF0YS5wcm9kdWN0cy5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG4gICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHthcnRpY2xlOiBwcm9kdWN0LmFydGljbGUsIGNvdW50OiBwcm9kdWN0LmNvdW50fSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJvZHVjdHNcclxufVxyXG5cclxuLy8gTWV0aG9kcyB0byB3b3JrIHdpdGggY2FydCBmb3IgUFJPRFVDVFNcclxud2luZG93LnNldFByb2R1Y3RUb0NhcnQgPSBhc3luYyAoe2FydCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGJ0LDQtdC8INGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGC0L7QstCw0YDQsCDQsiDQutC+0YDQt9C40L3QtTonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQtcnUvbW9ja3MvY2FydC1zZXQuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9zZXQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YHRgtC40LvQuCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdC1LiDQn9C+0LvRg9GH0LjQu9C4INC+0YLQstC10YInLCBkYXRhKVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YDQsNC30LzQtdGJ0LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINCa0L7RgNC30LjQvdC1ISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRQcm9kdWN0VG9DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQu9C10L3QuNC1INGC0L7QstCw0YDQsCDQsiDQutC+0YDQt9C40L3RgzonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQtcnUvbW9ja3MvY2FydC1hZGQuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9hZGQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQlNC+0LHQsNCy0LjQu9C4INGC0L7QstCw0YAg0LIg0LrQvtGA0LfQuNC90YMuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1JywgZGF0YSlcclxuICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LTQvtCx0LDQstC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINCa0L7RgNC30LjQvdGDISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LnJlbW92ZVByb2R1Y3RGcm9tQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQo9C00LDQu9C10L3QuNC1INGC0L7QstCw0YDQsCDQuNC3INC60L7RgNC30LjQvdGLOicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC1ydS9tb2Nrcy9jYXJ0LWRlbC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2RlbCcsIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ9Cj0LTQsNC70LjQu9C4INGC0L7QstCw0YAg0LjQtyDQutC+0YDQt9C40L3Riy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LUnLCBkYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YPQtNCw0LvQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LjQtyDQmtC+0YDQt9C40L3RiyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBNZXRob2RzIHRvIHdvcmsgd2l0aCBjYXJ0IGZvciBET1RTXHJcbndpbmRvdy5zZXREb3RUb0NhcnQgPSBhc3luYyAoe2lkLCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YnQsNC10Lwg0YTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0JTQvtGC0L7QsiDQsiDQutC+0YDQt9C40L3QtTonLCBpZCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2lkJywgaWQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQtcnUvbW9ja3MvY2FydC1zZXREb3QuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9zZXQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YHRgtC40LvQuCDQlNC+0YLRiyDQsiDQutC+0YDQt9C40L3QtS4g0J/QvtC70YPRh9C40LvQuCDQvtGC0LLQtdGCJywgZGF0YSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgNCw0LfQvNC10YnQtdC90LjRjyDQlNC+0YLQvtCyINCyINCa0L7RgNC30LjQvdC1ISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGREb3RUb0NhcnQgPSBhc3luYyAob3JkZXIpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQlNC+0LHQsNCy0LvQtdC90LjQtSDQtNC+0YLQsCDQsiDQutC+0YDQt9C40L3Rgy4g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1OicsIG9yZGVyKVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LXJ1L21vY2tzL2NhcnQtYWRkRG90Lmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvYWRkRG90Jywge21ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeShvcmRlcil9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuICAgICAgICB3aW5kb3cuc2hvd01vZGFsTXNnKFwi0JTQvtCx0LDQstC40LvQuCDQlNC+0YIg0LIg0LrQvtGA0LfQuNC90YMuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1XCIsIGRhdGEpXHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC00L7QsdCw0LLQu9C10L3QuNGPINCU0L7RgtCwINCyINCa0L7RgNC30LjQvdGDISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5yZW1vdmVEb3RGcm9tQ2FydCA9IGFzeW5jICh7aWQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ9Cj0LTQsNC70LXQvdC40LUg0JTQvtGC0LAg0LjQtyDQutC+0YDQt9C40L3RizonLCBpZCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2lkJywgaWQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQtcnUvbW9ja3MvY2FydC1kZWxEb3QuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9kZWxEb3QnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQo9C00LDQu9C40LvQuCBEb3Qg0LjQtyDQutC+0YDQt9C40L3Riy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LUnLCBkYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YPQtNCw0LvQtdC90LjRjyDQlNC+0YLQsCDQuNC3INCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyBDYXJ0IFByb3h5XHJcbmNvbnN0IGNhcnRHZXQgPSAodGFyZ2V0LCBwcm9wKSA9PiB7XHJcbiAgICByZXR1cm4gdGFyZ2V0W3Byb3BdXHJcbn1cclxuXHJcbmNvbnN0IGNhcnRTZXQgPSAodGFyZ2V0LCBwcm9wLCB2YWwpID0+IHtcclxuXHJcblxyXG4gICAgaWYgKHByb3AgPT09ICdwcm9kdWN0cycpIHtcclxuICAgICAgICAvLyDQn9GA0L7QstC10YDRjNGC0LUsINC+0YLQu9C40YfQsNC10YLRgdGPINC70Lgg0L3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1INC+0YIg0YHRgtCw0YDQvtCz0L4g0LfQvdCw0YfQtdC90LjRjy5cclxuICAgICAgICBjb25zdCBpc19zYW1lID0gKHRhcmdldC5wcm9kdWN0cy5sZW5ndGggPT09IHZhbC5sZW5ndGgpICYmIHRhcmdldC5wcm9kdWN0cy5ldmVyeShcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5hcnRpY2xlID09PSB2YWxbaW5kZXhdLmFydGljbGUgJiYgZWxlbWVudC5jb3VudCA9PT0gdmFsW2luZGV4XS5jb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKCFpc19zYW1lKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdTRVRUSU5HJyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0YXJnZXQnLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncHJvcCcsIHByb3ApO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmFsJywgdmFsKTtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5wcm9kdWN0cyA9IFsuLi52YWxdO1xyXG4gICAgICAgICAgICBjYXJ0RXZlbnQuZGV0YWlsLnByb2R1Y3RzID0gdGFyZ2V0LnByb2R1Y3RzO1xyXG4gICAgICAgICAgICAvLyBEaXNwYXRjaGluZyBjdXN0b20gY2FydCB1cGRhdGUgRXZlbnRcclxuICAgICAgICAgICAgY29uc3QgY2FydFByb2R1Y3RDb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhcnRQcm9kdWN0Q291bnRcIik7XHJcbiAgICAgICAgICAgIGlmIChjYXJ0UHJvZHVjdENvdW50Tm9kZSkgY2FydFByb2R1Y3RDb3VudE5vZGUuZGlzcGF0Y2hFdmVudChjYXJ0RXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2FydCA9IGFzeW5jICgpID0+IHtcclxuICAgIGlmICghd2luZG93LkNBUlQpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LXJ1L21vY2tzL2NhcnQtZ2V0Lmpzb24nKVxyXG4gICAgICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2dldCcsIHttZXRob2Q6ICdQT1NUJ30pXHJcblxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5DQVJUID0gbmV3IFByb3h5KHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzOiBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBjYXJ0R2V0LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBjYXJ0U2V0XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVEFSVCcpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVzcG9uc2UgZGF0YScsIGRhdGEpXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3aW5kb3cuQ0FSVCcsIHdpbmRvdy5DQVJUKVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGSU5JU0gnKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRDYXJ0KVxyXG5cclxuLy8gc2V0VGltZW91dCgoKSA9PiB7XHJcbi8vICAgICAvLyDQvtGC0LrQu9Cw0LTRi9Cy0LDQtdC8INC90LAgMSDQvNC40L3Rg9GC0YNcclxuLy8gICAgIHdpbmRvdy5jYXJ0VXBkYXRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbi8vICAgICAgICAgaWYgKHdpbmRvdy5DQVJUICE9PSB1bmRlZmluZWQgJiYgIURFVl9NT0RFKSB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2dldCcsIHttZXRob2Q6ICdQT1NUJ30pXHJcbi8vICAgICAgICAgICAgIGlmIChyZXMub2spIHtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbi8vICAgICAgICAgICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfSwgMzAwMDApXHJcbi8vIH0sIDYwMDAwKSJdfQ==
