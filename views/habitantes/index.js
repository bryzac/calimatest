const users = document.querySelector('#users');

(async () => {
    try {
        const { data } = await axios.get('/api/users/habitantes');
        data.adminsMap.forEach(user => {
            const div = document.createElement('div');
            const id = user[0]._id;
            const name = user[0].name;
            const semblance = user[0].semblance;
            const imageprofile = user[0].imageprofile;
            let imageDiv = `/storage/${id}/${imageprofile}`;
            if (!imageprofile) {
                imageDiv = '/images/cara.jpg';
            }
            div.id = id;
            div.classList.add('w-full', 'justify-self-center', 'flex', 'md:flex-nowrap', 'flex-wrap', 'items-center', 'justify-around', 'gap-4', 'my-0', 'mx-auto', 'no-underline', 'pb-[13px]', 'pt-[10px]', 'px-[20px]', 'rounded-[24px]', 'transition', 'duration-300', 'bg-black');
            div.innerHTML = `
                <img src="${imageDiv}" style="border-radius: 20%; box-shadow: rgb(236, 115, 30) 0px 0px 5px 5px;" class="min-w-16 max-w-72">
                <div class="grid text-left gap-1 w-full">
                    <h1 class="font-bold text-2xl p-4">${name}</h1>
                    <p class="px-4 text-ellipsis whitespace-nowrap overflow-hidden">${semblance}</p>
                    <a href="/profile/${id}" id="knowledge" 
                        class="mt-4 w-auto justify-self-end grid gap-4 overflow-hidden my-0 no-underline bg-[#f97020ec] py-[8px] px-[17px] rounded-lg transition duration-300 hover:bg-[#ff4800c2]"
                    >
                        Leer más
                    </a>
                </div>
            `;
            users.append(div)
        });
        data.habitantesMap.forEach(user => {
            const div = document.createElement('div');
            const id = user[0]._id;
            const name = user[0].name;
            const semblance = user[0].semblance;
            const imageprofile = user[0].imageprofile;
            let imageDiv = `/storage/${id}/${imageprofile}`;
            if (!imageprofile) {
                imageDiv = '/images/cara.jpg';
            }
            div.id = id;
            div.classList.add('w-full', 'justify-self-center', 'flex', 'md:flex-nowrap', 'flex-wrap', 'items-center', 'justify-around', 'gap-4', 'my-0', 'mx-auto', 'no-underline', 'pb-[13px]', 'pt-[10px]', 'px-[20px]', 'rounded-[24px]', 'transition', 'duration-300', 'bg-black');
            div.innerHTML = `
                <img src="${imageDiv}" style="border-radius: 20%; box-shadow: rgb(236, 115, 30) 0px 0px 5px 5px;" class="min-w-16 max-w-72"">
                <div class="grid text-left gap-1 w-full">
                    <h1 class="font-bold text-2xl p-4">${name}</h1>
                    <p class="px-4 text-ellipsis whitespace-nowrap overflow-hidden">${semblance}</p>
                    <a href="/profile/${id}" id="knowledge" 
                        class="mt-4 w-auto justify-self-end grid gap-4 overflow-hidden my-0 no-underline bg-[#f97020ec] py-[8px] px-[17px] rounded-lg transition duration-300 hover:bg-[#ff4800c2]"
                    >
                        Leer más
                    </a>
                </div>
            `;
            users.append(div)
        });
    } catch (error) {
        console.log(error);
    }
})();