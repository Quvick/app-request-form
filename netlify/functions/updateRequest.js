// netlify/functions/updateRequest.js

// require('dotenv').config();

const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
    const id = event.queryStringParameters.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID is required' }),
        };
    }

    // Получаем данные формы из тела запроса
    const data = JSON.parse(event.body);

    // Инициализируем клиент FaunaDB
    const client = new Client({
        secret: process.env.FAUNA_SECRET,
        domain: 'db.fauna.com',
        scheme: 'https',
    });

    try {
        // Обновляем документ заявки с новыми данными
        const result = await client.query(
            fql`
                let doc = get(Collection("requests"), ${id})
                update(doc.ref, {
                    data: ${data}
                })
            `
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Request updated successfully' }),
        };
    } catch (error) {
        console.error('Fauna Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
