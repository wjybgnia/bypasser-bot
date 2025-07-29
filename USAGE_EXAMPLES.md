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

**Your bot is now 100% compliant with the official ScriptBlox API documentation!** 🎉
