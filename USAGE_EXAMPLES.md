# ScriptBlox Discord Bot - Advanced Usage Examples

## 🎯 **Complete /script/fetch Parameter Usage**

Your bot now supports **ALL** official ScriptBlox API parameters. Here are practical examples:

### 📋 **Basic Commands**

```bash
# Get home page scripts (default behavior)
/featured

# Get scripts for specific game
/game 920587237

# Search with query
/search "auto farm"
```

### 🔧 **Advanced Filtering Examples**

```bash
# Search for verified scripts only
/search "arsenal" verified:true

# Find free scripts with key systems
/search "simulator" mode:free key:true

# Get universal scripts (work in any game)
/search "universal" universal:true

# Find unpatched scripts
/search "exploit" patched:false

# Get most viewed scripts
/search "popular" sortby:views order:desc

# Get newest scripts
/search "new" sortby:createdAt order:desc

# Get most liked scripts
/search "best" sortby:likeCount order:desc
```

### ⚙️ **How the Bot Processes Parameters**

```javascript
// Example: /search "farming" verified:true key:false limit:10
// Becomes API call:
GET /script/search?q=farming&verified=1&key=0&max=10

// Example: /game 920587237 limit:5
// Becomes API call:  
GET /script/fetch?game=920587237&max=5

// Example: /featured limit:15
// Becomes API call:
GET /script/fetch?page=1&max=15
```

### 🎮 **Game-Specific Advanced Filtering**

```javascript
// Your bot can now do advanced game filtering:

// Get verified scripts for Adopt Me
/game 920587237 verified:true

// Get free scripts for specific game
/game 155615604 mode:free

// Get most popular scripts for game
/game 606849621 sortby:views order:desc

// Get newest scripts for game  
/game 189707 sortby:createdAt order:desc
```

### 📊 **Response Structure Your Bot Handles**

```json
{
    "result": {
        "totalPages": 1247,      // ✅ Bot tracks for pagination
        "nextPage": 2,           // ✅ Bot can handle next page
        "max": 10,               // ✅ Bot respects max limit
        "scripts": [
            {
                "_id": "script123",           // ✅ Used for /script command
                "title": "Auto Farm Script",  // ✅ Displayed in embeds
                "game": {
                    "_id": "game456",         // ✅ Internal game ID
                    "name": "Adopt Me!",      // ✅ Displayed as game name
                    "imageUrl": "game.png"    // ✅ Used for thumbnails
                },
                "slug": "auto-farm-123",      // ✅ Used in URLs
                "verified": true,             // ✅ Shows verification badge
                "key": false,                 // ✅ Shows if key required
                "views": 50000,               // ✅ Displayed in stats
                "scriptType": "free",         // ✅ Shows script type
                "isUniversal": false,         // ✅ Shows if universal
                "isPatched": false,           // ✅ Shows patch status
                "image": "script.png",        // ✅ Used for thumbnails
                "createdAt": "2025-01-15",    // ✅ Shows creation date
                "script": "loadstring..."     // ✅ Available via /raw
            }
        ]
    }
}
```

### 🔍 **API Health Monitoring**

```bash
# Check which endpoints are working
/status

# Expected output after fixes:
# ✅ fetch: working (200)
# ✅ search: working (200) 
# ✅ trending: working (200)
# ✅ game: working (200)    <- Now fixed!
```

### 💡 **Pro Tips for Users**

1. **Game IDs**: Use Roblox place IDs (numbers in game URLs)
2. **Filtering**: Combine multiple filters for precise results
3. **Sorting**: Use `sortby` and `order` for custom ordering
4. **Limits**: Max 20 results per request (API limitation)
5. **Verification**: Use `verified:true` for quality scripts

### 🚀 **Available Discord Commands**

| Command | Purpose | Example |
|---------|---------|---------|
| `/search` | Advanced script search | `/search "auto farm" verified:true` |
| `/featured` | Get home page scripts | `/featured limit:10` |
| `/trending` | Get trending scripts | `/trending` |
| `/game` | Get game-specific scripts | `/game 920587237` |
| `/script` | Get script details | `/script 507f1f77bcf86cd799439011` |
| `/raw` | View script code | `/raw 507f1f77bcf86cd799439011` |
| `/status` | Check API health | `/status` |
| `/help` | Show help information | `/help` |

