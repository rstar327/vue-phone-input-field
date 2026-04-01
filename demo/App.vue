<template>
  <div class="page">
    <header>
      <h1>vue-phone-input-field</h1>
      <p class="tagline">International phone number input for Vue 3</p>
      <div class="badges">
        <a href="https://www.npmjs.com/package/vue-phone-input-field" target="_blank">
          <img src="https://img.shields.io/npm/v/vue-phone-input-field?color=blue" alt="npm" />
        </a>
        <a href="https://github.com/rstar327/vue-phone-input-field" target="_blank">
          <img src="https://img.shields.io/github/stars/rstar327/vue-phone-input-field?style=social" alt="GitHub" />
        </a>
      </div>
      <pre class="install">npm install vue-phone-input-field</pre>
    </header>

    <section>
      <h2>Basic</h2>
      <p class="desc">With country auto-detection and preferred countries.</p>
      <div class="phone-field">
        <PhoneInput
          v-model="phone1"
          default-country="us"
          :preferred-countries="['us', 'gb', 'ca', 'au']"
          @update:country="country1 = $event"
        />
      </div>
      <div class="result">
        <span><b>E.164:</b> {{ phone1 || '—' }}</span>
        <span><b>Country:</b> {{ country1 || '—' }}</span>
        <span><b>Valid:</b> {{ phone1 ? isValidPhoneNumber(phone1) : '—' }}</span>
      </div>
    </section>

    <section>
      <h2>International format</h2>
      <p class="desc">Locked to a specific country with international display.</p>
      <div class="phone-field">
        <PhoneInput v-model="phone2" country="us" international />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ phone2 || '—' }}</span>
      </div>
    </section>

    <section>
      <h2>Non-editable calling code</h2>
      <p class="desc">Calling code shown as a fixed prefix.</p>
      <div class="phone-field">
        <PhoneInput v-model="phone3" country="gb" :country-calling-code-editable="false" />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ phone3 || '—' }}</span>
      </div>
    </section>

    <section>
      <h2>With initial value</h2>
      <p class="desc">Pre-filled phone number, displayed in national format.</p>
      <div class="phone-field">
        <PhoneInput v-model="phone4" initial-value-format="national" />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ phone4 || '—' }}</span>
      </div>
    </section>

    <section>
      <h2>With validation</h2>
      <p class="desc">Shows error state when the number is invalid.</p>
      <div class="phone-field" :class="{ 'phone-field--error': phone5 && !phone5Valid }">
        <PhoneInput v-model="phone5" default-country="de" :error="!!phone5 && !phone5Valid" />
      </div>
      <p v-if="phone5 && !phone5Valid" class="error-msg">Please enter a valid phone number</p>
      <div class="result">
        <span><b>Valid:</b> {{ phone5 ? phone5Valid : '—' }}</span>
      </div>
    </section>

    <section>
      <h2>No country select</h2>
      <p class="desc">Locked country with hidden dropdown.</p>
      <div class="phone-field">
        <PhoneInput v-model="phone6" country="jp" no-country-select />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ phone6 || '—' }}</span>
      </div>
    </section>

    <section>
      <h2>Disabled</h2>
      <div class="phone-field">
        <PhoneInput model-value="+12025551234" default-country="us" disabled />
      </div>
    </section>

    <section>
      <h2>Custom labels (i18n)</h2>
      <p class="desc">Country names in Spanish.</p>
      <div class="phone-field">
        <PhoneInput
          v-model="phone7"
          default-country="es"
          :labels="{ ZZ: 'Internacional', US: 'Estados Unidos', GB: 'Reino Unido', ES: 'Espana', FR: 'Francia', DE: 'Alemania', search: 'Buscar...' }"
        />
      </div>
    </section>

    <footer>
      <a href="https://github.com/rstar327/vue-phone-input-field" target="_blank">GitHub</a>
      <span>|</span>
      <a href="https://www.npmjs.com/package/vue-phone-input-field" target="_blank">npm</a>
      <span>|</span>
      <span>MIT License</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { PhoneInput, isValidPhoneNumber } from "../src/index";
import "../src/PhoneInput.vue";

const phone1 = ref("");
const country1 = ref("");
const phone2 = ref("");
const phone3 = ref("");
const phone4 = ref("+442071234567");
const phone5 = ref("");
const phone5Valid = computed(() => phone5.value ? isValidPhoneNumber(phone5.value) : false);
const phone6 = ref("");
const phone7 = ref("");
</script>

<style>
@import "../dist/vue-phone-input-field.css";

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #f5f5f5;
  color: #222;
  line-height: 1.6;
}
.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}
header { text-align: center; margin-bottom: 48px; }
h1 { font-size: 32px; font-weight: 700; margin-bottom: 4px; }
.tagline { color: #666; font-size: 16px; margin-bottom: 16px; }
.badges { display: flex; gap: 8px; justify-content: center; margin-bottom: 16px; }
.badges img { height: 20px; }
.install {
  display: inline-block;
  background: #1a1a2e;
  color: #e0e0e0;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
h2 { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 4px; }
.desc { font-size: 13px; color: #888; margin-bottom: 14px; }

.phone-field {
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 10px 14px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.phone-field:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.phone-field--error {
  border-color: #ef4444;
}
.phone-field--error:focus-within {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.result {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  font-size: 13px;
  color: #555;
}
.error-msg {
  color: #ef4444;
  font-size: 13px;
  margin-top: 6px;
}

footer {
  text-align: center;
  margin-top: 48px;
  font-size: 13px;
  color: #999;
}
footer a { color: #666; text-decoration: none; }
footer a:hover { color: #333; text-decoration: underline; }
footer span { margin: 0 6px; }
</style>
