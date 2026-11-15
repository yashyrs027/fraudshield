## 4. User Preferences APIs

### 4.1 Get User Preferences
- **Endpoint:** `GET /preferences/{userId}`
- **Auth Required:** Yes (Bearer JWT)
- **Rate Limit:** 30 requests / minute per user
- **Path Parameters:**
  - `userId` – UUID of the user whose preferences are being fetched. Must match the authenticated user's ID.
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "pref_user_1664841600000",
    "user_id": "user_1664841600000",
    "high_contrast_mode": false,
    "font_size": "MEDIUM",
    "language_code": "en",
    "auto_sos_alert": true,
    "email_notifications": true,
    "sms_notifications": true,
    "updated_at": "2026-11-15T10:15:30.123Z"
  }
}
```
- **Error Responses:**
  - `401 Unauthorized` – missing or invalid JWT.
  - `403 Forbidden` – trying to access another user's preferences.
  - `404 Not Found` – preferences not found for the given user.

### 4.2 Update User Preferences
- **Endpoint:** `PATCH /preferences/{userId}`
- **Auth Required:** Yes (Bearer JWT)
- **Rate Limit:** 30 requests / minute per user
- **Path Parameters:**
  - `userId` – UUID of the user whose preferences are being updated. Must match the authenticated user's ID.
- **Request Body (JSON, partial update allowed):**
```json
{
  "high_contrast_mode": true,
  "font_size": "LARGE",
  "language_code": "hi",
  "auto_sos_alert": false,
  "email_notifications": false,
  "sms_notifications": true
}
```
- **Validation (Zod):** All fields are optional but must conform to their types:
  - `high_contrast_mode`, `auto_sos_alert`, `email_notifications`, `sms_notifications` – boolean.
  - `font_size` – one of `SMALL`, `MEDIUM`, `LARGE`.
  - `language_code` – 2‑5 character string (e.g., `en`, `hi`, `en-US`).
- **Success Response (200 OK):** Returns the updated preference object (same shape as GET).
- **Error Responses:**
  - `400 Bad Request` – validation failure (`INVALID_PREFERENCES`).
  - `401 Unauthorized` – missing/invalid JWT.
  - `403 Forbidden` – modifying another user's preferences.

---

*All preference endpoints are included under the base API prefix (`/api/v1`).*
