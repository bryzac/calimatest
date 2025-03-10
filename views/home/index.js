const users = document.querySelector('#users');

(async () => {
    try {
        const { data } = await axios.get('/api/users/home');

        data.adminsMap.forEach(user => {
            const div = document.createElement("div");
            div.id = user[0]._id;
            div.classList.add('h-48', 'grid', 'gap-4', 'overflow-hidden', 'justify-self-center', 'w-[260px]', 'my-0', 'mx-auto', 'pt-8', 'no-underline', 'bg-[#f97020ec]', 'py-[13px]', 'px-[22px]', 'rounded-[32px]', 'transition', 'duration-300', 'hover:bg-[#ff4800c2]')
            div.innerHTML = `
                <a href="/profile/${user[0]._id}" class="grid gap-2 justify-items-center my-0">
                    <img src="/images/${user[0].icon}" alt="" class="w-10 m-0">
                    <h3 class="font-bold text-xl">${user[0].name}</h3>
                    <p>${user[0].nickname}</p>
                </a>
            `;
            users.append(div);
        });
        data.habitantesMap.forEach(user => {
            const div = document.createElement("div");
            div.id = user[0]._id;
            div.classList.add('h-48', 'grid', 'gap-4', 'overflow-hidden', 'justify-self-center', 'w-[260px]', 'my-0', 'mx-auto', 'pt-8', 'no-underline', 'bg-[#f97020ec]', 'py-[13px]', 'px-[22px]', 'rounded-[32px]', 'transition', 'duration-300', 'hover:bg-[#ff4800c2]')
            div.innerHTML = `
                <a href="/profile/${user[0]._id}" class="grid gap-2 justify-items-center my-0">
                    <img src="/images/${user[0].icon}" alt="" class="w-10 m-0">
                    <h3 class="font-bold text-xl">${user[0].name}</h3>
                    <p>${user[0].nickname}</p>
                </a>
            `;
            users.append(div);
        })
    } catch (error) {
        console.log(error);
    }
})();