export const isEmailValid = (email) => {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email.trim());
};

export const isPhoneValid = (phone) => {
  const regex = /^[0-9]{10,15}$/;

  return regex.test(phone.trim());
};

export const isPasswordValid = (password) => {
  return password.length >= 8;
};

export const isOTPValid = (otp) => {
  return otp.length === 6;
};

export const validateSignup = ({
  fullName,
  email,
  phone,
  password,
  confirmPassword,
}) => {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!isEmailValid(email)) {
    errors.email = "Please enter a valid email.";
  }

  if (!phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!isPhoneValid(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isPasswordValid(password)) {
    errors.password =
      "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword =
      "Confirm password is required.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  return errors;
};

export const validateLogin = ({
  email,
  password,
}) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!isEmailValid(email)) {
    errors.email = "Please enter a valid email.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
};

export const validateForgotPassword = (
  email
) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!isEmailValid(email)) {
    errors.email = "Please enter a valid email.";
  }

  return errors;
};