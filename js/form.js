'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var title = form.querySelector('#title');
  var guestNumber = form.querySelector('#capacity');
  var roomNumber = form.querySelector('#room_number');
  var address = form.querySelector('#address');
  var roomType = form.querySelector('#type');
  var price = form.querySelector('#price');
  var checkInTime = form.querySelector('#timein');
  var checkOutTime = form.querySelector('#timeout');
  var submitButton = form.querySelector('.ad-form__submit');

  // --------------------------------- Валидация формы ---------------------------------

  var onRoomGuestsCapacityChange = function () {
    guestNumber.setCustomValidity('');
    guestNumber.style.borderColor = window.constants.VALID_INPUT_COLOR;

    if (roomNumber.value < guestNumber.value) {
      guestNumber.setCustomValidity('Количество гостей превышает спальных мест. Увеличьте количество комнат.');
      guestNumber.style.borderColor = window.constants.INVALID_INPUT_COLOR;
    }

    if (roomNumber.value === '100' && guestNumber.value !== '0') {
      guestNumber.setCustomValidity('100 комнат? Серьезно?');
      guestNumber.style.borderColor = window.constants.INVALID_INPUT_COLOR;
    }
  };

  var onTypeHouseChange = function () {
    switch (roomType.value) {
      case window.constants.BUNGALO:
        price.setAttribute('min', 0);
        price.placeholder = 0;
        break;

      case window.constants.FLAT:
        price.setAttribute('min', window.constants.MIN_FLAT_PRICE);
        price.placeholder = window.constants.MIN_FLAT_PRICE;
        break;

      case window.constants.HOUSE:
        price.setAttribute('min', window.constants.MIN_HOUSE_PRICE);
        price.placeholder = window.constants.MIN_HOUSE_PRICE;
        break;

      case window.constants.PALACE:
        price.setAttribute('min', window.constants.MIN_PALACE_PRICE);
        price.placeholder = window.constants.MIN_PALACE_PRICE;
        break;
    }
  };

  // Проверка заголовка
  var onTitleInput = function () {
    title.style.borderColor = window.constants.VALID_INPUT_COLOR;

    if (title.validity.valueMissing || title.validity.tooShort) {
      title.style.borderColor = window.constants.INVALID_INPUT_COLOR;
    }
  };

  // Проверка цены
  var onPriceInput = function () {
    price.style.borderColor = window.constants.VALID_INPUT_COLOR;

    if (price.validity.rangeUnderflow || price.validity.rangeOverflow || price.validity.valueMissing) {
      price.style.borderColor = window.constants.INVALID_INPUT_COLOR;
    }
  };

  // Синхронизация по времени
  var onCheckTimeinChange = function () {
    checkOutTime.value = checkInTime.value;
  };

  var onCheckTimeoutChange = function () {
    checkInTime.value = checkOutTime.value;
  };

  // подсветка невалидных полей
  var onFormInvalid = function (evt) {
    evt.target.style.borderColor = window.constants.INVALID_INPUT_COLOR;
  };

  // Выставляем значения формы по умолчанию
  var setDefaultValues = function () {
    price.value = window.constants.MIN_FLAT_PRICE;
    price.placeholder = window.constants.MIN_FLAT_PRICE;
    guestNumber.value = window.constants.GUESTS_DEFAULT;
    title.style.borderColor = window.constants.VALID_INPUT_COLOR;
    price.style.borderColor = window.constants.VALID_INPUT_COLOR;
    guestNumber.style.borderColor = window.constants.VALID_INPUT_COLOR;
  };

  // --------------------------------- Обработчики событий ---------------------------------

  var addFormListeners = function () {
    form.addEventListener('invalid', onFormInvalid, true);
    title.addEventListener('input', onTitleInput);
    guestNumber.addEventListener('change', onRoomGuestsCapacityChange);
    roomNumber.addEventListener('change', onRoomGuestsCapacityChange);
    roomType.addEventListener('change', onTypeHouseChange);
    checkInTime.addEventListener('change', onCheckTimeinChange);
    checkOutTime.addEventListener('change', onCheckTimeoutChange);
    price.addEventListener('input', onPriceInput);
  };

  var removeFormListeners = function () {
    form.removeEventListener('invalid', onFormInvalid, true);
    title.removeEventListener('input', onTitleInput);
    roomNumber.removeEventListener('input', onRoomGuestsCapacityChange);
    guestNumber.removeEventListener('input', onRoomGuestsCapacityChange);
    roomType.removeEventListener('change', onTypeHouseChange);
    price.removeEventListener('input', onPriceInput);
    checkInTime.removeEventListener('change', onCheckTimeinChange);
    checkOutTime.removeEventListener('change', onCheckTimeoutChange);
  };

  // --------------------------------- Отправка формы на сервер ---------------------------------
  var successSend = function () {
    window.messages.showSuccess();
    submitButton.textContent = 'Данные отправлены';
    submitButton.disabled = false;
  };

  var failSend = function (errorMessage) {
    window.messages.showError(errorMessage);
    submitButton.textContent = 'Данные не отправлены';
    submitButton.disabled = false;
  };

  var sendForm = function () {
    window.backend.upload(new FormData(form), successSend, failSend);
    submitButton.textContent = 'Данные отправляются...';
    submitButton.disabled = true;
  };

  window.form = {
    address: address,
    send: sendForm,
    addListeners: addFormListeners,
    removeListeners: removeFormListeners,
    setDefaults: setDefaultValues
  };
})();
