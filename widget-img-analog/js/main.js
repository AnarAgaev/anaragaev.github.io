const widgetClassName = 'ASWidget'
const widgetRoot = window.analogueService.root

const fetchWidgetData = async (url) => {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error('Ошибка получения данных виджета')
        }
        const data = await res.json()
        return data
    } catch (error) {
        console.log('Произошла ошибка обработки данных виджета:', error)
    }
}

const setWidgetStyles = (props) => {
    const styleElement = document.createElement('style')
    const stylesStr = `
        .${widgetClassName}__wrapper {
            --font-family: ${props['font-family']};
            --display-title: ${props['display-title']};
            --color-title: ${props['color-title']};
            --display-link-all: ${props['display-link-all']};
            --color-link-all: ${props['color-link-all']};
            --color-link-all-hover: ${props['color-link-all-hover']};
            --cards-count-sm: repeat(${props['cards-count-sm']}, 1fr);
            --cards-count-md: repeat(${props['cards-count-md']}, 1fr);
            --cards-count-lg: repeat(${props['cards-count-lg']}, 1fr);
            --cards-count-xl: repeat(${props['cards-count-xl']}, 1fr);
            --color-code: ${props['color-code']};
            --color-name: ${props['color-name']};
            --color-price: ${props['color-price']};
            --color-button: ${props['color-button']};
            --color-button-hover: ${props['color-button-hover']};
            --color-button-text: ${props['color-button-text']};
            --color-button-text-hover: ${props['color-button-text-hover']};
        }
    `
    styleElement.innerHTML = stylesStr.replace(/\s/g, "")
    widgetRoot.appendChild(styleElement)
}

const setWidgetProducts = (parentNode, props) => {
    for (const item of props) {

        if (!item.active) continue

        const itemStr = `
            <div class="${widgetClassName}__card">
                <div class="${widgetClassName}__card-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <span class="${widgetClassName}__card-code">
                    Артикул товара ${item.code}
                </span>
                <p class="${widgetClassName}__card-name">
                    ${item.name}
                </p>
                <span class="${widgetClassName}__card-price">
                    ${item.price}
                </span>
                <a href="${item.link}" class="${widgetClassName}__card-link" target="_blank">
                    Смотреть товар
                </a>
            </div>
        `

        const itemNode = document.createElement('li')
        itemNode.className = `${widgetClassName}__card-item`
        itemNode.innerHTML = itemStr
        parentNode.appendChild(itemNode)
    }
}

const setWidgetTitle = (parentNode, title) => {
    if(!title) return

    const node = document.createElement('h2')
    node.className = `${widgetClassName}__header-title`
    node.innerText = title
    parentNode.appendChild(node)
}

const setWidtetLinkAll = (parentNode,link) => {
    if(!link) return

    const node = document.createElement('a')
    node.className = `${widgetClassName}__header-link`
    node.href = link
    node.textContent = 'Смотреть все'
    node.target = '_blank'
    parentNode.appendChild(node)
}

const buildWidget = (data) => {
    const widgetWrapper = document.createElement('div')
    const widgetHeader = document.createElement('div')
    const widgetCardList = document.createElement('ul')

    widgetWrapper.className = `${widgetClassName}__wrapper`
    widgetHeader.className = `${widgetClassName}__header`
    widgetCardList.className = `${widgetClassName}__card-list`

    if (data.title || data.all) {
        widgetWrapper.appendChild(widgetHeader)
        setWidgetTitle(widgetHeader, data.title)
        setWidtetLinkAll(widgetHeader, data.all)
    }

    if (data.products.length > 0) {
        widgetWrapper.appendChild(widgetCardList)
        setWidgetProducts(widgetCardList, data.products)
    }

    widgetRoot.appendChild(widgetWrapper)
}

// Здесь можно проверять токен и сайт
if (widgetRoot) {
    fetchWidgetData('data.json')
        .then(data => {
            widgetRoot.classList.add(widgetClassName);
            setWidgetStyles(data.settings)
            buildWidget(data)
        })
}