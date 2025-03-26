# Voting System

A modern and secure web application for managing club elections and voting processes. This system enables organizations to create clubs, manage positions, handle nominations, and conduct transparent voting events.

## Features

- **Multi-Role System**

    - User: Regular members who can vote in elections
    - Candidate: Users who can apply for positions
    - Admin: Complete system management and oversight

- **Authentication & Authorization**

    - Secure sign-in and registration
    - Role-based access control
    - JWT session management

- **Club Management**

    - Create and manage clubs
    - Define positions within clubs
    - Track club membership

- **Nomination System**

    - Open and manage nomination periods
    - Review candidate applications
    - Approve or reject candidacy

- **Voting System**

    - Schedule and manage election events
    - Secure one-vote-per-user policy
    - Real-time election results

- **User-Friendly Dashboards**
    - Personalized user interfaces based on role
    - Intuitive navigation
    - Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js App Router (RSC), Server Actions
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form, Zod validation
- **UI Components**: Radix UI primitives

## Prerequisites

- Node.js 18.17.0 or newer
- MongoDB instance (local or Atlas)
- npm or yarn package manager

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/voting-system.git
    cd voting-system
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:

    ```bash
    cp .env.example .env
    ```

4. Update the `.env` file with your MongoDB connection string and other required variables:

    ```
    DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/voting-system"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-secret-key"
    ```

5. Run database migrations:
    ```bash
    npm run db:migrate
    # or
    yarn db:migrate
    ```

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Database Management

- **Run Prisma Studio** (database GUI):

    ```bash
    npm run db:studio
    # or
    yarn db:studio
    ```

- **Reset Database**:
    ```bash
    npm run db:reset
    # or
    yarn db:reset
    ```

## Project Structure

```
voting-system/
├── src/                    # Source files
│   ├── actions/            # Server actions for data mutations
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard and features
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   └── user/           # User dashboard and features
│   ├── components/         # Reusable React components
│   ├── lib/                # Utility functions and configurations
│   ├── types/              # TypeScript type definitions
│   └── validation/         # Zod schemas for validation
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── .env                    # Environment variables
```

## User Roles

- **User**: Can view clubs, apply for nominations, and vote in elections
- **Candidate**: Can create and manage candidate profiles, view election statistics
- **Admin**: Full system management including user, club, and election administration

## Development Guidelines

- Follow the existing code structure and patterns
- Use TypeScript for type safety
- Leverage Server Components where possible
- Use Server Actions for data mutations
- Implement responsive design with Tailwind CSS
- Follow the established naming conventions and coding style
