const axios = require("axios");

const GYAZO_ACCESS_TOKEN = process.env.GYAZO_ACCESS_TOKEN;

const isValidGyazoUrl = (imageUrl) => {
    try {
        const parsed = new URL(imageUrl);
        return parsed.hostname.includes("gyazo.com") && parsed.pathname.split("/").filter(Boolean).length >= 1;
    } catch {
        return false;
    }
};

exports.handler = async (event) => {
    const params = new URLSearchParams(event.queryStringParameters);
    const imageUrl = params.get("url");

    if (!imageUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No URL provided" }),
        };
    }

    if (!GYAZO_ACCESS_TOKEN) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server misconfiguration: missing Gyazo token" }),
        };
    }

    if (!isValidGyazoUrl(imageUrl)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid Gyazo URL" }),
        };
    }

    try {
        const imageId = new URL(imageUrl).pathname.split("/").filter(Boolean).pop();
        const response = await axios.get(`https://api.gyazo.com/api/images/${imageId}`, {
            headers: { Authorization: `Bearer ${GYAZO_ACCESS_TOKEN}` },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ uploaded_at: response.data.created_at }),
        };
    } catch (error) {
        console.error("Gyazo API error:", error.response?.data || error.message);
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: "Failed to fetch image data" }),
        };
    }
};
