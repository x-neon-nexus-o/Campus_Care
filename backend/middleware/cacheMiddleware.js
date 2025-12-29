const redis = require('redis');

// Create Redis client (if configured)
let client = null;

if (process.env.REDIS_URL) {
    client = redis.createClient({
        url: process.env.REDIS_URL
    });

    client.on('error', (err) => console.error('Redis Client Error', err));

    client.connect().catch(console.error);
}

const cacheMiddleware = (duration = 3600) => {
    return async (req, res, next) => {
        // Skip if no Redis client
        if (!client || !client.isOpen) {
            return next();
        }

        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedResponse = await client.get(key);

            if (cachedResponse) {
                return res.json(JSON.parse(cachedResponse));
            } else {
                // Mock res.send/res.json to capture body
                const originalSend = res.json;
                res.json = (body) => {
                    client.setEx(key, duration, JSON.stringify(body));
                    originalSend.call(res, body);
                };
                next();
            }
        } catch (err) {
            console.error('Cache error:', err);
            next();
        }
    };
};

module.exports = cacheMiddleware;
