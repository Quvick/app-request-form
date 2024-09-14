document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const formFields = form.elements;

    // Функция для загрузки сохранённых данных из localStorage
    function loadFormData() {
        for (let i = 0; i < formFields.length; i++) {
            const field = formFields[i];
            if (field.name) {
                let key = field.name;
                if (field.type === 'checkbox' || field.type === 'radio') {
                    key = `${field.name}-${field.value}`; // Уникальный ключ для каждого элемента
                    const savedValue = localStorage.getItem(key);
                    if (savedValue !== null) {
                        field.checked = savedValue === 'true';
                    }
                } else {
                    const savedValue = localStorage.getItem(key);
                    if (savedValue !== null) {
                        field.value = savedValue;
                    }
                }
            }
        }
    }

    // Функция для сохранения данных в localStorage
    function saveFormData() {
        for (let i = 0; i < formFields.length; i++) {
            const field = formFields[i];
            if (field.name) {
                let key = field.name;
                if (field.type === 'checkbox' || field.type === 'radio') {
                    key = `${field.name}-${field.value}`; // Уникальный ключ для каждого элемента
                    localStorage.setItem(key, field.checked);
                } else {
                    localStorage.setItem(key, field.value);
                }
            }
        }
    }

    // Загрузка данных при загрузке страницы
    loadFormData();

    // Сохранение данных при изменении полей
    form.addEventListener('input', function () {
        saveFormData();
    });

    // Обработка отправки формы
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

                // Очищаем сохранённые данные в localStorage
                for (let i = 0; i < formFields.length; i++) {
                    const field = formFields[i];
                    if (field.name) {
                        let key = field.name;
                        if (field.type === 'checkbox' || field.type === 'radio') {
                            key = `${field.name}-${field.value}`; // Уникальный ключ для каждого элемента
                        }
                        localStorage.removeItem(key);
                    }
                }
            } else {
                alert('There was a problem submitting the form.');
            }
        }).catch(error => {
            alert('There was a problem submitting the form.');
        });
    });
});
