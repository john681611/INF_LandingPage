// Lazy loading for background images
var ll = [].slice.call(document.querySelectorAll('.section'));
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
            lh.splice(i, 1);
            ll.splice(i, 1);
            if (lh.length === 0) {
                window.removeEventListener('scroll');
            }
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