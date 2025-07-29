// Quick test to check which ScriptBlox endpoints are working
const axios = require('axios');

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
};

async function testEndpoint(name, url) {
    try {
        console.log(`Testing ${name}...`);
        const response = await axios.get(url, { 
            headers,
            timeout: 10000
        });
        console.log(`✅ ${name}: ${response.status} - Working`);
        return true;
    } catch (error) {
        console.log(`❌ ${name}: ${error.response?.status || 'TIMEOUT'} - ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('Testing ScriptBlox API endpoints...\n');
    
    const endpoints = [
        ['Search', 'https://scriptblox.com/api/script/search?q=fe'],
        ['Fetch Scripts', 'https://scriptblox.com/api/script/fetch?page=1'],
        ['Trending', 'https://scriptblox.com/api/script/trending'],
        ['Game Scripts', 'https://scriptblox.com/api/script/fetch?game=142823291&max=10']
    ];
    
    let working = 0;
    for (const [name, url] of endpoints) {
        if (await testEndpoint(name, url)) {
            working++;
        }
        console.log(''); // Add spacing
    }
    
    console.log(`\nSummary: ${working}/${endpoints.length} endpoints working`);
    
    if (working === 0) {
        console.log('\n🚧 All endpoints blocked - Cloudflare is blocking this IP address');
        console.log('💡 Solutions:');
        console.log('   • Use a proxy service');
        console.log('   • Deploy from a different server location');
        console.log('   • Contact ScriptBlox about IP whitelisting');
    } else if (working < endpoints.length) {
        console.log('\n⚠️ Some endpoints blocked - partial Cloudflare protection');
    } else {
        console.log('\n✅ All endpoints working - no blocking detected');
    }
}

runTests().catch(console.error);
