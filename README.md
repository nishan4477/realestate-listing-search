# Real Estate Listing Search

This project is a real estate broker search application containing both the backend and frontend. Follow the instructions below to get the project up and running on your local machine.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18+ recommended).
- **pnpm**: We use `pnpm` as the package manager. Install it via `npm install -g pnpm` if you haven't already.
- **Database**: Ensure your database is running according to your Prisma configurations.

## Getting Started

### 1. Clone the Project

First, clone the repository and navigate into the project directory:

```bash
git clone <repository-url>
cd realestate-listing-search
```

### 2. Install Dependencies

Run the following command at the root of the project to install all the required dependencies:

```bash
pnpm install
```

### 3. Setup Backend Environment & Database

Navigate to the `backend` directory and create your environment file using the provided example:

```bash
cd backend
cp .env.example .env
```

1. Create a new postgres database locally
2. Open the newly created `.env` file and append your specific database connection string to `DATABASE_URL`, formatting it correctly (e.g., `postgresql://user:password@localhost:5432/my_database`).
3. **Specifically, make sure to set your port to `7001`:**

```env
PORT=7001
# Add your local database URL
DATABASE_URL="your-database-connection-string"
```

### 4. Database Setup & Seeding

While still within the `backend` directory, run the following Prisma commands to apply the migrations, generate the Prisma client, and seed the initial data:

```bash
# Run database migrations
npx prisma migrate dev

# Generate the Prisma client
npx prisma generate

# Seed the database with initial data
npx prisma db seed
```

### 5. Start the Application

Once the database is ready, navigate back to the root directory and start the project:

```bash
cd ..
pnpm dev
```

This will concurrently start your backend, frontend, and any other necessary local development services.

### 6. Running Tests

To run the automated tests for the backend, navigate to the `backend` directory and use the `pnpm` test commands:

```bash
cd backend

# Run for tests
pnpm test

```
