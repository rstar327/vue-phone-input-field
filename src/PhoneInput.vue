<template>
  <div :class="containerClass">
    <!-- Country Select -->
    <div v-if="!noCountrySelect" class="PhoneInputCountry">
      <button
        type="button"
        class="PhoneInputCountryButton"
        :disabled="disabled || readonly"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        ref="countryBtnRef"
        :aria-label="resolveLabel('country', 'Phone number country')"
        :aria-expanded="dropdownOpen"
      >
        <slot name="flag" :country="selectedCountry" :country-code="selectedCountryCode">
          <span v-if="selectedCountry" class="PhoneInputCountryIconUnicode">{{ selectedCountry.flag }}</span>
          <span v-else class="PhoneInputCountryIcon PhoneInputCountryIcon--international">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
              <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm7.9 9H14c-.2-2.8-1-5.3-2.3-7.2C14.6 3 17 5.7 17.9 9zM10 18c-1.1 0-2.8-2.7-3-8h6c-.2 5.3-1.9 8-3 8zM7 9c.2-5.3 1.9-8 3-8s2.8 2.7 3 8H7zM8.3 1.8C7 3.7 6.2 6.2 6 9H2.1C3 5.7 5.4 3 8.3 1.8zM2.1 11H6c.2 2.8 1 5.3 2.3 7.2C5.4 17 3 14.3 2.1 11zm9.6 7.2c1.3-1.9 2.1-4.4 2.3-7.2h3.9c-.9 3.3-3.3 6-6.2 7.2z"/>
            </svg>
          </span>
        </slot>
        <div class="PhoneInputCountrySelectArrow" />
      </button>

      <!-- Custom Dropdown -->
      <Teleport to="body">
        <div v-if="dropdownOpen" class="PhoneInputDropdownBackdrop" @click="closeDropdown" />
        <div v-if="dropdownOpen" class="PhoneInputDropdown" ref="dropdownRef" :style="dropdownStyle">
          <div class="PhoneInputDropdownSearch">
            <input
              ref="searchRef"
              type="text"
              class="PhoneInputDropdownSearchInput"
              v-model="searchQuery"
              :placeholder="resolveLabel('search', 'Search...')"
              @keydown.escape="closeDropdown"
              @keydown.down.prevent="highlightNext"
              @keydown.up.prevent="highlightPrev"
              @keydown.enter.prevent="selectHighlighted"
            />
          </div>
          <ul class="PhoneInputDropdownList" ref="listRef">
            <!-- International option -->
            <li
              v-if="addInternationalOption && !searchQuery"
              :class="['PhoneInputDropdownItem', { 'PhoneInputDropdownItem--selected': !selectedCountryCode }]"
              @click="selectCountryFromDropdown(undefined)"
            >
              <span class="PhoneInputDropdownItemIcon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                  <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm7.9 9H14c-.2-2.8-1-5.3-2.3-7.2C14.6 3 17 5.7 17.9 9zM10 18c-1.1 0-2.8-2.7-3-8h6c-.2 5.3-1.9 8-3 8zM7 9c.2-5.3 1.9-8 3-8s2.8 2.7 3 8H7zM8.3 1.8C7 3.7 6.2 6.2 6 9H2.1C3 5.7 5.4 3 8.3 1.8zM2.1 11H6c.2 2.8 1 5.3 2.3 7.2C5.4 17 3 14.3 2.1 11zm9.6 7.2c1.3-1.9 2.1-4.4 2.3-7.2h3.9c-.9 3.3-3.3 6-6.2 7.2z"/>
                </svg>
              </span>
              <span class="PhoneInputDropdownItemLabel">{{ resolveLabel('ZZ', 'International') }}</span>
            </li>
            <li v-if="addInternationalOption && !searchQuery && filteredCountries.length" class="PhoneInputDropdownDivider" />
            <!-- Country items -->
            <li
              v-for="(country, index) in filteredCountries"
              :key="country.iso2"
              :class="['PhoneInputDropdownItem', {
                'PhoneInputDropdownItem--highlighted': index === highlightedIndex,
                'PhoneInputDropdownItem--selected': selectedCountryCode === country.iso2.toUpperCase(),
              }]"
              @click="selectCountryFromDropdown(country.iso2.toUpperCase())"
              @mouseenter="highlightedIndex = index"
            >
              <span class="PhoneInputDropdownItemFlag">{{ country.flag }}</span>
              <span class="PhoneInputDropdownItemLabel">{{ resolveLabel(country.iso2.toUpperCase(), country.name) }}</span>
              <span class="PhoneInputDropdownItemCode">+{{ country.dialCode }}</span>
            </li>
          </ul>
        </div>
      </Teleport>
    </div>

    <!-- Calling code prefix (non-editable) -->
    <span v-if="showCallingCodePrefix" class="PhoneInputCallingCode">
      +{{ callingCode }}
    </span>

    <!-- Phone Input -->
    <slot name="input" :value="displayValue" :on-input="onPhoneInput" :on-keydown="onKeyDown" :on-paste="onPaste" :placeholder="computedPlaceholder" :disabled="disabled" :readonly="readonly">
      <input
        ref="inputRef"
        type="tel"
        class="PhoneInputInput"
        :value="displayValue"
        :placeholder="computedPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        autocomplete="tel"
        :maxlength="limitMaxLength ? maxInputLength : undefined"
        @input="onPhoneInput"
        @keydown="onKeyDown"
        @focus="onFocus"
        @blur="onBlur"
        @paste="onPaste"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  AsYouType,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
  type CountryCode,
  type Examples,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import { type Country, countries, findCountryByIso2 } from "./data/countries";
