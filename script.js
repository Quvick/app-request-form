document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const formFields = form.elements;

    // Функция для загрузки сохранённых данных из localStorage
    function loadFormData() {
        for (let i = 0; i < formFields.length; i++) {
            const field = formFields[i];
            if (field.name) {
                const savedValue = localStorage.getItem(field.name);
                if (savedValue !== null) {
                    if (field.type === 'checkbox' || field.type === 'radio') {
                        field.checked = savedValue === 'true';
                    } else if (field.options && field.multiple) {
                        // Для множественного выбора
                        const values = JSON.parse(savedValue);
                        for (let j = 0; j < field.options.length; j++) {
                            field.options[j].selected = values.includes(field.options[j].value);
                        }
                    } else {
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
                if (field.type === 'checkbox' || field.type === 'radio') {
                    localStorage.setItem(field.name, field.checked);
                } else if (field.options && field.multiple) {
                    // Для множественного выбора
                    const selectedOptions = Array.from(field.selectedOptions).map(option => option.value);
                    localStorage.setItem(field.name, JSON.stringify(selectedOptions));
                } else {
                    localStorage.setItem(field.name, field.value);
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
                        localStorage.removeItem(field.name);
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
