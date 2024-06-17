import csv, eel, re, os, requests, json

eel.init(f'{os.path.dirname(os.path.realpath(__file__))}/web')

anime_list = []

# загадка с функцией ниже
# если был задан неверный адрес сервера, то функция ниже не будет вызыватся с js (loadSettingPage) пока get_main_csv не выдаст ошибку (где то 10 секунд)
@eel.expose
def getConfigDate(configName):
    with open("config.json", "r") as config_file:
        config_data = json.load(config_file)
        return(config_data[configName])

@eel.expose
def setConfigDate(configName, newConfig):
    with open("config.json", "r") as config_file:
        config_data = json.load(config_file)
    config_data[configName] = newConfig
    with open("config.json", "w") as config_file:
        json.dump(config_data, config_file)


baseURL = getConfigDate("baseURL")

@eel.expose
def get_main_csv(localSavingPrev):
    if(localSavingPrev == 'server'):
        try:
            anime_list.clear()
            url = baseURL + "?type=main"
            response = requests.get(url)
            response.encoding = 'utf-8'
            data = response.json()
            for row in data:
                anime_list.append({
                    "ID": row[0],
                    "Name": row[1],
                    "Progress": row[2],
                    "ProgressType": row[3],
                    "Notes": row[4]
                })
            anime_list.pop(0)
            return anime_list
        except requests.exceptions.RequestException as e:
            print(f"Ошибка при подключении к серверу: {e}")
            return []
    else:
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
def get_willWatch_csv(localSavingPrev):
    if(localSavingPrev == 'server'):
        try:
            anime_list.clear()
            url = baseURL + "?type=willwatch"
            response = requests.get(url)
            response.encoding = 'utf-8'
            data = response.json()
            for row in data:
                anime_list.append({
                    "ID": row[0],
                    "Name": row[1],
                    "Notes": row[2]
                })
            anime_list.pop(0)
            return anime_list
        except requests.exceptions.RequestException as e:
            print(f"Ошибка при подключении к серверу: {e}")
            return []
    else: 
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
def add_anime(newAnime, isMain, localSavingPrev):
    if(localSavingPrev == 'server'):
        try:
            url = baseURL + "?type=" + ("main" if isMain else "willwatch")
            response = requests.post(url, data=newAnime)
        except requests.exceptions.RequestException as e:
            print(f"Ошибка при подключении к серверу: {e}")
            return []
    else:
        if(isMain):
            get_main_csv(localSavingPrev)
            anime_list.append(newAnime)
            writeCSV('data.csv', isMain)
        else:
            get_willWatch_csv(localSavingPrev)
            anime_list.append(newAnime)
            writeCSV('willwatch.csv', isMain)

@eel.expose
def delete_anime(index, isMain, localSavingPrev):
    if(localSavingPrev == 'server'):
        try:
            url = baseURL + "?type=" + ("main" if isMain else "willwatch")
            response = requests.delete(f"{url}&number={index}")
        except requests.exceptions.RequestException as e:
            print(f"Ошибка при подключении к серверу: {e}")
            return []
    else:
        newArr = []
        for anime in anime_list:
            if(anime['ID'] != index):
                newArr.append(anime)
        anime_list[:] = newArr[:]
        if(isMain):
            writeCSV('data.csv', isMain)
        else:
            writeCSV('willwatch.csv', isMain)

@eel.expose
def find_anime(name, isMain, localSavingPrev):
    if(localSavingPrev == 'server'):
        matching_anime = []
        for anime in anime_list:
            if re.search(name, anime['Name'], re.IGNORECASE):
                matching_anime.append(anime)
        return matching_anime
    else:
        def readCSV(CSVName):
            with open(CSVName, 'r', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                matching_anime = []
                for anime in reader:
                    if re.search(name, anime['Name'], re.IGNORECASE):
                        matching_anime.append(anime)
                return matching_anime
        if(isMain):
            readCSV('data.csv')
        else:
            readCSV('willwatch.csv')

def writeCSV(CSVName, isMain):
    with open(CSVName, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['ID', 'Name', 'Progress', 'ProgressType', 'Notes'] if isMain else ['ID', 'Name', 'Notes']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for anime in anime_list:
            writer.writerow(anime)

@eel.expose
def getLastID(isMain, localSavingPrev):
        try:
            if(isMain):
                arr = get_main_csv(localSavingPrev)
                return(arr[len(arr) - 1] if len(arr)!=0 else 0)
            else:
                arr = get_willWatch_csv(localSavingPrev)
                return(arr[len(arr) - 1] if len(arr) > 0 else 0)
        except requests.exceptions.RequestException as e:
            print(f"Ошибка при подключении к серверу: {e}")
            return []

#eel.start('index.html', size=(1300, 900))
eel.start('index.html', size=(1300, 900), mode='my_portable_chromium')
