$(document).ready(function(){
    //Added background to the header when user slidinp page
    $(window).scroll(function () {
         if( $(this).scrollTop() > 50 ) {
             $('header.header').addClass('back-on')
         }
         else {
             $('header.header').removeClass('back-on')
         }
    })

    // Toggle header navigation
    $('.burger-container').on('click', function(){
        toggleNav()
    })

    function toggleNav () {
        let header = $('.header'),
            body   = $('body')

        header.toggleClass('menu-opened')
        body.toggleClass('menu-opened')
        $('.main-nav__drop-menu').removeClass('show')
        $('.main-nav .caret').removeClass('drop-opend')
    }

    // Drop menu in main navigation
    $('.main-nav__link, .main-nav .caret').on('click', function(){
        let windowWidth = $(window).width()
        let dropMenu = $(this).nextAll('.main-nav__drop-menu')
        let caret = $(this).parent().children('.caret')

        if(windowWidth < 992) {
            if( dropMenu.length > 0 ) {
                $('.main-nav__drop-menu').not(dropMenu).removeClass('show')
                $('.main-nav .caret').not(caret).removeClass('drop-opend')
                dropMenu.toggleClass('show')
                caret.toggleClass('drop-opend')
            }

        }
    })

    // Smooth scroll to the link inside the page
    $('.main-nav__link[href^="#"]').click(function () {
        let id  = $(this).attr('href'),
            top = $(id).offset().top

        $('html, body').animate({scrollTop: top}, 750)

        // Hide navigation if it is open
        if( $('body').hasClass('menu-opened') ) toggleNav()
    })

    // Animation items on index page when user is scrolling screen -- Start
    const SHOW_ITEM_DELAY_STEP = 0.2
    const BASE__DELAY = 0.2
    let showDelay = BASE__DELAY

    // Function to display multiple items
    function showItems(containerId) {
        let hiddenItems = $('#' + containerId + ' .hidden-item'),
            shownItems  = $('#' + containerId + ' .hidden-item.hidden-item--show')
            numItems = hiddenItems.length - 1

        // Show items if not shown
        if( shownItems.length == 0 ) {
            hiddenItems.each(function(index) {
                $(this).css('transition-delay', showDelay + 's').addClass('hidden-item--show')

                if( index != numItems )  showDelay += SHOW_ITEM_DELAY_STEP
                else  showDelay = BASE__DELAY
            })
        }
    }

    // Function to display individual item
    function showItem(elementId) {
        // Show item if not shown
        if( !$('#' + elementId).hasClass('hidden-item--show') ) {
            $('#' + elementId).addClass('hidden-item--show')
        }
    }

    // Listen scroll and show hidden elements only on index page
    if( $('body').hasClass('page-main') ) {

        let animatedElements = $('[id^="index__"]')

        // Show items of first screen and nav right after document ready
        showItems('index__header')
        showItems('index__firstScreen')

        // Show items on the page after scroll
        $(window).scroll(function () {
            let scrollTop = $(this).scrollTop(),
                windowHeight = $( window ).height(),
                pointOfDisplay = windowHeight/1.3

            animatedElements.each(function(indx, element) {
                let offsetTopElement = $(element).offset().top,
                    elementId = $(element).attr('id')

                if( (offsetTopElement - pointOfDisplay) < scrollTop ) {
                    if( $(element).hasClass('hidden-item') ) showItem(elementId)
                    else showItems(elementId)
                }
            })
        })
    }
    // Animation items on index page when user is scrolling screen -- End

})
