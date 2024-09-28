// netlify/functions/updateRequest.js

const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
    const id = event.queryStringParameters.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID is required' }),
        };
    }

    // Parse the form data from the request body
    let data;
    try {
        data = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON in request body' }),
        };
    }

    // Initialize FaunaDB client
    const client = new Client({
        secret: process.env.FAUNA_SECRET,
        domain: 'db.fauna.com',
        scheme: 'https',
    });

    try {
        // Update the document in the "requests" collection with new data
        const result = await client.query(
            fql`
                Collection("requests").document(${id}).update(${data})
            `
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Request updated successfully' }),
        };
    } catch (error) {
        console.error('FaunaDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
