import { createNotification } from "../../components/notification.js";
const notification = document.querySelector('#notification');
const form = document.querySelector('#form');
const titleDocument = document.querySelector('#title');
const titleWindow = document.querySelector('title');

const titleInput = document.querySelector('#title-input');
const dedicatoryInput = document.querySelector('#dedicatory-input');
const epigraphInput = document.querySelector('#epigraph-input');
const epigraphByInput = document.querySelector('#epigraphBy-input');
const textInput = document.querySelector('#text-input');
const imageInput = document.querySelector('#image-input');
const dateInput = document.querySelector('#date-input');
const additionalInput = document.querySelector('#additional-input');
const nominationsInput = document.querySelector('#nominations-input');
const awardsInput = document.querySelector('#awards-input');
const linkInput = document.querySelector('#link-input');
const fileInput = document.querySelector('#file-input');
const publicInput = document.querySelector('#public-input');

const imageShow = document.querySelector('#image-show');
let imageLoaded = false;
let imageUpload= '';
const fileShow = document.querySelector('#fileShow');
let fileLoaded = false;
let fileUpload= '';

const deleteImage = document.querySelector('#delete-image');
let imageDeleted = false;
const deleteFile = document.querySelector('#delete-file');
let fileDeleted = false;

let imageValidation = false;
let fileValidation = false;

const deletePublish = document.querySelector('#delete-publish');
const saveBtn = document.querySelector('#save-btn');

let textNotification = '';
let isNotificationTrue = '';
const message = (bool, text) => {
    createNotification(bool, text);
    setTimeout(() => {
        notification.innerHTML = '';
    }, 2000);
};

const path = window.location.pathname.split('/')[2];

