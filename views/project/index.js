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

const comentarios = ((commentArray, comment, id, logged, rol, userLogged, isOwner) => {
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
            let ifCommentUser = '';
            
            if (userLogged === commentUser) {
                ifCommentUser = `
                        <li class="list-none">
                            <button id="edit-${commentId}" class="hover:bg-gray-400 transition ease-in-out text-xs rounded-lg px-2 py-1 cursor-pointer">Editar comentario</button>
                        </li>
                `;
            }

            if (rol === 'Admin' || userLogged === commentUser || isOwner === 'true') {
                menuComment = `
                    <button id="menuComment-${commentId}" class="absolute text-xs hover:bg-[#f97020ec] flex self-end rounded-2xl transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: scaleY(-1);msFilter:progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1);"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                    </button>
                    <ul id="menu-${commentId}" class="hidden absolute bg-gray-500 p-1 translate-x-[115%] rounded-xl gap-2 self-end">
                        ${ifCommentUser}
                        <li class="list-none">
                            <button id="delete-${commentId}" class="hover:bg-gray-400 transition ease-in-out text-xs rounded-lg px-2 py-1 cursor-pointer">Eliminar</button>
                        </li>
                    </ul>
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
                ${menuComment}
                <button id="ask-btn-${commentId}" class="text-gray-50 text-opacity-90 text-xs text-left flex self-end underline hover:text-white cursor-pointer transition duration-300 hover:bg-gray-500 rounded-md px-0.5">Responder</button>
                `;
            };

            const divComments = document.querySelector(`#comments-${id}`);
            const commentDiv = document.createElement('div');
            commentDiv.id = `comment-${commentId}`;
            commentDiv.classList.add('p-2','my-2', 'flex', 'flex-col', 'self-center', 'items-center', 'mx-auto', 'left-0', 'right-0', 'w-full', 'border-y-[1px]', 'border-[#ffffff7a]', 'rounded-md');

            commentDiv.innerHTML = `
            ${ask}
            <p id="comment-content-${commentId}" class="text-left self-start text-gray-50 text-opacity-80"><em class="text-white font-bold">${commentName}: </em>${commentText}</p>
            ${toAsk}
            `;
            divComments.append(commentDiv);
        };
});

//Creamos una función para agregar inputs
const addInput = (id, text, isPlaceholder, value, comment) => {
    let valueorplace = '';
    let inputid = '';
    if (isPlaceholder) {
        valueorplace = 'placeholder="Comentar..."';
        inputid = `ask-input-${id}`;
    } else {
        valueorplace = `value="${value}"`;
        inputid = `edit-ask-${id}`;
    }

    //Agregamos los elementos al div
    const div = document.createElement('div');
    div.classList.add('w-full')
    div.innerHTML = `
        <input type="text" id="${inputid}" autocomplete="off" ${valueorplace} class="my-1 text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700 w-[90%]">
        <div class="flex gap-1 justify-end">
            <button id="ask-btn-${id}" class="text-gray-50 text-opacity-100 text-sm text-left flex self-end bg-[#f97020ec] py-1 px-2 rounded-[24px] font-bold transition duration-300 hover:bg-[#dab0a1] cursor-pointer">${text}</button>
            <button id="ask-btn-${id}" class="text-gray-50 text-opacity-100 text-sm text-left flex self-end bg-red-600 py-1 px-2 rounded-[24px] font-bold transition duration-300 hover:bg-red-500 cursor-pointer">Cancelar</button>
        </div>
    `;
    
    comment.append(div);
};

const styleForImage = 'border-radius:50%; -webkit-border-radius:50%; box-shadow: 0px 0px 5px 5px #ec731e; -webkit-box-shadow: 0px 0px 5px 5px #ec731e;';
const classForImage = 'w-[150px] m-0 justify-self-center aspect-square object-cover';
const classForDiv = `w-[150px] h-[200px] justify-self-center grid gap-0 my-0 mx-auto no-underline bg-[#f97020ec] pb-[13px] pt-[10px] px-[20px] rounded-[24px] transition duration-300 hover:bg-[#ff4800c2]`;

