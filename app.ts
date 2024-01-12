const form = document.getElementById('link-form')! as HTMLFormElement;
const linkInput = document.getElementById('link-input')! as HTMLInputElement;
const invalidMsg = document.getElementById('invalid-msg')! as HTMLParagraphElement;
let timeout: undefined | number;

form.addEventListener('submit', submitForm);
linkInput.addEventListener('focus', handleInputFocus);

function submitForm(event: SubmitEvent) {
  event.preventDefault();
  clearTimeout(timeout);

  const isInvalid = validateForm(linkInput.value);

  if (isInvalid) {
    showInvalidMessage();
    clearInvalidMessage();
    return;
  }
}

function validateForm(value: string): Boolean {
  return value.trim() === '';
}

function showInvalidMessage(): void {
  linkInput.classList.add('form-invalid');
  invalidMsg.classList.remove('hidden');
}

function clearInvalidMessage(): void {
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
