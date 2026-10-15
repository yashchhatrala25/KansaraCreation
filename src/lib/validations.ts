export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  const cleaned = phone.replace(/[\s\-\+]/g, "");
  // Allow +91 or standard 10 digits
  const standard = cleaned.startsWith("91") && cleaned.length === 12 ? cleaned.slice(2) : cleaned;
  if (!/^\d{10}$/.test(standard)) {
    return {
      isValid: false,
      error: "Phone number must be exactly 10 digits",
    };
  }
  return { isValid: true };
}

export function validatePincode(pincode: string): { isValid: boolean; error?: string } {
  const cleaned = pincode.trim();
  if (!/^\d{6}$/.test(cleaned)) {
    return {
      isValid: false,
      error: "Pincode must be exactly 6 digits",
    };
  }
  return { isValid: true };
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }
  return { isValid: true };
}

export function validateRequired(value: string, fieldName: string): { isValid: boolean; error?: string } {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true };
}
