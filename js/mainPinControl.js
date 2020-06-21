'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // Параметры главной метки
      var mainPinParam = {
        width: window.constants.MAIN_PIN_WIDTH,
        height: window.constants.MAIN_PIN_HEIGHT
      };

      // Параметры карты
      var mapParam = {
        x: {
          min: 0,
          max: map.offsetWidth - mainPinParam.width
        },

        y: {
          min: window.constants.LOCATION_Y_MIN,
          max: window.constants.LOCATION_Y_MAX
        }
      };

      // Границы перемещения метки

      var moveMainPin = {
        top: mapParam.y.min - mainPinParam.height,
        right: mapParam.x.max,
        bottom: mapParam.y.max - mainPinParam.height,
        left: mapParam.x.min
      };

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinCoordinates = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      if (mainPinCoordinates.y > moveMainPin.top && mainPinCoordinates.y < moveMainPin.bottom) {
        mainPin.style.top = mainPinCoordinates.y + 'px';
      }

      if (mainPinCoordinates.x > moveMainPin.left && mainPinCoordinates.x < moveMainPin.right) {
        mainPin.style.left = mainPinCoordinates.x + 'px';
      }

      var pinTailCoordinates = {
        x: mainPinCoordinates.x + Math.floor(mainPinParam.width / 2),
        y: mainPinCoordinates.y + mainPinParam.height
      };

      window.form.address.value = (pinTailCoordinates.x + ', ' + pinTailCoordinates.y);

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
