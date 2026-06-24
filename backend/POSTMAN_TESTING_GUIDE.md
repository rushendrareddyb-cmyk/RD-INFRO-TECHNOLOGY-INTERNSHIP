# 🧪 Postman Testing Guide — Employee Management System API

This guide walks you through testing every API endpoint using **Postman**.

---

## 📥 Step 1: Install Postman

1. Download Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. Install and open Postman
3. Create a free account (optional but recommended)

---

## 📁 Step 2: Create a New Collection

1. Click **New** → **Collection**
2. Name it: `Employee Management System API`
3. Add a description: `REST API testing for EMS backend`

---

## ⚙️ Step 3: Set Up Environment Variables

1. Click the **gear icon** (top-right) → **Manage Environments** → **Add**
2. Name: `EMS Local`
3. Add these variables:

| Variable     | Initial Value              | Current Value              |
| ------------ | -------------------------- | -------------------------- |
| `base_url`   | `http://localhost:5000`    | `http://localhost:5000`    |
| `token`      | (leave empty)              | (leave empty)              |

4. Click **Save** and select `EMS Local` as active environment

---

## 🚀 Step 4: Start the Backend Server

Make sure your backend is running:

```bash
cd backend
npm run dev
```

You should see:
```
╔══════════════════════════════════════════════════╗
║  Employee Management System API                  ║
║  Server running on port 5000                     ║
║  Environment: development                        ║
╚══════════════════════════════════════════════════╝
✅ MongoDB Connected: cluster0-shard-00-02.3nseqr5.mongodb.net
```

---

## 🧪 Step 5: Test Each API Endpoint

### Test 1: Health Check ✅

| Setting | Value                  |
| ------- | ---------------------- |
| Method  | `GET`                  |
| URL     | `{{base_url}}/`        |

**Expected:** 200 OK with API status message.

---

### Test 2: Register User 📝

| Setting      | Value                             |
| ------------ | --------------------------------- |
| Method       | `POST`                            |
| URL          | `{{base_url}}/api/auth/register`  |
| Body Type    | `raw` → `JSON`                    |

