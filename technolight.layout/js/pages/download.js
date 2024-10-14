// Tabs
const resetAllDownTabs = () => {
    const downTabs = Array.from(document.querySelectorAll('.download__tabs-item'))
    downTabs.forEach(tab => tab.classList.remove('active'))
}

const resetAllDownContentExcludingTarget = (target) => {
    const downContents = Array.from(document.querySelectorAll('.download__tabs-content'))
    downContents.forEach(el => {
        if (el !== target) {
            el.classList.add('hidden') // during of animation is 100ms
            setTimeout(() => el.classList.add('hide'), 100)
        } else {
            setTimeout(() => target.classList.remove('hide'), 100)
        }
    })
}

const initDownTabsHandlers = () => {
    const downTabs = Array.from(document.querySelectorAll('.download__tabs-item'))
    downTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.classList.contains('active')) return

            const targetName = this.dataset.target
            const target = document.querySelector(`[data-tab-target="${targetName}"]`)

            resetAllDownTabs()
            resetAllDownContentExcludingTarget(target)
            this.classList.add('active')

            setTimeout(() => {target.classList.remove('hidden')}, 150)
        })
    })
}

// Getting and setting data
const initDownData = async () => {

    if (!window.DownloadFilesDataLink) {
        console.warn('Не указана API URL файлы для скачивания window.DownloadFilesDataLink')
        return
    }

    (async () => {
        window.spinner.show()

        try {
            const res = await fetch(window.DownloadFilesDataLink)
            if (!res.ok) {
                throw new Error('Сетевая ошибка при запросе даннах файлов для скачивания!')
            }
            const data = await res.json()
            setDownData(data)
        } catch (error) {
            console.error(error)
        }
    })()

    const setDownData = (data) => {
        const normalizedData = {}

        data.forEach(el => {
            const category = el.category

            if (!normalizedData[category]) normalizedData[category] = []

            normalizedData[category].push(el)
        })

        setTimeout(() => {
            window.spinner.hide()
            setDownCaption()
            setDownTabs(normalizedData)
            setDownFiles(normalizedData)
            showAnimElements()
            initDownTabsHandlers()
        }, 100)
    }
}

const setDownCaption = () => {
    const target = document.getElementById('DownloadCaption')

    const insertHtml = `
        <div class="container container_caption animation-element">
            <div class="row">
                <div class="col col-xl-8">
                    <h2 class="container_caption-text">Скачать</h2>
                </div>
            </div>
        </div>
    `

    if (target) target.innerHTML = insertHtml
}

const setDownTabs = (data) => {
    const categories = Object.keys(data)
    const target = document.getElementById('DownloadTabsList')

    let insertHtml = `
        <div class="container">
            <div class="download__tabs animation-element">
                <ul class="download__tabs-list">
    `

    insertHtml += `
                    <li class="download__tabs-item active" data-target="${data['Каталоги'][0].category_id}">
                        <button type="button"><span>Каталоги</span></button>
                    </li>
    `

    categories.forEach((category) => {
        if (category === 'Каталоги') return

        insertHtml += `
                    <li class="download__tabs-item" data-target="${data[category][0].category_id}">
                        <button type="button"><span>${category}</span></button>
                    </li>
        `
    })

    insertHtml += `
                </ul>
            </div>
        </div>
    `

    if (target) target.innerHTML = insertHtml
}

