$(function(){
    $('.brands-list').slick({
        infinite: true,
        arrows: true,
        dots: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 980,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 760,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('.popular-block-slider').slick({
        infinite: true,
        arrows: true,
        dots: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    });

    $(document).on('click', '.footer-mobile-menu__title', function(e){
        e.preventDefault();
        var $item = $(this).parents('.footer-mobile-menu__item');
        $item.toggleClass('active');
        $item.find('.footer-mobile-menu__dropdown').slideToggle();
    });

    $(document).on('click', '.c-header-hamburger', function(e){
        e.preventDefault();
        $('.header-mobile-menu-layout').addClass('is-show');
        $('body').addClass('fix-modal');
    });
    $(document).on('click', '.header-mobile-menu__close', function(e){
        e.preventDefault();
        $('.header-mobile-menu-layout').removeClass('is-show');
        $('body').removeClass('fix-modal');
    });
});