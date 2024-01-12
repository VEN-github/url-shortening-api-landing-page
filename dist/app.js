"use strict";
const form = document.getElementById('link-form');
const linkInput = document.getElementById('link-input');
const invalidMsg = document.getElementById('invalid-msg');
let timeout;
form.addEventListener('submit', submitForm);
linkInput.addEventListener('focus', handleInputFocus);
function submitForm(event) {
    event.preventDefault();
    clearTimeout(timeout);
    const isInvalid = validateForm(linkInput.value);
    if (isInvalid) {
        showInvalidMessage();
        clearInvalidMessage();
        return;
    }
}
function validateForm(value) {
    return value.trim() === '';
}
function showInvalidMessage() {
    linkInput.classList.add('form-invalid');
    invalidMsg.classList.remove('hidden');
}
function clearInvalidMessage() {
    timeout = setTimeout(() => {
        linkInput.classList.remove('form-invalid');
        invalidMsg.classList.add('hidden');
    }, 3000);
}
function handleInputFocus() {
    clearTimeout(timeout);
    linkInput.classList.remove('form-invalid');
    invalidMsg.classList.add('hidden');
}
