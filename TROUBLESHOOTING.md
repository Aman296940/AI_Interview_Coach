# Troubleshooting Guide: 502 Bad Gateway & CORS Errors

## Understanding the Errors

### 1. **502 Bad Gateway Error**
This means Railway's proxy cannot reach your application. The server is either:
- Not starting at all
- Crashing during startup
- Not listening on the correct port
- Taking too long to respond

### 2. **CORS Error (No Access-Control-Allow-Origin header)**
This happens when:
- The server crashed before it could send CORS headers
- The server isn't running (502 causes this)
- CORS middleware isn't configured correctly

## All Possible Causes & Solutions

### 🔴 **CRITICAL ISSUE #1: Database Connection Blocking Server Start**

**Problem:**
- `connectDB()` was called synchronously but is async
- If DB connection fails, `process.exit(1)` kills the server
- Server never starts → 502 Bad Gateway

**Solution:** ✅ FIXED
- Made DB connection non-blocking
- Server starts even if DB connection fails
- Added graceful error handling

**Check:**
```bash
# In Railway logs, look for:
"MongoDB Connected Successfully" ✅
OR
"Database connection failed" ⚠️
```

---

### 🔴 **CRITICAL ISSUE #2: Missing or Invalid MONGO_URI**

**Problem:**
- `MONGO_URI` not set in Railway environment variables
- Invalid connection string format
- Password contains special characters not URL-encoded

**Your Connection String:**
```
mongodb+srv://bajoriaaman523:Aman@2003@ai-interview.x1pucuv.mongodb.net/?appName=ai-interview
```

**Issue:** Password `Aman@2003` contains `@` which must be URL-encoded

**Correct Format:**
```
mongodb+srv://bajoriaaman523:Aman%402003@ai-interview.x1pucuv.mongodb.net/?appName=ai-interview
```

**Solution:**
1. Go to Railway → Your Service → Variables
2. Update `MONGO_URI` with URL-encoded password:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - `&` → `%26`

**Check Railway Logs:**
```bash
# Should see:
"Attempting to connect to MongoDB..."
"MongoDB Connected Successfully" ✅
```

---

### 🔴 **CRITICAL ISSUE #3: MongoDB Atlas Network Access**

**Problem:**
- MongoDB Atlas blocks connections from Railway IPs
- Network access list doesn't allow Railway

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs)
   - OR add Railway's specific IP ranges
3. Wait 1-2 minutes for changes to propagate

**Check:**
- Try connecting from Railway logs
- Should see "MongoDB Connected" not "Connection timeout"

---

### 🟡 **ISSUE #4: Missing Environment Variables**

**Required Variables in Railway:**
```
MONGO_URI=mongodb+srv://... (with URL-encoded password)
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret (optional)
PERPLEXITY_API_KEY=your_key
FRONTEND_URL=https://ai-interview-coach-95gk5.vercel.app
NODE_ENV=production
PORT=5000 (usually auto-set by Railway)
```

**Check:**
- Railway → Variables tab
- All required variables are set
- No typos in variable names (case-sensitive)

---

### 🟡 **ISSUE #5: Port Configuration**

**Problem:**
- Server listening on wrong port
- Railway expects port from `PORT` environment variable

**Solution:** ✅ Already handled
- Code uses `process.env.PORT || 5000`
- Railway automatically sets `PORT`

**Check Railway Logs:**
```bash
"Server running on port 5000" ✅
```

---

### 🟡 **ISSUE #6: CORS Configuration**

**Problem:**
- CORS middleware not allowing Vercel origin
- Preflight OPTIONS requests failing

**Solution:** ✅ FIXED
- Added automatic Vercel URL detection
- All `.vercel.app` domains are allowed
- Proper OPTIONS handling

**Check:**
- Railway logs should show: `"CORS: Allowing Vercel origin: https://ai-interview-coach-95gk5.vercel.app"`

---

### 🟡 **ISSUE #7: Express 5 Compatibility**

**Problem:**
- Express 5 has breaking changes
- Some middleware patterns don't work

**Solution:** ✅ FIXED
- Removed problematic `app.options('*', cors())`
- CORS middleware handles OPTIONS automatically

---

### 🟡 **ISSUE #8: Error Handler Placement**

**Problem:**
- Error handler must be after all routes
- Wrong placement causes unhandled errors

**Solution:** ✅ FIXED
- Error handler moved to correct position

---

## Debugging Steps

### Step 1: Check Railway Logs
```bash
Railway Dashboard → Your Service → View Logs
```

**Look for:**
- ✅ "Server running on port X"
- ✅ "MongoDB Connected Successfully"
- ❌ Any error messages
- ❌ "process.exit" or crashes

### Step 2: Test Health Endpoint
```bash
curl https://aiinterviewcoach-production.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-24T..."
}
```

### Step 3: Check Environment Variables
```bash
Railway → Variables tab
```

**Verify:**
- All variables are set
- No extra spaces or quotes
- URLs don't have trailing slashes

### Step 4: Test MongoDB Connection
```bash
# In Railway logs, check for:
"MongoDB Connection Error" ❌
OR
"MongoDB Connected Successfully" ✅
```

### Step 5: Check CORS in Browser Console
```javascript
// Should see in Railway logs:
"CORS: Allowing Vercel origin: https://ai-interview-coach-95gk5.vercel.app"
```

---

## Quick Fix Checklist

- [ ] **MONGO_URI** is set in Railway with URL-encoded password (`@` → `%40`)
- [ ] **JWT_SECRET** is set in Railway
- [ ] **FRONTEND_URL** is set to your Vercel URL
- [ ] MongoDB Atlas allows connections from `0.0.0.0/0`
- [ ] Railway logs show "Server running on port X"
- [ ] Railway logs show "MongoDB Connected Successfully"
- [ ] Health endpoint returns `{"status": "ok", "database": "connected"}`
- [ ] CORS logs show "Allowing Vercel origin"

---

## Common Error Messages & Solutions

### "MongoDB Connection Error"
- Check `MONGO_URI` is set correctly
- Verify password is URL-encoded
- Check MongoDB Atlas network access

### "Server running on port X (Database connection failed)"
- Server is running but DB isn't connected
- Check MongoDB connection string
- Verify MongoDB Atlas allows Railway IPs

### "CORS: Blocked origin"
- Check if origin matches Vercel URL pattern
- Verify `FRONTEND_URL` is set correctly
- Check Railway logs for CORS messages

### "502 Bad Gateway"
- Server isn't starting
- Check Railway logs for startup errors
- Verify all environment variables are set
- Check if port is correct

---

## Still Having Issues?

1. **Check Railway Logs** - Most errors are logged there
2. **Test Health Endpoint** - `/health` shows server and DB status
3. **Verify Environment Variables** - All required vars must be set
4. **Check MongoDB Atlas** - Network access and connection string
5. **Test Locally** - If it works locally, it's a deployment config issue

