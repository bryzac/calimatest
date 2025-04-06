import { projectnav } from "../../../components/projectnav.js";
const navbar = document.querySelector('#navbar');

// Imagen de fondo
let imgSrc = '';
// Título que llevará la página
let title = '';
// Subtítulo de la página
let paragraph = '';

//En caso de ser la sección de contacto
let ifContact = '';

// Variables para el Nav de Home, se modifican dependiendo de si se está logeado o no
let desktopHome = '';
let mobileHome = '';

//Comprueba si es admin o no
let isAdmin = '';


(async () => {
    try {
        // Enviar la data a BE para chequear que estemos logeados
        const { data } = await axios.get('/api/navs');
        const userLogged = data.name;

        // Booleano para verificar si se ha iniciado sesión
        const logged = data.logged;

        if (data.rol === 'Admin') {
            isAdmin = true;
        } else {
            isAdmin = false;
        };

        //Obtenemos el pathname pathname, dependiendo de la ubicación, los datos cambian
        const pathName = window.location.pathname;
        
        if (pathName === '/') {
            imgSrc = '/images/calimantes.jpg';
            title = 'Habitantes de la Calima';
            paragraph = 'Nací de un sentimiento en ruinas, en el crujir de las cenizas';
        } else if (pathName === '/signup/') {
            imgSrc = '/images/inhabitants.png';
            title = 'Registrarse';
            paragraph = 'Todos nacimos con una palabra que decir';
        } else if (pathName === '/login/') {
            imgSrc = '/images/inhabitants.png';
            title = 'Iniciar sesión';
            paragraph = 'Todos nacimos con una palabra que decir';
        } else if (pathName === '/visitantes/') {
            imgSrc = '/images/inhabitants.png';
            title = 'Visitantes';
            paragraph = 'Otra ilusión toca mi sombra';
        } else if (pathName === '/habitantes/') {
            imgSrc = '/images/inhabitants.png';
            title = 'Habitantes';
            paragraph = 'Otra ilusión toca mi sombra';
        } else if (pathName === '/contacto/') {
            imgSrc = '/images/Algamord.png';
            title = 'Contacto';
            paragraph = 'Puedes contactarnos por nuestras cuentas oficiales';
            ifContact = `
                <div class="z-[1000] flex flex-wrap place-content-evenly gap-4 h-12 mt-4">
                    <a class="flex flex-col" href="https://www.facebook.com/habitantesdelacalima"><img class="h-[80px]" src="../images/facebook.svg" alt=""><h4>Facebook</h4></a>
                    <a class="flex flex-col" href="https://www.instagram.com/habitantesdelacalima/"><img class="h-[80px]" src="../images/instagram.svg" alt=""><h4>Instagram</h4></a>
                    <a class="flex flex-col" href="mailto:habitantesdelacalima@gmail.com"><img class="h-[80px]" src="../images/gmail.svg" alt=""><h4>Correo</h4></a>
                </div>
            `;
        } else if (pathName.includes('/profile/')) {
            const profile = await axios.get(`/api/navs/profile/${pathName.split('/profile/')[1]}`);
            const imageprofile = profile.data.imageprofile;
            const userID = profile.data.id;
            title = profile.data.name;
            paragraph = profile.data.nickname;
            if (imageprofile || imageprofile !== '') {
                imgSrc = `/storage/${userID}/${imageprofile}`;
            } else {
                imgSrc = '/images/calimantes.jpg';
            }
        } else if (pathName.includes('/profileDetails/')) {
            const profile = await axios.get(`/api/navs/profile/${pathName.split('/profileDetails/')[1]}`);
            const imageprofile = profile.data.imageprofile;
            const userID = profile.data.id;
            title = profile.data.name;
            paragraph = profile.data.sentence;
            if (imageprofile || imageprofile !== '') {
                imgSrc = `/storage/${userID}/${imageprofile}`;
            } else {
                imgSrc = '/images/cara.jpg';
            }
        } else if (pathName.includes('/project/') || pathName.includes('/addPublish/')) {
            const project = await axios.get(`/api/navs/project/${pathName.split('/')[2]}`);
            const imageproject = project.data.image;
            const userID = project.data.user;
            const projectID = project.data.id;
            title = project.data.title;
            paragraph = project.data.artistic;
            if (imageproject || imageproject !== '') {
                imgSrc = `/storage/${userID}/${projectID}/${imageproject}`;
            } else {
                imgSrc = '/images/calimahaze.png';
            }
        } else if (pathName.includes('/editPublish/')) {
            const project = await axios.get(`/api/navs/editPublish/${pathName.split('/')[2]}`);
            const imageproject = project.data.image;
            const userID = project.data.user;
            const projectID = project.data.id;
            title = project.data.title;
            paragraph = project.data.artistic;
            if (imageproject || imageproject !== '') {
                imgSrc = `/storage/${userID}/${projectID}/${imageproject}`;
            } else {
                imgSrc = '/images/calimahaze.png';
            }
        } else if (pathName.includes('/admin/')) {
            imgSrc = '/images/calimahaze.png';
            title = `Admin`;
        }

        // Si se está logeado, el menú del nav se va modificando
        if (logged) {
            
            desktopHome = `
            <li class="list-none">
                <a href="/profile/${data.userID}" class="text-white px-2 p-1 font-bold hover:bg-[#b81c1cec] transition ease-in-out rounded-lg bg-[#f97020ec]">${userLogged.split(' ')[0]}</a>
            </li>
            <div class="hidden min-[900px]:flex flex-row gap-4">
                <button id="close-btn" class="transition ease-in-out text-white bg-[#191e4dad] font-bold hover:bg-[#e6b9a4] px-2 p-1 rounded-lg">Cerrar sesión</button>
            </div>
            `;
            mobileHome = `
            <li class="list-none">
                <a href="/profile/${data.userID}" class="text-white p-1 font-bold hover:bg-[#FF3300] hover:border-2 hover:border-white transition ease-in-out rounded-lg bg-[#f97020ec]">${userLogged.split(' ')[0]}</a>
            </li>
            <li class="list-none">
                <button id="close-btn" class="transition ease-in-out text-white bg-[#191e4dad] font-bold hover:bg-[#e6b9a4] p-1 rounded-lg">Cerrar sesión</button>
            </li>
            `;

            if (isAdmin) {
                desktopHome = `
                
                <li class="list-none">
                    <a href="/admin/${data.userID}" class="transition ease-in-out text-white bg-[#191e4dad] font-bold hover:bg-[#e6b9a4] p-1 rounded-lg">Admin</a>
                </li>
                ` + desktopHome;
                mobileHome = `
                
                <li class="list-none">
                    <a href="/admin/${data.userID}" class="text-white p-1 font-bold hover:bg-[#FF3300] hover:border-2 hover:border-white transition ease-in-out rounded-lg bg-[#f97020ec]">Admin</a>
                </li>
                ` + mobileHome;
            }
            
        }
        
        //Aquí buscamos tres datos: Que no esté loggeado, y saber si está en la página de Login o de Registro. De esta manera, tenemos tres tipos de Nav
        if (!logged && !pathName.includes('/signup/') && !pathName.includes('/login/')) {
            desktopHome = `
            <li class="list-none">
                <a href="/login" class="text-white px-2 p-1 font-bold hover:bg-[#e6b9a4] transition ease-in-out rounded-lg bg-[#191e4dad]">Ingresar</a>
            </li>
            <li class="list-none">
                <a href="/signup" class="text-white px-2 p-1 font-bold hover:bg-[#b81c1cec] transition ease-in-out rounded-lg bg-[#f97020ec]">Registrarse</a>
            </li>
            `;
            mobileHome = `
            <li class="list-none">
                <a href="/login" class="text-black px-2 p-1 font-bold hover:bg-[#e6b9a4] transition ease-in-out rounded-lg bg-[#ffffff]">Ingresar</a>
            </li>
            <li class="list-none">
                <a href="/signup" class="text-white px-2 p-1 font-bold hover:bg-[#FF3300] hover:border-2 hover:border-white transition ease-in-out rounded-lg bg-[#f97020ec]">Registrarse</a>
            </li>
            `;

        } else if (!logged && pathName.includes('/signup/') && !pathName.includes('/login/')) {
            desktopHome = `
            <li class="list-none">
                <a href="/login" class="text-white px-2 p-1 font-bold hover:bg-[#e6b9a4] transition ease-in-out rounded-lg bg-[#191e4dad]">Ingresar</a>
            </li>
            `;
            mobileHome = `
            <li class="list-none">
                <a href="/login" class="text-black px-2 p-1 font-bold hover:bg-[#e6b9a4] transition ease-in-out rounded-lg bg-[#ffffff]">Ingresar</a>
            </li>
            `;
        } else if (!logged && !pathName.includes('/signup/') && pathName.includes('/login/')) {
            desktopHome = `
            <li class="list-none">
                <a href="/signup" class="text-white px-2 p-1 font-bold hover:bg-[#b81c1cec] transition ease-in-out rounded-lg bg-[#f97020ec]">Registrarse</a>
            </li>
            `;
            mobileHome = `
            <li class="list-none">
                <a href="/signup" class="text-white px-2 p-1 font-bold hover:bg-[#FF3300] hover:border-2 hover:border-white transition ease-in-out rounded-lg bg-[#f97020ec]">Registrarse</a>
            </li>
            `;
        }
        
        
        navbar.innerHTML = `
            <img src="${imgSrc}" 
                id="nav-img"
                style="clip-path:polygon(0 0, 100% 0, 100% 80%, 90% 90%, 75% 95%, 63% 98%, 50% 100%, 38% 98%, 25% 95%, 10% 90%, 0 80%); filter:brightness(50%);"
                class="-z-10 overflow-hidden object-cover w-screen h-screen justify-self-center relative"
            >
            <header
                class="z-10 h-24 justify-center flex items-center fixed bg-transparent backdrop-blur-xl w-full"
            >
                <a href="/">
                    <img src="/images/Logo.jpg" class="rounded-full w-[70px] h-[70px] fixed top-4 left-8 z-50" alt="logo">
                </a>
        
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 24 24" 
                    stroke-width="1.5" 
                    stroke="currentColor" 
                    class="z-[105] w-10 h-10 min-[900px]:hidden text-white cursor-pointer p-2 hover:bg-slate-900 absolute top-4 right-8">
                    <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                    />
                </svg>  
        
                <!-- Versión escritorio -->
                <ul id="vdesktop" class="hidden top-4 right-8 h-16 content-center w-48 min-[900px]:w-auto flex-col justify-evenly rounded-xl items-center z-[100] transition duration-tranmenu min-[900px]:ml-auto min-[900px]:grid min-[900px]:grid-flow-col min-[900px]:auto-cols-max gap-6 mr-8">
                    <li class="list-none">
                        <a href="/habitantes" class="text-white p-1 hover:bg-[#f97020ec] transition ease-in-out rounded-lg">Habitantes</a>
                    </li>
                    <li class="list-none">
                        <a href="/visitantes" class="text-white p-1 hover:bg-[#f97020ec] transition ease-in-out rounded-lg">Visitantes</a>
                    </li>
                    <li class="list-none">
                        <a href="/contacto" class="text-white p-1 hover:bg-[#f97020ec] transition ease-in-out rounded-lg">Contacto</a>
                    </li>
                    ${desktopHome}
                </ul>
    
                <!-- Versión móvil -->
                <ul id="vmobile" class="hidden min-[900px]:hidden p-4 fixed top-4 right-8 h-88 w-48 flex-col justify-evenly rounded-xl items-center z-[100] transition duration-tranmenu gap-6 mr-8 bg-gray-900">
                    <li class="list-none">
                        <a href="/habitantes" class="text-white p-1 hover:bg-[#f97020ec] transition ease-in-out rounded-lg">Habitantes</a>
                    </li>
                    <li class="list-none">
                        <a href="/visitantes" class="text-white p-1 hover:bg-[#f97020ec] transition ease-in-out rounded-lg">Visitantes</a>
                    </li>
                    <li class="list-none">
                        <a href="/contacto" class="text-white p-1 hover:bg-[#f97020ec] transition ease-in-out rounded-lg">Contacto</a>
                    </li>
                    ${mobileHome}
                </ul>
            </header>
            <div id="nav-title-div" class="z-[1] w-full justify-self-center absolute max-w-[800px] grid auto-rows-max content-end gap-8 text-center p-0 top-52">
                <h1 id="nav-title" class="text-4xl min-[900px]:text-5xl text-center font-bold">
                    ${title}
                </h1>
                <p id="nav-paragraph" class="text-base">
                    ${paragraph}
                    ${ifContact}
                </p>
            </div>
        `;

        const navBtn = navbar.children[1].children[1];
        const menuMobile = navbar.children[1].children[3];
        
        navBtn.addEventListener('click', e => {
            if (!navBtn.classList.contains('active')) {
                navBtn.classList.add('active');
                navBtn.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />"';
                menuMobile.classList.remove('hidden');
                menuMobile.classList.add('flex');
            } else {
                navBtn.classList.remove('active');
                navBtn.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />'
                menuMobile.classList.add('hidden');
                menuMobile.classList.remove('flex');
            }
        });

        const closeBtnDesktop = navbar.children[1].children[2].lastElementChild.children[0];
        const closeBtnMobile = navbar.children[1].children[3].lastElementChild.children[0];

        const close = async () => {
            try {
                await axios.get('/api/logout');
                window.location.pathname = '/login';
            } catch (error) {
                console.log(error);
            }
        };
        closeBtnDesktop.addEventListener('click', async e => {
            close()
        });
        closeBtnMobile.addEventListener('click', async e => {
            close()
        });

        //Si se scrollea, se oculta el menú en caso de haber estado visible
        window.addEventListener('scroll', (e) => {
            navBtn.classList.remove('active');
            navBtn.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />'
            menuMobile.classList.add('hidden');
            menuMobile.classList.remove('flex');
        });

        if (pathName.includes('/project/') && logged) {
            let vdesktop = document.querySelector('#vdesktop');
            let vmobile = document.querySelector('#vmobile');
            const pathProject = pathName.split('/')[2];
            
            
            projectnav(pathProject, vdesktop, vmobile)
        }

    } catch (error) {
        console.log(error);
        if (error.response?.data.error === 'Usuario no encontrado') {
            window.location.pathname = '/';
        }
    }
})();