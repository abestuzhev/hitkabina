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


    $('#searchPage').on('input', function(){
        $('.c-search-del').addClass('active');
        $('.c-search-result').addClass('is-show');

        if($('#searchPage').val == '') {
            $('.c-search-del').removeClass('active');
            $('.c-search-result').removeClass('is-show');
        }
    });

    $(document).on('click', '.c-search-del', function(e){
        e.preventDefault();
        $('#searchPage').val('');
        $(this).removeClass('active');
        $('.c-search-result').removeClass('is-show');
    });

    // $(".contact-shop-body").mCustomScrollbar();


    if($('div').hasClass('contact-shop-body')){
        $(".contact-shop-body").mCustomScrollbar({
            // theme:"rounded-dots",
            scrollInertia:300
        });
    }


    // $('.contact-shop-body').mCustomScrollbar("scrollTo","bottom",{
    //     scrollInertia:3000
    // });

    $('.btn-catalog').on('click', function(){
        $('.catalog-menu').toggleClass('open');
    })

});