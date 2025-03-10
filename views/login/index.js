const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const form = document.querySelector('#form');
const errorText = document.querySelector('#error-text');

form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const user = {
            email: emailInput.value,
            password: passwordInput.value,
        };
        const userID = await axios.post('/api/login', user);
        const id = userID.data.id
        window.location.pathname = `/profile/${id}`;
    } catch (error) {
        errorText.innerHTML = error.response.data.error;
    }
});