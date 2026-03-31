import PhoneInput from "./PhoneInput.vue";
import type { Country } from "./data/countries";
import { countries, findCountryByIso2, findCountryByDialCode } from "./data/countries";
import { validatePhone, formatPhoneNumber, stripNonDigits } from "./composables/usePhoneValidation";
import { detectCountryFromIP, searchCountries } from "./composables/useCountryDetection";

export {
  PhoneInput,
  countries,
  findCountryByIso2,
  findCountryByDialCode,
  validatePhone,
  formatPhoneNumber,
  stripNonDigits,
  detectCountryFromIP,
  searchCountries,
};

export type { Country };
