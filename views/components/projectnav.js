import { createNotification } from "../../../components/notification.js";
export const projectnav = async (pathName, vdesktop, vmobile) => {
    const { data } = await axios.get(`/api/project/${pathName}`);
    const { title, isOwner, icon, artistic, image } = data;

    let srcImage = '';
    if (image !== '') {
        srcImage = `/storage/${userID}/${pathName}/${image}`;
    }
    
    if (isOwner) {
        vdesktop.innerHTML += `
            <button id="edit-project" class="text-white p-1 bg-[#b1b0b0ec] hover:bg-[#e3dedeec] transition ease-in-out rounded-lg">Editar
            </button>
            <a href="/addPublish/${pathName}">
                <p class="text-white p-1 hover:bg-[#dab0a1] transition ease-in-out rounded-lg bg-[#f97020ec] ring-4 ring-black px-2 py-1">Crear</p>
            </a>
        `;
        vmobile.innerHTML += `
            <button id="edit-project-mobile" class="text-white p-1 bg-[#b1b0b0ec] hover:bg-[#e3dedeec] transition ease-in-out rounded-lg">Editar
            </button>
            <a href="/addPublish/${pathName}">
                <p class="text-white p-1 hover:bg-[#dab0a1] transition ease-in-out rounded-lg bg-[#f97020ec] ring-4 ring-black px-2 py-1">Crear</p>
            </a>
        `;
        
        const formEdit = document.querySelector('#edit-project');
        const formEditMobile = document.querySelector('#edit-project-mobile');
        
        formEdit.addEventListener('click', async e => {
            e.preventDefault();
            const main = document.querySelector('#main');
            const iconText = icon.split('.')[0].charAt(0).toUpperCase() + icon.split('.')[0].slice(1);
            
            main.innerHTML = `
            <form id="form-add" class="flex flex-col gap-4 bg-black p-4 rounded-lg text-md shadow-2xl w-[250px] min-[400px]:w-[350px] min-[600px]:w-[500px] border-2 border-white">
            <div class="flex flex-col gap-2 w-full">
            <label for="title-input" class="font-bold">
            Nombre de la sección
            </label>
            <input 
            value="${title}"
            type="text" 
            id="title-input" 
            name="title-input" 
            autocomplete="off" 
            class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
            >
            </div>
            
            <div class="flex flex-col gap-2">
            <label for="icon-input" class="font-bold">
            Ícono
            </label>
            <select id="icon-input" class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
            <option value="${icon}" Selected>${iconText}</option>
            <option value="hojita.svg">Hojita</option>
            <option value="pino.svg">Pino</option>
            <option value="pincel.svg">Pincel</option>
            <option value="flor.svg">Flor</option>
            <option value="castillo.svg">Castillo</option>
            </select>
            </div>
            
            <div class="flex flex-col gap-2">
            <label for="artistic-input" class="font-bold">
            Expresión artística
            </label>
            <select id="artistic-input" class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
            <option value="${artistic}" Selected>${artistic}</option>
            <option value="Poesía">Poesía</option>
            <option value="Dibujo">Dibujo</option>
            <option value="Escultura">Escultura</option>
            <option value="Narrativa">Narrativa</option>
            <option value="Fotografía">Fotografía</option>
            <option value="Novela">Novela</option>
            <option value="Poemario">Poemario</option>
            <option value=""></option>
            </select>
            </div>
            
            <div 
            class="flex flex-col gap-2"
            >
            <label for="image-input" class="font-bold">
            Imagen
            </label>
            <input 
            type="file" 
            accept="image/*"
            id="image-input" 
            name="imageinput"
            class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700 cursor-pointer"
            >
            <img src="${srcImage}" 
            class="w-64 self-center bg-[#f97020ec] py-1 px-1 rounded-lg font-bold hover:bg-[#ff4800c2] cursor-pointer" alt="" 
            id="image-show"
            >
            <button id="delete-image"
            class="self-end text-red-600 hover:text-red-400 hidden"
            >
            Eliminar
            </button>
            </div>
            
            <div class="flex flex-raw gap-2 items-end py-2 self-end">
            <label for="public-input" class="font-bold">
            Eliminar proyecto
            </label>
            <button id="delete-project"
            type="button"
            class="self-end text-red-600 hover:text-red-400"
            >
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            stroke-width="8" 
            stroke="currentColor" 
            class="w-8 h-8 text-red cursor-pointer p-2 hover:bg-slate-900 mt-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>  
            </button>
            </div>
            
            <button 
            id="save-btn"
            class="bg-[#f97020ec] py-2 px-4 rounded-lg font-bold hover:bg-[#ff4800c2] text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
            >
            Guardar cambios
            </button>
            
            <button 
            id="cancel-btn"
            class="bg-red-600 py-2 px-4 rounded-lg font-bold hover:bg-red-500 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black w-2/3 mx-auto"
            >
            Cancelar
            </button>
            </form>
            `;
            
            const formAdd = document.querySelector('#form-add');
            const titleInput = document.querySelector('#title-input');
            const iconInput = document.querySelector('#icon-input');
            const artisticInput = document.querySelector('#artistic-input');
            const imageInput = document.querySelector('#image-input');
            const saveBtn = document.querySelector('#save-btn');
            const NAME_VALIDATION = /[\s\S]/;
            
            const imageShow = document.querySelector('#image-show');
            let imageLoaded = false;
            const deleteImage = document.querySelector('#delete-image');
            let imageDeleted = false;
            
            const deleteProject = document.querySelector('#delete-project');
            
            // Validations
            let nameValidation = false;
            const validation = (input, regexValidation) => {
                saveBtn.disabled = nameValidation ? false : true;
                
                if (input.value === '') {
                    input.classList.remove('focus:outline-slate-700', 'outline-green-700');
                    input.classList.add('outline-red-700', 'outline-2', 'outline');
                } else if (regexValidation) {
                    input.classList.remove('focus:outline-slate-700', 'outline-red-700');
                    input.classList.add('outline-green-700', 'outline-2', 'outline');
                } else {
                    input.classList.remove('focus:outline-slate-700', 'outline-green-700');
                    input.classList.add('outline-red-700', 'outline-2', 'outline');
                };
            };
            
            // Events
            titleInput.addEventListener('input', e => {
                nameValidation = NAME_VALIDATION.test(e.target.value);
                validation(titleInput, nameValidation);
            });
            
            if (image !== '') {
                deleteImage.classList.remove('hidden');
            };
            
            imageShow.addEventListener('click', () => imageInput.click());
            imageInput.addEventListener('change', async (file) => {
                imageShow.classList.add('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
                const fileUpload = file.target.files[0];
                if (fileUpload) {
                    const reader = new FileReader();
                    
                    reader.onload = async () => {
                        let output = imageShow;
                        output.src = reader.result;                
                    };
                    reader.readAsDataURL(fileUpload);
                    
                    deleteImage.classList.remove('hidden');
                    imageLoaded = true;
                    imageDeleted = false;
                };
            });
            
            deleteImage.addEventListener('click', () => {
                if (confirm('¿Desea eliminar la imagen seleccionada?')) {
                    imageShow.src = '';
                    imageShow.classList.remove('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
                    deleteImage.classList.add('hidden');
                    imageInput.value = '';
                    imageLoaded = false;
                    imageDeleted = true;
                }
            });
            
            deleteProject.addEventListener('click', async (e) => {
                let promptDelete = prompt('Si desea eliminar el proyecto actual, por favor escriba Eliminar.');
                try {
                    if (promptDelete === 'Eliminar') {
                        await axios.delete(`/api/project/${pathName}`);
                        textNotification = 'Proyecto eliminado exitosamente';
                        isNotificationTrue = false;
                        message(isNotificationTrue, textNotification);
                        setTimeout(() => window.location = window.location.origin, 1000);
                    } else {
                        textNotification = 'Proyecto no eliminado';
                        isNotificationTrue = true;
                        message(isNotificationTrue, textNotification);
                    }
                    
                } catch (error) {
                    console.log(error);
                    textNotification = 'No se pudo eliminar el proyecto';
                    isNotificationTrue = true;
                    message(isNotificationTrue, textNotification);
                    setTimeout(() => window.location.pathname, 2000);
                }
            });
            
            formAdd.addEventListener('submit', async e => {
                e.preventDefault();
                if (e.submitter.id === 'save-btn') {
                    try {
                        let imageFilename;
                        if (imageLoaded) {
                            imageFilename = await axios.patch(`/storage/project/${pathName}`, formAdd);
                            imageFilename = imageFilename.data;
                        }
                        
                        if (imageDeleted) {
                            imageFilename = await axios.patch(`/storage/deleteproject/${pathName}`, formEdit);
                        }
                        
                        const editProject = {
                            id: pathName,
                            title: titleInput.value,
                            icon: iconInput.value,
                            artistic: artisticInput.value
                        };
                        await axios.patch(`/api/project/${pathName}`, editProject);
                        
                        const notificationText = 'Sección editada correctamente';
                        createNotification(false, notificationText);
                        setTimeout(() => {
                            notification.innerHTML = '';
                        }, 2000);
                        
                        window.location.reload();
                    } catch (error) {
                        console.log(error);
                        createNotification(true, error.response.data.error);
                        setTimeout(() => {
                            notification.innerHTML = '';
                        }, 5000);
                    }
                }
                
                if (e.submitter.id === 'cancel-btn') {
                    const notificationText = 'Edición cancelada';
                    createNotification(true, notificationText);
                    setTimeout(() => {
                        notification.innerHTML = '';
                    }, 750);
                    setTimeout(() => {
                        window.location.reload();
                    }, 750);
                }
            });
        });

        formEditMobile.addEventListener('click', async e => {
            e.preventDefault();
            const main = document.querySelector('#main');
            const iconText = icon.split('.')[0].charAt(0).toUpperCase() + icon.split('.')[0].slice(1);
            
            main.innerHTML = `
            <form id="form-add" class="flex flex-col gap-4 bg-black p-4 rounded-lg text-md shadow-2xl w-[250px] min-[400px]:w-[350px] min-[600px]:w-[500px] border-2 border-white">
            <div class="flex flex-col gap-2 w-full">
            <label for="title-input" class="font-bold">
            Nombre de la sección
            </label>
            <input 
            value="${title}"
            type="text" 
            id="title-input" 
            name="title-input" 
            autocomplete="off" 
            class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
            >
            </div>
            
            <div class="flex flex-col gap-2">
            <label for="icon-input" class="font-bold">
            Ícono
            </label>
            <select id="icon-input" class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
            <option value="${icon}" Selected>${iconText}</option>
            <option value="hojita.svg">Hojita</option>
            <option value="pino.svg">Pino</option>
            <option value="pincel.svg">Pincel</option>
            <option value="flor.svg">Flor</option>
            <option value="castillo.svg">Castillo</option>
            </select>
            </div>
            
            <div class="flex flex-col gap-2">
            <label for="artistic-input" class="font-bold">
            Expresión artística
            </label>
            <select id="artistic-input" class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
            <option value="${artistic}" Selected>${artistic}</option>
            <option value="Poesía">Poesía</option>
            <option value="Dibujo">Dibujo</option>
            <option value="Escultura">Escultura</option>
            <option value="Narrativa">Narrativa</option>
            <option value="Fotografía">Fotografía</option>
            <option value="Novela">Novela</option>
            <option value="Poemario">Poemario</option>
            <option value=""></option>
            </select>
            </div>
            
            <div 
            class="flex flex-col gap-2"
            >
            <label for="image-input" class="font-bold">
            Imagen
            </label>
            <input 
            type="file" 
            accept="image/*"
            id="image-input" 
            name="imageinput"
            class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700 cursor-pointer"
            >
            <img src="${srcImage}" 
            class="w-64 self-center bg-[#f97020ec] py-1 px-1 rounded-lg font-bold hover:bg-[#ff4800c2] cursor-pointer" alt="" 
            id="image-show"
            >
            <button id="delete-image"
            class="self-end text-red-600 hover:text-red-400 hidden"
            >
            Eliminar
            </button>
            </div>
            
            <div class="flex flex-raw gap-2 items-end py-2 self-end">
            <label for="public-input" class="font-bold">
            Eliminar proyecto
            </label>
            <button id="delete-project"
            type="button"
            class="self-end text-red-600 hover:text-red-400"
            >
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            stroke-width="8" 
            stroke="currentColor" 
            class="w-8 h-8 text-red cursor-pointer p-2 hover:bg-slate-900 mt-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>  
            </button>
            </div>
            
            <button 
            id="save-btn"
            class="bg-[#f97020ec] py-2 px-4 rounded-lg font-bold hover:bg-[#ff4800c2] text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
            >
            Guardar cambios
            </button>
            
            <button 
            id="cancel-btn"
            class="bg-red-600 py-2 px-4 rounded-lg font-bold hover:bg-red-500 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black w-2/3 mx-auto"
            >
            Cancelar
            </button>
            </form>
            `;
            
            const formAdd = document.querySelector('#form-add');
            const titleInput = document.querySelector('#title-input');
            const iconInput = document.querySelector('#icon-input');
            const artisticInput = document.querySelector('#artistic-input');
            const imageInput = document.querySelector('#image-input');
            const saveBtn = document.querySelector('#save-btn');
            const NAME_VALIDATION = /[\s\S]/;
            
            const imageShow = document.querySelector('#image-show');
            let imageLoaded = false;
            const deleteImage = document.querySelector('#delete-image');
            let imageDeleted = false;
            
            const deleteProject = document.querySelector('#delete-project');
            
            // Validations
            let nameValidation = false;
            const validation = (input, regexValidation) => {
                saveBtn.disabled = nameValidation ? false : true;
                
                if (input.value === '') {
                    input.classList.remove('focus:outline-slate-700', 'outline-green-700');
                    input.classList.add('outline-red-700', 'outline-2', 'outline');
                } else if (regexValidation) {
                    input.classList.remove('focus:outline-slate-700', 'outline-red-700');
                    input.classList.add('outline-green-700', 'outline-2', 'outline');
                } else {
                    input.classList.remove('focus:outline-slate-700', 'outline-green-700');
                    input.classList.add('outline-red-700', 'outline-2', 'outline');
                };
            };
            
            // Events
            titleInput.addEventListener('input', e => {
                nameValidation = NAME_VALIDATION.test(e.target.value);
                validation(titleInput, nameValidation);
            });
            
            if (image !== '') {
                deleteImage.classList.remove('hidden');
            };
            
            imageShow.addEventListener('click', () => imageInput.click());
            imageInput.addEventListener('change', async (file) => {
                imageShow.classList.add('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
                const fileUpload = file.target.files[0];
                if (fileUpload) {
                    const reader = new FileReader();
                    
                    reader.onload = async () => {
                        let output = imageShow;
                        output.src = reader.result;                
                    };
                    reader.readAsDataURL(fileUpload);
                    
                    deleteImage.classList.remove('hidden');
                    imageLoaded = true;
                    imageDeleted = false;
                };
            });
            
            deleteImage.addEventListener('click', () => {
                if (confirm('¿Desea eliminar la imagen seleccionada?')) {
                    imageShow.src = '';
                    imageShow.classList.remove('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
                    deleteImage.classList.add('hidden');
                    imageInput.value = '';
                    imageLoaded = false;
                    imageDeleted = true;
                }
            });
            
            deleteProject.addEventListener('click', async (e) => {
                let promptDelete = prompt('Si desea eliminar el proyecto actual, por favor escriba Eliminar.');
                try {
                    if (promptDelete === 'Eliminar') {
                        await axios.delete(`/api/project/${pathName}`);
                        textNotification = 'Proyecto eliminado exitosamente';
                        isNotificationTrue = false;
                        message(isNotificationTrue, textNotification);
                        setTimeout(() => window.location = window.location.origin, 1000);
                    } else {
                        textNotification = 'Proyecto no eliminado';
                        isNotificationTrue = true;
                        message(isNotificationTrue, textNotification);
                    }
                    
                } catch (error) {
                    console.log(error);
                    textNotification = 'No se pudo eliminar el proyecto';
                    isNotificationTrue = true;
                    message(isNotificationTrue, textNotification);
                    setTimeout(() => window.location.pathname, 2000);
                }
            });
            
            formAdd.addEventListener('submit', async e => {
                e.preventDefault();
                if (e.submitter.id === 'save-btn') {
                    try {
                        let imageFilename;
                        if (imageLoaded) {
                            imageFilename = await axios.patch(`/storage/project/${pathName}`, formAdd);
                            imageFilename = imageFilename.data;
                        }
                        
                        if (imageDeleted) {
                            imageFilename = await axios.patch(`/storage/deleteproject/${pathName}`, formEditMobile);
                        }
                        
                        const editProject = {
                            id: pathName,
                            title: titleInput.value,
                            icon: iconInput.value,
                            artistic: artisticInput.value
                        };
                        await axios.patch(`/api/project/${pathName}`, editProject);
                        
                        const notificationText = 'Sección editada correctamente';
                        createNotification(false, notificationText);
                        setTimeout(() => {
                            notification.innerHTML = '';
                        }, 2000);
                        
                        window.location.reload();
                    } catch (error) {
                        console.log(error);
                        createNotification(true, error.response.data.error);
                        setTimeout(() => {
                            notification.innerHTML = '';
                        }, 5000);
                    }
                }
                
                if (e.submitter.id === 'cancel-btn') {
                    const notificationText = 'Edición cancelada';
                    createNotification(true, notificationText);
                    setTimeout(() => {
                        notification.innerHTML = '';
                    }, 750);
                    setTimeout(() => {
                        window.location.reload();
                    }, 750);
                }
            });
        });
    };
};
