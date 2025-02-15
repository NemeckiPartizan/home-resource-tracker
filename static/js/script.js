// Функция для загрузки данных из базы
async function loadData() {
    try {
        const response = await fetch("/get_data");
        const data = await response.json();

        // Очищаем таблицу
        const tableBody = document.querySelector("#data-table tbody");
        tableBody.innerHTML = "";

        // Заполняем таблицу новыми данными
        if (data.length > 0) {
            data.forEach(row => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${row.date}</td>
                    <td>${row.resource_type}</td>
                    <td>${row.value}</td>
                    <td>${row.notes || ""}</td>
                `;
                tableBody.appendChild(tr);
            });
        } else {
            tableBody.innerHTML = "<tr><td colspan='4'>Нет сохраненных данных.</td></tr>";
        }
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

// Получаем форму
const form = document.getElementById("resource-form");

// Добавляем обработчик события отправки формы
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение

    // Собираем данные из формы
    const electricity = document.getElementById("electricity").value;
    const gas = document.getElementById("gas").value;
    const water = document.getElementById("water").value;
    const comment = document.getElementById("comment").value;

    // Проверяем, что обязательные поля заполнены
    if (!electricity || !gas || !water) {
        alert("Пожалуйста, заполните все обязательные поля.");
        return;
    }

    // Формируем объект данных
    const data = {
        electricity,
        gas,
        water,
        comment,
    };

    try {
        // Отправляем данные на сервер (POST-запрос)
        const response = await fetch("/add_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Указываем формат JSON
            },
            body: JSON.stringify(data), // Преобразуем данные в JSON
        });

        if (response.ok) {
            alert("Данные успешно сохранены!");

            // Обновляем таблицу
            loadData();

            // Очищаем форму
            form.reset();
        } else {
            alert("Произошла ошибка при сохранении данных.");
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось отправить данные на сервер.");
    }
});

// Загружаем данные при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadData();
});