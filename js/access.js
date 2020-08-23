(function () {
  var dialpadInit = function () {
    var BACKSPACE_KEYCODE = 8;

    var dialpad = document.querySelector('.dialpad');
    var accessCodeScreen = dialpad.querySelector('.access-code-screen');
    var dots = accessCodeScreen.querySelectorAll('span');
    var accessCodeInput = accessCodeScreen.querySelector('input');
    var backspaceBtn = dialpad.querySelector('#btn_backspace');

    var clearCodeScreen = function () {
      dots.forEach(function (it) {
        it.className = '';
      });
      accessCodeScreen.classList.remove('error');
      dialpad.addEventListener('click', onDialpadClick);
    };

    var onSuccess = function (response) {
      if (response == 'invalid') {
        accessCodeInput.value = '';
        accessCodeScreen.classList.add('error');
        backspaceBtn.classList.add('d-none');
        setTimeout(clearCodeScreen, 600);
      } else {
        location.href = response;
      }
    };
  
    var onError = function (title, text) {
      alert(title + '! ' + text);
    };

    // Набор кода
    var onDialpadClick = function (evt) {
      evt.preventDefault();

      if (accessCodeInput.value.length < 4 && evt.target.classList.contains('btn-outline')) {
        accessCodeInput.value += evt.target.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
        dots[accessCodeInput.value.length - 1].classList.add('active');
      }

      if (accessCodeInput.value) {
        backspaceBtn.classList.remove('d-none');
      }

      if (accessCodeInput.value.length === 4) {
        dialpad.removeEventListener('click', onDialpadClick);
        window.backend.send(onSuccess, onError, accessCodeScreen);
      }
    };

    // Набор кода с клавиатуры
    var onDialpadKeyPress = function (evt) {
      if (evt.keyCode === BACKSPACE_KEYCODE) {
        deleteCodeCharacter();
      } else {
        document.querySelector('#btn-' + evt.keyCode).click();
      }
    };

    // Функция удаления символов набранного кода
    var deleteCodeCharacter = function () {
      var code = accessCodeInput.value;
      code = code.slice(0, -1);
      accessCodeInput.value = code;

      dots[accessCodeInput.value.length].classList.remove('active');

      if (!accessCodeInput.value) {
        backspaceBtn.classList.add('d-none');
      }
    }

    // Удаление набранных символов при клике на кнопку backspace
    var onBackspaceBtnClick = function (evt) {
      evt.preventDefault();
      deleteCodeCharacter();
    };

    dialpad.addEventListener('click', onDialpadClick);
    document.addEventListener('keydown', onDialpadKeyPress);
    backspaceBtn.addEventListener('click', onBackspaceBtnClick);
  };

  dialpadInit();
})();
