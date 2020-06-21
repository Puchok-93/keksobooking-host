'use strict';

(function () {

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin = {
    renderPin: function (advert) {
      var pin = pinTemplate.cloneNode(true);
      var pinImg = pin.querySelector('img');

      pin.dataset.id = advert.id;
      pinImg.src = advert.author.avatar;
      pinImg.alt = advert.offer.title;
      pin.style.left = (advert.location.x - window.constants.WIDTH_PIN / 2) + 'px';
      pin.style.top = (advert.location.y - window.constants.HEIGTH_PIN) + 'px';

      return pin;
    }
  };
})();

