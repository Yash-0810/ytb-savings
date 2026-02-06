# Fix CNAME Conflict Error

## Problem:
CNAME cannot coexist with other records at the same hostname.

## Solution: Use A Record Instead

### Step 1: Delete Existing Records

In Hostinger DNS, look for and delete any existing records for:
- `www` (if it exists)
- `@` (root domain)

### Step 2: Add A Record Only

Add **ONE** record:

```
Type: A
Name: @
Target: 216.24.57.1
TTL: Auto
```

### Step 3: For www, Choose One Option:

**Option A:** Use A record (recommended)
```
Type: A
Name: www
Target: 216.24.57.1
```

**Option B:** Redirect www to main domain in Hostinger
- Many hosts offer "www redirect" feature
- Look for "URL Redirect" or "Domain Alias"

### Step 4: Go Back to Render

1. Refresh Render dashboard
2. Click "Verify" on custom domain
3. Wait 5 minutes

---

## Summary - Add Just This One Record:

```
Type: A
Name: @
Value: 216.24.57.1
```

This tells browsers: "When someone visits ytbstorage.space, go to IP 216.24.57.1 (Render)"

---

## Why CNAME Doesn't Work on Root Domain:

- DNS rules: CNAME + other records = conflict
- Root domain (@) already has system records
- Solution: Use A record with IP address instead

---

## After Setup:

- Visit: https://ytbstorage.space → Should show FinanceHub!