import { detectCountryFromIP } from "./composables/useCountryDetection";

export interface PhoneInputProps {
  modelValue?: string;
  defaultCountry?: string;
  country?: string;
  international?: boolean;
  withCountryCallingCode?: boolean;
  countryCallingCodeEditable?: boolean;
  initialValueFormat?: "national" | "international";
  autoDetectCountry?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  noCountrySelect?: boolean;
  addInternationalOption?: boolean;
  preferredCountries?: string[];
  unicodeFlags?: boolean;
  labels?: Record<string, string>;
  limitMaxLength?: boolean;
  smartCaret?: boolean;
  error?: boolean | string;
}

const props = withDefaults(defineProps<PhoneInputProps>(), {
  modelValue: "",
  defaultCountry: "",
  country: "",
  international: false,
  withCountryCallingCode: false,
  countryCallingCodeEditable: true,
  initialValueFormat: "international",
  autoDetectCountry: true,
  placeholder: "",
  disabled: false,
  readonly: false,
  noCountrySelect: false,
  addInternationalOption: true,
  preferredCountries: () => [],
  unicodeFlags: true,
  labels: () => ({}),
  limitMaxLength: false,
  smartCaret: true,
  error: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | undefined): void;
  (e: "update:country", iso2: string | undefined): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement>();
const countryBtnRef = ref<HTMLElement>();
const dropdownRef = ref<HTMLElement>();
const searchRef = ref<HTMLInputElement>();
const listRef = ref<HTMLElement>();

const selectedCountryCode = ref<string | undefined>();
const selectedCountry = ref<Country | null>(null);
const isFocused = ref(false);
const dropdownOpen = ref(false);
const searchQuery = ref("");
const highlightedIndex = ref(0);
const dropdownStyle = ref<Record<string, string>>({});

// Core state: raw national digits (no formatting, no calling code)
const rawDigits = ref("");
// Flag to prevent watcher loops
let internalUpdate = false;

// --- Computed ---

const containerClass = computed(() => [
  "PhoneInput",
  {
    "PhoneInput--focus": isFocused.value,
    "PhoneInput--disabled": props.disabled,
    "PhoneInput--readOnly": props.readonly,
    "PhoneInput--invalid": !!props.error,
  },
]);

const showCallingCodePrefix = computed(
  () => selectedCountryCode.value && !props.countryCallingCodeEditable,
);

const callingCode = computed(() => {
  if (!selectedCountryCode.value) return "";
  try {
    return getCountryCallingCode(selectedCountryCode.value as CountryCode);
  } catch {
    return "";
  }
});

const maxInputLength = computed(() => {
  if (!props.limitMaxLength || !selectedCountryCode.value) return undefined;
  try {
    const example = getExampleNumber(
      selectedCountryCode.value as CountryCode,
      examples as Examples,
    );
    if (example) {
      const formatted = example.formatNational();
      return formatted.length + 2;
    }
  } catch { /* ignore */ }
  return undefined;
});

// Format the raw digits for display
const displayValue = computed(() => {
  if (!rawDigits.value) return "";
  if (selectedCountryCode.value) {
    // Use AsYouType with the full international number to get proper formatting,
    // then strip the calling code prefix to show national format
    const cc = callingCode.value;
    const fullNumber = `+${cc}${rawDigits.value}`;
    const formatter = new AsYouType(selectedCountryCode.value as CountryCode);
    const formatted = formatter.input(fullNumber);
    // Remove the international prefix (+1 , +44 , etc.) to show national format
    const prefix = `+${cc} `;
    if (formatted.startsWith(prefix)) {
      return formatted.slice(prefix.length);
    }
    const prefixNoSpace = `+${cc}`;
    if (formatted.startsWith(prefixNoSpace)) {
      return formatted.slice(prefixNoSpace.length).trimStart();
    }
    return formatted;
  }
  // No country: just show digits
  return rawDigits.value;
});

// Compute E.164 value
const e164Value = computed((): string | undefined => {
  if (!rawDigits.value) return undefined;
  if (selectedCountryCode.value) {
    const cc = callingCode.value;
    return `+${cc}${rawDigits.value}`;
  }
  return undefined;
});

const countryGroups = computed(() => {
  const groups: Array<{ key: string; countries: Country[]; hasDivider: boolean }> = [];
  if (props.preferredCountries.length > 0) {
    const preferred = props.preferredCountries
      .map((iso2) => findCountryByIso2(iso2))
      .filter(Boolean) as Country[];
    if (preferred.length) {
      groups.push({ key: "preferred", countries: preferred, hasDivider: true });
    }
  }
  const preferredSet = new Set(props.preferredCountries.map((s) => s.toLowerCase()));
  const rest = countries.filter((c) => !preferredSet.has(c.iso2));
  groups.push({ key: "all", countries: rest, hasDivider: false });
  return groups;
});

const countrySelectOptions = computed(() => {
  const options: Array<{ value: string; label: string }> = [];
  for (const group of countryGroups.value) {
    for (const c of group.countries) {
      options.push({
        value: c.iso2.toUpperCase(),
        label: resolveLabel(c.iso2.toUpperCase(), c.name),
      });
    }
  }
  return options;
});

const computedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  if (!selectedCountryCode.value) return "Phone number";
  try {
    const cc = selectedCountryCode.value as CountryCode;
    const example = getExampleNumber(cc, examples as Examples);
    if (example) {
      return example.formatNational();
    }
  } catch { /* ignore */ }
  return "Phone number";
});

