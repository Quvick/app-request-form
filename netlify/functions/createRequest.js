// netlify/functions/createRequest.js

const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
    let data;
    try {
        data = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON in request body' }),
        };
    }

    const appName = data.appName;

    if (!appName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'App Name is required' }),
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
                // Create a new request document in the "requests" collection
                Collection("requests").create({
                    appName: ${appName},
                    status: "New"
                })
            `
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ id: result.id }),
        };
    } catch (error) {
        console.error('FaunaDB Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
