//Get the button
var mybutton = document.getElementById("backTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
mybutton.style.display = "none";
function scrollFunction() {
    mybutton.style.display = "none";
    // if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    if (document.documentElement.scrollTop >50) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}