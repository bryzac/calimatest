import { createNotification } from "../../components/notification.js";

const details = document.querySelector('#details');
const notification = document.querySelector('#notification');

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
    const { data } = await axios.get(`/api/users/profileDetails/${path}`);
    const { name, email, birthplace, birthday, nextProjects, owner } = data;
    const titleHtml = document.querySelector('title');
    titleHtml.innerHTML = `${name}`;

    let nameHTML = '';
    let emailHTML = '';
    let birthplaceHTML = '';
    let birthdayHTML = '';
    let nextProjectsHTML = '';
    let editBtnHTML = '';

    if (name !== '') {
        nameHTML = `
        <div class="flex flex-row gap-2">
            <p class="font-bold">Nombre</p>
            <p>${name}</p>
        </div>
        `;
    } 
    if (email !== '') {
        emailHTML = `
        <div class="flex flex-row gap-2">
            <p class="font-bold">Correo</p>
            <p>${email}</p>
        </div>
        `;
    } 
    if (birthplace !== '') {
        birthplaceHTML = `
        <div class="flex flex-row gap-2">
            <p class="font-bold">Nacionalidad</p>
            <p>${birthplace}</p>
        </div>
        `;
    }
    if (birthday !== '') {
        birthdayHTML = `
        <div class="flex flex-row gap-2">
            <p class="font-bold">Fecha de nacimiento</p>
            <p>${birthday}</p>
        </div>
        `;
    } 
    if (nextProjects !== '') {
        nextProjectsHTML = `
        <div class="flex flex-row gap-2">
            <p class="font-bold">Futuros proyectos</p>
            <p>${nextProjects}</p>
        </div>
        `;
    }

    if (owner) {
        editBtnHTML = `
        <form id="form" class="grid justify-self-end justify-end w-full gap-4">
            <button 
                id="edit-btn"
                class="bg-[#f97020ec] py-2 px-4 rounded-lg font-bold hover:bg-[#ff4800c2] text-center transition ease-in-out disabled:opacity-50"
            >
                Editar perfil
            </button>

            <button 
                id="contact-btn"
                class="bg-[#191e4dad] py-2 px-4 rounded-lg font-bold hover:bg-[#ff4800c2] text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
            >
                Modificar contactos
            </button>
        </form>
        `;
    } 

    details.innerHTML = `
    <!-- Versión de visualización -->
    <div id="div" class="flex flex-col gap-4 bg-black p-4 rounded-lg text-md shadow-lg lg:w-2/4 md:w-4/5 w-full">
        ${nameHTML}
        ${emailHTML}
        ${birthplaceHTML}
        ${birthdayHTML}
        ${nextProjectsHTML}
        ${editBtnHTML}
    </div>
    `;


    if (owner) {
        const form = document.querySelector('#form');

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (e.submitter.id === 'edit-btn') {
                
            const { name, email, phone, birthplace, nickname, icon, birthday, nextProjects, sentence, semblance, imageprofile } = data;

            let srcImageProfile = '';
            if (imageprofile !== '') {
                srcImageProfile = `/storage/${path}/${imageprofile}`;
            }

            const iconName = icon.toUpperCase()[0] + icon.slice(1).split('.')[0];
            details.innerHTML = `
            <!-- Versión de edición -->
            <form id="form-edit" class="flex flex-col gap-4 bg-black p-4 rounded-lg text-md shadow-lg lg:w-2/4 md:w-4/5 w-full" enctype="multipart/form-data" method="post">
                <div class="flex flex-col gap-2">
                    <label for="name-input" class="font-bold">
                        Nombre
                    </label>
                    <input 
                        type="text" 
                        id="name-input" 
                        name="name-input" 
                        autocomplete="off" 
                        placeholder="${name}"
                        value="${name}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                    >
                </div>

                <div class="flex flex-col gap-2">
                    <label for="imageprofile-input" class="font-bold">
                        Foto de perfil
                    </label>
                    <input 
                        type="file" 
                        accept="image/*"
                        id="imageprofile-input" 
                        name="imageprofileinput"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700 cursor-pointer"
                    >
                    <img src="${srcImageProfile}" 
                        class="w-64 self-center bg-[#f97020ec] py-1 px-1 rounded-lg font-bold hover:bg-[#ff4800c2] cursor-pointer" alt="" 
                        id="image-show"
                    >
                    <button id="delete-image"
                        class="self-end text-red-600 hover:text-red-400 hidden"
                    >
                        Eliminar
                    </button>
                </div>
                
                <div class="flex flex-col gap-2">
                    <label for="email-input" class="font-bold">
                        Correo
                    </label>
                    <input 
                        type="email" 
                        id="email-input" 
                        name="email-input" 
                        autocomplete="off" 
                        placeholder="${email}"
                        value="${email}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                    >
                </div>

                <div class="flex flex-col gap-2">
                    <label for="birthplace-input" class="font-bold">
                        Nacionalidad
                    </label>
                    <select id="birthplace-input" class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
                        <option value="" Selected>${birthplace}</option>
                        <option data-countryCode="GB" value="44">UK</option>
                        <option data-countryCode="US" value="1">USA</option>
                        <option data-countryCode="DZ" value="213">Algeria</option>
                        <option data-countryCode="AD" value="376">Andorra</option>
                        <option data-countryCode="AO" value="244">Angola</option>
                        <option data-countryCode="AI" value="1264">Anguilla</option>
                        <option data-countryCode="AG" value="1268">Antigua &amp; Barbuda</option>
                        <option data-countryCode="AR" value="54">Argentina</option>
                        <option data-countryCode="AM" value="374">Armenia</option>
                        <option data-countryCode="AW" value="297">Aruba</option>
                        <option data-countryCode="AU" value="61">Australia</option>
                        <option data-countryCode="AT" value="43">Austria</option>
                        <option data-countryCode="AZ" value="994">Azerbaijan</option>
                        <option data-countryCode="BS" value="1242">Bahamas</option>
                        <option data-countryCode="BH" value="973">Bahrain</option>
                        <option data-countryCode="BD" value="880">Bangladesh</option>
                        <option data-countryCode="BB" value="1246">Barbados</option>
                        <option data-countryCode="BY" value="375">Belarus</option>
                        <option data-countryCode="BE" value="32">Belgium</option>
                        <option data-countryCode="BZ" value="501">Belize</option>
                        <option data-countryCode="BJ" value="229">Benin</option>
                        <option data-countryCode="BM" value="1441">Bermuda</option>
                        <option data-countryCode="BT" value="975">Bhutan</option>
                        <option data-countryCode="BO" value="591">Bolivia</option>
                        <option data-countryCode="BA" value="387">Bosnia Herzegovina</option>
                        <option data-countryCode="BW" value="267">Botswana</option>
                        <option data-countryCode="BR" value="55">Brazil</option>
                        <option data-countryCode="BN" value="673">Brunei</option>
                        <option data-countryCode="BG" value="359">Bulgaria</option>
                        <option data-countryCode="BF" value="226">Burkina Faso</option>
                        <option data-countryCode="BI" value="257">Burundi</option>
                        <option data-countryCode="KH" value="855">Cambodia</option>
                        <option data-countryCode="CM" value="237">Cameroon</option>
                        <option data-countryCode="CA" value="1">Canada</option>
                        <option data-countryCode="CV" value="238">Cape Verde Islands</option>
                        <option data-countryCode="KY" value="1345">Cayman Islands</option>
                        <option data-countryCode="CF" value="236">Central African Republic</option>
                        <option data-countryCode="CL" value="56">Chile</option>
                        <option data-countryCode="CN" value="86">China</option>
                        <option data-countryCode="CO" value="57">Colombia</option>
                        <option data-countryCode="KM" value="269">Comoros</option>
                        <option data-countryCode="CG" value="242">Congo</option>
                        <option data-countryCode="CK" value="682">Cook Islands</option>
                        <option data-countryCode="CR" value="506">Costa Rica</option>
                        <option data-countryCode="HR" value="385">Croatia</option>
                        <option data-countryCode="CU" value="53">Cuba</option>
                        <option data-countryCode="CY" value="90392">Cyprus North</option>
                        <option data-countryCode="CY" value="357">Cyprus South</option>
                        <option data-countryCode="CZ" value="42">Czech Republic</option>
                        <option data-countryCode="DK" value="45">Denmark</option>
                        <option data-countryCode="DJ" value="253">Djibouti</option>
                        <option data-countryCode="DM" value="1809">Dominica</option>
                        <option data-countryCode="DO" value="1809">Dominican Republic</option>
                        <option data-countryCode="EC" value="593">Ecuador</option>
                        <option data-countryCode="EG" value="20">Egypt</option>
                        <option data-countryCode="SV" value="503">El Salvador</option>
                        <option data-countryCode="GQ" value="240">Equatorial Guinea</option>
                        <option data-countryCode="ER" value="291">Eritrea</option>
                        <option data-countryCode="EE" value="372">Estonia</option>
                        <option data-countryCode="ET" value="251">Ethiopia</option>
                        <option data-countryCode="FK" value="500">Falkland Islands</option>
                        <option data-countryCode="FO" value="298">Faroe Islands</option>
                        <option data-countryCode="FJ" value="679">Fiji</option>
                        <option data-countryCode="FI" value="358">Finland</option>
                        <option data-countryCode="FR" value="33">France</option>
                        <option data-countryCode="GF" value="594">French Guiana</option>
                        <option data-countryCode="PF" value="689">French Polynesia</option>
                        <option data-countryCode="GA" value="241">Gabon</option>
                        <option data-countryCode="GM" value="220">Gambia</option>
                        <option data-countryCode="GE" value="7880">Georgia</option>
                        <option data-countryCode="DE" value="49">Germany</option>
                        <option data-countryCode="GH" value="233">Ghana</option>
                        <option data-countryCode="GI" value="350">Gibraltar</option>
                        <option data-countryCode="GR" value="30">Greece</option>
                        <option data-countryCode="GL" value="299">Greenland</option>
                        <option data-countryCode="GD" value="1473">Grenada</option>
                        <option data-countryCode="GP" value="590">Guadeloupe</option>
                        <option data-countryCode="GU" value="671">Guam</option>
                        <option data-countryCode="GT" value="502">Guatemala</option>
                        <option data-countryCode="GN" value="224">Guinea</option>
                        <option data-countryCode="GW" value="245">Guinea - Bissau</option>
                        <option data-countryCode="GY" value="592">Guyana</option>
                        <option data-countryCode="HT" value="509">Haiti</option>
                        <option data-countryCode="HN" value="504">Honduras</option>
                        <option data-countryCode="HK" value="852">Hong Kong</option>
                        <option data-countryCode="HU" value="36">Hungary</option>
                        <option data-countryCode="IS" value="354">Iceland</option>
                        <option data-countryCode="IN" value="91">India</option>
                        <option data-countryCode="ID" value="62">Indonesia</option>
                        <option data-countryCode="IR" value="98">Iran</option>
                        <option data-countryCode="IQ" value="964">Iraq</option>
                        <option data-countryCode="IE" value="353">Ireland</option>
                        <option data-countryCode="IL" value="972">Israel</option>
                        <option data-countryCode="IT" value="39">Italy</option>
                        <option data-countryCode="JM" value="1876">Jamaica</option>
                        <option data-countryCode="JP" value="81">Japan</option>
                        <option data-countryCode="JO" value="962">Jordan</option>
                        <option data-countryCode="KZ" value="7">Kazakhstan</option>
                        <option data-countryCode="KE" value="254">Kenya</option>
                        <option data-countryCode="KI" value="686">Kiribati</option>
                        <option data-countryCode="KP" value="850">Korea North</option>
                        <option data-countryCode="KR" value="82">Korea South</option>
                        <option data-countryCode="KW" value="965">Kuwait</option>
                        <option data-countryCode="KG" value="996">Kyrgyzstan</option>
                        <option data-countryCode="LA" value="856">Laos</option>
                        <option data-countryCode="LV" value="371">Latvia</option>
                        <option data-countryCode="LB" value="961">Lebanon</option>
                        <option data-countryCode="LS" value="266">Lesotho</option>
                        <option data-countryCode="LR" value="231">Liberia</option>
                        <option data-countryCode="LY" value="218">Libya</option>
                        <option data-countryCode="LI" value="417">Liechtenstein</option>
                        <option data-countryCode="LT" value="370">Lithuania</option>
                        <option data-countryCode="LU" value="352">Luxembourg</option>
                        <option data-countryCode="MO" value="853">Macao</option>
                        <option data-countryCode="MK" value="389">Macedonia</option>
                        <option data-countryCode="MG" value="261">Madagascar</option>
                        <option data-countryCode="MW" value="265">Malawi</option>
                        <option data-countryCode="MY" value="60">Malaysia</option>
                        <option data-countryCode="MV" value="960">Maldives</option>
                        <option data-countryCode="ML" value="223">Mali</option>
                        <option data-countryCode="MT" value="356">Malta</option>
                        <option data-countryCode="MH" value="692">Marshall Islands</option>
                        <option data-countryCode="MQ" value="596">Martinique</option>
                        <option data-countryCode="MR" value="222">Mauritania</option>
                        <option data-countryCode="YT" value="269">Mayotte</option>
                        <option data-countryCode="MX" value="52">Mexico</option>
                        <option data-countryCode="FM" value="691">Micronesia</option>
                        <option data-countryCode="MD" value="373">Moldova</option>
                        <option data-countryCode="MC" value="377">Monaco</option>
                        <option data-countryCode="MN" value="976">Mongolia</option>
                        <option data-countryCode="MS" value="1664">Montserrat</option>
                        <option data-countryCode="MA" value="212">Morocco</option>
                        <option data-countryCode="MZ" value="258">Mozambique</option>
                        <option data-countryCode="MN" value="95">Myanmar</option>
                        <option data-countryCode="NA" value="264">Namibia</option>
                        <option data-countryCode="NR" value="674">Nauru</option>
                        <option data-countryCode="NP" value="977">Nepal</option>
                        <option data-countryCode="NL" value="31">Netherlands</option>
                        <option data-countryCode="NC" value="687">New Caledonia</option>
                        <option data-countryCode="NZ" value="64">New Zealand</option>
                        <option data-countryCode="NI" value="505">Nicaragua</option>
                        <option data-countryCode="NE" value="227">Niger</option>
                        <option data-countryCode="NG" value="234">Nigeria</option>
                        <option data-countryCode="NU" value="683">Niue</option>
                        <option data-countryCode="NF" value="672">Norfolk Islands</option>
                        <option data-countryCode="NP" value="670">Northern Marianas</option>
                        <option data-countryCode="NO" value="47">Norway</option>
                        <option data-countryCode="OM" value="968">Oman</option>
                        <option data-countryCode="PW" value="680">Palau</option>
                        <option data-countryCode="PA" value="507">Panama</option>
                        <option data-countryCode="PG" value="675">Papua New Guinea</option>
                        <option data-countryCode="PY" value="595">Paraguay</option>
                        <option data-countryCode="PE" value="51">Peru</option>
                        <option data-countryCode="PH" value="63">Philippines</option>
                        <option data-countryCode="PL" value="48">Poland</option>
                        <option data-countryCode="PT" value="351">Portugal</option>
                        <option data-countryCode="PR" value="1787">Puerto Rico</option>
                        <option data-countryCode="QA" value="974">Qatar</option>
                        <option data-countryCode="RE" value="262">Reunion</option>
                        <option data-countryCode="RO" value="40">Romania</option>
                        <option data-countryCode="RU" value="7">Russia</option>
                        <option data-countryCode="RW" value="250">Rwanda</option>
                        <option data-countryCode="SM" value="378">San Marino</option>
                        <option data-countryCode="ST" value="239">Sao Tome &amp; Principe</option>
                        <option data-countryCode="SA" value="966">Saudi Arabia</option>
                        <option data-countryCode="SN" value="221">Senegal</option>
                        <option data-countryCode="CS" value="381">Serbia</option>
                        <option data-countryCode="SC" value="248">Seychelles</option>
                        <option data-countryCode="SL" value="232">Sierra Leone</option>
                        <option data-countryCode="SG" value="65">Singapore</option>
                        <option data-countryCode="SK" value="421">Slovak Republic</option>
                        <option data-countryCode="SI" value="386">Slovenia</option>
                        <option data-countryCode="SB" value="677">Solomon Islands</option>
                        <option data-countryCode="SO" value="252">Somalia</option>
                        <option data-countryCode="ZA" value="27">South Africa</option>
                        <option data-countryCode="ES" value="34">Spain</option>
                        <option data-countryCode="LK" value="94">Sri Lanka</option>
                        <option data-countryCode="SH" value="290">St. Helena</option>
                        <option data-countryCode="KN" value="1869">St. Kitts</option>
                        <option data-countryCode="SC" value="1758">St. Lucia</option>
                        <option data-countryCode="SD" value="249">Sudan</option>
                        <option data-countryCode="SR" value="597">Suriname</option>
                        <option data-countryCode="SZ" value="268">Swaziland</option>
                        <option data-countryCode="SE" value="46">Sweden</option>
                        <option data-countryCode="CH" value="41">Switzerland</option>
                        <option data-countryCode="SI" value="963">Syria</option>
                        <option data-countryCode="TW" value="886">Taiwan</option>
                        <option data-countryCode="TJ" value="7">Tajikstan</option>
                        <option data-countryCode="TH" value="66">Thailand</option>
                        <option data-countryCode="TG" value="228">Togo</option>
                        <option data-countryCode="TO" value="676">Tonga</option>
                        <option data-countryCode="TT" value="1868">Trinidad &amp; Tobago</option>
                        <option data-countryCode="TN" value="216">Tunisia</option>
                        <option data-countryCode="TR" value="90">Turkey</option>
                        <option data-countryCode="TM" value="7">Turkmenistan</option>
                        <option data-countryCode="TM" value="993">Turkmenistan</option>
                        <option data-countryCode="TC" value="1649">Turks &amp; Caicos Islands</option>
                        <option data-countryCode="TV" value="688">Tuvalu</option>
                        <option data-countryCode="UG" value="256">Uganda</option>
                        <option data-countryCode="UA" value="380">Ukraine</option>
                        <option data-countryCode="AE" value="971">United Arab Emirates</option>
                        <option data-countryCode="UY" value="598">Uruguay</option>
                        <option data-countryCode="UZ" value="7">Uzbekistan</option>
                        <option data-countryCode="VU" value="678">Vanuatu</option>
                        <option data-countryCode="VA" value="379">Vatican City</option>
                        <option data-countryCode="VE" value="58">Venezuela</option>
                        <option data-countryCode="VN" value="84">Vietnam</option>
                        <option data-countryCode="VG" value="84">Virgin Islands - British</option>
                        <option data-countryCode="VI" value="84">Virgin Islands - US</option>
                        <option data-countryCode="WF" value="681">Wallis &amp; Futuna</option>
                        <option data-countryCode="YE" value="969">Yemen(+969)</option>
                        <option data-countryCode="YE" value="967">Yemen(+967)</option>
                        <option data-countryCode="ZM" value="260">Zambia</option>
                        <option data-countryCode="ZW" value="263">Zimbabwe</option>
                    </select>
                </div>

                <div class="flex flex-col gap-2">
                <label for="phone-input" class="font-bold">
                    Número telefónico
                </label>
                <div class="flex gap-4">
                <label for="phone-input" class="font-bold text-white rounded-lg p-2">
                    +
                </label>
                        <input 
                            type="tel" 
                            id="phone-input" 
                            name="phone-input" 
                            autocomplete="off" 
                            placeholder="${phone}"
                            value="${phone.split('+')[1]}"
                            class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                        >
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="nickname-input" class="font-bold">
                        Apodo
                    </label>
                    <input 
                        type="name" 
                        id="nickname-input" 
                        name="nickname-input" 
                        autocomplete="off" 
                        placeholder="${nickname}"
                        value="${nickname}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                    >
                </div>

                <div class="flex flex-col gap-2">
                    <label for="icon-input" class="font-bold">
                        Ícono
                    </label>
                    <select id="icon-input" class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
                        <option value="${icon}" Selected>${iconName}</option>
                        <option value="hojita.svg">Hojita</option>
                        <option value="pino.svg">Pino</option>
                        <option value="pincel.svg">Pincel</option>
                        <option value="flor.svg">Flor</option>
                        <option value="castillo.svg">Castillo</option>
                    </select>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="birthday-input" class="font-bold">
                        Fecha de nacimiento
                    </label>
                    <input 
                        type="date" 
                        id="birthday-input" 
                        name="birthday-input" 
                        autocomplete="off"
                        value="${birthday}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                    >
                </div>

                <div class="flex flex-col gap-2">
                    <label for="sentence-input" class="font-bold">
                        Frase de inicio
                    </label>
                    <input 
                        type="text" 
                        id="sentence-input" 
                        name="sentence-input" 
                        autocomplete="off" 
                        placeholder="${sentence}"
                        value="${sentence}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                    >
                </div>

                <div class="flex flex-col gap-2">
                    <label for="nextProjects-input" class="font-bold">
                        Futuros proyectos
                    </label>
                    <input 
                        type="text" 
                        id="nextProjects-input" 
                        name="nextProjects-input" 
                        autocomplete="off" 
                        placeholder="${nextProjects}"
                        value="${nextProjects}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                    >
                </div>

                <div class="flex flex-col gap-2">
                    <label for="semblance-input" class="font-bold">
                        Semblanza
                    </label>
                    <textarea
                        id="semblance-input" 
                        name="semblance-input" 
                        cols="30" 
                        rows="7" 
                        placeholder="${semblance}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                    >${semblance}</textarea>
                </div>

                <div class="flex flex-raw gap-2 items-end py-2 self-end">
                    <label for="public-input" class="font-bold">
                        Eliminar perfil
                    </label>
                    <button id="delete-profile"
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
                    class="bg-red-600 py-2 px-4 rounded-lg font-bold hover:bg-red-500 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black w-1/3 mx-auto"
                >
                    Cancelar
                </button>
            </form>
            `;

            const formEdit = document.querySelector('#form-edit');
            const nameInput = document.querySelector('#name-input');
            const emailInput = document.querySelector('#email-input');
            const birthplaceInput = document.querySelector('#birthplace-input');
            const phoneInput = document.querySelector('#phone-input');
            const nicknameInput = document.querySelector('#nickname-input');
            const iconInput = document.querySelector('#icon-input');
            const birthdayInput = document.querySelector('#birthday-input');
            const nextProjectsInput = document.querySelector('#nextProjects-input');
            const sentenceInput = document.querySelector('#sentence-input');
            const semblanceInput = document.querySelector('#semblance-input');
            const saveBtn = document.querySelector('#save-btn');
            const imageprofileInput = document.querySelector('#imageprofile-input');   
            
            const imageShow = document.querySelector('#image-show');
            let imageLoaded = false;
            let imageDeleted = false;

            const deleteProfile = document.querySelector('#delete-profile');

            // Regex Validations
            const NAME_VALIDATION = /^[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]+(\s*[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]*)+(\s*[A-Z-ÁÉÍÓÚ\u00d1][a-zA-Z-ÿáéíóúÁÉÍÓÚ\u00f1\u00d1]*)?$/;
            const EMAIL_VALIDATION = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            const PHONE_VALIDATION = /^[0-9]{8,16}$/;

            // Validations
            let nameValidation = true;
            let emailValidation = true;
            let phoneValidation = true;
            let iconValidation = true;

            const validation = (input, regexValidation) => {
                saveBtn.disabled = nameValidation && emailValidation && phoneValidation && iconValidation ? false : true;
            
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
            nameInput.addEventListener('input', e => {
                nameValidation = NAME_VALIDATION.test(e.target.value);
                validation(nameInput, nameValidation);
            });

            emailInput.addEventListener('input', e => {
                emailValidation = EMAIL_VALIDATION.test(e.target.value);
                validation(emailInput, emailValidation);
            });

            phoneInput.addEventListener('input', e => {
                phoneValidation = PHONE_VALIDATION.test(e.target.value);
                validation(phoneInput, phoneValidation);
            });

            iconInput.addEventListener('input', e => {
                const optionSelected = [...e.target.children].find(option => option.selected);
                iconValidation = optionSelected.value;
                validation(iconInput, iconValidation);
            });

            const deleteImage = document.querySelector('#delete-image');
            if (imageprofile !== '') {
                deleteImage.classList.remove('hidden');
            };

            imageShow.addEventListener('click', () => imageprofileInput.click());
            imageprofileInput.addEventListener('change', async (file) => {
                imageShow.classList.add('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
                const fileUpload = file.target.files[0];
                if (fileUpload) {
                    const reader = new FileReader();
        
                    reader.onload = async () => {
                        const output = imageShow;
                        output.src = reader.result;                
                    };
                    reader.readAsDataURL(fileUpload);
                    imageLoaded = true;
                    deleteImage.classList.remove('hidden');
                };
            });

            deleteImage.addEventListener('click', () => {
                if (confirm('¿Desea eliminar la imagen seleccionada?')) {
                    imageShow.src = '';
                    imageShow.classList.remove('w-64', 'self-center', 'bg-[#f97020ec]', 'py-1', 'px-1', 'rounded-lg', 'font-bold', 'hover:bg-[#ff4800c2]', 'cursor-pointer');
                    deleteImage.classList.add('hidden');
                    imageprofileInput.value = '';
                    imageLoaded = false;
                    imageDeleted = true;
                }
            });

            deleteProfile.addEventListener('click', async (e) => {
                let promptDelete = prompt('Si desea eliminar el perfil, por favor escriba Eliminar.');
                try {
                    if (promptDelete === 'Eliminar') {
                        await axios.delete(`/api/users/${path}`);
                        textNotification = 'Perfil eliminado exitosamente';
                        isNotificationTrue = false;
                        message(isNotificationTrue, textNotification);
                        console.log(window.location.origin)
                        setTimeout(() => window.location = window.location.origin, 1000);
                    } else {
                        textNotification = 'Perfil no eliminado';
                        isNotificationTrue = true;
                        message(isNotificationTrue, textNotification);
                    }
                } catch (error) {
                    console.log(error);
                    textNotification = 'No se pudo eliminar el perfil';
                    isNotificationTrue = true;
                    message(isNotificationTrue, textNotification);
                    setTimeout(() => window.location.pathname, 2000);
                }
            });
            
            formEdit.addEventListener('submit', async e => {
                e.preventDefault();
                if (e.submitter.id === 'save-btn') {
                    try {
                        const country = [...birthplaceInput.children].find(option => option.selected);
                        
                        let imageFilename;
                        if (imageLoaded) {
                            imageFilename = await axios.post(`/storage/profile/${path}`, formEdit);
                        }

                        if (imageDeleted) {
                            imageFilename = await axios.patch(`/storage/deleteprofile/${path}`, formEdit);
                        }
                        
                        await axios.patch(`/api/users/profileDetails/`, {
                            name: nameInput.value, 
                            email: emailInput.value, 
                            birthplace: country.textContent, 
                            phone: '+' + phoneInput.value,
                            nickname: nicknameInput.value,
                            icon: iconInput.value,
                            birthday: birthdayInput.value,
                            nextProjects: nextProjectsInput.value,
                            sentence: sentenceInput.value,
                            semblance: semblanceInput.value,
                        });
                
                        textNotification = 'Usuario actualizado';
                        isNotificationTrue = false;
                        message(isNotificationTrue, textNotification);
                        
                        window.location.reload();
                
                    } catch (error) {
                        console.log(error);
                    };
                }

                if (e.submitter.id === 'cancel-btn') {
                    e.preventDefault();
                    window.location.reload();
                }
            });
            };

            if (e.submitter.id === 'contact-btn') {
                e.preventDefault();
                const { data } = await axios.get('/api/users/contact/');
                const { instagram, twitter, linktr, allmylinks, whatsapp, telegram, facebookUrl, facebook, youtubeUrl, youtube, linkedInUrl, linkedIn } = data;
                details.innerHTML = `
                <!-- Versión de edición contacto -->
                <form id="form-contact" class="flex flex-col gap-4 bg-black p-4 rounded-lg text-md shadow-lg lg:w-2/4 md:w-4/5 w-full">
                    
                    <!-- Instagram -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">Instagram</p>
                        <label for="instagram-input">
                            Indica tu usuario de Instagram
                        </label>
                        <div class="flex flex-row gap-2">
                            <p class="text-sm self-center">https://www.instagram.com/</p>
                            <input 
                                type="text" 
                                id="instagram-input" 
                                name="instagram-input" 
                                autocomplete="off" 
                                placeholder="${instagram}"
                                value="${instagram}"
                                class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                            >
                        </div>
                    </div>

                    <!-- Twitter -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">Twitter</p>
                        <label for="twitter-input">
                            Indica tu usuario de Twitter
                        </label>
                        <div class="flex flex-row gap-2">
                            <p class="text-sm self-center">https://www.twitter.com/</p>
                            <input 
                                type="text" 
                                id="twitter-input" 
                                name="twitter-input" 
                                autocomplete="off" 
                                placeholder="${twitter}"
                                value="${twitter}"
                                class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                            >
                        </div>
                    </div>

                    <!-- Linktree -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">Linktree</p>
                        <label for="linktree-input">
                            Indica tu usuario de Linktree
                        </label>
                        <div class="flex flex-row gap-2">
                            <p class="text-sm self-center">https://www.linktr.ee/</p>
                            <input 
                                type="text" 
                                id="linktree-input" 
                                name="linktree-input" 
                                autocomplete="off" 
                                placeholder="${linktr}"
                                value="${linktr}"
                                class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                            >
                        </div>
                    </div>

                    <!-- Allmylinks -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">Allmylinks</p>
                        <label for="allmylinks-input">
                            Indica tu usuario de Allmylinks
                        </label>
                        <div class="flex flex-row gap-2">
                            <p class="text-sm self-center">https://www.allmylinks.com/</p>
                            <input 
                                type="text" 
                                id="allmylinks-input" 
                                name="allmylinks-input" 
                                autocomplete="off" 
                                placeholder="${allmylinks}"
                                value="${allmylinks}"
                                class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                            >
                        </div>
                    </div>

                    <!-- WhatsApp -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">WhatsApp</p>
                        <label for="whatsapp-input">
                            Indica tu número de WhatsApp <span>Debe indicarse en formato internacional</span>
                        </label>
                        <div class="flex flex-row gap-2">
                            <p class="text-sm self-center">https://wa.me/</p>
                            <input 
                                type="text" 
                                id="whatsapp-input" 
                                name="whatsapp-input" 
                                autocomplete="off" 
                                placeholder="${whatsapp}"
                                value="${whatsapp}"
                                class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                            >
                        </div>
                    </div>

                    <!-- Telegram -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">Telegram</p>
                        <label for="telegram-input">
                            Indica tu usuario de Telegram
                        </label>
                        <div class="flex flex-row gap-2">
                            <p class="text-sm self-center">https://t.me/</p>
                            <input 
                                type="text" 
                                id="telegram-input" 
                                name="telegram-input" 
                                autocomplete="off" 
                                placeholder="${telegram}"
                                value="${telegram}"
                                class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                            >
                        </div>
                    </div>

                    <!-- Facebook -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">Facebook</p>
                        <label for="facebook-url-input">
                            Anota el enlace de tu cuenta de Facebook
                        </label>
                        <input 
                        type="url" 
                        id="facebook-url-input" 
                        name="facebook-url-input" 
                        autocomplete="off" 
                        placeholder="${facebookUrl}"
                        value="${facebookUrl}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                        >
                        <label for="url-facebook-input">
                            Indica tu nombre de Facebook
                        </label>
                        <input 
                            type="text" 
                            id="facebook-input" 
                            name="facebook-input" 
                            autocomplete="off" 
                            placeholder="${facebook}"
                            value="${facebook}"
                            class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                        >
                    </div>

                    <!-- Youtube -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">Youtube</p>
                        <label for="youtube-url-input">
                            Anota el enlace de tu canal de Youtube
                        </label>
                        <input 
                        type="url" 
                        id="youtube-url-input" 
                        name="youtube-url-input" 
                        autocomplete="off" 
                        placeholder="${youtubeUrl}"
                        value="${youtubeUrl}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                        >
                        <label for="youtube-input">
                            Indica el nombre de tu canal de Youtube
                        </label>
                        <input 
                            type="text" 
                            id="youtube-input" 
                            name="youtube-input" 
                            autocomplete="off" 
                            placeholder="${youtube}"
                            value="${youtube}"
                            class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                        >
                    </div>

                    <!-- LinkedIn -->
                    <div class="flex flex-col gap-2 mb-4">
                        <p class="font-bold text-lg">LinkedIn</p>
                        <label for="linkedIn-url-input">
                            Anota el enlace de tu cuenta de LinkedIn
                        </label>
                        <input 
                        type="url" 
                        id="linkedIn-url-input" 
                        name="linkedIn-url-input" 
                        autocomplete="off" 
                        placeholder="${linkedInUrl}"
                        value="${linkedInUrl}"
                        class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                        >
                        <label for="linkedIn-input">
                            Indica tu usuario de LinkedIn
                        </label>
                        <input 
                            type="text" 
                            id="linkedIn-input" 
                            name="linkedIn-input" 
                            autocomplete="off" 
                            placeholder="${linkedIn}"
                            value="${linkedIn}"
                            class="text-black rounded-lg p-2 bg-zinc-100 focus:outline-slate-700"
                        >
                    </div>
                    
                    <button 
                        id="save-contact-btn"
                        class="bg-[#f97020ec] py-2 px-4 rounded-lg font-bold hover:bg-[#ff4800c2] text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                    >
                        Guardar cambios
                    </button>
                    <button 
                        id="cancel-btn"
                        class="bg-red-600 py-2 px-4 rounded-lg font-bold hover:bg-red-500 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black w-1/3 mx-auto"
                    >
                        Cancelar
                    </button>
                </form>
                `;

                const formContact = document.querySelector('#form-contact');
                let instagramInput = document.querySelector('#instagram-input');
                let twitterInput = document.querySelector('#twitter-input');
                const linktreeInput = document.querySelector('#linktree-input');
                const allmylinksInput = document.querySelector('#allmylinks-input');
                const whatsappInput = document.querySelector('#whatsapp-input');
                const telegramInput = document.querySelector('#telegram-input');
                const facebookUrlInput = document.querySelector('#facebook-url-input');
                const facebookInput = document.querySelector('#facebook-input');
                const youtubeUrlInput = document.querySelector('#youtube-url-input');
                const youtubeInput = document.querySelector('#youtube-input');
                const linkedInUrlInput = document.querySelector('#linkedIn-url-input');
                const linkedInInput = document.querySelector('#linkedIn-input');
                const saveBtn = document.querySelector('#save-contact-btn');

                window.addEventListener("keypress", event => {
                    if (event.key === 'Enter'){
                        event.preventDefault();
                    }
                }, false);

                
                formContact.addEventListener('submit', async e =>{
                    e.preventDefault();

                    if (instagramInput.value.substring(0,1) === '@') {
                        instagramInput = instagramInput.value.split('@')[1];
                    }
                    if (twitterInput.value.substring(0,1) === '@') {
                        twitterInput = twitterInput.value.split('@')[1];
                    }
                    
                    if (e.submitter.id === 'save-contact-btn') {
                        try {
                            await axios.patch('/api/users/contact/', {
                                instagram: instagramInput.value,
                                twitter: twitterInput.value,
                                linktr: linktreeInput.value,
                                allmylinks: allmylinksInput.value,
                                whatsapp: whatsappInput.value,
                                telegram: telegramInput.value,
                                facebookUrl: facebookUrlInput.value,
                                facebook: facebookInput.value,
                                youtubeUrl: youtubeUrlInput.value,
                                youtube: youtubeInput.value,
                                linkedInUrl: linkedInUrlInput.value,
                                linkedIn: linkedInInput.value
                            });

                            textNotification = 'Contactos del usuario actualizados';
                            isNotificationTrue = false;
                            message(isNotificationTrue, textNotification);
                            
                            window.location.reload();

                        } catch (error) {
                            console.log(error);
                        }
                    }
                    if (e.submitter.id === 'cancel-btn') {
                        e.preventDefault();
                        window.location.reload();
                    }
                });
            }
        });
    }
})();