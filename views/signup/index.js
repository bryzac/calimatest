import { createNotification } from "../components/notification.js";

const form = document.querySelector('#form');
const nameInput = document.querySelector('#name-input');
const emailInput = document.querySelector('#email-input');
const countryInput = document.querySelector('#country-input');
const phoneCode = document.querySelector('#phone-code');
const phoneInput = document.querySelector('#phone-input');
const nicknameInput = document.querySelector('#nickname-input');
const iconInput = document.querySelector('#icon-input');
const passwordInput = document.querySelector('#password-input');
const matchInput = document.querySelector('#match-input');
const formBtn = document.querySelector('#form-btn');
const notification = document.querySelector('#notification');


// Regex Validations
const NAME_VALIDATION = /^[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]+(\s*[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]*)+(\s*[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]*)?$/;
const EMAIL_VALIDATION = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PHONE_VALIDATION = /^[0-9]{6,16}$/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/;


// Validations
let nameValidation = false;
let emailValidation = false;
let phoneValidation = false;
let iconValidation = false;
let passwordValidation = false;
let matchValidation = false;
let countryValidation = false;


const validation = (input, regexValidation) => {
    formBtn.disabled = nameValidation && emailValidation && phoneValidation && iconValidation && passwordValidation && matchValidation && countryValidation ? false : true;

    if (input.value === '') {
        input.classList.remove('outline-red-700', 'outline-green-700', 'outline-2', 'outline');
        input.classList.add('focus:outline-slate-700');
    } else if (regexValidation) {
        input.classList.remove('focus:outline-slate-700', 'outline-red-700');
        input.classList.add('outline-green-700', 'outline-2', 'outline');
    } else {
        input.classList.remove('focus:outline-slate-700', 'outline-green-700');
        input.classList.add('outline-red-700', 'outline-2', 'outline');
    };
};


// Events
[...countryInput].forEach(option =>{
    option.innerHTML = option.innerHTML.split('(')[0];
});

nameInput.addEventListener('input', e => {
    nameValidation = NAME_VALIDATION.test(e.target.value);
    validation(nameInput, nameValidation);
});

emailInput.addEventListener('input', e => {
    emailValidation = EMAIL_VALIDATION.test(e.target.value);
    validation(emailInput, emailValidation);
});

phoneInput.addEventListener('input', e => {
    phoneValidation = PHONE_VALIDATION.test(e.target.value);
    validation(phoneInput, phoneValidation);
});

passwordInput.addEventListener('input', e => {
    passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
    matchValidation = e.target.value === matchInput.value;
    validation(passwordInput, passwordValidation);
    validation(matchInput, matchValidation);
});

matchInput.addEventListener('input', e => {
    matchValidation = e.target.value === passwordInput.value;
    validation(matchInput, matchValidation);
});


let optionSelected;
countryInput.addEventListener('input', e => {
    optionSelected = [...e.target.children].find(option => option.selected);
    phoneCode.innerHTML = `+${optionSelected.value}`;
    countryValidation = optionSelected.value === '' ? false : true;
    optionSelected = optionSelected.textContent;
    validation(countryInput, countryValidation);
});

iconInput.addEventListener('input', e => {
    const optionSelected = [...e.target.children].find(option => option.selected);
    iconValidation = optionSelected.value;
    validation(iconInput, iconValidation);
});


const getCountry = async () => {

    try {
        const infoCountry = await fetch('https://api.geoapify.com/v1/ipinfo?&apiKey=d3395b8f82e34adfb4b244970fd3d09d', {method: 'GET'});
        const infoCountryJSon = await infoCountry.json();
        const isoCode = infoCountryJSon.country.iso_code;
        const country = [...countryInput.children].find(element => element.getAttribute('data-countryCode') === isoCode);
        country.selected = true;
        phoneCode.innerHTML = `+${country.value}`;
        countryValidation = true;
    } catch (error) {
        console.log(error);
    } 
};
getCountry();


form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const country = [...countryInput.children].find(option => option.selected);
        const newUser = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneCode.innerHTML + phoneInput.value,
            nickname: nicknameInput.value,
            country: country.textContent,
            icon: iconInput.value,
            password: passwordInput.value,
        }
        const { data } = await axios.post('/api/users', newUser);
        
        createNotification(false, data[0]);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 5000);

        const instagram = '';
        const twitter = '';
        const linktr = '';
        const allmylinks = '';
        const whatsapp = '';
        const telegram = '';
        const facebookUrl = '';
        const facebook = '';
        const youtubeUrl = '';
        const youtube = '';
        const linkedInUrl = '';
        const linkedIn = '';
        const newContact = {
            instagram: instagram,
            twitter: twitter,
            linktr: linktr,
            allmylinks: allmylinks,
            whatsapp: whatsapp,
            telegram: telegram,
            facebookUrl: facebookUrl,
            facebook: facebook,
            youtubeUrl: youtubeUrl,
            youtube: youtube,
            linkedInUrl: linkedInUrl,
            linkedIn: linkedIn,
        };
        //Se crea la sección de contactos
        await axios.post(`/api/users/contact/${data[1].id}`, newContact);

        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        nicknameInput.value = '';
        countryInput.value = '';
        iconInput.value = '';
        passwordInput.value = '';
        matchInput.value = '';
        validation(nameInput,false);
        validation(emailInput,false);
        validation(phoneInput,false);
        validation(iconInput,false);
        validation(passwordInput,false);
        validation(matchInput,false);

    } catch (error) {
        console.log(error);
        createNotification(true, error.response.data.error);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 5000);
    };
});