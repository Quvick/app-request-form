// netlify/functions/getRequest.js

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

    const client = new Client({
        secret: process.env.FAUNA_SECRET,
        domain: 'db.fauna.com',
        scheme: 'https',
    });

    try {
        const result = await client.query(
            fql`
                let doc = get(Collection("requests"), ${id})
                doc.data
            `
        );

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error('Fauna Error:', error);
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Not Found' }),
        };
    }
};
