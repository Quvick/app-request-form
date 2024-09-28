document.addEventListener('DOMContentLoaded', function () {
    // Получаем ID заявки из URL
    const path = window.location.pathname;
    const requestId = path.substring(1);

    const form = document.querySelector('form');

    // Получаем данные заявки с сервера
    fetch(`/.netlify/functions/getRequest?id=${requestId}`)
        .then(response => response.json())
        .then(data => {
            if (data.appName) {
                // Предзаполняем поле "App Name"
                document.getElementById('app-name').value = data.appName;
                // Предзаполняем другие поля, если есть данные
                // Например:
                // document.getElementById('main-color').value = data['Main Color'] || '';
                // Обработка чекбоксов и радиокнопок
                for (let key in data) {
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox' || field.type === 'radio') {
                            if (Array.isArray(data[key])) {
                                data[key].forEach(value => {
                                    const checkbox = document.querySelector(`[name="${key}"][value="${value}"]`);
                                    if (checkbox) {
                                        checkbox.checked = true;
                                    }
                                });
                            } else {
                                const option = document.querySelector(`[name="${key}"][value="${data[key]}"]`);
                                if (option) {
                                    option.checked = true;
                                }
                            }
                        } else {
                            field.value = data[key];
                        }
                    }
                }
            } else {
                alert('Request not found.');
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching request data.');
            window.location.href = '/';
        });

    // Обработка отправки формы
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        // Собираем данные формы
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            if (data[key]) {
                // Если уже есть значение, преобразуем в массив
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });

        // Отправляем данные на серверную функцию updateRequest
        fetch(`/.netlify/functions/updateRequest?id=${requestId}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(result => {
                if (result.message) {
                    // Успешно обновлено
                    alert('Your request has been submitted successfully.');
                    // Здесь вы можете перенаправить пользователя или очистить форму
                } else {
                    alert('There was a problem submitting your request.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a problem submitting your request.');
            });
    });
});
