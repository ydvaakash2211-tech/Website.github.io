/* Malta International Medical Centre - behaviour script.
   Every block checks that its elements exist, so this file also works on LoginForm.html. */

function byId(id) { return document.getElementById(id); }

/* ---------- Mobile menu ---------- */
var mobileDrawer = byId('mobileDrawer');
var drawerBackdrop = byId('drawerBackdrop');
var menuToggle = byId('menuToggle');

function openMobileDrawer() {
  mobileDrawer.classList.add('is-open');
  drawerBackdrop.classList.add('is-visible');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileDrawer() {
  mobileDrawer.classList.remove('is-open');
  drawerBackdrop.classList.remove('is-visible');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
if (mobileDrawer) {
  menuToggle.addEventListener('click', openMobileDrawer);
  byId('drawerClose').addEventListener('click', closeMobileDrawer);
  drawerBackdrop.addEventListener('click', closeMobileDrawer);
  mobileDrawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileDrawer);
  });
}

/* ---------- Visitor information popup ---------- */
var infoModal = byId('infoModal');
function openInfoModal() { infoModal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
function closeInfoModal() { infoModal.classList.remove('is-open'); document.body.style.overflow = ''; }
if (infoModal) {
  byId('openInfoModal').addEventListener('click', openInfoModal);
  byId('closeInfoModal').addEventListener('click', closeInfoModal);
  infoModal.addEventListener('click', function (event) {
    if (event.target === infoModal) closeInfoModal();
  });
}
document.addEventListener('keydown', function (event) {
  if (event.key !== 'Escape') return;
  if (mobileDrawer) closeMobileDrawer();
  if (infoModal) closeInfoModal();
});

/* ---------- Scroll-to-top button and reveal-on-scroll ---------- */
var toTopButton = byId('toTopButton');
function updateOnScroll() {
  if (toTopButton) toTopButton.classList.toggle('is-visible', window.scrollY > 400);
  document.querySelectorAll('.reveal').forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('is-shown');
  });
}
if (toTopButton) {
  toTopButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}
document.querySelectorAll('.panel, .doctor, .service-card, .gallery-item').forEach(function (el) { el.classList.add('reveal'); });
window.addEventListener('scroll', updateOnScroll, { passive: true });
window.addEventListener('load', updateOnScroll);

/* ---------- Shared form helpers ---------- */
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var MALTA_PHONE_PATTERN = /^(\+356)?\s?[279]\d{3}\s?\d{4}$/;

function showFieldError(inputId, message) {
  byId(inputId).classList.add('input-invalid');
  var errorBox = byId(inputId + 'Error');
  errorBox.textContent = message;
  errorBox.classList.add('is-visible');
}
function clearFieldErrors(form) {
  form.querySelectorAll('.field-error').forEach(function (box) { box.classList.remove('is-visible'); });
  form.querySelectorAll('.input-invalid').forEach(function (input) { input.classList.remove('input-invalid'); });
}
function showStatus(boxId, text, type) {
  var box = byId(boxId);
  box.textContent = text;
  box.className = 'form-note ' + (type === 'success' ? 'is-success' : 'is-error');
}

/* ---------- Newsletter ---------- */
function handleNewsletterSubmit() {
  var emailInput = byId('newsletterEmail');
  if (EMAIL_PATTERN.test(emailInput.value.trim())) {
    showStatus('newsletterMessage', 'Thank you for subscribing.', 'success');
    emailInput.value = '';
  } else {
    showStatus('newsletterMessage', 'Please enter a valid email address.', 'error');
  }
}
if (byId('newsletterButton')) byId('newsletterButton').addEventListener('click', handleNewsletterSubmit);

/* ---------- Contact form ---------- */
var contactForm = byId('contactForm');
function validateContactForm(event) {
  event.preventDefault();
  clearFieldErrors(contactForm);
  var isValid = true;
  if (byId('contactName').value.trim().length < 2) { showFieldError('contactName', 'Enter your name.'); isValid = false; }
  if (!EMAIL_PATTERN.test(byId('contactEmail').value.trim())) { showFieldError('contactEmail', 'Enter a valid email address.'); isValid = false; }
  if (byId('contactSubject').value.trim() === '') { showFieldError('contactSubject', 'Enter a subject.'); isValid = false; }
  if (byId('contactMessage').value.trim().length < 10) { showFieldError('contactMessage', 'Write at least 10 characters.'); isValid = false; }
  if (!isValid) { showStatus('contactStatus', 'Please fix the highlighted fields.', 'error'); return; }
  showStatus('contactStatus', 'Message sent. We will reply within one working day.', 'success');
  contactForm.reset();
  setTimeout(function () { byId('contactStatus').textContent = ''; }, 4000);
}
if (contactForm) contactForm.addEventListener('submit', validateContactForm);

/* ---------- Appointment form ---------- */
var appointmentForm = byId('appointmentForm');
function validateAppointmentForm(event) {
  event.preventDefault();
  clearFieldErrors(appointmentForm);
  var isValid = true;
  var today = new Date().toISOString().split('T')[0];
  if (byId('patientName').value.trim().length < 3) { showFieldError('patientName', 'Enter your full name.'); isValid = false; }
  if (!EMAIL_PATTERN.test(byId('patientEmail').value.trim())) { showFieldError('patientEmail', 'Enter a valid email address.'); isValid = false; }
  if (!MALTA_PHONE_PATTERN.test(byId('patientPhone').value.trim())) { showFieldError('patientPhone', 'Enter an 8-digit Maltese number, e.g. 9912 3456.'); isValid = false; }
  if (byId('patientDoctor').value === '') { showFieldError('patientDoctor', 'Choose a specialist.'); isValid = false; }
  var chosenDate = byId('patientDate').value;
  if (chosenDate === '' || chosenDate < today) { showFieldError('patientDate', 'Choose today or a future date.'); isValid = false; }
  if (!isValid) { showStatus('appointmentStatus', 'Please fix the highlighted fields.', 'error'); return; }
  showStatus('appointmentStatus', 'Thank you. Your appointment request has been received (demo).', 'success');
  appointmentForm.reset();
}
if (appointmentForm) {
  byId('patientDate').min = new Date().toISOString().split('T')[0];
  appointmentForm.addEventListener('submit', validateAppointmentForm);
}

/* ---------- Login page ---------- */
var loginForm = byId('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearFieldErrors(loginForm);
    var isValid = true;
    if (!EMAIL_PATTERN.test(byId('loginEmail').value.trim())) { showFieldError('loginEmail', 'Enter a valid email address.'); isValid = false; }
    if (byId('loginPassword').value.length < 6) { showFieldError('loginPassword', 'Password must be at least 6 characters.'); isValid = false; }
    if (isValid) showStatus('loginStatus', 'Demo only: no real login is performed.', 'success');
  });
}

/* ---------- Image fallback: if a photo fails to load, show a neutral placeholder ---------- */
var IMAGE_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="#eaf3f4"/>' +
  '<text x="50%" y="50%" fill="#53626f" font-family="sans-serif" font-size="22" text-anchor="middle">Photo unavailable</text></svg>');
document.addEventListener('error', function (event) {
  var image = event.target;
  if (image.tagName === 'IMG' && !image.dataset.failed) {
    image.dataset.failed = 'true';
    image.classList.add('image-missing');
    image.src = IMAGE_PLACEHOLDER;
  }
}, true);
