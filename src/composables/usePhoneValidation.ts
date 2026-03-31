import type { Country } from "../data/countries";

export interface PhoneValidationResult {
  valid: boolean;
  formatted: string;
  e164: string;
  nationalNumber: string;
  country: Country | null;
}

const MIN_PHONE_LENGTH = 4;
const MAX_PHONE_LENGTH = 15;

export function formatPhoneNumber(
  digits: string,
  format?: string,
): string {
  if (!format || !digits) return digits;
  let result = "";
  let digitIndex = 0;
  for (const ch of format) {
    if (digitIndex >= digits.length) break;
    if (ch === ".") {
      result += digits[digitIndex++];
    } else {
      result += ch;
    }
  }
  // Append remaining digits
  if (digitIndex < digits.length) {
    result += digits.slice(digitIndex);
  }
  return result;
}

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function validatePhone(
  phoneNumber: string,
  country: Country | null,
): PhoneValidationResult {
  const digits = stripNonDigits(phoneNumber);
  const dialCode = country?.dialCode ?? "";
  const nationalNumber = dialCode && digits.startsWith(dialCode)
    ? digits.slice(dialCode.length)
    : digits;

  const e164 = dialCode ? `+${dialCode}${nationalNumber}` : `+${digits}`;
  const formatted = country?.format
    ? formatPhoneNumber(nationalNumber, country.format)
    : nationalNumber;

  const totalDigits = dialCode.length + nationalNumber.length;
  const valid =
    nationalNumber.length >= MIN_PHONE_LENGTH &&
    totalDigits <= MAX_PHONE_LENGTH &&
    /^\d+$/.test(nationalNumber);

  return {
    valid,
    formatted,
    e164,
    nationalNumber,
    country,
  };
}
