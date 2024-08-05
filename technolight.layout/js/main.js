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


    if (prop === 'products') {
        // Проверьте, отличается ли новое значение от старого значения.
        const is_same = (target.products.length === val.length) && target.products.every(
          function(element, index) {
              return element.article === val[index].article && element.count === val[index].count;
          }
        );
        if (!is_same) {
            console.log('SETTING');
            console.log('target', target);
            console.log('prop', prop);
            console.log('val', val);
            
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
        const res = await fetch('/ajax/cart/get', { method: 'POST' })
        if (res.ok) {
            const data = await res.json()
            window.CART.products = [...normalizeResponseCartData(data)]
        }
    }
}, 5000)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJkZWJvdW5jZS5qcyIsImRvd25sb2FkRmlsZS5qcyIsImZvcm1hdE51bWJlci5qcyIsImdldFVybFBhcmFtZXRlckJ5TmFtZS5qcyIsInNhdmVDYWxsLmpzIiwic21vb3RoU2Nyb2xsVG8uanMiLCJ0aHJvdHRsZS5qcyIsInZhbGlkYXRlRW1haWwuanMiLCJ2YWxpZGF0ZVBob25lLmpzIiwiYWNjb3VudC1mb3Jtcy9zY3JpcHQuanMiLCJjYXJkcy1pdGVtL3NjcmlwdC5qcyIsImNhcmRzLXNlcmllcy9zY3JpcHQuanMiLCJmaWx0ZXJzL3NjcmlwdC5qcyIsImluZm9ybWVyL3Njcml0cC5qcyIsIm1vZGFscy9zY3JpcHQuanMiLCJwcm9kdWN0LWluZm8vc2NyaXB0LmpzIiwicmVjb21tZW5kYXRpb24vc2NyaXB0LmpzIiwic2Nyb2xsLXRvLXRvcC9zY3JpcHQuanMiLCJzaG93LW1vZGFsLW1zZy9zY3JpcHQuanMiLCJzcGlubmVyL3NjcmlwdC5qcyIsImZvb3Rlci9zY3JpcHQuanMiLCJoZWFkZXIvc2NyaXB0LmpzIiwibWFpbi5qcyIsImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdlhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENsZWFyIHBob25lIG9mIHNwYWNlcywgYnJhY2tldHMsXHJcbiAqIGRhc2hlcyBhbmQgcGx1cyBzaWduLiBMZWF2ZSBvbmx5IG51bWJlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZSAtIFRoZSBwaG9uZSwgdGhhdCBuZWVkcyB0byBjbGVhci5cclxuICogQHJldHVybnMge251bWJlcn0gLSBQaG9uZSBudW1iZXIgYXMgYSBudW1iZXIgdHlwZS5cclxuICovXHJcbndpbmRvdy5jbGVhclBob25lID0gKHBob25lKSA9PiB7XHJcbiAgICByZXR1cm4gcGFyc2VJbnQocGhvbmUucmVwbGFjZSgvXFxEL2csIFwiXCIpKVxyXG59XHJcbiIsIndpbmRvdy5kZWJvdW5jZSA9IChmdW5jLCBtcykgPT4ge1xyXG4gICAgbGV0IHRpbWVvdXRJZFxyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpc1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHNcclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcclxuXHJcbiAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcclxuICAgICAgICB9LCBtcylcclxuICAgIH1cclxufVxyXG4iLCIvKipcbiAqIERvd25sb2FkcyBhIGZpbGUgZnJvbSB0aGUgc3BlY2lmaWVkIFVSTCBhbmQgdHJpZ2dlcnMgYSBkb3dubG9hZCBpbiB0aGUgYnJvd3Nlci5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgb2YgdGhlIGZpbGUgdG8gYmUgZG93bmxvYWRlZC5cbiAqL1xud2luZG93LmRvd25sb2FkRmlsZSA9ICh1cmwsIGZpbGVuYW1lPW51bGwsIGRlZmF1bHRFeHRlbnNpb24gPSAnYmluJykgID0+IHtcbiAgICBpZiAodXJsID09PSB1bmRlZmluZWQgfHwgdXJsID09PSBudWxsIHx8IHVybCA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vINCf0L7QutCw0LfQsNGC0Ywg0YHQv9C40L3QvdC10YBcbiAgICBpZiAod2luZG93LnNwaW5uZXIgJiYgdHlwZW9mIHdpbmRvdy5zcGlubmVyLnNob3cgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93KCk7XG4gICAgfVxuXG4gICAgLy8g0KHQvtC30LTQsNC10Lwg0L3QvtCy0YvQuSBYTUxIdHRwUmVxdWVzdFxuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYmxvYlwiO1xuXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0LfQsNCy0LXRgNGI0LXQvdC40Y8g0LfQsNCz0YDRg9C30LrQuFxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgLy8g0J/QvtC/0YvRgtC60LAg0L/QvtC70YPRh9C40YLRjCDRgNCw0YHRiNC40YDQtdC90LjQtSDQuNC3INC30LDQs9C+0LvQvtCy0LrQvtCyXG4gICAgICAgICAgICBsZXQgZXh0ZW5zaW9uID0gZGVmYXVsdEV4dGVuc2lvbjtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnREaXNwb3NpdGlvbiA9IHhoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIik7XG4gICAgICAgICAgICBpZiAoY29udGVudERpc3Bvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBjb250ZW50RGlzcG9zaXRpb24ubWF0Y2goL2ZpbGVuYW1lPVwiPygoLiopXFwuKC4qKSlcIj8vKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWxlbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb24gPSBtYXRjaFszXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCh0L7Qt9C00LDQtdC8IFVSTCDQtNC70Y8g0LfQsNCz0YDRg9C20LXQvdC90L7Qs9C+INGE0LDQudC70LBcbiAgICAgICAgICAgIGNvbnN0IGJsb2JVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHhoci5yZXNwb25zZSk7XG5cbiAgICAgICAgICAgIC8vINCh0L7Qt9C00LDQtdC8INCy0YDQtdC80LXQvdC90YvQuSDRjdC70LXQvNC10L3RgiA8YT4g0LTQu9GPINGB0LrQsNGH0LjQstCw0L3QuNGPINGE0LDQudC70LBcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgIGEuaHJlZiA9IGJsb2JVcmw7XG4gICAgICAgICAgICBhLmRvd25sb2FkID0gYCR7ZmlsZW5hbWV9LiR7ZXh0ZW5zaW9ufWA7IC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INC40LzRjyDRhNCw0LnQu9CwINGBINGA0LDRgdGI0LjRgNC10L3QuNC10LxcblxuICAgICAgICAgICAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGN0LvQtdC80LXQvdGCINCyIERPTSDQuCDQuNC90LjRhtC40LjRgNGD0LXQvCDRgdC60LDRh9C40LLQsNC90LjQtVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgICAgIGEuY2xpY2soKTtcblxuICAgICAgICAgICAgLy8g0KPQtNCw0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YIg0LjQtyBET01cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XG5cbiAgICAgICAgICAgIC8vINCe0YHQstC+0LHQvtC20LTQsNC10LwgVVJMINC+0LHRitC10LrRgtCwXG4gICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGJsb2JVcmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0KHQutGA0YvRgtGMINGB0L/QuNC90L3QtdGAXG4gICAgICAgIGlmICh3aW5kb3cuc3Bpbm5lciAmJiB0eXBlb2Ygd2luZG93LnNwaW5uZXIuaGlkZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0L7RiNC40LHQvtC6XG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LfQsNCz0YDRg9C30LrQtSDRhNCw0LnQu9CwXCIpO1xuXG4gICAgICAgIC8vINCh0LrRgNGL0YLRjCDRgdC/0LjQvdC90LXRgCDQsiDRgdC70YPRh9Cw0LUg0L7RiNC40LHQutC4XG4gICAgICAgIGlmICh3aW5kb3cuc3Bpbm5lciAmJiB0eXBlb2Ygd2luZG93LnNwaW5uZXIuaGlkZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LfQsNC/0YDQvtGBXG4gICAgeGhyLnNlbmQoKTtcbn0iLCIvKipcclxuICogRm9ybWF0dGluZyBudW1iZXIgdG8gdGhlIGxvY2FsIHZhbHVlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyfSBudW1iZXIgLSBWYWx1ZSBmb3IgZm9ybWF0dGluZy5cclxuICovXHJcblxyXG53aW5kb3cuZm9ybWF0TnVtYmVyID0gKG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUludChudW1iZXIudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMvZywgXCJcIikpXHJcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIiBcIik7XHJcbn1cclxuIiwiLyoqXHJcbiAqIEdldHRpbmcgZ2V0IHBhcmFtZXRlciBmcm9tIHRoZSB1cmxcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2VhcmNoIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtzdHJpbmd9IFt1cmxdIC0gVGhlIFVSTCBhZGRyZXNzLiBJZiB0aGlzIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCB0aGVuIHRoZSBzZWFyY2gsIGJ5IGRlZmF1bHQsIHdpbGwgb2NjdXIgaW4gdGhlIGN1cnJlbnQgVVJMLlxyXG4gKi9cclxud2luZG93LmdldFVybFBhcmFtZXRlckJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUsIHVybCkge1xyXG4gICAgaWYgKCFuYW1lKSByZXR1cm5cclxuXHJcbiAgICBpZiAoIXVybCkgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKVxyXG5cclxuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsXHJcblxyXG4gICAgaWYgKCFyZXN1bHRzWzJdKSByZXR1cm4gJydcclxuXHJcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSlcclxufVxyXG4iLCIvKipcbiAqINCx0LXQt9C+0L/QsNGB0L3Ri9C5INCy0YvQt9C+0LIg0YTRg9C90LrRhtC40LhcbiAqIEBwYXJhbSBmbiBmdW5jdGlvblxuICogQHBhcmFtIHsoKnwqKVtdW119IGFyZ3NcbiAqL1xud2luZG93LnNhZmVDYWxsID0gZnVuY3Rpb24oZm4sIC4uLmFyZ3MpIHtcbiAgdHJ5IHtcbiAgICBmbi5jYWxsKHRoaXMgfHwgd2luZG93LCAuLi5hcmdzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcIltTYWZlIENhbGxdOiBcIiwgZm4sIGUpO1xuICB9XG59OyIsIi8qKlxyXG4gKiBTbW9vdGhseSBzY3JvbGxzIHRoZSBwYWdlIHRvIHRoZSBzcGVjaWZpZWQgcG9zaXRpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBwb3NpdGlvbiB0byBzY3JvbGwgdG8uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb249NTAwXSAtIFRoZSBkdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uIGluIG1pbGxpc2Vjb25kcy5cclxuICovXHJcbmZ1bmN0aW9uIHNtb290aFNjcm9sbFRvKHBvc2l0aW9uLCBkdXJhdGlvbiA9IDUwMCkge1xyXG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb25cclxuICAgIGxldCBzdGFydFRpbWVzdGFtcCA9IG51bGxcclxuXHJcbiAgICBmdW5jdGlvbiBzdGVwKHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICghc3RhcnRUaW1lc3RhbXApIHN0YXJ0VGltZXN0YW1wID0gdGltZXN0YW1wXHJcblxyXG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gdGltZXN0YW1wIC0gc3RhcnRUaW1lc3RhbXBcclxuICAgICAgICBjb25zdCBzY3JvbGxZID0gZWFzZUluT3V0Q3ViaWMocHJvZ3Jlc3MsIHN0YXJ0UG9zaXRpb24sIGRpc3RhbmNlLCBkdXJhdGlvbilcclxuXHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbFkpXHJcblxyXG4gICAgICAgIGlmIChwcm9ncmVzcyA8IGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZWFzZUluT3V0Q3ViaWModCwgYiwgYywgZCkge1xyXG4gICAgICAgIHQgLz0gZFxyXG4gICAgICAgIHQtLVxyXG4gICAgICAgIHJldHVybiBjICogKHQgKiB0ICogdCArIDEpICsgYlxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxufVxyXG4iLCJ3aW5kb3cudGhyb3R0bGUgPSAoZnVuYywgbXMpID0+IHtcclxuICAgIGxldCBpc1Rocm90dGxlZCA9IGZhbHNlLFxyXG4gICAgICAgIHNhdmVkQXJncyxcclxuICAgICAgICBzYXZlZFRoaXNcclxuXHJcbiAgICBmdW5jdGlvbiB3cmFwcGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoaXNUaHJvdHRsZWQpIHsgLy8gMlxyXG4gICAgICAgICAgICBzYXZlZEFyZ3MgPSBhcmd1bWVudHNcclxuICAgICAgICAgICAgc2F2ZWRUaGlzID0gdGhpc1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSAvLyAxXHJcblxyXG4gICAgICAgIGlzVGhyb3R0bGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpc1Rocm90dGxlZCA9IGZhbHNlIC8vIDNcclxuICAgICAgICAgICAgaWYgKHNhdmVkQXJncykge1xyXG4gICAgICAgICAgICAgICAgd3JhcHBlci5hcHBseShzYXZlZFRoaXMsIHNhdmVkQXJncylcclxuICAgICAgICAgICAgICAgIHNhdmVkQXJncyA9IHNhdmVkVGhpcyA9IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIG1zKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3cmFwcGVyXHJcbn0iLCIvKipcclxuICogRW1haWwgYWRkcmVzcyB2ZXJpZmljYXRpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsLCB0aGF0IG5lZWRzIHRvIHZhbGlkYXRpbmcuXHJcbiAqL1xyXG53aW5kb3cudmFsaWRhdGVFbWFpbCA9IChlbWFpbCkgPT4ge1xyXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBlbWFpbFxyXG4gICAgY29uc3QgZW1haWxSZWdleCA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvXHJcbiAgICByZXR1cm4gZW1haWxSZWdleC50ZXN0KGVtYWlsKVxyXG59XHJcbiIsIi8qKlxyXG4gKiBQaG9uZSBudW1iZXIgdmVyaWZpY2F0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZSAtIFRoZSBwaG9uZSwgdGhhdCBuZWVkcyB0byB2YWxpZGF0aW5nLlxyXG4gKi9cclxud2luZG93LnZhbGlkYXRlUGhvbmUgPSAocGhvbmUpID0+IHtcclxuICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgcGhvbmVcclxuICAgIGNvbnN0IHBob25lUmVnZXggPSAvXjdcXGR7MTB9JC9cclxuICAgIHJldHVybiBwaG9uZVJlZ2V4LnRlc3QocGhvbmUpXHJcbn1cclxuIiwiY29uc3QgaW5pdFRvZ2dsZVZpc2libGVGb3JtUGFzcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2dnbGUtdmlzaWJsZS1wYXNzJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgIGNvbnN0IGlzVGV4dCA9IGlucHV0LnR5cGUgPT09ICd0ZXh0J1xyXG5cclxuICAgICAgICBpbnB1dC50eXBlID0gaXNUZXh0ID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0J1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgncGFzcy12aXNpYmxlJylcclxuICAgIH0pKVxyXG59XHJcblxyXG4vLyBjb25zdCByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIgPSAoaW5wdXROb2RlKSA9PiB7XHJcbi8vICAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUuY2xvc2VzdCgnbGFiZWwnKVxyXG4vLyAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbi8vIH1cclxuXHJcbi8vIGNvbnN0IHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIgPSAoaW5wdXROb2RlLCBlcnJvclRleHQpID0+IHtcclxuLy8gICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5jbG9zZXN0KCdsYWJlbCcpXHJcbi8vICAgICBjb25zdCBtZXNzYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJylcclxuXHJcbi8vICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGFzLWVycm9yJylcclxuLy8gICAgIG1lc3NhZ2UuaW5uZXJUZXh0ID0gZXJyb3JUZXh0XHJcblxyXG4vLyAgICAgaW5wdXROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4vLyAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxyXG4vLyAgICAgfSlcclxuLy8gfVxyXG5cclxuLy8gY29uc3QgaW5pdEFjY291bnRGb3JtID0gKCkgPT4ge1xyXG4vLyAgICAgY29uc3QgZm9ybXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvdW50LWZvcm1fX2Zvcm0nKSlcclxuLy8gICAgIGlmIChmb3Jtcy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuLy8gICAgIGZvcm1zLmZvckVhY2goZm9ybSA9PiBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuLy8gICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbi8vICAgICAgICAgY29uc3QgZm9ybVZhbGlkID0ge2VtYWlsOiB0cnVlLCBwYXNzOiB0cnVlLCB9XHJcbi8vICAgICAgICAgY29uc3QgZW1haWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZW1haWxcIl0nKVxyXG4vLyAgICAgICAgIGNvbnN0IHBhc3MgID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBhc3NcIl0nKVxyXG4vLyAgICAgICAgIGNvbnN0IGZvcm1UeXBlID0gdGhpcy5kYXRhc2V0LmZvcm1UeXBlXHJcblxyXG4vLyAgICAgICAgIHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbClcclxuLy8gICAgICAgICBpZiAoZm9ybVR5cGUgIT09ICdyZWNvdmVyeScpIHtcclxuLy8gICAgICAgICAgICAgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKHBhc3MpXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAvLyBDaGVjayBlbWFpbFxyXG4vLyAgICAgICAgIGlmIChlbWFpbC52YWx1ZSAhPT0gJycpIHtcclxuLy8gICAgICAgICAgICAgaWYgKHdpbmRvdy52YWxpZGF0ZUVtYWlsKGVtYWlsLnZhbHVlKSkge1xyXG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gdHJ1ZVxyXG4vLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbCwgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyEnKVxyXG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2VcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIoZW1haWwsICfQndC10L7QsdGF0L7QtNC40LzQviDRg9C60LDQt9Cw0YLRjCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyEnKVxyXG4vLyAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSBmYWxzZVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgLy8gQ2hlY2sgcGFzc1xyXG4vLyAgICAgICAgIGlmIChmb3JtVHlwZSAhPT0gJ3JlY292ZXJ5Jykge1xyXG4vLyAgICAgICAgICAgICBpZiAocGFzcy52YWx1ZS5sZW5ndGggPCA4KSB7XHJcbi8vICAgICAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKHBhc3MsICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QsNGA0L7Qu9GMLiDQlNC70LjQvdC90LAg0L/QsNGA0L7Qu9GPINC00L7Qu9C20L3QsCDQsdGL0YLRjCDQvdC1INC80LXQvdC10LUgOCDRgdC40LzQstC+0LvQvtCyIScpXHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQucGFzcyA9IGZhbHNlXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIC8vIFNlbmdpbmcgZm9ybSBkYXRhXHJcbi8vICAgICAgICAgaWYgKGZvcm1WYWxpZC5lbWFpbCAmJiBmb3JtVmFsaWQucGFzcykge1xyXG4vLyAgICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcclxuXHJcbi8vICAgICAgICAgICAgIC8vINCe0LHRj9C30LDRgtC10LvRjNC90L4g0YPQtNCw0LvQuNGC0Ywg0L/QvtGB0LvQtSDQstC90LXQtNGA0LXQvdC40Y9cclxuLy8gICAgICAgICAgICAgZm9yIChsZXQgW25hbWUsIHZhbHVlXSBvZiBmb3JtRGF0YSkge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7bmFtZX06ICR7dmFsdWV9YCk7XHJcbi8vICAgICAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyByZXF1ZXN0IGZvciB1cGRhdGluZyB1c2VyIGRhdGEnKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9KSlcclxuLy8gfVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAvLyBpbml0QWNjb3VudEZvcm0oKVxyXG4gICAgaW5pdFRvZ2dsZVZpc2libGVGb3JtUGFzcygpXHJcbn0pIiwiLy8gQWRkIHByb2R1Y3QgdG8gZmF2b3JpdGVzXHJcbmNvbnN0IGFkZFRvRmF2b3JpdGVzQ2xpY2tIYW5kbGVyID0gKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIGNvbnN0IF90aGlzID0gZS50YXJnZXRcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBfdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJylcclxuICAgIGNvbnN0IHRpdGxlID0gX3RoaXMuZGF0YXNldC50aXRsZVxyXG4gICAgY29uc3QgbWVzc2FnZSA9IF90aGlzLmRhdGFzZXQubWVzc2FnZVxyXG4gICAgY29uc3QgaGVhZGVyRmF2b3JpdGVzID0gZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnV0dG9ucy1saW5rX2Zhdm9yaXRlcyAuaGVhZGVyX19idXR0b25zLWNvdW50JylcclxuICAgIGNvbnN0IGN1cnJlbnRGYXZvcml0ZXNDb3VudCA9IHBhcnNlSW50KGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQpXHJcblxyXG4gICAgaWYgKCFpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgX3RoaXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQgPSBjdXJyZW50RmF2b3JpdGVzQ291bnQgKyAxXHJcbiAgICAgICAgaGVhZGVyRmF2b3JpdGVzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGhlYWRlckZhdm9yaXRlcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpLCAxMDAwKVxyXG5cclxuICAgICAgICBzaG93TW9kYWxNc2codGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9CX0LTQtdGB0Ywg0L3QsNC00L4g0LHRg9C00LXRgiDQvdCw0L/QuNGB0LDRgtGMINCw0YHQuNC90YXRgNC+0L3QvdGL0Lkg0LfQsNC/0YDQvtGBINC00L7QsdCw0LLQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQuNC30LHRgNCw0L3QvdGL0LUnKTtcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBfdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICBoZWFkZXJGYXZvcml0ZXMuaW5uZXJUZXh0ID0gY3VycmVudEZhdm9yaXRlc0NvdW50IC0gMVxyXG4gICAgY29uc29sZS5lcnJvcignQXN5bmMgcXVlcnkgdG8gREVMRVRFIHNlbGVjdGVkIHByb2R1Y3QgZnJvbSBGYXZvcml0ZXMnKTtcclxufVxyXG5cclxuY29uc3QgaW5pdEFkZFRvRmF2b3JpdGVzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3QtaXRlbV9fZmF2b3JpdGVzJykpXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGJ0biA9PiBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRUb0Zhdm9yaXRlc0NsaWNrSGFuZGxlcikpXHJcbn1cclxuXHJcbi8vIEFkZCBwcm9kdWN0IHRvIGNhcnRcclxuY29uc3QgYWRkVG9DYXJ0Q2xpY2tIYW5kbGVyID0gKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIGNvbnN0IF90aGlzID0gZS50YXJnZXRcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBfdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJylcclxuICAgIGNvbnN0IHRpdGxlID0gX3RoaXMuZGF0YXNldC50aXRsZVxyXG4gICAgY29uc3QgbWVzc2FnZSA9IF90aGlzLmRhdGFzZXQubWVzc2FnZVxyXG5cclxuICAgIGlmICghaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIF90aGlzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzaG93TW9kYWxNc2codGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgICAgIC8vIFB1c2ggY3VycmVudCBwcm9kdWN0IHRvIENhcnQgR2xvYmFsIE9iamVjdCAod2luZG93LkNBUlQpXHJcbiAgICAgICAgd2luZG93LmFkZFByb2R1Y3RUb0NhcnQoeyBhcnQ6IF90aGlzLmRhdGFzZXQucHJvZHVjdElkLCBjb3VudDogMSB9KVxyXG5cclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBfdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICBzaG93TW9kYWxNc2codGl0bGUsICfQo9C00LDQu9C10L0g0LjQtyDQutC+0YDQt9C40L3RiycpXHJcblxyXG4gICAgLy8gUmVtb3ZlIGN1cnJlbnQgcHJvZHVjdCBmcm9tIENhcnQgR2xvYmFsIE9iamVjdCAod2luZG93LkNBUlQpXHJcbiAgICB3aW5kb3cucmVtb3ZlUHJvZHVjdEZyb21DYXJ0KHsgYXJ0OiBfdGhpcy5kYXRhc2V0LnByb2R1Y3RJZCwgY291bnQ6IDEgfSlcclxufVxyXG5jb25zdCBpbml0QWRkVG9DYXJ0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3QtaXRlbV9fY2FydCcpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChidG4gPT4gYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWRkVG9DYXJ0Q2xpY2tIYW5kbGVyKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0QWRkVG9GYXZvcml0ZXMoKVxyXG4gICAgaW5pdEFkZFRvQ2FydCgpXHJcbn0pIiwiXHJcbmNvbnN0IHJlc2V0QWxsQ2FyZHNQaWNzID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IHBpY3MgPSBBcnJheS5mcm9tKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fcGljJykpXHJcbiAgICBwaWNzLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG59XHJcblxyXG5jb25zdCByZXNldEFsbENhcmRzVGFicyA9IChub2RlKSA9PiB7XHJcbiAgICBjb25zdCB0YWJzID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3RhYicpKVxyXG4gICAgdGFicy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxufVxyXG5cclxuY29uc3QgZ2V0VGFyZ2V0Q2FyZHNQaWMgPSAobm9kZSwgZGF0YVRhcmdldFR5cGVWYWwpID0+IHtcclxuICAgIHJldHVybiBub2RlLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXR5cGU9JHtkYXRhVGFyZ2V0VHlwZVZhbH1dYClcclxufVxyXG5cclxuY29uc3QgaW5pdENhcmRzVGFiID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFiQXJyID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX190YWInKSlcclxuXHJcbiAgICB0YWJBcnIuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmNsb3Nlc3QoJy5jYXJkcy1zZXJpZXNfX2l0ZW0nKVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQaWNUeXBlID0gdGhpcy5kYXRhc2V0LnRhcmdldFR5cGVcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UGljID0gZ2V0VGFyZ2V0Q2FyZHNQaWMocGFyZW50LCB0YXJnZXRQaWNUeXBlKVxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFjdGl2ZSB0YWJcclxuICAgICAgICAgICAgcmVzZXRBbGxDYXJkc1RhYnMocGFyZW50KVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFjdGl2ZSBpbWFnZVxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0UGljKSB7XHJcbiAgICAgICAgICAgICAgICByZXNldEFsbENhcmRzUGljcyhwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRQaWMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRDYXJkc1RhYilcclxuIiwiLy8gRmlsdGVyc1xuY29uc3Qgc2hvd05vRmlsdGVyTXNnID0gKCkgPT4ge1xuICB0cnkge1xuXG5cbiAgICBjb25zdCBtc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uX19tc2dcIik7XG5cbiAgICBpZiAoIW1zZykgcmV0dXJuO1xuICAgIG1zZy5jbGFzc0xpc3QuYWRkKFwiZGlzcGxheVwiKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IG1zZy5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKSwgMTAwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBoaWRlTm9GaWx0ZXJNc2cgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgbXNnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvbl9fbXNnXCIpO1xuXG4gICAgaWYgKCFtc2cpIHJldHVybjtcblxuICAgIG1zZy5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICBtc2cuY2xhc3NMaXN0LnJlbW92ZShcImRpc3BsYXlcIik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgY2hlY2tOb0ZpbHRlck1zZyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl06bm90KC5oaWRlKVwiKTtcblxuICAgIGl0ZW1zLmxlbmd0aCA9PT0gMFxuICAgICAgPyBzaG93Tm9GaWx0ZXJNc2coKVxuICAgICAgOiBoaWRlTm9GaWx0ZXJNc2coKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBoaWRlRmlsdGVyTGlzdCA9IChmaWx0ZXJMaXN0KSA9PiB7XG4gIHRyeSB7XG4gICAgZmlsdGVyTGlzdC5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZShcImRyb3BwZWRcIik7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpLCAzMDApO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IHNob3dGaWx0ZXJEcm9wID0gKG5vZGUpID0+IHtcbiAgdHJ5IHtcbiAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgc2V0VGltZW91dCgoKSA9PiBub2RlLmNsYXNzTGlzdC5hZGQoXCJkcm9wcGVkXCIpLCAxMCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaGlkZUZpbHRlckRyb3AgPSAobm9kZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGZpbHRlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19faXRlbVwiKSk7XG5cbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIGhpZGVGaWx0ZXJMaXN0KGZpbHRlcnMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjbGVhbmVkRmlsdGVycyA9IGZpbHRlcnMuZmlsdGVyKGZpbHRlciA9PiBmaWx0ZXIgIT09IG5vZGUpO1xuICAgIGhpZGVGaWx0ZXJMaXN0KGNsZWFuZWRGaWx0ZXJzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBpbml0RmlsdGVyc0Ryb3AgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgZml0bGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2xpc3QgLmZpbHRlcnNfX2l0ZW1cIikpO1xuXG4gICAgZml0bGVycy5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgICBmaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpO1xuXG4gICAgICAgIGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgIGhpZGVGaWx0ZXJEcm9wKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZUZpbHRlckRyb3AodGhpcyk7XG4gICAgICAgIHNob3dGaWx0ZXJEcm9wKHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaW5pdEZpbHRlcnNSZXNldCA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdlLWNhdGFsb2dcIik7XG4gICAgaWYgKGlzUGFnZUNhdGFsb2cpIHJldHVybjtcblxuICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWx0ZXJzX19yZXNldCAuZmlsdGVyc19faXRlbVwiKTtcblxuICAgIGlmICghcmVzZXQpIHJldHVybjtcblxuICAgIGNvbnN0IGZpbHRlcmVkU2VjdGlvbiA9IGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpO1xuXG4gICAgcmVzZXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jbG9zZXN0KFwiLmZpbHRlcnNcIik7XG5cbiAgICAgIGNvbnN0IHNpYmxpbmdGaWx0ZXJzID0gY29udGFpbmVyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2xpc3QgLmZpbHRlcnNfX2l0ZW1cIik7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX29wdGlvbnNcIikpO1xuXG4gICAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVycyBpbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJdOm5vdChbdmFsdWU9XFxcInJlc2V0XFxcIl0pXCIpKTtcblxuICAgICAgY29uc3QgY2FyZHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcblxuICAgICAgY29uc3QgZGVsZXRlZFR5cGVzID0gSlNPTi5wYXJzZShkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIltkYXRhLWRlbGV0ZWQtdHlwZXNdXCIpXG4gICAgICAgIC5kYXRhc2V0LmRlbGV0ZWRUeXBlcyk7XG5cbiAgICAgIGhpZGVGaWx0ZXJMaXN0KHNpYmxpbmdGaWx0ZXJzKTtcbiAgICAgIHNwaW5uZXIuc2hvdygpO1xuICAgICAgZmlsdGVyZWRTZWN0aW9uLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChcImZpbHRlcmluZ1wiKSk7XG4gICAgICBvcHRpb25zLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShcImNoZWNrZWRcIikpOyAvLyBoaWRlIHJzZXQgb3B0aW9uIGJ1dHRvblxuICAgICAgY29udHJvbGxlcnMuZm9yRWFjaChjb250cm9sbGVyID0+IGNvbnRyb2xsZXIuY2hlY2tlZCA9IGZhbHNlKTsgLy8gcmVzZXQgYWxsIGlucHV0IGNvbnRyb2xsZXJzXG4gICAgICByZXNldEFsbENvbnRyb2xsZXJzSW5JdGVtcygpO1xuICAgICAgcmVzZXQuY2xvc2VzdChcIi5maWx0ZXJzX19yZXNldFwiKS5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBzaG93IGhpZGRlbiBjYXJkcyBhcyBkZWxldGUgZGF0YS1kaXNwbGF5IGF0dHJpYnV0ZXNcbiAgICAgICAgY2FyZHMuZm9yRWFjaChjYXJkID0+IHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHR5cGUgb2YgZGVsZXRlZFR5cGVzKSB7XG4gICAgICAgICAgICBjYXJkLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7dHlwZX1gKTtcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjaGVja0ZpbHRlcmVkU2VjdGlvbigpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgY2hlY2tGaWx0ZXJlZFNlY3Rpb24gPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2VjdGlvbnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKSk7XG5cbiAgICBzZWN0aW9ucy5mb3JFYWNoKHNlY3Rpb24gPT4ge1xuICAgICAgY29uc3QgZmlsdGVyZWRJdGVtcyA9IEFycmF5LmZyb20oc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XG4gICAgICBjb25zdCBzaG93bkl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiAhaS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpKTtcblxuICAgICAgaWYgKHNob3duSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc3Bpbm5lci5oaWRlKCk7XG4gICAgc2VjdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZmlsdGVyaW5nXCIpKTtcblxuICAgIHNob3dBbmltRWxlbWVudHMoKTtcbiAgICBzZXRBbmltYXRpb25FbG1zKCk7XG4gICAgY2hlY2tOb0ZpbHRlck1zZygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlID0gKG5vZGUpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgbGV0IGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlID0gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVOYW1lLnN0YXJ0c1dpdGgoXCJkYXRhLWRpc3BsYXlcIikpIHtcbiAgICAgICAgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgY2hlY2tGaWx0ZXJlZEl0ZW0gPSAocHJvcCwgdmFsKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaXRlbXMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoaS5kYXRhc2V0LmZpbHRlcik7XG4gICAgICAgIGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGRhdGFbcHJvcF0pO1xuXG4gICAgICAgIGNvbnN0IGlzTWF0Y2hlZCA9IGlzQXJyYXlcbiAgICAgICAgICA/IGRhdGFbcHJvcF0uaW5jbHVkZXModmFsKVxuICAgICAgICAgIDogZGF0YVtwcm9wXSA9PT0gdmFsO1xuXG5cbiAgICAgICAgaWYgKGlzTWF0Y2hlZCkge1xuICAgICAgICAgIGkucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWApO1xuICAgICAgICAgIGlmICghaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUoaSkpIGkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaS5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgICBpLnNldEF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja0ZpbHRlcmVkU2VjdGlvbigpO1xuICAgICAgfSk7XG4gICAgfSwgMTAwMCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgYWN0aXZlQ29sb3JJbkl0ZW0gPSAodmFsKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdGFyZ2V0LXR5cGU9XCIke3ZhbH1cIl1gKSk7XG5cbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4gaS5jbGljaygpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBpbml0RmlsdGVyU2VsZWN0ID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtY2F0YWxvZ1wiKTtcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuO1xuXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzIGlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl06bm90KFt2YWx1ZT1cXFwicmVzZXRcXFwiXSlcIikpO1xuXG4gICAgY29uc3QgZmlsdGVyZWRTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpO1xuXG4gICAgY29uc3QgcmVzZXRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbHRlcnNfX3Jlc2V0XCIpO1xuXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGZpbHRlcmVkU2VjdGlvbi5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoXCJmaWx0ZXJpbmdcIikpO1xuICAgICAgc3Bpbm5lci5zaG93KCk7XG4gICAgICBjaGVja0ZpbHRlcmVkSXRlbSh0aGlzLm5hbWUsIHRoaXMudmFsdWUpO1xuICAgICAgYWN0aXZlQ29sb3JJbkl0ZW0odGhpcy52YWx1ZSk7XG4gICAgICB0aGlzLmNsb3Nlc3QoXCIuZmlsdGVyc19fb3B0aW9uc1wiKS5jbGFzc0xpc3QuYWRkKFwiY2hlY2tlZFwiKTtcbiAgICAgIHJlc2V0QnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgcmVtb3ZlRGF0YUZpbHRlckF0dHJpYnV0ZSA9IChwcm9wKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtZGlzcGxheS0ke3Byb3B9XWApKTtcblxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiB7XG4gICAgICBpLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBjaGVja0FsbEl0ZW1zSGFzRGlzcGxheUF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xuXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IHtcbiAgICAgIGlmICghaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUoaSkpIHtcbiAgICAgICAgaS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCByZXNldEFsbENvbnRyb2xsZXJzQnlOYW1lID0gKG5hbWUpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9JHtuYW1lfV1gKSk7XG4gICAgaXRlbXMuZm9yRWFjaChpID0+IGkuY2hlY2tlZCA9IGZhbHNlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCByZXNldEFsbENvbnRyb2xsZXJzSW5JdGVtcyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0YWJMaXN0cyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRzLXNlcmllc19fY29udHJvbHNcIikpO1xuXG4gICAgdGFiTGlzdHMuZm9yRWFjaChsaXN0ID0+IHtcbiAgICAgIGxpc3QucXVlcnlTZWxlY3RvcihcIi5jYXJkcy1zZXJpZXNfX3RhYlwiKT8uY2xpY2soKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBjaGVja0FsbEZpbHRlclJlc2V0QnRuID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlzQ2hlY2tlZEZpbHRlciA9IGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19saXN0IGlucHV0OmNoZWNrZWRcIik7XG5cbiAgICBjb25zdCByZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyc19fcmVzZXRcIik7XG5cbiAgICBpc0NoZWNrZWRGaWx0ZXIubGVuZ3RoID09PSAwXG4gICAgICA/IHJlc2V0LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKVxuICAgICAgOiByZXNldC5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaW5pdFJlc2V0RmlsdGVyUHJvcCA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdlLWNhdGFsb2dcIik7XG4gICAgaWYgKGlzUGFnZUNhdGFsb2cpIHJldHVybjtcblxuICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVycyBpbnB1dFt2YWx1ZT1cXFwicmVzZXRcXFwiXVwiKSk7XG4gICAgY29uc3Qgc2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIik7XG5cbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgc2VjdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKFwiZmlsdGVyaW5nXCIpKTtcbiAgICAgIHNwaW5uZXIuc2hvdygpO1xuICAgICAgdGhpcy5jbG9zZXN0KFwiLmZpbHRlcnNfX29wdGlvbnNcIikuY2xhc3NMaXN0LnJlbW92ZShcImNoZWNrZWRcIik7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICByZW1vdmVEYXRhRmlsdGVyQXR0cmlidXRlKHRoaXMubmFtZSk7XG4gICAgICAgIGNoZWNrQWxsSXRlbXNIYXNEaXNwbGF5QXR0cmlidXRlcygpO1xuICAgICAgICBjaGVja0ZpbHRlcmVkU2VjdGlvbigpO1xuICAgICAgICByZXNldEFsbENvbnRyb2xsZXJzQnlOYW1lKHRoaXMubmFtZSk7XG4gICAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zKCk7XG4gICAgICAgIGNoZWNrQWxsRmlsdGVyUmVzZXRCdG4oKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH0pKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICB0cnkge1xuICAgIGluaXRGaWx0ZXJzRHJvcCgpO1xuICAgIGluaXRGaWx0ZXJzUmVzZXQoKTtcbiAgICBpbml0RmlsdGVyU2VsZWN0KCk7XG4gICAgaW5pdFJlc2V0RmlsdGVyUHJvcCgpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn0pOyIsImNsYXNzIEluZm9ybWVyIHtcclxuICAgIHN0YXRpYyBfaW5zdGFuY2VzXHJcblxyXG4gICAgc3RhdGljIGdldEluc3RhbmNlcygpIHtcclxuICAgICAgICBpZiAoIUluZm9ybWVyLl9pbnN0YW5jZXMpIHtcclxuICAgICAgICAgICAgSW5mb3JtZXIuX2luc3RhbmNlcyA9IG5ldyBJbmZvcm1lcigpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBJbmZvcm1lci5faW5zdGFuY2VzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvcm1lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb3JtZXJcIilcclxuICAgICAgICBpZiAoIXRoaXMuaW5mb3JtZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi0J3QsCDRgdGC0YDQsNC90LjRhtC1INC+0YLRgdGD0YLRgdGC0LLRg9C10YIgaHRtbCDQvtCx0LXRgNGC0LrQsCDQtNC70Y8g0JjQvdGE0L7RgNC80LXRgNCwXCIpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluZm9ybWVyQm9keSA9IHRoaXMuaW5mb3JtZXIucXVlcnlTZWxlY3RvcihcIi5pbmZvcm1lcl9fYm9keVwiKVxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJCYWNrID0gdGhpcy5pbmZvcm1lci5xdWVyeVNlbGVjdG9yKFwiLmluZm9ybWVyX19iYWNrXCIpXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckNsb3NlID0gdGhpcy5pbmZvcm1lci5xdWVyeVNlbGVjdG9yKFwiLmluZm9ybWVyX19jbG9zZVwiKVxyXG4gICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICB9XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNwYW5bZGF0YS10ZXJtXVwiKSlcclxuICAgICAgICB0aGlzLmluaXRFdmVudExpc3RlbmVycygpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBpbml0RXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhpcy5idG5zLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmdldEluZm9ybWF0aW9uKGJ0bi5kYXRhc2V0LnRlcm0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJhY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuaGlkZUluZm9ybWVyKCkpXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmhpZGVJbmZvcm1lcigpKVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGdldEluZm9ybWF0aW9uKHRlcm0pIHtcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93KClcclxuXHJcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInRlcm1cIiwgdGVybSlcclxuXHJcbiAgICAgICAgY29uc3QgcmVzID0gREVWX01PREUgP1xyXG4gICAgICAgICAgICBhd2FpdCBmZXRjaChcImh0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvaW5mb3JtLmh0bWxcIikgOlxyXG4gICAgICAgICAgICBhd2FpdCBmZXRjaChcIi9hcGkvdGVybVwiLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgYm9keTogZm9ybURhdGFcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gYXdhaXQgcmVzLnRleHQoKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUluZm9ybWVyQ29udGVudChodG1sKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcItCd0LUg0YPQtNCw0LvQvtGB0Ywg0L/QvtC70YPRh9C40YLRjCDQuNC90YTQvtGA0LzQsNGG0LjRjiDQtNC70Y8g0KLQtdGA0LzQuNC90LBcIiwgdGVybSlcclxuICAgICAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3Bpbm5lci5oaWRlLCAzMDApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUluZm9ybWVyQ29udGVudChkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgaW5mb3JtZXJDb250ZW50ID0gdGhpcy5pbmZvcm1lci5xdWVyeVNlbGVjdG9yKFwiLmluZm9ybWVyX19jb250ZW50XCIpXHJcblxyXG4gICAgICAgIHdoaWxlIChpbmZvcm1lckNvbnRlbnQuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICBpbmZvcm1lckNvbnRlbnQucmVtb3ZlQ2hpbGQoaW5mb3JtZXJDb250ZW50LmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbmZvcm1lckNvbnRlbnQuaW5uZXJIVE1MID0gZGF0YVxyXG4gICAgICAgIHRoaXMuc2hvd0luZm9ybWVyKClcclxuICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zcGlubmVyLmhpZGUsIDMwMClcclxuICAgIH1cclxuXHJcbiAgICBzaG93SW5mb3JtZXIoKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvcm1lci5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbmZvcm1lckJhY2suY2xhc3NMaXN0LmFkZChcInZpc2libGVcIilcclxuICAgICAgICAgICAgdGhpcy5pbmZvcm1lckJvZHkuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIilcclxuICAgICAgICB9LCAxMDApXHJcbiAgICB9XHJcblxyXG4gICAgaGlkZUluZm9ybWVyKCkge1xyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJCYWNrLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJvZHkuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIilcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmluZm9ybWVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpLCA1MDApXHJcbiAgICB9XHJcbn1cclxud2luZG93LmluaXRJbmZvcm1lcnMgPSAoKSA9PiBJbmZvcm1lci5nZXRJbnN0YW5jZXMoKS5pbml0KClcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHdpbmRvdy5pbmZvcm1lciA9IHdpbmRvdy5pbml0SW5mb3JtZXJzKCkpIiwiY29uc3QgaW5pdE1vZGFsID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWxdJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmRhdGFzZXQubW9kYWxUYXJnZXRcclxuICAgICAgICBjb25zdCBhY3Rpb24gPSB0aGlzLmRhdGFzZXQubW9kYWxBY3Rpb25cclxuXHJcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSAnc2hvdyc6XHJcbiAgICAgICAgICAgICAgICBzaG93TW9kYWxCYWNrKClcclxuICAgICAgICAgICAgICAgIHNob3dNb2RhbERpYWxvZyh0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAndG9nZ2xlJzpcclxuICAgICAgICAgICAgICAgIHRvZ2dsZU1vZGFsRGlhbG9nKHRhcmdldClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdjbG9zZSc6XHJcbiAgICAgICAgICAgICAgICBoaWRlTW9kYWxEaWFsb2coKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChoaWRlTW9kYWxCYWNrLCAyMDApXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KSlcclxufVxyXG5cclxuY29uc3Qgc2hvd01vZGFsQmFjayA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2JhY2snKVxyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNib2R5JylcclxuXHJcbiAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpLCAxMClcclxufVxyXG5cclxuY29uc3QgaGlkZU1vZGFsQmFjayA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2JhY2snKVxyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNib2R5JylcclxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNoZWFkZXInKVxyXG5cclxuICAgIGlmICghYmFjaykgcmV0dXJuXHJcblxyXG4gICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJylcclxuICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcbiAgICBoZWFkZXIuc3R5bGUudHJhbnNpdGlvbiA9ICdub25lJ1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJhY2suY2xhc3NMaXN0LmFkZCgnaGlkZScpXHJcbiAgICAgICAgaGVhZGVyLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgIH0sIDEwMClcclxufVxyXG5cclxuY29uc3Qgc2hvd01vZGFsRGlhbG9nID0gKGlkKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxyXG4gICAgY29uc3QgZGlhbG9nID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICAgICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgfSwgMTApXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVNb2RhbERpYWxvZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC5zaG93JylcclxuICAgIGlmICghdGFyZ2V0KSByZXR1cm5cclxuXHJcbiAgICBjb25zdCBkaWFsb2cgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsX19kaWFsb2cnKVxyXG5cclxuICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuICAgIGRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKSwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2xvc2VNb2RhbCA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBjb25zdCBpc09uUG9wdXBNb2RhbCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICAgICAgaWYoaXNPblBvcHVwTW9kYWwpIHJldHVyblxyXG5cclxuICAgICAgICBoaWRlTW9kYWxEaWFsb2coKVxyXG4gICAgICAgIHNldFRpbWVvdXQoaGlkZU1vZGFsQmFjaywgMjAwKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgdG9nZ2xlTW9kYWxEaWFsb2cgPSAoaWQpID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXHJcbiAgICBjb25zdCBkaWFsb2cgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsX19kaWFsb2cnKVxyXG5cclxuICAgIGhpZGVNb2RhbERpYWxvZygpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpLCAyMDApXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICAgICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgfSwgMzAwKVxyXG59XHJcblxyXG5jb25zdCBpbml0VG9nZ2xlVmlzaWJsZVBhc3MgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWxfX3RvZ2dsZS12aXNpYmxlLXBhc3MnKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcbiAgICAgICAgY29uc3QgaXNUZXh0ID0gaW5wdXQudHlwZSA9PT0gJ3RleHQnXHJcblxyXG4gICAgICAgIGlucHV0LnR5cGUgPSBpc1RleHQgPyAncGFzc3dvcmQnIDogJ3RleHQnXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzLXZpc2libGUnKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbmNvbnN0IHNob3dNb2RhbCA9IChpZCkgPT4ge1xyXG4gICAgc2hvd01vZGFsQmFjaygpXHJcbiAgICBzaG93TW9kYWxEaWFsb2coaWQpXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdE1vZGFsKClcclxuICAgIGluaXRDbG9zZU1vZGFsKClcclxuICAgIGluaXRUb2dnbGVWaXNpYmxlUGFzcygpXHJcbn0pIiwiLy8gUHJvZHVjdCBpbmZvcm1hdGlvbiBzbGlkZXJcclxubGV0IHByb2R1Y3RJbmZvU2xpZGVyXHJcblxyXG5jb25zdCBpbml0UHJvZHVjdEluZm9TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBwcm9kdWN0SW5mb1NsaWRlciA9IG5ldyBTd2lwZXIoJy5wcm9kdWN0LWluZm8gLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAvLyBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuXHJcbiAgICAgICAgLy8gYXV0b0hlaWdodDogdHJ1ZSxcclxuICAgICAgICAvLyBzcGFjZUJldHdlZW46IDEwLFxyXG5cclxuICAgICAgICBzY3JvbGxiYXI6IHtcclxuICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXNjcm9sbGJhcicsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDU3Njoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgY2hlY2tQcm9kdWN0SW5mb1NsaWRlciA9ICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDk5MSkge1xyXG4gICAgICAgIGlmIChwcm9kdWN0SW5mb1NsaWRlcikge1xyXG4gICAgICAgICAgICBwcm9kdWN0SW5mb1NsaWRlci5kZXN0cm95KHRydWUsIHRydWUpXHJcbiAgICAgICAgICAgIHByb2R1Y3RJbmZvU2xpZGVyID0gdW5kZWZpbmVkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJvZHVjdEluZm9TbGlkZXIpIHtcclxuICAgICAgICBpbml0UHJvZHVjdEluZm9TbGlkZXIoKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGNvbnN0IGlzUHJvZHVjdFBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1wcm9kdWN0JylcclxuICAgIGNvbnN0IGlzQXJ0aWNsZVBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1hcnRpY2xlJylcclxuICAgIGNvbnN0IGlzRG90c1BhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1kb3RzJylcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEluZm8gc2xpZGVyIG9ubHkgZm9yIFByb2R1Y3QsIEFydGljbGUgYW5kIERvdHMgcGFnZXNcclxuICAgIGlmICghaXNQcm9kdWN0UGFnZSAmJiAhaXNBcnRpY2xlUGFnZSAmJiAhaXNEb3RzUGFnZSkgcmV0dXJuXHJcblxyXG4gICAgY2hlY2tQcm9kdWN0SW5mb1NsaWRlcigpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyKClcclxuICAgIH0pXHJcbn0pXHJcbiIsIi8vIFByb2R1Y3QgcmVjb21tZW5kYXRpb24gc2xpZGVyXHJcbmxldCBwcm9kdWN0UmVjb21tU2xpZGVyXHJcblxyXG5jb25zdCBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhciA9IChzd2lwZXIsIHNjcm9sbGJhcikgPT4ge1xyXG4gICAgaWYgKCFzY3JvbGxiYXIgfHwgc2Nyb2xsYmFyLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgaXNTY3JvbGxiYXJIaWRlID0gc2Nyb2xsYmFyLmNsYXNzTGlzdFxyXG4gICAgICAgIC5jb250YWlucygnc3dpcGVyLXNjcm9sbGJhci1sb2NrJylcclxuXHJcbiAgICBpc1Njcm9sbGJhckhpZGVcclxuICAgICAgICA/IHN3aXBlci5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtaGlkZGVuJylcclxuICAgICAgICA6IHN3aXBlci5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtaGlkZGVuJylcclxufVxyXG5cclxuY29uc3QgY2hlY2tTbGlkZXJzQm90dG9tT2Zmc2V0ID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc3dpcGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlcicpKVxyXG5cclxuICAgIHN3aXBlcnMuZm9yRWFjaChzd2lwZXIgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbGJhciA9IHN3aXBlci5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNjcm9sbGJhcicpXHJcbiAgICAgICAgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIoc3dpcGVyLCBzY3JvbGxiYXIpXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBpbml0UHJvZHVjdFJlY29tbVNsaWRlciA9ICgpID0+IHtcclxuICAgIHByb2R1Y3RSZWNvbW1TbGlkZXIgPSBuZXcgU3dpcGVyKCcucmVjb21tZW5kYXRpb25fX3NsaWRlciAuc3dpcGVyJywge1xyXG4gICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgIC8vIGF1dG9IZWlnaHQ6IHRydWUsXHJcblxyXG4gICAgICAgIHNjcm9sbGJhcjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItc2Nyb2xsYmFyJyxcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICAgICAgNTc2OiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIDk5MToge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDEyMDA6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3dpcGVyID0gdGhpcy5lbFxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2Nyb2xsYmFyID0gdGhpcy5zY3JvbGxiYXIuZWxcclxuICAgICAgICAgICAgICAgIGNoZWNrUmVjb21tU2xpZGVyU2Nyb2xsYmFyKHN3aXBlciwgc2Nyb2xsYmFyKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgY2hlY2tQcm9kdWN0UmVjb21tU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gMTIwMCAmJiBwcm9kdWN0UmVjb21tU2xpZGVyKSB7XHJcbiAgICAgICAgQXJyYXkuaXNBcnJheShwcm9kdWN0UmVjb21tU2xpZGVyKVxyXG4gICAgICAgICAgICA/IHByb2R1Y3RSZWNvbW1TbGlkZXIuZm9yRWFjaChzbGlkZXIgPT4gc2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSkpXHJcbiAgICAgICAgICAgIDogcHJvZHVjdFJlY29tbVNsaWRlci5kZXN0cm95KHRydWUsIHRydWUpXHJcblxyXG4gICAgICAgIHByb2R1Y3RSZWNvbW1TbGlkZXIgPSB1bmRlZmluZWRcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXByb2R1Y3RSZWNvbW1TbGlkZXIpIHtcclxuICAgICAgICBpbml0UHJvZHVjdFJlY29tbVNsaWRlcigpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgaXNQcm9kdWN0UGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLXByb2R1Y3QnKVxyXG4gICAgY29uc3QgaXNBcnRpY2xlUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWFydGljbGUnKVxyXG4gICAgY29uc3QgaXNEb3RzUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWRvdHMnKVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgUmVjb21tZW5kYXRpb24gc2xpZGVyIG9ubHkgZm9yIFByb2R1Y3QsIEFydGljbGUgYW5kIERvdHMgcGFnZXNcclxuICAgIGlmICghaXNQcm9kdWN0UGFnZSAmJiAhaXNBcnRpY2xlUGFnZSAmJiAhaXNEb3RzUGFnZSkgcmV0dXJuXHJcblxyXG4gICAgY2hlY2tQcm9kdWN0UmVjb21tU2xpZGVyKClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlcigpXHJcbiAgICAgICAgY2hlY2tTbGlkZXJzQm90dG9tT2Zmc2V0KClcclxuICAgIH0pXHJcbn0pXHJcbiIsImNvbnN0IHNob3dCdXR0b25TY3JvbGxUb1RvcCA9IChidXR0b24pID0+IHtcclxuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFlcclxuXHJcbiAgICBpZiAoc2Nyb2xsVG9wID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGluaXRTY3JvbGxUb1RvcCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JvbGxUb1RvcCcpXHJcblxyXG4gICAgaWYgKCFidXR0b24pIHJldHVyblxyXG5cclxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHNtb290aFNjcm9sbFRvKDApKVxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHNob3dCdXR0b25TY3JvbGxUb1RvcChidXR0b24pKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRTY3JvbGxUb1RvcCgpXHJcbn0pIiwiLyoqXHJcbiAqIFNob3cgYSBzbWFsbCBtZXNzYWdlIHdpdGggdGl0bGUgYW5kIHRleHQgaW4gdGhlIHRvcCByaWdodCBjb3JuZXIgb2YgdGhlIHNjcmVlbi5cclxuICogVGhlIG1ldGhvZCBleHBlY3RzIGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXIgcGVyIGlucHV0LlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3RpdGxlPXVuZGVmaW5lZF0gLSBUaGUgaGVhZGxpbmUgb2YgdGhlIG1lc3NhZ2UgaW4gb25lIGxpbmUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZT11bmRlZmluZWRdIC0gT25lIGxpbmUgbWVzc2FnZSB0ZXh0LlxyXG4gKi9cclxud2luZG93LnNob3dNb2RhbE1zZyA9IGZ1bmN0aW9uKHRpdGxlID0gJycsIG1lc3NhZ2UgPSAnJykge1xyXG4gICAgaWYgKCF0aXRsZSAmJiAhbWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSdzIG5vIHRpdGxlIG9yIG1lc3NhZ2UgZm9yIHNob3dpbmcgaW4gbW9kYWwgd2luZG93LlwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgdGl0bGUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkluY29ycmVjdCB0eXBlIG9mIHRpdGxlLiBJdCBzaG91bGQgYmUgc3RyaW5nLlwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgbWVzc2FnZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW5jb3JyZWN0IHR5cGUgb2YgbWVzc2FnZS4gSXQgc2hvdWxkIGJlIHN0cmluZy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tc2ctY29udGFpbmVyJylcclxuICAgIGNvbnN0IFtjYXJkLCBib2R5XSA9IGNyZWF0ZU1vZGFsTXNnQ2FyZCh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FyZClcclxuICAgIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKVxyXG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGNhcmQuY2xhc3NMaXN0LmFkZCgndW5jb2xsYXBzZWQnKSwgNTApXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuICAgIH0sIDEwMClcclxuXHJcbiAgICBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSwgNTAwMClcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21zZy1jb250YWluZXInKVxyXG4gICAgY29uc3QgaW5uZXJFbG1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1tc2dfX2NhcmQnKVxyXG5cclxuICAgIGlubmVyRWxtcy5sZW5ndGggPiAwXHJcbiAgICAgICAgPyBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcbiAgICAgICAgOiBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU1vZGFsTXNnQ2FyZCh0aXRsZSwgbWVzc2FnZSkge1xyXG4gICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW1zZ19fY2FyZCcpXHJcblxyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW1zZ19fYm9keScpXHJcblxyXG4gICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgY29udGVudC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2NvbnRlbnQnKVxyXG5cclxuICAgIGNvbnN0IGNhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcclxuICAgIGNhcHRpb24udGV4dENvbnRlbnQgPSB0aXRsZVxyXG5cclxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIHRleHQudGV4dENvbnRlbnQgPSBtZXNzYWdlXHJcblxyXG4gICAgaWYgKHRpdGxlKSBjb250ZW50LmFwcGVuZENoaWxkKGNhcHRpb24pXHJcbiAgICBpZiAobWVzc2FnZSkgY29udGVudC5hcHBlbmRDaGlsZCh0ZXh0KVxyXG5cclxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoaWNvbilcclxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoY29udGVudClcclxuXHJcbiAgICBjYXJkLmFwcGVuZENoaWxkKGJvZHkpXHJcblxyXG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhpZGVNb2RhbE1zZ0hhbmRsZXIpXHJcblxyXG4gICAgcmV0dXJuIFtjYXJkLCBib2R5XVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTW9kYWxNc2dIYW5kbGVyKCkge1xyXG4gICAgY29uc3QgY2FyZCA9IHRoaXNcclxuICAgIGNvbnN0IGJvZHkgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1tc2dfX2JvZHknKVxyXG4gICAgaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHkpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5LCB0aW1lb3V0ID0gMCkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxyXG4gICAgfSwgdGltZW91dClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnLCAnaGlkZGVuJylcclxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3VuY29sbGFwc2VkJylcclxuICAgIH0sIHRpbWVvdXQgKyAxMDApXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY2FyZC5yZW1vdmUoKTtcclxuICAgICAgICBjaGVja01vZGFsTXNnQ29udGFpbmVyKClcclxuICAgIH0sIHRpbWVvdXQgKyAyMDApXHJcbn1cclxuIiwiY29uc3Qgc2hvd1NwaW5uZXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJylcbiAgICBzcGlubmVyLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyksIDEwMClcbn1cblxuY29uc3QgaGlkZVNwaW5uZXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJylcbiAgICBzcGlubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5JyksIDEwMDApXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpKSB7XG4gICAgICAgIHdpbmRvdy5zcGlubmVyLnNob3cgPSBzaG93U3Bpbm5lclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlID0gaGlkZVNwaW5uZXJcbiAgICB9XG59KSIsIiIsIi8vIE9wZW4gYW5kIGNsb3NlIG1vYmlsZSBuYXZpZ2F0aW9uXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBuYXZDbG9zZSA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNsb3NlJykpXHJcbiAgICBjb25zdCBuYXZUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3Rlcl9fbmF2LWxpbmtfbWVudScpXHJcbiAgICBjb25zdCBoZWFkZXJOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYnKVxyXG4gICAgY29uc3QgbW9kYWxCYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbW9kYWwtYmFjaycpXHJcbiAgICBjb25zdCBuYXZQcm9kTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1saW5rX3Byb2R1Y3QnKVxyXG4gICAgY29uc3QgbmF2SXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKSlcclxuICAgIGNvbnN0IG5hdkxpbmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtbGluaycpKVxyXG4gICAgY29uc3QgbmF2Q29sbGFwc2VzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKSlcclxuXHJcbiAgICBpZiAoIW5hdlRvZ2dsZXIpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdiA9IChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAvLyBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG5hdlByb2RMaW5rLmNsaWNrKClcclxuICAgICAgICAgICAgfSwgMTAwKVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcbiAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBidXJnZXJcclxuICAgIG5hdlRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZU5hdihmYWxzZSlcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b2dnbGVOYXYodHJ1ZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBjbG9zZSBidXR0b25cclxuICAgIG5hdkNsb3NlLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PnRvZ2dsZU5hdihmYWxzZSkpXHJcbiAgICB9KVxyXG5cclxuICAgIG1vZGFsQmFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICB0b2dnbGVOYXYoZmFsc2UpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE9wZW4gYW5kIGNsb3NlIE5hdmlnYXRpb24gaXRlbXNcclxuICAgIGNvbnN0IGNvbGxhcHNBbGxOYXZJdGVtID0gKCkgPT4ge1xyXG4gICAgICAgIG5hdkl0ZW1zLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKSlcclxuICAgICAgICBuYXZMaW5rcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxuICAgICAgICBuYXZDb2xsYXBzZXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdkl0ZW0gPSAoYnRuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcblxyXG4gICAgICAgIGlmICghaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBjb25zdCBuYXZJdGVtID0gYnRuLmNsb3Nlc3QoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKVxyXG5cclxuICAgICAgICAgICAgaWYgKG5hdkl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hdkNvbGxhcHNlID0gbmF2SXRlbS5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKVxyXG5cclxuICAgICAgICAgICAgICAgIG5hdkl0ZW0uY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgICAgICBuYXZDb2xsYXBzZS5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZMaW5rcy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZU5hdkl0ZW0odGhpcylcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFNlYXJjaGluZyBhbmQgU3RpY2t5IGhlYWRlclxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXHJcbiAgICBjb25zdCBzZWFyY2hUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1jbG9zZScpXHJcbiAgICBjb25zdCBzZWFyY2hQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1pbnB1dCcpXHJcbiAgICBjb25zdCBzZWFyY2hSZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1yZXNldCcpXHJcbiAgICBjb25zdCBzZWFyY2hIaW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1oaW50cycpXHJcblxyXG4gICAgaWYgKCFzZWFyY2hUb2dnbGVyKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCB0b2dnbGVTZWFyY2hQYW5lbCA9IChoaWRlID0gZmFsc2UpID0+IHtcclxuICAgICAgICBjb25zdCBpc1Zpc2libGUgPSBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSAxMDBcclxuXHJcbiAgICAgICAgaWYgKCFpc1Zpc2libGUgJiYgIWhpZGUpIHtcclxuICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZScpXHJcbiAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfd2l0aC1zZWFyY2gtcGFuZWwnKVxyXG4gICAgICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoUmVzZXQuY2xpY2soKVxyXG4gICAgICAgICAgICByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJylcclxuICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl93aXRoLXNlYXJjaC1wYW5lbCcpXHJcbiAgICAgICAgfSwgMjAwKVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaFRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgfSlcclxuXHJcbiAgICBzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCgpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL3NlYXJjaC5qc29uJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVzdC10ZWNobm9saWdodHYyLm1hc3NpdmUucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG5cclxuICAgIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICcvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVjaG5vbGlnaHQubGlnaHRvcHQucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgY29uc3QgVEhST1RUTEVfVElNRU9VVCA9IDMwMFxyXG4gICAgbGV0IHNlYXJjaFJlcXVlc3RUaW1lb3V0SWRcclxuXHJcbiAgICBjb25zdCBzZXRTdHJvbmdUZXh0ID0gKHN0ciwgcXVlcnkpID0+IHtcclxuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAocXVlcnksICdnaScpXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4LCBgPHN0cm9uZz4kJjwvc3Ryb25nPmApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJpbnRRdWVyeVJlc3VsdCA9IChkYXRhLCBxdWVyeSkgPT4ge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0J/QvtC70YPRh9C40LvQuCDQv9C+0LjRgdC60L7QstGD0Y4g0LLRi9C00LDRh9GDJywgZGF0YSk7XHJcblxyXG4gICAgICAgIC8vIFJlc2V0IGFsbCBjaGlsZHJlbiBub2RlcyBvZiBzZWFyY2ggaGludHNcclxuICAgICAgICB3aGlsZSAoc2VhcmNoSGludHMuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5yZW1vdmVDaGlsZChzZWFyY2hIaW50cy5maXJzdENoaWxkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGxpbmssIHNpbWlsYXIgb3IgTm8gUmVzdWx0XHJcbiAgICAgICAgY29uc3QgbGlua3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIGxpbmtzLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fc2VhcmNoLWxpbmtzJylcclxuXHJcbiAgICAgICAgY29uc3Qgc2ltaWxhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgc2ltaWxhci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX3NlYXJjaC1zaW1pbGFyJylcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIE5vIHJlc3VsdHNcclxuICAgICAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ25vLXJlc3VsdHMnKVxyXG4gICAgICAgICAgICBzcGFuLmlubmVyVGV4dCA9ICfQn9C+INCS0LDRiNC10LzRgyDQt9Cw0L/RgNC+0YHRgyDQvdC40YfQtdCz0L4g0L3QtSDQvdCw0LnQtNC10L3QvidcclxuICAgICAgICAgICAgbGlua3MuYXBwZW5kQ2hpbGQoc3BhbilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMaW5rc1xyXG4gICAgICAgICAgICBjb25zdCBoaW50ID0gZGF0YVswXVxyXG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcbiAgICAgICAgICAgIGxpbmsuaHJlZiA9IGhpbnQudXJsXHJcbiAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2V0U3Ryb25nVGV4dChoaW50LnRpdGxlLCBxdWVyeSlcclxuICAgICAgICAgICAgbGlua3MuYXBwZW5kQ2hpbGQobGluaylcclxuXHJcbiAgICAgICAgICAgIC8vIFNpbWlsYXJcclxuICAgICAgICAgICAgc2ltaWxhci5pbm5lckhUTUwgPSAnPGg1PtGB0LzQvtGC0YDQuNGC0LUg0L/QvtGF0L7QttC40LU8L2g1PidcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbnVtIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudW0gPCAxKSBjb250aW51ZVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIExpbmtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhpbnQgPSBkYXRhW251bV1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcclxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IGhpbnQudXJsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSW1hZ2VcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBpY1NwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICAgICAgICAgIHBpY1NwYW4uY2xhc3NMaXN0LmFkZCgncGljJylcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IGhpbnQuaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltZy5hbHQgPSBoaW50LnRpdGxlXHJcbiAgICAgICAgICAgICAgICBwaWNTcGFuLmFwcGVuZENoaWxkKGltZylcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUZXh0XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAgICAgdGV4dFNwYW4uY2xhc3NMaXN0LmFkZCgndGV4dCcpXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3Bhbi5pbm5lckhUTUwgPSBzZXRTdHJvbmdUZXh0KGhpbnQudGl0bGUsIHF1ZXJ5KVxyXG5cclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQocGljU3BhbilcclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQodGV4dFNwYW4pXHJcbiAgICAgICAgICAgICAgICBzaW1pbGFyLmFwcGVuZENoaWxkKGxpbmspXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG51bSA+IDYpIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKGxpbmtzKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKHNpbWlsYXIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQndGD0LbQvdC+INGC0L7Qu9GM0LrQviDQtNC70Y8g0L/QvtC70L3QvtCz0L4g0LzQtdC90Y5cclxuICAgICAgICAvLyBzZXRIYW5kbGVyVG9IZWxwZXJzKClcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZldGNoU2VhcmNoaW5nRGF0YSA9IGFzeW5jKHF1ZXJ5KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goU0VBUkNIX1JFUVVFU1RfVVJMICsgYD9xdWVyeT0ke3F1ZXJ5fWApXHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlcy5vaykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LfQsNC/0YDQvtGB0LAg0L/QvtC40YHQutCwJylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICAgICAgcHJpbnRRdWVyeVJlc3VsdChkYXRhLCBxdWVyeSlcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gJycgKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gU1RBUlRcclxuICAgICAgICBjbGVhclRpbWVvdXQoc2VhcmNoUmVxdWVzdFRpbWVvdXRJZClcclxuICAgICAgICBzZWFyY2hSZXF1ZXN0VGltZW91dElkID0gc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gZmV0Y2hTZWFyY2hpbmdEYXRhKHRoaXMudmFsdWUpLFxyXG4gICAgICAgICAgICBUSFJPVFRMRV9USU1FT1VUXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gRklOSVNIXHJcbiAgICB9KVxyXG5cclxuICAgIHNlYXJjaFJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycygpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJylcclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBjb25zdCBpc1NlYXJjaFRvZ2dsZSA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuaGVhZGVyX19idXR0b25zLWxpbmtfc2VhcmNoJylcclxuXHJcbiAgICAgICAgY29uc3QgaXNTZWFyY2hQYW5lbCA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuaGVhZGVyX19zZWFyY2gnKVxyXG5cclxuICAgICAgICBjb25zdCBpc1RhY2hEZXZpY2UgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDk5MlxyXG5cclxuICAgICAgICBpZiAoIWlzVGFjaERldmljZSAmJiAhaXNTZWFyY2hQYW5lbCAmJiAhaXNTZWFyY2hUb2dnbGUpIHtcclxuICAgICAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwodHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFNldCBoZWxwIHRleHQgZnJvbSBoZWxwZXIgYnV0dG9uIHVuZGVyIHRoZSBzZWFyY2ggaW5wdXQgdG8gdGhlIHNlYXJjaCB2YWx1ZVxyXG4gICAgY29uc3QgcmVxdWVzdENvbXBsZXRpb24gPSAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFkZGl0aW9uVmFsdWUgPSBlLnRhcmdldC5pbm5lclRleHRcclxuICAgICAgICBzZWFyY2hJbnB1dC52YWx1ZSA9IGAke3NlYXJjaElucHV0LnZhbHVlfSAke2FkZGl0aW9uVmFsdWV9YFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEhhbmRsZXJUb0hlbHBlcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoSGVscGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX3NlYXJjaC1oZWxwcyBzcGFuJykpXHJcblxyXG4gICAgICAgIHNlYXJjaEhlbHBlcnMuZm9yRWFjaChidG4gPT4gYnRuXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlcXVlc3RDb21wbGV0aW9uKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEhlbHBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19zZWFyY2gtaGVscHMgc3BhbicpKVxyXG5cclxuICAgICAgICBzZWFyY2hIZWxwZXJzLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgYnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVxdWVzdENvbXBsZXRpb24pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGlja3kgaGVhZGVyXHJcbiAgICBsZXQgYmVmb3JlU2Nyb2xsVG9wID0gMFxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkZXJcIilcclxuICAgICAgICBjb25zdCBoZWFkZXJIZWlnaHQgPSBoZWFkZXIuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgY29uc3QgZGVsYXkgPSAnLjdzJ1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDk5MSkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdjb21wcmVzc2VkJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbXByZXNzZWQnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50U2Nyb2xsVG9wID4gMTAwICYmIGN1cnJlbnRTY3JvbGxUb3AgPiBiZWZvcmVTY3JvbGxUb3ApIHtcclxuICAgICAgICAgICAgY29uc3QgaXNWaXNpYmxlU2VhcmNoID0gc2VhcmNoUGFuZWxcclxuICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICAgICAgbGV0IGludGVydmFsSWRcclxuXHJcbiAgICAgICAgICAgIGlmIChpc1Zpc2libGVTZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwodHJ1ZSlcclxuICAgICAgICAgICAgICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9ICcwcydcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXIuc3R5bGUudG9wID0gYC0ke2hlYWRlckhlaWdodH1weGBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBoZWFkZXIuc3R5bGUudG9wID0gMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmVmb3JlU2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICB9KTtcclxufSlcclxuXHJcbi8vIENhcnQgdXBkYXRlIGxpc3RlbmluZ1xyXG5jb25zdCBzZXRDYXJ0VXBkYXRlTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0UHJvZHVjdENvdW50Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJ0UHJvZHVjdENvdW50JylcclxuXHJcbiAgICBpZiAoIWNhcnRQcm9kdWN0Q291bnROb2RlKSByZXR1cm5cclxuXHJcbiAgICBjYXJ0UHJvZHVjdENvdW50Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdjYXJ0VXBkYXRlRXZlbnQnLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzID0gd2luZG93LkNBUlQucHJvZHVjdHNcclxuICAgICAgICBsZXQgcHJvZHVjdENvdW50ID0gMFxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZXJhdG9yIG9mIHByb2R1Y3RzKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RDb3VudCArPSBpdGVyYXRvci5jb3VudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuaW5uZXJUZXh0ID0gcHJvZHVjdENvdW50XHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuZGF0YXNldC5jb3VudCA9IHByb2R1Y3RDb3VudC50b1N0cmluZygpXHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2FydFByb2R1Y3RDb3VudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSwgMTAwMClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZS5kZXRhaWwubWVzc2FnZSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgc2V0Q2FydFVwZGF0ZUxpc3RlbmVyKVxyXG5cclxuLy8gT3BlbiBhbmQgY2xvc2Ugc3ViTGlzdHNcclxuY29uc3QgdG9nZ2xlU3ViTmF2TGlzdHMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0b2dnbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWlubmVyLXRvZ2dsZScpKVxyXG5cclxuICAgIGNvbnN0IGNsb3NlQWxsVG9nZ2xlcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgdG9nZ2xlcnMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdyYXAgPSBlbC5jbG9zZXN0KCcuaGVhZGVyX19uYXYtaW5uZXItY2FwdGlvbicpXHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpXHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb2xsYXBzZSA9IHdyYXAucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LXN1Ymxpc3QtY29sbGFwc2UnKVxyXG4gICAgICAgICAgICBjb2xsYXBzZS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJylcclxuXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdyYXAgPSBlbC5jbG9zZXN0KCcuaGVhZGVyX19uYXYtaW5uZXItY2FwdGlvbicpXHJcbiAgICAgICAgY29uc3QgY29sbGFwc2UgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1zdWJsaXN0LWNvbGxhcHNlJylcclxuICAgICAgICBjb25zdCBpc0N1cnJlbnREcm9wcGVkID0gd3JhcC5jbGFzc0xpc3QuY29udGFpbnMoJ2Ryb3BwZWQnKVxyXG5cclxuICAgICAgICAvLyBjbG9zZUFsbFRvZ2dsZXJzKClcclxuXHJcbiAgICAgICAgLy8gVG9nZ2xlIGN1cnJlbnRcclxuICAgICAgICBpZiAoIWlzQ3VycmVudERyb3BwZWQpIHtcclxuICAgICAgICAgICAgd3JhcC5jbGFzc0xpc3QuYWRkKCdkcm9wcGVkJylcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgY29sbGFwc2UuY2xhc3NMaXN0LmFkZCgnb3BlbicpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd3JhcC5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wcGVkJylcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgY29sbGFwc2UuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcbiAgICAgICAgfVxyXG4gICAgfSkpXHJcblxyXG4gICAgLy8gQ2xvc2UgYWxsIHN1Ym5hdiBsaXN0IG9uIG91dCBjbGlja1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBjb25zdCBpc1RhcmdldCA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbGFzc0xpc3RcclxuICAgICAgICAgICAgLmNvbnRhaW5zKCdoZWFkZXJfX25hdi1pbm5lci10b2dnbGUnKVxyXG5cclxuICAgICAgICBpZighaXNUYXJnZXQpIGNsb3NlQWxsVG9nZ2xlcnMoKVxyXG4gICAgfSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0b2dnbGVTdWJOYXZMaXN0cylcclxuIiwiLy8gRGVsZXRpbmcgYmxvY2tpbmcgb2YgYWxsIGFuaW1hdGlvbiBmb3IgZml4IGFuaW1hdGlvbiBhcnRlZmFjdHNcclxuY29uc3QgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlciA9ICgpID0+IHtcclxuICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRyYW5zaXRpb24tYmxvY2tlcicpKVxyXG4gICAgICAgIC5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3RyYW5zaXRpb24tYmxvY2tlcicpKVxyXG59XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgcmVtb3ZlQW5pbWF0aW9uQmxvY2tlcilcclxuXHJcbi8vIEJsb2NraW5nIGFsbCBhbmltYXRpb24gYXQgdGhlIHdpbmRvdyByZXNpemluZyBwcm9jZXNzXHJcbmNvbnN0IGFkZEFuaW1hdGlvbkJsb2NrZXIgPSAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RyYW5zaXRpb24tYmxvY2tlcicpXHJcbn1cclxuXHJcbmxldCBibG9ja0FuaW1hdGlvblRpbWVyXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XHJcbiAgICBjbGVhclRpbWVvdXQoYmxvY2tBbmltYXRpb25UaW1lcilcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChhZGRBbmltYXRpb25CbG9ja2VyKVxyXG5cclxuICAgIGJsb2NrQW5pbWF0aW9uVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwocmVtb3ZlQW5pbWF0aW9uQmxvY2tlcilcclxuICAgIH0sIDMwMClcclxufSlcclxuXHJcbi8vIEhhbmRsZSBsaW5rIHdpdGggc21vb3RoIGFuaW1hdGlvbiB0byBhbmNob3IgcGxhY2Ugb24gdGhlIHBhZ2VcclxuY29uc3Qgc21vb3RoTGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZePVwiI1wiXScpXHJcbmZvciAobGV0IHNtb290aExpbmsgb2Ygc21vb3RoTGlua3MpIHtcclxuICAgIHNtb290aExpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICBjb25zdCBpZCA9IHNtb290aExpbmsuZ2V0QXR0cmlidXRlKCdocmVmJylcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7aWR9YClcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gdGFyZ2V0Tm9kZS5vZmZzZXRUb3BcclxuICAgICAgICAgICAgY29uc3QgZGV2aWNlT2Zmc2V0ID0gd2luZG93Lm91dGVyV2lkdGggPiA3NjggPyAtMTAwIDogLTIwXHJcblxyXG4gICAgICAgICAgICBzbW9vdGhTY3JvbGxUbyh0YXJnZXRPZmZzZXQgKyBkZXZpY2VPZmZzZXQsIDcwMClcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlcmUncyBubyB0YXJnZXQgbm9kZSBmb3Igc2Nyb2xsaW5nIHRvIHBsYWNlLiBUaGUgc2VsZWN0b3IgaXNuJ3QgY29ycmVjdCFcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufTtcclxuXHJcbi8vIEFuaW1hdGlvbiBpdGVtcyB3aGVuIHVzZXIgaGFzIHNjcm9sbGVkIHNjcmVlbiB0byBwbGFjZSBvZiBpdGVtXHJcbmNvbnN0IGNoZWNrQW5pbWF0aW9uRWxtcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGFuaW1hdGlvbkVsbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbmltYXRpb24tZWxlbWVudCcpKVxyXG5cclxuICAgIHJldHVybiBhbmltYXRpb25FbG1zLmxlbmd0aCA+IDBcclxufVxyXG5cclxuY29uc3Qgc2hvd0FuaW1FbGVtZW50cyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGVsbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbmltYXRpb24tZWxlbWVudCcpKVxyXG5cclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAvLyBjb25zdCBwb2ludE9mRGlzcGxheSA9IHdpbmRvd0hlaWdodCAvIDEuMiAvLyBmb3Igc2hvdyBvbiB0aGUgaGFsZiBvZiB0aGUgc2NyZWVuXHJcbiAgICBjb25zdCBwb2ludE9mRGlzcGxheSA9IHdpbmRvd0hlaWdodFxyXG5cclxuICAgIGVsbXMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICBjb25zdCBkaXN0YW5jZUZyb21Ub3AgPSByZWN0LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxyXG5cclxuICAgICAgICBpZiAoZGlzdGFuY2VGcm9tVG9wIC0gcG9pbnRPZkRpc3BsYXkgPCBzY3JvbGxUb3ApIHtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0aW9uLWVsZW1lbnQnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgaWYgKCFjaGVja0FuaW1hdGlvbkVsbXMoKSkge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzZXRBbmltYXRpb25FbG1zID0gKCkgPT4ge1xyXG4gICAgaWYgKGNoZWNrQW5pbWF0aW9uRWxtcygpKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNob3dBbmltRWxlbWVudHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKHNob3dBbmltRWxlbWVudHMpXHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKHNldEFuaW1hdGlvbkVsbXMpXHJcbiAgICB9LCAxMDApXHJcbn0pXHJcblxyXG4vLyBQaG9uZSBtYXNraW5nXHJcbmNvbnN0IGluaXRQaG9uZXNNYXNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcGhvbmVJbnB1dHMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPVwidGVsXCJdOm5vdCguY2FydF9fY2FsYyBbdHlwZT1cInRlbFwiXSknKSlcclxuXHJcbiAgICBwaG9uZUlucHV0cy5mb3JFYWNoKHBob25lID0+IHtcclxuICAgICAgICBjb25zdCBwaG9uZU1hc2tPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtYXNrOiAnK3s3fSAoMDAwKSAwMDAtMDAtMDAnLFxyXG4gICAgICAgICAgICBsYXp5OiB0cnVlLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlckNoYXI6ICcjJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwaG9uZU1hc2sgPSBJTWFzayhcclxuICAgICAgICAgICAgcGhvbmUsXHJcbiAgICAgICAgICAgIHBob25lTWFza09wdGlvbnNcclxuICAgICAgICApXHJcblxyXG4gICAgICAgIHBob25lLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IGZhbHNlfSkpXHJcbiAgICAgICAgcGhvbmUuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiB0cnVlfSkpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChpbml0UGhvbmVzTWFzaylcclxufSlcclxuXHJcbi8vIEZpeGluZyBjaGF0LTI0IHdpZGdldCBwb3NpdGlvbiAtLSBTVEFSVFxyXG5sZXQgY2hhdDI0SW50ZXJ2YWxJZCA9IG51bGxcclxubGV0IGNoYXQyNFRpbWVvdXRJZCA9IG51bGxcclxubGV0IGNoYXJ0MjRTdHlsZU5vZGUgPSBudWxsXHJcbmxldCBjaGFydDI0Tm9kZSA9IG51bGxcclxuXHJcbmNvbnN0IGZpeENoYXQyNFdpZGdldFBvc2l0aW9uID0gKCkgPT4ge1xyXG4gICAgY2hhcnQyNE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjaGF0LTI0JylcclxuXHJcbiAgICBpZiAoIWNoYXJ0MjROb2RlKSByZXR1cm5cclxuXHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCAxMDI0ICYmICFjaGFydDI0U3R5bGVOb2RlKSB7XHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcclxuXHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZS5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgIC5zdGFydEJ0bi5zdGFydEJ0bi0tb3V0c2lkZS5zdGFydEJ0bi0tYm90dG9tIHtcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogNjdweDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAuc3RhcnRCdG4uc3RhcnRCdG4tLW9wZW4ge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDUwJSkgc2NhbGUoMC42KSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY2hhcnQyNE5vZGUuc2hhZG93Um9vdC5wcmVwZW5kKGNoYXJ0MjRTdHlsZU5vZGUpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDEwMjQgJiYgY2hhcnQyNFN0eWxlTm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFydDI0U3R5bGVOb2RlJywgY2hhcnQyNFN0eWxlTm9kZSk7XHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZS5yZW1vdmUoKVxyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJJbnRlcnZhbChjaGF0MjRJbnRlcnZhbElkKVxyXG4gICAgY2hhdDI0SW50ZXJ2YWxJZCA9IG51bGxcclxuXHJcbiAgICBjbGVhclRpbWVvdXQoY2hhdDI0VGltZW91dElkKVxyXG4gICAgY2hhdDI0VGltZW91dElkID0gbnVsbFxyXG59XHJcblxyXG5jb25zdCBjaGF0MjRSZW5kZXJMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGNoYXQyNEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmaXhDaGF0MjRXaWRnZXRQb3NpdGlvbiwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBoYXJkUmVtb3ZlQ2hhdDI0UmVuZGVyTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjaGF0MjRUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpZiAoY2hhdDI0SW50ZXJ2YWxJZCkgY2xlYXJJbnRlcnZhbChjaGF0MjRJbnRlcnZhbElkKVxyXG4gICAgfSwgMTAwMDApXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKGNoYXQyNFJlbmRlckxpc3RlbmVyKTtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChoYXJkUmVtb3ZlQ2hhdDI0UmVuZGVyTGlzdGVuZXIpO1xyXG59KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDEwMjQpIHtcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwoY2hhdDI0UmVuZGVyTGlzdGVuZXIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYXJ0MjRTdHlsZU5vZGUpIGNoYXJ0MjRTdHlsZU5vZGUucmVtb3ZlKClcclxufSlcclxuLy8gRml4aW5nIGNoYXQtMjQgd2lkZ2V0IHBvc2l0aW9uIC0tIEZJTklTSCIsIi8qKlxyXG4gKiDQpNC70LDQsywg0YPQutCw0LfRi9Cy0LDRjtGJ0LjQuSDQvdCwINGA0LXQttC40Lwg0YDQsNC30YDQsNCx0L7RgtC60LguXHJcbiAqIEB0eXBlIHtib29sZWFufVxyXG4gKlxyXG4gKiDQlNC70Y8g0YHQtdGA0LLQtdGA0LAg0LLQtdGA0YHRgtC60Lgg0YHQvtCx0LjRgNCw0YLRjCDQuCDQv9GD0YjQuNGC0Ywg0LIg0YDQtdC20LjQvNC1IERFVl9NT0RFID0gdHJ1ZVxyXG4gKiDQndCwINC/0YDQvtC0INC4INC00LXQsiDRgdC+0LHQuNGA0LDRgtGMINC4INC/0YPRiNC40YLRjCDQsiDRgNC10LbQuNC80LUgREVWX01PREUgPSBmYWxzZVxyXG4gKlxyXG4gKiDQkiDRgNC10LbQuNC80LUgREVWX01PREUgPSB0cnVlLCDQv9GA0Lgg0LvQvtC60LDQu9GM0L3QvtC5INGA0LDQt9GA0LDQsdC+0YLQutC1LFxyXG4gKiDRgtCw0LrQttC1INC90LXQvtCx0YXQvtC00LjQvNC+INC/0YDQsNCy0LjRgtGMINC/0YPRgtGMINC00L4g0YTQsNC50LvQsCBtYWluLmpzXHJcbiAqXHJcbiAqINCf0YDQuNC8LjogPHNjcmlwdCBzcmM9XCJodHRwOi8vbG9jYWxob3N0OtC90L7QvNC10YBf0L/QvtGC0LAvanMvbWFpbi5qc1wiIGRlZmVyPjwvc2NyaXB0PlxyXG4gKi9cclxuY29uc3QgREVWX01PREUgPSB3aW5kb3cuTU9ERSA9PT0gJ2RldicgLy8gZGV2IC0gdHJ1ZSwgYnVpbGQgLSBmYWxzZVxyXG5cclxuLy8gSW5pdCBjYXJ0IGN1c3RvbSBFdmVudFxyXG5jb25zdCBjYXJ0RXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2NhcnRVcGRhdGVFdmVudCcsIHtcclxuICAgIGRldGFpbDoge1xyXG4gICAgICAgIG1lc3NhZ2U6ICdGaXJlZCBjYXJ0IHByb2R1Y3QgdXBkYXRlZCBjdXN0b20gRXZlbnQhJ1xyXG4gICAgfSxcclxuICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgY2FuY2VsYWJsZTogZmFsc2VcclxufSlcclxuXHJcbmNvbnN0IG5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEgPSAoZGF0YSkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdHMgPSBbXVxyXG5cclxuICAgIGlmIChkYXRhLmRvdHMpIHtcclxuICAgICAgICBkYXRhLmRvdHMuZm9yRWFjaChkb3QgPT4ge1xyXG4gICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHsgYXJ0aWNsZTogZG90LmlkLCBjb3VudDogZG90LmNvdW50IH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEucHJvZHVjdHMpIHtcclxuICAgICAgICBkYXRhLnByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RzLnB1c2goeyBhcnRpY2xlOiBwcm9kdWN0LmFydGljbGUsIGNvdW50OiBwcm9kdWN0LmNvdW50IH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHByb2R1Y3RzXHJcbn1cclxuXHJcbi8vIE1ldGhvZHMgdG8gd29yayB3aXRoIGNhcnQgZm9yIFBST0RVQ1RTXHJcbndpbmRvdy5zZXRQcm9kdWN0VG9DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRidCw0LXQvCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgtC+0LLQsNGA0LAg0LIg0LrQvtGA0LfQuNC90LU6JywgYXJ0LCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnYXJ0JywgYXJ0KVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LXNldC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L3NldCcsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGB0YLQuNC70Lgg0YLQvtCy0LDRgCDQsiDQutC+0YDQt9C40L3QtS4g0J/QvtC70YPRh9C40LvQuCDQvtGC0LLQtdGCJywgZGF0YSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGA0LDQt9C80LXRidC10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQmtC+0YDQt9C40L3QtSEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkUHJvZHVjdFRvQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCfQlNC+0LHQsNCy0LvQtdC90LjQtSDRgtC+0LLQsNGA0LAg0LIg0LrQvtGA0LfQuNC90YM6JywgYXJ0LCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnYXJ0JywgYXJ0KVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWFkZC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2FkZCcsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0JTQvtCx0LDQstC40LvQuCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdGDLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtScsIGRhdGEpXHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC00L7QsdCw0LLQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQmtC+0YDQt9C40L3RgyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5yZW1vdmVQcm9kdWN0RnJvbUNhcnQgPSBhc3luYyAoe2FydCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0KPQtNCw0LvQtdC90LjQtSDRgtC+0LLQsNGA0LAg0LjQtyDQutC+0YDQt9C40L3RizonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtZGVsLmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZGVsJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGEgfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCfQo9C00LDQu9C40LvQuCDRgtC+0LLQsNGAINC40Lcg0LrQvtGA0LfQuNC90YsuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1JywgZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGD0LTQsNC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINC40Lcg0JrQvtGA0LfQuNC90YshINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxuLy8gTWV0aG9kcyB0byB3b3JrIHdpdGggY2FydCBmb3IgRE9UU1xyXG53aW5kb3cuc2V0RG90VG9DYXJ0ID0gYXN5bmMgKHtpZCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGJ0LDQtdC8INGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INCU0L7RgtC+0LIg0LIg0LrQvtGA0LfQuNC90LU6JywgaWQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdpZCcsIGlkKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LXNldERvdC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L3NldCcsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGB0YLQuNC70Lgg0JTQvtGC0Ysg0LIg0LrQvtGA0LfQuNC90LUuINCf0L7Qu9GD0YfQuNC70Lgg0L7RgtCy0LXRgicsIGRhdGEpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YDQsNC30LzQtdGJ0LXQvdC40Y8g0JTQvtGC0L7QsiDQsiDQmtC+0YDQt9C40L3QtSEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRG90VG9DYXJ0ID0gYXN5bmMgKG9yZGVyKSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0JTQvtCx0LDQstC70LXQvdC40LUg0LTQvtGC0LAg0LIg0LrQvtGA0LfQuNC90YMuINCe0YLQv9GA0LDQstC70Y/QtdC8INC00LDQvdC90YvQtTonLCBvcmRlcilcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1hZGREb3QuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9hZGREb3QnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeShvcmRlcikgfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcbiAgICAgICAgd2luZG93LnNob3dNb2RhbE1zZyhcItCU0L7QsdCw0LLQuNC70Lgg0JTQvtGCINCyINC60L7RgNC30LjQvdGDLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtVwiLCBkYXRhKVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDQtNC+0LHQsNCy0LvQtdC90LjRjyDQlNC+0YLQsCDQsiDQmtC+0YDQt9C40L3RgyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cucmVtb3ZlRG90RnJvbUNhcnQgPSBhc3luYyAoe2lkLCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCfQo9C00LDQu9C10L3QuNC1INCU0L7RgtCwINC40Lcg0LrQvtGA0LfQuNC90Ys6JywgaWQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdpZCcsIGlkKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWRlbERvdC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2RlbERvdCcsIHsgbWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KPQtNCw0LvQuNC70LggRG90INC40Lcg0LrQvtGA0LfQuNC90YsuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1JywgZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGD0LTQsNC70LXQvdC40Y8g0JTQvtGC0LAg0LjQtyDQmtC+0YDQt9C40L3RiyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gQ2FydCBQcm94eVxyXG5jb25zdCBjYXJ0R2V0ID0gKHRhcmdldCwgcHJvcCkgPT4ge1xyXG4gICAgcmV0dXJuIHRhcmdldFtwcm9wXVxyXG59XHJcblxyXG5jb25zdCBjYXJ0U2V0ID0gKHRhcmdldCwgcHJvcCwgdmFsKSA9PiB7XHJcblxyXG5cclxuICAgIGlmIChwcm9wID09PSAncHJvZHVjdHMnKSB7XHJcbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0YzRgtC1LCDQvtGC0LvQuNGH0LDQtdGC0YHRjyDQu9C4INC90L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSDQvtGCINGB0YLQsNGA0L7Qs9C+INC30L3QsNGH0LXQvdC40Y8uXHJcbiAgICAgICAgY29uc3QgaXNfc2FtZSA9ICh0YXJnZXQucHJvZHVjdHMubGVuZ3RoID09PSB2YWwubGVuZ3RoKSAmJiB0YXJnZXQucHJvZHVjdHMuZXZlcnkoXHJcbiAgICAgICAgICBmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmFydGljbGUgPT09IHZhbFtpbmRleF0uYXJ0aWNsZSAmJiBlbGVtZW50LmNvdW50ID09PSB2YWxbaW5kZXhdLmNvdW50O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKCFpc19zYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTRVRUSU5HJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YXJnZXQnLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJvcCcsIHByb3ApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmFsJywgdmFsKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRhcmdldC5wcm9kdWN0cyA9IFsuLi52YWxdO1xyXG4gICAgICAgICAgICBjYXJ0RXZlbnQuZGV0YWlsLnByb2R1Y3RzID0gdGFyZ2V0LnByb2R1Y3RzO1xyXG4gICAgICAgICAgICAvLyBEaXNwYXRjaGluZyBjdXN0b20gY2FydCB1cGRhdGUgRXZlbnRcclxuICAgICAgICAgICAgY29uc3QgY2FydFByb2R1Y3RDb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhcnRQcm9kdWN0Q291bnRcIik7XHJcbiAgICAgICAgICAgIGlmIChjYXJ0UHJvZHVjdENvdW50Tm9kZSkgY2FydFByb2R1Y3RDb3VudE5vZGUuZGlzcGF0Y2hFdmVudChjYXJ0RXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2FydCA9IGFzeW5jICgpID0+IHtcclxuICAgIGlmICghd2luZG93LkNBUlQpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWdldC5qc29uJylcclxuICAgICAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9nZXQnLCB7IG1ldGhvZDogJ1BPU1QnIH0pXHJcblxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5DQVJUID0gbmV3IFByb3h5KHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzOiBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBjYXJ0R2V0LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBjYXJ0U2V0XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVEFSVCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVzcG9uc2UgZGF0YScsIGRhdGEpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aW5kb3cuQ0FSVCcsIHdpbmRvdy5DQVJUKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGSU5JU0gnKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRDYXJ0KVxyXG5cclxud2luZG93LmNhcnRVcGRhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuQ0FSVCAhPT0gdW5kZWZpbmVkICYmICFERVZfTU9ERSkge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2dldCcsIHsgbWV0aG9kOiAnUE9TVCcgfSlcclxuICAgICAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59LCA1MDAwKSJdfQ==
