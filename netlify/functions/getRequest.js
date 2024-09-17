const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
    const id = event.queryStringParameters.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID is required' }),
        };
    }

    const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

    try {
        const result = await client.query(
            q.Get(q.Ref(q.Collection('requests'), id))
        );

        return {
            statusCode: 200,
            body: JSON.stringify(result.data),
        };
    } catch (error) {
        console.error('FaunaDB Error:', error);
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Not Found' }),
        };
    }
};
