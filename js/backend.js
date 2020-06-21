'use strict';

(function () {
  var URL_SERVER = 'https://javascript.pages.academy/keksobooking/data';
  var UPLOAD = 'https://js.dump.academy/keksobooking';

  var ErrorCodes = {
    400: 'Неверный запрос',
    403: 'Доступ запрещен',
    404: 'Ничего не найдено',
    500: 'Ошибка сервера',
    502: 'Неверный ответ сервера',
    503: 'Сервер временно недоступен'
  };

  var createRequest = function (method, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.constants.STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        var error = ErrorCodes[xhr.status] || 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
        onError(error);
      }
    });

    // Ошибка соединения
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка подклчения. Проверьте интернет соединение.');
    });

    // Превышен лимит ожидания
    xhr.addEventListener('timeout', function () {
      onError('Время ожидания истекло. Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = window.constants.TIMEOUT_IN_MS;
    xhr.open(method, url);

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var request = createRequest(window.constants.GET, URL_SERVER, onLoad, onError);
      request.send();
    },

    upload: function (data, onLoad, onError) {
      var request = createRequest(window.constants.POST, UPLOAD, onLoad, onError);
      request.send(data);
    }
  };
})();
