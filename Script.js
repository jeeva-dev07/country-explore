const countriesContainer = document.getElementById("countries-container");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("region-filter");
const detailView = document.getElementById("country-detail");

let countries = [];
let filteredCountries = [];

async function fetchCountries() {
    countriesContainer.innerHTML = "<h2 class='loading'>Fetching countries...</h2>";

    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,population,area,languages,currencies,cca3"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }

        countries = await response.json();

        countries.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

        filteredCountries = countries;
        displayCountries(filteredCountries);

    } catch (error) {
        countriesContainer.innerHTML =
            "<h2 class='error'>Failed to load countries. Please try again.</h2>";
        console.error(error);
    }
}

function displayCountries(countryList) {
    countriesContainer.innerHTML = "";

    if (countryList.length === 0) {
        countriesContainer.innerHTML = "<h2>No countries found</h2>";
        return;
    }

    countryList.forEach(country => {
        const card = document.createElement("div");
        card.classList.add("country-card");

        const flagSrc = country.flags?.svg || country.flags?.png || "https://via.placeholder.com/150";
        const populationFormatted = country.population ? country.population.toLocaleString() : "0";

        card.innerHTML = `
            <img src="${flagSrc}" alt="${country.name.common}">
            <div class="card-content">
                <h3>${country.name.common}</h3>
                <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
                <p><strong>Region:</strong> ${country.region || "N/A"}</p>
                <p><strong>Population:</strong> ${populationFormatted}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            showCountryDetails(country);
        });

        countriesContainer.appendChild(card);
    });
}

function filterCountries() {
    const searchText = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;

    filteredCountries = countries.filter(country => {
        const matchesSearch =
            country.name.common.toLowerCase().includes(searchText);

        const matchesRegion =
            selectedRegion === "All" ||
            country.region === selectedRegion;

        return matchesSearch && matchesRegion;
    });

    displayCountries(filteredCountries);
}

function showCountryDetails(country) {
    const languages = country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A";

    const currencies = country.currencies
        ? Object.values(country.currencies)
              .map(currency => currency.name)
              .join(", ")
        : "N/A";

    const flagSrc = country.flags?.svg || country.flags?.png || "https://via.placeholder.com/150";
    const areaFormatted = country.area ? country.area.toLocaleString() : "N/A";
    const populationFormatted = country.population ? country.population.toLocaleString() : "0";

    detailView.innerHTML = `
        <button id="back-btn">← Back</button>

        <div class="detail-card">
            <img src="${flagSrc}" alt="${country.name.common}">

            <h2>${country.name.official}</h2>

            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>

            <p><strong>Region:</strong> ${country.region}</p>

            <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>

            <p><strong>Population:</strong> ${populationFormatted}</p>

            <p><strong>Area:</strong> ${areaFormatted} km²</p>

            <p><strong>Languages:</strong> ${languages}</p>

            <p><strong>Currencies:</strong> ${currencies}</p>
        </div>
    `;

    countriesContainer.style.display = "none";
    detailView.style.display = "block";

    document
        .getElementById("back-btn")
        .addEventListener("click", () => {
            detailView.style.display = "none";
            countriesContainer.style.display = "grid";
        });
}

searchInput.addEventListener("input", filterCountries);
regionFilter.addEventListener("change", filterCountries);

fetchCountries();
