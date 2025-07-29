const axios = require('axios');

async function testGameEndpoint() {
    try {
        // Test with Prison Life game ID (popular game)
        const response = await axios.get('https://scriptblox.com/api/script/fetch?game=155615604&max=5', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 10000
        });
        console.log('✅ Game endpoint working with valid game ID:', response.status);
        console.log('Scripts found:', response.data.result?.scripts?.length || 0);
        console.log('Response structure:', Object.keys(response.data));
    } catch (error) {
        console.log('❌ Game endpoint error:', error.response?.status, error.message);
        if (error.response?.data) {
            console.log('Error details:', error.response.data);
        }
    }
}

testGameEndpoint();
