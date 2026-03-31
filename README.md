# vue-smart-phone-input

A Vue 3 international phone number input component with country flags, auto-formatting, validation, and IP-based country detection.

## Features

- Country selector with flag emojis and search
- Auto-format phone numbers based on country patterns
- Phone number validation
- Auto-detect country from IP address
- Full keyboard navigation in dropdown
- Copy/paste support (auto-detects country from pasted `+` numbers)
- v-model support (outputs E.164 format)
- TypeScript support
- Zero dependencies (only requires Vue 3)

## Install

```bash
npm install vue-smart-phone-input
```

## Usage

```vue
<template>
  <PhoneInput
    v-model="phone"
    default-country="us"
    @validate="onValidate"
    @country-changed="onCountryChanged"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PhoneInput } from 'vue-smart-phone-input'

const phone = ref('')

function onValidate({ valid, e164, nationalNumber }) {
  console.log('Valid:', valid, 'E.164:', e164)
}

function onCountryChanged(country) {
  console.log('Country:', country.name, country.flag)
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `""` | Phone number in E.164 format (v-model) |
| `defaultCountry` | `string` | `"us"` | Default country ISO2 code |
| `autoDetectCountry` | `boolean` | `true` | Auto-detect country from IP |
| `placeholder` | `string` | `"Phone number"` | Input placeholder |
| `disabled` | `boolean` | `false` | Disable the input |
| `readonly` | `boolean` | `false` | Make input readonly |
| `showValidation` | `boolean` | `true` | Show validation indicator |
| `preferredCountries` | `string[]` | `[]` | ISO2 codes to show first in dropdown |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | E.164 formatted number |
| `validate` | `{ valid, e164, nationalNumber }` | Validation result |
| `country-changed` | `Country` | When country selection changes |
| `focus` | — | Input focused |
| `blur` | — | Input blurred |

## Utilities

```js
import {
  countries,           // Full country list
  findCountryByIso2,   // Find country by ISO2 code
  findCountryByDialCode, // Find country by dial code
  validatePhone,       // Validate a phone number
  formatPhoneNumber,   // Format digits with a pattern
  detectCountryFromIP, // Detect country from IP (async)
  searchCountries,     // Search countries by name/code
} from 'vue-smart-phone-input'
```

## License

MIT
