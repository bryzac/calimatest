import { createNotification } from "../../components/notification.js";
const users = document.querySelector('#users');
const notification = document.querySelector('#notification');

let textNotification = '';
let isNotificationTrue = '';
const message = (bool, text) => {
    createNotification(bool, text);
    setTimeout(() => {
        notification.innerHTML = '';
    }, 2000);
};

(async () => {
    try {        
        const { data } = await axios.get('/api/admin/');
        data.usersMap.forEach(user => {

            const id = user[0]._id;
            const name = user[0].name;
            const rol = user[0].rol;
            const email = user[0].email;
            const phone = user[0].phone;
            const verified = user[0].verified;

            const div = document.createElement("div");
            div.id = id;
            div.classList.add('w-full', 'justify-self-center', 'flex', 'md:flex-nowrap', 'flex-wrap', 'items-center', 'justify-around', 'gap-4', 'my-0', 'mx-auto', 'no-underline', 'pb-[13px]', 'pt-[10px]', 'px-[20px]', 'rounded-[24px]', 'transition', 'duration-300', 'border-[4px]', 'border-[#f97020ec]', 'bg-black');
            
            function addUser(id, name, rol, email, phone, verified, div) {                            

                div.innerHTML = `
                    <div class="grid text-center w-full gap-1">
                        <h1 class="font-bold text-2xl p-4">${name}</h1>
                        <p class="px-4 text-left text-ellipsis whitespace-nowrap overflow-hidden"><strong>Rol: </strong> ${rol}</p>
                        <p class="px-4 text-left text-ellipsis whitespace-nowrap overflow-hidden"><strong>Email: </strong> ${email}</p>
                        <p class="px-4 text-left text-ellipsis whitespace-nowrap overflow-hidden"><strong>Celular: </strong> ${phone}</p>
                        <p class="px-4 text-left text-ellipsis whitespace-nowrap overflow-hidden"><strong>Verificado: </strong> ${verified}</p>
                        <form id="form-${id}" class="flex justify-self-end justify-end w-full">
                            <button 
                                id="edit-btn-${id}"
                                class="bg-[#f97020ec] py-2 px-4 rounded-lg font-bold hover:bg-[#ff4800c2] text-center transition ease-in-out disabled:opacity-50"
                            >
                                Editar perfil
                            </button>
                        </form>
                    </div>
                `;
                return div;
            };
            users.append(addUser(id, name, rol, email, phone, verified, div));

            function addEdit(id, name, rol, email, phone, verified, div) {                            
                const form = document.querySelector(`#form-${id}`);
                form.addEventListener('submit', async e => {
                    e.preventDefault();

                    div.innerHTML = `
                    <!-- Versión de edición -->
                    <form id="form-edit-${id}" class="grid text-center w-full gap-2" enctype="multipart/form-data" method="post">
                        <h1 class="font-bold text-2xl p-4">${name}</h1>

                        <div class="flex flex-col items-left gap-2 w-full text-start pt-2">
                            <label for="rol-input-${id}" class="font-bold align-middle">
                                Rol: 
                            </label>
                            <select id="rol-input-${id}" class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
                                <option value="${rol}" Selected disabled>${rol}</option>
                                <option value="Visitante">Visitante</option>
                                <option value="Habitante">Habitante</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div class="flex flex-col items-left gap-2 w-full text-start pt-2">
                            <label for="email-input-${id}" class="font-bold align-middle">
                                Email: 
                            </label>
                            <input 
                                type="email" 
                                id="email-input-${id}" 
                                name="email-input-${id}" 
                                autocomplete="off" 
                                placeholder="${email}"
                                value="${email}"
                                class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                            >
                        </div>

                        <div class="flex flex-col items-left gap-2 w-full text-start pt-2">
                            <label for="phone-input-${id}" class="font-bold align-middle">
                                Celular: 
                            </label>
            
                            <div class="flex gap-1">
                                <label for="phone-input" class="font-bold text-white rounded-lg py-1">
                                    +
                                </label>
                                <input 
                                    type="" 
                                    id="phone-input-${id}" 
                                    name="phone-input-${id}" 
                                    autocomplete="off" 
                                    placeholder="${phone.split('+')[1]}}"
                                    value="${phone.split('+')[1]}"
                                    class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                                >
                            </div>
                        </div>

                        <div class="flex flex-col items-left gap-2 w-full text-start pt-2 pb-2">
                            <label for="verified-input-${id}" class="font-bold align-middle">
                                Verificado: 
                            </label>
                            <select id="verified-input-${id}" class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
                                <option value="${verified}" Selected disabled>${verified}</option>
                                <option value="true">true</option>
                            </select>
                        </div>
                        
                        <!-- Botones -->
                        <button 
                            id="save-btn-${id}"
                            class="bg-[#f97020ec] my-1 py-2 px-4 rounded-lg font-bold hover:bg-[#ff4800c2] text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black w-2/3 mx-auto"
                        >
                            Guardar cambios
                        </button>
                        
                        <button 
                            id="cancel-btn-${id}"
                            class="bg-red-600 my-1 py-2 px-4 rounded-lg font-bold hover:bg-red-500 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black w-1/3 mx-auto"
                        >
                            Cancelar
                        </button>
                    </form>
                    `;

                    const formEdit = document.querySelector(`#form-edit-${id}`);
                    const rolInput = document.querySelector(`#rol-input-${id}`);
                    const emailInput = document.querySelector(`#email-input-${id}`);
                    const phoneInput = document.querySelector(`#phone-input-${id}`);
                    const verifiedInput = document.querySelector(`#verified-input-${id}`);
                    const saveBtn = document.querySelector(`#save-btn-${id}`);
                    
                    // Regex Validations
                    const EMAIL_VALIDATION = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                    const PHONE_VALIDATION = /^[0-9]{8,16}$/;

                    // Validations
                    let emailValidation = true;
                    let phoneValidation = true;

                    const validation = (input, regexValidation) => {
                        saveBtn.disabled = emailValidation && phoneValidation ? false : true;
                        
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
                    emailInput.addEventListener('input', e => {
                        emailValidation = EMAIL_VALIDATION.test(e.target.value);
                        validation(emailInput, emailValidation);
                    });
                    phoneInput.addEventListener('input', e => {
                        phoneValidation = PHONE_VALIDATION.test(e.target.value);
                        validation(phoneInput, phoneValidation);
                    });

                    formEdit.addEventListener('submit', async e => {
                        e.preventDefault();
                        if (e.submitter.id === `save-btn-${id}`) {
                            try {
                                await axios.patch(`/api/admin/`, {
                                    id: id,
                                    rol: rolInput.value,
                                    email: emailInput.value,
                                    phone: '+' + phoneInput.value,
                                    verified: verifiedInput.value,
                                });

                                textNotification = 'Usuario actualizado';
                                isNotificationTrue = false;
                                message(isNotificationTrue, textNotification);
                                
                                const divEdit = document.getElementById(id);
                                addUser(id, name, rolInput.value, emailInput.value, phoneInput.value, verifiedInput.value, divEdit);
                                addEdit(id, name, rolInput.value, emailInput.value, phoneInput.value, verifiedInput.value, divEdit);

                                setTimeout(() => window.location.reload(), 1500);
                            } catch (error) {
                                console.log(error);
                            };
                        };

                        if (e.submitter.id === `cancel-btn-${id}`) {
                            e.preventDefault();
                            textNotification = 'Usuario no modificado';
                            isNotificationTrue = true;
                            message(isNotificationTrue, textNotification);

                            const divCancel = document.getElementById(id);
                            addUser(id, name, rol, email, phone, verified, divCancel);
                            addEdit(id, name, rol, email, phone, verified, divCancel);
                        };
                    });
                });
            };
            addEdit(id, name, rol, email, phone, verified, div);
            
        });
        users.addEventListener('submit', async e => {
            e.preventDefault();
        });
    } catch (error) {
        textNotification = 'No posees permisos de administrador';
        isNotificationTrue = true;
        message(isNotificationTrue, textNotification);
        setTimeout(() => window.location.pathname = '/', 2000);
    }
})();