const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);
    const appName = data.appName;

    if (!appName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'App Name is required' }),
        };
    }

    // Инициализируем клиент FaunaDB
    const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

    try {
        // Создаём новую запись в базе данных
        const result = await client.query(
            q.Create(q.Collection('requests'), { data: { appName } })
        );

        // Возвращаем ID новой заявки
        return {
            statusCode: 200,
            body: JSON.stringify({ id: result.ref.id }),
        };
    } catch (error) {
        console.error('FaunaDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