const filteredCountries = computed(() => {
  let list = countries;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso2.includes(q),
    );
  }
  if (props.preferredCountries.length > 0 && !searchQuery.value) {
    const preferred = props.preferredCountries
      .map((iso2) => findCountryByIso2(iso2))
      .filter(Boolean) as Country[];
    const preferredSet = new Set(props.preferredCountries.map((s) => s.toLowerCase()));
    const rest = list.filter((c) => !preferredSet.has(c.iso2));
    return [...preferred, ...rest];
  }
  return list;
});

// --- Dropdown Methods ---

function toggleDropdown() {
  if (props.disabled || props.readonly) return;
  dropdownOpen.value = !dropdownOpen.value;
  if (dropdownOpen.value) {
    searchQuery.value = "";
    highlightedIndex.value = 0;
    positionDropdown();
    nextTick(() => searchRef.value?.focus());
  }
}

function closeDropdown() {
  dropdownOpen.value = false;
  searchQuery.value = "";
  highlightedIndex.value = 0;
}

function selectCountryFromDropdown(code: string | undefined) {
  if (code) {
    setCountry(code);
  } else {
    setCountry(undefined);
  }
  closeDropdown();
  internalUpdate = true;
  emit("update:modelValue", e164Value.value);
  nextTick(() => inputRef.value?.focus());
}

