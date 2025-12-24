// Частично логика фильтров находится в файле логики работы фильтра src\components\filters\script.js

// На стороне бэка нужно проинициализировать переменную window._PRODUCTS_PER_PAGE в которой храним количество товаров на странице каталога!
if (!window._PRODUCTS_PER_PAGE) {
    console.error('There is no variable number of products on the Catalog page! Should to add variable as window._PRODUCTS_PER_PAGE=10')
}

const RERENDER_PROD_TIMEOUT_DELAY = 1000

const setProdUrlParam = (name, val, type) => {
    let url = window.location.href

    // Проверяем, есть ли уже параметр с типом type и именем name в URL --- type[name]=
    if (url.indexOf(`${type}[${name}]=`) !== -1) {
        // Если значение val равно "reset", удаляем параметр из URL иначе обновляем на новое значение
        url = val === 'reset'
            ? url.replace(new RegExp(`(${type}\\[${name}\\]=)[^&]+`), '')
            : url.replace(new RegExp(`(${type}\\[${name}\\]=)[^&]+`), `$1${val}`)
    } else { // Если параметра с именем name нет в URL, добавляем его
        url += url.indexOf("?") !== -1
            ? `&${type}[${name}]=${val}`
            : `?${type}[${name}]=${val}`
    }

    // Только для фильтров и сортировки удаляем параметрт страницы, так как меняется выборка
    if (type === 'filter' || type === 'sort') {
        url = url.replace(/&?select\[page\]=[^&]*/g, '');
    }

    // Удаляем лишние & из url и ? для ULR без параметров
    url = url.replace(/&+/g, '&')
    url = url.replace(/\?&/g, '?')
    url = url.replace(/&$/g, '')
    url = url.replace(/\?$/, '')
    url = decodeURIComponent(url)

    // Обновляем URL страницы
    window.history.pushState({}, "", url);

    // Стартуем процесс обрботки данных
    processProdData(url)
}

const initDefaultProdCatalog = () => {
    if (window._CATALOG) return
    window._CATALOG = {}
}

const requestProductData = async () => {
    window._CATALOG = []
    const res = await fetch('https://anaragaev.github.io/technolight-ru/mocks/products.json')
    if (res.ok) {
        const parsedData = await res.json()

        if ('data' in parsedData) {
            window._CATALOG = parsedData.data
        } else {
            console.error('В запрошенных данных каталога нет объекта с данными! Предполагается наличие свойства с data.');
        }

        if (window._CATALOG.length === 0) {
            console.error('Пришел пустой объкт с данными!');
        }

    } else {
        console.error('Ошибка запроса каталога товаров! Код ошибки:', res.status)
    }
}

const checkProductResetAllButton = () => {
    const checkedFilters = Array.from(document
        .querySelectorAll('.filters__options.checked'))

    const resetAllButton = document.querySelector('.filters__reset')

    checkedFilters.length > 0
        ? resetAllButton.classList.remove('disabled')
        : resetAllButton.classList.add('disabled')
}

const undroppProductFilterLists = (filters) => {
    filters.forEach(filter => {
        filter.classList.remove('dropped')
        setTimeout(() => filter.classList.remove('active'), 300)
    })
}

const resetAllProductsFilters = (node) => {
    const container = node.closest('.page-catalog .filters')

    const filters = container
            .querySelectorAll('.filters__list .filters__item')

    const options = Array.from(document
            .querySelectorAll('.page-catalog .filters__options'))

    const controllers = Array.from(container
            .querySelectorAll('input[type="radio"]:not([value="reset"]'))

    undroppProductFilterLists(filters)
    options.forEach(el => el.classList.remove('checked')) // hide rset option button
    controllers.forEach(controller => controller.checked = false) // reset all input controllers
    node.closest('.filters__reset').classList.add('disabled')
}

const removeFilterParamFromCatalogUrl = (url, param) => {
    const strRegex = `${param}[^&]*`
    const regex = new RegExp(strRegex, 'g')
    return url.replace(regex, '')
}

const initCatalogFilterReset = () => {
    const reset = document.querySelector('.page-catalog .filters__reset .filters__item')
    if (!reset) return

    reset.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const deletedParams = JSON.parse(this.dataset.deletedParams)
        let url = window.location.href

        // Проверяем, есть ли GET параметры в URL
        if (url.indexOf('?') === -1) return

        for (const param of deletedParams) {
            url = removeFilterParamFromCatalogUrl(url, param)
        }

        // Удаляем лишние & из url и ? для ULR без параметров
        url = url.replace(/&+/g, '&')
        url = url.replace(/\?&/g, '?')
        url = url.replace(/&$/g, '')
        url = url.replace(/\?$/, '')
        url = decodeURIComponent(url)

        // Обновляем URL страницы без GET параметров
        window.history.pushState({}, "", url)

        // Сбрасываем все выбранные фильтры
        resetAllProductsFilters(this)

        // Стартуем процесс обрботки данных
        processProdData(url)
    })
}

const initCatalogFilterControllers = () => {
    const controllers = Array.from(document.querySelectorAll('.page-catalog .filters input[type="radio"]'))

    controllers.forEach(el => el.addEventListener('change', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const container = this.closest('.filters__options')

        this.value !== 'reset'
            ? container.classList.add('checked')
            : container.classList.remove('checked')

        setProdUrlParam(this.name, this.value, this.dataset.type)
        checkProductResetAllButton()
    }))
}

const getCurrentPageNumberFromUrl = () => {
    const url = window.location.href
    const params = new URLSearchParams(url.split('?')[1]);
    return params.get('select[page]');
}

const initCatalogPaginationControllers = () => {
    const countsOfPage = document.querySelectorAll('.page-catalog .pagination .pagination__btn_page').length
    const pagination = document.querySelector('.page-catalog .pagination')
    const controllers = Array.from(pagination.querySelectorAll('.page-catalog .pagination button'))
    const first = pagination.querySelector('[data-page="first"]')
    const last = pagination.querySelector('[data-page="last"]')
    const prev = pagination.querySelector('[data-page="prev"]')
    const next = pagination.querySelector('[data-page="next"]')

    const resetAllPaginationBtns = () => {
        controllers.forEach(el => el.classList.remove('disabled', 'active'))
    }

    const actievFirst = () => {
        first.classList.add('disabled')
        prev.classList.add('disabled')
        pagination.querySelector('[data-page="1"]').classList.add('active')
    }

    const activeLast = () => {
        last.classList.add('disabled')
        next.classList.add('disabled')
        pagination.querySelector(`[data-page="${countsOfPage}"]`).classList.add('active')
    }

    const activePage = (page) => {
        if (parseInt(page) === 1) {
            actievFirst()
            return
        }

        if (parseInt(page) === countsOfPage) {
            activeLast()
            return
        }

        pagination
            .querySelector(`[data-page="${page}"]`)
            .classList.add('active')
    }

    controllers.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()
        const currentPage = getCurrentPageNumberFromUrl()

        let page = this.dataset.page

        resetAllPaginationBtns()

        switch (page) {
            case 'first': {
                page = 1
                actievFirst()
            } break;
            case 'last': {
                page = countsOfPage
                activeLast()
            } break;
            case 'prev': {
                page = currentPage - 1
                activePage(page)
            } break;
            case 'next': {
                page = currentPage ? parseInt(currentPage) + 1 : 2
                activePage(page)
            } break;
            default: {
                activePage(page)
            } break;
        }

        if (page !== currentPage) setProdUrlParam('page', page, 'select')
    }))
}

const parseProdUrl = (url) => {
    const params = {}
    const queryString = url.split('?')[1]

    if (queryString) {
        const paramPairs = queryString.split('&')

        paramPairs.forEach(pair => {
            const [param, val] = pair.split('=')

            if (!param.includes('[')) return

            const [type, dirtyProp] = param.split('[')
            const prop = dirtyProp.slice(0, -1);

            if (!params[type]) params[type] = {}

            params[type][prop] = val
        })
    }

    return params
}

