import csv, eel, re

eel.init('web')

anime_list = []

@eel.expose
def load_main_csv():
    anime_list.clear()
    try:
        with open('data.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                anime_list.append(row)
            return anime_list
    except FileNotFoundError:
        pass

@eel.expose
def load_willWatch_csv():
    anime_list.clear()
    try:
        with open('willwatch.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                anime_list.append(row)
            return anime_list
    except FileNotFoundError:
        pass

@eel.expose
def add_anime(newAnime, isMain):
    if(isMain):
        load_main_csv()
        anime_list.append(newAnime)
        writeCSV('data.csv', isMain)
    else:
        load_willWatch_csv()
        anime_list.append(newAnime)
        writeCSV('willwatch.csv', isMain)
    
    
@eel.expose
def delete_anime(index, isMain):
    anime_list.pop(index)
    if(isMain):
        writeCSV('data.csv', isMain)
    else:
        writeCSV('willwatch.csv', isMain)

@eel.expose
def find_anime(name):
    with open('data.csv', 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        matching_anime = []
        for row in reader:
            if re.search(name, row['Name'], re.IGNORECASE):
                matching_anime.append(row)
        return matching_anime

def writeCSV(CSVName, isMain):
    with open(CSVName, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Name', 'Progress', 'ProgressType', 'Notes'] if isMain else ['Name', 'Notes']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for anime in anime_list:
            writer.writerow(anime)

eel.start('index.html', size=(1300, 900))