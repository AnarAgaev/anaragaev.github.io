const constructorTabs = $('.constructor__tabs li');
const constructorDrops = $('.constructor__content');

function resetConstructorTabs() {
    $(constructorTabs).removeClass('active');
}

function resetConstructorDrops() {
    $(constructorDrops).removeClass('active');
}

function initialConstructorTabs() {
    $(constructorTabs).on('click', function () {
        if (!this.classList.contains('active')) {
            const idx = $(this)
                .index('.constructor__tabs li');
            
            resetConstructorTabs();
            resetConstructorDrops();
            
            $(this).addClass('active');
            $(constructorDrops[idx]).addClass('active');
        }
    });
}


$(document).ready(() => {
    initialConstructorTabs();
});