const updateProdPagination = (totalProducts, pageNumber, totalPages) => {
    const paginationNode = document.querySelector('.page-catalog .pagination')

    // Рассчитвыем страницы и подeфолту показываем первую
    totalPages = Math.ceil(totalProducts / window._PRODUCTS_PER_PAGE)

    const isFirstPage = pageNumber === 1 ? 'disabled' : ''
    const isLastPage = pageNumber === totalPages ? 'disabled' : ''
    let paginationLayout = ''

    paginationLayout += `<button class="pagination__extremum ${isFirstPage}" href="" data-page="first">первая</button>`
    paginationLayout += `<button class="pagination__btn pagination__btn_prev ${isFirstPage}" href="" data-page="prev"><i></i></button>`

    for (let i = 1; i <= totalPages; i++) {
        const isActivePage = pageNumber === i ? 'active': ''
        paginationLayout += `<button class="pagination__btn pagination__btn_page ${isActivePage}" href="" data-page="${i}">${i}</button>`
    }

    paginationLayout += `<button class="pagination__btn pagination__btn_next ${isLastPage}" href="" data-page="next"><i></i></button>`
    paginationLayout += `<button class="pagination__extremum ${isLastPage}" href="" data-page="last">последняя</button>`

    // Блокируем текущую пагинацию
    paginationNode.classList.add('blocked')

    // Искусственно добавляем задержку в перерендер пагинации
    // Аналогичная задержка в рендеринге контента
    setTimeout(() => {
        // Если после филтрации и сортировки нет подходящих продуктов, скрываем пагинацию
        if (totalProducts === 0) {
            paginationNode.classList.add('hide')
            return
        } else {
            paginationNode.classList.remove('hide')
        }

        paginationNode.innerHTML = paginationLayout
        initCatalogPaginationControllers()
        paginationNode.classList.remove('blocked')
    }, RERENDER_PROD_TIMEOUT_DELAY)
}

const filterProdData = (filter, initilaData) => {
    if (!filter) return initilaData // Если нет фильтров, просто пробрасываем данные дальше

    let data = initilaData

    for (const key in filter) {
        let val = filter[key]
        if (val === 'Не указан'
                || val === 'Не указано'
                || val === 'Не указана'
                || val === 'Без категории') {
            val = ''
        }

        data = data.filter(prod => {
            if (Array.isArray(prod[key])) {
                if (val === '') return prod[key].length === 0

                return prod[key].includes(val)
            }
            return prod[key] === val
        })
    }

    console.log('after FILTER', data);
    console.log('FILTER --------------------------------------------------------');

    return data
}

const sortProdData = (sort, filteredData) => {
    if (!sort) return filteredData // Если нет сортировки, просто пробрасываем данные дальше

    let data = filteredData

    for (const key in sort) {
        let val = sort[key]
        data = data.sort( function(a, b) {
            if (val === 'По возрастанию') {
                return a[key] - b[key]
            }
            return b[key] - a[key]
        })
    }

    console.log('after SORT', data);
    console.log('SORT -------------------------------------------------------------');

    return data
}

const getPageFromProdData = (select, filteredAndSortedData) => {
    let data = filteredAndSortedData

    // Если нет параметра select со страницей, либо страница не указана, то выбираем первую страницу
    let pageNumber = !select
        ? 1
        : !select.page || select.page === ''
            ? 1
            : parseInt(select.page)

    // Вычисляем общее количество страниц
    const totalPages = Math.ceil(data.length / window._PRODUCTS_PER_PAGE)

    // Если номер страницы отрицательный, возвращаем первую страницу
    if (pageNumber < 1) {
        pageNumber = 1
    }

    // Если номер страницы больше максимальной, возвращаем последнюю страницу
    if (pageNumber > totalPages) {
        pageNumber = totalPages
    }

    // Вычисляем индексы начала и конца для текущей страницы
    const startIndex = (pageNumber - 1) * window._PRODUCTS_PER_PAGE
    const endIndex = startIndex + window._PRODUCTS_PER_PAGE
    data = data.slice(startIndex, endIndex)

    console.log('after get PAGE', data);
    console.log('GET PAGE --------------------------------------');

    // Обновляем пагинацию после того как получили подмасив товаров нужной страницы
    updateProdPagination(filteredAndSortedData.length, pageNumber, totalPages)

    return data
}

const sortProdByCategory = (filteredSortedPagedData) => {
    const categorys = {}

    for (const prod of filteredSortedPagedData) {
        let currentCategory = prod.category[0]
        if (!currentCategory) {
            currentCategory = 'Без категории'
        }

        // Если текущей категории нет в объекте categorys, добавляем
        const isCategory = currentCategory in categorys
        if (!isCategory) {
            categorys[currentCategory] = []
        }

        // Пушим товар в соответствующую категорию
        categorys[currentCategory].push(prod)
    }

    console.log('after replaced By Category', categorys);
    console.log('Replaced By Category --------------------------------------');

    return categorys
}

const buildProductListLayout = (categorys) => {
    let productSectionsHtmlLayout = ''

    for (const key in categorys) {
        let sectionHtmlLayout = ''

        sectionHtmlLayout += `
            <section class="section section_product-list">
                <div class="product-item__container">
                    <div class="container container_caption">
                        <div class="row">
                            <div class="col col-xl-8">
                                <h2 class="container_caption-text">${key}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="product-item__list">
                        <div class="container">
                            <div class="row">`

            for (const singleProduct of categorys[key]) {
                // Добавляем теги если они есть
                const tags = singleProduct.tags

                let badgeLayout = ''

                if (!Array.isArray(tags) && Object.keys(tags)) {
                    badgeLayout += '<div class="product-item__badge-list">'
                        if (tags['new']) badgeLayout += '<span class="product-item__badge-item">Новинка</span>'
                        if (tags['IP']) badgeLayout += '<span class="product-item__badge-item product-item__badge-item_waterproof">IP 44<i></i></span>'
                    badgeLayout += '</div>'
                }

                const price = singleProduct.price ? singleProduct.price + ' ₽' : ''

                sectionHtmlLayout += `
                    <div class="col-12 col-sm-6 col-md-4 col-xl-3">
                        <div class="product-item__card">
                            <a class="product-item__body" href="#" title="${singleProduct.title}">
                                ${badgeLayout}
                                <div class="product-item__pic">
                                    <img src="${singleProduct.image}" alt="" loading="lazy">
                                    <button class="product-item__favorites"
                                        type="button"
                                        data-product-id="${singleProduct.article}"
                                        data-title="${singleProduct.title}"
                                        data-message="Добавлен в избранное"></button>
                                </div>
                                <div class="product-item__content">
                                    <div class="product-item__desc">
                                        <span class="product-item__code">${singleProduct.article}</span>
                                        <p class="product-item__name">${singleProduct.title}</p>
                                    </div>
                                    <div class="product-item__buy">
                                        <span class="product-item__price">${price}</span>
                                        <button class="product-item__cart"
                                            type="button"
                                            data-product-id="${singleProduct.article}"
                                            data-title="${singleProduct.title}"
                                            data-message="Добавлен в корзину">
                                        </button>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>`
            }

        sectionHtmlLayout += `
                            </div>
                        </div>
                    </div>
                </div>
            </section>`

        productSectionsHtmlLayout += sectionHtmlLayout
    }
    return productSectionsHtmlLayout
}

const buildNoProductListMsgLayout = () => {
    return `
        <section class="section section_product-list">
            <div class="description__msg display visible">
                <div class="container">
                    <span>К сожалению, по Вашему запросу ничего не найдено. Товара с данными параметрами нет.</span>
                </div>
            </div>
        </section>
    `
}

const updateProductListOnPage = (categorys) => {
    window.spinner.show()

    // Собираем контент страницы в зависимости от того есть ли в выборке товары
    const productSectionsHtmlLayout = Object.keys(categorys).length === 0
        ? buildNoProductListMsgLayout()
        : buildProductListLayout(categorys)

    const remoteNodes = Array.from(document
        .querySelectorAll('.page-catalog .section_product-list'))
    // Блокируем текущие продукты
    remoteNodes.forEach(node => node.classList.add('blocked'))

    // Искусственно добавляем задержку в перерендер контента
    // Аналогичная задержка в рендеринге пагинации
    setTimeout(() => {
        // Удаляем текущие продукты со страницы
        remoteNodes.forEach(node => node.parentNode.removeChild(node))

        const referenceNode = document.querySelector('.page-catalog .section_filter')

        // Вставляем HTML код после referenceNode
        referenceNode.insertAdjacentHTML('afterend', productSectionsHtmlLayout)

        // Скролим в начало страницы
        smoothScrollTo(0, 1000)

        // Инициализируем кнопки добавления в избранные и в корзину
        initAddToFavorites()
        initAddToCart()

        // Скрываем спиннер
        window.spinner.hide()

        // Показываем анимируемые секции если нужно
        showAnimElements()
    }, RERENDER_PROD_TIMEOUT_DELAY)
}

const processProdData = (url) => {

    // Получаем параметры сортировки и фильтрации из url
    const manipulationDataObj = parseProdUrl(url)

    console.log('manipulationDataObj', manipulationDataObj);

    // Step 5. Обновляем список товаров на стрнице
    updateProductListOnPage(

        // Step 4. Сортируем товары по категориями. --- Возвращает: объект с категориями, где в занчении каждой категории лежит массив с товарами этой категории
        sortProdByCategory(

            // Step 3. Выбираем подмассив нужную страницу. --- Возвращает: подмассив с продуктамии соответструющей страницы
            // После получения страницы (внутри метода) обновляем пагинацию!
            getPageFromProdData(
                manipulationDataObj.select,

                // Step 2. Сортируем данные --- Возвращает: отсортированный массив с продуктами
                sortProdData(
                    manipulationDataObj.sort,

                    // Step 1. Фильтруем данные --- Возвращает: отфильтрованный массив с продуктами
                    filterProdData(
                        manipulationDataObj.filter,
                        window._CATALOG
                    )
                )
            )
        )
    )
}

