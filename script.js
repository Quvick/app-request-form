document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Request Sent!');
                form.reset(); // Очищаем форму
            } else {
                alert('There was a problem submitting the form.');
            }
        }).catch(error => {
            alert('There was a problem submitting the form.');
        });
    });
});