(async () => {
    try {
        const pathName = window.location.pathname.split('/')[2];
        const { data } = await axios.get(`/api/project/${pathName}`);
        const { title, publishs, isOwner, comments, logged, icon, artistic, image, userID, rol, userLogged } = data;
        
        let srcImage = '';
        if (image !== '') {
            srcImage = `/storage/${userID}/${pathName}/${image}`;
        }

        titleHtml.innerHTML = `${title}`;

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
                    <button id="btn${id}" class="grid justify-center cursor-pointer">
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
                    <button disabled class="hidden text-gray-50 text-opacity-75 cursor-pointer text-left self-start my-4">Ver comentarios</button>
                    <div id="showcomment${id}" class="hidden p-2 my-4 flex-col gap-2 w-[80%] self-center items-center mx-auto bg-[#191e4dad] rounded-[12px]">
                        ${inputComment}
                        <div id="comments-${id}" class="flex flex-col gap-2 w-[80%] self-center items-center mx-auto">
                        </div>
                    </div>
                    <button disabled id="newcomment${id}" class="hidden my-4 text-gray-50 text-opacity-50 text-left cursor-pointer bg-gray-500 hover:bg-gray-300 transition duration-300 bg-opacity-10 mr-[80%] pl-1 rounded-[6px]">Ocultar</button>
                    `;
                    form.append(div);
                };
                
                if (isOwner) {
                    const editBtn = document.createElement('button');
                    editBtn.disabled = true;
                    editBtn.id = `edit-btn-${id}`;
                    editBtn.classList.add('hidden', 'text-yellow-100', 'text-opacity-70', 'text-left', 'bg-yellow-900', 'cursor-pointer', 'hover:bg-yellow-700', 'transition', 'duration-300', 'bg-opacity-10', 'mb-2', 'mr-[80%]', 'pl-1', 'rounded-[6px]');
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
                    comentarios(commentArray, comment, id, logged, rol, userLogged, isOwner);
                });

            });
        };

        form.addEventListener('submit', async e => {
            e.preventDefault();
            //El submitter es el botón que ha sido seleccionado por el usuario. Por lo que el botón puede ser uno de varios. Primero, vamos a obtenerlo junto al ID de su parent.
            const submitter = e.submitter;
            let id = e.submitter.parentElement.id;
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
                    comentarios(data.publish, data.savedComment, publishId, logged, rol, userLogged, isOwner);
                    
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
                //Ocultamos el botón de responder
                submitter.classList.add('hidden');

                //Llamamos a la función que agrega un input
                addInput(commentid, 'Enviar respuesta', true, '', comment);

            } else if (submitter.textContent === 'Enviar respuesta') {
                //ENVIAR RESPUESTA
                submitter.disabled = false;
                const commentId = submitter.id.split('ask-btn-')[1];
                const input = document.querySelector(`#ask-input-${commentId}`);
                const publishId = submitter.parentElement.parentElement.parentElement.parentElement.id.split('-')[1];
                
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

                    const comment = document.querySelector(`#comment-${commentId}`);
                    comment.lastChild.remove();
                    comment.lastChild.remove();
                    comment.lastElementChild.classList.remove('hidden');

                    comentarios(data.publish, data.savedComment, publishId, logged, rol, userLogged, isOwner);

                    textNotification = 'Nueva respuesta agregada';
                    isNotificationTrue = false;
                    message(isNotificationTrue, textNotification);
                    
                };
            } else if (submitter.id.includes('menuComment')) {
                //MENU COMENTARIO
                submitter.disabled = false;
                //Obtenemos el id para el comentario
                id = id.split('-')[1];
                //Dependiendo del estado previo, se agrega o elimina la clase hidden
                const menu = document.querySelector(`#menu-${id}`);
                menu.classList.toggle('hidden');

                //Si se scrollea, se ocultan todos los menús que estuvieran previamente visibles
                window.addEventListener('scroll', () => {
                    menu.classList.add('hidden');
                });

            } else if (submitter.textContent === 'Cancelar') {
                //CANCELAR
                id = submitter.id.split('-')[2];
                
                if (document.querySelector(`#ask-input-${id}`)) {
                    document.querySelector(`#ask-input-${id}`).parentElement.remove();
                    document.querySelector(`#ask-btn-${id}`).classList.remove('hidden');
                }
                if (document.querySelector(`#edit-ask-${id}`)) {
                    document.querySelector(`#edit-ask-${id}`).parentElement.remove();
                    document.querySelector(`#comment-content-${id}`).classList.remove('hidden');
                }
                
                
            } else if (submitter.id.split('-')[0] === 'edit') {
                //EDITAR COMENTARIO
                submitter.disabled = false;
                id = submitter.id.split('-')[1];
                const comment = document.querySelector(`#comment-${id}`);
                const commentContent = document.querySelector(`#comment-content-${id}`);
                //Obtenemos el texto del comentario
                const commentText = commentContent.innerHTML.split('</em>')[1];
                //Buscamos el menu y la respuesta anterior y los ocultamos
                const menu = document.querySelector(`#menu-${id}`);
                menu.classList.add('hidden');
                commentContent.classList.add('hidden');
                //Llamamos a la función que agrega un input para editar la respuesta
                addInput(id, 'Modificar respuesta', false, commentText, comment);

            } else if (submitter.id.split('-')[0] === 'ask') {
                //MODIFICAR RESPUESTA
                id = submitter.id.split('-')[2];
                
                //Obtenemos el texto del comentario nuevo
                const editAsk = document.querySelector(`#edit-ask-${id}`).value;
                await axios.patch(`/api/comment/id`, { id, editAsk });
                
                //Eliminamos el input y mostramos el contenedor de la respuesta
                document.querySelector(`#edit-ask-${id}`).parentElement.remove();
                document.querySelector(`#comment-content-${id}`).classList.remove('hidden');
                
                //Eliminamos la respuesta anterior y agregamos la nueva
                let commentContent = document.querySelector(`#comment-content-${id}`);
                commentContent.innerHTML = `${commentContent.innerHTML.split('</em>')[0]}</em>${editAsk}`;

                textNotification = 'Respuesta modificada';
                isNotificationTrue = false;
                message(isNotificationTrue, textNotification);


            } else if (submitter.id.split('-')[0] === 'delete') {
                //ELIMINAR COMENTARIO
                submitter.disabled = false;
                id = submitter.id.split('-')[1];
                
                //Obtenemos el contenido del comentario y ocultamos el menú
                const commentContent = document.querySelector(`#comment-content-${id}`);
                const menu = document.querySelector(`#menu-${id}`);
                menu.classList.add('hidden');

                //Mostramos un prompt para confirmar la eliminación
                let promptDelete = confirm(`¿Desea eliminar el comentario "${commentContent.innerHTML.split('</em>')[1]}"?`);
                if (promptDelete) {
                    await axios.delete(`/api/comment/${id}`);
                }

                //Eliminamos el comentario del HTML
                const comment = document.querySelector(`#comment-${id}`).remove();

                textNotification = 'Comentario eliminado';
                isNotificationTrue = false;
                message(isNotificationTrue, textNotification);

            } else {
                //MOSTRAR DETALLES
                //Obtenemos el div que contiene todo y modificamos sus clases
                const divSubmitter = submitter.parentElement;
                divSubmitter.classList = 'w-xl lg:mx-20 self-center grid gap-0 my-0 mx-auto no-underline pb-[13px] pt-[10px] px-[20px] rounded-[24px] transition duration-300 border-[4px] border-[#f97020ec] bg-black';

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