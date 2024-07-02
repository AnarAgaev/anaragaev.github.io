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

window.addEventListener('load', () => {
    initCardsTab()
})

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

window.addEventListener('load', () => {
    setCartUpdateListener()
})

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

        closeAllTogglers()

        // Toggle current
        if (!isCurrentDropped) {
            wrap.classList.add('dropped')
            el.classList.add('active')
            collapse.classList.add('open')
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

window.addEventListener('load', () => {
    toggleSubNavLists()
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
    chat24RenderListener()
    hardRemoveChat24RenderListener()
})

window.addEventListener('resize', () => {
    if (window.innerWidth < 1024) {
        chat24RenderListener()
        return
    }

    if (chart24StyleNode) chart24StyleNode.remove()
})
// Fixing chat-24 widget position -- FINISH
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

    console.log('Размещаем фиксированное количество товара в корзине:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    // const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-set.json', {
    const res = await fetch('/ajax/cart/set', {
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Разместили товар в корзине. Получили ответ', data);

    } else {
        console.error('Ошибка размещения товара в Корзине! Код ошибки:', res.status)
    }
}

window.addProductToCart = async ({art, count}) => {

    console.log('Добавление товара в корзину:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    // const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-add.json', {
    const res = await fetch('/ajax/cart/add', {
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Добавили товар в корзину. Получили данные', data);

    } else {
        console.error('Ошибка добавления товара в Корзину! Код ошибки:', res.status)
    }
}

window.removeProductFromCart = async ({art, count}) => {

    console.log('Удаление товара из корзины:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    // const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-del.json', {
    const res = await fetch('/ajax/cart/del', {
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Удалили товар из корзины. Получили данные', data);

    } else {
        console.error('Ошибка удаления товара из Корзины! Код ошибки:', res.status)
    }
}

// Methods to work with cart for DOTS
window.setDotToCart = async ({id, count}) => {

    console.log('Размещаем фиксированное количество Дотов в корзине:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    // const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-setDot.json', {
    const res = await fetch('/ajax/cart/set', {
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Разместили Доты в корзине. Получили ответ', data);

    } else {
        console.error('Ошибка размещения Дотов в Корзине! Код ошибки:', res.status)
    }
}

window.addDotToCart = async (order) => {

    console.log('Добавление дота в корзину. Отправляем данные:', order)

    // const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-addDot.json', {
    const res = await fetch('/ajax/cart/addDot', {
        method: 'POST',
        body: JSON.stringify(order)
    })

    if (res.ok) {
        const data = await res.json()

        window.CART.products = [...normalizeResponseCartData(data)]
        window.showModalMsg("Добавили Дот в корзину. Получили данные", data)

        return true
    } else {
        console.error('Ошибка добавления Дота в Корзину! Код ошибки:', res.status)
        return false
    }
}

window.removeDotFromCart = async ({id, count}) => {

    console.log('Удаление Дота из корзины:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    // const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-delDot.json', {
    const res = await fetch('/ajax/cart/delDot', {
        method: 'POST',
        body: formData
    })

    if (res.ok) {
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        console.log('Удалили Dot из корзины. Получили данные', data);

    } else {
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

    console.log('window.CART before', window.CART);

    if (!window.CART) {

        // const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-get.json', {
        const res = await fetch('/ajax/cart/get', {
            method: 'POST'
        })

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

window.addEventListener('load', () => {
    initCart()
})

window.cartUpdateInterval = setInterval(async () => {
    if (window.CART !== undefined) {
        // const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-get.json', {
        const res = await fetch('/ajax/cart/get', {
            method: 'POST',
        })
        if (res.ok) {
            const data = await res.json()
            window.CART.products = [...normalizeResponseCartData(data)];
        }
    }
}, 5000)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJmb3JtYXROdW1iZXIuanMiLCJnZXRVcmxQYXJhbWV0ZXJCeU5hbWUuanMiLCJzbW9vdGhTY3JvbGxUby5qcyIsInRocm90dGxlLmpzIiwidmFsaWRhdGVFbWFpbC5qcyIsInZhbGlkYXRlUGhvbmUuanMiLCJhY2NvdW50LWZvcm1zL3NjcmlwdC5qcyIsImNhcmRzLWl0ZW0vc2NyaXB0LmpzIiwiY2FyZHMtc2VyaWVzL3NjcmlwdC5qcyIsImZpbHRlcnMvc2NyaXB0LmpzIiwibW9kYWxzL3NjcmlwdC5qcyIsInByb2R1Y3QtaW5mby9zY3JpcHQuanMiLCJyZWNvbW1lbmRhdGlvbi9zY3JpcHQuanMiLCJzY3JvbGwtdG8tdG9wL3NjcmlwdC5qcyIsInNob3ctbW9kYWwtbXNnL3NjcmlwdC5qcyIsInNwaW5uZXIvc2NyaXB0LmpzIiwiZm9vdGVyL3NjcmlwdC5qcyIsImhlYWRlci9zY3JpcHQuanMiLCJtYWluLmpzIiwiY2FydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdlhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENsZWFyIHBob25lIG9mIHNwYWNlcywgYnJhY2tldHMsXHJcbiAqIGRhc2hlcyBhbmQgcGx1cyBzaWduLiBMZWF2ZSBvbmx5IG51bWJlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZSAtIFRoZSBwaG9uZSwgdGhhdCBuZWVkcyB0byBjbGVhci5cclxuICogQHJldHVybnMge251bWJlcn0gLSBQaG9uZSBudW1iZXIgYXMgYSBudW1iZXIgdHlwZS5cclxuICovXHJcbndpbmRvdy5jbGVhclBob25lID0gKHBob25lKSA9PiB7XHJcbiAgICByZXR1cm4gcGFyc2VJbnQocGhvbmUucmVwbGFjZSgvXFxEL2csIFwiXCIpKVxyXG59XHJcbiIsIi8qKlxyXG4gKiBGb3JtYXR0aW5nIG51bWJlciB0byB0aGUgbG9jYWwgdmFsdWVcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXJ9IG51bWJlciAtIFZhbHVlIGZvciBmb3JtYXR0aW5nLlxyXG4gKi9cclxuXHJcbndpbmRvdy5mb3JtYXROdW1iZXIgPSAobnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KG51bWJlci50b1N0cmluZygpLnJlcGxhY2UoL1xccy9nLCBcIlwiKSlcclxuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiIFwiKTtcclxufVxyXG4iLCIvKipcclxuICogR2V0dGluZyBnZXQgcGFyYW1ldGVyIGZyb20gdGhlIHVybFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzZWFyY2ggcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3VybF0gLSBUaGUgVVJMIGFkZHJlc3MuIElmIHRoaXMgcGFyYW1ldGVyIGlzIG5vdCBwYXNzZWQsIHRoZW4gdGhlIHNlYXJjaCwgYnkgZGVmYXVsdCwgd2lsbCBvY2N1ciBpbiB0aGUgY3VycmVudCBVUkwuXHJcbiAqL1xyXG53aW5kb3cuZ2V0VXJsUGFyYW1ldGVyQnlOYW1lID0gZnVuY3Rpb24obmFtZSwgdXJsKSB7XHJcbiAgICBpZiAoIW5hbWUpIHJldHVyblxyXG5cclxuICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG5cclxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpXHJcblxyXG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLFxyXG4gICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XHJcblxyXG4gICAgICAgIGlmICghcmVzdWx0cykgcmV0dXJuIG51bGxcclxuXHJcbiAgICBpZiAoIXJlc3VsdHNbMl0pIHJldHVybiAnJ1xyXG5cclxuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKVxyXG59XHJcbiIsIi8qKlxyXG4gKiBTbW9vdGhseSBzY3JvbGxzIHRoZSBwYWdlIHRvIHRoZSBzcGVjaWZpZWQgcG9zaXRpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBwb3NpdGlvbiB0byBzY3JvbGwgdG8uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb249NTAwXSAtIFRoZSBkdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uIGluIG1pbGxpc2Vjb25kcy5cclxuICovXHJcbmZ1bmN0aW9uIHNtb290aFNjcm9sbFRvKHBvc2l0aW9uLCBkdXJhdGlvbiA9IDUwMCkge1xyXG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb25cclxuICAgIGxldCBzdGFydFRpbWVzdGFtcCA9IG51bGxcclxuXHJcbiAgICBmdW5jdGlvbiBzdGVwKHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICghc3RhcnRUaW1lc3RhbXApIHN0YXJ0VGltZXN0YW1wID0gdGltZXN0YW1wXHJcblxyXG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gdGltZXN0YW1wIC0gc3RhcnRUaW1lc3RhbXBcclxuICAgICAgICBjb25zdCBzY3JvbGxZID0gZWFzZUluT3V0Q3ViaWMocHJvZ3Jlc3MsIHN0YXJ0UG9zaXRpb24sIGRpc3RhbmNlLCBkdXJhdGlvbilcclxuXHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbFkpXHJcblxyXG4gICAgICAgIGlmIChwcm9ncmVzcyA8IGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZWFzZUluT3V0Q3ViaWModCwgYiwgYywgZCkge1xyXG4gICAgICAgIHQgLz0gZFxyXG4gICAgICAgIHQtLVxyXG4gICAgICAgIHJldHVybiBjICogKHQgKiB0ICogdCArIDEpICsgYlxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxufVxyXG4iLCJ3aW5kb3cudGhyb3R0bGUgPSAoZnVuYywgbXMpID0+IHtcclxuICAgIGxldCBpc1Rocm90dGxlZCA9IGZhbHNlLFxyXG4gICAgICAgIHNhdmVkQXJncyxcclxuICAgICAgICBzYXZlZFRoaXNcclxuXHJcbiAgICBmdW5jdGlvbiB3cmFwcGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoaXNUaHJvdHRsZWQpIHsgLy8gMlxyXG4gICAgICAgICAgICBzYXZlZEFyZ3MgPSBhcmd1bWVudHNcclxuICAgICAgICAgICAgc2F2ZWRUaGlzID0gdGhpc1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSAvLyAxXHJcblxyXG4gICAgICAgIGlzVGhyb3R0bGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpc1Rocm90dGxlZCA9IGZhbHNlIC8vIDNcclxuICAgICAgICAgICAgaWYgKHNhdmVkQXJncykge1xyXG4gICAgICAgICAgICAgICAgd3JhcHBlci5hcHBseShzYXZlZFRoaXMsIHNhdmVkQXJncylcclxuICAgICAgICAgICAgICAgIHNhdmVkQXJncyA9IHNhdmVkVGhpcyA9IG51bGxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIG1zKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3cmFwcGVyXHJcbn0iLCIvKipcclxuICogRW1haWwgYWRkcmVzcyB2ZXJpZmljYXRpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGVtYWlsIC0gVGhlIGVtYWlsLCB0aGF0IG5lZWRzIHRvIHZhbGlkYXRpbmcuXHJcbiAqL1xyXG53aW5kb3cudmFsaWRhdGVFbWFpbCA9IChlbWFpbCkgPT4ge1xyXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBlbWFpbFxyXG4gICAgY29uc3QgZW1haWxSZWdleCA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvXHJcbiAgICByZXR1cm4gZW1haWxSZWdleC50ZXN0KGVtYWlsKVxyXG59XHJcbiIsIi8qKlxyXG4gKiBQaG9uZSBudW1iZXIgdmVyaWZpY2F0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZSAtIFRoZSBwaG9uZSwgdGhhdCBuZWVkcyB0byB2YWxpZGF0aW5nLlxyXG4gKi9cclxud2luZG93LnZhbGlkYXRlUGhvbmUgPSAocGhvbmUpID0+IHtcclxuICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgcGhvbmVcclxuICAgIGNvbnN0IHBob25lUmVnZXggPSAvXjdcXGR7MTB9JC9cclxuICAgIHJldHVybiBwaG9uZVJlZ2V4LnRlc3QocGhvbmUpXHJcbn1cclxuIiwiY29uc3QgaW5pdFRvZ2dsZVZpc2libGVGb3JtUGFzcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2dnbGUtdmlzaWJsZS1wYXNzJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgIGNvbnN0IGlzVGV4dCA9IGlucHV0LnR5cGUgPT09ICd0ZXh0J1xyXG5cclxuICAgICAgICBpbnB1dC50eXBlID0gaXNUZXh0ID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0J1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgncGFzcy12aXNpYmxlJylcclxuICAgIH0pKVxyXG59XHJcblxyXG4vLyBjb25zdCByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIgPSAoaW5wdXROb2RlKSA9PiB7XHJcbi8vICAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUuY2xvc2VzdCgnbGFiZWwnKVxyXG4vLyAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbi8vIH1cclxuXHJcbi8vIGNvbnN0IHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIgPSAoaW5wdXROb2RlLCBlcnJvclRleHQpID0+IHtcclxuLy8gICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5jbG9zZXN0KCdsYWJlbCcpXHJcbi8vICAgICBjb25zdCBtZXNzYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJylcclxuXHJcbi8vICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGFzLWVycm9yJylcclxuLy8gICAgIG1lc3NhZ2UuaW5uZXJUZXh0ID0gZXJyb3JUZXh0XHJcblxyXG4vLyAgICAgaW5wdXROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4vLyAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxyXG4vLyAgICAgfSlcclxuLy8gfVxyXG5cclxuLy8gY29uc3QgaW5pdEFjY291bnRGb3JtID0gKCkgPT4ge1xyXG4vLyAgICAgY29uc3QgZm9ybXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvdW50LWZvcm1fX2Zvcm0nKSlcclxuLy8gICAgIGlmIChmb3Jtcy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuLy8gICAgIGZvcm1zLmZvckVhY2goZm9ybSA9PiBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuLy8gICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbi8vICAgICAgICAgY29uc3QgZm9ybVZhbGlkID0ge2VtYWlsOiB0cnVlLCBwYXNzOiB0cnVlLCB9XHJcbi8vICAgICAgICAgY29uc3QgZW1haWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZW1haWxcIl0nKVxyXG4vLyAgICAgICAgIGNvbnN0IHBhc3MgID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBhc3NcIl0nKVxyXG4vLyAgICAgICAgIGNvbnN0IGZvcm1UeXBlID0gdGhpcy5kYXRhc2V0LmZvcm1UeXBlXHJcblxyXG4vLyAgICAgICAgIHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbClcclxuLy8gICAgICAgICBpZiAoZm9ybVR5cGUgIT09ICdyZWNvdmVyeScpIHtcclxuLy8gICAgICAgICAgICAgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKHBhc3MpXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAvLyBDaGVjayBlbWFpbFxyXG4vLyAgICAgICAgIGlmIChlbWFpbC52YWx1ZSAhPT0gJycpIHtcclxuLy8gICAgICAgICAgICAgaWYgKHdpbmRvdy52YWxpZGF0ZUVtYWlsKGVtYWlsLnZhbHVlKSkge1xyXG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gdHJ1ZVxyXG4vLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbCwgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyEnKVxyXG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2VcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIoZW1haWwsICfQndC10L7QsdGF0L7QtNC40LzQviDRg9C60LDQt9Cw0YLRjCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiyEnKVxyXG4vLyAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSBmYWxzZVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgLy8gQ2hlY2sgcGFzc1xyXG4vLyAgICAgICAgIGlmIChmb3JtVHlwZSAhPT0gJ3JlY292ZXJ5Jykge1xyXG4vLyAgICAgICAgICAgICBpZiAocGFzcy52YWx1ZS5sZW5ndGggPCA4KSB7XHJcbi8vICAgICAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKHBhc3MsICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0L/QsNGA0L7Qu9GMLiDQlNC70LjQvdC90LAg0L/QsNGA0L7Qu9GPINC00L7Qu9C20L3QsCDQsdGL0YLRjCDQvdC1INC80LXQvdC10LUgOCDRgdC40LzQstC+0LvQvtCyIScpXHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQucGFzcyA9IGZhbHNlXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIC8vIFNlbmdpbmcgZm9ybSBkYXRhXHJcbi8vICAgICAgICAgaWYgKGZvcm1WYWxpZC5lbWFpbCAmJiBmb3JtVmFsaWQucGFzcykge1xyXG4vLyAgICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcclxuXHJcbi8vICAgICAgICAgICAgIC8vINCe0LHRj9C30LDRgtC10LvRjNC90L4g0YPQtNCw0LvQuNGC0Ywg0L/QvtGB0LvQtSDQstC90LXQtNGA0LXQvdC40Y9cclxuLy8gICAgICAgICAgICAgZm9yIChsZXQgW25hbWUsIHZhbHVlXSBvZiBmb3JtRGF0YSkge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7bmFtZX06ICR7dmFsdWV9YCk7XHJcbi8vICAgICAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyByZXF1ZXN0IGZvciB1cGRhdGluZyB1c2VyIGRhdGEnKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9KSlcclxuLy8gfVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAvLyBpbml0QWNjb3VudEZvcm0oKVxyXG4gICAgaW5pdFRvZ2dsZVZpc2libGVGb3JtUGFzcygpXHJcbn0pIiwiLy8gQWRkIHByb2R1Y3QgdG8gZmF2b3JpdGVzXHJcbmNvbnN0IGFkZFRvRmF2b3JpdGVzQ2xpY2tIYW5kbGVyID0gKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIGNvbnN0IF90aGlzID0gZS50YXJnZXRcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBfdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJylcclxuICAgIGNvbnN0IHRpdGxlID0gX3RoaXMuZGF0YXNldC50aXRsZVxyXG4gICAgY29uc3QgbWVzc2FnZSA9IF90aGlzLmRhdGFzZXQubWVzc2FnZVxyXG4gICAgY29uc3QgaGVhZGVyRmF2b3JpdGVzID0gZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnV0dG9ucy1saW5rX2Zhdm9yaXRlcyAuaGVhZGVyX19idXR0b25zLWNvdW50JylcclxuICAgIGNvbnN0IGN1cnJlbnRGYXZvcml0ZXNDb3VudCA9IHBhcnNlSW50KGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQpXHJcblxyXG4gICAgaWYgKCFpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgX3RoaXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQgPSBjdXJyZW50RmF2b3JpdGVzQ291bnQgKyAxXHJcbiAgICAgICAgaGVhZGVyRmF2b3JpdGVzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGhlYWRlckZhdm9yaXRlcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpLCAxMDAwKVxyXG5cclxuICAgICAgICBzaG93TW9kYWxNc2codGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9CX0LTQtdGB0Ywg0L3QsNC00L4g0LHRg9C00LXRgiDQvdCw0L/QuNGB0LDRgtGMINCw0YHQuNC90YXRgNC+0L3QvdGL0Lkg0LfQsNC/0YDQvtGBINC00L7QsdCw0LLQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQuNC30LHRgNCw0L3QvdGL0LUnKTtcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBfdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICBoZWFkZXJGYXZvcml0ZXMuaW5uZXJUZXh0ID0gY3VycmVudEZhdm9yaXRlc0NvdW50IC0gMVxyXG4gICAgY29uc29sZS5lcnJvcignQXN5bmMgcXVlcnkgdG8gREVMRVRFIHNlbGVjdGVkIHByb2R1Y3QgZnJvbSBGYXZvcml0ZXMnKTtcclxufVxyXG5cclxuY29uc3QgaW5pdEFkZFRvRmF2b3JpdGVzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3QtaXRlbV9fZmF2b3JpdGVzJykpXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGJ0biA9PiBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRUb0Zhdm9yaXRlc0NsaWNrSGFuZGxlcikpXHJcbn1cclxuXHJcbi8vIEFkZCBwcm9kdWN0IHRvIGNhcnRcclxuY29uc3QgYWRkVG9DYXJ0Q2xpY2tIYW5kbGVyID0gKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgIGNvbnN0IF90aGlzID0gZS50YXJnZXRcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBfdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJylcclxuICAgIGNvbnN0IHRpdGxlID0gX3RoaXMuZGF0YXNldC50aXRsZVxyXG4gICAgY29uc3QgbWVzc2FnZSA9IF90aGlzLmRhdGFzZXQubWVzc2FnZVxyXG5cclxuICAgIGlmICghaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIF90aGlzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzaG93TW9kYWxNc2codGl0bGUsIG1lc3NhZ2UpXHJcblxyXG4gICAgICAgIC8vIFB1c2ggY3VycmVudCBwcm9kdWN0IHRvIENhcnQgR2xvYmFsIE9iamVjdCAod2luZG93LkNBUlQpXHJcbiAgICAgICAgd2luZG93LmFkZFByb2R1Y3RUb0NhcnQoeyBhcnQ6IF90aGlzLmRhdGFzZXQucHJvZHVjdElkLCBjb3VudDogMSB9KVxyXG5cclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBfdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICBzaG93TW9kYWxNc2codGl0bGUsICfQo9C00LDQu9C10L0g0LjQtyDQutC+0YDQt9C40L3RiycpXHJcblxyXG4gICAgLy8gUmVtb3ZlIGN1cnJlbnQgcHJvZHVjdCBmcm9tIENhcnQgR2xvYmFsIE9iamVjdCAod2luZG93LkNBUlQpXHJcbiAgICB3aW5kb3cucmVtb3ZlUHJvZHVjdEZyb21DYXJ0KHsgYXJ0OiBfdGhpcy5kYXRhc2V0LnByb2R1Y3RJZCwgY291bnQ6IDEgfSlcclxufVxyXG5jb25zdCBpbml0QWRkVG9DYXJ0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3QtaXRlbV9fY2FydCcpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChidG4gPT4gYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWRkVG9DYXJ0Q2xpY2tIYW5kbGVyKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0QWRkVG9GYXZvcml0ZXMoKVxyXG4gICAgaW5pdEFkZFRvQ2FydCgpXHJcbn0pIiwiXHJcbmNvbnN0IHJlc2V0QWxsQ2FyZHNQaWNzID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IHBpY3MgPSBBcnJheS5mcm9tKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fcGljJykpXHJcbiAgICBwaWNzLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG59XHJcblxyXG5jb25zdCByZXNldEFsbENhcmRzVGFicyA9IChub2RlKSA9PiB7XHJcbiAgICBjb25zdCB0YWJzID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3RhYicpKVxyXG4gICAgdGFicy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxufVxyXG5cclxuY29uc3QgZ2V0VGFyZ2V0Q2FyZHNQaWMgPSAobm9kZSwgZGF0YVRhcmdldFR5cGVWYWwpID0+IHtcclxuICAgIHJldHVybiBub2RlLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXR5cGU9JHtkYXRhVGFyZ2V0VHlwZVZhbH1dYClcclxufVxyXG5cclxuY29uc3QgaW5pdENhcmRzVGFiID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFiQXJyID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX190YWInKSlcclxuXHJcbiAgICB0YWJBcnIuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmNsb3Nlc3QoJy5jYXJkcy1zZXJpZXNfX2l0ZW0nKVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQaWNUeXBlID0gdGhpcy5kYXRhc2V0LnRhcmdldFR5cGVcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UGljID0gZ2V0VGFyZ2V0Q2FyZHNQaWMocGFyZW50LCB0YXJnZXRQaWNUeXBlKVxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFjdGl2ZSB0YWJcclxuICAgICAgICAgICAgcmVzZXRBbGxDYXJkc1RhYnMocGFyZW50KVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFjdGl2ZSBpbWFnZVxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0UGljKSB7XHJcbiAgICAgICAgICAgICAgICByZXNldEFsbENhcmRzUGljcyhwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRQaWMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRDYXJkc1RhYigpXHJcbn0pXHJcbiIsIi8vIEZpbHRlcnNcbmNvbnN0IHNob3dOb0ZpbHRlck1zZyA9ICgpID0+IHtcbiAgdHJ5IHtcblxuXG4gICAgY29uc3QgbXNnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvbl9fbXNnXCIpO1xuXG4gICAgaWYgKCFtc2cpIHJldHVybjtcbiAgICBtc2cuY2xhc3NMaXN0LmFkZChcImRpc3BsYXlcIik7XG4gICAgc2V0VGltZW91dCgoKSA9PiBtc2cuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDEwMCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaGlkZU5vRmlsdGVyTXNnID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25fX21zZ1wiKTtcblxuICAgIGlmICghbXNnKSByZXR1cm47XG5cbiAgICBtc2cuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG4gICAgbXNnLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNwbGF5XCIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGNoZWNrTm9GaWx0ZXJNc2cgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXRlbXMgPSBkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdOm5vdCguaGlkZSlcIik7XG5cbiAgICBpdGVtcy5sZW5ndGggPT09IDBcbiAgICAgID8gc2hvd05vRmlsdGVyTXNnKClcbiAgICAgIDogaGlkZU5vRmlsdGVyTXNnKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaGlkZUZpbHRlckxpc3QgPSAoZmlsdGVyTGlzdCkgPT4ge1xuICB0cnkge1xuICAgIGZpbHRlckxpc3QuZm9yRWFjaChmaWx0ZXIgPT4ge1xuICAgICAgZmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wcGVkXCIpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKSwgMzAwKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBzaG93RmlsdGVyRHJvcCA9IChub2RlKSA9PiB7XG4gIHRyeSB7XG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbm9kZS5jbGFzc0xpc3QuYWRkKFwiZHJvcHBlZFwiKSwgMTApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGhpZGVGaWx0ZXJEcm9wID0gKG5vZGUpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmaWx0ZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2l0ZW1cIikpO1xuXG4gICAgaWYgKCFub2RlKSB7XG4gICAgICBoaWRlRmlsdGVyTGlzdChmaWx0ZXJzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2xlYW5lZEZpbHRlcnMgPSBmaWx0ZXJzLmZpbHRlcihmaWx0ZXIgPT4gZmlsdGVyICE9PSBub2RlKTtcbiAgICBoaWRlRmlsdGVyTGlzdChjbGVhbmVkRmlsdGVycyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaW5pdEZpbHRlcnNEcm9wID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGZpdGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19saXN0IC5maWx0ZXJzX19pdGVtXCIpKTtcblxuICAgIGZpdGxlcnMuZm9yRWFjaChmaWx0ZXIgPT4ge1xuICAgICAgZmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKTtcblxuICAgICAgICBpZiAoaXNBY3RpdmUpIHtcbiAgICAgICAgICBoaWRlRmlsdGVyRHJvcCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGhpZGVGaWx0ZXJEcm9wKHRoaXMpO1xuICAgICAgICBzaG93RmlsdGVyRHJvcCh0aGlzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGluaXRGaWx0ZXJzUmVzZXQgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1jYXRhbG9nXCIpO1xuICAgIGlmIChpc1BhZ2VDYXRhbG9nKSByZXR1cm47XG5cbiAgICBjb25zdCByZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyc19fcmVzZXQgLmZpbHRlcnNfX2l0ZW1cIik7XG5cbiAgICBpZiAoIXJlc2V0KSByZXR1cm47XG5cbiAgICBjb25zdCBmaWx0ZXJlZFNlY3Rpb24gPSBkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKTtcblxuICAgIHJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY2xvc2VzdChcIi5maWx0ZXJzXCIpO1xuXG4gICAgICBjb25zdCBzaWJsaW5nRmlsdGVycyA9IGNvbnRhaW5lclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19saXN0IC5maWx0ZXJzX19pdGVtXCIpO1xuXG4gICAgICBjb25zdCBvcHRpb25zID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19vcHRpb25zXCIpKTtcblxuICAgICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnMgaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXTpub3QoW3ZhbHVlPVxcXCJyZXNldFxcXCJdKVwiKSk7XG5cbiAgICAgIGNvbnN0IGNhcmRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XG5cbiAgICAgIGNvbnN0IGRlbGV0ZWRUeXBlcyA9IEpTT04ucGFyc2UoZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1kZWxldGVkLXR5cGVzXVwiKVxuICAgICAgICAuZGF0YXNldC5kZWxldGVkVHlwZXMpO1xuXG4gICAgICBoaWRlRmlsdGVyTGlzdChzaWJsaW5nRmlsdGVycyk7XG4gICAgICBzcGlubmVyLnNob3coKTtcbiAgICAgIGZpbHRlcmVkU2VjdGlvbi5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoXCJmaWx0ZXJpbmdcIikpO1xuICAgICAgb3B0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjaGVja2VkXCIpKTsgLy8gaGlkZSByc2V0IG9wdGlvbiBidXR0b25cbiAgICAgIGNvbnRyb2xsZXJzLmZvckVhY2goY29udHJvbGxlciA9PiBjb250cm9sbGVyLmNoZWNrZWQgPSBmYWxzZSk7IC8vIHJlc2V0IGFsbCBpbnB1dCBjb250cm9sbGVyc1xuICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMoKTtcbiAgICAgIHJlc2V0LmNsb3Nlc3QoXCIuZmlsdGVyc19fcmVzZXRcIikuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gc2hvdyBoaWRkZW4gY2FyZHMgYXMgZGVsZXRlIGRhdGEtZGlzcGxheSBhdHRyaWJ1dGVzXG4gICAgICAgIGNhcmRzLmZvckVhY2goY2FyZCA9PiB7XG4gICAgICAgICAgZm9yIChjb25zdCB0eXBlIG9mIGRlbGV0ZWRUeXBlcykge1xuICAgICAgICAgICAgY2FyZC5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3R5cGV9YCk7XG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2hlY2tGaWx0ZXJlZFNlY3Rpb24oKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGNoZWNrRmlsdGVyZWRTZWN0aW9uID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNlY3Rpb25zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIikpO1xuXG4gICAgc2VjdGlvbnMuZm9yRWFjaChzZWN0aW9uID0+IHtcbiAgICAgIGNvbnN0IGZpbHRlcmVkSXRlbXMgPSBBcnJheS5mcm9tKHNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xuICAgICAgY29uc3Qgc2hvd25JdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGkgPT4gIWkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZVwiKSk7XG5cbiAgICAgIGlmIChzaG93bkl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNwaW5uZXIuaGlkZSgpO1xuICAgIHNlY3Rpb25zLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShcImZpbHRlcmluZ1wiKSk7XG5cbiAgICBzaG93QW5pbUVsZW1lbnRzKCk7XG4gICAgc2V0QW5pbWF0aW9uRWxtcygpO1xuICAgIGNoZWNrTm9GaWx0ZXJNc2coKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IChub2RlKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcblxuICAgIGxldCBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuXG4gICAgICBpZiAoYXR0cmlidXRlTmFtZS5zdGFydHNXaXRoKFwiZGF0YS1kaXNwbGF5XCIpKSB7XG4gICAgICAgIGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGNoZWNrRmlsdGVyZWRJdGVtID0gKHByb3AsIHZhbCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGl0ZW1zLmZvckVhY2goaSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGkuZGF0YXNldC5maWx0ZXIpO1xuICAgICAgICBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShkYXRhW3Byb3BdKTtcblxuICAgICAgICBjb25zdCBpc01hdGNoZWQgPSBpc0FycmF5XG4gICAgICAgICAgPyBkYXRhW3Byb3BdLmluY2x1ZGVzKHZhbClcbiAgICAgICAgICA6IGRhdGFbcHJvcF0gPT09IHZhbDtcblxuXG4gICAgICAgIGlmIChpc01hdGNoZWQpIHtcbiAgICAgICAgICBpLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gKTtcbiAgICAgICAgICBpZiAoIWhhc0RhdGFEaXNwbGF5QXR0cmlidXRlKGkpKSBpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGkuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICAgICAgaS5zZXRBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YCwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tGaWx0ZXJlZFNlY3Rpb24oKTtcbiAgICAgIH0pO1xuICAgIH0sIDEwMDApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGFjdGl2ZUNvbG9ySW5JdGVtID0gKHZhbCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLXRhcmdldC10eXBlPVwiJHt2YWx9XCJdYCkpO1xuXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IGkuY2xpY2soKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgaW5pdEZpbHRlclNlbGVjdCA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdlLWNhdGFsb2dcIik7XG4gICAgaWYgKGlzUGFnZUNhdGFsb2cpIHJldHVybjtcblxuICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVycyBpbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJdOm5vdChbdmFsdWU9XFxcInJlc2V0XFxcIl0pXCIpKTtcblxuICAgIGNvbnN0IGZpbHRlcmVkU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKTtcblxuICAgIGNvbnN0IHJlc2V0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWx0ZXJzX19yZXNldFwiKTtcblxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBmaWx0ZXJlZFNlY3Rpb24uZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKFwiZmlsdGVyaW5nXCIpKTtcbiAgICAgIHNwaW5uZXIuc2hvdygpO1xuICAgICAgY2hlY2tGaWx0ZXJlZEl0ZW0odGhpcy5uYW1lLCB0aGlzLnZhbHVlKTtcbiAgICAgIGFjdGl2ZUNvbG9ySW5JdGVtKHRoaXMudmFsdWUpO1xuICAgICAgdGhpcy5jbG9zZXN0KFwiLmZpbHRlcnNfX29wdGlvbnNcIikuY2xhc3NMaXN0LmFkZChcImNoZWNrZWRcIik7XG4gICAgICByZXNldEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IHJlbW92ZURhdGFGaWx0ZXJBdHRyaWJ1dGUgPSAocHJvcCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLWRpc3BsYXktJHtwcm9wfV1gKSk7XG5cbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xuICAgICAgaS5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YCk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgY2hlY2tBbGxJdGVtc0hhc0Rpc3BsYXlBdHRyaWJ1dGVzID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcblxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiB7XG4gICAgICBpZiAoIWhhc0RhdGFEaXNwbGF5QXR0cmlidXRlKGkpKSB7XG4gICAgICAgIGkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgcmVzZXRBbGxDb250cm9sbGVyc0J5TmFtZSA9IChuYW1lKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7bmFtZX1dYCkpO1xuICAgIGl0ZW1zLmZvckVhY2goaSA9PiBpLmNoZWNrZWQgPSBmYWxzZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGFiTGlzdHMgPSBBcnJheS5mcm9tKGRvY3VtZW50XG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkcy1zZXJpZXNfX2NvbnRyb2xzXCIpKTtcblxuICAgIHRhYkxpc3RzLmZvckVhY2gobGlzdCA9PiB7XG4gICAgICBsaXN0LnF1ZXJ5U2VsZWN0b3IoXCIuY2FyZHMtc2VyaWVzX190YWJcIik/LmNsaWNrKCk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxuY29uc3QgY2hlY2tBbGxGaWx0ZXJSZXNldEJ0biA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpc0NoZWNrZWRGaWx0ZXIgPSBkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVyc19fbGlzdCBpbnB1dDpjaGVja2VkXCIpO1xuXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbHRlcnNfX3Jlc2V0XCIpO1xuXG4gICAgaXNDaGVja2VkRmlsdGVyLmxlbmd0aCA9PT0gMFxuICAgICAgPyByZXNldC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIilcbiAgICAgIDogcmVzZXQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XG4gIH1cbn07XG5cbmNvbnN0IGluaXRSZXNldEZpbHRlclByb3AgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1jYXRhbG9nXCIpO1xuICAgIGlmIChpc1BhZ2VDYXRhbG9nKSByZXR1cm47XG5cbiAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnMgaW5wdXRbdmFsdWU9XFxcInJlc2V0XFxcIl1cIikpO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpO1xuXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHNlY3Rpb25zLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChcImZpbHRlcmluZ1wiKSk7XG4gICAgICBzcGlubmVyLnNob3coKTtcbiAgICAgIHRoaXMuY2xvc2VzdChcIi5maWx0ZXJzX19vcHRpb25zXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJjaGVja2VkXCIpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVtb3ZlRGF0YUZpbHRlckF0dHJpYnV0ZSh0aGlzLm5hbWUpO1xuICAgICAgICBjaGVja0FsbEl0ZW1zSGFzRGlzcGxheUF0dHJpYnV0ZXMoKTtcbiAgICAgICAgY2hlY2tGaWx0ZXJlZFNlY3Rpb24oKTtcbiAgICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0J5TmFtZSh0aGlzLm5hbWUpO1xuICAgICAgICByZXNldEFsbENvbnRyb2xsZXJzSW5JdGVtcygpO1xuICAgICAgICBjaGVja0FsbEZpbHRlclJlc2V0QnRuKCk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcbiAgfVxufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgdHJ5IHtcbiAgICBpbml0RmlsdGVyc0Ryb3AoKTtcbiAgICBpbml0RmlsdGVyc1Jlc2V0KCk7XG4gICAgaW5pdEZpbHRlclNlbGVjdCgpO1xuICAgIGluaXRSZXNldEZpbHRlclByb3AoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xuICB9XG59KTsiLCJjb25zdCBpbml0TW9kYWwgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbF0nKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZGF0YXNldC5tb2RhbFRhcmdldFxyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuZGF0YXNldC5tb2RhbEFjdGlvblxyXG5cclxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlICdzaG93JzpcclxuICAgICAgICAgICAgICAgIHNob3dNb2RhbEJhY2soKVxyXG4gICAgICAgICAgICAgICAgc2hvd01vZGFsRGlhbG9nKHRhcmdldClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd0b2dnbGUnOlxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlTW9kYWxEaWFsb2codGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Nsb3NlJzpcclxuICAgICAgICAgICAgICAgIGhpZGVNb2RhbERpYWxvZygpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGhpZGVNb2RhbEJhY2ssIDIwMClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWxCYWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxyXG5cclxuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gYmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JyksIDEwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlTW9kYWxCYWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hlYWRlcicpXHJcblxyXG4gICAgaWYgKCFiYWNrKSByZXR1cm5cclxuXHJcbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYmFjay5jbGFzc0xpc3QuYWRkKCdoaWRlJylcclxuICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgfSwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWxEaWFsb2cgPSAoaWQpID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXHJcbiAgICBjb25zdCBkaWFsb2cgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsX19kaWFsb2cnKVxyXG5cclxuICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICB9LCAxMClcclxufVxyXG5cclxuY29uc3QgaGlkZU1vZGFsRGlhbG9nID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLnNob3cnKVxyXG4gICAgaWYgKCF0YXJnZXQpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnaGlkZScpLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGluaXRDbG9zZU1vZGFsID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzT25Qb3B1cE1vZGFsID0gZS50YXJnZXQuY2xvc2VzdCgnLm1vZGFsX19kaWFsb2cnKVxyXG5cclxuICAgICAgICBpZihpc09uUG9wdXBNb2RhbCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGhpZGVNb2RhbERpYWxvZygpXHJcbiAgICAgICAgc2V0VGltZW91dChoaWRlTW9kYWxCYWNrLCAyMDApXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCB0b2dnbGVNb2RhbERpYWxvZyA9IChpZCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgaGlkZU1vZGFsRGlhbG9nKClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyksIDIwMClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICB9LCAzMDApXHJcbn1cclxuXHJcbmNvbnN0IGluaXRUb2dnbGVWaXNpYmxlUGFzcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbF9fdG9nZ2xlLXZpc2libGUtcGFzcycpKVxyXG5cclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcclxuICAgICAgICBjb25zdCBpc1RleHQgPSBpbnB1dC50eXBlID09PSAndGV4dCdcclxuXHJcbiAgICAgICAgaW5wdXQudHlwZSA9IGlzVGV4dCA/ICdwYXNzd29yZCcgOiAndGV4dCdcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ3Bhc3MtdmlzaWJsZScpXHJcbiAgICB9KSlcclxufVxyXG5cclxuY29uc3Qgc2hvd01vZGFsID0gKGlkKSA9PiB7XHJcbiAgICBzaG93TW9kYWxCYWNrKClcclxuICAgIHNob3dNb2RhbERpYWxvZyhpZClcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0TW9kYWwoKVxyXG4gICAgaW5pdENsb3NlTW9kYWwoKVxyXG4gICAgaW5pdFRvZ2dsZVZpc2libGVQYXNzKClcclxufSkiLCIvLyBQcm9kdWN0IGluZm9ybWF0aW9uIHNsaWRlclxyXG5sZXQgcHJvZHVjdEluZm9TbGlkZXJcclxuXHJcbmNvbnN0IGluaXRQcm9kdWN0SW5mb1NsaWRlciA9ICgpID0+IHtcclxuICAgIHByb2R1Y3RJbmZvU2xpZGVyID0gbmV3IFN3aXBlcignLnByb2R1Y3QtaW5mbyAuc3dpcGVyJywge1xyXG4gICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIC8vIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBhdXRvSGVpZ2h0OiB0cnVlLFxyXG4gICAgICAgIC8vIHNwYWNlQmV0d2VlbjogMTAsXHJcblxyXG4gICAgICAgIHNjcm9sbGJhcjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItc2Nyb2xsYmFyJyxcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICAgICAgNTc2OiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTkxKSB7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJbmZvU2xpZGVyKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RJbmZvU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSlcclxuICAgICAgICAgICAgcHJvZHVjdEluZm9TbGlkZXIgPSB1bmRlZmluZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcm9kdWN0SW5mb1NsaWRlcikge1xyXG4gICAgICAgIGluaXRQcm9kdWN0SW5mb1NsaWRlcigpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgaXNQcm9kdWN0UGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLXByb2R1Y3QnKVxyXG4gICAgY29uc3QgaXNBcnRpY2xlUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWFydGljbGUnKVxyXG4gICAgY29uc3QgaXNEb3RzUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWRvdHMnKVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgSW5mbyBzbGlkZXIgb25seSBmb3IgUHJvZHVjdCwgQXJ0aWNsZSBhbmQgRG90cyBwYWdlc1xyXG4gICAgaWYgKCFpc1Byb2R1Y3RQYWdlICYmICFpc0FydGljbGVQYWdlICYmICFpc0RvdHNQYWdlKSByZXR1cm5cclxuXHJcbiAgICBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyKClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIGNoZWNrUHJvZHVjdEluZm9TbGlkZXIoKVxyXG4gICAgfSlcclxufSlcclxuIiwiLy8gUHJvZHVjdCByZWNvbW1lbmRhdGlvbiBzbGlkZXJcclxubGV0IHByb2R1Y3RSZWNvbW1TbGlkZXJcclxuXHJcbmNvbnN0IGNoZWNrUmVjb21tU2xpZGVyU2Nyb2xsYmFyID0gKHN3aXBlciwgc2Nyb2xsYmFyKSA9PiB7XHJcbiAgICBpZiAoIXNjcm9sbGJhciB8fCBzY3JvbGxiYXIuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCBpc1Njcm9sbGJhckhpZGUgPSBzY3JvbGxiYXIuY2xhc3NMaXN0XHJcbiAgICAgICAgLmNvbnRhaW5zKCdzd2lwZXItc2Nyb2xsYmFyLWxvY2snKVxyXG5cclxuICAgIGlzU2Nyb2xsYmFySGlkZVxyXG4gICAgICAgID8gc3dpcGVyLmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1oaWRkZW4nKVxyXG4gICAgICAgIDogc3dpcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1oaWRkZW4nKVxyXG59XHJcblxyXG5jb25zdCBjaGVja1NsaWRlcnNCb3R0b21PZmZzZXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzd2lwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyJykpXHJcblxyXG4gICAgc3dpcGVycy5mb3JFYWNoKHN3aXBlciA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsYmFyID0gc3dpcGVyLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2Nyb2xsYmFyJylcclxuICAgICAgICBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhcihzd2lwZXIsIHNjcm9sbGJhcilcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXRQcm9kdWN0UmVjb21tU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgcHJvZHVjdFJlY29tbVNsaWRlciA9IG5ldyBTd2lwZXIoJy5yZWNvbW1lbmRhdGlvbl9fc2xpZGVyIC5zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgLy8gYXV0b0hlaWdodDogdHJ1ZSxcclxuXHJcbiAgICAgICAgc2Nyb2xsYmFyOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1zY3JvbGxiYXInLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA1NzY6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgOTkxOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMTIwMDoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzd2lwZXIgPSB0aGlzLmVsXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGxiYXIgPSB0aGlzLnNjcm9sbGJhci5lbFxyXG4gICAgICAgICAgICAgICAgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIoc3dpcGVyLCBzY3JvbGxiYXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiAxMjAwICYmIHByb2R1Y3RSZWNvbW1TbGlkZXIpIHtcclxuICAgICAgICBBcnJheS5pc0FycmF5KHByb2R1Y3RSZWNvbW1TbGlkZXIpXHJcbiAgICAgICAgICAgID8gcHJvZHVjdFJlY29tbVNsaWRlci5mb3JFYWNoKHNsaWRlciA9PiBzbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKSlcclxuICAgICAgICAgICAgOiBwcm9kdWN0UmVjb21tU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSlcclxuXHJcbiAgICAgICAgcHJvZHVjdFJlY29tbVNsaWRlciA9IHVuZGVmaW5lZFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJvZHVjdFJlY29tbVNsaWRlcikge1xyXG4gICAgICAgIGluaXRQcm9kdWN0UmVjb21tU2xpZGVyKClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1Byb2R1Y3RQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtcHJvZHVjdCcpXHJcbiAgICBjb25zdCBpc0FydGljbGVQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtYXJ0aWNsZScpXHJcbiAgICBjb25zdCBpc0RvdHNQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtZG90cycpXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBSZWNvbW1lbmRhdGlvbiBzbGlkZXIgb25seSBmb3IgUHJvZHVjdCwgQXJ0aWNsZSBhbmQgRG90cyBwYWdlc1xyXG4gICAgaWYgKCFpc1Byb2R1Y3RQYWdlICYmICFpc0FydGljbGVQYWdlICYmICFpc0RvdHNQYWdlKSByZXR1cm5cclxuXHJcbiAgICBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgY2hlY2tQcm9kdWN0UmVjb21tU2xpZGVyKClcclxuICAgICAgICBjaGVja1NsaWRlcnNCb3R0b21PZmZzZXQoKVxyXG4gICAgfSlcclxufSlcclxuIiwiY29uc3Qgc2hvd0J1dHRvblNjcm9sbFRvVG9wID0gKGJ1dHRvbikgPT4ge1xyXG4gICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWVxyXG5cclxuICAgIGlmIChzY3JvbGxUb3AgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5JylcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaW5pdFNjcm9sbFRvVG9wID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njcm9sbFRvVG9wJylcclxuXHJcbiAgICBpZiAoIWJ1dHRvbikgcmV0dXJuXHJcblxyXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc21vb3RoU2Nyb2xsVG8oMCkpXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4gc2hvd0J1dHRvblNjcm9sbFRvVG9wKGJ1dHRvbikpXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdFNjcm9sbFRvVG9wKClcclxufSkiLCIvKipcclxuICogU2hvdyBhIHNtYWxsIG1lc3NhZ2Ugd2l0aCB0aXRsZSBhbmQgdGV4dCBpbiB0aGUgdG9wIHJpZ2h0IGNvcm5lciBvZiB0aGUgc2NyZWVuLlxyXG4gKiBUaGUgbWV0aG9kIGV4cGVjdHMgYXQgbGVhc3Qgb25lIHBhcmFtZXRlciBwZXIgaW5wdXQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdGl0bGU9dW5kZWZpbmVkXSAtIFRoZSBoZWFkbGluZSBvZiB0aGUgbWVzc2FnZSBpbiBvbmUgbGluZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFttZXNzYWdlPXVuZGVmaW5lZF0gLSBPbmUgbGluZSBtZXNzYWdlIHRleHQuXHJcbiAqL1xyXG53aW5kb3cuc2hvd01vZGFsTXNnID0gZnVuY3Rpb24odGl0bGUgPSAnJywgbWVzc2FnZSA9ICcnKSB7XHJcbiAgICBpZiAoIXRpdGxlICYmICFtZXNzYWdlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZXJlJ3Mgbm8gdGl0bGUgb3IgbWVzc2FnZSBmb3Igc2hvd2luZyBpbiBtb2RhbCB3aW5kb3cuXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aXRsZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW5jb3JyZWN0IHR5cGUgb2YgdGl0bGUuIEl0IHNob3VsZCBiZSBzdHJpbmcuXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbmNvcnJlY3QgdHlwZSBvZiBtZXNzYWdlLiBJdCBzaG91bGQgYmUgc3RyaW5nLlwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21zZy1jb250YWluZXInKVxyXG4gICAgY29uc3QgW2NhcmQsIGJvZHldID0gY3JlYXRlTW9kYWxNc2dDYXJkKHRpdGxlLCBtZXNzYWdlKVxyXG5cclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYXJkKVxyXG4gICAgY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpXHJcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gY2FyZC5jbGFzc0xpc3QuYWRkKCd1bmNvbGxhcHNlZCcpLCA1MClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgfSwgMTAwKVxyXG5cclxuICAgIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5LCA1MDAwKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja01vZGFsTXNnQ29udGFpbmVyKCkge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbXNnLWNvbnRhaW5lcicpXHJcbiAgICBjb25zdCBpbm5lckVsbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLW1zZ19fY2FyZCcpXHJcblxyXG4gICAgaW5uZXJFbG1zLmxlbmd0aCA+IDBcclxuICAgICAgICA/IGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgICAgICA6IGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5JylcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTW9kYWxNc2dDYXJkKHRpdGxlLCBtZXNzYWdlKSB7XHJcbiAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtbXNnX19jYXJkJylcclxuXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtbXNnX19ib2R5JylcclxuXHJcbiAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpXHJcblxyXG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW1zZ19fY29udGVudCcpXHJcblxyXG4gICAgY29uc3QgY2FwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxyXG4gICAgY2FwdGlvbi50ZXh0Q29udGVudCA9IHRpdGxlXHJcblxyXG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgdGV4dC50ZXh0Q29udGVudCA9IG1lc3NhZ2VcclxuXHJcbiAgICBpZiAodGl0bGUpIGNvbnRlbnQuYXBwZW5kQ2hpbGQoY2FwdGlvbilcclxuICAgIGlmIChtZXNzYWdlKSBjb250ZW50LmFwcGVuZENoaWxkKHRleHQpXHJcblxyXG4gICAgYm9keS5hcHBlbmRDaGlsZChpY29uKVxyXG4gICAgYm9keS5hcHBlbmRDaGlsZChjb250ZW50KVxyXG5cclxuICAgIGNhcmQuYXBwZW5kQ2hpbGQoYm9keSlcclxuXHJcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGlkZU1vZGFsTXNnSGFuZGxlcilcclxuXHJcbiAgICByZXR1cm4gW2NhcmQsIGJvZHldXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVNb2RhbE1zZ0hhbmRsZXIoKSB7XHJcbiAgICBjb25zdCBjYXJkID0gdGhpc1xyXG4gICAgY29uc3QgYm9keSA9IGNhcmQucXVlcnlTZWxlY3RvcignLm1vZGFsLW1zZ19fYm9keScpXHJcbiAgICBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSlcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHksIHRpbWVvdXQgPSAwKSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXHJcbiAgICB9LCB0aW1lb3V0KVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScsICdoaWRkZW4nKVxyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgndW5jb2xsYXBzZWQnKVxyXG4gICAgfSwgdGltZW91dCArIDEwMClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjYXJkLnJlbW92ZSgpO1xyXG4gICAgICAgIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKVxyXG4gICAgfSwgdGltZW91dCArIDIwMClcclxufVxyXG4iLCJjb25zdCBzaG93U3Bpbm5lciA9ICgpID0+IHtcclxuICAgIGNvbnN0IHNwaW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpXHJcbiAgICBzcGlubmVyLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBzcGlubmVyLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKSwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlU3Bpbm5lciA9ICgpID0+IHtcclxuICAgIGNvbnN0IHNwaW5uZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpXHJcbiAgICBzcGlubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBzcGlubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKSwgMTAwMClcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKSkge1xyXG4gICAgICAgIHdpbmRvdy5zcGlubmVyLnNob3cgPSBzaG93U3Bpbm5lclxyXG4gICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUgPSBoaWRlU3Bpbm5lclxyXG4gICAgfVxyXG59KSIsIiIsIi8vIE9wZW4gYW5kIGNsb3NlIG1vYmlsZSBuYXZpZ2F0aW9uXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBuYXZDbG9zZSA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNsb3NlJykpXHJcbiAgICBjb25zdCBuYXZUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3Rlcl9fbmF2LWxpbmtfbWVudScpXHJcbiAgICBjb25zdCBoZWFkZXJOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYnKVxyXG4gICAgY29uc3QgbW9kYWxCYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbW9kYWwtYmFjaycpXHJcbiAgICBjb25zdCBuYXZQcm9kTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1saW5rX3Byb2R1Y3QnKVxyXG4gICAgY29uc3QgbmF2SXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKSlcclxuICAgIGNvbnN0IG5hdkxpbmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtbGluaycpKVxyXG4gICAgY29uc3QgbmF2Q29sbGFwc2VzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKSlcclxuXHJcbiAgICBpZiAoIW5hdlRvZ2dsZXIpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdiA9IChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAvLyBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG5hdlByb2RMaW5rLmNsaWNrKClcclxuICAgICAgICAgICAgfSwgMTAwKVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcbiAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBidXJnZXJcclxuICAgIG5hdlRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZU5hdihmYWxzZSlcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b2dnbGVOYXYodHJ1ZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBjbG9zZSBidXR0b25cclxuICAgIG5hdkNsb3NlLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PnRvZ2dsZU5hdihmYWxzZSkpXHJcbiAgICB9KVxyXG5cclxuICAgIG1vZGFsQmFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICB0b2dnbGVOYXYoZmFsc2UpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE9wZW4gYW5kIGNsb3NlIE5hdmlnYXRpb24gaXRlbXNcclxuICAgIGNvbnN0IGNvbGxhcHNBbGxOYXZJdGVtID0gKCkgPT4ge1xyXG4gICAgICAgIG5hdkl0ZW1zLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKSlcclxuICAgICAgICBuYXZMaW5rcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxuICAgICAgICBuYXZDb2xsYXBzZXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdkl0ZW0gPSAoYnRuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcblxyXG4gICAgICAgIGlmICghaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBjb25zdCBuYXZJdGVtID0gYnRuLmNsb3Nlc3QoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKVxyXG5cclxuICAgICAgICAgICAgaWYgKG5hdkl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hdkNvbGxhcHNlID0gbmF2SXRlbS5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKVxyXG5cclxuICAgICAgICAgICAgICAgIG5hdkl0ZW0uY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgICAgICBuYXZDb2xsYXBzZS5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuICAgICAgICAgICAgICAgIG1vZGFsQmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZMaW5rcy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZU5hdkl0ZW0odGhpcylcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFNlYXJjaGluZyBhbmQgU3RpY2t5IGhlYWRlclxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpXHJcbiAgICBjb25zdCBzZWFyY2hUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1jbG9zZScpXHJcbiAgICBjb25zdCBzZWFyY2hQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaCcpXHJcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1pbnB1dCcpXHJcbiAgICBjb25zdCBzZWFyY2hSZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1yZXNldCcpXHJcbiAgICBjb25zdCBzZWFyY2hIaW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1oaW50cycpXHJcblxyXG4gICAgaWYgKCFzZWFyY2hUb2dnbGVyKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCB0b2dnbGVTZWFyY2hQYW5lbCA9IChoaWRlID0gZmFsc2UpID0+IHtcclxuICAgICAgICBjb25zdCBpc1Zpc2libGUgPSBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSAxMDBcclxuXHJcbiAgICAgICAgaWYgKCFpc1Zpc2libGUgJiYgIWhpZGUpIHtcclxuICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZScpXHJcbiAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfd2l0aC1zZWFyY2gtcGFuZWwnKVxyXG4gICAgICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWFyY2hUb2dnbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoUmVzZXQuY2xpY2soKVxyXG4gICAgICAgICAgICByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlJylcclxuICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl93aXRoLXNlYXJjaC1wYW5lbCcpXHJcbiAgICAgICAgfSwgMjAwKVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaFRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgfSlcclxuXHJcbiAgICBzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCgpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL3NlYXJjaC5qc29uJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVzdC10ZWNobm9saWdodHYyLm1hc3NpdmUucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG5cclxuICAgIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICcvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVjaG5vbGlnaHQubGlnaHRvcHQucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgY29uc3QgVEhST1RUTEVfVElNRU9VVCA9IDMwMFxyXG4gICAgbGV0IHNlYXJjaFJlcXVlc3RUaW1lb3V0SWRcclxuXHJcbiAgICBjb25zdCBzZXRTdHJvbmdUZXh0ID0gKHN0ciwgcXVlcnkpID0+IHtcclxuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAocXVlcnksICdnaScpXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4LCBgPHN0cm9uZz4kJjwvc3Ryb25nPmApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJpbnRRdWVyeVJlc3VsdCA9IChkYXRhLCBxdWVyeSkgPT4ge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0J/QvtC70YPRh9C40LvQuCDQv9C+0LjRgdC60L7QstGD0Y4g0LLRi9C00LDRh9GDJywgZGF0YSk7XHJcblxyXG4gICAgICAgIC8vIFJlc2V0IGFsbCBjaGlsZHJlbiBub2RlcyBvZiBzZWFyY2ggaGludHNcclxuICAgICAgICB3aGlsZSAoc2VhcmNoSGludHMuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5yZW1vdmVDaGlsZChzZWFyY2hIaW50cy5maXJzdENoaWxkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGxpbmssIHNpbWlsYXIgb3IgTm8gUmVzdWx0XHJcbiAgICAgICAgY29uc3QgbGlua3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIGxpbmtzLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fc2VhcmNoLWxpbmtzJylcclxuXHJcbiAgICAgICAgY29uc3Qgc2ltaWxhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgc2ltaWxhci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX3NlYXJjaC1zaW1pbGFyJylcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIE5vIHJlc3VsdHNcclxuICAgICAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ25vLXJlc3VsdHMnKVxyXG4gICAgICAgICAgICBzcGFuLmlubmVyVGV4dCA9ICfQn9C+INCS0LDRiNC10LzRgyDQt9Cw0L/RgNC+0YHRgyDQvdC40YfQtdCz0L4g0L3QtSDQvdCw0LnQtNC10L3QvidcclxuICAgICAgICAgICAgbGlua3MuYXBwZW5kQ2hpbGQoc3BhbilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMaW5rc1xyXG4gICAgICAgICAgICBjb25zdCBoaW50ID0gZGF0YVswXVxyXG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcbiAgICAgICAgICAgIGxpbmsuaHJlZiA9IGhpbnQudXJsXHJcbiAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2V0U3Ryb25nVGV4dChoaW50LnRpdGxlLCBxdWVyeSlcclxuICAgICAgICAgICAgbGlua3MuYXBwZW5kQ2hpbGQobGluaylcclxuXHJcbiAgICAgICAgICAgIC8vIFNpbWlsYXJcclxuICAgICAgICAgICAgc2ltaWxhci5pbm5lckhUTUwgPSAnPGg1PtGB0LzQvtGC0YDQuNGC0LUg0L/QvtGF0L7QttC40LU8L2g1PidcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbnVtIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudW0gPCAxKSBjb250aW51ZVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIExpbmtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhpbnQgPSBkYXRhW251bV1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcclxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IGhpbnQudXJsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSW1hZ2VcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBpY1NwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICAgICAgICAgIHBpY1NwYW4uY2xhc3NMaXN0LmFkZCgncGljJylcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IGhpbnQuaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltZy5hbHQgPSBoaW50LnRpdGxlXHJcbiAgICAgICAgICAgICAgICBwaWNTcGFuLmFwcGVuZENoaWxkKGltZylcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUZXh0XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAgICAgdGV4dFNwYW4uY2xhc3NMaXN0LmFkZCgndGV4dCcpXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3Bhbi5pbm5lckhUTUwgPSBzZXRTdHJvbmdUZXh0KGhpbnQudGl0bGUsIHF1ZXJ5KVxyXG5cclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQocGljU3BhbilcclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQodGV4dFNwYW4pXHJcbiAgICAgICAgICAgICAgICBzaW1pbGFyLmFwcGVuZENoaWxkKGxpbmspXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG51bSA+IDYpIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKGxpbmtzKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKHNpbWlsYXIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQndGD0LbQvdC+INGC0L7Qu9GM0LrQviDQtNC70Y8g0L/QvtC70L3QvtCz0L4g0LzQtdC90Y5cclxuICAgICAgICAvLyBzZXRIYW5kbGVyVG9IZWxwZXJzKClcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZldGNoU2VhcmNoaW5nRGF0YSA9IGFzeW5jKHF1ZXJ5KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goU0VBUkNIX1JFUVVFU1RfVVJMICsgYD9xdWVyeT0ke3F1ZXJ5fWApXHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlcy5vaykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LfQsNC/0YDQvtGB0LAg0L/QvtC40YHQutCwJylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICAgICAgcHJpbnRRdWVyeVJlc3VsdChkYXRhLCBxdWVyeSlcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gJycgKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gU1RBUlRcclxuICAgICAgICBjbGVhclRpbWVvdXQoc2VhcmNoUmVxdWVzdFRpbWVvdXRJZClcclxuICAgICAgICBzZWFyY2hSZXF1ZXN0VGltZW91dElkID0gc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gZmV0Y2hTZWFyY2hpbmdEYXRhKHRoaXMudmFsdWUpLFxyXG4gICAgICAgICAgICBUSFJPVFRMRV9USU1FT1VUXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gRklOSVNIXHJcbiAgICB9KVxyXG5cclxuICAgIHNlYXJjaFJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycygpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJylcclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBjb25zdCBpc1NlYXJjaFRvZ2dsZSA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuaGVhZGVyX19idXR0b25zLWxpbmtfc2VhcmNoJylcclxuXHJcbiAgICAgICAgY29uc3QgaXNTZWFyY2hQYW5lbCA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCcuaGVhZGVyX19zZWFyY2gnKVxyXG5cclxuICAgICAgICBjb25zdCBpc1RhY2hEZXZpY2UgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDk5MlxyXG5cclxuICAgICAgICBpZiAoIWlzVGFjaERldmljZSAmJiAhaXNTZWFyY2hQYW5lbCAmJiAhaXNTZWFyY2hUb2dnbGUpIHtcclxuICAgICAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwodHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIC8vIFNldCBoZWxwIHRleHQgZnJvbSBoZWxwZXIgYnV0dG9uIHVuZGVyIHRoZSBzZWFyY2ggaW5wdXQgdG8gdGhlIHNlYXJjaCB2YWx1ZVxyXG4gICAgY29uc3QgcmVxdWVzdENvbXBsZXRpb24gPSAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFkZGl0aW9uVmFsdWUgPSBlLnRhcmdldC5pbm5lclRleHRcclxuICAgICAgICBzZWFyY2hJbnB1dC52YWx1ZSA9IGAke3NlYXJjaElucHV0LnZhbHVlfSAke2FkZGl0aW9uVmFsdWV9YFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEhhbmRsZXJUb0hlbHBlcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoSGVscGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX3NlYXJjaC1oZWxwcyBzcGFuJykpXHJcblxyXG4gICAgICAgIHNlYXJjaEhlbHBlcnMuZm9yRWFjaChidG4gPT4gYnRuXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlcXVlc3RDb21wbGV0aW9uKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNldEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEhlbHBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19zZWFyY2gtaGVscHMgc3BhbicpKVxyXG5cclxuICAgICAgICBzZWFyY2hIZWxwZXJzLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgYnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVxdWVzdENvbXBsZXRpb24pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGlja3kgaGVhZGVyXHJcbiAgICBsZXQgYmVmb3JlU2Nyb2xsVG9wID0gMFxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XHJcbiAgICAgICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkZXJcIilcclxuICAgICAgICBjb25zdCBoZWFkZXJIZWlnaHQgPSBoZWFkZXIuY2xpZW50SGVpZ2h0XHJcbiAgICAgICAgY29uc3QgZGVsYXkgPSAnLjdzJ1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDk5MSkge1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdjb21wcmVzc2VkJylcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbXByZXNzZWQnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50U2Nyb2xsVG9wID4gMTAwICYmIGN1cnJlbnRTY3JvbGxUb3AgPiBiZWZvcmVTY3JvbGxUb3ApIHtcclxuICAgICAgICAgICAgY29uc3QgaXNWaXNpYmxlU2VhcmNoID0gc2VhcmNoUGFuZWxcclxuICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICAgICAgbGV0IGludGVydmFsSWRcclxuXHJcbiAgICAgICAgICAgIGlmIChpc1Zpc2libGVTZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwodHJ1ZSlcclxuICAgICAgICAgICAgICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9ICcwcydcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXIuc3R5bGUudG9wID0gYC0ke2hlYWRlckhlaWdodH1weGBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBoZWFkZXIuc3R5bGUudG9wID0gMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmVmb3JlU2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICB9KTtcclxufSlcclxuXHJcbi8vIENhcnQgdXBkYXRlIGxpc3RlbmluZ1xyXG5jb25zdCBzZXRDYXJ0VXBkYXRlTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0UHJvZHVjdENvdW50Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJ0UHJvZHVjdENvdW50JylcclxuXHJcbiAgICBpZiAoIWNhcnRQcm9kdWN0Q291bnROb2RlKSByZXR1cm5cclxuXHJcbiAgICBjYXJ0UHJvZHVjdENvdW50Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdjYXJ0VXBkYXRlRXZlbnQnLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzID0gd2luZG93LkNBUlQucHJvZHVjdHNcclxuICAgICAgICBsZXQgcHJvZHVjdENvdW50ID0gMFxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZXJhdG9yIG9mIHByb2R1Y3RzKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RDb3VudCArPSBpdGVyYXRvci5jb3VudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuaW5uZXJUZXh0ID0gcHJvZHVjdENvdW50XHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuZGF0YXNldC5jb3VudCA9IHByb2R1Y3RDb3VudC50b1N0cmluZygpXHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2FydFByb2R1Y3RDb3VudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSwgMTAwMClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZS5kZXRhaWwubWVzc2FnZSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgc2V0Q2FydFVwZGF0ZUxpc3RlbmVyKClcclxufSlcclxuXHJcbi8vIE9wZW4gYW5kIGNsb3NlIHN1Ykxpc3RzXHJcbmNvbnN0IHRvZ2dsZVN1Yk5hdkxpc3RzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdG9nZ2xlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pbm5lci10b2dnbGUnKSlcclxuXHJcbiAgICBjb25zdCBjbG9zZUFsbFRvZ2dsZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZXJzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3cmFwID0gZWwuY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWlubmVyLWNhcHRpb24nKVxyXG4gICAgICAgICAgICB3cmFwLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY29sbGFwc2UgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1zdWJsaXN0LWNvbGxhcHNlJylcclxuICAgICAgICAgICAgY29sbGFwc2UuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcblxyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb25zdCB3cmFwID0gZWwuY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWlubmVyLWNhcHRpb24nKVxyXG4gICAgICAgIGNvbnN0IGNvbGxhcHNlID0gd3JhcC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtc3VibGlzdC1jb2xsYXBzZScpXHJcbiAgICAgICAgY29uc3QgaXNDdXJyZW50RHJvcHBlZCA9IHdyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wcGVkJylcclxuXHJcbiAgICAgICAgY2xvc2VBbGxUb2dnbGVycygpXHJcblxyXG4gICAgICAgIC8vIFRvZ2dsZSBjdXJyZW50XHJcbiAgICAgICAgaWYgKCFpc0N1cnJlbnREcm9wcGVkKSB7XHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG5cclxuICAgIC8vIENsb3NlIGFsbCBzdWJuYXYgbGlzdCBvbiBvdXQgY2xpY2tcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNUYXJnZXQgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xhc3NMaXN0XHJcbiAgICAgICAgICAgIC5jb250YWlucygnaGVhZGVyX19uYXYtaW5uZXItdG9nZ2xlJylcclxuXHJcbiAgICAgICAgaWYoIWlzVGFyZ2V0KSBjbG9zZUFsbFRvZ2dsZXJzKClcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgdG9nZ2xlU3ViTmF2TGlzdHMoKVxyXG59KVxyXG4iLCIvLyBEZWxldGluZyBibG9ja2luZyBvZiBhbGwgYW5pbWF0aW9uIGZvciBmaXggYW5pbWF0aW9uIGFydGVmYWN0c1xyXG5jb25zdCByZW1vdmVBbmltYXRpb25CbG9ja2VyID0gKCkgPT4ge1xyXG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHJhbnNpdGlvbi1ibG9ja2VyJykpXHJcbiAgICAgICAgLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgndHJhbnNpdGlvbi1ibG9ja2VyJykpXHJcbn1cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCByZW1vdmVBbmltYXRpb25CbG9ja2VyKVxyXG5cclxuLy8gQmxvY2tpbmcgYWxsIGFuaW1hdGlvbiBhdCB0aGUgd2luZG93IHJlc2l6aW5nIHByb2Nlc3NcclxuY29uc3QgYWRkQW5pbWF0aW9uQmxvY2tlciA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndHJhbnNpdGlvbi1ibG9ja2VyJylcclxufVxyXG5cclxubGV0IGJsb2NrQW5pbWF0aW9uVGltZXJcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgIGNsZWFyVGltZW91dChibG9ja0FuaW1hdGlvblRpbWVyKVxyXG4gICAgYWRkQW5pbWF0aW9uQmxvY2tlcigpXHJcblxyXG4gICAgYmxvY2tBbmltYXRpb25UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIoKVxyXG4gICAgfSwgMzAwKVxyXG59KVxyXG5cclxuLy8gSGFuZGxlIGxpbmsgd2l0aCBzbW9vdGggYW5pbWF0aW9uIHRvIGFuY2hvciBwbGFjZSBvbiB0aGUgcGFnZVxyXG5jb25zdCBzbW9vdGhMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl49XCIjXCJdJylcclxuZm9yIChsZXQgc21vb3RoTGluayBvZiBzbW9vdGhMaW5rcykge1xyXG4gICAgc21vb3RoTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIGNvbnN0IGlkID0gc21vb3RoTGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtpZH1gKVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSB0YXJnZXROb2RlLm9mZnNldFRvcFxyXG4gICAgICAgICAgICBjb25zdCBkZXZpY2VPZmZzZXQgPSB3aW5kb3cub3V0ZXJXaWR0aCA+IDc2OCA/IC0xMDAgOiAtMjBcclxuXHJcbiAgICAgICAgICAgIHNtb290aFNjcm9sbFRvKHRhcmdldE9mZnNldCArIGRldmljZU9mZnNldCwgNzAwKVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSdzIG5vIHRhcmdldCBub2RlIGZvciBzY3JvbGxpbmcgdG8gcGxhY2UuIFRoZSBzZWxlY3RvciBpc24ndCBjb3JyZWN0IVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59O1xyXG5cclxuLy8gQW5pbWF0aW9uIGl0ZW1zIHdoZW4gdXNlciBoYXMgc2Nyb2xsZWQgc2NyZWVuIHRvIHBsYWNlIG9mIGl0ZW1cclxuY29uc3QgY2hlY2tBbmltYXRpb25FbG1zID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRWxtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGlvbi1lbGVtZW50JykpXHJcblxyXG4gICAgcmV0dXJuIGFuaW1hdGlvbkVsbXMubGVuZ3RoID4gMFxyXG59XHJcblxyXG5jb25zdCBzaG93QW5pbUVsZW1lbnRzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZWxtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGlvbi1lbGVtZW50JykpXHJcblxyXG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIC8vIGNvbnN0IHBvaW50T2ZEaXNwbGF5ID0gd2luZG93SGVpZ2h0IC8gMS4yIC8vIGZvciBzaG93IG9uIHRoZSBoYWxmIG9mIHRoZSBzY3JlZW5cclxuICAgIGNvbnN0IHBvaW50T2ZEaXNwbGF5ID0gd2luZG93SGVpZ2h0XHJcblxyXG4gICAgZWxtcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbVRvcCA9IHJlY3QudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XHJcblxyXG4gICAgICAgIGlmIChkaXN0YW5jZUZyb21Ub3AgLSBwb2ludE9mRGlzcGxheSA8IHNjcm9sbFRvcCkge1xyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRpb24tZWxlbWVudCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoIWNoZWNrQW5pbWF0aW9uRWxtcygpKSB7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNob3dBbmltRWxlbWVudHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNldEFuaW1hdGlvbkVsbXMgPSAoKSA9PiB7XHJcbiAgICBpZiAoY2hlY2tBbmltYXRpb25FbG1zKCkpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2hvd0FuaW1FbGVtZW50cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBzaG93QW5pbUVsZW1lbnRzKClcclxuICAgICAgICBzZXRBbmltYXRpb25FbG1zKClcclxuICAgIH0sIDEwMClcclxufSlcclxuXHJcbi8vIFBob25lIG1hc2tpbmdcclxuY29uc3QgaW5pdFBob25lc01hc2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBwaG9uZUlucHV0cyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9XCJ0ZWxcIl06bm90KC5jYXJ0X19jYWxjIFt0eXBlPVwidGVsXCJdKScpKVxyXG5cclxuICAgIHBob25lSW5wdXRzLmZvckVhY2gocGhvbmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBob25lTWFza09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIG1hc2s6ICcrezd9ICgwMDApIDAwMC0wMC0wMCcsXHJcbiAgICAgICAgICAgIGxhenk6IHRydWUsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyQ2hhcjogJyMnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBob25lTWFzayA9IElNYXNrKFxyXG4gICAgICAgICAgICBwaG9uZSxcclxuICAgICAgICAgICAgcGhvbmVNYXNrT3B0aW9uc1xyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgcGhvbmUuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogZmFsc2V9KSlcclxuICAgICAgICBwaG9uZS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IHRydWV9KSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdFBob25lc01hc2soKVxyXG59KVxyXG5cclxuLy8gRml4aW5nIGNoYXQtMjQgd2lkZ2V0IHBvc2l0aW9uIC0tIFNUQVJUXHJcbmxldCBjaGF0MjRJbnRlcnZhbElkID0gbnVsbFxyXG5sZXQgY2hhdDI0VGltZW91dElkID0gbnVsbFxyXG5sZXQgY2hhcnQyNFN0eWxlTm9kZSA9IG51bGxcclxubGV0IGNoYXJ0MjROb2RlID0gbnVsbFxyXG5cclxuY29uc3QgZml4Q2hhdDI0V2lkZ2V0UG9zaXRpb24gPSAoKSA9PiB7XHJcbiAgICBjaGFydDI0Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NoYXQtMjQnKVxyXG5cclxuICAgIGlmICghY2hhcnQyNE5vZGUpIHJldHVyblxyXG5cclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDEwMjQgJiYgIWNoYXJ0MjRTdHlsZU5vZGUpIHtcclxuICAgICAgICBjaGFydDI0U3R5bGVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxyXG5cclxuICAgICAgICBjaGFydDI0U3R5bGVOb2RlLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgLnN0YXJ0QnRuLnN0YXJ0QnRuLS1vdXRzaWRlLnN0YXJ0QnRuLS1ib3R0b20ge1xyXG4gICAgICAgICAgICAgICAgYm90dG9tOiA2N3B4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC5zdGFydEJ0bi5zdGFydEJ0bi0tb3BlbiB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNTAlKSBzY2FsZSgwLjYpICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjaGFydDI0Tm9kZS5zaGFkb3dSb290LnByZXBlbmQoY2hhcnQyNFN0eWxlTm9kZSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gMTAyNCAmJiBjaGFydDI0U3R5bGVOb2RlICE9PSBudWxsKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJ0MjRTdHlsZU5vZGUnLCBjaGFydDI0U3R5bGVOb2RlKTtcclxuICAgICAgICBjaGFydDI0U3R5bGVOb2RlLnJlbW92ZSgpXHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZSA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckludGVydmFsKGNoYXQyNEludGVydmFsSWQpXHJcbiAgICBjaGF0MjRJbnRlcnZhbElkID0gbnVsbFxyXG5cclxuICAgIGNsZWFyVGltZW91dChjaGF0MjRUaW1lb3V0SWQpXHJcbiAgICBjaGF0MjRUaW1lb3V0SWQgPSBudWxsXHJcbn1cclxuXHJcbmNvbnN0IGNoYXQyNFJlbmRlckxpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgY2hhdDI0SW50ZXJ2YWxJZCA9IHNldEludGVydmFsKGZpeENoYXQyNFdpZGdldFBvc2l0aW9uLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGhhcmRSZW1vdmVDaGF0MjRSZW5kZXJMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGNoYXQyNFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGlmIChjaGF0MjRJbnRlcnZhbElkKSBjbGVhckludGVydmFsKGNoYXQyNEludGVydmFsSWQpXHJcbiAgICB9LCAxMDAwMClcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjaGF0MjRSZW5kZXJMaXN0ZW5lcigpXHJcbiAgICBoYXJkUmVtb3ZlQ2hhdDI0UmVuZGVyTGlzdGVuZXIoKVxyXG59KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDEwMjQpIHtcclxuICAgICAgICBjaGF0MjRSZW5kZXJMaXN0ZW5lcigpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYXJ0MjRTdHlsZU5vZGUpIGNoYXJ0MjRTdHlsZU5vZGUucmVtb3ZlKClcclxufSlcclxuLy8gRml4aW5nIGNoYXQtMjQgd2lkZ2V0IHBvc2l0aW9uIC0tIEZJTklTSCIsIi8vIEluaXQgY2FydCBjdXN0b20gRXZlbnRcclxuY29uc3QgY2FydEV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjYXJ0VXBkYXRlRXZlbnQnLCB7XHJcbiAgICBkZXRhaWw6IHtcclxuICAgICAgICBtZXNzYWdlOiAnRmlyZWQgY2FydCBwcm9kdWN0IHVwZGF0ZWQgY3VzdG9tIEV2ZW50ISdcclxuICAgIH0sXHJcbiAgICBidWJibGVzOiBmYWxzZSxcclxuICAgIGNhbmNlbGFibGU6IGZhbHNlXHJcbn0pXHJcblxyXG5jb25zdCBub3JtYWxpemVSZXNwb25zZUNhcnREYXRhID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3RzID0gW11cclxuXHJcbiAgICBpZiAoZGF0YS5kb3RzKSB7XHJcbiAgICAgICAgZGF0YS5kb3RzLmZvckVhY2goZG90ID0+IHtcclxuICAgICAgICAgICAgcHJvZHVjdHMucHVzaCh7IGFydGljbGU6IGRvdC5pZCwgY291bnQ6IGRvdC5jb3VudCB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnByb2R1Y3RzKSB7XHJcbiAgICAgICAgZGF0YS5wcm9kdWN0cy5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG4gICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHsgYXJ0aWNsZTogcHJvZHVjdC5hcnRpY2xlLCBjb3VudDogcHJvZHVjdC5jb3VudCB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwcm9kdWN0c1xyXG59XHJcblxyXG4vLyBNZXRob2RzIHRvIHdvcmsgd2l0aCBjYXJ0IGZvciBQUk9EVUNUU1xyXG53aW5kb3cuc2V0UHJvZHVjdFRvQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGJ0LDQtdC8INGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGC0L7QstCw0YDQsCDQsiDQutC+0YDQt9C40L3QtTonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgLy8gY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1zZXQuanNvbicsIHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L3NldCcsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGB0YLQuNC70Lgg0YLQvtCy0LDRgCDQsiDQutC+0YDQt9C40L3QtS4g0J/QvtC70YPRh9C40LvQuCDQvtGC0LLQtdGCJywgZGF0YSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YDQsNC30LzQtdGJ0LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINCa0L7RgNC30LjQvdC1ISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRQcm9kdWN0VG9DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCfQlNC+0LHQsNCy0LvQtdC90LjQtSDRgtC+0LLQsNGA0LAg0LIg0LrQvtGA0LfQuNC90YM6JywgYXJ0LCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnYXJ0JywgYXJ0KVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIC8vIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtYWRkLmpzb24nLCB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9hZGQnLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGFcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQuNC70Lgg0YLQvtCy0LDRgCDQsiDQutC+0YDQt9C40L3Rgy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LUnLCBkYXRhKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDQtNC+0LHQsNCy0LvQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LIg0JrQvtGA0LfQuNC90YMhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LnJlbW92ZVByb2R1Y3RGcm9tQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuXHJcbiAgICBjb25zb2xlLmxvZygn0KPQtNCw0LvQtdC90LjQtSDRgtC+0LLQsNGA0LAg0LjQtyDQutC+0YDQt9C40L3RizonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgLy8gY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1kZWwuanNvbicsIHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2RlbCcsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KPQtNCw0LvQuNC70Lgg0YLQvtCy0LDRgCDQuNC3INC60L7RgNC30LjQvdGLLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtScsIGRhdGEpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGD0LTQsNC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINC40Lcg0JrQvtGA0LfQuNC90YshINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxuLy8gTWV0aG9kcyB0byB3b3JrIHdpdGggY2FydCBmb3IgRE9UU1xyXG53aW5kb3cuc2V0RG90VG9DYXJ0ID0gYXN5bmMgKHtpZCwgY291bnR9KSA9PiB7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRidCw0LXQvCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQlNC+0YLQvtCyINCyINC60L7RgNC30LjQvdC1OicsIGlkLCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnaWQnLCBpZClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICAvLyBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LXNldERvdC5qc29uJywge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvc2V0Jywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YHRgtC40LvQuCDQlNC+0YLRiyDQsiDQutC+0YDQt9C40L3QtS4g0J/QvtC70YPRh9C40LvQuCDQvtGC0LLQtdGCJywgZGF0YSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YDQsNC30LzQtdGJ0LXQvdC40Y8g0JTQvtGC0L7QsiDQsiDQmtC+0YDQt9C40L3QtSEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRG90VG9DYXJ0ID0gYXN5bmMgKG9yZGVyKSA9PiB7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQu9C10L3QuNC1INC00L7RgtCwINCyINC60L7RgNC30LjQvdGDLiDQntGC0L/RgNCw0LLQu9GP0LXQvCDQtNCw0L3QvdGL0LU6Jywgb3JkZXIpXHJcblxyXG4gICAgLy8gY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1hZGREb3QuanNvbicsIHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2FkZERvdCcsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmRlcilcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcblxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcbiAgICAgICAgd2luZG93LnNob3dNb2RhbE1zZyhcItCU0L7QsdCw0LLQuNC70Lgg0JTQvtGCINCyINC60L7RgNC30LjQvdGDLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtVwiLCBkYXRhKVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LTQvtCx0LDQstC70LXQvdC40Y8g0JTQvtGC0LAg0LIg0JrQvtGA0LfQuNC90YMhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LnJlbW92ZURvdEZyb21DYXJ0ID0gYXN5bmMgKHtpZCwgY291bnR9KSA9PiB7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ9Cj0LTQsNC70LXQvdC40LUg0JTQvtGC0LAg0LjQtyDQutC+0YDQt9C40L3RizonLCBpZCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2lkJywgaWQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgLy8gY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1kZWxEb3QuanNvbicsIHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2RlbERvdCcsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0KPQtNCw0LvQuNC70LggRG90INC40Lcg0LrQvtGA0LfQuNC90YsuINCf0L7Qu9GD0YfQuNC70Lgg0LTQsNC90L3Ri9C1JywgZGF0YSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YPQtNCw0LvQtdC90LjRjyDQlNC+0YLQsCDQuNC3INCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyBDYXJ0IFByb3h5XHJcbmNvbnN0IGNhcnRHZXQgPSAodGFyZ2V0LCBwcm9wKSA9PiB7XHJcbiAgICByZXR1cm4gdGFyZ2V0W3Byb3BdXHJcbn1cclxuXHJcbmNvbnN0IGNhcnRTZXQgPSAodGFyZ2V0LCBwcm9wLCB2YWwpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdTRVRUSU5HJyk7XHJcbiAgICBjb25zb2xlLmxvZygndGFyZ2V0JywgdGFyZ2V0KTtcclxuICAgIGNvbnNvbGUubG9nKCdwcm9wJywgcHJvcCk7XHJcbiAgICBjb25zb2xlLmxvZygndmFsJywgdmFsKTtcclxuXHJcbiAgICBpZiAocHJvcCA9PT0gJ3Byb2R1Y3RzJykge1xyXG4gICAgICAgIHRhcmdldC5wcm9kdWN0cyA9IFsuLi52YWxdXHJcblxyXG4gICAgICAgIC8vIERpc3BhdGNoaW5nIGN1c3RvbSBjYXJ0IHVwZGF0ZSBFdmVudFxyXG4gICAgICAgIGNvbnN0IGNhcnRQcm9kdWN0Q291bnROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhcnRQcm9kdWN0Q291bnQnKVxyXG4gICAgICAgIGlmIChjYXJ0UHJvZHVjdENvdW50Tm9kZSkgY2FydFByb2R1Y3RDb3VudE5vZGUuZGlzcGF0Y2hFdmVudChjYXJ0RXZlbnQpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuY29uc3QgaW5pdENhcnQgPSBhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3dpbmRvdy5DQVJUIGJlZm9yZScsIHdpbmRvdy5DQVJUKTtcclxuXHJcbiAgICBpZiAoIXdpbmRvdy5DQVJUKSB7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtZ2V0Lmpzb24nLCB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZ2V0Jywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5DQVJUID0gbmV3IFByb3h5KHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzOiBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBjYXJ0R2V0LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBjYXJ0U2V0XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVEFSVCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVzcG9uc2UgZGF0YScsIGRhdGEpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aW5kb3cuQ0FSVCcsIHdpbmRvdy5DQVJUKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGSU5JU0gnKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRDYXJ0KClcclxufSlcclxuXHJcbndpbmRvdy5jYXJ0VXBkYXRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LkNBUlQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIC8vIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtZ2V0Lmpzb24nLCB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZ2V0Jywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59LCA1MDAwKSJdfQ==
