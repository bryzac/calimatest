import { createNotification } from "../../../components/notification.js";
const form = document.querySelector('form');
const titleHtml = document.querySelector('title');
const notification = document.querySelector('#notification');

let textNotification = '';
let isNotificationTrue = '';
const message = (bool, text) => {
    createNotification(bool, text);
    setTimeout(() => {
        notification.innerHTML = '';
    }, 2000);
};

const comentarios = ((commentArray, comment, id, logged, rol, userID, isOwner) => {
        if (commentArray.includes(comment.id)) {
            const commentId = comment.id;
            const commentText = comment.text;
            const commentIsAsk = comment.isAsk;
            const commentName = comment.name;
            const commentAskTo = comment.askTo;
            const commentAskName = comment.askName;
            const commentAskText = comment.askText;
            const commentUser = comment.user;

            let menuComment = '';
            console.log(userID, commentUser)
            console.log(rol)
            console.log(isOwner)

            if (rol === 'Admin' || userID === commentUser || isOwner === 'true') {
                console.log('arepa')
                menuComment = `
                    <button class="text-xs hover:text-[#f97020ec]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: scaleY(-1);msFilter:progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1);"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                    </button>
                `;
            };
            
            let ask = '';
            if (commentIsAsk) {
                ask = `
                <p id="${commentAskTo}" class="px-1 text-sm text-left self-start text-gray-50 text-opacity-60" style="background: radial-gradient(#1f276b, #191e4d00);"><em class="text-white font-bold">${commentAskName}: </em><em>${commentAskText}</em></p>
                `;
            };

            let toAsk = '';
            if (logged) {
                toAsk = `
                <div class="w-full flex justify-end gap-2">
                    <button class="text-gray-50 text-opacity-90 text-xs text-left flex self-end underline hover:text-white">Responder</button>
                    ${menuComment}
                </div>
                `;
            };

            const divComments = document.querySelector(`#comments-${id}`);
            const commentDiv = document.createElement('div');
            commentDiv.id = `comment-${commentId}`;
            commentDiv.classList.add('p-2', 'flex', 'flex-col', 'self-center', 'items-center', 'mx-auto', 'left-0', 'right-0', 'w-full');

            commentDiv.innerHTML = `
            ${ask}
            <p id="comment-content-${commentId}" class="text-left self-start text-gray-50 text-opacity-80"><em class="text-white font-bold">${commentName}: </em>${commentText}</p>
            ${toAsk}

            `;
            divComments.append(commentDiv);
    
        };
});


const styleForImage = 'border-radius:50%; -webkit-border-radius:50%; box-shadow: 0px 0px 5px 5px #ec731e; -webkit-box-shadow: 0px 0px 5px 5px #ec731e;';
const classForImage = 'w-[150px] m-0 justify-self-center aspect-square object-cover';
const classForDiv = `w-[150px] h-[200px] justify-self-center grid gap-0 my-0 mx-auto no-underline bg-[#f97020ec] pb-[13px] pt-[10px] px-[20px] rounded-[24px] transition duration-300 hover:bg-[#ff4800c2]`;

