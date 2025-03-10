import { createNotification } from "../../components/notification.js";
const notification = document.querySelector('#notification');
const form = document.querySelector('#form');
const title = document.querySelector('#title');

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


let textNotification = '';
let isNotificationTrue = '';
const message = (bool, text) => {
    createNotification(bool, text);
    setTimeout(() => {
        notification.innerHTML = '';
    }, 2000);
};

const id = window.location.pathname.split('/')[2];

(async () => {
    try {
        const { data } = await axios.get(`/api/publish/${id}`);
        const titleProject = data.title;
        title.innerHTML = `
        <h2 class="text-3xl mb-6 font-bold">
            ${titleProject}
        </h2>
        `;

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

                deleteImage.classList.remove('hidden');
                imageLoaded = true;
                imageUpload = imageInput.files[0].name;
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

        fileInput.addEventListener('change', async (file) => {
            fileUpload = fileInput.files[0];
            if (fileUpload) {
                const fileURL = URL.createObjectURL(fileUpload) + '#toolbar=0';
                fileShow.setAttribute('type', fileUpload.type)
                fileShow.setAttribute('src', fileURL);
                fileShow.classList.remove('hidden');
                fileShow.classList.add('w-80', 'h-96', 'flex', 'self-center');
                
                deleteFile.classList.remove('hidden');
                fileLoaded = true;
                fileUpload = fileInput.files[0].name;
                fileDeleted = false;
            };
        });

        deleteFile.addEventListener('click', () => {
            if (confirm('¿Desea eliminar el archivo seleccionado?')) {
                fileShow.src = '';
                fileShow.classList.remove('w-80', 'h-96', 'flex', 'self-center');
                fileShow.classList.add('hidden');
                deleteFile.classList.add('hidden');
                fileInput.value = '';
                fileLoaded = false;
                fileDeleted = true;
            }
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (e.submitter.id === 'save-btn') {

                e.submitter.disabled = true;
                const newPublish = await axios.post('/api/publish/:id', {
                    title: titleInput.value,
                    dedicatory: dedicatoryInput.value,
                    epigraph: epigraphInput.value,
                    epigraphBy: epigraphByInput.value,
                    text: textInput.value,
                    image: imageUpload,
                    date: dateInput.value,
                    additional: additionalInput.value,
                    nominations: nominationsInput.value,
                    awards: awardsInput.value,
                    link: linkInput.value,
                    ispublic: publicInput.checked,
                    file: fileUpload
                });

                if (imageLoaded || fileLoaded) {
                    titleInput.value = newPublish.data.id;
                    await axios.post(`/storage/publish/${id}/`, form);
                }

                const newPathname = '/project' + window.location.pathname.split('/addPublish')[1];

                textNotification = 'Se ha guardado una nueva publicación';
                isNotificationTrue = false;
                message(isNotificationTrue, textNotification);
                setTimeout(() => window.location.pathname = newPathname, 1500);
            };
            
            if (e.submitter.id === 'cancel-btn') {
                const newPathname = '/project' + window.location.pathname.split('/addPublish')[1];
                textNotification = 'Cancelado';
                isNotificationTrue = true;
                message(isNotificationTrue, textNotification);
                setTimeout(() => window.location.pathname = newPathname, 500);
            };
        });
        
    } catch (error) {
        console.log(error)
        textNotification = 'No posees permisos de edición';
        isNotificationTrue = true;
        message(isNotificationTrue, textNotification);
        setTimeout(() => window.location.pathname = '/', 2000);
    }
})();