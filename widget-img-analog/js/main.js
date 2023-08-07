const widgetElement = document.querySelector('.widget')

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
        .widget__options {
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
    widgetElement.parentNode.insertBefore(styleElement, widgetElement)
}

const setWidgetProducts = (parentNode, props) => {
    for (const item of props) {

        if (!item.active) continue

        const itemStr = `
            <div class="widget__card">
                <div class="widget__card-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <span class="widget__card-code">
                    Артикул товара ${item.code}
                </span>
                <p class="widget__card-name">
                    ${item.name}
                </p>
                <span class="widget__card-price">
                    ${item.price}
                </span>
                <a href="${item.link}" class="widget__card-link" target="_blank">
                    Смотреть товар
                </a>
            </div>
        `

        const itemNode = document.createElement('li')
        itemNode.className = "widget__card-item"
        itemNode.innerHTML = itemStr
        parentNode.appendChild(itemNode)
    }
}

const setWidgetTitle = (parentNode, title) => {
    if(!title) return

    const node = document.createElement('h2')
    node.className = 'widget__header-title'
    node.innerText = title
    parentNode.appendChild(node)
}

const setWidtetLinkAll = (parentNode,link) => {
    if(!link) return

    const node = document.createElement('a')
    node.className = 'widget__header-link'
    node.href = link
    node.textContent = 'Смотреть все'
    node.target = '_blank';
    parentNode.appendChild(node)
}

const buildWidget = (data) => {
    const widgetOptions = document.createElement('div')
    const widgetHeader = document.createElement('div')
    const widgetCardList = document.createElement('ul')

    widgetOptions.className = 'widget__options'
    widgetHeader.className = 'widget__header'
    widgetCardList.className = 'widget__card-list'

    if (data.title || data.all) {
        widgetOptions.appendChild(widgetHeader)
        setWidgetTitle(widgetHeader, data.title)
        setWidtetLinkAll(widgetHeader, data.all)
    }

    if (data.products.length > 0) {
        widgetOptions.appendChild(widgetCardList)
        setWidgetProducts(widgetCardList, data.products)
    }

    widgetElement.appendChild(widgetOptions)
}

if (widgetElement) {
    fetchWidgetData('../data.json')
        .then(data => {
            setWidgetStyles(data.settings)
            buildWidget(data)
        })
}