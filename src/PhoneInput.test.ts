import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PhoneInput from "./PhoneInput.vue";
import { countries, findCountryByIso2, findCountryByDialCode } from "./data/countries";
import {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
  formatNational,
  formatInternational,
  stripNonDigits,
  getCallingCode,
} from "./composables/usePhoneValidation";

describe("PhoneInput Component", () => {
  it("renders with default props", () => {
    const wrapper = mount(PhoneInput, { props: { autoDetectCountry: false } });
    expect(wrapper.find(".PhoneInput").exists()).toBe(true);
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("renders country selector by default", () => {
    const wrapper = mount(PhoneInput, { props: { autoDetectCountry: false } });
    expect(wrapper.find(".PhoneInputCountry").exists()).toBe(true);
  });

  it("hides country selector with noCountrySelect", () => {
    const wrapper = mount(PhoneInput, {
      props: { noCountrySelect: true, autoDetectCountry: false },
    });
    expect(wrapper.find(".PhoneInputCountry").exists()).toBe(false);
  });

  it("sets default country", () => {
    const wrapper = mount(PhoneInput, {
      props: { defaultCountry: "gb", autoDetectCountry: false },
    });
    expect(wrapper.find(".PhoneInputCountryIconUnicode").text()).toContain("🇬🇧");
  });

  it("shows disabled state", () => {
    const wrapper = mount(PhoneInput, {
      props: { disabled: true, autoDetectCountry: false },
    });
    expect(wrapper.classes()).toContain("PhoneInput--disabled");
    expect((wrapper.find("input").element as HTMLInputElement).disabled).toBe(true);
  });

  it("syncs from modelValue", () => {
    const wrapper = mount(PhoneInput, {
      props: { modelValue: "+12025551234", autoDetectCountry: false },
    });
    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBeTruthy();
    expect(input.value.replace(/\D/g, "")).toContain("202");
  });

  it("emits update:modelValue on input", async () => {
    const wrapper = mount(PhoneInput, {
      props: { defaultCountry: "us", autoDetectCountry: false },
    });
    const input = wrapper.find("input");
    await input.setValue("2025551234");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });
});

describe("Country Data", () => {
  it("has countries list", () => {
    expect(countries.length).toBeGreaterThan(100);
  });

  it("each country has required fields", () => {
    for (const c of countries) {
      expect(c.iso2).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.dialCode).toBeTruthy();
      expect(c.flag).toBeTruthy();
    }
  });

  it("finds country by iso2", () => {
    const us = findCountryByIso2("us");
    expect(us).toBeDefined();
    expect(us!.name).toBe("United States");
    expect(us!.dialCode).toBe("1");
  });

  it("finds country by dial code", () => {
    const country = findCountryByDialCode("44");
    expect(country).toBeDefined();
    expect(country!.iso2).toBe("gb");
  });

  it("returns undefined for unknown iso2", () => {
    expect(findCountryByIso2("zz")).toBeUndefined();
  });

  it("generates flag emojis", () => {
    const us = findCountryByIso2("us");
    expect(us!.flag).toBe("🇺🇸");
    const gb = findCountryByIso2("gb");
    expect(gb!.flag).toBe("🇬🇧");
  });
});

describe("Validation", () => {
  it("validates a valid US number", () => {
    expect(isValidPhoneNumber("+12025551234")).toBe(true);
  });

  it("validates with country code", () => {
    expect(isValidPhoneNumber("2025551234", "US")).toBe(true);
  });

  it("rejects invalid number", () => {
    expect(isValidPhoneNumber("+1234")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidPhoneNumber("")).toBe(false);
  });

  it("isPossiblePhoneNumber works", () => {
    expect(isPossiblePhoneNumber("+12025551234")).toBe(true);
    expect(isPossiblePhoneNumber("+1")).toBe(false);
  });
});

describe("Formatting", () => {
  it("formats national", () => {
    const result = formatNational("+12025551234", "US");
    expect(result).toContain("202");
    expect(result).toContain("555");
  });

  it("formats international", () => {
    const result = formatInternational("+12025551234", "US");
    expect(result).toContain("+1");
  });

  it("returns input for invalid number", () => {
    expect(formatNational("abc", "US")).toBe("abc");
  });
});

describe("Utilities", () => {
  it("strips non-digits", () => {
    expect(stripNonDigits("+1 (202) 555-1234")).toBe("+12025551234");
  });

  it("gets calling code", () => {
    expect(getCallingCode("US")).toBe("1");
    expect(getCallingCode("GB")).toBe("44");
    expect(getCallingCode("JP")).toBe("81");
  });
});
