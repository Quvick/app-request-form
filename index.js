// index.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('new-request-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const appName = document.getElementById('app-name').value;

        if (!appName) {
            alert('Пожалуйста, введите название приложения.');
            return;
        }

        // Отправляем appName в серверную функцию createRequest
        fetch('/.netlify/functions/createRequest', {
            method: 'POST',
            body: JSON.stringify({ appName: appName }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    // Перенаправляем на страницу приложения с новым ID заявки
                    window.location.href = `/${data.id}`;
                } else {
                    alert('Ошибка при создании новой заявки.');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла проблема при создании заявки.');
            });
    });
});
