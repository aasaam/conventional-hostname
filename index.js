/**
 * @param {String} key
 * @param {any} [defaultValue]
 * @returns {any}
 */
const getState = (key, defaultValue = undefined) => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return defaultValue;
};

/**
 * @param {String} key
 * @param {any} value
 */
const setState = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 *
 * @param {String} str
 * @returns {String}
 */
const sanitize = (str) => {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

// const parameters = {
//   c: "Country",
//   p: "Provider",
//   i: "ProviderID",
//   d: "DataCenter",
//   t: "Type",
//   r: "Rack",
//   u: "Unit",
//   a: "Application",
// };

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const countryNameFormatter = new Intl.DisplayNames("en", {
  type: "region",
});

const countryList = [];

window.countries.forEach((code) => {
  countryList.push({
    key: code,
    value: `${getFlagEmoji(code)} ${countryNameFormatter.of(code)}(${code})`,
  });
});

new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    snackbar: false,
    Countries: countryList,
    Types: [
      {
        key: "bm",
        value: "Bare Metal",
      },
      {
        key: "vhs",
        value: "Virtual Machines Host(kvm)",
      },
      {
        key: "vir",
        value: "Virtual Machine",
      },
      {
        key: "cl",
        value: "Cloud",
      },
    ],
    GeneratedHostName: undefined,
    GenerateForm: undefined,

    Country: getState("Country", "IR"),
    Provider: getState("Provider", "Example"),
    ProviderList: window.ProviderList,
    ProviderID: getState("ProviderID", "2022"),
    DataCenter: getState("DataCenter"),
    Type: getState("Type", "bm"),
    Rack: getState("Rack"),
    Unit: getState("Unit"),
    Application: getState("Application", ["misc"]),
  },
  mounted() {
    document.querySelector("#app").style.display = "block";
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.GeneratedHostName);
      this.snackbar = true;
    },
    async generate() {
      const isValid = this.$refs.GenerateForm.validate();
      if (!isValid) {
        return;
      }
      const GeneratedHostName = [
        this.Country.toLowerCase(),
        `${sanitize(this.DataCenter)}-${sanitize(this.Type)}-${sanitize(
          this.Provider
        )}-${sanitize(this.ProviderID)}`,
      ];
      if (this.Rack) {
        GeneratedHostName.push(`r-${sanitize(this.Rack)}`);
      }
      if (this.Unit) {
        GeneratedHostName.push(`u-${sanitize(this.Unit)}`);
      }
      if (this.Application.length) {
        GeneratedHostName.push(
          `a-${this.Application.map((i) => sanitize(i))
            .filter((i) => i.length)
            .join("-")}`
        );
      }

      this.GeneratedHostName = GeneratedHostName.join("-");
    },
  },
  watch: {
    Country(v) {
      setState("Country", v);
    },
    Provider(v) {
      setState("Provider", v);
    },
    ProviderID(v) {
      setState("ProviderID", v);
    },
    DataCenter(v) {
      setState("DataCenter", v);
    },
    Type(v) {
      setState("Type", v);
    },
    Rack(v) {
      setState("Rack", v);
    },
    Unit(v) {
      setState("Unit", v);
    },
    Application(v) {
      setState("Application", v);
    },
  },
});
