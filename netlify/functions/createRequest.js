// netlify/functions/createRequest.js

// require('dotenv').config();

const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);
    const appName = data.appName;

    if (!appName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'App Name is required' }),
        };
    }

    // Инициализируем клиент Fauna с правильной переменной окружения
    const client = new Client({
        secret: process.env.FAUNA_SECRET,
        domain: 'db.fauna.com',
        scheme: 'https',
    });

    try {
        const result = await client.query(
            fql`
                let newRequest = {
                    appName: ${appName}
                }
                create(Collection("requests"), newRequest)
            `
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ id: result.document.id }),
        };
    } catch (error) {
        console.error('Fauna Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

