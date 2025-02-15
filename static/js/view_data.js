// Функция для загрузки данных из базы
async function loadData() {
    try {
        const response = await fetch("/get_data");
        if (!response.ok) {
            throw new Error("Ошибка при загрузке данных");
        }
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

// Загружаем данные при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadData();
});