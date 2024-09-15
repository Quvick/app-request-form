document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const formFields = form.elements;
    const modal = document.getElementById('thank-you-modal');
    const backToFormButton = document.getElementById('back-to-form');
    const submitButton = document.getElementById('submit-button');

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

        // Деактивируем кнопку и добавляем класс загрузки
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // Отображаем модальное окно
                modal.style.display = 'block';
                form.reset(); // Очищаем форму

                // Очищаем сохранённые данные в localStorage
                for (let i = 0; i < formFields.length; i++) {
                    const field = formFields[i];
                    if (field.name) {
                        let key = field.name;
                        if (field.type === 'checkbox' || field.type === 'radio') {
                            key = `${field.name}-${field.value}`;
                        }
                        localStorage.removeItem(key);
                    }
                }
            } else {
                alert('There was a problem submitting the form.');
                // Активируем кнопку в случае ошибки
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        }).catch(error => {
            alert('There was a problem submitting the form.');
            // Активируем кнопку в случае ошибки
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        });
    });

    // Обработка кнопки "Back to the form"
    backToFormButton.addEventListener('click', function () {
        modal.style.display = 'none';
        // Активируем кнопку и удаляем класс загрузки
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    });
});
