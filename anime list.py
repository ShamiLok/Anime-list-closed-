import csv, eel, re, os, requests, json, asyncio, aiohttp

eel.init(f'{os.path.dirname(os.path.realpath(__file__))}/web')

anime_list = []
token = ""
baseURL = ""

# загадка с функцией ниже
# если был задан неверный адрес сервера, то функция ниже не будет вызыватся с js (loadSettingPage) пока get_main_csv не выдаст ошибку (где то 10 секунд)
@eel.expose
def getConfigDate(configName):
    try:
        with open("config.json", "r") as config_file:
            config_data = json.load(config_file)
            return(config_data.get(configName))
    except:
        print(f"Ошибка при открытии config.json либо нет такого конфига")
        return False
# как я понял кое какой говнокод не работает нормально с синхронный фукнцией выше, специально для него была разработана асинхронная функция ниже 
async def getConfigDateLocal(configName):
    try:
        with open("config.json", "r") as config_file:
            config_data = json.load(config_file)
            return(config_data.get(configName))
    except:
        print(f"Ошибка при открытии config.json либо нет такого конфига")
        return False

@eel.expose
def setConfigDate(configName, newConfig):
    with open("config.json", "r") as config_file:
        config_data = json.load(config_file)
    config_data[configName] = newConfig
    with open("config.json", "w") as config_file:
        json.dump(config_data, config_file)

async def getToken(user, password):
    try:
        headers = {
            "Content-Type": "application/json",
            "type": "login"
        }
        userData = {
            "username": user,
            "password": password
        }
        async with aiohttp.ClientSession() as session:
            async with session.post(baseURL, data=json.dumps(userData), headers=headers) as response:
                response_text = await response.text()
                return response_text
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при подключении к серверу: {e}")
        return []

async def useToken(baseURL):
    async def getNewToken():
        savedLogin = await getConfigDateLocal("username")
        savedPassword = await getConfigDateLocal("password")
        new_token = await getToken(savedLogin, savedPassword)
        if json.loads(new_token)["status"] != "error":
            setConfigDate("token", new_token)
            token = new_token
            print("Новый токен был получкен")
        else:
            print("Не удалось получить новый токен.")
            # print(json.loads(new_token))
    if (token):
        try:
            headers = {
                "type": "tokenCheck",
                "authorization": f"Bearer {token}"
            }
            async with aiohttp.ClientSession() as session:
                async with session.post(baseURL, headers=headers) as response:
                    response_text = await response.text()
                    if (json.loads(response_text)["message"] == "good"):
                        return
                    else:
                        await getNewToken()

        except requests.exceptions.RequestException as e:
            print(f"Ошибка при подключении к серверу: {e}")
            return []
    else:
        await getNewToken()

if __name__ == "__main__":
    baseURL = ''
    with open("config.json", "r") as config_file:
        config_data = json.load(config_file)
        baseURL = config_data.get("baseURL")
        if(len(config_data.get("token")) > 0):
            token = json.loads(config_data.get("token"))["token"]

@eel.expose
def get_main_csv(whereToSavePrev):
    async def fetch_data():
        await useToken(baseURL)
        anime_list = []
        if whereToSavePrev == 'server':
            async with aiohttp.ClientSession() as session:
                try:
                    anime_list.clear()
                    headers = {"authorization": f"Bearer {token}"}
                    async with session.get(baseURL, params="type=main", headers=headers) as response:
                        data = await response.json()
                        # print(data)
                        for row in data:
                            # print(row)
                            anime_list.append(row)
                        anime_list.pop(0)
                except aiohttp.ClientError as e:
                    print(f"Ошибка при подключении к серверу: {e}")
                    return []
        else:
            try:
                with open('data.csv', newline='', encoding='utf-8') as csvfile:
                    reader = csv.DictReader(csvfile)
                    for row in reader:
                        anime_list.append(row)
            except FileNotFoundError:
                pass
        return anime_list
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(fetch_data())
        return result
    except aiohttp.ClientError as e:
        print(f"Ошибка при подключении к серверу: {e}")
        return []
    return result

@eel.expose
def get_willWatch_csv(whereToSavePrev):
    async def fetch_data():
        anime_list = []
        if whereToSavePrev == 'server':
            async with aiohttp.ClientSession() as session:
                try:
                    anime_list.clear()
                    async with session.get(baseURL, params="type=willwatch", headers={"authorization": f"Bearer {token}"}) as response:
                        data = await response.json()
                        for row in data:
                            # print(row)
                            anime_list.append(row)
                        anime_list.pop(0)
                except aiohttp.ClientError as e:
                    print(f"Ошибка при подключении к серверу: {e}")
                    return []
        else:
            anime_list.clear()
            try:
                with open('willwatch.csv', newline='', encoding='utf-8') as csvfile:
                    reader = csv.DictReader(csvfile)
                    for row in reader:
                        anime_list.append(row)
            except FileNotFoundError:
                pass
        return anime_list
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(fetch_data())
    return result

@eel.expose
def add_anime(newAnime, isMain, whereToSavePrev):
    print("newAnime")
    print(newAnime)
    if(whereToSavePrev == 'server'):
        print("aaaaaaaaaaaaaaaaaa")
        try:
            url = baseURL + "?type=" + ("main" if isMain else "willwatch")
            response = requests.post(url, json=newAnime, headers={"authorization": f"Bearer {token}", "type": "addrow"})
            print("response.content")
            print(response.content)
        except requests.exceptions.RequestException as e:
            print(f"Ошибка: {e}")
            return []
    else:
        if(isMain):
            get_main_csv(whereToSavePrev)
            anime_list.append(newAnime)
            writeCSV('data.csv', isMain)
        else:
            get_willWatch_csv(whereToSavePrev)
            anime_list.append(newAnime)
            writeCSV('willwatch.csv', isMain)

@eel.expose
def delete_anime(index, isMain, whereToSavePrev):
    if(whereToSavePrev == 'server'):
        try:
            url = baseURL + "?type=" + ("main" if isMain else "willwatch")
            response = requests.delete(f"{url}&number={index}", headers={"authorization": f"Bearer {token}"})
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

def writeCSV(CSVName, isMain):
    with open(CSVName, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['ID', 'Name', 'Progress', 'ProgressType', 'Notes'] if isMain else ['ID', 'Name', 'Notes']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for anime in anime_list:
            writer.writerow(anime)

@eel.expose
def getLastID(isMain, whereToSavePrev):
    try:
        if(isMain):
            arr = get_main_csv(whereToSavePrev)
            return(arr[len(arr) - 1] if len(arr)!=0 else 0)
        else:
            arr = get_willWatch_csv(whereToSavePrev)
            return(arr[len(arr) - 1] if len(arr) > 0 else 0)
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при подключении к серверу: {e}")
        return []

#eel.start('index.html', size=(1300, 900))
eel.start('index.html', size=(1300, 900), mode='my_portable_chromium')
