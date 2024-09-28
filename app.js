// app.js

document.addEventListener('DOMContentLoaded', function () {
    // Get the request ID from the URL
    const path = window.location.pathname;
    const requestId = path.substring(1);

    const form = document.querySelector('form');

    // Fetch the request data from the server
    fetch(`/.netlify/functions/getRequest?id=${requestId}`)
        .then(response => response.json())
        .then(data => {
            if (data.appName) {
                // Pre-fill the "App Name" field
                document.getElementById('app-name').value = data.appName;

                // Display the request status
                document.getElementById('request-status').textContent = data.status || 'Unknown';

                // Pre-fill other form fields if data exists
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

    // Handle form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            if (data[key]) {
                // If the key already exists, convert it to an array
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });

        // Send the data to the updateRequest serverless function
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
                    // Successfully updated
                    alert('Your request has been submitted successfully.');
                    // Optionally, redirect the user or clear the form
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
