# 📋 API Documentation — Employee Management System

> **Base URL:** `http://localhost:5000`  
> **Version:** 1.0.0  
> **Authentication:** Bearer Token (JWT)

---

## 🔐 Authentication APIs

### 1. Register User

| Field    | Value                        |
| -------- | ---------------------------- |
| **Method** | `POST`                     |
| **URL**    | `/api/auth/register`       |
| **Access** | Public                     |

**Request Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "_id": "664a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**

| Status | Message                                      |
| ------ | -------------------------------------------- |
| 400    | Validation Error (missing/invalid fields)    |
| 409    | An account with this email already exists    |
| 500    | Internal Server Error                        |

---

### 2. Login User

| Field    | Value                  |
| -------- | ---------------------- |
| **Method** | `POST`               |
| **URL**    | `/api/auth/login`    |
| **Access** | Public               |

**Request Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "664a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**

| Status | Message                 |
| ------ | ----------------------- |
| 400    | Validation Error        |
| 401    | Invalid email or password |

---

### 3. Get Current User Profile

| Field    | Value                    |
| -------- | ------------------------ |
| **Method** | `GET`                  |
| **URL**    | `/api/auth/me`         |
| **Access** | Private (Bearer Token) |

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "664a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-05-19T10:30:00.000Z"
  }
}
```

---

## 👥 Employee APIs

> **All employee endpoints require authentication.** Include the JWT token in the `Authorization` header.

### 4. Get All Employees

| Field    | Value                    |
| -------- | ------------------------ |
| **Method** | `GET`                  |
| **URL**    | `/api/employees`       |
| **Access** | Private (Bearer Token) |

**Query Parameters:**

| Param    | Type    | Default     | Description                        |
| -------- | ------- | ----------- | ---------------------------------- |
| search   | String  | (none)      | Search by name, department, etc.   |
| page     | Number  | 1           | Page number for pagination         |
| limit    | Number  | 10          | Results per page (max: 100)        |
| sortBy   | String  | createdAt   | Field to sort by                   |
| order    | String  | desc        | Sort order (`asc` or `desc`)       |

**Example:** `GET /api/employees?search=Engineering&page=1&limit=5&sortBy=name&order=asc`

**Success Response (200):**
```json
{
  "status": "success",
  "results": 5,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 15,
    "limit": 5
  },
  "data": [
    {
      "_id": "664a1b2c3d4e5f6789012345",
      "employeeId": "EMP001",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "department": "Engineering",
      "designation": "Software Engineer",
      "salary": 75000,
      "createdAt": "2024-05-19T10:30:00.000Z",
      "updatedAt": "2024-05-19T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Get Employee By ID

| Field    | Value                          |
| -------- | ------------------------------ |
| **Method** | `GET`                        |
| **URL**    | `/api/employees/:id`         |
| **Access** | Private (Bearer Token)       |

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "664a1b2c3d4e5f6789012345",
    "employeeId": "EMP001",
    "name": "Jane Smith",
    "email": "jane@company.com",
    "department": "Engineering",
    "designation": "Software Engineer",
    "salary": 75000
  }
}
```

**Error Response (404):**
```json
{
  "status": "fail",
  "message": "Employee not found"
}
```

---

### 6. Add Employee

| Field    | Value                    |
| -------- | ------------------------ |
| **Method** | `POST`                 |
| **URL**    | `/api/employees`       |
| **Access** | Private (Bearer Token) |

**Request Body (JSON):**
```json
{
  "employeeId": "EMP001",
  "name": "Jane Smith",
  "email": "jane@company.com",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": 75000
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Employee created successfully",
  "data": {
    "_id": "664a1b2c3d4e5f6789012345",
    "employeeId": "EMP001",
    "name": "Jane Smith",
    "email": "jane@company.com",
    "department": "Engineering",
    "designation": "Software Engineer",
    "salary": 75000,
    "createdAt": "2024-05-19T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                                        |
| ------ | ---------------------------------------------- |
| 400    | Validation Error (missing/invalid fields)      |
| 409    | Employee with ID 'EMP001' already exists       |
| 409    | Employee with email 'jane@...' already exists  |

---

### 7. Update Employee

| Field    | Value                          |
| -------- | ------------------------------ |
| **Method** | `PUT`                        |
| **URL**    | `/api/employees/:id`         |
| **Access** | Private (Bearer Token)       |

**Request Body (JSON) — All fields optional:**
```json
{
  "designation": "Senior Software Engineer",
  "salary": 90000
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Employee updated successfully",
  "data": {
    "_id": "664a1b2c3d4e5f6789012345",
    "employeeId": "EMP001",
    "name": "Jane Smith",
    "email": "jane@company.com",
    "department": "Engineering",
    "designation": "Senior Software Engineer",
    "salary": 90000
  }
}
```

---

### 8. Delete Employee

| Field    | Value                          |
| -------- | ------------------------------ |
| **Method** | `DELETE`                     |
| **URL**    | `/api/employees/:id`         |
| **Access** | Private (Bearer Token)       |

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Employee deleted successfully",
  "data": {
    "id": "664a1b2c3d4e5f6789012345"
  }
}
```

---

### 9. Get Employee Statistics (Dashboard)

| Field    | Value                          |
| -------- | ------------------------------ |
| **Method** | `GET`                        |
| **URL**    | `/api/employees/stats`       |
| **Access** | Private (Bearer Token)       |

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "totalEmployees": 25,
    "departments": [
      { "_id": "Engineering", "count": 10 },
      { "_id": "HR", "count": 5 },
      { "_id": "Marketing", "count": 10 }
    ],
    "salary": {
      "totalPayroll": 1875000,
      "avgSalary": 75000,
      "maxSalary": 120000,
      "minSalary": 35000
    }
  }
}
```

---

## 🛡️ Utility Endpoints

### Health Check

| Field    | Value            |
| -------- | ---------------- |
| **Method** | `GET`          |
| **URL**    | `/`            |
| **Access** | Public         |

### API Health

| Field    | Value              |
| -------- | ------------------ |
| **Method** | `GET`            |
| **URL**    | `/api/health`    |
| **Access** | Public           |

---

## ⚠️ Error Response Format

All errors follow a consistent structure:

```json
{
  "status": "fail",
  "message": "Human-readable error message"
}
```

**Validation errors include field details:**
```json
{
  "status": "fail",
  "message": "Validation Error",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" },
    { "field": "name", "message": "Name is required" }
  ]
}
```

---

## 🔒 Authentication Flow

1. Register a user via `POST /api/auth/register`
2. Login via `POST /api/auth/login` to receive a JWT token
3. Include the token in all subsequent requests:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```
4. Token expires after 30 days by default (configurable via `JWT_EXPIRE`)
