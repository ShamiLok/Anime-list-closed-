import csv
from tkinter import * 
import customtkinter

customtkinter.set_appearance_mode("dark")  # Modes: "System" (standard), "Dark", "Light"
customtkinter.set_default_color_theme("blue")  # Themes: "blue" (standard), "green", "dark-blue"

app = customtkinter.CTk()
app.geometry("400x780")
app.title("Anime List")

frame_1 = customtkinter.CTkFrame(master=app)
frame_1.pack(pady=10, padx=10, fill="both", expand=True)

anime_list = []

def load_csv():
    try:
        with open('data.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                anime_list.append(row)
                listbox.insert(END, f"{row['Name']} - {row['Progress']} - {row['Progress Type']} - {row['Notes']}")
    except FileNotFoundError:
        pass

def add_anime():
    name = name_entry.get()
    progress = progress_entry.get()
    progress_type = progress_type_radio.get()
    notes = notes_entry.get() if notes_entry.get() else "n/d"

    if name:
        anime_list.append({'Name': name, 'Progress': progress, 'Progress Type': progress_type, 'Notes': notes})
        listbox.insert(END, f"{name} - {progress} - {progress_type} - {notes}")

        with open('data.csv', 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['Name', 'Progress', 'Progress Type', 'Notes']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for anime in anime_list:
                writer.writerow(anime)
        name_entry.delete(0, 'end')
        progress_entry.delete(0, 'end')
        notes_entry.delete(0, 'end')

def delete_anime():
    # Получаем индекс выбранного элемента в списке
    selected_index = listbox.curselection()
    if selected_index:
        # Удаляем элемент из списка аниме и из виджета Listbox
        anime_list.pop(selected_index[0])
        listbox.delete(selected_index[0])
        
        # Перезаписываем CSV файл
        with open('data.csv', 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['Name', 'Progress', 'Progress Type', 'Notes']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for anime in anime_list:
                writer.writerow(anime)

name_label = customtkinter.CTkLabel(master=frame_1, text="Название")
name_label.pack()
name_entry = customtkinter.CTkEntry(master=frame_1)
name_entry.pack()

progress_type_label = customtkinter.CTkLabel(master=frame_1, text="Тип прогресса")
progress_type_label.pack()

progress_type_radio = customtkinter.StringVar(value="сезоны")
radiobutton_1 = customtkinter.CTkRadioButton(master=frame_1, variable=progress_type_radio, value="сезоны", text="сезоны")
radiobutton_1.pack(pady=10, padx=10)
radiobutton_2 = customtkinter.CTkRadioButton(master=frame_1, variable=progress_type_radio, value="серии", text="серии")
radiobutton_2.pack(pady=10, padx=10)
radiobutton_3 = customtkinter.CTkRadioButton(master=frame_1, variable=progress_type_radio, value="не применимо", text="не применимо")
radiobutton_3.pack(pady=10, padx=10)

progress_label = customtkinter.CTkLabel(master=frame_1, text="Просмотрено")
progress_label.pack()
progress_entry = customtkinter.CTkEntry(master=frame_1)
progress_entry.pack()

notes_label = customtkinter.CTkLabel(master=frame_1, text="Примечания")
notes_label.pack()
notes_entry = customtkinter.CTkEntry(master=frame_1)
notes_entry.pack()

listbox = Listbox(master=frame_1, width=50, bd=0, bg='grey', fg='#fff')
listbox.pack()

add_button = customtkinter.CTkButton(master=frame_1, command=add_anime, text="Добавить")
add_button.pack(pady=10, padx=10)

delete_button = customtkinter.CTkButton(master=frame_1, command=delete_anime, text="Удалить")
delete_button.pack(pady=10, padx=10)

load_csv()

app.mainloop()