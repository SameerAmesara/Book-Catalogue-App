export const validateName = (value) => {
  if (!value.trim()) return 'Name is required.';
  return '';
};

export const validatePassword = (value) => {
  if (!value.trim()) return 'Please enter a Password.';
  return '';
};

export const validateEmail = (value) => {
  if (!value.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Email address is invalid.';
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your Password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};

export const validatePhoneNumber = (value) => {
  if (!value.trim()) return 'Phone number is required.';
  const phoneRegex = /^\d{10}$/;
  if (!value.match(phoneRegex)) return 'Phone number is invalid.';
  return '';
};
