// ADLC admin: quick confirmation before destructive actions. Kept out of the HTML so the admin CSP can forbid
// inline script. If JavaScript is off, the server shows its own confirmation page instead.
document.addEventListener('click', function (ev) {
  var b = ev.target.closest('[data-confirm]');
  if (!b) return;
  if (!window.confirm(b.getAttribute('data-confirm'))) { ev.preventDefault(); return; }
  var c = b.form && b.form.querySelector('input[name="confirmed"]');
  if (c) c.value = '1';
});
