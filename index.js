document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('create-request-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const appName = document.getElementById('app-name').value;

        fetch('/.netlify/functions/createRequest', {
            method: 'POST',
            body: JSON.stringify({ appName }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                window.location.href = `/${data.id}`;
            } else {
                alert('Error creating request.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error creating request.');
        });
    });
});
