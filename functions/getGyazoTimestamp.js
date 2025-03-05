const axios = require("axios");

const GYAZO_ACCESS_TOKEN = process.env.GYAZO_ACCESS_TOKEN;

exports.handler = async (event) => {
    const params = new URLSearchParams(event.queryStringParameters);
    const imageUrl = params.get("url");

    if (!imageUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No URL provided" }),
        };
    }

    try {
        const imageId = imageUrl.split("/").pop();
        const response = await axios.get(`https://api.gyazo.com/api/images/${imageId}`, {
            headers: { Authorization: `Bearer ${GYAZO_ACCESS_TOKEN}` },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ uploaded_at: response.data.created_at }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch image data" }),
        };
    }
};
