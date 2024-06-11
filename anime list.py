import csv, eel, re, os, requests, json

eel.init(f'{os.path.dirname(os.path.realpath(__file__))}/web')

anime_list = []
willWatch_list = []

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
def get_main_csv():
    try:
        anime_list.clear()
        url = baseURL + "?type=main"
        response = requests.get(url)
        rows = response.text.split("\n")
        for row in csv.DictReader(rows):
            anime_list.append(row)
        return anime_list
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при подключении к серверу: {e}")
        return []

# @eel.expose
# def get_main_csv():
#     anime_list.clear()
#     try:
#         with open('data.csv', newline='', encoding='utf-8') as csvfile:
#             reader = csv.DictReader(csvfile)
#             for row in reader:
#                 anime_list.append(row)
#             return anime_list
#     except FileNotFoundError:
#         pass

@eel.expose
def get_willWatch_csv():
    try:
        willWatch_list.clear()
        url = baseURL + "?type=willwatch"
        response = requests.get(url)
        rows = response.text.split("\n")
        for row in csv.DictReader(rows):
            willWatch_list.append(row)
        return willWatch_list
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при подключении к серверу: {e}")
        return []

    # try:
    #     with open('willwatch.csv', newline='', encoding='utf-8') as csvfile:
    #         reader = csv.DictReader(csvfile)
    #         for row in reader:
    #             anime_list.append(row)
    #         return anime_list
    # except FileNotFoundError:
    #     pass

# @eel.expose
# def add_anime(newAnime, isMain):
#     if(isMain):
#         get_main_csv()
#         anime_list.append(newAnime)
#         writeCSV('data.csv', isMain)
#     else:
#         get_willWatch_csv()
#         will_watch_list.append(newAnime)
#         writeCSV('willwatch.csv', isMain)
@eel.expose
def add_anime(newAnime, isMain):
    try:
        url = baseURL + "?type=" + ("main" if isMain else "willwatch")
        response = requests.post(url, data=newAnime)
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при подключении к серверу: {e}")
        return []
# @eel.expose
# def delete_anime(index, isMain):
#     anime_list.pop(index)
#     if(isMain):
#         writeCSV('data.csv', isMain)
#     else:
#         writeCSV('willwatch.csv', isMain)

@eel.expose
def delete_anime(index, isMain):
    try:
        url = baseURL + "?type=" + ("main" if isMain else "willwatch")
        response = requests.delete(f"{url}&number={index}")
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при подключении к серверу: {e}")
        return []

@eel.expose
def find_anime(name, isMain):
    matching_anime = []
    if (isMain):
        for anime in anime_list:
            if re.search(name, anime['Name'], re.IGNORECASE):
                matching_anime.append(anime)
    else:
        for anime in willWatch_list:
            if re.search(name, anime['Name'], re.IGNORECASE):
                matching_anime.append(anime)
    return matching_anime

# @eel.expose
# def find_anime(name):
#     with open('data.csv', 'r', newline='', encoding='utf-8') as csvfile:
#         reader = csv.DictReader(csvfile)
#         matching_anime = []
#         for anime in reader:
#             if re.search(name, anime['Name'], re.IGNORECASE):
#                 matching_anime.append(anime)
#         return matching_anime

# def writeCSV(CSVName, isMain):
#     with open(CSVName, 'w', newline='', encoding='utf-8') as csvfile:
#         fieldnames = ['Name', 'Progress', 'ProgressType', 'Notes'] if isMain else ['Name', 'Notes']
#         writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
#         writer.writeheader()
#         for anime in anime_list:
#             writer.writerow(anime)

@eel.expose
def getLastID(isMain):
    try:
        if(isMain):
            return(get_main_csv()[len(get_main_csv()) - 1])
        else:
            return(get_willWatch_csv()[len(get_willWatch_csv()) - 1])
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при подключении к серверу: {e}")
        return []


#eel.start('index.html', size=(1300, 900))
eel.start('index.html', size=(1300, 900), mode='my_portable_chromium')
