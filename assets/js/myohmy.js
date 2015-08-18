var Ease = require('eases/sine-out');

function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

function elmYPosition(node) {
  var y = node.offsetTop;
  while (node.offsetParent && node.offsetParent != document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  } return y;
}

function getNavbarOffset(){
  return parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-top'));
}

window.elmYPosition = elmYPosition;

function elmYPosOrDoc(node){
  var YPos = elmYPosition(node);
  var docLength = document.body.scrollHeight;
  var nodeLength = node.offsetHeight;
  var windowHeight = document.body.offsetHeight;

  return docLength - YPos + getNavbarOffset() > windowHeight ? YPos : docLength - windowHeight + getNavbarOffset();
}

var scrollTimeouts = [];

function smoothScroll(node) {
  // Cancel existing evented scrolls
    for(var i=0; i < scrollTimeouts.length; i++){
      clearTimeout(scrollTimeouts[i])
    }
    scrollTimeouts = [];

  // Find points
    var startY = currentYPosition();
    var stopY = elmYPosOrDoc(node) - getNavbarOffset();

    var distance = stopY - startY;

    if (Math.abs(distance) < 100) {
        scrollTo(0, stopY); return;
    }

  // How many steps to take, and how long to spend on each step
    var step = 5;
    var itersRequired = Math.abs(distance/step);
    var iterTime = 8;
    var floatingIter = 1/itersRequired;

  // Create a bunch of future timeouts
    for(iters=0; iters < itersRequired; iters++){
      scrollTimeouts.push(setTimeout(function(){
        // Fancy easing math
        var percent = Ease(this*floatingIter)
        scrollTo(0, startY + percent*distance);
      }.bind(iters), iterTime*iters));
    }
}

Array.prototype.forEach.call(document.querySelectorAll('.siteNav .links a'), function(link){
  var dest = document.getElementById(link.hash.substr(1))
  link.addEventListener('click', (function(dest){return function(e){
    if(dest){
      e.preventDefault();
      smoothScroll(dest);
    }
  }})(dest))
})

window.addEventListener('load', function(e){
  var dest = document.getElementById(window.location.hash.substr(1));
  var destPos = elmYPosition(dest);
  var tolerance = 1; // offset tolerance
  var isUnoffsetLocation = (destPos+tolerance) >= currentYPosition() && currentYPosition() >= (destPos-tolerance)

  if(dest && isUnoffsetLocation){
    smoothScroll(dest); // not really smooth, but gets the correct location.
  }
})
