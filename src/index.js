import './css/styles.css';
import { fetchCountries } from "./js/fetchCountries";
import debounce from "lodash.debounce"
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBoxEl = document.querySelector('#search-box')
const countryListEl = document.querySelector('.country-list')
const countryInfoEl = document.querySelector('.country-info')

function countryItemMarkup({flags, name}) {
    return `<li><img src="${flags.svg}" alt="Flag of ${name.official}" width='50px' style='margin-right:5px'>
    ${name.official}</li>`    
}

function countryCardMarkup({flags, name, population, languages, capital}) {
    return `<img src="${flags.svg}" alt="Flag of ${name.official}" width='100px'>
    <h1 style='display:inline; margin-left:20px'>${name.official}</h1>
    <ul>
      <li><b>Capital:</b> ${capital}</li>
      <li><b>Population:</b> ${population}</li>
      <li><b>Languages:</b> ${(Object.values(languages))}</li>
    </ul>`
}

function inputCheckFunction() {
    
if(searchBoxEl.value) {
    fetchCountries(searchBoxEl.value.trim())
    .then(countries => {
        
        if(countries.length <= 10 && countries.length > 2) {
            countryInfoEl.innerHTML = ''
            countryListEl.innerHTML = countries.map(country => {
            return countryItemMarkup(country); 
            })
            .join("")
            
        } else if(countries.length > 10) {
            Notify.info("Too many matches found. Please enter a more specific name.");
            countryListEl.innerHTML = ''
            countryInfoEl.innerHTML = ''
        } else if(countries.length === 1) {
            countryListEl.innerHTML = ''
            countryInfoEl.innerHTML = countryCardMarkup(countries[0])
            
        } 
    
    }).catch(error => {
        Notify.failure("Oops, there is no country with that name");
        countryListEl.innerHTML = ''
        countryInfoEl.innerHTML = ''
        })
} else {
        countryListEl.innerHTML = ''
        countryInfoEl.innerHTML = ''
    }

}

searchBoxEl.addEventListener('input', debounce(inputCheckFunction, DEBOUNCE_DELAY))