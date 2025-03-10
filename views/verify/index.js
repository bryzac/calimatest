const textInfo = document.querySelector('#text-info');

(async () =>{
    try {
        const token = window.location.pathname.split('/')[3];
        const id = window.location.pathname.split('/')[2];

        //Se envía al Verify 
        await axios.patch(`/api/users/verify/${id}/${token}`);
        
        window.location.pathname = '/login/';
    } catch (error) {
        textInfo.innerHTML = error.response.data.error;
    }
})();