(async () => {
    try {
        const { data } = await axios.get(`/api/publish/edit/${path}`);

        const { title, dedicatory, epigraph, epigraphBy, text, image, date, additional, nominations, awards, link, file, project, id } = data;
        const isPublic = data.public;
        const newPathname = '/project/' + project;

        if (title !== '') {
            titleWindow.textContent = title;
        } else {
            titleWindow.textContent = 'Editar publicación';
        }

        titleDocument.innerHTML = `
        <h2 class="text-3xl mb-6 font-bold">
            ${title}
        </h2>
        `;

        let srcImage = '';
        if (image !== '') {
            srcImage = `/storage/${data.user}/${data.project}/${path}/${image}`;
            imageShow.setAttribute('src', srcImage);
            imageShow.classList.add('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
            deleteImage.classList.remove('hidden');
        }

        let srcFile = '';
        if (file !== '') {
            srcFile = `/storage/${data.user}/${data.project}/${path}/${file}`;
            fileShow.setAttribute('src', srcFile);
            fileShow.classList.remove('hidden');
            fileShow.classList.add('w-80', 'h-96', 'flex', 'self-center');
            deleteFile.classList.remove('hidden');
        }

        titleInput.value = title;
        dedicatoryInput.value = dedicatory;
        epigraphInput.value = epigraph;
        epigraphByInput.value = epigraphBy;
        textInput.value = text;
        dateInput.value = date;
        additionalInput.value = additional;
        nominationsInput.value = nominations;
        awardsInput.value = awards;
        linkInput.value = link;

        if (!isPublic) {
            publicInput.checked = false;
        };


        let titleValidation = false;
        let dedicatoryValidation = false;
        let epigraphValidation = false;
        let epigraphByValidation = false;
        let textValidation = false;
        let dateValidation = false;
        let additionalValidation = false;
        let nominationsValidation = false;
        let awardsValidation = false;
        let linkValidation = false;
        let isPublicValidation = false;

        const validation = () => {
            saveBtn.disabled = 
                titleValidation || dedicatoryValidation || epigraphValidation || 
                epigraphByValidation || textValidation || dateValidation || 
                additionalValidation || nominationsValidation || awardsValidation || 
                linkValidation || isPublicValidation || imageValidation || 
                fileValidation ? false : true;
        };


        imageShow.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', async (file) => {
            imageShow.classList.add('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
            imageUpload = imageInput.files[0];
            if (imageUpload) {
                const reader = new FileReader();
    
                reader.onload = async () => {
                    let output = imageShow;
                    output.src = reader.result;                
                };
                reader.readAsDataURL(imageUpload);

                imageLoaded = true;
                imageUpload = imageInput.files[0].name;
                imageValidation = true;
                validation();

                imageDeleted = true;
                deleteImage.classList.remove('hidden');
            };
        });

        fileInput.addEventListener('change', async (file) => {
            fileUpload = fileInput.files[0];
            if (fileUpload) {
                const fileURL = URL.createObjectURL(fileUpload) + '#toolbar=0';
                fileShow.setAttribute('type', fileUpload.type)
                fileShow.setAttribute('src', fileURL);
                fileShow.classList.remove('hidden');
                fileShow.classList.add('w-80', 'h-96', 'flex', 'self-center');
                
                fileLoaded = true;
                fileUpload = fileInput.files[0].name;
                fileValidation = true;
                validation();

                fileDeleted = true;
                deleteFile.classList.remove('hidden');
            };
        });

        form.addEventListener('input', e => {
            titleValidation = titleInput.value === title ? false : true;
            dedicatoryValidation = dedicatoryInput.value === dedicatory ? false : true;
            epigraphValidation = epigraphInput.value === epigraph ? false : true;
            epigraphByValidation = epigraphByInput.value === epigraphBy ? false : true;
            textValidation = textInput.value === text ? false : true;
            dateValidation = dateInput.value === date ? false : true;
            additionalValidation = additionalInput.value === additional ? false : true;
            nominationsValidation = nominationsInput.value === nominations ? false : true;
            awardsValidation = awardsInput.value === awards ? false : true;
            linkValidation = linkInput.value === link ? false : true;
            isPublicValidation = publicInput.checked === isPublic ? false : true;
            validation()
        });

        deleteImage.addEventListener('click', (e) => {
            if (confirm('¿Desea eliminar la imagen seleccionada?')) {
                imageShow.src = '';
                imageShow.classList.remove('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
                deleteImage.classList.add('hidden');
                imageInput.value = '';
                imageLoaded = false;
                imageDeleted = true;
            }
        });

        deleteFile.addEventListener('click', () => {
            if (confirm('¿Desea eliminar el archivo seleccionado?')) {
                fileShow.src = '';
                fileShow.classList.add('hidden');
                deleteFile.classList.add('hidden');
                fileInput.value = '';
                fileLoaded = false;
                fileDeleted = true;
            }
        });

        deletePublish.addEventListener('click', async (e) => {
            let promptDelete = prompt('Si desea eliminar la publicacion actual, por favor escriba Eliminar.');
        try {
            if (promptDelete === 'Eliminar') {
                await axios.delete(`/api/publish/${path}`);
                textNotification = 'Publicación eliminada exitosamente';
                isNotificationTrue = false;
                message(isNotificationTrue, textNotification);
                setTimeout(() => window.location.pathname = newPathname, 2000);
            } else {
                textNotification = 'Publicación no eliminada';
                isNotificationTrue = true;
                message(isNotificationTrue, textNotification);
            }
            
        } catch (error) {
            console.log(error);
            textNotification = 'No se pudo eliminar la publicación';
            isNotificationTrue = true;
            message(isNotificationTrue, textNotification);
            setTimeout(() => window.location.pathname = newPathname, 2000);
        }
        });

        form.addEventListener('submit', async e => {
            e.preventDefault()

            if (e.submitter.id === 'cancel-btn') {
                textNotification = 'Cancelado';
                isNotificationTrue = true;
                message(isNotificationTrue, textNotification);
                setTimeout(() => window.location.pathname = newPathname, 500);
            } else if (e.submitter.id === 'save-btn') {
                await axios.patch(`/api/publish/edit/${id}`, {
                    title: titleInput.value,
                    dedicatory: dedicatoryInput.value,
                    epigraph: epigraphInput.value,
                    epigraphBy: epigraphByInput.value,
                    text: textInput.value,
                    date: dateInput.value,
                    additional: additionalInput.value,
                    nominations: nominationsInput.value,
                    awards: awardsInput.value,
                    link: linkInput.value,
                    ispublic: publicInput.checked
                });

                if (imageLoaded || fileLoaded) {
                    await axios.patch(`/storage/publish/${path}/`, form);
                }

                if (imageDeleted) {
                    await axios.patch(`/storage/deletepublishimage/${path}`, form);
                }
                if (fileDeleted) {
                    await axios.patch(`/storage/deletepublishfile/${path}`, form);
                }

                textNotification = 'Nuevos cambios guardados';
                isNotificationTrue = false;
                message(isNotificationTrue, textNotification);
                setTimeout(() => window.location.pathname = newPathname, 500);
            }
        });
        
    } catch (error) {
        console.log(error)
        textNotification = 'No posees permisos de edición';
        isNotificationTrue = true;
        message(isNotificationTrue, textNotification);
        setTimeout(() => window.location.pathname = '/', 2000);
    }
})();