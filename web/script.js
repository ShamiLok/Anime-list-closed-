const mainPage =  document.getElementById('main-page');
const animeCount =  document.getElementById('anime-count');

function loadMainPage(){
    mainPage.innerHTML = 
    `<div class="anime-text">Название</div>
    <input type='text' class="input" id='anime-name' placeholder='Атака титанов'>
    <div class="anime-text">Тип прогресса</div>
    <div id='anime-radio'>
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
    <div id="willwatch">
        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <p>Смотреть позже</p>
    </div>`
    
    const addBtn =  document.getElementById('anim-add-btn');
    const search =  document.getElementById('search');
    const willWatchBtn =  document.getElementById('willwatch');
    const animeListDiv = document.getElementById('anime-list');
    const progressType = document.querySelectorAll('input[name="progressType"]')
    const animeName = document.getElementById("anime-name")
    const progress = document.getElementById("anime-progress")
    const notes = document.getElementById("anime-notes")
    let progressTypePrev = 'сезоны'
    addBtn.addEventListener('click', {handleEvent: addAnime, progressTypePrev: progressTypePrev, progress: progress, animeName: animeName, notes: notes, isMain: true, search: search, animeListDiv: animeListDiv, animeCount: animeCount})
    search.addEventListener('input', {handleEvent: loadAnimeList, isSearch: true, search: search, animeListDiv: animeListDiv, isMain: true}) 
    willWatchBtn.addEventListener('click', loadWillWatchPage)
    
    for (var i = 0; i < progressType.length; i++) {
        progressType[i].addEventListener('change', function() {
            if (this !== progressTypePrev) {
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
    <input class="input" type='button' id='anim-add-btn' value='Добавить' onclick="addAnime">
    <input class="input" type='text' id='search' placeholder='Поиск'>
    <div id="anime-list"></div>
    <div id="willwatch">
        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <p>Просмотренные аниме</p>
    </div>`

    const addBtn =  document.getElementById('anim-add-btn');
    const search =  document.getElementById('search');
    const willWatchBtn =  document.getElementById('willwatch');
    const animeListDiv = document.getElementById('anime-list');
    const progressType = document.querySelectorAll('input[name="progressType"]')
    const animeName = document.getElementById("anime-name")
    const notes = document.getElementById("anime-notes")
    let progressTypePrev = 'сезоны'
    addBtn.addEventListener('click', {handleEvent: addAnime, progressTypePrev: progressTypePrev, isMain: false, search: search, animeListDiv: animeListDiv, animeName: animeName, notes: notes})
    search.addEventListener('input', {handleEvent: loadAnimeList, isSearch: true, search: search, animeListDiv: animeListDiv, isMain: false})
    willWatchBtn.addEventListener('click', loadMainPage)
    
    for (var i = 0; i < progressType.length; i++) {
        progressType[i].addEventListener('change', function() {
            if (this !== progressTypePrev) {
                progressTypePrev = this.value;
            }
        })
    }
    loadAnimeList.call({ isSearch: false, animeListDiv: animeListDiv, isMain: false, animeCount: animeCount });
}

function addAnime() {
    if(this.isMain) {
        if (this.progressTypePrev === "не применимо" && this.progress.value != "")
        return
        
        if (this.progressTypePrev != "не применимо" && this.progress.value === "")
            return

        if(this.animeName.value){
            eel.add_anime({
                'Name': this.animeName.value, 
                'Progress': this.progress.value ? this.progress.value : 'n/d', 
                'ProgressType': this.progressTypePrev, 
                'Notes': this.notes.value ? this.notes.value : 'n/d'
            }, this.isMain)()
            this.animeName.value = ''
            this.progress.value = ''
            this.notes.value = ''
            this.search.value = ''
        }
    } else {
        if(this.animeName.value){
            eel.add_anime({
                'Name': this.animeName.value, 
                'Notes': this.notes.value ? this.notes.value : 'n/d'
            }, this.isMain)()
            this.animeName.value = ''
            this.notes.value = ''
            this.search.value = ''
        }
    }
    
    loadAnimeList.call({ isSearch: false, animeListDiv: this.animeListDiv, isMain: this.isMain, animeCount: this.animeCount });
}

async function loadAnimeList() {
    this.animeListDiv.innerHTML = ''
    try {
        let arr = this.isSearch ? await eel.find_anime(search.value)() : (this.isMain ? await eel.load_main_csv()() : await eel.load_willWatch_csv()());
        arr.reverse().forEach((anime, index) => {
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
                eel.delete_anime(arr.length-index-1, this.isMain)()
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