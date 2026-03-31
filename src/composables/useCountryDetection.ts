import { type Country, countries, findCountryByIso2 } from "../data/countries";

const IP_API_URL = "https://ipapi.co/json/";
const FALLBACK_COUNTRY = "us";

export async function detectCountryFromIP(): Promise<Country> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(IP_API_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) throw new Error("IP lookup failed");
    const data = await response.json();
    const iso2 = (data.country_code ?? "").toLowerCase();
    return findCountryByIso2(iso2) ?? findCountryByIso2(FALLBACK_COUNTRY)!;
  } catch {
    return findCountryByIso2(FALLBACK_COUNTRY)!;
  }
}

export function searchCountries(query: string): Country[] {
  if (!query) return countries;
  const q = query.toLowerCase();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.iso2.includes(q),
  );
}
