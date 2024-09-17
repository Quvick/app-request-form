document.addEventListener('DOMContentLoaded', function () {
    // Получаем ID заявки из URL
    const path = window.location.pathname;
    const requestId = path.substring(1);

    // Получаем данные заявки с сервера
    fetch(`/.netlify/functions/getRequest?id=${requestId}`)
        .then(response => response.json())
        .then(data => {
            if (data.appName) {
                // Здесь вы можете использовать data.appName для отображения в форме
                // Инициализируйте форму или выполните другие действия
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
});
