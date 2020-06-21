'use strict';

(function () {

  var filtersBlock = document.querySelector('.map__filters');
  var featureItems = filtersBlock.querySelectorAll('input[type=checkbox]');

  var priceValues = {
    'low': {
      min: 0,
      max: 10000
    },

    'middle': {
      min: 10000,
      max: 50000
    },

    'high': {
      min: 50000,
      max: Infinity
    }
  };

  var getFilterValues = function () {
    var filterInputs = filtersBlock.querySelectorAll('.map__filter, input[type=checkbox]:checked');
    var filterValues = [];

    filterInputs.forEach(function (filter) {
      filterValues.push({
        name: filter.getAttribute('name'),
        value: filter.value
      });
    });

    return filterValues;
  };

  var checkFeature = function (features, value) {
    return features.some(function (feature) {
      return feature === value;
    });
  };

  var filterRules = {
    'housing-type': function (advert, value) {
      return advert.offer.type === value;
    },

    'housing-price': function (advert, value) {
      return advert.offer.price >= priceValues[value].min && advert.offer.price < priceValues[value].max;
    },

    'housing-rooms': function (advert, value) {
      return advert.offer.rooms === parseInt(value, 10);
    },

    'housing-guests': function (advert, value) {
      return advert.offer.guests === parseInt(value, 10);
    },

    'features': function (advert, value) {
      return checkFeature(advert.offer.features, value);
    },
  };


  var filterAdverts = function (adverts) {
    var filteredAdverts = [];
    for (var i = 0; i < adverts.length; i++) {
      var advert = adverts[i];

      var isOfferMatch = advert.offer && getFilterValues().every(function (element) {
        return (element.value === window.constants.DEFAULT_FILTER_VALUE) || filterRules[element.name](advert, element.value);
      });

      if (isOfferMatch) {
        filteredAdverts.push(advert);

        if (filteredAdverts.length === window.constants.MAX_PIN_ON_MAP) {
          break;
        }
      }
    }

    return filteredAdverts;
  };


  // экспорт значений
  window.filter = {
    form: filtersBlock,
    features: featureItems,
    default: window.constants.DEFAULT_FILTER_VALUE,
    getAdverts: filterAdverts
  };
})();
