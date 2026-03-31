<template>
  <div :class="['vpi-wrapper', { 'vpi-focused': isFocused, 'vpi-invalid': !isValid && touched, 'vpi-disabled': disabled }]">
    <!-- Country selector -->
    <div class="vpi-country" @click="toggleDropdown" ref="countryBtnRef" :tabindex="disabled ? -1 : 0" @keydown.enter.prevent="toggleDropdown" @keydown.space.prevent="toggleDropdown">
      <span class="vpi-flag">{{ selectedCountry?.flag }}</span>
      <span class="vpi-dial-code">+{{ selectedCountry?.dialCode }}</span>
      <span class="vpi-arrow">&#9662;</span>
    </div>

    <!-- Phone input -->
    <input
      ref="inputRef"
      type="tel"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      class="vpi-input"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @paste="onPaste"
      @keydown="onKeydown"
    />

    <!-- Validation indicator -->
    <span v-if="touched && showValidation" class="vpi-validation" :class="isValid ? 'vpi-valid' : 'vpi-error'">
      {{ isValid ? '&#10003;' : '&#10007;' }}
    </span>

    <!-- Country dropdown -->
    <Teleport to="body">
      <div v-if="dropdownOpen" class="vpi-dropdown" ref="dropdownRef" :style="dropdownStyle">
        <input
          ref="searchRef"
          type="text"
          class="vpi-search"
          v-model="searchQuery"
          placeholder="Search country..."
          @keydown.escape="closeDropdown"
          @keydown.down.prevent="highlightNext"
          @keydown.up.prevent="highlightPrev"
          @keydown.enter.prevent="selectHighlighted"
        />
        <ul class="vpi-country-list" ref="listRef">
          <li
            v-for="(country, index) in filteredCountries"
            :key="country.iso2"
            :class="['vpi-country-item', { 'vpi-highlighted': index === highlightedIndex }]"
            @click="selectCountry(country)"
            @mouseenter="highlightedIndex = index"
          >
            <span class="vpi-flag">{{ country.flag }}</span>
            <span class="vpi-country-name">{{ country.name }}</span>
            <span class="vpi-country-code">+{{ country.dialCode }}</span>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { type Country, countries, findCountryByIso2 } from "./data/countries";
import { detectCountryFromIP, searchCountries } from "./composables/useCountryDetection";
import { validatePhone, formatPhoneNumber, stripNonDigits } from "./composables/usePhoneValidation";

export interface PhoneInputProps {
  modelValue?: string;
  defaultCountry?: string;
  autoDetectCountry?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  showValidation?: boolean;
  preferredCountries?: string[];
}

export interface PhoneInputEmits {
  (e: "update:modelValue", value: string): void;
  (e: "country-changed", country: Country): void;
  (e: "validate", result: { valid: boolean; e164: string; nationalNumber: string }): void;
  (e: "focus"): void;
  (e: "blur"): void;
}

const props = withDefaults(defineProps<PhoneInputProps>(), {
  modelValue: "",
  defaultCountry: "us",
  autoDetectCountry: true,
  placeholder: "Phone number",
  disabled: false,
  readonly: false,
  showValidation: true,
  preferredCountries: () => [],
});

const emit = defineEmits<PhoneInputEmits>();

const selectedCountry = ref<Country | null>(findCountryByIso2(props.defaultCountry) ?? null);
const nationalNumber = ref("");
const isFocused = ref(false);
const touched = ref(false);
const dropdownOpen = ref(false);
const searchQuery = ref("");
const highlightedIndex = ref(0);
const dropdownStyle = ref<Record<string, string>>({});

const inputRef = ref<HTMLInputElement>();
const countryBtnRef = ref<HTMLElement>();
const dropdownRef = ref<HTMLElement>();
const searchRef = ref<HTMLInputElement>();
const listRef = ref<HTMLElement>();

// Computed
const filteredCountries = computed(() => {
  let result = searchCountries(searchQuery.value);
  if (props.preferredCountries.length > 0) {
    const preferred = props.preferredCountries
      .map((iso2) => findCountryByIso2(iso2))
      .filter(Boolean) as Country[];
    const rest = result.filter(
      (c) => !props.preferredCountries.includes(c.iso2),
    );
    result = [...preferred, ...rest];
  }
  return result;
});

const displayValue = computed(() => {
  if (!nationalNumber.value) return "";
  if (selectedCountry.value?.format) {
    return formatPhoneNumber(nationalNumber.value, selectedCountry.value.format);
  }
  return nationalNumber.value;
});

const validationResult = computed(() =>
  validatePhone(nationalNumber.value, selectedCountry.value),
);

const isValid = computed(() => validationResult.value.valid);

// Methods
function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const digits = stripNonDigits(target.value);
  nationalNumber.value = digits;
  emitValue();
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData("text") ?? "";
  const digits = stripNonDigits(pasted);

  // Try to detect country from pasted number starting with +
  if (pasted.startsWith("+")) {
    const withoutPlus = digits;
    for (const country of countries) {
      if (withoutPlus.startsWith(country.dialCode)) {
        selectedCountry.value = country;
        nationalNumber.value = withoutPlus.slice(country.dialCode.length);
        emit("country-changed", country);
        emitValue();
        return;
      }
    }
  }

  nationalNumber.value = digits;
  emitValue();
}

