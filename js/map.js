'use strict';

(function () {
  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var address = form.querySelector('#address');
  var filtersForm = window.filter.form;
  var filtersContainer = map.querySelector('.map__filters-container');
  var mapFilters = map.querySelectorAll('.map__filter');
  var mapFeatures = window.filter.features;
  var formFieldsets = form.querySelectorAll('fieldset');
  var resetButton = form.querySelector('.ad-form__reset');
  var downloadedAdverts = [];
  var adverts = [];

  // создаем и вставляем фрагмент
  var createPinsBlock = function (array) {
    var fragment = document.createDocumentFragment();

    array.forEach(function (item, index) {
      if (item.offer !== undefined) {
        item.id = index;
        var pin = window.pin.renderPin(item);
        fragment.appendChild(pin);
      }
    });
    adverts = array;
    pinsBlock.appendChild(fragment);
  };

  // --------------------------------- Управление карточками объявлений ---------------------------------
  var showPopupCard = function (advert) {
    var openedCard = document.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }
    map.insertBefore(window.card.renderPopupCard(advert), filtersContainer);
    addPopupCardListeners();
  };

  var onPinClick = function (evt) {
    var activePins = map.querySelectorAll('.map__pin--active');
    var target = evt.target;
    var isClickOnPin = target.classList.contains('map__pin:not(map__pin--main)');
    var isClickInside = target.closest('.map__pin:not(.map__pin--main)');
    var currentPin;
    var isCurrentPinActive = isClickOnPin ? target.classList.contains('map__pin--active') : target.closest('.map__pin--active');

    if (isClickOnPin) {
      currentPin = target;
    } else if (isClickInside) {
      currentPin = isClickInside;
    }

    if (!currentPin || isCurrentPinActive) {
      return;
    }

    var pinId = +currentPin.dataset.id;
    var advert = adverts.find(function (ad) {
      return ad.id === pinId;
    });

    showPopupCard(advert);

    activePins.forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });

    currentPin.classList.add('map__pin--active');
  };

  // закрытие карточки
  var addPopupCardListeners = function () {
    var popup = document.querySelector('.map__card');
    var popupClose = popup.querySelector('.popup__close');

    var onPopupCloseClick = function () {
      var activePins = map.querySelectorAll('.map__pin--active');

      activePins.forEach(function (pin) {
        pin.classList.remove('map__pin--active');
      });

      popup.remove();
      popupClose.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onDocumentEscKeydown);
    };

    popupClose.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onDocumentEscKeydown);
  };

  // --------------------------------- Деактивация страницы ---------------------------------
  var disableInputs = function (arrayInputs) {
    for (var i = 0; i < arrayInputs.length; i++) {
      arrayInputs[i].setAttribute('disabled', true);
    }
  };

  var enableInputs = function (arrayInputs) {
    for (var i = 0; i < arrayInputs.length; i++) {
      arrayInputs[i].removeAttribute('disabled');
    }
  };

  var deactivateAllInputs = function () {
    disableInputs(formFieldsets);
    disableInputs(mapFilters);
    disableInputs(mapFeatures);

    mapFilters.forEach(function (filter) {
      filter.value = window.filter.default;
    });

    mapFeatures.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  };

  var removePins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    var openedCard = document.querySelector('.map__card');

    pins.forEach(function (element) {
      element.remove();
    });

    if (openedCard) {
      openedCard.remove();
    }
  };

  // Выставляем главную метку на позицию по умолчанию
  var setMainPinDefaultPosition = function () {
    mainPin.style.left = window.constants.MAIN_PIN_DEFAULT_CORDS_X + 'px';
    mainPin.style.top = window.constants.MAIN_PIN_DEFAULT_CORDS_Y + 'px';
  };

  var deactivatePage = function () {
    form.reset();
    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');

    map.removeEventListener('click', onPinClick);
    filtersForm.removeEventListener('change', onFiltersChange);
    form.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetClick);
    document.removeEventListener('keydown', onDocumentEscKeydown);
    removePins();
    setMainPinDefaultPosition();
    window.form.setDefaults();
    window.form.removeListeners();
    deactivateAllInputs();
  };

  // --------------------------------- Активация страницы ---------------------------------
  var getAddress = function () {
    address.value = (window.constants.MAIN_PIN_DEFAULT_CORDS_X + Math.floor(window.constants.WIDTH_PIN / 2)) + ', ' + (window.constants.MAIN_PIN_DEFAULT_CORDS_Y + window.constants.HEIGTH_PIN);
  };

  var activateAllInputs = function () {
    enableInputs(formFieldsets);
    enableInputs(mapFilters);
    enableInputs(mapFeatures);
  };

  var onLoadSuccess = function (data) {
    downloadedAdverts = data;
    var filteredAdverts = window.filter.getAdverts(downloadedAdverts);
    createPinsBlock(filteredAdverts);
    return downloadedAdverts;
  };

  var activatePage = function () {
    window.backend.load(onLoadSuccess);

    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    map.addEventListener('click', onPinClick);
    filtersForm.addEventListener('change', onFiltersChange);
    form.addEventListener('submit', onFormSubmit);
    resetButton.addEventListener('click', onResetClick);
    activateAllInputs();
    window.form.setDefaults();
    window.form.addListeners();
    getAddress();
  };

  // --------------------------------- Обработчики событий ---------------------------------
  var onMainPinMousedown = function (evt) {
    if (evt.button === window.constants.MOUSE_LB) {
      if (map.classList.contains('map--faded')) {
        activatePage();
      }

      evt.preventDefault();

      mainPin.removeEventListener('keydown', onMainPinKeydown);
    }
  };

  var onMainPinKeydown = function (evt) {
    if (evt.key === window.constants.ENTER_KEY) {
      activatePage();
      mainPin.removeEventListener('keydown', onMainPinKeydown);
    }
  };

  var onDocumentEscKeydown = function (evt) {
    var popup = document.querySelector('.map__card');

    if (evt.key === window.constants.ESC_KEY) {
      var activePins = map.querySelectorAll('.map__pin--active');

      activePins.forEach(function (pin) {
        pin.classList.remove('map__pin--active');
      });

      popup.remove();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    }
  };

  var onFiltersChange = window.debounce(function () {
    removePins();
    document.removeEventListener('keydown', onDocumentEscKeydown);
    createPinsBlock(window.filter.getAdverts(downloadedAdverts));
  });

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.form.send();
    deactivatePage();
    form.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetClick);
  };

  var onResetClick = function (evt) {
    evt.preventDefault();
    deactivatePage();
    form.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetClick);
  };

  // добавляем обработчики
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('keydown', onMainPinKeydown);
})();