window.addEventListener('load', () => {
    const isPageCatalog = document.querySelector('.page-catalog')
    if (!isPageCatalog) return

    initCatalogFilterControllers()
    initCatalogFilterReset()
    initCatalogPaginationControllers()
    initDefaultProdCatalog()
    requestProductData()
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjYXRhbG9nL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDQp9Cw0YHRgtC40YfQvdC+INC70L7Qs9C40LrQsCDRhNC40LvRjNGC0YDQvtCyINC90LDRhdC+0LTQuNGC0YHRjyDQsiDRhNCw0LnQu9C1INC70L7Qs9C40LrQuCDRgNCw0LHQvtGC0Ysg0YTQuNC70YzRgtGA0LAgc3JjXFxjb21wb25lbnRzXFxmaWx0ZXJzXFxzY3JpcHQuanNcclxuXHJcbi8vINCd0LAg0YHRgtC+0YDQvtC90LUg0LHRjdC60LAg0L3Rg9C20L3QviDQv9GA0L7QuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjCDQv9C10YDQtdC80LXQvdC90YPRjiB3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFINCyINC60L7RgtC+0YDQvtC5INGF0YDQsNC90LjQvCDQutC+0LvQuNGH0LXRgdGC0LLQviDRgtC+0LLQsNGA0L7QsiDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0LrQsNGC0LDQu9C+0LPQsCFcclxuaWYgKCF3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdUaGVyZSBpcyBubyB2YXJpYWJsZSBudW1iZXIgb2YgcHJvZHVjdHMgb24gdGhlIENhdGFsb2cgcGFnZSEgU2hvdWxkIHRvIGFkZCB2YXJpYWJsZSBhcyB3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFPTEwJylcclxufVxyXG5cclxuY29uc3QgUkVSRU5ERVJfUFJPRF9USU1FT1VUX0RFTEFZID0gMTAwMFxyXG5cclxuY29uc3Qgc2V0UHJvZFVybFBhcmFtID0gKG5hbWUsIHZhbCwgdHlwZSkgPT4ge1xyXG4gICAgbGV0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcblxyXG4gICAgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8LCDQtdGB0YLRjCDQu9C4INGD0LbQtSDQv9Cw0YDQsNC80LXRgtGAINGBINGC0LjQv9C+0LwgdHlwZSDQuCDQuNC80LXQvdC10LwgbmFtZSDQsiBVUkwgLS0tIHR5cGVbbmFtZV09XHJcbiAgICBpZiAodXJsLmluZGV4T2YoYCR7dHlwZX1bJHtuYW1lfV09YCkgIT09IC0xKSB7XHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0LfQvdCw0YfQtdC90LjQtSB2YWwg0YDQsNCy0L3QviBcInJlc2V0XCIsINGD0LTQsNC70Y/QtdC8INC/0LDRgNCw0LzQtdGC0YAg0LjQtyBVUkwg0LjQvdCw0YfQtSDQvtCx0L3QvtCy0LvRj9C10Lwg0L3QsCDQvdC+0LLQvtC1INC30L3QsNGH0LXQvdC40LVcclxuICAgICAgICB1cmwgPSB2YWwgPT09ICdyZXNldCdcclxuICAgICAgICAgICAgPyB1cmwucmVwbGFjZShuZXcgUmVnRXhwKGAoJHt0eXBlfVxcXFxbJHtuYW1lfVxcXFxdPSlbXiZdK2ApLCAnJylcclxuICAgICAgICAgICAgOiB1cmwucmVwbGFjZShuZXcgUmVnRXhwKGAoJHt0eXBlfVxcXFxbJHtuYW1lfVxcXFxdPSlbXiZdK2ApLCBgJDEke3ZhbH1gKVxyXG4gICAgfSBlbHNlIHsgLy8g0JXRgdC70Lgg0L/QsNGA0LDQvNC10YLRgNCwINGBINC40LzQtdC90LXQvCBuYW1lINC90LXRgiDQsiBVUkwsINC00L7QsdCw0LLQu9GP0LXQvCDQtdCz0L5cclxuICAgICAgICB1cmwgKz0gdXJsLmluZGV4T2YoXCI/XCIpICE9PSAtMVxyXG4gICAgICAgICAgICA/IGAmJHt0eXBlfVske25hbWV9XT0ke3ZhbH1gXHJcbiAgICAgICAgICAgIDogYD8ke3R5cGV9WyR7bmFtZX1dPSR7dmFsfWBcclxuICAgIH1cclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0LTQu9GPINGE0LjQu9GM0YLRgNC+0LIg0Lgg0YHQvtGA0YLQuNGA0L7QstC60Lgg0YPQtNCw0LvRj9C10Lwg0L/QsNGA0LDQvNC10YLRgNGCINGB0YLRgNCw0L3QuNGG0YssINGC0LDQuiDQutCw0Log0LzQtdC90Y/QtdGC0YHRjyDQstGL0LHQvtGA0LrQsFxyXG4gICAgaWYgKHR5cGUgPT09ICdmaWx0ZXInIHx8IHR5cGUgPT09ICdzb3J0Jykge1xyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC8mP3NlbGVjdFxcW3BhZ2VcXF09W14mXSovZywgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCj0LTQsNC70Y/QtdC8INC70LjRiNC90LjQtSAmINC40LcgdXJsINC4ID8g0LTQu9GPIFVMUiDQsdC10Lcg0L/QsNGA0LDQvNC10YLRgNC+0LJcclxuICAgIHVybCA9IHVybC5yZXBsYWNlKC8mKy9nLCAnJicpXHJcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFw/Ji9nLCAnPycpXHJcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvJiQvZywgJycpXHJcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFw/JC8sICcnKVxyXG4gICAgdXJsID0gZGVjb2RlVVJJQ29tcG9uZW50KHVybClcclxuXHJcbiAgICAvLyDQntCx0L3QvtCy0LvRj9C10LwgVVJMINGB0YLRgNCw0L3QuNGG0YtcclxuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgdXJsKTtcclxuXHJcbiAgICAvLyDQodGC0LDRgNGC0YPQtdC8INC/0YDQvtGG0LXRgdGBINC+0LHRgNCx0L7RgtC60Lgg0LTQsNC90L3Ri9GFXHJcbiAgICBwcm9jZXNzUHJvZERhdGEodXJsKVxyXG59XHJcblxyXG5jb25zdCBpbml0RGVmYXVsdFByb2RDYXRhbG9nID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5fQ0FUQUxPRykgcmV0dXJuXHJcbiAgICB3aW5kb3cuX0NBVEFMT0cgPSB7fVxyXG59XHJcblxyXG5jb25zdCByZXF1ZXN0UHJvZHVjdERhdGEgPSBhc3luYyAoKSA9PiB7XHJcbiAgICB3aW5kb3cuX0NBVEFMT0cgPSBbXVxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC1ydS9tb2Nrcy9wcm9kdWN0cy5qc29uJylcclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBjb25zdCBwYXJzZWREYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG5cclxuICAgICAgICBpZiAoJ2RhdGEnIGluIHBhcnNlZERhdGEpIHtcclxuICAgICAgICAgICAgd2luZG93Ll9DQVRBTE9HID0gcGFyc2VkRGF0YS5kYXRhXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign0JIg0LfQsNC/0YDQvtGI0LXQvdC90YvRhSDQtNCw0L3QvdGL0YUg0LrQsNGC0LDQu9C+0LPQsCDQvdC10YIg0L7QsdGK0LXQutGC0LAg0YEg0LTQsNC90L3Ri9C80LghINCf0YDQtdC00L/QvtC70LDQs9Cw0LXRgtGB0Y8g0L3QsNC70LjRh9C40LUg0YHQstC+0LnRgdGC0LLQsCDRgSBkYXRhLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5fQ0FUQUxPRy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign0J/RgNC40YjQtdC7INC/0YPRgdGC0L7QuSDQvtCx0YrQutGCINGBINC00LDQvdC90YvQvNC4IScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDQt9Cw0L/RgNC+0YHQsCDQutCw0YLQsNC70L7Qs9CwINGC0L7QstCw0YDQvtCyISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUHJvZHVjdFJlc2V0QWxsQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY2hlY2tlZEZpbHRlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWx0ZXJzX19vcHRpb25zLmNoZWNrZWQnKSlcclxuXHJcbiAgICBjb25zdCByZXNldEFsbEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXJzX19yZXNldCcpXHJcblxyXG4gICAgY2hlY2tlZEZpbHRlcnMubGVuZ3RoID4gMFxyXG4gICAgICAgID8gcmVzZXRBbGxCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKVxyXG4gICAgICAgIDogcmVzZXRBbGxCdXR0b24uY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKVxyXG59XHJcblxyXG5jb25zdCB1bmRyb3BwUHJvZHVjdEZpbHRlckxpc3RzID0gKGZpbHRlcnMpID0+IHtcclxuICAgIGZpbHRlcnMuZm9yRWFjaChmaWx0ZXIgPT4ge1xyXG4gICAgICAgIGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wcGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSwgMzAwKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgcmVzZXRBbGxQcm9kdWN0c0ZpbHRlcnMgPSAobm9kZSkgPT4ge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gbm9kZS5jbG9zZXN0KCcucGFnZS1jYXRhbG9nIC5maWx0ZXJzJylcclxuXHJcbiAgICBjb25zdCBmaWx0ZXJzID0gY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVyc19fbGlzdCAuZmlsdGVyc19faXRlbScpXHJcblxyXG4gICAgY29uc3Qgb3B0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdlLWNhdGFsb2cgLmZpbHRlcnNfX29wdGlvbnMnKSlcclxuXHJcbiAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl06bm90KFt2YWx1ZT1cInJlc2V0XCJdJykpXHJcblxyXG4gICAgdW5kcm9wcFByb2R1Y3RGaWx0ZXJMaXN0cyhmaWx0ZXJzKVxyXG4gICAgb3B0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NoZWNrZWQnKSkgLy8gaGlkZSByc2V0IG9wdGlvbiBidXR0b25cclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goY29udHJvbGxlciA9PiBjb250cm9sbGVyLmNoZWNrZWQgPSBmYWxzZSkgLy8gcmVzZXQgYWxsIGlucHV0IGNvbnRyb2xsZXJzXHJcbiAgICBub2RlLmNsb3Nlc3QoJy5maWx0ZXJzX19yZXNldCcpLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJylcclxufVxyXG5cclxuY29uc3QgcmVtb3ZlRmlsdGVyUGFyYW1Gcm9tQ2F0YWxvZ1VybCA9ICh1cmwsIHBhcmFtKSA9PiB7XHJcbiAgICBjb25zdCBzdHJSZWdleCA9IGAke3BhcmFtfVteJl0qYFxyXG4gICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHN0clJlZ2V4LCAnZycpXHJcbiAgICByZXR1cm4gdXJsLnJlcGxhY2UocmVnZXgsICcnKVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2F0YWxvZ0ZpbHRlclJlc2V0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jYXRhbG9nIC5maWx0ZXJzX19yZXNldCAuZmlsdGVyc19faXRlbScpXHJcbiAgICBpZiAoIXJlc2V0KSByZXR1cm5cclxuXHJcbiAgICByZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgIGNvbnN0IGRlbGV0ZWRQYXJhbXMgPSBKU09OLnBhcnNlKHRoaXMuZGF0YXNldC5kZWxldGVkUGFyYW1zKVxyXG4gICAgICAgIGxldCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG5cclxuICAgICAgICAvLyDQn9GA0L7QstC10YDRj9C10LwsINC10YHRgtGMINC70LggR0VUINC/0LDRgNCw0LzQtdGC0YDRiyDQsiBVUkxcclxuICAgICAgICBpZiAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEpIHJldHVyblxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHBhcmFtIG9mIGRlbGV0ZWRQYXJhbXMpIHtcclxuICAgICAgICAgICAgdXJsID0gcmVtb3ZlRmlsdGVyUGFyYW1Gcm9tQ2F0YWxvZ1VybCh1cmwsIHBhcmFtKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0KPQtNCw0LvRj9C10Lwg0LvQuNGI0L3QuNC1ICYg0LjQtyB1cmwg0LggPyDQtNC70Y8gVUxSINCx0LXQtyDQv9Cw0YDQsNC80LXRgtGA0L7QslxyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC8mKy9nLCAnJicpXHJcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL1xcPyYvZywgJz8nKVxyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC8mJC9nLCAnJylcclxuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFw/JC8sICcnKVxyXG4gICAgICAgIHVybCA9IGRlY29kZVVSSUNvbXBvbmVudCh1cmwpXHJcblxyXG4gICAgICAgIC8vINCe0LHQvdC+0LLQu9GP0LXQvCBVUkwg0YHRgtGA0LDQvdC40YbRiyDQsdC10LcgR0VUINC/0LDRgNCw0LzQtdGC0YDQvtCyXHJcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCB1cmwpXHJcblxyXG4gICAgICAgIC8vINCh0LHRgNCw0YHRi9Cy0LDQtdC8INCy0YHQtSDQstGL0LHRgNCw0L3QvdGL0LUg0YTQuNC70YzRgtGA0YtcclxuICAgICAgICByZXNldEFsbFByb2R1Y3RzRmlsdGVycyh0aGlzKVxyXG5cclxuICAgICAgICAvLyDQodGC0LDRgNGC0YPQtdC8INC/0YDQvtGG0LXRgdGBINC+0LHRgNCx0L7RgtC60Lgg0LTQsNC90L3Ri9GFXHJcbiAgICAgICAgcHJvY2Vzc1Byb2REYXRhKHVybClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXRDYXRhbG9nRmlsdGVyQ29udHJvbGxlcnMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2UtY2F0YWxvZyAuZmlsdGVycyBpbnB1dFt0eXBlPVwicmFkaW9cIl0nKSlcclxuXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY2xvc2VzdCgnLmZpbHRlcnNfX29wdGlvbnMnKVxyXG5cclxuICAgICAgICB0aGlzLnZhbHVlICE9PSAncmVzZXQnXHJcbiAgICAgICAgICAgID8gY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NoZWNrZWQnKVxyXG4gICAgICAgICAgICA6IGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJylcclxuXHJcbiAgICAgICAgc2V0UHJvZFVybFBhcmFtKHRoaXMubmFtZSwgdGhpcy52YWx1ZSwgdGhpcy5kYXRhc2V0LnR5cGUpXHJcbiAgICAgICAgY2hlY2tQcm9kdWN0UmVzZXRBbGxCdXR0b24oKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbmNvbnN0IGdldEN1cnJlbnRQYWdlTnVtYmVyRnJvbVVybCA9ICgpID0+IHtcclxuICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHVybC5zcGxpdCgnPycpWzFdKTtcclxuICAgIHJldHVybiBwYXJhbXMuZ2V0KCdzZWxlY3RbcGFnZV0nKTtcclxufVxyXG5cclxuY29uc3QgaW5pdENhdGFsb2dQYWdpbmF0aW9uQ29udHJvbGxlcnMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjb3VudHNPZlBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZS1jYXRhbG9nIC5wYWdpbmF0aW9uIC5wYWdpbmF0aW9uX19idG5fcGFnZScpLmxlbmd0aFxyXG4gICAgY29uc3QgcGFnaW5hdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNhdGFsb2cgLnBhZ2luYXRpb24nKVxyXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2UtY2F0YWxvZyAucGFnaW5hdGlvbiBidXR0b24nKSlcclxuICAgIGNvbnN0IGZpcnN0ID0gcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wYWdlPVwiZmlyc3RcIl0nKVxyXG4gICAgY29uc3QgbGFzdCA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignW2RhdGEtcGFnZT1cImxhc3RcIl0nKVxyXG4gICAgY29uc3QgcHJldiA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignW2RhdGEtcGFnZT1cInByZXZcIl0nKVxyXG4gICAgY29uc3QgbmV4dCA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignW2RhdGEtcGFnZT1cIm5leHRcIl0nKVxyXG5cclxuICAgIGNvbnN0IHJlc2V0QWxsUGFnaW5hdGlvbkJ0bnMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcsICdhY3RpdmUnKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3RpZXZGaXJzdCA9ICgpID0+IHtcclxuICAgICAgICBmaXJzdC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXHJcbiAgICAgICAgcHJldi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXHJcbiAgICAgICAgcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wYWdlPVwiMVwiXScpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlTGFzdCA9ICgpID0+IHtcclxuICAgICAgICBsYXN0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJylcclxuICAgICAgICBuZXh0LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJylcclxuICAgICAgICBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXBhZ2U9XCIke2NvdW50c09mUGFnZX1cIl1gKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdGl2ZVBhZ2UgPSAocGFnZSkgPT4ge1xyXG4gICAgICAgIGlmIChwYXJzZUludChwYWdlKSA9PT0gMSkge1xyXG4gICAgICAgICAgICBhY3RpZXZGaXJzdCgpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcnNlSW50KHBhZ2UpID09PSBjb3VudHNPZlBhZ2UpIHtcclxuICAgICAgICAgICAgYWN0aXZlTGFzdCgpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFnaW5hdGlvblxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcihgW2RhdGEtcGFnZT1cIiR7cGFnZX1cIl1gKVxyXG4gICAgICAgICAgICAuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH1cclxuXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICBjb25zdCBjdXJyZW50UGFnZSA9IGdldEN1cnJlbnRQYWdlTnVtYmVyRnJvbVVybCgpXHJcblxyXG4gICAgICAgIGxldCBwYWdlID0gdGhpcy5kYXRhc2V0LnBhZ2VcclxuXHJcbiAgICAgICAgcmVzZXRBbGxQYWdpbmF0aW9uQnRucygpXHJcblxyXG4gICAgICAgIHN3aXRjaCAocGFnZSkge1xyXG4gICAgICAgICAgICBjYXNlICdmaXJzdCc6IHtcclxuICAgICAgICAgICAgICAgIHBhZ2UgPSAxXHJcbiAgICAgICAgICAgICAgICBhY3RpZXZGaXJzdCgpXHJcbiAgICAgICAgICAgIH0gYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2xhc3QnOiB7XHJcbiAgICAgICAgICAgICAgICBwYWdlID0gY291bnRzT2ZQYWdlXHJcbiAgICAgICAgICAgICAgICBhY3RpdmVMYXN0KClcclxuICAgICAgICAgICAgfSBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncHJldic6IHtcclxuICAgICAgICAgICAgICAgIHBhZ2UgPSBjdXJyZW50UGFnZSAtIDFcclxuICAgICAgICAgICAgICAgIGFjdGl2ZVBhZ2UocGFnZSlcclxuICAgICAgICAgICAgfSBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbmV4dCc6IHtcclxuICAgICAgICAgICAgICAgIHBhZ2UgPSBjdXJyZW50UGFnZSA/IHBhcnNlSW50KGN1cnJlbnRQYWdlKSArIDEgOiAyXHJcbiAgICAgICAgICAgICAgICBhY3RpdmVQYWdlKHBhZ2UpXHJcbiAgICAgICAgICAgIH0gYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZVBhZ2UocGFnZSlcclxuICAgICAgICAgICAgfSBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYWdlICE9PSBjdXJyZW50UGFnZSkgc2V0UHJvZFVybFBhcmFtKCdwYWdlJywgcGFnZSwgJ3NlbGVjdCcpXHJcbiAgICB9KSlcclxufVxyXG5cclxuY29uc3QgcGFyc2VQcm9kVXJsID0gKHVybCkgPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zID0ge31cclxuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gdXJsLnNwbGl0KCc/JylbMV1cclxuXHJcbiAgICBpZiAocXVlcnlTdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBwYXJhbVBhaXJzID0gcXVlcnlTdHJpbmcuc3BsaXQoJyYnKVxyXG5cclxuICAgICAgICBwYXJhbVBhaXJzLmZvckVhY2gocGFpciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtwYXJhbSwgdmFsXSA9IHBhaXIuc3BsaXQoJz0nKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFwYXJhbS5pbmNsdWRlcygnWycpKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IFt0eXBlLCBkaXJ0eVByb3BdID0gcGFyYW0uc3BsaXQoJ1snKVxyXG4gICAgICAgICAgICBjb25zdCBwcm9wID0gZGlydHlQcm9wLnNsaWNlKDAsIC0xKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFyYW1zW3R5cGVdKSBwYXJhbXNbdHlwZV0gPSB7fVxyXG5cclxuICAgICAgICAgICAgcGFyYW1zW3R5cGVdW3Byb3BdID0gdmFsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyYW1zXHJcbn1cclxuXHJcbmNvbnN0IHVwZGF0ZVByb2RQYWdpbmF0aW9uID0gKHRvdGFsUHJvZHVjdHMsIHBhZ2VOdW1iZXIsIHRvdGFsUGFnZXMpID0+IHtcclxuICAgIGNvbnN0IHBhZ2luYXRpb25Ob2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY2F0YWxvZyAucGFnaW5hdGlvbicpXHJcblxyXG4gICAgLy8g0KDQsNGB0YHRh9C40YLQstGL0LXQvCDRgdGC0YDQsNC90LjRhtGLINC4INC/0L7QtGXRhNC+0LvRgtGDINC/0L7QutCw0LfRi9Cy0LDQtdC8INC/0LXRgNCy0YPRjlxyXG4gICAgdG90YWxQYWdlcyA9IE1hdGguY2VpbCh0b3RhbFByb2R1Y3RzIC8gd2luZG93Ll9QUk9EVUNUU19QRVJfUEFHRSlcclxuXHJcbiAgICBjb25zdCBpc0ZpcnN0UGFnZSA9IHBhZ2VOdW1iZXIgPT09IDEgPyAnZGlzYWJsZWQnIDogJydcclxuICAgIGNvbnN0IGlzTGFzdFBhZ2UgPSBwYWdlTnVtYmVyID09PSB0b3RhbFBhZ2VzID8gJ2Rpc2FibGVkJyA6ICcnXHJcbiAgICBsZXQgcGFnaW5hdGlvbkxheW91dCA9ICcnXHJcblxyXG4gICAgcGFnaW5hdGlvbkxheW91dCArPSBgPGJ1dHRvbiBjbGFzcz1cInBhZ2luYXRpb25fX2V4dHJlbXVtICR7aXNGaXJzdFBhZ2V9XCIgaHJlZj1cIlwiIGRhdGEtcGFnZT1cImZpcnN0XCI+0L/QtdGA0LLQsNGPPC9idXR0b24+YFxyXG4gICAgcGFnaW5hdGlvbkxheW91dCArPSBgPGJ1dHRvbiBjbGFzcz1cInBhZ2luYXRpb25fX2J0biBwYWdpbmF0aW9uX19idG5fcHJldiAke2lzRmlyc3RQYWdlfVwiIGhyZWY9XCJcIiBkYXRhLXBhZ2U9XCJwcmV2XCI+PGk+PC9pPjwvYnV0dG9uPmBcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0b3RhbFBhZ2VzOyBpKyspIHtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZVBhZ2UgPSBwYWdlTnVtYmVyID09PSBpID8gJ2FjdGl2ZSc6ICcnXHJcbiAgICAgICAgcGFnaW5hdGlvbkxheW91dCArPSBgPGJ1dHRvbiBjbGFzcz1cInBhZ2luYXRpb25fX2J0biBwYWdpbmF0aW9uX19idG5fcGFnZSAke2lzQWN0aXZlUGFnZX1cIiBocmVmPVwiXCIgZGF0YS1wYWdlPVwiJHtpfVwiPiR7aX08L2J1dHRvbj5gXHJcbiAgICB9XHJcblxyXG4gICAgcGFnaW5hdGlvbkxheW91dCArPSBgPGJ1dHRvbiBjbGFzcz1cInBhZ2luYXRpb25fX2J0biBwYWdpbmF0aW9uX19idG5fbmV4dCAke2lzTGFzdFBhZ2V9XCIgaHJlZj1cIlwiIGRhdGEtcGFnZT1cIm5leHRcIj48aT48L2k+PC9idXR0b24+YFxyXG4gICAgcGFnaW5hdGlvbkxheW91dCArPSBgPGJ1dHRvbiBjbGFzcz1cInBhZ2luYXRpb25fX2V4dHJlbXVtICR7aXNMYXN0UGFnZX1cIiBocmVmPVwiXCIgZGF0YS1wYWdlPVwibGFzdFwiPtC/0L7RgdC70LXQtNC90Y/RjzwvYnV0dG9uPmBcclxuXHJcbiAgICAvLyDQkdC70L7QutC40YDRg9C10Lwg0YLQtdC60YPRidGD0Y4g0L/QsNCz0LjQvdCw0YbQuNGOXHJcbiAgICBwYWdpbmF0aW9uTm9kZS5jbGFzc0xpc3QuYWRkKCdibG9ja2VkJylcclxuXHJcbiAgICAvLyDQmNGB0LrRg9GB0YHRgtCy0LXQvdC90L4g0LTQvtCx0LDQstC70Y/QtdC8INC30LDQtNC10YDQttC60YMg0LIg0L/QtdGA0LXRgNC10L3QtNC10YAg0L/QsNCz0LjQvdCw0YbQuNC4XHJcbiAgICAvLyDQkNC90LDQu9C+0LPQuNGH0L3QsNGPINC30LDQtNC10YDQttC60LAg0LIg0YDQtdC90LTQtdGA0LjQvdCz0LUg0LrQvtC90YLQtdC90YLQsFxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0L/QvtGB0LvQtSDRhNC40LvRgtGA0LDRhtC40Lgg0Lgg0YHQvtGA0YLQuNGA0L7QstC60Lgg0L3QtdGCINC/0L7QtNGF0L7QtNGP0YnQuNGFINC/0YDQvtC00YPQutGC0L7Qsiwg0YHQutGA0YvQstCw0LXQvCDQv9Cw0LPQuNC90LDRhtC40Y5cclxuICAgICAgICBpZiAodG90YWxQcm9kdWN0cyA9PT0gMCkge1xyXG4gICAgICAgICAgICBwYWdpbmF0aW9uTm9kZS5jbGFzc0xpc3QuYWRkKCdoaWRlJylcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGFnaW5hdGlvbk5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYWdpbmF0aW9uTm9kZS5pbm5lckhUTUwgPSBwYWdpbmF0aW9uTGF5b3V0XHJcbiAgICAgICAgaW5pdENhdGFsb2dQYWdpbmF0aW9uQ29udHJvbGxlcnMoKVxyXG4gICAgICAgIHBhZ2luYXRpb25Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2Jsb2NrZWQnKVxyXG4gICAgfSwgUkVSRU5ERVJfUFJPRF9USU1FT1VUX0RFTEFZKVxyXG59XHJcblxyXG5jb25zdCBmaWx0ZXJQcm9kRGF0YSA9IChmaWx0ZXIsIGluaXRpbGFEYXRhKSA9PiB7XHJcbiAgICBpZiAoIWZpbHRlcikgcmV0dXJuIGluaXRpbGFEYXRhIC8vINCV0YHQu9C4INC90LXRgiDRhNC40LvRjNGC0YDQvtCyLCDQv9GA0L7RgdGC0L4g0L/RgNC+0LHRgNCw0YHRi9Cy0LDQtdC8INC00LDQvdC90YvQtSDQtNCw0LvRjNGI0LVcclxuXHJcbiAgICBsZXQgZGF0YSA9IGluaXRpbGFEYXRhXHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZmlsdGVyKSB7XHJcbiAgICAgICAgbGV0IHZhbCA9IGZpbHRlcltrZXldXHJcbiAgICAgICAgaWYgKHZhbCA9PT0gJ9Cd0LUg0YPQutCw0LfQsNC9J1xyXG4gICAgICAgICAgICAgICAgfHwgdmFsID09PSAn0J3QtSDRg9C60LDQt9Cw0L3QvidcclxuICAgICAgICAgICAgICAgIHx8IHZhbCA9PT0gJ9Cd0LUg0YPQutCw0LfQsNC90LAnXHJcbiAgICAgICAgICAgICAgICB8fCB2YWwgPT09ICfQkdC10Lcg0LrQsNGC0LXQs9C+0YDQuNC4Jykge1xyXG4gICAgICAgICAgICB2YWwgPSAnJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHByb2QgPT4ge1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9kW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsID09PSAnJykgcmV0dXJuIHByb2Rba2V5XS5sZW5ndGggPT09IDBcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvZFtrZXldLmluY2x1ZGVzKHZhbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvZFtrZXldID09PSB2YWxcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdhZnRlciBGSUxURVInLCBkYXRhKTtcclxuICAgIGNvbnNvbGUubG9nKCdGSUxURVIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YVxyXG59XHJcblxyXG5jb25zdCBzb3J0UHJvZERhdGEgPSAoc29ydCwgZmlsdGVyZWREYXRhKSA9PiB7XHJcbiAgICBpZiAoIXNvcnQpIHJldHVybiBmaWx0ZXJlZERhdGEgLy8g0JXRgdC70Lgg0L3QtdGCINGB0L7RgNGC0LjRgNC+0LLQutC4LCDQv9GA0L7RgdGC0L4g0L/RgNC+0LHRgNCw0YHRi9Cy0LDQtdC8INC00LDQvdC90YvQtSDQtNCw0LvRjNGI0LVcclxuXHJcbiAgICBsZXQgZGF0YSA9IGZpbHRlcmVkRGF0YVxyXG5cclxuICAgIGZvciAoY29uc3Qga2V5IGluIHNvcnQpIHtcclxuICAgICAgICBsZXQgdmFsID0gc29ydFtrZXldXHJcbiAgICAgICAgZGF0YSA9IGRhdGEuc29ydCggZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICBpZiAodmFsID09PSAn0J/QviDQstC+0LfRgNCw0YHRgtCw0L3QuNGOJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFba2V5XSAtIGJba2V5XVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBiW2tleV0gLSBhW2tleV1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdhZnRlciBTT1JUJywgZGF0YSk7XHJcbiAgICBjb25zb2xlLmxvZygnU09SVCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxuY29uc3QgZ2V0UGFnZUZyb21Qcm9kRGF0YSA9IChzZWxlY3QsIGZpbHRlcmVkQW5kU29ydGVkRGF0YSkgPT4ge1xyXG4gICAgbGV0IGRhdGEgPSBmaWx0ZXJlZEFuZFNvcnRlZERhdGFcclxuXHJcbiAgICAvLyDQldGB0LvQuCDQvdC10YIg0L/QsNGA0LDQvNC10YLRgNCwIHNlbGVjdCDRgdC+INGB0YLRgNCw0L3QuNGG0LXQuSwg0LvQuNCx0L4g0YHRgtGA0LDQvdC40YbQsCDQvdC1INGD0LrQsNC30LDQvdCwLCDRgtC+INCy0YvQsdC40YDQsNC10Lwg0L/QtdGA0LLRg9GOINGB0YLRgNCw0L3QuNGG0YNcclxuICAgIGxldCBwYWdlTnVtYmVyID0gIXNlbGVjdFxyXG4gICAgICAgID8gMVxyXG4gICAgICAgIDogIXNlbGVjdC5wYWdlIHx8IHNlbGVjdC5wYWdlID09PSAnJ1xyXG4gICAgICAgICAgICA/IDFcclxuICAgICAgICAgICAgOiBwYXJzZUludChzZWxlY3QucGFnZSlcclxuXHJcbiAgICAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0L7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgdGC0YDQsNC90LjRhlxyXG4gICAgY29uc3QgdG90YWxQYWdlcyA9IE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIHdpbmRvdy5fUFJPRFVDVFNfUEVSX1BBR0UpXHJcblxyXG4gICAgLy8g0JXRgdC70Lgg0L3QvtC80LXRgCDRgdGC0YDQsNC90LjRhtGLINC+0YLRgNC40YbQsNGC0LXQu9GM0L3Ri9C5LCDQstC+0LfQstGA0LDRidCw0LXQvCDQv9C10YDQstGD0Y4g0YHRgtGA0LDQvdC40YbRg1xyXG4gICAgaWYgKHBhZ2VOdW1iZXIgPCAxKSB7XHJcbiAgICAgICAgcGFnZU51bWJlciA9IDFcclxuICAgIH1cclxuXHJcbiAgICAvLyDQldGB0LvQuCDQvdC+0LzQtdGAINGB0YLRgNCw0L3QuNGG0Ysg0LHQvtC70YzRiNC1INC80LDQutGB0LjQvNCw0LvRjNC90L7QuSwg0LLQvtC30LLRgNCw0YnQsNC10Lwg0L/QvtGB0LvQtdC00L3RjtGOINGB0YLRgNCw0L3QuNGG0YNcclxuICAgIGlmIChwYWdlTnVtYmVyID4gdG90YWxQYWdlcykge1xyXG4gICAgICAgIHBhZ2VOdW1iZXIgPSB0b3RhbFBhZ2VzXHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLRi9GH0LjRgdC70Y/QtdC8INC40L3QtNC10LrRgdGLINC90LDRh9Cw0LvQsCDQuCDQutC+0L3RhtCwINC00LvRjyDRgtC10LrRg9GJ0LXQuSDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gKHBhZ2VOdW1iZXIgLSAxKSAqIHdpbmRvdy5fUFJPRFVDVFNfUEVSX1BBR0VcclxuICAgIGNvbnN0IGVuZEluZGV4ID0gc3RhcnRJbmRleCArIHdpbmRvdy5fUFJPRFVDVFNfUEVSX1BBR0VcclxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdhZnRlciBnZXQgUEFHRScsIGRhdGEpO1xyXG4gICAgY29uc29sZS5sb2coJ0dFVCBQQUdFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblxyXG4gICAgLy8g0J7QsdC90L7QstC70Y/QtdC8INC/0LDQs9C40L3QsNGG0LjRjiDQv9C+0YHQu9C1INGC0L7Qs9C+INC60LDQuiDQv9C+0LvRg9GH0LjQu9C4INC/0L7QtNC80LDRgdC40LIg0YLQvtCy0LDRgNC+0LIg0L3Rg9C20L3QvtC5INGB0YLRgNCw0L3QuNGG0YtcclxuICAgIHVwZGF0ZVByb2RQYWdpbmF0aW9uKGZpbHRlcmVkQW5kU29ydGVkRGF0YS5sZW5ndGgsIHBhZ2VOdW1iZXIsIHRvdGFsUGFnZXMpXHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxuY29uc3Qgc29ydFByb2RCeUNhdGVnb3J5ID0gKGZpbHRlcmVkU29ydGVkUGFnZWREYXRhKSA9PiB7XHJcbiAgICBjb25zdCBjYXRlZ29yeXMgPSB7fVxyXG5cclxuICAgIGZvciAoY29uc3QgcHJvZCBvZiBmaWx0ZXJlZFNvcnRlZFBhZ2VkRGF0YSkge1xyXG4gICAgICAgIGxldCBjdXJyZW50Q2F0ZWdvcnkgPSBwcm9kLmNhdGVnb3J5WzBdXHJcbiAgICAgICAgaWYgKCFjdXJyZW50Q2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgY3VycmVudENhdGVnb3J5ID0gJ9CR0LXQtyDQutCw0YLQtdCz0L7RgNC40LgnXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQldGB0LvQuCDRgtC10LrRg9GJ0LXQuSDQutCw0YLQtdCz0L7RgNC40Lgg0L3QtdGCINCyINC+0LHRitC10LrRgtC1IGNhdGVnb3J5cywg0LTQvtCx0LDQstC70Y/QtdC8XHJcbiAgICAgICAgY29uc3QgaXNDYXRlZ29yeSA9IGN1cnJlbnRDYXRlZ29yeSBpbiBjYXRlZ29yeXNcclxuICAgICAgICBpZiAoIWlzQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgY2F0ZWdvcnlzW2N1cnJlbnRDYXRlZ29yeV0gPSBbXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0J/Rg9GI0LjQvCDRgtC+0LLQsNGAINCyINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0YPRjiDQutCw0YLQtdCz0L7RgNC40Y5cclxuICAgICAgICBjYXRlZ29yeXNbY3VycmVudENhdGVnb3J5XS5wdXNoKHByb2QpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coJ2FmdGVyIHJlcGxhY2VkIEJ5IENhdGVnb3J5JywgY2F0ZWdvcnlzKTtcclxuICAgIGNvbnNvbGUubG9nKCdSZXBsYWNlZCBCeSBDYXRlZ29yeSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cclxuICAgIHJldHVybiBjYXRlZ29yeXNcclxufVxyXG5cclxuY29uc3QgYnVpbGRQcm9kdWN0TGlzdExheW91dCA9IChjYXRlZ29yeXMpID0+IHtcclxuICAgIGxldCBwcm9kdWN0U2VjdGlvbnNIdG1sTGF5b3V0ID0gJydcclxuXHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBjYXRlZ29yeXMpIHtcclxuICAgICAgICBsZXQgc2VjdGlvbkh0bWxMYXlvdXQgPSAnJ1xyXG5cclxuICAgICAgICBzZWN0aW9uSHRtbExheW91dCArPSBgXHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwic2VjdGlvbiBzZWN0aW9uX3Byb2R1Y3QtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBjb250YWluZXJfY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sIGNvbC14bC04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwiY29udGFpbmVyX2NhcHRpb24tdGV4dFwiPiR7a2V5fTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+YFxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBzaW5nbGVQcm9kdWN0IG9mIGNhdGVnb3J5c1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0YLQtdCz0Lgg0LXRgdC70Lgg0L7QvdC4INC10YHRgtGMXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YWdzID0gc2luZ2xlUHJvZHVjdC50YWdzXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGJhZGdlTGF5b3V0ID0gJydcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodGFncykgJiYgT2JqZWN0LmtleXModGFncykpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYWRnZUxheW91dCArPSAnPGRpdiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fYmFkZ2UtbGlzdFwiPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ3NbJ25ldyddKSBiYWRnZUxheW91dCArPSAnPHNwYW4gY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2JhZGdlLWl0ZW1cIj7QndC+0LLQuNC90LrQsDwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWdzWydJUCddKSBiYWRnZUxheW91dCArPSAnPHNwYW4gY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2JhZGdlLWl0ZW0gcHJvZHVjdC1pdGVtX19iYWRnZS1pdGVtX3dhdGVycHJvb2ZcIj5JUCA0NDxpPjwvaT48L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgIGJhZGdlTGF5b3V0ICs9ICc8L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBzaW5nbGVQcm9kdWN0LnByaWNlID8gc2luZ2xlUHJvZHVjdC5wcmljZSArICcg4oK9JyA6ICcnXHJcblxyXG4gICAgICAgICAgICAgICAgc2VjdGlvbkh0bWxMYXlvdXQgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgY29sLXNtLTYgY29sLW1kLTQgY29sLXhsLTNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fY2FyZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2JvZHlcIiBocmVmPVwiI1wiIHRpdGxlPVwiJHtzaW5nbGVQcm9kdWN0LnRpdGxlfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7YmFkZ2VMYXlvdXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fcGljXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtzaW5nbGVQcm9kdWN0LmltYWdlfVwiIGFsdD1cIlwiIGxvYWRpbmc9XCJsYXp5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2Zhdm9yaXRlc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtcHJvZHVjdC1pZD1cIiR7c2luZ2xlUHJvZHVjdC5hcnRpY2xlfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRpdGxlPVwiJHtzaW5nbGVQcm9kdWN0LnRpdGxlfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLW1lc3NhZ2U9XCLQlNC+0LHQsNCy0LvQtdC9INCyINC40LfQsdGA0LDQvdC90L7QtVwiPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fZGVzY1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2NvZGVcIj4ke3NpbmdsZVByb2R1Y3QuYXJ0aWNsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInByb2R1Y3QtaXRlbV9fbmFtZVwiPiR7c2luZ2xlUHJvZHVjdC50aXRsZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZHVjdC1pdGVtX19idXlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvZHVjdC1pdGVtX19wcmljZVwiPiR7cHJpY2V9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fY2FydFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1wcm9kdWN0LWlkPVwiJHtzaW5nbGVQcm9kdWN0LmFydGljbGV9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRpdGxlPVwiJHtzaW5nbGVQcm9kdWN0LnRpdGxlfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1tZXNzYWdlPVwi0JTQvtCx0LDQstC70LXQvSDQsiDQutC+0YDQt9C40L3Rg1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VjdGlvbkh0bWxMYXlvdXQgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvc2VjdGlvbj5gXHJcblxyXG4gICAgICAgIHByb2R1Y3RTZWN0aW9uc0h0bWxMYXlvdXQgKz0gc2VjdGlvbkh0bWxMYXlvdXRcclxuICAgIH1cclxuICAgIHJldHVybiBwcm9kdWN0U2VjdGlvbnNIdG1sTGF5b3V0XHJcbn1cclxuXHJcbmNvbnN0IGJ1aWxkTm9Qcm9kdWN0TGlzdE1zZ0xheW91dCA9ICgpID0+IHtcclxuICAgIHJldHVybiBgXHJcbiAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJzZWN0aW9uIHNlY3Rpb25fcHJvZHVjdC1saXN0XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNjcmlwdGlvbl9fbXNnIGRpc3BsYXkgdmlzaWJsZVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPtCaINGB0L7QttCw0LvQtdC90LjRjiwg0L/QviDQktCw0YjQtdC80YMg0LfQsNC/0YDQvtGB0YMg0L3QuNGH0LXQs9C+INC90LUg0L3QsNC50LTQtdC90L4uINCi0L7QstCw0YDQsCDRgSDQtNCw0L3QvdGL0LzQuCDQv9Cw0YDQsNC80LXRgtGA0LDQvNC4INC90LXRgi48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgYFxyXG59XHJcblxyXG5jb25zdCB1cGRhdGVQcm9kdWN0TGlzdE9uUGFnZSA9IChjYXRlZ29yeXMpID0+IHtcclxuICAgIHdpbmRvdy5zcGlubmVyLnNob3coKVxyXG5cclxuICAgIC8vINCh0L7QsdC40YDQsNC10Lwg0LrQvtC90YLQtdC90YIg0YHRgtGA0LDQvdC40YbRiyDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0YLQvtCz0L4g0LXRgdGC0Ywg0LvQuCDQsiDQstGL0LHQvtGA0LrQtSDRgtC+0LLQsNGA0YtcclxuICAgIGNvbnN0IHByb2R1Y3RTZWN0aW9uc0h0bWxMYXlvdXQgPSBPYmplY3Qua2V5cyhjYXRlZ29yeXMpLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgID8gYnVpbGROb1Byb2R1Y3RMaXN0TXNnTGF5b3V0KClcclxuICAgICAgICA6IGJ1aWxkUHJvZHVjdExpc3RMYXlvdXQoY2F0ZWdvcnlzKVxyXG5cclxuICAgIGNvbnN0IHJlbW90ZU5vZGVzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZS1jYXRhbG9nIC5zZWN0aW9uX3Byb2R1Y3QtbGlzdCcpKVxyXG4gICAgLy8g0JHQu9C+0LrQuNGA0YPQtdC8INGC0LXQutGD0YnQuNC1INC/0YDQvtC00YPQutGC0YtcclxuICAgIHJlbW90ZU5vZGVzLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC5hZGQoJ2Jsb2NrZWQnKSlcclxuXHJcbiAgICAvLyDQmNGB0LrRg9GB0YHRgtCy0LXQvdC90L4g0LTQvtCx0LDQstC70Y/QtdC8INC30LDQtNC10YDQttC60YMg0LIg0L/QtdGA0LXRgNC10L3QtNC10YAg0LrQvtC90YLQtdC90YLQsFxyXG4gICAgLy8g0JDQvdCw0LvQvtCz0LjRh9C90LDRjyDQt9Cw0LTQtdGA0LbQutCwINCyINGA0LXQvdC00LXRgNC40L3Qs9C1INC/0LDQs9C40L3QsNGG0LjQuFxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8g0KPQtNCw0LvRj9C10Lwg0YLQtdC60YPRidC40LUg0L/RgNC+0LTRg9C60YLRiyDRgdC+INGB0YLRgNCw0L3QuNGG0YtcclxuICAgICAgICByZW1vdGVOb2Rlcy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpKVxyXG5cclxuICAgICAgICBjb25zdCByZWZlcmVuY2VOb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY2F0YWxvZyAuc2VjdGlvbl9maWx0ZXInKVxyXG5cclxuICAgICAgICAvLyDQktGB0YLQsNCy0LvRj9C10LwgSFRNTCDQutC+0LQg0L/QvtGB0LvQtSByZWZlcmVuY2VOb2RlXHJcbiAgICAgICAgcmVmZXJlbmNlTm9kZS5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyZW5kJywgcHJvZHVjdFNlY3Rpb25zSHRtbExheW91dClcclxuXHJcbiAgICAgICAgLy8g0KHQutGA0L7Qu9C40Lwg0LIg0L3QsNGH0LDQu9C+INGB0YLRgNCw0L3QuNGG0YtcclxuICAgICAgICBzbW9vdGhTY3JvbGxUbygwLCAxMDAwKVxyXG5cclxuICAgICAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC60L3QvtC/0LrQuCDQtNC+0LHQsNCy0LvQtdC90LjRjyDQsiDQuNC30LHRgNCw0L3QvdGL0LUg0Lgg0LIg0LrQvtGA0LfQuNC90YNcclxuICAgICAgICBpbml0QWRkVG9GYXZvcml0ZXMoKVxyXG4gICAgICAgIGluaXRBZGRUb0NhcnQoKVxyXG5cclxuICAgICAgICAvLyDQodC60YDRi9Cy0LDQtdC8INGB0L/QuNC90L3QtdGAXHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSgpXHJcblxyXG4gICAgICAgIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INCw0L3QuNC80LjRgNGD0LXQvNGL0LUg0YHQtdC60YbQuNC4INC10YHQu9C4INC90YPQttC90L5cclxuICAgICAgICBzaG93QW5pbUVsZW1lbnRzKClcclxuICAgIH0sIFJFUkVOREVSX1BST0RfVElNRU9VVF9ERUxBWSlcclxufVxyXG5cclxuY29uc3QgcHJvY2Vzc1Byb2REYXRhID0gKHVybCkgPT4ge1xyXG5cclxuICAgIC8vINCf0L7Qu9GD0YfQsNC10Lwg0L/QsNGA0LDQvNC10YLRgNGLINGB0L7RgNGC0LjRgNC+0LLQutC4INC4INGE0LjQu9GM0YLRgNCw0YbQuNC4INC40LcgdXJsXHJcbiAgICBjb25zdCBtYW5pcHVsYXRpb25EYXRhT2JqID0gcGFyc2VQcm9kVXJsKHVybClcclxuXHJcbiAgICBjb25zb2xlLmxvZygnbWFuaXB1bGF0aW9uRGF0YU9iaicsIG1hbmlwdWxhdGlvbkRhdGFPYmopO1xyXG5cclxuICAgIC8vIFN0ZXAgNS4g0J7QsdC90L7QstC70Y/QtdC8INGB0L/QuNGB0L7QuiDRgtC+0LLQsNGA0L7QsiDQvdCwINGB0YLRgNC90LjRhtC1XHJcbiAgICB1cGRhdGVQcm9kdWN0TGlzdE9uUGFnZShcclxuXHJcbiAgICAgICAgLy8gU3RlcCA0LiDQodC+0YDRgtC40YDRg9C10Lwg0YLQvtCy0LDRgNGLINC/0L4g0LrQsNGC0LXQs9C+0YDQuNGP0LzQuC4gLS0tINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCOiDQvtCx0YrQtdC60YIg0YEg0LrQsNGC0LXQs9C+0YDQuNGP0LzQuCwg0LPQtNC1INCyINC30LDQvdGH0LXQvdC40Lgg0LrQsNC20LTQvtC5INC60LDRgtC10LPQvtGA0LjQuCDQu9C10LbQuNGCINC80LDRgdGB0LjQsiDRgSDRgtC+0LLQsNGA0LDQvNC4INGN0YLQvtC5INC60LDRgtC10LPQvtGA0LjQuFxyXG4gICAgICAgIHNvcnRQcm9kQnlDYXRlZ29yeShcclxuXHJcbiAgICAgICAgICAgIC8vIFN0ZXAgMy4g0JLRi9Cx0LjRgNCw0LXQvCDQv9C+0LTQvNCw0YHRgdC40LIg0L3Rg9C20L3Rg9GOINGB0YLRgNCw0L3QuNGG0YMuIC0tLSDQktC+0LfQstGA0LDRidCw0LXRgjog0L/QvtC00LzQsNGB0YHQuNCyINGBINC/0YDQvtC00YPQutGC0LDQvNC40Lgg0YHQvtC+0YLQstC10YLRgdGC0YDRg9GO0YnQtdC5INGB0YLRgNCw0L3QuNGG0YtcclxuICAgICAgICAgICAgLy8g0J/QvtGB0LvQtSDQv9C+0LvRg9GH0LXQvdC40Y8g0YHRgtGA0LDQvdC40YbRiyAo0LLQvdGD0YLRgNC4INC80LXRgtC+0LTQsCkg0L7QsdC90L7QstC70Y/QtdC8INC/0LDQs9C40L3QsNGG0LjRjiFcclxuICAgICAgICAgICAgZ2V0UGFnZUZyb21Qcm9kRGF0YShcclxuICAgICAgICAgICAgICAgIG1hbmlwdWxhdGlvbkRhdGFPYmouc2VsZWN0LFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN0ZXAgMi4g0KHQvtGA0YLQuNGA0YPQtdC8INC00LDQvdC90YvQtSAtLS0g0JLQvtC30LLRgNCw0YnQsNC10YI6INC+0YLRgdC+0YDRgtC40YDQvtCy0LDQvdC90YvQuSDQvNCw0YHRgdC40LIg0YEg0L/RgNC+0LTRg9C60YLQsNC80LhcclxuICAgICAgICAgICAgICAgIHNvcnRQcm9kRGF0YShcclxuICAgICAgICAgICAgICAgICAgICBtYW5pcHVsYXRpb25EYXRhT2JqLnNvcnQsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN0ZXAgMS4g0KTQuNC70YzRgtGA0YPQtdC8INC00LDQvdC90YvQtSAtLS0g0JLQvtC30LLRgNCw0YnQsNC10YI6INC+0YLRhNC40LvRjNGC0YDQvtCy0LDQvdC90YvQuSDQvNCw0YHRgdC40LIg0YEg0L/RgNC+0LTRg9C60YLQsNC80LhcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJQcm9kRGF0YShcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFuaXB1bGF0aW9uRGF0YU9iai5maWx0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5fQ0FUQUxPR1xyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIClcclxuICAgIClcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY2F0YWxvZycpXHJcbiAgICBpZiAoIWlzUGFnZUNhdGFsb2cpIHJldHVyblxyXG5cclxuICAgIGluaXRDYXRhbG9nRmlsdGVyQ29udHJvbGxlcnMoKVxyXG4gICAgaW5pdENhdGFsb2dGaWx0ZXJSZXNldCgpXHJcbiAgICBpbml0Q2F0YWxvZ1BhZ2luYXRpb25Db250cm9sbGVycygpXHJcbiAgICBpbml0RGVmYXVsdFByb2RDYXRhbG9nKClcclxuICAgIHJlcXVlc3RQcm9kdWN0RGF0YSgpXHJcbn0pXHJcbiJdLCJmaWxlIjoiY2F0YWxvZy5qcyJ9
