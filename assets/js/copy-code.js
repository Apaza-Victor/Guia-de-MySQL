(function () {
  function initCopyCode() {
    document.querySelectorAll('.code-block pre').forEach(function (pre) {
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerHTML = '<i class="bi bi-clipboard"></i> Copiar';

      btn.addEventListener('click', function () {
        var code = pre.textContent || pre.innerText;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(function () {
            btn.innerHTML = '<i class="bi bi-check-lg"></i> Copiado';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.innerHTML = '<i class="bi bi-clipboard"></i> Copiar';
              btn.classList.remove('copied');
            }, 2000);
          });
        }
      });

      pre.parentNode.appendChild(btn);
    });
  }

  document.addEventListener('DOMContentLoaded', initCopyCode);
  document.addEventListener('partials-loaded', initCopyCode);
})();
