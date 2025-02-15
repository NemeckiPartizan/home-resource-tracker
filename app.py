from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import date

app = Flask(__name__)

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS energy_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            resource_type TEXT NOT NULL,
            value REAL NOT NULL,
            notes TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Маршрут для главной страницы
@app.route('/')
def home():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM energy_usage ORDER BY id DESC')
    data = cursor.fetchall()
    conn.close()
    return render_template('index.html', data=data)


# Маршрут для добавления данных
@app.route('/add_data', methods=['POST'])
def add_data():
    try:
        # Получаем данные из запроса
        data = request.get_json()

        # Проверяем, что обязательные поля заполнены
        if not all([data.get("electricity"), data.get("gas"), data.get("water")]):
            return jsonify({"error": "Заполните все обязательные поля."}), 400

        current_date = date.today().isoformat()
        comment = data.get("comment", "")

        # Сохраняем данные в базу
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()

        # Электроэнергия
        cursor.execute(
            'INSERT INTO energy_usage (date, resource_type, value, notes) VALUES (?, ?, ?, ?)',
            (current_date, "electricity", float(data["electricity"]), comment)
        )

        # Газ
        cursor.execute(
            'INSERT INTO energy_usage (date, resource_type, value, notes) VALUES (?, ?, ?, ?)',
            (current_date, "gas", float(data["gas"]), comment)
        )

        # Вода
        cursor.execute(
            'INSERT INTO energy_usage (date, resource_type, value, notes) VALUES (?, ?, ?, ?)',
            (current_date, "water", float(data["water"]), comment)
        )

        conn.commit()
        conn.close()

        return jsonify({"message": "Данные успешно сохранены!"}), 200
    except Exception as e:
        print("Ошибка:", e)
        return jsonify({"error": "Произошла ошибка при сохранении данных."}), 500
    

@app.route('/view_data')
def view_data():
    # Подключаемся к базе данных и получаем данные
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM energy_usage ORDER BY id DESC')
    data = cursor.fetchall()
    conn.close()

    # Рендерим шаблон для просмотра данных
    return render_template('view_data.html', data=data)

@app.route('/get_data')
def get_data():
    # Подключаемся к базе данных и получаем данные
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM energy_usage ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()

    # Преобразуем данные в список словарей
    data = []
    for row in rows:
        data.append({
            "date": row[1],
            "resource_type": row[2],
            "value": row[3],
            "notes": row[4]
        })

    return jsonify(data)

# Точка входа в приложение
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=9000)