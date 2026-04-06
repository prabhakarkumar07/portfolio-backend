# Portfolio Backend

Express API starter for the portfolio project with MongoDB, JWT admin auth, Swagger docs, and contact/project endpoints.

## Requirements

- Node.js 20+
- npm

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Add your MongoDB connection string to `MONGO_URI`
4. Add a strong `JWT_SECRET`
5. Start the dev server: `npm run dev`

## Scripts

- `npm run dev` starts the API with Nodemon
- `npm start` starts the API with Node
- `npm run seed` seeds an admin user and sample projects

## Environment variables

- `PORT` API port, defaults to `5000`
- `NODE_ENV` app environment
- `APP_NAME` name returned by the root route
- `CLIENT_URL` frontend origin for local development
- `CORS_ORIGIN` comma-separated allowed frontend origins
- `MONGO_URI` MongoDB connection string
- `JWT_SECRET` signing secret for admin auth
- `JWT_EXPIRES_IN` token expiry window
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` for contact notifications
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` for profile image and resume uploads
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` used by the seed script

## Routes

- `GET /` basic API status
- `GET /api/health` health check
- `GET /api/projects` list projects
- `GET /api/projects/:id` get one project
- `GET /api/profile` public profile
- `POST /api/contact` submit contact form
- `POST /api/admin/login` admin login
- `GET /api/admin/me` current admin
- `PUT /api/admin/profile` update profile text fields
- `POST /api/admin/profile/assets` upload `profileImage` and/or `resume`
- `GET /api/admin/messages` admin inbox
- `PATCH /api/admin/messages/:id/read` mark message as read
- `DELETE /api/admin/messages/:id` delete message
- `POST /api/admin/projects` create project
- `PUT /api/admin/projects/:id` update project
- `DELETE /api/admin/projects/:id` delete project