function onKeydown(event: KeyboardEvent) {
  // Allow: backspace, delete, tab, escape, enter, arrows
  const allowed = [
    "Backspace", "Delete", "Tab", "Escape", "Enter",
    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    "Home", "End",
  ];
  if (allowed.includes(event.key)) return;
  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if ((event.ctrlKey || event.metaKey) && ["a", "c", "v", "x"].includes(event.key.toLowerCase())) return;
  // Block non-digit keys
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
}

function onFocus() {
  isFocused.value = true;
  emit("focus");
}

function onBlur() {
  isFocused.value = false;
  touched.value = true;
  emit("blur");
}

function emitValue() {
  const result = validationResult.value;
  emit("update:modelValue", result.e164);
  emit("validate", {
    valid: result.valid,
    e164: result.e164,
    nationalNumber: result.nationalNumber,
  });
}

function toggleDropdown() {
  if (props.disabled) return;
  dropdownOpen.value = !dropdownOpen.value;
  if (dropdownOpen.value) {
    positionDropdown();
    nextTick(() => searchRef.value?.focus());
  }
}

function closeDropdown() {
  dropdownOpen.value = false;
  searchQuery.value = "";
  highlightedIndex.value = 0;
}

function selectCountry(country: Country) {
  selectedCountry.value = country;
  closeDropdown();
  emit("country-changed", country);
  emitValue();
  nextTick(() => inputRef.value?.focus());
}

function selectHighlighted() {
  const country = filteredCountries.value[highlightedIndex.value];
  if (country) selectCountry(country);
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
    const list = listRef.value;
    const item = list?.children[highlightedIndex.value] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  });
}

function positionDropdown() {
  const rect = countryBtnRef.value?.getBoundingClientRect();
  if (!rect) return;
  const spaceBelow = window.innerHeight - rect.bottom;
  const openAbove = spaceBelow < 300;
  dropdownStyle.value = {
    position: "fixed",
    left: `${rect.left}px`,
    width: "280px",
    zIndex: "9999",
    ...(openAbove
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  };
}

function onClickOutside(event: MouseEvent) {
  if (
    dropdownOpen.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    !countryBtnRef.value?.contains(event.target as Node)
  ) {
    closeDropdown();
  }
}

// Parse initial modelValue
function parseModelValue(value: string) {
  if (!value) return;
  const digits = stripNonDigits(value);
  if (value.startsWith("+")) {
    for (const country of countries) {
      if (digits.startsWith(country.dialCode)) {
        selectedCountry.value = country;
        nationalNumber.value = digits.slice(country.dialCode.length);
        return;
      }
    }
  }
  nationalNumber.value = digits;
}

// Watchers
watch(() => props.modelValue, (val) => {
  parseModelValue(val);
}, { immediate: true });

watch(() => props.defaultCountry, (val) => {
  const country = findCountryByIso2(val);
  if (country) selectedCountry.value = country;
});

// Lifecycle
onMounted(async () => {
  document.addEventListener("click", onClickOutside);
  if (props.autoDetectCountry && !props.modelValue) {
    selectedCountry.value = await detectCountryFromIP();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<style>
.vpi-wrapper {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: visible;
}
.vpi-wrapper:hover {
  border-color: #9ca3af;
}
.vpi-focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.vpi-invalid {
  border-color: #ef4444;
}
.vpi-invalid.vpi-focused {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}
.vpi-disabled {
  opacity: 0.5;
  pointer-events: none;
  background: #f9fafb;
}
.vpi-country {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 8px 8px 12px;
  cursor: pointer;
  border-right: 1px solid #e5e7eb;
  user-select: none;
  white-space: nowrap;
}
.vpi-country:hover {
  background: #f3f4f6;
}
.vpi-flag {
  font-size: 18px;
  line-height: 1;
}
.vpi-dial-code {
  color: #6b7280;
  font-size: 13px;
}
.vpi-arrow {
  font-size: 10px;
  color: #9ca3af;
  margin-left: 2px;
}
.vpi-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  background: transparent;
  min-width: 0;
}
.vpi-input::placeholder {
  color: #9ca3af;
}
.vpi-validation {
  padding: 0 10px;
  font-size: 16px;
  font-weight: bold;
}
.vpi-valid {
  color: #22c55e;
}
.vpi-error {
  color: #ef4444;
}

/* Dropdown */
.vpi-dropdown {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}
.vpi-search {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}
.vpi-search::placeholder {
  color: #9ca3af;
}
.vpi-country-list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: 250px;
  overflow-y: auto;
}
.vpi-country-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.1s;
}
.vpi-country-item:hover,
.vpi-highlighted {
  background: #f3f4f6;
}
.vpi-country-name {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vpi-country-code {
  color: #6b7280;
  font-size: 12px;
  flex-shrink: 0;
}
</style>
