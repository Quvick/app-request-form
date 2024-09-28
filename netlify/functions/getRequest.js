// netlify/functions/getRequest.js

const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
    const id = event.queryStringParameters.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID is required' }),
        };
    }

    // Initialize FaunaDB client
    const client = new Client({
        secret: process.env.FAUNA_SECRET,
        domain: 'db.fauna.com',
        scheme: 'https',
    });

    try {
        const result = await client.query(
            fql`
                // Retrieve the document data from the "requests" collection by ID
                Collection("requests").document(${id}).get()
            `
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
