export function validateEmail(email) {
  const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
  return regex.test(email);
}
