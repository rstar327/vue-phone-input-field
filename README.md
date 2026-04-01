# vue-phone-input-field

International phone number input for Vue 3 with country flags, real-time formatting, validation, and auto-detection. Powered by [libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js).

Inspired by [react-phone-number-input](https://www.npmjs.com/package/react-phone-number-input) — bringing the same quality to Vue.

## Features

- Real-time phone number formatting via `libphonenumber-js` `AsYouType`
- Country selector with searchable dropdown and flag emojis
- Phone number validation (`isValidPhoneNumber`, `isPossiblePhoneNumber`)
- Auto-detect country from IP address
- Smart caret positioning (cursor stays in the right place during formatting)
- Copy/paste support with automatic country detection from `+` numbers
- Non-editable country calling code mode
- `limitMaxLength` based on real phone number length per country
- Keyboard navigation in dropdown (arrows, enter, escape)
- Preferred countries with divider
- International option (no country selected)
- Custom slots for flag, input, and country select
- v-model support (outputs E.164 format)
- Full TypeScript support
- Same CSS class names as `react-phone-number-input` for easy migration

## Install

```bash
npm install vue-phone-input-field
```

## Quick Start

```vue
<template>
  <div class="phone-field">
    <PhoneInput
      v-model="phone"
      default-country="us"
      :preferred-countries="['us', 'gb', 'ca']"
      @update:country="onCountryChange"
    />
  </div>
  <p>Value: {{ phone }}</p>
  <p>Valid: {{ phone ? isValidPhoneNumber(phone) : false }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { PhoneInput, isValidPhoneNumber } from 'vue-phone-input-field'
import 'vue-phone-input-field/style.css'

const phone = ref('')

function onCountryChange(iso2) {
  console.log('Country changed:', iso2)
}
</script>

<style>
.phone-field {
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 10px 12px;
}
.phone-field:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
</style>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `""` | Phone number in E.164 format (v-model) |
| `defaultCountry` | `string` | `""` | Default country ISO2 code (e.g. `"us"`) |
| `country` | `string` | `""` | Lock to a specific country |
| `international` | `boolean` | `false` | Show international format |
| `countryCallingCodeEditable` | `boolean` | `true` | Whether calling code is editable. Set `false` to show non-editable `+1` prefix |
| `initialValueFormat` | `"national" \| "international"` | `"international"` | How to display initial value |
| `autoDetectCountry` | `boolean` | `true` | Auto-detect country from IP on mount |
| `placeholder` | `string` | `""` | Custom placeholder (auto-generated from country example if empty) |
| `disabled` | `boolean` | `false` | Disable the input |
| `readonly` | `boolean` | `false` | Make input readonly |
| `noCountrySelect` | `boolean` | `false` | Hide country selector |
| `addInternationalOption` | `boolean` | `true` | Show "International" option in dropdown |
| `preferredCountries` | `string[]` | `[]` | ISO2 codes to show first in dropdown |
| `unicodeFlags` | `boolean` | `true` | Use Unicode flag emojis |
| `labels` | `Record<string, string>` | `{}` | Custom country labels for i18n |
| `limitMaxLength` | `boolean` | `false` | Limit input length based on country |
| `smartCaret` | `boolean` | `true` | Smart cursor positioning during formatting |
| `error` | `boolean \| string` | `false` | Show error state |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| undefined` | E.164 formatted number |
| `update:country` | `string \| undefined` | Country ISO2 code when changed |
| `focus` | `FocusEvent` | Input focused |
| `blur` | `FocusEvent` | Input blurred |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `flag` | `{ country, countryCode }` | Custom flag/icon |
| `input` | `{ value, onInput, onKeydown, onPaste, ... }` | Custom input element |
| `country-select` | `{ country, onChange, options, disabled }` | Custom country select |

## Utility Functions

```js
import {
  // Validation (same API as react-phone-number-input)
  isValidPhoneNumber,     // Strict validation
  isPossiblePhoneNumber,  // Length-based validation

  // Formatting
  formatPhoneNumber,      // Format to national format
  formatPhoneNumberIntl,  // Format to international format
  formatAsYouType,        // Real-time formatting

  // Country data
  countries,              // Full country list with flags
  findCountryByIso2,      // Find country by ISO2 code
  findCountryByDialCode,  // Find country by dial code
  searchCountries,        // Search countries by name/code
  detectCountryFromIP,    // Detect country from IP (async)
  getCountryOptions,      // Get formatted country options
  getCallingCode,         // Get calling code for country

  // Parsing
  parseE164,              // Parse E.164 number
  stripNonDigits,         // Strip non-digit characters
} from 'vue-phone-input-field'
```

## Examples

### With preferred countries

```vue
<PhoneInput
  v-model="phone"
  default-country="gb"
  :preferred-countries="['us', 'gb', 'ca', 'au']"
/>
```

### Non-editable calling code

```vue
<PhoneInput
  v-model="phone"
  country="us"
  :country-calling-code-editable="false"
/>
```

### Locked country (no dropdown)

```vue
<PhoneInput
  v-model="phone"
  country="de"
  no-country-select
/>
```

### With validation

```vue
<template>
  <PhoneInput v-model="phone" :error="!!phone && !valid" />
  <span v-if="phone && !valid">Invalid phone number</span>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PhoneInput, isValidPhoneNumber } from 'vue-phone-input-field'

const phone = ref('')
const valid = computed(() => isValidPhoneNumber(phone.value))
</script>
```

### Custom labels (i18n)

```vue
<PhoneInput
  v-model="phone"
  :labels="{ ZZ: 'Internacional', US: 'Estados Unidos', GB: 'Reino Unido' }"
/>
```

## Styling

The component uses the same CSS class names as `react-phone-number-input`, making it easy to migrate or reuse styles:

- `.PhoneInput` — container
- `.PhoneInput--focus` — focused state
- `.PhoneInput--disabled` — disabled state
- `.PhoneInput--invalid` — error state
- `.PhoneInputCountry` — country selector area
- `.PhoneInputCountryIconUnicode` — flag emoji
- `.PhoneInputInput` — the input element
- `.PhoneInputDropdown` — dropdown popup
- `.PhoneInputDropdownItem` — dropdown item
- `.PhoneInputDropdownItem--selected` — selected country
- `.PhoneInputDropdownItem--highlighted` — keyboard-highlighted item

Import the default styles:

```js
import 'vue-phone-input-field/style.css'
```

## License

MIT
