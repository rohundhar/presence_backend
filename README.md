# Screen Time Team Tracker Backend

This is the Node.js/TypeScript backend for the Screen Time Team Tracker. It handles team management, user rule configuration, and screen time synchronization from iOS clients.

## Architecture

- **Framework:** `typescript-rest` on top of Express.
- **Database:** MongoDB (Mongoose).
- **Design Pattern:** Controller-Service-Model.
- **Key Concept:** Screen Time data is stored in a "Flat" structure (one document per bucket per day) to allow for atomic updates from iOS devices without complex array operations.

## Prerequisites

- Node.js (v16+)
- MongoDB (running locally or a connection string to Atlas)

## Installation

1.  **Clone the repository**
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment:**
    - Create a `.env` file (optional, defaults to local mongo):
    ```env
    MONGO_URI=mongodb://localhost:27017/screentime_app
    PORT=3000
    ```

## Running the Project

**Development Mode (Hot Reload):**

```bash
npm run dev
```
