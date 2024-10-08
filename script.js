document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const formFields = form.elements;
    const modal = document.getElementById('thank-you-modal');
    const backToFormButton = document.getElementById('back-to-form');
    const submitButton = document.getElementById('submit-button');
    const body = document.body;

    // Функция для блокировки прокрутки
    function disableScroll() {
        body.style.overflow = 'hidden';
    }

    // Функция для разблокировки прокрутки
    function enableScroll() {
        body.style.overflow = '';
    }

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

                        // Если это textarea, вызываем автоизменение высоты
                        if (field.tagName.toLowerCase() === 'textarea') {
                            autoResize.call(field);
                        }
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

                        // Если это textarea, сбрасываем высоту
                        if (field.tagName.toLowerCase() === 'textarea') {
                            field.style.height = 'auto';
                        }
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

    // Функция для определения мобильного устройства
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || navigator.userAgent.indexOf('IEMobile') !== -1;
    }

    const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');

    tooltipTriggers.forEach(function (trigger) {
        const tooltipContent = trigger.parentElement.querySelector('.tooltip-content');

        // Удаляем предыдущие обработчики событий и используем только JavaScript для управления видимостью
        trigger.addEventListener('click', function (event) {
            event.preventDefault();
            // Переключаем видимость подсказки
            if (tooltipContent.style.visibility === 'visible') {
                tooltipContent.style.visibility = 'hidden';
                tooltipContent.style.opacity = '0';
                enableScroll(); // Разблокируем прокрутку
            } else {
                tooltipContent.style.visibility = 'visible';
                tooltipContent.style.opacity = '1';
                disableScroll(); // Блокируем прокрутку
            }
        });
    });

    // Добавляем обработчики событий для кнопок закрытия в подсказках
    const tooltipCloses = document.querySelectorAll('.tooltip-close');
    tooltipCloses.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            event.preventDefault(); // Предотвращаем действие по умолчанию
            event.stopPropagation(); // Останавливаем всплытие события
            const tooltipContent = btn.parentElement;
            tooltipContent.style.visibility = 'hidden';
            tooltipContent.style.opacity = '0';
            enableScroll(); // Разблокируем прокрутку
        });
    });

    // Автоматическое изменение высоты textarea
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(function (textarea) {
        textarea.addEventListener('input', autoResize, false);

        // Вызываем функцию один раз при загрузке страницы, чтобы установить правильную высоту, если есть сохраненный текст
        autoResize.call(textarea);
    });

    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

});
