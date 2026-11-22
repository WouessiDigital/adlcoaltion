// ADLC admin: confirmation before destructive actions (kept out of the HTML so the admin CSP can forbid inline script).
document.addEventListener('click', function (ev) {
  var b = ev.target.closest('[data-confirm]');
  if (b && !window.confirm(b.getAttribute('data-confirm'))) ev.preventDefault();
});
