import PhoneInput from "./PhoneInput.vue";
import type { Country } from "./data/countries";
import { countries, findCountryByIso2, findCountryByDialCode } from "./data/countries";
import {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
  formatAsYouType,
  formatNational,
  formatInternational,
  parseE164,
  getCallingCode,
  stripNonDigits,
} from "./composables/usePhoneValidation";
import { detectCountryFromIP, searchCountries, getCountryOptions } from "./composables/useCountryDetection";

// Re-export key libphonenumber-js types for convenience
export type {
  CountryCode,
} from "libphonenumber-js";

export {
  PhoneInput,

  // Country data
  countries,
  findCountryByIso2,
  findCountryByDialCode,

  // Validation (same API as react-phone-number-input)
  isValidPhoneNumber,
  isPossiblePhoneNumber,

  // Formatting (same API as react-phone-number-input)
  formatNational as formatPhoneNumber,
  formatInternational as formatPhoneNumberIntl,
  formatAsYouType,
  formatNational,
  formatInternational,

  // Parsing
  parseE164,
  getCallingCode,
  stripNonDigits,

  // Country utilities
  detectCountryFromIP,
  searchCountries,
  getCountryOptions,
};

export type { Country };
