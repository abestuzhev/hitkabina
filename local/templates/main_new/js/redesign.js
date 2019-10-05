$(function(){
    $('.brands-list').slick({
        infinite: true,
        arrows: true,
        dots: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1
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