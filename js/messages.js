'use strict';

(function () {
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  var renderMessage = function (template) {
    var node = template.cloneNode(true);
    var main = document.querySelector('main');
    var button = node.querySelector('button');

    node.classList.add('message');

    var onDocumentClick = function (evt) {
      var target = evt.target;
      var isClickOnMessage = target.classList.contains('message');
      var isClickInside = target.closest('.message');
      if (isClickOnMessage || isClickInside) {
        node.remove();
        document.removeEventListener('click', onDocumentClick);
        document.removeEventListener('keydown', onDocumentEscKeydown);
      }
    };

    var onDocumentEscKeydown = function (evt) {
      if (evt.key === window.constants.ESC_KEY) {
        node.remove();
        document.removeEventListener('click', onDocumentClick);
        document.removeEventListener('keydown', onDocumentEscKeydown);
      }
    };

    var onButtonClick = function () {
      node.remove();
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onDocumentEscKeydown);
      button.removeEventListener('click', onButtonClick);
    };

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentEscKeydown);

    if (button) {
      button.addEventListener('click', onButtonClick);
    }

    main.appendChild(node);
  };

  window.messages = {

    showSuccess: function () {
      renderMessage(successTemplate);
    },

    showError: function (errorMessage) {
      renderMessage(errorTemplate);
      var messageText = document.querySelector('.error__message');
      messageText.textContent = errorMessage;
    }
  };
})();