### 🔧 **Technical Implementation**

Your bot correctly implements:
- ✅ Boolean to 1/0 conversion (as required by API)
- ✅ Parameter validation and limits
- ✅ Error handling for invalid requests
- ✅ Response parsing and formatting
- ✅ All official API endpoints
- ✅ Proper HTTP headers for Cloudflare compatibility

## 📖 **Official ScriptBlox API Example vs Bot Implementation**

### **Official JavaScript Example** (from ScriptBlox docs):
```javascript
fetch("https://scriptblox.com/api/script/fetch") // 20 most recent scripts
    .then((res) => res.json())
    .then((data) => {
        // Loop through the scripts and display them
        for (const script of data.result.scripts) {
            // Create elements to display script info
            const scriptElement = document.createElement('div');
            scriptElement.classList.add('script');

            // Add script title
            const titleElement = document.createElement('h3');
            titleElement.textContent = `Title: ${script.title}`;
            scriptElement.appendChild(titleElement);

            // Add script slug
            const slugElement = document.createElement('p');
            slugElement.textContent = `Slug: ${script.slug}`;
            scriptElement.appendChild(slugElement);

            // Add to container
            scriptsContainer.appendChild(scriptElement);
        }
    })
    .catch((error) => {
        console.error('Error while fetching scripts', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = `Error: ${error.message}`;
        document.getElementById('results').appendChild(errorMessage);
    });
```

### **Your Discord Bot Implementation** (equivalent functionality):
```javascript
// src/services/scriptblox.js - Bot's implementation
async getFeaturedScripts(limit = 10) {
    try {
        const response = await this.client.get('/script/fetch', {
            params: {
                page: 1,
                max: Math.min(limit, 20)  // Same API endpoint
            }
        });
        return response.data;  // Same data.result.scripts structure
    } catch (error) {
        throw this.handleError(error);  // Same error handling pattern
    }
}

// src/commands/featured.js - Discord command that uses this
async execute(interaction) {
    try {
        const api = new ScriptBloxAPI();
        const data = await api.getFeaturedScripts(limit);
        
        // Loop through scripts (same as official example)
        for (const script of data.result.scripts) {
            // Create Discord embed instead of HTML elements
            const embed = new EmbedBuilder()
                .setTitle(`📜 ${script.title}`)        // Same script.title
                .setDescription(`Slug: ${script.slug}`) // Same script.slug
                .addFields(
                    { name: '🎮 Game', value: script.game.name },
                    { name: '👁️ Views', value: script.views.toString() },
                    { name: '✅ Verified', value: script.verified ? 'Yes' : 'No' }
                );
            embeds.push(embed);
        }
        
        await interaction.editReply({ embeds });
    } catch (error) {
        // Same error handling pattern as official example
        console.error('Error while fetching scripts', error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('❌ Error')
            .setDescription(`Error while fetching scripts: ${error.message}`);
        await interaction.editReply({ embeds: [errorEmbed] });
    }
}
```

### **Key Similarities** ✅

| Official Example | Your Discord Bot | Status |
|------------------|------------------|--------|
| `fetch("/api/script/fetch")` | `this.client.get('/script/fetch')` | ✅ Same endpoint |
| `.then((data) => ...)` | `const data = await api.getFeaturedScripts()` | ✅ Same async pattern |
| `data.result.scripts` | `data.result.scripts` | ✅ Same data structure |
| `for (const script of data.result.scripts)` | `for (const script of data.result.scripts)` | ✅ Same iteration |
| `script.title`, `script.slug` | `script.title`, `script.slug` | ✅ Same properties |
| `.catch((error) => ...)` | `catch (error) { ... }` | ✅ Same error handling |
| Display error message | Discord error embed | ✅ Same error UX |

### **Your Bot's Advantages** 🚀

1. **Enhanced Error Handling**: More detailed error messages and fallback mechanisms
2. **Rich Discord Embeds**: Better visual presentation than plain HTML
3. **Interactive Elements**: Buttons, pagination, reactions
4. **Parameter Support**: All official API parameters supported
5. **Health Monitoring**: Real-time endpoint status checking
6. **Auto-Updates**: Webhook-based deployment system

**Your bot is essentially a Discord-native version of the official ScriptBlox API example with enterprise-grade enhancements!** 🎉
