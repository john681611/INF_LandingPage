// Lazy loading for background images
import '../css/index.scss';
var ll = [].slice.call(document.querySelectorAll('.section'));
var lh = [];
var wh = window.innerHeight;

function updateOffsets() {
    ll.forEach(function(elem) {
        lh.push(elem.offsetTop);
    });
}

function lazy() {
    let wscroll = document.documentElement.scrollTop;
    lh.forEach(function(elOffset, i) {
        if(elOffset <= wscroll + (wh + 1000)){
            ll[i].classList.add('loaded');
            lh.splice(i, 1);
            ll.splice(i, 1);
            if (lh.length === 0) {
                window.removeEventListener('scroll');
            }
        }
    });
}

updateOffsets();
lazy();

window.addEventListener('scroll', function() {
    lazy();
});

function UpdateUserImage(value, id){ //eslint-disable-line no-unused-vars
    document.getElementById('img'+id).setAttribute('src', value);
}


function collapseNavbar() {
    const navigation = document.querySelector('.nav');
    var scrollPosition = window.scrollY || window.scrollTop || document.getElementsByTagName('html')[0].scrollTop;

    if (scrollPosition > 50) {
        navigation.classList.add('collapse');
    } else {
        navigation.classList.remove('collapse');
    }
}

window.addEventListener('scroll', collapseNavbar);
window.addEventListener('ready', collapseNavbar);


// Closes the Responsive Menu on Menu Item Click
const els = document.getElementsByClassName('page-scroll');
Array.prototype.slice.call(els).forEach(function(el) {
    el.addEventListener('click', function() {
        document.getElementById('nav-menu').checked = false;
    });
});

//smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    });
});