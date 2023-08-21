(function (document, window) {

    if (!document.currentScript) {
        throw new Error('Запустите Виджет подбора аналогов в элементе script')
        return
    }

    const scriptElement = document.currentScript
    const head = document.head
    const container = scriptElement.parentNode
    const styles = scriptElement.getAttribute('data-style-resource')
    const scripts = scriptElement.getAttribute('data-script-resource')
    const token = scriptElement.getAttribute('data-token')
    const site = scriptElement.getAttribute('data-site')

    window.analogueService = {}

    function setResources() {
        window.analogueService.token = token
        window.analogueService.site = site
        window.analogueService.root = container
        window.analogueService.style = styles
        window.analogueService.script = scripts
    }

    function addResource(type, resource, targetNode) {
        let element

        if (type === 'script') {
            element = document.createElement('script')
            element.crossorigin = true
            element.defer = true
            element.src = resource
        }

        if (type === 'style') {
            element = document.createElement('link');
            element.rel = 'stylesheet'
            element.href = resource
        }

        targetNode.appendChild(element);
    }

    setResources()
    addResource('style', styles, head)
    addResource('script', scripts, container)
})(document, window)