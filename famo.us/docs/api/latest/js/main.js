/*global document*/
(function(){
  'use strict';
  var input = document.getElementById('input-private');
  
  function setElementsVisible () {
    var elements = Array.prototype.slice.call(document.getElementsByClassName('private-method'));
    for (var i = 0; i < elements.length; i++) {
      var elem = elements[i];
      elem.classList.toggle('hidden');
    }
  }
  if (input) {
    input.onclick = function() {
      setElementsVisible();
    };
  }
})();