function selectHighlighted() {
  const country = filteredCountries.value[highlightedIndex.value];
  if (country) selectCountryFromDropdown(country.iso2.toUpperCase());
}

function highlightNext() {
  if (highlightedIndex.value < filteredCountries.value.length - 1) {
    highlightedIndex.value++;
    scrollToHighlighted();
  }
}

function highlightPrev() {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--;
    scrollToHighlighted();
  }
}

function scrollToHighlighted() {
  nextTick(() => {
    const item = listRef.value?.children[highlightedIndex.value] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  });
}

function positionDropdown() {
  const rect = countryBtnRef.value?.getBoundingClientRect();
  if (!rect) return;
  const parentRect = countryBtnRef.value?.closest(".PhoneInput")?.getBoundingClientRect();
  const width = Math.max(parentRect?.width ?? 300, 300);
  const spaceBelow = window.innerHeight - rect.bottom;
  dropdownStyle.value = {
    position: "fixed",
    left: `${parentRect?.left ?? rect.left}px`,
    width: `${width}px`,
    zIndex: "99999",
    ...(spaceBelow < 340
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  };
}

// --- Helpers ---

function resolveLabel(key: string, fallback: string): string {
  return props.labels?.[key] ?? fallback;
}

function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// --- Event Handlers ---

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const cursorPos = input.selectionStart ?? input.value.length;

  // Count digits before cursor (for smart caret)
  let digitsBefore = 0;
  if (props.smartCaret) {
    for (let i = 0; i < cursorPos && i < input.value.length; i++) {
      if (/\d/.test(input.value[i])) digitsBefore++;
    }
  }

  // Extract only digits from input
  const newDigits = extractDigits(input.value);
  rawDigits.value = newDigits;

  // Emit E.164
  internalUpdate = true;
  emit("update:modelValue", e164Value.value);

  // Restore cursor
  if (props.smartCaret) {
    nextTick(() => {
      if (!inputRef.value) return;
      const newValue = inputRef.value.value;
      let count = 0;
      let newCursor = newValue.length;
      for (let i = 0; i < newValue.length; i++) {
        if (/\d/.test(newValue[i])) {
          count++;
          if (count >= digitsBefore) {
            newCursor = i + 1;
            break;
          }
        }
      }
      inputRef.value.setSelectionRange(newCursor, newCursor);
    });
  }
}

function onKeyDown(event: KeyboardEvent) {
  const allowed = [
    "Backspace", "Delete", "Tab", "Escape", "Enter",
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    "Home", "End",
  ];
  if (allowed.includes(event.key)) return;
  if ((event.ctrlKey || event.metaKey) && ["a", "c", "v", "x", "z"].includes(event.key.toLowerCase())) return;
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData("text") ?? "";
  const cleaned = pasted.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    // Try to detect country from pasted international number
    try {
      const phone = parsePhoneNumberFromString(cleaned);
      if (phone?.country) {
        setCountry(phone.country);
        rawDigits.value = phone.nationalNumber;
        internalUpdate = true;
        emit("update:modelValue", phone.format("E.164"));
        return;
      }
    } catch { /* ignore */ }
    // Fallback: strip + and use as digits
    rawDigits.value = cleaned.replace(/^\+/, "");
  } else {
    rawDigits.value = extractDigits(cleaned);
  }

  internalUpdate = true;
  emit("update:modelValue", e164Value.value);
}

function onFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

function onBlur(event: FocusEvent) {
  isFocused.value = false;
  emit("blur", event);
}

// onCountryChange kept for slot API compatibility
function onCountryChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  selectCountryFromDropdown(value === "ZZ" ? undefined : value);
}

function setCountry(code: string | undefined) {
  if (code) {
    selectedCountryCode.value = code.toUpperCase();
    selectedCountry.value = findCountryByIso2(code.toLowerCase()) ?? null;
  } else {
    selectedCountryCode.value = undefined;
    selectedCountry.value = null;
  }
  emit("update:country", code?.toLowerCase());
}

// --- Sync from external v-model ---

