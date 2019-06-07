// Varible for controll multiple clicks
var eventTimer = true

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

    // Smooth scroll to the inside link  on the page selt
    $('.main-nav__link[href^="#"]').click(function () {
        let id  = $(this).attr('href'),
            top = $(id).offset().top

        $('html, body').animate({scrollTop: top}, 750)

        // Hide navigation if it is open
        if( $('body').hasClass('menu-opened') ) toggleNav()
    })

    // Animation items on index page when user is scrolling screen -- Start
    const SHOW_ITEM_DELAY_STEP = 0.2
    const BASE__DELAY = 0.1
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
            let scrollTop      = $(this).scrollTop(),
                windowHeight   = $( window ).height(),
                pointOfDisplay = windowHeight/1

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


    // Celender slider on the page of the resaults
    if ( $('body').hasClass('page-results-participants') || 
         $('body').hasClass('page-results-post') ||
         $('body').hasClass('page-results-photo') ||
         $('body').hasClass('page-results-video') ) {
        
        initialDateSlider()
    }

    // Function for initialize slider for date at the resaults
    function initialDateSlider() {
        const MOBILE_VERSION = ($(window).width() < 768) ? true : false,
              NUMBER_VISIBLE_BLOCK = MOBILE_VERSION ? 1 : 3
        
        let itemWith           = $('.result-calendar__slider').width() / NUMBER_VISIBLE_BLOCK,
            sliderBody         = $('.result-calendar__body')
            calenderItems      = $('.result-calendar__date')
            numberBeforeLast   = $('.result-calendar__date').length - 1
            activeItemPosition = calenderItems.index($('.result-calendar__date.active')) - 1

        // Set the width of each element
        calenderItems.each(function () {
            $(this).width(itemWith)
        })

        // Pushing active item to second place
        if( MOBILE_VERSION ) activeItemPosition++
        for (var i = 0; i < activeItemPosition; i++) {
            $('.result-calendar__date:first').appendTo(sliderBody)
        }

        // // Cloning first and last element
        $('.result-calendar__date:eq(0)').clone().appendTo(sliderBody)
        $('.result-calendar__date:eq(' + numberBeforeLast + ')').clone().prependTo(sliderBody)

        // Move the body to the left by one item
        sliderBody.css('left', '-' + itemWith + 'px')
    }

    // User click arrow in result calendar slider
    $('.result-calendar__container .arrow').on('click', function() {
        let goTo = $(this).data('go-to')

        if (eventTimer) {
            eventTimer = false
            setTimeout(function () {
                eventTimer = true
            }, 300)
            calendarSliding(goTo)
        }
    })

    // Function for sliding dates in result calendar
    function calendarSliding(slideTo) {
        const MOBILE_VERSION = ($(window).width() < 768) ? true : false,
              NUMBER_VISIBLE_BLOCK = MOBILE_VERSION ? 1 : 3

        let sliderBody          = $('.result-calendar__body'),
            positionLeft        = sliderBody.position().left,
            firstElement        = $('.result-calendar__date:first'),
            lastElement         = $('.result-calendar__date:last')
            numberBeforeLast    = $('.result-calendar__date').length - 3
            itemWith            = $('.result-calendar__slider').width() / NUMBER_VISIBLE_BLOCK
            leftActivePosition  = MOBILE_VERSION ? 0 : 1
            rightActivePosition = MOBILE_VERSION ? 2 : 3

        switch (slideTo) {
            case 'left':
                $('.result-calendar__date.active').removeClass('active')
                $('.result-calendar__date:eq(' + leftActivePosition + ')').addClass('active')
                positionLeft += itemWith
                sliderBody.animate({ left: positionLeft + 'px' }, 300, function () {
                    lastElement.remove()
                    $('.result-calendar__date:eq(' + numberBeforeLast + ')').clone().prependTo(sliderBody)
                    positionLeft -= itemWith
                    sliderBody.css('left', positionLeft + 'px')
                })
                break
            case 'right':
                $('.result-calendar__date.active').removeClass('active')
                $('.result-calendar__date:eq(' + rightActivePosition + ')').addClass('active')
                positionLeft -= itemWith
                sliderBody.animate({ left: positionLeft + 'px' }, 300, function () {
                    firstElement.remove()
                    $('.result-calendar__date:eq(1)').clone().appendTo(sliderBody)
                    positionLeft += itemWith
                    sliderBody.css('left', positionLeft + 'px')
                })
                break
        }
    }

    
    // Show video on the page
    $('.video-list__pic-wrap').on('click', 'img', function() {
        showVideo($(this))
    })
    $('.video-list__desc').on('click', function() {
        showVideo($(this))
    })

    // varibles for Resault video page
    if( $('body').hasClass('page-results-video') ) {
        var videoContainer   = $('.modal-vedeo')
            videoSrc         = videoContainer.find('#framebox')
            videoCaption     = videoContainer.find('.modal-vedeo__caption')
            videoDescription = videoContainer.find('.modal-vedeo__description')
    }
    
    function showVideo(element) {
        let dataContains = element.parents('.vdata-contains')
        
        videoSrc.attr('src', dataContains.data('video-src'))                // add moove source
        videoCaption.html( dataContains.data('video-caption') )             // add moove captio
        videoDescription.html( dataContains.data('video-description') )     // add moove description
        videoContainer.addClass('visible shown')                            // show video container with added content
    }
    
    // Hide video on the page
    $('.modal-vedeo__btn-close').on('click', function() {
        setTimeout(function () { videoContainer.removeClass('shown') }, 300);  // hide video container with added content
        videoContainer.removeClass('visible')   // hide video content block with added content
        videoSrc.attr('src', '')                // delete moove source
        videoCaption.html('')                   // delete moove captio
        videoDescription.html('')               // delete moove description
    })


    // Show pictures on the page at the image slider
    $('.photo-list__item').on('click', function () {
        showImageSlider($(this))
    })

    // varibles for Resault pictures page
    if ($('body').hasClass('page-results-photo')) {
        var imageContainer    = $('.modal-image')
            imageDescription  = imageContainer.find('.modal-image__description')
            sliderImages      = $('.modal-image__screen img')
            amountImages      = sliderImages.length
            numActiveImage    = $('.modal-image__number-pic')
            amountSliderImage = $('.modal-image__amount-pic')
    }

    function showImageSlider(element) {
        let numImage = element.index()
        
        sliderImages.removeClass('active')
        $('.modal-image__screen img:eq(' + numImage + ')').addClass('active')
        numActiveImage.html(++numImage)
        amountSliderImage.html(amountImages)
        imageDescription.html(element.find('.idata-contains').data('image-description'))     // add image description
        imageContainer.addClass('visible shown')                                             // show image slider
    }

    // Hide image slider
    $('.modal-image__btn-close').on('click', function () {
        setTimeout(function () { imageContainer.removeClass('shown') }, 300);  // hide image slider
        imageContainer.removeClass('visible')   // hide image content block with added content
    })

    // User clicked arrow in image slider
    $('.modal-image__btn-wrap [data-go-to]').on('click', function () {
        let goTo = $(this).data('go-to')

        if (eventTimer) {
            eventTimer = false
            setTimeout(function () {
                eventTimer = true
            }, 300)
            imageSliding(goTo)
        }
    })

    // Function for sliding pictures in image slider
    function imageSliding(slideTo) {
        let sliderImages = $('.modal-image__screen img')
            numActiveImg = $('.modal-image__screen .active').index()

        sliderImages.removeClass('active')
        switch (slideTo) {
            case 'left':
                activeImg = (numActiveImg == 0) ? amountImages - 1 : --numActiveImg
                $('.modal-image__screen img:eq(' + activeImg + ')').addClass('active')
                numActiveImage.html(++activeImg)
                break
            case 'right':
                activeImg = (numActiveImg == amountImages - 1) ? 0 : ++numActiveImg
                $('.modal-image__screen img:eq(' + activeImg + ')').addClass('active')
                numActiveImage.html(++activeImg)
                break
        }
    }



    
    


})
