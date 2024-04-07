let animeName = document.getElementById("anime-name")
let progress = document.getElementById("anime-progress")
let notes = document.getElementById("anime-notes")
let progressType = document.querySelectorAll('input[name="progressType"]')
let animeListDiv = document.getElementById('anime-list');
let addBtn =  document.getElementById('anim-add-btn');
let animeCount =  document.getElementById('anime-count');
let progressTypePrev = 'сезоны'
for (var i = 0; i < progressType.length; i++) {
progressType[i].addEventListener('change', function() {
    (progressTypePrev) ? console.log(progressTypePrev.value): null;
    if (this !== progressTypePrev) {
        progressTypePrev = this.value;
    }
})
}

addBtn.addEventListener('click', addAnime)

function addAnime() {
    if (progressTypePrev === "не применимо" && progress.value != "")
        return
        
    if (progressTypePrev != "не применимо" && progress.value === "")
        return
    if(animeName.value){
        eel.add_anime({
            'Name': animeName.value, 
            'Progress': progress.value ? progress.value : 'n/d', 
            'ProgressType': progressTypePrev, 
            'Notes': notes.value ? notes.value : 'n/d'
        })()
        animeName.value = ''
        progress.value = ''
        notes.value = ''
        loadAnimeList()
    }
    
}
async function loadAnimeList() {
    animeListDiv.innerHTML = ''
    try {
        let arr = await eel.load_csv()();
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
                eel.delete_anime(arr.length-index-1)()
                // loadAnimeList()
                event.target.parentElement.remove();
            });

            let animeListItemWrapper = document.createElement('div');
            animeListItemWrapper.classList.add('anime-list-item-wrapper');

            animeListItemWrapper.appendChild(nameDiv);
            if(anime.ProgressType != "не применимо") {
                animeListItemWrapper.appendChild(progressDiv);
            }
            if(anime.Notes != "n/d") {
                animeListItemWrapper.appendChild(notesDiv);
            }
            animeItemDiv.appendChild(animeListItemWrapper);
            animeItemDiv.appendChild(deleteButton);
            animeListDiv.appendChild(animeItemDiv);
        });
        animeCount.innerText = `Всего добавлено: ${arr.length} тайтлов`

    } catch (error) {
        console.error(error);
    }
}
loadAnimeList()
