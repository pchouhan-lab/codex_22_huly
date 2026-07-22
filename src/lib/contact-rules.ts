export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  company?: string;
};

export type ContactField = keyof ContactFormValues;
export type ContactFormErrors = Partial<Record<ContactField, string>>;
export type NormalizedContactFormValues = Omit<ContactFormValues, "company"> & {
  company: string;
};

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 120,
  emailMax: 180,
  phoneMax: 40,
  phoneDigitsMin: 7,
  phoneDigitsMax: 15,
  messageMin: 1,
  messageMax: 3000
} as const;

const namePattern = /^[\p{L}][\p{L} .'-]*$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s().-]+$/;

export const contactFieldOrder = ["name", "email", "phone", "message"] as const;

export function normalizeContactForm(values: ContactFormValues): NormalizedContactFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    message: values.message.trim(),
    company: values.company?.trim() ?? ""
  };
}

export function countPhoneDigits(value: string) {
  return value.replace(/\D/g, "").length;
}

export function formatPhoneNumberInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const hasCountryCode = digits.length > 10 && digits.startsWith("1");
  const phoneDigits = hasCountryCode ? digits.slice(1) : digits.slice(0, 10);

  if (!phoneDigits) {
    return "";
  }

  const areaCode = phoneDigits.slice(0, 3);
  const prefix = phoneDigits.slice(3, 6);
  const lineNumber = phoneDigits.slice(6, 10);
  const formatted =
    phoneDigits.length <= 3
      ? areaCode
      : phoneDigits.length <= 6
        ? `(${areaCode}) ${prefix}`
        : `(${areaCode}) ${prefix}-${lineNumber}`;

  return hasCountryCode ? `+1 ${formatted}` : formatted;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const data = normalizeContactForm(values);
  const errors: ContactFormErrors = {};

  if (!data.name) {
    errors.name = "Name is required.";
  } else if (data.name.length < CONTACT_LIMITS.nameMin) {
    errors.name = `Name must be at least ${CONTACT_LIMITS.nameMin} characters.`;
  } else if (data.name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `Name must be ${CONTACT_LIMITS.nameMax} characters or less.`;
  } else if (!namePattern.test(data.name)) {
    errors.name = "Name can only include letters, spaces, apostrophes, periods, and hyphens.";
  }

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (data.email.length > CONTACT_LIMITS.emailMax) {
    errors.email = `Email must be ${CONTACT_LIMITS.emailMax} characters or less.`;
  } else if (!emailPattern.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  const phoneDigitCount = countPhoneDigits(data.phone);
  if (!data.phone) {
    errors.phone = "Phone is required.";
  } else if (data.phone.length > CONTACT_LIMITS.phoneMax) {
    errors.phone = `Phone must be ${CONTACT_LIMITS.phoneMax} characters or less.`;
  } else if (!phonePattern.test(data.phone)) {
    errors.phone = "Phone can only include numbers, spaces, +, -, parentheses, and periods.";
  } else if (phoneDigitCount < CONTACT_LIMITS.phoneDigitsMin || phoneDigitCount > CONTACT_LIMITS.phoneDigitsMax) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!data.message) {
    errors.message = "Message is required.";
  } else if (data.message.length < CONTACT_LIMITS.messageMin) {
    errors.message = `Message must be at least ${CONTACT_LIMITS.messageMin} characters.`;
  } else if (data.message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Message must be ${CONTACT_LIMITS.messageMax} characters or less.`;
  }

  if (data.company) {
    errors.company = "Submission rejected.";
  }

  return errors;
}

export function hasContactErrors(errors: ContactFormErrors) {
  return Object.values(errors).some(Boolean);
}
