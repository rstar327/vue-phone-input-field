import {
  parsePhoneNumber,
  AsYouType,
  isValidPhoneNumber as libIsValid,
  isPossiblePhoneNumber as libIsPossible,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import type { Country } from "../data/countries";

export interface PhoneValidationResult {
  valid: boolean;
  possible: boolean;
  formatted: string;
  e164: string;
  nationalNumber: string;
  country: Country | null;
}

export function formatAsYouType(value: string, countryCode?: string): string {
  if (!value) return "";
  const formatter = new AsYouType(countryCode as CountryCode | undefined);
  return formatter.input(value);
}

export function formatNational(value: string, countryCode?: string): string {
  if (!value || !countryCode) return value;
  try {
    const phone = parsePhoneNumber(value, countryCode as CountryCode);
    return phone?.formatNational() ?? value;
  } catch {
    return value;
  }
}

export function formatInternational(value: string, countryCode?: string): string {
  if (!value) return value;
  try {
    const phone = parsePhoneNumber(value, countryCode as CountryCode);
    return phone?.formatInternational() ?? value;
  } catch {
    return value;
  }
}

export function isValidPhoneNumber(value: string, countryCode?: string): boolean {
  if (!value) return false;
  try {
    return libIsValid(value, countryCode as CountryCode | undefined);
  } catch {
    return false;
  }
}

export function isPossiblePhoneNumber(value: string, countryCode?: string): boolean {
  if (!value) return false;
  try {
    return libIsPossible(value, countryCode as CountryCode | undefined);
  } catch {
    return false;
  }
}

export function getCallingCode(countryCode: string): string {
  try {
    return getCountryCallingCode(countryCode as CountryCode);
  } catch {
    return "";
  }
}

export function parseE164(value: string): { countryCode?: string; nationalNumber: string; e164: string } {
  if (!value) return { nationalNumber: "", e164: "" };
  try {
    const phone = parsePhoneNumber(value);
    return {
      countryCode: phone?.country,
      nationalNumber: phone?.nationalNumber ?? "",
      e164: phone?.format("E.164") ?? value,
    };
  } catch {
    return { nationalNumber: value.replace(/\D/g, ""), e164: value };
  }
}

export function stripNonDigits(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export function parsePhoneCharacter(char: string): string | undefined {
  if (char === "+") return "+";
  if (/\d/.test(char)) return char;
  return undefined;
}
