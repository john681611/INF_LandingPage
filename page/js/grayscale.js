// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    let navigation = document.querySelector('.nav');
    var scrollPosition = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;

    if (scrollPosition > 50) {
        navigation.classList.add('collapse');
    } else {
        navigation.classList.remove('collapse');
    }
}

window.addEventListener('scroll', collapseNavbar);
window.addEventListener('ready', collapseNavbar);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $(".navbar-collapse").collapse('hide');
});
