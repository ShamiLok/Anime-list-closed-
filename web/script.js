async function wrapper() {
    const mainPage =  document.getElementById('main-page');
    const animeCount =  document.getElementById('anime-count');
    let progressTypePrev = 'сезоны'
    let whereToSavePrev = await eel.getConfigDate("whereToSave")() ? await eel.getConfigDate("whereToSave")() : 'local'

    function loadMainPage(){
        mainPage.innerHTML = 
        `<div class="anime-text">Название</div>
        <input type='text' class="input" id='anime-name' placeholder='Атака титанов'>
        <div class="anime-text">Тип прогресса</div>
        <div id='anime-radio' class='checkBox'>
            <input type="radio" id="season" name="progressType" value="сезоны" checked />
            <label for="season">сезоны</label>
            <input type="radio" id="series" name="progressType" value="серии" />
            <label for="series">серии</label>
            <input type="radio" id="film" name="progressType" value="фильм" />
            <label for="film">фильм</label>
            <input type="radio" id="nd" name="progressType" value="не применимо" />
            <label for="nd">не применимо</label>
        </div>
        <div class="anime-text">Просмотрено</div>
        <input class="input" type='number' id='anime-progress' placeholder='2'>
        <div class="anime-text">Примечания</div>
        <input class="input" type='text' id='anime-notes' placeholder='Класное аниме, плюс просмотрен фильм'>
        <input class="input" type='button' id='anim-add-btn' value='Добавить' onclick="addAnime">
        <input class="input" type='text' id='search' placeholder='Поиск'>
        <div id="anime-list"></div>
        <div id="willwatch" class="openSomethingBtn">
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            <p>Смотреть позже</p>
        </div>
        <div id="settings" class="openSomethingBtn">
            <svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 54 54" xml:space="preserve" stroke="#ffffff">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571 c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571 c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78 C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571 c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571 c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052 c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966 c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42 c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052 c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553 c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114 S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22 C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571 c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854 c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052 c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572 c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294 C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052 c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553 c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78 C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64 c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104 l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z"></path> <path d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7 s7,3.141,7,7S30.859,34,27,34z"></path> </g> </g>
            </svg>
            <p>Настройки</p>
        </div>`
        
        const addBtn =  document.getElementById('anim-add-btn');
        const search =  document.getElementById('search');
        const willWatchBtn =  document.getElementById('willwatch');
        const settingsBtn =  document.getElementById('settings');
        const animeListDiv = document.getElementById('anime-list');
        const progressType = document.querySelectorAll('input[name="progressType"]')
        const animeName = document.getElementById("anime-name")
        const progress = document.getElementById("anime-progress")
        const notes = document.getElementById("anime-notes")
    
        addBtn.addEventListener('click', {handleEvent: addAnime, progress: progress, animeName: animeName, notes: notes, isMain: true, search: search, animeListDiv: animeListDiv, animeCount: animeCount})
        search.addEventListener('input', {handleEvent: loadAnimeList, isSearch: true, search: search, animeListDiv: animeListDiv, isMain: true}) 
        willWatchBtn.addEventListener('click', loadWillWatchPage)
        settingsBtn.addEventListener('click', loadSettingPage)
        
        for (var i = 0; i < progressType.length; i++) {
            progressType[i].addEventListener('change', function() {
                console.log(this.value)
                if (this.value !== progressTypePrev) {
                    progressTypePrev = this.value;
                }
            })
        }
        loadAnimeList.call({ isSearch: false, animeListDiv: animeListDiv, isMain: true, animeCount: animeCount});
    }

    function loadWillWatchPage() {
        mainPage.innerHTML = 
        `<div class="anime-text">Название</div>
        <input type='text' class="input" id='anime-name' placeholder='Атака титанов'>
        <div class="anime-text">Примечания</div>
        <input class="input" type='text' id='anime-notes' placeholder='Заметки'>
        <input class="input" type='button' id='anim-add-btn' value='Добавить'">
        <input class="input" type='text' id='search' placeholder='Поиск'>
        <div id="anime-list"></div>
        <div id="willwatch" class="openSomethingBtn">
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            <p>Просмотренные аниме</p>
        </div>
        <div id="settings" class="openSomethingBtn">
            <svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 54 54" xml:space="preserve" stroke="#ffffff">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571 c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571 c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78 C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571 c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571 c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052 c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966 c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42 c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052 c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553 c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114 S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22 C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571 c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854 c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052 c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572 c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294 C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052 c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553 c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78 C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64 c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104 l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z"></path> <path d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7 s7,3.141,7,7S30.859,34,27,34z"></path> </g> </g>
            </svg>
            <p>Настройки</p>
        </div>`

        const addBtn =  document.getElementById('anim-add-btn');
        const search =  document.getElementById('search');
        const willWatchBtn =  document.getElementById('willwatch');
        const animeListDiv = document.getElementById('anime-list');
        const animeName = document.getElementById("anime-name")
        const notes = document.getElementById("anime-notes")
        const settingsBtn =  document.getElementById('settings');

        addBtn.addEventListener('click', {handleEvent: addAnime, isMain: false, search: search, animeListDiv: animeListDiv, animeName: animeName, notes: notes})
        search.addEventListener('input', {handleEvent: loadAnimeList, isSearch: true, search: search, animeListDiv: animeListDiv, isMain: false})
        willWatchBtn.addEventListener('click', loadMainPage)
        settingsBtn.addEventListener('click', loadSettingPage)
        
        loadAnimeList.call({ isSearch: false, animeListDiv: animeListDiv, isMain: false, animeCount: animeCount });
    }

    async function loadSettingPage() {
        mainPage.innerHTML = `<div class="anime-text">Где сохранять?</div>
        <div id='data-saving' class='checkBox'>
            <input type="radio" id="local" name="localSaving" value="local" checked />
            <label for="local">Локально</label>
            <input type="radio" id="server" name="localSaving" value="server" />
            <label for="server">На веб сервере</label>
        </div>
        <div class="anime-text">Адрес сервера</div>
        <input class="input" type='text' id='serverAddress' placeholder='http://192.168.31.100:22848/index.php'>
        <div id="main" class="openSomethingBtn">
            <svg fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="home-alt-3" class="icon glyph" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0">
                </g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21.71,10.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,12H4v9a1,1,0,0,0,1,1H8a1,1,0,0,0,1-1V15a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v6a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V12h1a1,1,0,0,0,.92-.62A1,1,0,0,0,21.71,10.29Z"></path></g>
            </svg>
            <p>Вернутся на главную</p>
        </div>`
        const mainBtn =  document.getElementById('main');
        const serverAddress = document.getElementById("serverAddress");
        const baseURL = await eel.getConfigDate("baseURL")();
        const whereToSave = document.querySelectorAll('input[name="localSaving"]')

        if (baseURL.length >= 10) {
            serverAddress.value = baseURL
        }

        mainBtn.addEventListener('click', loadMainPage);
        serverAddress.addEventListener('input', async function(event) {
            await eel.setConfigDate("baseURL", serverAddress.value)();
            console.log('Значение изменено на: ', event.target.value);
        });

        for (var i = 0; i < whereToSave.length; i++) {
            whereToSave[i].addEventListener('change', async function() {
                await eel.setConfigDate("whereToSave", this.value)();
                if (this.value !== whereToSavePrev) {
                    whereToSavePrev = this.value;
                }
            })
            if (whereToSavePrev === whereToSave[i].value) {
                whereToSave[i].checked = true
            }
        }
    }

    async function addAnime() {
        let lastid = await eel.getLastID(this.isMain, whereToSavePrev)()
        if(this.isMain) {
            if (progressTypePrev === "не применимо" && this.progress.value != "")
            return
            
            if ((progressTypePrev === "сезоны" || progressTypePrev === "серии") && this.progress.value === "")
                return
            if(this.animeName.value){
                console.log('Number(lastid.ID)')
                console.log(lastid)
                eel.add_anime({
                    'ID': lastid === 0 ? lastid : Number(lastid.ID) + 1,
                    'Name': this.animeName.value, 
                    'Progress': this.progress.value ? this.progress.value : 'n/d', 
                    'ProgressType': progressTypePrev, 
                    'Notes': this.notes.value ? this.notes.value : 'n/d'
                }, this.isMain, whereToSavePrev)()
                this.animeName.value = ''
                this.progress.value = ''
                this.notes.value = ''
                this.search.value = ''
            }
        } else {
            if(this.animeName.value){
                eel.add_anime({
                    'ID': lastid === 0 ? lastid : Number(lastid.ID) + 1,
                    'Name': this.animeName.value, 
                    'Notes': this.notes.value ? this.notes.value : 'n/d'
                }, this.isMain, whereToSavePrev)()
                this.animeName.value = ''
                this.notes.value = ''
                this.search.value = ''
            }
        }
        
        loadAnimeList.call({ isSearch: false, animeListDiv: this.animeListDiv, isMain: this.isMain, animeCount: this.animeCount });
    }

    async function loadAnimeList() {
        console.log('loadAnimeList')
        this.animeListDiv.innerHTML = ''
        try {
            let arr = this.isSearch ? await eel.find_anime(search.value, this.isMain, whereToSavePrev)() : (this.isMain ? await eel.get_main_csv(whereToSavePrev)() : await eel.get_willWatch_csv(whereToSavePrev)());
            console.log(arr)
            arr.reverse().forEach((anime) => {
                let animeItemDiv = document.createElement('div');
                animeItemDiv.classList.add('anime-list-item');

                let nameDiv = document.createElement('div');
                nameDiv.classList.add('anime-list-item-name');
                nameDiv.textContent = anime.Name;

                let progressDiv = document.createElement('div');
                progressDiv.classList.add('anime-list-item-progress');
                progressDiv.textContent = anime.Progress + ' ' +  anime.ProgressType;

                let notesDiv = document.createElement('div');
                notesDiv.classList.add('anime-list-item-notes');
                notesDiv.textContent = anime.Notes;

                let deleteButton = document.createElement('a');
                deleteButton.textContent = 'X';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', (event) => {
                    eel.delete_anime(anime.ID, this.isMain, whereToSavePrev)()
                    event.target.parentElement.remove();
                });

                let animeListItemWrapper = document.createElement('div');
                animeListItemWrapper.classList.add('anime-list-item-wrapper');

                animeListItemWrapper.appendChild(nameDiv);
                if(anime.ProgressType != "не применимо" && this.isMain) {
                    animeListItemWrapper.appendChild(progressDiv);
                }
                if(anime.Notes != "n/d") {
                    animeListItemWrapper.appendChild(notesDiv);
                }
                animeItemDiv.appendChild(animeListItemWrapper);
                animeItemDiv.appendChild(deleteButton);
                this.animeListDiv.appendChild(animeItemDiv);
            });
            animeCount.innerText = this.isSearch && this.search.value != 0 ? `Всего найдено: ${arr.length} тайтлов` : `Всего добавлено: ${arr.length} тайтлов`

        } catch (error) {
            console.error(error);
        }
    }

    loadMainPage()
}
wrapper()