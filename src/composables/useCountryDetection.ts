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

export function getCountryOptions(params: {
  countries?: Country[];
  preferredCountries?: string[];
  addInternationalOption?: boolean;
  labels?: Record<string, string>;
}): Array<{ value: string; label: string; divider?: boolean }> {
  const list = params.countries ?? countries;
  const preferred = (params.preferredCountries ?? [])
    .map((iso2) => findCountryByIso2(iso2))
    .filter(Boolean) as Country[];

  const options: Array<{ value: string; label: string; divider?: boolean }> = [];

  if (params.addInternationalOption !== false) {
    options.push({ value: "", label: params.labels?.["ZZ"] ?? "International" });
  }

  if (preferred.length > 0) {
    for (const c of preferred) {
      const label = params.labels?.[c.iso2.toUpperCase()] ?? c.name;
      options.push({ value: c.iso2, label: `${c.flag} ${label}` });
    }
    options.push({ value: "", label: "", divider: true });
  }

  const preferredSet = new Set((params.preferredCountries ?? []).map((s) => s.toLowerCase()));
  for (const c of list) {
    if (preferredSet.has(c.iso2)) continue;
    const label = params.labels?.[c.iso2.toUpperCase()] ?? c.name;
    options.push({ value: c.iso2, label: `${c.flag} ${label}` });
  }

  return options;
}
