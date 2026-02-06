# Add Domain to Render

## Do What Render Says:

### 1. Go to Hostinger DNS
- Login: https://hpanel.hostinger.com
- Domains → ytbstorage.space → DNS Records

### 2. Add These 2 Records:

**Record 1:**
```
Type: CNAME
Hostname: www
Target: ytb-savings-front.onrender.com
```

**Record 2:**
```
Type: CNAME
Hostname: @
Target: ytb-savings-front.onrender.com
```

OR use A record:
```
Type: A
Hostname: @
Target: 216.24.57.1
```

### 3. Go Back to Render
- Refresh dashboard
- Click "Verify" or wait 5 minutes
- Status → ✅ Active

---

## Result:

- Site: https://ytbstorage.space → FinanceHub!
- www: https://www.ytbstorage.space → FinanceHub!

---

## Note:

Render shows "ytb-savings-front.onrender.com" - use exactly what they say. They'll redirect to your actual service.