const setDownFiles = (data) => {
    const categories = Object.keys(data)
    const target = document.getElementById('DownloadFilesList')

    let insertHtml = ''

    // Первым рендерим Каталоги
    const catalogs = data['Каталоги']

    if (catalogs && catalogs.length > 0) {
        insertHtml += `
            <div class="download__tabs-content animation-element" data-tab-target="${data['Каталоги'][0].category_id}">
                <div class="container container_caption">
                    <div class="row">
                        <div class="col col-xl-8">
                            <h2 class="container_caption-text">Каталоги</h2>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
        `

        catalogs.forEach(catalog => {
            insertHtml += `
                        <div class="col-12 col-md-6 col-xl-4">
                            <div class="download__content">
                                <div class="download__card">
                                    <div class="download__poster">
                                        <img src="${catalog.preview}" alt="" />
                                    </div>
                                    <div class="download_description">
                                        <h4 class="download__name">${catalog.name}</h4>
                                        <span class="download__text">Каталог</span>
                                        <span class="download__text uppercase">${catalog.extension} - ${catalog.size_human}</span>
                                    </div>
                                </div>
                                <div class="download__button">
                                    <a class="btn btn_block btn_dark btn_download" href="${catalog.download}" download="download">
                                        <i></i>
                                        <span>Скачать каталог</span>
                                    </a>
                                </div>
                            </div>
                        </div>
            `
        })

        insertHtml += `
                    </div>
                </div>
            </div>
        `
    }

    // Остальные файлы для скачивания
    categories.forEach((category) => {
        if (category === 'Каталоги') return

        insertHtml += `<div class="download__tabs-content hide hidden" data-tab-target="${data[category][0].category_id}">`

        if (data[category].length > 0) {
            const sections = getDataFilesSections(data[category])

            for (const fileSection in sections) {
                insertHtml += `
                    <div class="container container_caption">
                        <div class="row">
                            <div class="col col-xl-8">
                                <h2 class="container_caption-text">${fileSection}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="download__wrap">
                                    <table class="download__table">
                `

                sections[fileSection].forEach(el => {
                    insertHtml += `
                                        <tr>
                                            <td><a href="${el.download}" download>${el.name}</a></td>
                                            <td>${el.extension} - ${el.size_human}</td> <!-- ${category} -->
                                            <td><a class="btn btn_dark btn_download" href="${el.download}" download><i></i></a></td>
                                        </tr>
                    `
                })

                insertHtml += `
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        }

        insertHtml += '</div>'
    })

    if (target) target.innerHTML = insertHtml
}

const getDataFilesSections = (data) => {
    const normalizedData = {}

    data.forEach(el => {
        const tag = el.tags.length > 0 ? el.tags[0] : ''

        if (!normalizedData[tag]) normalizedData[tag] = []

        normalizedData[tag].push(el)
    })

    return normalizedData
}

window.addEventListener('load', initDownData)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkb3dubG9hZC9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGFic1xuY29uc3QgcmVzZXRBbGxEb3duVGFicyA9ICgpID0+IHtcbiAgICBjb25zdCBkb3duVGFicyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRvd25sb2FkX190YWJzLWl0ZW0nKSlcbiAgICBkb3duVGFicy5mb3JFYWNoKHRhYiA9PiB0YWIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXG59XG5cbmNvbnN0IHJlc2V0QWxsRG93bkNvbnRlbnRFeGNsdWRpbmdUYXJnZXQgPSAodGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgZG93bkNvbnRlbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZG93bmxvYWRfX3RhYnMtY29udGVudCcpKVxuICAgIGRvd25Db250ZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgaWYgKGVsICE9PSB0YXJnZXQpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpIC8vIGR1cmluZyBvZiBhbmltYXRpb24gaXMgMTAwbXNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWwuY2xhc3NMaXN0LmFkZCgnaGlkZScpLCAxMDApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyksIDEwMClcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmNvbnN0IGluaXREb3duVGFic0hhbmRsZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IGRvd25UYWJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZG93bmxvYWRfX3RhYnMtaXRlbScpKVxuICAgIGRvd25UYWJzLmZvckVhY2godGFiID0+IHtcbiAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSByZXR1cm5cblxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TmFtZSA9IHRoaXMuZGF0YXNldC50YXJnZXRcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXRhYi10YXJnZXQ9XCIke3RhcmdldE5hbWV9XCJdYClcblxuICAgICAgICAgICAgcmVzZXRBbGxEb3duVGFicygpXG4gICAgICAgICAgICByZXNldEFsbERvd25Db250ZW50RXhjbHVkaW5nVGFyZ2V0KHRhcmdldClcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7dGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpfSwgMTUwKVxuICAgICAgICB9KVxuICAgIH0pXG59XG5cbi8vIEdldHRpbmcgYW5kIHNldHRpbmcgZGF0YVxuY29uc3QgaW5pdERvd25EYXRhID0gYXN5bmMgKCkgPT4ge1xuXG4gICAgaWYgKCF3aW5kb3cuRG93bmxvYWRGaWxlc0RhdGFMaW5rKSB7XG4gICAgICAgIGNvbnNvbGUud2Fybign0J3QtSDRg9C60LDQt9Cw0L3QsCBBUEkgVVJMINGE0LDQudC70Ysg0LTQu9GPINGB0LrQsNGH0LjQstCw0L3QuNGPIHdpbmRvdy5Eb3dubG9hZEZpbGVzRGF0YUxpbmsnKVxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93KClcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2god2luZG93LkRvd25sb2FkRmlsZXNEYXRhTGluaylcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQodC10YLQtdCy0LDRjyDQvtGI0LjQsdC60LAg0L/RgNC4INC30LDQv9GA0L7RgdC1INC00LDQvdC90LDRhSDRhNCw0LnQu9C+0LIg0LTQu9GPINGB0LrQsNGH0LjQstCw0L3QuNGPIScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxuICAgICAgICAgICAgc2V0RG93bkRhdGEoZGF0YSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgIH1cbiAgICB9KSgpXG5cbiAgICBjb25zdCBzZXREb3duRGF0YSA9IChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWREYXRhID0ge31cblxuICAgICAgICBkYXRhLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSBlbC5jYXRlZ29yeVxuXG4gICAgICAgICAgICBpZiAoIW5vcm1hbGl6ZWREYXRhW2NhdGVnb3J5XSkgbm9ybWFsaXplZERhdGFbY2F0ZWdvcnldID0gW11cblxuICAgICAgICAgICAgbm9ybWFsaXplZERhdGFbY2F0ZWdvcnldLnB1c2goZWwpXG4gICAgICAgIH0pXG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlKClcbiAgICAgICAgICAgIHNldERvd25DYXB0aW9uKClcbiAgICAgICAgICAgIHNldERvd25UYWJzKG5vcm1hbGl6ZWREYXRhKVxuICAgICAgICAgICAgc2V0RG93bkZpbGVzKG5vcm1hbGl6ZWREYXRhKVxuICAgICAgICAgICAgc2hvd0FuaW1FbGVtZW50cygpXG4gICAgICAgICAgICBpbml0RG93blRhYnNIYW5kbGVycygpXG4gICAgICAgIH0sIDEwMClcbiAgICB9XG59XG5cbmNvbnN0IHNldERvd25DYXB0aW9uID0gKCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdEb3dubG9hZENhcHRpb24nKVxuXG4gICAgY29uc3QgaW5zZXJ0SHRtbCA9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBjb250YWluZXJfY2FwdGlvbiBhbmltYXRpb24tZWxlbWVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgY29sLXhsLThcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwiY29udGFpbmVyX2NhcHRpb24tdGV4dFwiPtCh0LrQsNGH0LDRgtGMPC9oMj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgXG5cbiAgICBpZiAodGFyZ2V0KSB0YXJnZXQuaW5uZXJIVE1MID0gaW5zZXJ0SHRtbFxufVxuXG5jb25zdCBzZXREb3duVGFicyA9IChkYXRhKSA9PiB7XG4gICAgY29uc3QgY2F0ZWdvcmllcyA9IE9iamVjdC5rZXlzKGRhdGEpXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkVGFic0xpc3QnKVxuXG4gICAgbGV0IGluc2VydEh0bWwgPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fdGFicyBhbmltYXRpb24tZWxlbWVudFwiPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRvd25sb2FkX190YWJzLWxpc3RcIj5cbiAgICBgXG5cbiAgICBpbnNlcnRIdG1sICs9IGBcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZG93bmxvYWRfX3RhYnMtaXRlbSBhY3RpdmVcIiBkYXRhLXRhcmdldD1cIiR7ZGF0YVsn0JrQsNGC0LDQu9C+0LPQuCddWzBdLmNhdGVnb3J5X2lkfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCI+PHNwYW4+0JrQsNGC0LDQu9C+0LPQuDwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICBgXG5cbiAgICBjYXRlZ29yaWVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XG4gICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ9Ca0LDRgtCw0LvQvtCz0LgnKSByZXR1cm5cblxuICAgICAgICBpbnNlcnRIdG1sICs9IGBcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZG93bmxvYWRfX3RhYnMtaXRlbVwiIGRhdGEtdGFyZ2V0PVwiJHtkYXRhW2NhdGVnb3J5XVswXS5jYXRlZ29yeV9pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPjxzcGFuPiR7Y2F0ZWdvcnl9PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICBgXG4gICAgfSlcblxuICAgIGluc2VydEh0bWwgKz0gYFxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYFxuXG4gICAgaWYgKHRhcmdldCkgdGFyZ2V0LmlubmVySFRNTCA9IGluc2VydEh0bWxcbn1cblxuY29uc3Qgc2V0RG93bkZpbGVzID0gKGRhdGEpID0+IHtcbiAgICBjb25zdCBjYXRlZ29yaWVzID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRG93bmxvYWRGaWxlc0xpc3QnKVxuXG4gICAgbGV0IGluc2VydEh0bWwgPSAnJ1xuXG4gICAgLy8g0J/QtdGA0LLRi9C8INGA0LXQvdC00LXRgNC40Lwg0JrQsNGC0LDQu9C+0LPQuFxuICAgIGNvbnN0IGNhdGFsb2dzID0gZGF0YVsn0JrQsNGC0LDQu9C+0LPQuCddXG5cbiAgICBpZiAoY2F0YWxvZ3MgJiYgY2F0YWxvZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICBpbnNlcnRIdG1sICs9IGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fdGFicy1jb250ZW50IGFuaW1hdGlvbi1lbGVtZW50XCIgZGF0YS10YWItdGFyZ2V0PVwiJHtkYXRhWyfQmtCw0YLQsNC70L7Qs9C4J11bMF0uY2F0ZWdvcnlfaWR9XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBjb250YWluZXJfY2FwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sIGNvbC14bC04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwiY29udGFpbmVyX2NhcHRpb24tdGV4dFwiPtCa0LDRgtCw0LvQvtCz0Lg8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICBgXG5cbiAgICAgICAgY2F0YWxvZ3MuZm9yRWFjaChjYXRhbG9nID0+IHtcbiAgICAgICAgICAgIGluc2VydEh0bWwgKz0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbWQtNiBjb2wteGwtNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX2NhcmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fcG9zdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2NhdGFsb2cucHJldmlld31cIiBhbHQ9XCJcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJkb3dubG9hZF9fbmFtZVwiPiR7Y2F0YWxvZy5uYW1lfTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkb3dubG9hZF9fdGV4dFwiPtCa0LDRgtCw0LvQvtCzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZG93bmxvYWRfX3RleHQgdXBwZXJjYXNlXCI+JHtjYXRhbG9nLmV4dGVuc2lvbn0gLSAke2NhdGFsb2cuc2l6ZV9odW1hbn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG5fYmxvY2sgYnRuX2RhcmsgYnRuX2Rvd25sb2FkXCIgaHJlZj1cIiR7Y2F0YWxvZy5kb3dubG9hZH1cIiBkb3dubG9hZD1cImRvd25sb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGk+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtCh0LrQsNGH0LDRgtGMINC60LDRgtCw0LvQvtCzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgYFxuICAgICAgICB9KVxuXG4gICAgICAgIGluc2VydEh0bWwgKz0gYFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgXG4gICAgfVxuXG4gICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGE0LDQudC70Ysg0LTQu9GPINGB0LrQsNGH0LjQstCw0L3QuNGPXG4gICAgY2F0ZWdvcmllcy5mb3JFYWNoKChjYXRlZ29yeSkgPT4ge1xuICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICfQmtCw0YLQsNC70L7Qs9C4JykgcmV0dXJuXG5cbiAgICAgICAgaW5zZXJ0SHRtbCArPSBgPGRpdiBjbGFzcz1cImRvd25sb2FkX190YWJzLWNvbnRlbnQgaGlkZSBoaWRkZW5cIiBkYXRhLXRhYi10YXJnZXQ9XCIke2RhdGFbY2F0ZWdvcnldWzBdLmNhdGVnb3J5X2lkfVwiPmBcblxuICAgICAgICBpZiAoZGF0YVtjYXRlZ29yeV0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbnMgPSBnZXREYXRhRmlsZXNTZWN0aW9ucyhkYXRhW2NhdGVnb3J5XSlcblxuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlU2VjdGlvbiBpbiBzZWN0aW9ucykge1xuICAgICAgICAgICAgICAgIGluc2VydEh0bWwgKz0gYFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGNvbnRhaW5lcl9jYXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbCBjb2wteGwtOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJjb250YWluZXJfY2FwdGlvbi10ZXh0XCI+JHtmaWxlU2VjdGlvbn08L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX3dyYXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cImRvd25sb2FkX190YWJsZVwiPlxuICAgICAgICAgICAgICAgIGBcblxuICAgICAgICAgICAgICAgIHNlY3Rpb25zW2ZpbGVTZWN0aW9uXS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0SHRtbCArPSBgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj1cIiR7ZWwuZG93bmxvYWR9XCIgZG93bmxvYWQ+JHtlbC5uYW1lfTwvYT48L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JHtlbC5leHRlbnNpb259IC0gJHtlbC5zaXplX2h1bWFufTwvdGQ+IDwhLS0gJHtjYXRlZ29yeX0gLS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48YSBjbGFzcz1cImJ0biBidG5fZGFyayBidG5fZG93bmxvYWRcIiBocmVmPVwiJHtlbC5kb3dubG9hZH1cIiBkb3dubG9hZD48aT48L2k+PC9hPjwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBpbnNlcnRIdG1sICs9IGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluc2VydEh0bWwgKz0gJzwvZGl2PidcbiAgICB9KVxuXG4gICAgaWYgKHRhcmdldCkgdGFyZ2V0LmlubmVySFRNTCA9IGluc2VydEh0bWxcbn1cblxuY29uc3QgZ2V0RGF0YUZpbGVzU2VjdGlvbnMgPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWREYXRhID0ge31cblxuICAgIGRhdGEuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGNvbnN0IHRhZyA9IGVsLnRhZ3MubGVuZ3RoID4gMCA/IGVsLnRhZ3NbMF0gOiAnJ1xuXG4gICAgICAgIGlmICghbm9ybWFsaXplZERhdGFbdGFnXSkgbm9ybWFsaXplZERhdGFbdGFnXSA9IFtdXG5cbiAgICAgICAgbm9ybWFsaXplZERhdGFbdGFnXS5wdXNoKGVsKVxuICAgIH0pXG5cbiAgICByZXR1cm4gbm9ybWFsaXplZERhdGFcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbml0RG93bkRhdGEpIl0sImZpbGUiOiJkb3dubG9hZC5qcyJ9
