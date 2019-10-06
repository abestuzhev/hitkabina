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
});