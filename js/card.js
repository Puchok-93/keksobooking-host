'use strict';

(function () {
  var addCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  window.card = {
    renderPopupCard: function (mark) {
      var popupCard = addCardTemplate.cloneNode(true);
      var popupAvatar = popupCard.querySelector('.popup__avatar');
      var popupTitle = popupCard.querySelector('.popup__title');
      var popupAddress = popupCard.querySelector('.popup__text--address');
      var popupPrice = popupCard.querySelector('.popup__text--price');
      var popupType = popupCard.querySelector('.popup__type');
      var popupCapacity = popupCard.querySelector('.popup__text--capacity');
      var popupTime = popupCard.querySelector('.popup__text--time');
      var popupFeatureList = popupCard.querySelector('.popup__features');
      var popupFeatureItem = popupCard.querySelectorAll('.popup__feature');
      var popupDescription = popupCard.querySelector('.popup__description');
      var popupPhotosBlock = popupCard.querySelector('.popup__photos');
      var popupPhoto = popupPhotosBlock.querySelector('.popup__photo');
      var houseType = '';

      popupAvatar.src = mark.author.avatar;
      popupTitle.textContent = mark.offer.title;
      popupAddress.textContent = mark.offer.address;
      popupType.textContent = mark.offer.type;
      popupPrice.textContent = mark.offer.price + '₽/ночь';
      popupTime.textContent = 'Заезд после ' + mark.offer.checkin + ', выезд до ' + mark.offer.checkout;
      popupDescription.textContent = mark.offer.description;

      // --------------------------------- Выбираем тип жилья ---------------------------------
      if (mark.offer.type === window.constants.PALACE) {
        houseType = 'Дворец';
      } else if (mark.offer.type === window.constants.FLAT) {
        houseType = 'Квартира';
      } else if (mark.offer.type === window.constants.HOUSE) {
        houseType = 'Дом';
      } else if (mark.offer.type === window.constants.BUNGALO) {
        houseType = 'Бунгало';
      }

      popupType.textContent = houseType;

      // --------------------------------- Добавляем количество комнат и гостей + склоняем ---------------------------------
      var roomText = ' комната';
      if (mark.offer.rooms > 1 && mark.offer.rooms < 5) {
        roomText = ' комнаты';
      } else if (mark.offer.rooms >= 5 || mark.offer.rooms === 0) {
        roomText = ' комнат';
      }

      var guestsText = ' гостей';
      if (mark.offer.guests === 1) {
        guestsText = ' гостя';
      }

      popupCapacity.textContent = mark.offer.rooms + roomText + ' для ' + mark.offer.guests + guestsText;

      // Удаляем лишние особенности

      var popupWifiIcon = popupCard.querySelector('.popup__feature--wifi');
      var popupDishwasherIcon = popupCard.querySelector('.popup__feature--dishwasher');
      var popupParkingIcon = popupCard.querySelector('.popup__feature--parking');
      var popupWasherIcon = popupCard.querySelector('.popup__feature--washer');
      var popupDelevatorIcon = popupCard.querySelector('.popup__feature--elevator');
      var popupConditionerIcon = popupCard.querySelector('.popup__feature--conditioner');

      for (var i = 0; i < popupFeatureItem.length; i++) {
        popupFeatureItem[i].remove();
      }

      for (i = 0; i < mark.offer.features.length; i++) {

        switch (mark.offer.features[i]) {
          case 'wifi':
            popupFeatureList.append(popupWifiIcon);
            break;

          case 'dishwasher':
            popupFeatureList.append(popupDishwasherIcon);
            break;

          case 'parking':
            popupFeatureList.append(popupParkingIcon);
            break;

          case 'washer':
            popupFeatureList.append(popupWasherIcon);
            break;

          case 'elevator':
            popupFeatureList.append(popupDelevatorIcon);
            break;

          case 'conditioner':
            popupFeatureList.append(popupConditionerIcon);
            break;
        }
      }

      popupPhoto.src = mark.offer.photos[0];
      if (mark.offer.photos.length > 1) {
        for (var j = 1; j < mark.offer.photos.length; j++) {
          var newCardPhoto = popupPhoto.cloneNode(false);
          popupPhotosBlock.appendChild(newCardPhoto);
          newCardPhoto.src = mark.offer.photos[j];
        }
      } else if (mark.offer.photos.length < 1) {
        popupPhotosBlock.style.display = 'none';
      }

      return popupCard;
    }
  };
})();
