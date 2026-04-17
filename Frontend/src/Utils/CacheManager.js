// This file stays in your frontend React project
// Location: src/utils/cacheManager.js

export const CACHE_NAME = 'swiggy-cache-v1';
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const saveToCache = async (url, data) => {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Add timestamp to know when it was cached
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        
        const response = new Response(JSON.stringify(cacheData), {
            headers: { 'Content-Type': 'application/json' }
        });
        await cache.put(url, response);
        console.log('💾 Saved to browser cache');
    } catch (error) {
        console.error('Cache save failed:', error);
    }
};

export const getFromCache = async (url) => {
    try {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(url);
        
        if (response) {
            const cacheData = await response.json();
            const isExpired = Date.now() - cacheData.timestamp > CACHE_DURATION;
            
            if (!isExpired) {
                console.log('📦 Using browser cache');
                return cacheData.data;
            }
            
            // Cache expired, delete it
            await cache.delete(url);
            console.log('⏰ Cache expired');
        }
        return null;
    } catch (error) {
        console.error('Cache read failed:', error);
        return null;
    }
};