function syncFromModelValue(value: string | undefined) {
  if (internalUpdate) {
    internalUpdate = false;
    return;
  }
  if (!value) {
    rawDigits.value = "";
    return;
  }
  try {
    const phone = parsePhoneNumberFromString(value);
    if (phone) {
      if (phone.country && !props.country) {
        setCountry(phone.country);
      }
      rawDigits.value = phone.nationalNumber;
      return;
    }
  } catch { /* ignore */ }
  // Fallback
  rawDigits.value = extractDigits(value);
}

// --- Init ---

function initCountry() {
  const iso = props.country || props.defaultCountry;
  if (iso) {
    selectedCountryCode.value = iso.toUpperCase();
    selectedCountry.value = findCountryByIso2(iso) ?? null;
  }
}

initCountry();

// --- Watchers ---

watch(() => props.modelValue, syncFromModelValue, { immediate: true });

watch(() => props.country, (val) => {
  if (val) setCountry(val);
});

watch(() => props.defaultCountry, (val) => {
  if (val && !selectedCountryCode.value) setCountry(val);
});

// --- Lifecycle ---

onMounted(async () => {
  if (props.autoDetectCountry && !props.modelValue && !selectedCountryCode.value) {
    const detected = await detectCountryFromIP();
    setCountry(detected.iso2);
  }
});

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  inputRef,
});
</script>

<style>
.PhoneInput {
  display: flex;
  align-items: center;
  gap: 8px;
}
.PhoneInput--disabled { opacity: 0.6; }

.PhoneInputCountry {
  position: relative;
  display: flex;
  align-items: center;
  align-self: stretch;
}
/* Country button */
.PhoneInputCountryButton {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;
  outline: none;
  border-radius: 4px;
  transition: background 0.1s;
}
.PhoneInputCountryButton:hover { background: rgba(0,0,0,0.04); }
.PhoneInputCountryButton:focus-visible { box-shadow: 0 0 0 2px #3b82f6; }
.PhoneInputCountryButton[disabled] { cursor: default; opacity: 0.6; }

.PhoneInputCountryIcon,
.PhoneInputCountryIconUnicode { font-size: 24px; line-height: 1; }
.PhoneInputCountryIcon--international { color: #999; }
.PhoneInputCountryIcon--international svg { display: block; }

.PhoneInputCountrySelectArrow {
  display: block;
  width: 0; height: 0;
  margin-left: 4px;
  border-style: solid;
  border-color: #888 transparent transparent;
  border-width: 5px 4px 0;
  opacity: 0.7;
}

/* Dropdown backdrop */
.PhoneInputDropdownBackdrop {
  position: fixed;
  inset: 0;
  z-index: 99998;
}

/* Dropdown */
.PhoneInputDropdown {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  animation: PhoneInputDropdownFadeIn 0.15s ease-out;
}
@keyframes PhoneInputDropdownFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Search */
.PhoneInputDropdownSearch {
  padding: 10px 10px 8px;
  border-bottom: 1px solid #f0f0f0;
}
.PhoneInputDropdownSearchInput {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.PhoneInputDropdownSearchInput:focus { border-color: #3b82f6; }
.PhoneInputDropdownSearchInput::placeholder { color: #aaa; }

/* List */
.PhoneInputDropdownList {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: 300px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Items */
.PhoneInputDropdownItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  cursor: pointer;
  transition: background 0.06s;
  font-size: 14px;
}
.PhoneInputDropdownItem:hover,
.PhoneInputDropdownItem--highlighted {
  background: #f0f4ff;
}
.PhoneInputDropdownItem--selected {
  background: #e8f0fe;
  font-weight: 500;
}
.PhoneInputDropdownItemFlag {
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
}
.PhoneInputDropdownItemIcon {
  color: #999;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.PhoneInputDropdownItemLabel {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.PhoneInputDropdownItemCode {
  color: #888;
  font-size: 13px;
  flex-shrink: 0;
}

/* Divider */
.PhoneInputDropdownDivider {
  height: 1px;
  background: #eee;
  margin: 4px 0;
  list-style: none;
}

/* Calling code prefix */
.PhoneInputCallingCode {
  color: #333;
  font: inherit;
  white-space: nowrap;
  user-select: none;
}

/* Input */
.PhoneInputInput {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font: inherit;
  background: transparent;
  padding: 0;
}
.PhoneInputInput::placeholder { color: #aaa; }
</style>
