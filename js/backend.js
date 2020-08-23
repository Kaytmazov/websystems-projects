'use strict';

(function () {
  var URL = '/access.php';
  var TIMEOUT = 10000;

  var StatusCode = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    ACCESS_DENIED: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    APPLICATION_ERROR: 503,
  };

  var makeXHR = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.SUCCESS:
          onSuccess(xhr.response);
          break;
        case StatusCode.BAD_REQUEST:
          onError('Статус ответа: ' + xhr.status, 'В запросе ошибка.');
          break;
        case StatusCode.ACCESS_DENIED:
          onError('Статус ответа: ' + xhr.status, 'Доступ запрещён. У вас недостаточно прав.');
          break;
        case StatusCode.NOT_FOUND:
          onError('Статус ответа: ' + xhr.status, 'Данные по запросу не найдены.');
          break;
        case StatusCode.SERVER_ERROR:
          onError('Статус ответа: ' + xhr.status, 'Внутренняя ошибка сервера');
          break;
        case StatusCode.APPLICATION_ERROR:
          onError('Статус ответа: ' + xhr.status, 'Сервис временно недоступен');
          break;
        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка', 'Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Ошибка', 'Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  window.backend = {
    send: function (onSuccess, onError, form) {
      var xhr = makeXHR(onSuccess, onError, URL);
      xhr.open('POST', URL);
      xhr.send(new FormData(form));
    }
  };
})();