(async () => {
    try {
        const pathName = window.location.pathname.split('/')[2];
        const { data } = await axios.get(`/api/project/${pathName}`);
        const { title, publishs, isOwner, comments, logged, icon, artistic, image, userID, rol } = data;
        
        let srcImage = '';
        if (image !== '') {
            srcImage = `/storage/${userID}/${pathName}/${image}`;
        }

        titleHtml.innerHTML = `${title}`;

        if (isOwner) {
            const addPublish = document.querySelector('#addPublish');
            
            addPublish.innerHTML = `
                <form id="form-edit">
                    <button class="fixed top-[70%] right-[20px] bg-[#747373ec] py-2 px-[16px] rounded-[24px] text-lg font-bold border-[4px] border-white transition duration-300 hover:bg-[#b1b0b0ec] ring-4 ring-black">Editar
                    </button>
                    <a href="/addPublish/${pathName}">
                        <p class="fixed top-[80%] right-[20px] bg-[#f97020ec] py-8 px-[20px] rounded-[24px] text-lg font-bold border-[4px] border-white transition duration-300 hover:bg-[#dab0a1] ring-4 ring-black">Crear</p>
                    </a>
                </form>
            `;

            const formEdit = document.querySelector('#form-edit');
            
            formEdit.addEventListener('submit', async e => {
                e.preventDefault();
                const main = document.querySelector('#main');
                const iconText = icon.split('.')[0].charAt(0).toUpperCase() + icon.split('.')[0].slice(1);

                formEdit.innerHTML = '';
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
                            console.log(window.location.origin)
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
        };

        if (publishs[0]) {
            publishs.forEach(publish => {
                const id = publish.id;
                let title = publish.title;
                let dedicatory = publish.dedicatory;
                let epigraph = publish.epigraph;
                let epigraphBy = publish.epigraphBy;
                let text = publish.text;
                let date = publish.date;
                let additional = publish.additional;
                let nominations = publish.nominations;
                let awards = publish.awards;
                let link = publish.link;
                
                const isPublic = publish.ispublic;
                const commentArray = publish.comment;
                
                let image = publish.image;
                let file = publish.file;


                let inputComment = '';
                if (logged) {
                    inputComment = `
                    <input 
                        type="text" 
                        id="comment-input-${id}" 
                        name="comment-input" 
                        autocomplete="off" 
                        placeholder="Comentar..."
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700 w-[90%]"
                    >
                    <button class="text-gray-50 text-opacity-100 text-sm text-left flex self-end bg-[#f97020ec] p-1 rounded-[24px] font-bold transition duration-300 hover:bg-[#dab0a1]">Comentar</button>
                    `;
                };

                if (image) {
                    image = `<img 
                        id="image${id}"
                        src="/storage/${userID}/${pathName}/${id}/${image}" 
                        style="${styleForImage}" 
                        class="${classForImage}">
                    `;
                }
                if (title) {
                    title = `<h1 id="title${id}" class="font-bold text-lg pt-2">${title}</h1>`;
                }
                if (dedicatory) {
                    dedicatory = `<p id="dedicatory${id}" class="py-0 text-sm text-right hidden"><em>${dedicatory}</em></p>`;
                }
                if (epigraph) {
                    epigraph = `<p id="epigraph${id}" class="py-0 text-sm text-right hidden"><em>${epigraph}</em></p>`;
                }
                if (epigraphBy) {
                    epigraphBy = `<p id="epigraphBy${id}" class="py-0 text-sm text-right hidden"><b>- ${epigraphBy}</b></p>`;
                }
                if (text) {
                    text = `<p id="text${id}" class="p-4 whitespace-pre hidden">${text}</p>`;
                }
                if (additional) {
                    additional = `<p id="additional${id}" class="py-0 text-sm text-right hidden"><em>${additional}</em></p>`;
                }
                if (date) {
                    date = `<p id="date${id}" class="py-0 text-sm text-left text-opacity-70 text-gray-50 hidden">${date}</p>`;
                }
                if (nominations) {
                    nominations = `<p id="nominations${id}" class="py-0 text-sm text-left text-opacity-70 text-gray-50 hidden">Nominaciones: ${nominations}</p>`;
                }
                if (awards) {
                    awards = `<p id="awards${id}" class="py-0 text-sm text-left text-opacity-70 text-gray-50 hidden">Premios: ${awards}</p>`;
                }
                if (link) {
                    link = `<p id="link${id}" class="pt-0 pb-4 text-sm text-left hidden">Puedes ingresar a: <a href="${link}"><u>${link}</u></a></p>`;
                }
                if (file) {
                    file = `<p 
                        id="file${id}" 
                        class="pt-8 pb-2 text-xs text-left hidden text-[#f97020ec] hover:text-[#dab0a1]">
                        <a href="/storage/${userID}/${pathName}/${id}/${file}" target="_blank">${file}</a>
                    </p>
                    <embed src="/storage/${userID}/${pathName}/${id}/${file}#toolbar=1" 
                        id="fileShow${id}" 
                        class="w-full h-[30rem] self-center hidden"
                    >`;
                }

                const div = document.createElement('div');
                if (isOwner || isPublic) {
                    div.id = id;
                    div.classList = classForDiv;
                    div.innerHTML = `
                    <button id="btn${id}" class="grid justify-center">
                        ${image}
                        ${title}
                        ${dedicatory}
                        ${epigraph}
                        ${epigraphBy}
                        ${text}
                        ${additional}
                        ${date}
                        ${nominations}
                        ${awards}
                        ${link}
                        ${file}
                    </button>
                    <button disabled class="hidden text-gray-50 text-opacity-75 text-left self-start my-4">Ver comentarios</button>
                    <div id="showcomment${id}" class="hidden p-2 my-4 flex-col gap-2 w-[80%] self-center items-center mx-auto bg-[#191e4dad] rounded-[12px]">
                        ${inputComment}
                        <div id="comments-${id}" class="flex flex-col gap-2 w-[80%] self-center items-center mx-auto">
                        </div>
                    </div>
                    <button disabled id="newcomment${id}" class="hidden my-4 text-gray-50 text-opacity-50 text-left bg-gray-50 bg-opacity-10 mr-[50%] rounded-[6px]">Ocultar</button>
                    `;
                    form.append(div);
                };
                
                if (isOwner) {
                    const editBtn = document.createElement('button');
                    editBtn.disabled = true;
                    editBtn.id = `edit-btn-${id}`;
                    editBtn.classList.add('hidden', 'text-yellow-100', 'text-opacity-70', 'text-left', 'bg-yellow-200', 'bg-opacity-10', 'mb-2', 'mr-[50%]', 'rounded-[6px]');
                    editBtn.textContent = 'Editar';
                    
                    const publicStatus = document.createElement('p');
                    publicStatus.id = `public-status-${id}`;
                    publicStatus.classList.add('hidden', 'py-0', 'text-xs', 'text-left', 'text-opacity-70', 'text-gray-50', 'hidden');
                    
                    var status = '';
                    if (isPublic) {
                        status = 'Público';
                    } else {
                        status = 'Privado';
                    }
                    publicStatus.innerText = status;

                    div.append(editBtn);
                    div.append(publicStatus);
                };

                comments.forEach(comment => {
                    comentarios(commentArray, comment, id, logged, rol, userID, isOwner);
                });

            });
        };

        form.addEventListener('submit', async e => {
            e.preventDefault();
            //El submitter es el botón que ha sido seleccionado por el usuario. Por lo que el botón puede ser uno de varios. Primero, vamos a obtenerlo junto al ID de su parent.
            const submitter = e.submitter;
            const id = e.submitter.parentElement.id;
            submitter.disabled = true;
            
            //A partir de aquí, reaccionaremos al contenido de dicho submitter
            if (submitter.textContent === 'Ocultar') {
                //OCULTAR
                //Buscamos el botón principal que contiene toda la publicación y lo reactivamos
                const contentSubmitter = document.querySelector(`#btn${id}`);
                contentSubmitter.disabled = false;

                //Obtenemos el div que contiene todo y modificamos sus clases
                const divSubmitter = submitter.parentElement;
                divSubmitter.classList = classForDiv;
                
                //Ahora modificamos el contenido de la publicación
                for (let i = 0; i < contentSubmitter.children.length; i++) {
                    //Ocultamos la mayor parte del contenido
                    const children = contentSubmitter.children[i];
                    children.classList.add('hidden');
                    
                    //Si el contenido a revisar es una imagen, modificamos sus clases y estilo
                    if (children.id === `image${id}`) {
                        children.classList = classForImage;
                        children.style = styleForImage;
                    }
                    //Si el contenido a revisar es un título, modificamos sus clases
                    if (children.id === `title${id}`) {
                        children.classList = 'font-bold text-lg pt-2';
                    }
                };

                //Ahora ocultamos las opciones que tiene cada publicación
                for (let j = 1; j < divSubmitter.children.length; j++) {
                    const option = divSubmitter.children[j];
                    option.classList.add('hidden');
                    option.disabled = true;
                    if (option.textContent === 'Ocultar comentarios') {
                        option.textContent = 'Ver comentarios';
                    }
                }

            } else if (submitter.textContent === 'Editar') {
                //EDITAR
                window.location.pathname = `/editPublish/${id}`;
                
            } else if (submitter.textContent === 'Ver comentarios') {
                //VER COMENTARIOS
                submitter.disabled = false;
                submitter.textContent = 'Ocultar comentarios';
                const comments = document.querySelector(`#showcomment${id}`);
                comments.classList.remove('hidden');
                comments.classList.add('flex');

            } else if (submitter.textContent === 'Ocultar comentarios') {
                //OCULTAR COMENTARIOS
                submitter.disabled = false;
                submitter.textContent = 'Ver comentarios';
                const comments = document.querySelector(`#showcomment${id}`);
                comments.classList.remove('flex');
                comments.classList.add('hidden');
                
            } else if (submitter.textContent === 'Comentar') {
                //COMENTAR
                submitter.disabled = false;
                //Obtenemos el id correspondiente a la publicación
                const publishId = id.split('showcomment')[1];
                //Obtenemos el texto del comentario
                const commentText = document.querySelector(`#comment-input-${publishId}`);

                if (commentText.value !== '') {
                    const { data } = await axios.post('/api/comment/:id', {
                        text: commentText.value,
                        isAsk: false,
                        publish: publishId,
                    });

                    //Limpiamos el input y agregamos el comentario nuevo
                    commentText.value = '';
                    comentarios(data.publish, data.savedComment, publishId, logged);
                    
                    textNotification = 'Nuevo comentario agregado';
                    isNotificationTrue = false;
                    message(isNotificationTrue, textNotification);
                };

            } else if (submitter.textContent === 'Responder') {
                //RESPONDER
                submitter.disabled = false;
                //Ubicamos el comentario a responder y obtenemos el id
                const comment = document.querySelector(`#${id}`);
                const commentid = comment.id.split('comment-')[1];
                //Eliminamos el botón de responder
                comment.lastChild.remove();

                //Creamos un input que nos permita agregar la respuesta
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `ask-input-${commentid}`;
                input.name = `ask-input-${commentid}`;
                input.autocomplete = 'off';
                input.placeholder = 'Comentar...';
                input.classList.add('my-1', 'text-black', 'rounded-lg', 'p-2', 'bg-zinc-100', 'focus:outline-slate-700', 'w-[90%]');

                //Creamos un botón para en que se guarde la respuesta una vez escrita
                const btn = document.createElement('button');
                btn.id = `ask-btn-${commentid}`;
                btn.classList.add('text-gray-50', 'text-opacity-100', 'text-sm', 'text-left', 'flex', 'self-end', 'bg-[#f97020ec]', 'p-1', 'rounded-[24px]', 'font-bold', 'transition', 'duration-300', 'hover:bg-[#dab0a1]');
                btn.textContent = 'Enviar respuesta';

                comment.append(input,btn);


            } else if (submitter.textContent === 'Enviar respuesta') {
                //ENVIAR RESPUESTA
                submitter.disabled = false;
                const commentId = submitter.id.split('ask-btn-')[1];
                const input = document.querySelector(`#ask-input-${commentId}`);
                const publishId = submitter.parentElement.parentElement.parentElement.parentElement.id;
                
                const commentContent = document.querySelector(`#comment-content-${commentId}`);
                const askWho = commentContent.textContent.split(':')[0];
                const askText = commentContent.textContent.split(': ')[1];
                
                if (input.value !== '') {
                    const { data } = await axios.post('/api/comment/:id', {
                        text: input.value,
                        isAsk: true,
                        publish: publishId,
                        askTo: commentId,
                        askName: askWho,
                        askText: askText
                    });

                    const comment = input.parentElement;
                    comment.lastChild.remove();
                    comment.lastChild.remove();

                    const askBtn = document.createElement('button');
                    askBtn.classList.add('text-gray-50', 'text-opacity-90', 'text-sm', 'text-left', 'flex', 'self-end', 'underline', 'hover:text-white');
                    askBtn.textContent = 'Responder';
                    comment.append(askBtn);
                    
                    comentarios(data.publish, data.savedComment, publishId, logged, rol, userID);

                    textNotification = 'Nueva respuesta agregada';
                    isNotificationTrue = false;
                    message(isNotificationTrue, textNotification);

                    
                };
            } else {
                //MOSTRAR DETALLES
                //Obtenemos el div que contiene todo y modificamos sus clases
                const divSubmitter = submitter.parentElement;
                divSubmitter.classList = 'w-full lg:w-[80%] lg:mx-20 self-center grid gap-0 my-0 mx-auto no-underline pb-[13px] pt-[10px] px-[20px] rounded-[24px] transition duration-300 border-[4px] border-[#f97020ec] bg-black';

                const contentSubmitter = document.querySelector(`#btn${id}`);

                //Ahora modificamos el contenido de la publicación
                for (let i = 0; i < contentSubmitter.children.length; i++) {
                    //Ocultamos la mayor parte del contenido
                    const children = contentSubmitter.children[i];
                    children.classList.remove('hidden');
                    
                    //Si el contenido a revisar es una imagen, modificamos sus clases y estilo
                    if (children.id === `image${id}`) {
                        children.classList = 'w-full md:w-[75%] flex justify-self-center mt-2 border-2 border-white';
                        children.style = '';
                    }
                    //Si el contenido a revisar es un título, modificamos sus clases
                    if (children.id === `title${id}`) {
                        children.classList = 'font-bold text-3xl pt-4';
                    }
                };
                
                //Ahora mostramos las opciones que tiene cada publicación
                for (let j = 1; j < divSubmitter.children.length; j++) {
                    const option = divSubmitter.children[j];
                    if (option.id !== `showcomment${id}`) {
                        option.classList.remove('hidden');
                        option.disabled = false;
                    }
                }
            };
        });
    } catch (error) {
        console.log(error);
    }    
})();