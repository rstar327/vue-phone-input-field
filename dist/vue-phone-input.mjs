import { Fragment as e, Teleport as t, computed as n, createBlock as r, createCommentVNode as i, createElementBlock as a, createElementVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as ee, onBeforeUnmount as te, onMounted as u, openBlock as d, ref as f, renderList as p, toDisplayString as m, vModelText as ne, watch as h, withDirectives as re, withKeys as g, withModifiers as _ } from "vue";
//#region src/data/countries.ts
function v(e) {
	return e.toUpperCase().split("").map((e) => String.fromCodePoint(127397 + e.charCodeAt(0))).join("");
}
var y = [
	{
		name: "Afghanistan",
		iso2: "af",
		dialCode: "93"
	},
	{
		name: "Albania",
		iso2: "al",
		dialCode: "355"
	},
	{
		name: "Algeria",
		iso2: "dz",
		dialCode: "213"
	},
	{
		name: "Argentina",
		iso2: "ar",
		dialCode: "54"
	},
	{
		name: "Armenia",
		iso2: "am",
		dialCode: "374"
	},
	{
		name: "Australia",
		iso2: "au",
		dialCode: "61",
		format: ".... ... ..."
	},
	{
		name: "Austria",
		iso2: "at",
		dialCode: "43"
	},
	{
		name: "Azerbaijan",
		iso2: "az",
		dialCode: "994"
	},
	{
		name: "Bahrain",
		iso2: "bh",
		dialCode: "973"
	},
	{
		name: "Bangladesh",
		iso2: "bd",
		dialCode: "880"
	},
	{
		name: "Belarus",
		iso2: "by",
		dialCode: "375"
	},
	{
		name: "Belgium",
		iso2: "be",
		dialCode: "32"
	},
	{
		name: "Bolivia",
		iso2: "bo",
		dialCode: "591"
	},
	{
		name: "Bosnia and Herzegovina",
		iso2: "ba",
		dialCode: "387"
	},
	{
		name: "Brazil",
		iso2: "br",
		dialCode: "55",
		format: "(..) .....-....."
	},
	{
		name: "Bulgaria",
		iso2: "bg",
		dialCode: "359"
	},
	{
		name: "Cambodia",
		iso2: "kh",
		dialCode: "855"
	},
	{
		name: "Cameroon",
		iso2: "cm",
		dialCode: "237"
	},
	{
		name: "Canada",
		iso2: "ca",
		dialCode: "1",
		format: "(...) ...-....."
	},
	{
		name: "Chile",
		iso2: "cl",
		dialCode: "56"
	},
	{
		name: "China",
		iso2: "cn",
		dialCode: "86",
		format: "... .... ...."
	},
	{
		name: "Colombia",
		iso2: "co",
		dialCode: "57"
	},
	{
		name: "Costa Rica",
		iso2: "cr",
		dialCode: "506"
	},
	{
		name: "Croatia",
		iso2: "hr",
		dialCode: "385"
	},
	{
		name: "Cuba",
		iso2: "cu",
		dialCode: "53"
	},
	{
		name: "Cyprus",
		iso2: "cy",
		dialCode: "357"
	},
	{
		name: "Czech Republic",
		iso2: "cz",
		dialCode: "420"
	},
	{
		name: "Denmark",
		iso2: "dk",
		dialCode: "45",
		format: ".. .. .. .."
	},
	{
		name: "Dominican Republic",
		iso2: "do",
		dialCode: "1"
	},
	{
		name: "Ecuador",
		iso2: "ec",
		dialCode: "593"
	},
	{
		name: "Egypt",
		iso2: "eg",
		dialCode: "20"
	},
	{
		name: "El Salvador",
		iso2: "sv",
		dialCode: "503"
	},
	{
		name: "Estonia",
		iso2: "ee",
		dialCode: "372"
	},
	{
		name: "Ethiopia",
		iso2: "et",
		dialCode: "251"
	},
	{
		name: "Finland",
		iso2: "fi",
		dialCode: "358"
	},
	{
		name: "France",
		iso2: "fr",
		dialCode: "33",
		format: ". .. .. .. .."
	},
	{
		name: "Georgia",
		iso2: "ge",
		dialCode: "995"
	},
	{
		name: "Germany",
		iso2: "de",
		dialCode: "49",
		format: ".... ........"
	},
	{
		name: "Ghana",
		iso2: "gh",
		dialCode: "233"
	},
	{
		name: "Greece",
		iso2: "gr",
		dialCode: "30"
	},
	{
		name: "Guatemala",
		iso2: "gt",
		dialCode: "502"
	},
	{
		name: "Honduras",
		iso2: "hn",
		dialCode: "504"
	},
	{
		name: "Hong Kong",
		iso2: "hk",
		dialCode: "852",
		format: ".... ...."
	},
	{
		name: "Hungary",
		iso2: "hu",
		dialCode: "36"
	},
	{
		name: "Iceland",
		iso2: "is",
		dialCode: "354"
	},
	{
		name: "India",
		iso2: "in",
		dialCode: "91",
		format: "..... ....."
	},
	{
		name: "Indonesia",
		iso2: "id",
		dialCode: "62"
	},
	{
		name: "Iran",
		iso2: "ir",
		dialCode: "98"
	},
	{
		name: "Iraq",
		iso2: "iq",
		dialCode: "964"
	},
	{
		name: "Ireland",
		iso2: "ie",
		dialCode: "353"
	},
	{
		name: "Israel",
		iso2: "il",
		dialCode: "972"
	},
	{
		name: "Italy",
		iso2: "it",
		dialCode: "39",
		format: "... ... ...."
	},
	{
		name: "Jamaica",
		iso2: "jm",
		dialCode: "1"
	},
	{
		name: "Japan",
		iso2: "jp",
		dialCode: "81",
		format: ".. .... ...."
	},
	{
		name: "Jordan",
		iso2: "jo",
		dialCode: "962"
	},
	{
		name: "Kazakhstan",
		iso2: "kz",
		dialCode: "7"
	},
	{
		name: "Kenya",
		iso2: "ke",
		dialCode: "254"
	},
	{
		name: "Kuwait",
		iso2: "kw",
		dialCode: "965"
	},
	{
		name: "Kyrgyzstan",
		iso2: "kg",
		dialCode: "996"
	},
	{
		name: "Laos",
		iso2: "la",
		dialCode: "856"
	},
	{
		name: "Latvia",
		iso2: "lv",
		dialCode: "371"
	},
	{
		name: "Lebanon",
		iso2: "lb",
		dialCode: "961"
	},
	{
		name: "Libya",
		iso2: "ly",
		dialCode: "218"
	},
	{
		name: "Lithuania",
		iso2: "lt",
		dialCode: "370"
	},
	{
		name: "Luxembourg",
		iso2: "lu",
		dialCode: "352"
	},
	{
		name: "Macau",
		iso2: "mo",
		dialCode: "853"
	},
	{
		name: "Malaysia",
		iso2: "my",
		dialCode: "60"
	},
	{
		name: "Maldives",
		iso2: "mv",
		dialCode: "960"
	},
	{
		name: "Malta",
		iso2: "mt",
		dialCode: "356"
	},
	{
		name: "Mexico",
		iso2: "mx",
		dialCode: "52",
		format: "... ... ...."
	},
	{
		name: "Moldova",
		iso2: "md",
		dialCode: "373"
	},
	{
		name: "Mongolia",
		iso2: "mn",
		dialCode: "976"
	},
	{
		name: "Montenegro",
		iso2: "me",
		dialCode: "382"
	},
	{
		name: "Morocco",
		iso2: "ma",
		dialCode: "212"
	},
	{
		name: "Myanmar",
		iso2: "mm",
		dialCode: "95"
	},
	{
		name: "Nepal",
		iso2: "np",
		dialCode: "977"
	},
	{
		name: "Netherlands",
		iso2: "nl",
		dialCode: "31",
		format: ".. ........"
	},
	{
		name: "New Zealand",
		iso2: "nz",
		dialCode: "64"
	},
	{
		name: "Nicaragua",
		iso2: "ni",
		dialCode: "505"
	},
	{
		name: "Nigeria",
		iso2: "ng",
		dialCode: "234"
	},
	{
		name: "North Korea",
		iso2: "kp",
		dialCode: "850"
	},
	{
		name: "North Macedonia",
		iso2: "mk",
		dialCode: "389"
	},
	{
		name: "Norway",
		iso2: "no",
		dialCode: "47",
		format: "... .. ..."
	},
	{
		name: "Oman",
		iso2: "om",
		dialCode: "968"
	},
	{
		name: "Pakistan",
		iso2: "pk",
		dialCode: "92"
	},
	{
		name: "Palestine",
		iso2: "ps",
		dialCode: "970"
	},
	{
		name: "Panama",
		iso2: "pa",
		dialCode: "507"
	},
	{
		name: "Paraguay",
		iso2: "py",
		dialCode: "595"
	},
	{
		name: "Peru",
		iso2: "pe",
		dialCode: "51"
	},
	{
		name: "Philippines",
		iso2: "ph",
		dialCode: "63"
	},
	{
		name: "Poland",
		iso2: "pl",
		dialCode: "48"
	},
	{
		name: "Portugal",
		iso2: "pt",
		dialCode: "351"
	},
	{
		name: "Puerto Rico",
		iso2: "pr",
		dialCode: "1"
	},
	{
		name: "Qatar",
		iso2: "qa",
		dialCode: "974"
	},
	{
		name: "Romania",
		iso2: "ro",
		dialCode: "40"
	},
	{
		name: "Russia",
		iso2: "ru",
		dialCode: "7",
		format: "(...) ...-..-.."
	},
	{
		name: "Saudi Arabia",
		iso2: "sa",
		dialCode: "966"
	},
	{
		name: "Senegal",
		iso2: "sn",
		dialCode: "221"
	},
	{
		name: "Serbia",
		iso2: "rs",
		dialCode: "381"
	},
	{
		name: "Singapore",
		iso2: "sg",
		dialCode: "65",
		format: ".... ...."
	},
	{
		name: "Slovakia",
		iso2: "sk",
		dialCode: "421"
	},
	{
		name: "Slovenia",
		iso2: "si",
		dialCode: "386"
	},
	{
		name: "Somalia",
		iso2: "so",
		dialCode: "252"
	},
	{
		name: "South Africa",
		iso2: "za",
		dialCode: "27"
	},
	{
		name: "South Korea",
		iso2: "kr",
		dialCode: "82",
		format: ".. .... ...."
	},
	{
		name: "Spain",
		iso2: "es",
		dialCode: "34",
		format: "... ... ..."
	},
	{
		name: "Sri Lanka",
		iso2: "lk",
		dialCode: "94"
	},
	{
		name: "Sudan",
		iso2: "sd",
		dialCode: "249"
	},
	{
		name: "Sweden",
		iso2: "se",
		dialCode: "46"
	},
	{
		name: "Switzerland",
		iso2: "ch",
		dialCode: "41"
	},
	{
		name: "Syria",
		iso2: "sy",
		dialCode: "963"
	},
	{
		name: "Taiwan",
		iso2: "tw",
		dialCode: "886"
	},
	{
		name: "Tajikistan",
		iso2: "tj",
		dialCode: "992"
	},
	{
		name: "Tanzania",
		iso2: "tz",
		dialCode: "255"
	},
	{
		name: "Thailand",
		iso2: "th",
		dialCode: "66"
	},
	{
		name: "Tunisia",
		iso2: "tn",
		dialCode: "216"
	},
	{
		name: "Turkey",
		iso2: "tr",
		dialCode: "90",
		format: "... ... .. .."
	},
	{
		name: "Turkmenistan",
		iso2: "tm",
		dialCode: "993"
	},
	{
		name: "Uganda",
		iso2: "ug",
		dialCode: "256"
	},
	{
		name: "Ukraine",
		iso2: "ua",
		dialCode: "380"
	},
	{
		name: "United Arab Emirates",
		iso2: "ae",
		dialCode: "971"
	},
	{
		name: "United Kingdom",
		iso2: "gb",
		dialCode: "44",
		format: ".... ......"
	},
	{
		name: "United States",
		iso2: "us",
		dialCode: "1",
		format: "(...) ...-....."
	},
	{
		name: "Uruguay",
		iso2: "uy",
		dialCode: "598"
	},
	{
		name: "Uzbekistan",
		iso2: "uz",
		dialCode: "998"
	},
	{
		name: "Venezuela",
		iso2: "ve",
		dialCode: "58"
	},
	{
		name: "Vietnam",
		iso2: "vn",
		dialCode: "84"
	},
	{
		name: "Yemen",
		iso2: "ye",
		dialCode: "967"
	},
	{
		name: "Zambia",
		iso2: "zm",
		dialCode: "260"
	},
	{
		name: "Zimbabwe",
		iso2: "zw",
		dialCode: "263"
	}
].map((e) => ({
	...e,
	flag: v(e.iso2)
}));
function b(e) {
	return y.find((t) => t.iso2 === e.toLowerCase());
}
function x(e) {
	return y.find((t) => t.dialCode === e);
}
//#endregion
//#region src/composables/useCountryDetection.ts
var S = "https://ipapi.co/json/", C = "us";
async function w() {
	try {
		let e = new AbortController(), t = setTimeout(() => e.abort(), 5e3), n = await fetch(S, { signal: e.signal });
		if (clearTimeout(t), !n.ok) throw Error("IP lookup failed");
		return b(((await n.json()).country_code ?? "").toLowerCase()) ?? b(C);
	} catch {
		return b(C);
	}
}
function T(e) {
	if (!e) return y;
	let t = e.toLowerCase();
	return y.filter((e) => e.name.toLowerCase().includes(t) || e.dialCode.includes(t) || e.iso2.includes(t));
}
//#endregion
//#region src/composables/usePhoneValidation.ts
var E = 4, D = 15;
function O(e, t) {
	if (!t || !e) return e;
	let n = "", r = 0;
	for (let i of t) {
		if (r >= e.length) break;
		i === "." ? n += e[r++] : n += i;
	}
	return r < e.length && (n += e.slice(r)), n;
}
function k(e) {
	return e.replace(/\D/g, "");
}
function A(e, t) {
	let n = k(e), r = t?.dialCode ?? "", i = r && n.startsWith(r) ? n.slice(r.length) : n, a = r ? `+${r}${i}` : `+${n}`, o = t?.format ? O(i, t.format) : i, s = r.length + i.length;
	return {
		valid: i.length >= E && s <= D && /^\d+$/.test(i),
		formatted: o,
		e164: a,
		nationalNumber: i,
		country: t
	};
}
//#endregion
//#region src/PhoneInput.vue?vue&type=script&setup=true&lang.ts
var ie = ["tabindex", "onKeydown"], ae = { class: "vpi-flag" }, j = { class: "vpi-dial-code" }, oe = [
	"value",
	"placeholder",
	"disabled",
	"readonly"
], se = ["onKeydown"], ce = ["onClick", "onMouseenter"], M = { class: "vpi-flag" }, N = { class: "vpi-country-name" }, P = { class: "vpi-country-code" }, F = /* @__PURE__ */ s({
	__name: "PhoneInput",
	props: {
		modelValue: { default: "" },
		defaultCountry: { default: "us" },
		autoDetectCountry: {
			type: Boolean,
			default: !0
		},
		placeholder: { default: "Phone number" },
		disabled: {
			type: Boolean,
			default: !1
		},
		readonly: {
			type: Boolean,
			default: !1
		},
		showValidation: {
			type: Boolean,
			default: !0
		},
		preferredCountries: { default: () => [] }
	},
	emits: [
		"update:modelValue",
		"country-changed",
		"validate",
		"focus",
		"blur"
	],
	setup(s, { emit: v }) {
		let x = s, S = v, C = f(b(x.defaultCountry) ?? null), E = f(""), D = f(!1), F = f(!1), I = f(!1), L = f(""), R = f(0), z = f({}), B = f(), V = f(), H = f(), U = f(), W = f(), G = n(() => {
			let e = T(L.value);
			if (x.preferredCountries.length > 0) {
				let t = x.preferredCountries.map((e) => b(e)).filter(Boolean), n = e.filter((e) => !x.preferredCountries.includes(e.iso2));
				e = [...t, ...n];
			}
			return e;
		}), le = n(() => E.value ? C.value?.format ? O(E.value, C.value.format) : E.value : ""), K = n(() => A(E.value, C.value)), q = n(() => K.value.valid);
		function ue(e) {
			let t = e.target;
			E.value = k(t.value), J();
		}
		function de(e) {
			e.preventDefault();
			let t = e.clipboardData?.getData("text") ?? "", n = k(t);
			if (t.startsWith("+")) {
				let e = n;
				for (let t of y) if (e.startsWith(t.dialCode)) {
					C.value = t, E.value = e.slice(t.dialCode.length), S("country-changed", t), J();
					return;
				}
			}
			E.value = n, J();
		}
		function fe(e) {
			[
				"Backspace",
				"Delete",
				"Tab",
				"Escape",
				"Enter",
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown",
				"Home",
				"End"
			].includes(e.key) || (e.ctrlKey || e.metaKey) && [
				"a",
				"c",
				"v",
				"x"
			].includes(e.key.toLowerCase()) || /^\d$/.test(e.key) || e.preventDefault();
		}
		function pe() {
			D.value = !0, S("focus");
		}
		function me() {
			D.value = !1, F.value = !0, S("blur");
		}
		function J() {
			let e = K.value;
			S("update:modelValue", e.e164), S("validate", {
				valid: e.valid,
				e164: e.e164,
				nationalNumber: e.nationalNumber
			});
		}
		function Y() {
			x.disabled || (I.value = !I.value, I.value && (ve(), c(() => U.value?.focus())));
		}
		function X() {
			I.value = !1, L.value = "", R.value = 0;
		}
		function Z(e) {
			C.value = e, X(), S("country-changed", e), J(), c(() => B.value?.focus());
		}
		function he() {
			let e = G.value[R.value];
			e && Z(e);
		}
		function ge() {
			R.value < G.value.length - 1 && (R.value++, Q());
		}
		function _e() {
			R.value > 0 && (R.value--, Q());
		}
		function Q() {
			c(() => {
				(W.value?.children[R.value])?.scrollIntoView({ block: "nearest" });
			});
		}
		function ve() {
			let e = V.value?.getBoundingClientRect();
			if (!e) return;
			let t = window.innerHeight - e.bottom < 300;
			z.value = {
				position: "fixed",
				left: `${e.left}px`,
				width: "280px",
				zIndex: "9999",
				...t ? { bottom: `${window.innerHeight - e.top + 4}px` } : { top: `${e.bottom + 4}px` }
			};
		}
		function $(e) {
			I.value && H.value && !H.value.contains(e.target) && !V.value?.contains(e.target) && X();
		}
		function ye(e) {
			if (!e) return;
			let t = k(e);
			if (e.startsWith("+")) {
				for (let e of y) if (t.startsWith(e.dialCode)) {
					C.value = e, E.value = t.slice(e.dialCode.length);
					return;
				}
			}
			E.value = t;
		}
		return h(() => x.modelValue, (e) => {
			ye(e);
		}, { immediate: !0 }), h(() => x.defaultCountry, (e) => {
			let t = b(e);
			t && (C.value = t);
		}), u(async () => {
			document.addEventListener("click", $), x.autoDetectCountry && !x.modelValue && (C.value = await w());
		}), te(() => {
			document.removeEventListener("click", $);
		}), (n, c) => (d(), a("div", { class: l(["vpi-wrapper", {
			"vpi-focused": D.value,
			"vpi-invalid": !q.value && F.value,
			"vpi-disabled": s.disabled
		}]) }, [
			o("div", {
				class: "vpi-country",
				onClick: Y,
				ref_key: "countryBtnRef",
				ref: V,
				tabindex: s.disabled ? -1 : 0,
				onKeydown: [g(_(Y, ["prevent"]), ["enter"]), g(_(Y, ["prevent"]), ["space"])]
			}, [
				o("span", ae, m(C.value?.flag), 1),
				o("span", j, "+" + m(C.value?.dialCode), 1),
				c[1] ||= o("span", { class: "vpi-arrow" }, "▾", -1)
			], 40, ie),
			o("input", {
				ref_key: "inputRef",
				ref: B,
				type: "tel",
				value: le.value,
				placeholder: s.placeholder,
				disabled: s.disabled,
				readonly: s.readonly,
				class: "vpi-input",
				onInput: ue,
				onFocus: pe,
				onBlur: me,
				onPaste: de,
				onKeydown: fe
			}, null, 40, oe),
			F.value && s.showValidation ? (d(), a("span", {
				key: 0,
				class: l(["vpi-validation", q.value ? "vpi-valid" : "vpi-error"])
			}, m(q.value ? "✓" : "✗"), 3)) : i("", !0),
			(d(), r(t, { to: "body" }, [I.value ? (d(), a("div", {
				key: 0,
				class: "vpi-dropdown",
				ref_key: "dropdownRef",
				ref: H,
				style: ee(z.value)
			}, [re(o("input", {
				ref_key: "searchRef",
				ref: U,
				type: "text",
				class: "vpi-search",
				"onUpdate:modelValue": c[0] ||= (e) => L.value = e,
				placeholder: "Search country...",
				onKeydown: [
					g(X, ["escape"]),
					g(_(ge, ["prevent"]), ["down"]),
					g(_(_e, ["prevent"]), ["up"]),
					g(_(he, ["prevent"]), ["enter"])
				]
			}, null, 40, se), [[ne, L.value]]), o("ul", {
				class: "vpi-country-list",
				ref_key: "listRef",
				ref: W
			}, [(d(!0), a(e, null, p(G.value, (e, t) => (d(), a("li", {
				key: e.iso2,
				class: l(["vpi-country-item", { "vpi-highlighted": t === R.value }]),
				onClick: (t) => Z(e),
				onMouseenter: (e) => R.value = t
			}, [
				o("span", M, m(e.flag), 1),
				o("span", N, m(e.name), 1),
				o("span", P, "+" + m(e.dialCode), 1)
			], 42, ce))), 128))], 512)], 4)) : i("", !0)]))
		], 2));
	}
});
//#endregion
export { F as PhoneInput, y as countries, w as detectCountryFromIP, x as findCountryByDialCode, b as findCountryByIso2, O as formatPhoneNumber, T as searchCountries, k as stripNonDigits, A as validatePhone };
