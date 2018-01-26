// Lazy loading for background images
var ll = document.querySelectorAll('div[class*=section]');
var lh = [];
var wh = window.innerHeight;

function updateOffsets() {
    ll.forEach(function(elem) {
        lh.push(elem.offsetTop);
    });
};

function lazy() {
    wscroll = document.documentElement.scrollTop;
    lh.forEach(function(elOffset, i) {
        if(elOffset <= wscroll + (wh + 1000)){
            ll[i].classList.add('loaded');
        };
    });
};

updateOffsets();
lazy();

window.addEventListener('scroll',function() {
    lazy();
});

function UpdateUserImage(value,id){
    document.getElementById('img'+id).setAttribute("src",value);
}