**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@rdinfro.com",
  "password": "admin123"
}
```

**Expected:** 201 Created with user data and JWT token.

**⚡ Auto-save Token:** Go to the **Tests** tab and add:
```javascript
var jsonData = pm.response.json();
if (jsonData.data && jsonData.data.token) {
    pm.environment.set("token", jsonData.data.token);
}
```

---

### Test 3: Login User 🔐

| Setting      | Value                          |
| ------------ | ------------------------------ |
| Method       | `POST`                         |
| URL          | `{{base_url}}/api/auth/login`  |
| Body Type    | `raw` → `JSON`                 |

**Body:**
```json
{
  "email": "admin@rdinfro.com",
  "password": "admin123"
}
```

**Expected:** 200 OK with JWT token.

**⚡ Auto-save Token:** Add same test script as above.

---

### Test 4: Get My Profile 👤

| Setting        | Value                        |
| -------------- | ---------------------------- |
| Method         | `GET`                        |
| URL            | `{{base_url}}/api/auth/me`   |
| Authorization  | Bearer Token → `{{token}}`   |

**How to set Authorization:**
1. Go to the **Authorization** tab
2. Type: `Bearer Token`
3. Token: `{{token}}`

**Expected:** 200 OK with your user profile.

---

### Test 5: Add Employee ➕

| Setting        | Value                            |
| -------------- | -------------------------------- |
| Method         | `POST`                           |
| URL            | `{{base_url}}/api/employees`     |
| Authorization  | Bearer Token → `{{token}}`       |
| Body Type      | `raw` → `JSON`                   |

**Body:**
```json
{
  "employeeId": "EMP001",
  "name": "Rahul Sharma",
  "email": "rahul@rdinfro.com",
  "department": "Engineering",
  "designation": "Full Stack Developer",
  "salary": 75000
}
```

**Expected:** 201 Created.

**⚡ Save Employee ID:** Add to Tests tab:
```javascript
var jsonData = pm.response.json();
if (jsonData.data && jsonData.data._id) {
    pm.environment.set("employee_id", jsonData.data._id);
}
```

**Add more employees with different data:**
```json
{
  "employeeId": "EMP002",
  "name": "Priya Patel",
  "email": "priya@rdinfro.com",
  "department": "HR",
  "designation": "HR Manager",
  "salary": 65000
}
```
```json
{
  "employeeId": "EMP003",
  "name": "Amit Kumar",
  "email": "amit@rdinfro.com",
  "department": "Marketing",
  "designation": "Digital Marketing Lead",
  "salary": 55000
}
```

---

### Test 6: Get All Employees 📋

| Setting        | Value                            |
| -------------- | -------------------------------- |
| Method         | `GET`                            |
| URL            | `{{base_url}}/api/employees`     |
| Authorization  | Bearer Token → `{{token}}`       |

**Expected:** 200 OK with paginated list of employees.

**Try with query parameters:**
- `{{base_url}}/api/employees?search=Engineering`
- `{{base_url}}/api/employees?page=1&limit=5`
- `{{base_url}}/api/employees?sortBy=salary&order=desc`
- `{{base_url}}/api/employees?search=Rahul&sortBy=name&order=asc`

---

### Test 7: Get Employee By ID 🔍

| Setting        | Value                                      |
| -------------- | ------------------------------------------ |
| Method         | `GET`                                      |
| URL            | `{{base_url}}/api/employees/{{employee_id}}`|
| Authorization  | Bearer Token → `{{token}}`                 |

**Expected:** 200 OK with single employee data.

---

### Test 8: Update Employee ✏️

| Setting        | Value                                      |
| -------------- | ------------------------------------------ |
| Method         | `PUT`                                      |
| URL            | `{{base_url}}/api/employees/{{employee_id}}`|
| Authorization  | Bearer Token → `{{token}}`                 |
| Body Type      | `raw` → `JSON`                             |

**Body (partial update):**
```json
{
  "designation": "Senior Full Stack Developer",
  "salary": 90000
}
```

**Expected:** 200 OK with updated employee data.

---

### Test 9: Get Employee Statistics 📊

| Setting        | Value                                |
| -------------- | ------------------------------------ |
| Method         | `GET`                                |
| URL            | `{{base_url}}/api/employees/stats`   |
| Authorization  | Bearer Token → `{{token}}`           |

**Expected:** 200 OK with stats (total employees, departments, salary analytics).

---

### Test 10: Delete Employee 🗑️

| Setting        | Value                                      |
| -------------- | ------------------------------------------ |
| Method         | `DELETE`                                   |
| URL            | `{{base_url}}/api/employees/{{employee_id}}`|
| Authorization  | Bearer Token → `{{token}}`                 |

**Expected:** 200 OK with deletion confirmation.

---

## 🛡️ Step 6: Test Error Handling

### Test: Missing Fields
- `POST /api/auth/register` with empty body → **400 Validation Error**

### Test: Duplicate Email
- Register the same email twice → **409 Conflict**

### Test: Invalid Token
- Set Authorization to `Bearer invalid_token_here` → **401 Unauthorized**

### Test: No Token
- Remove Authorization header from any private route → **401 Not authorized, no token**

### Test: Invalid Employee ID (MongoDB ObjectId)
- `GET /api/employees/invalid_id` → **400 Invalid ID**

### Test: Non-existent Employee
- `GET /api/employees/664a1b2c3d4e5f6789012345` → **404 Employee not found**

### Test: Rate Limiting
- Send 100+ requests in 15 minutes → **429 Too Many Requests**

---

## 📊 Step 7: Run Full Collection

1. Click the **"..."** menu on your collection
2. Select **Run Collection**
3. Configure iterations and delay as needed
4. Click **Run** to execute all tests sequentially

---

## 📝 API Endpoints Summary Table

| #  | Method   | Endpoint                 | Access  | Description              |
| -- | -------- | ------------------------ | ------- | ------------------------ |
| 1  | GET      | `/`                      | Public  | Health Check             |
| 2  | GET      | `/api/health`            | Public  | API Health Status        |
| 3  | POST     | `/api/auth/register`     | Public  | Register User            |
| 4  | POST     | `/api/auth/login`        | Public  | Login User               |
| 5  | GET      | `/api/auth/me`           | Private | Get Profile              |
| 6  | GET      | `/api/employees`         | Private | Get All Employees        |
| 7  | GET      | `/api/employees/stats`   | Private | Get Statistics           |
| 8  | GET      | `/api/employees/:id`     | Private | Get Employee by ID       |
| 9  | POST     | `/api/employees`         | Private | Add Employee             |
| 10 | PUT      | `/api/employees/:id`     | Private | Update Employee          |
| 11 | DELETE   | `/api/employees/:id`     | Private | Delete Employee          |
