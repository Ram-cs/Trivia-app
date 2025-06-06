App Tour Video: https://www.loom.com/share/f8becdf3ea174369baef49a481f7339d?sid=0e5aa3f5-da7b-4a0b-b200-ba3a9d849765

# 📚 Trivia App

A fullstack trivia quiz application with category selection, randomized questions, answer validation, scoring, and results — built for code quality, testability, and containerized environments.

## 🚀 Tech Stack

| Layer       | Technology                                     |
| ----------- | ---------------------------------------------- |
| Frontend    | React, TypeScript, Redux Toolkit, Vite, Router |
| Backend     | Node.js, Express, TypeScript, MongoDB          |
| Container   | Docker, Docker Compose                         |
| Testing     | Jest, React Testing Library, Supertest         |
| Data Source | [Open Trivia DB](https://opentdb.com/)         |

## ⚙️ Features

-   ✅ Select trivia category, difficulty, and question count
-   ✅ Randomized answers (prevent cheating via DevTools)
-   ✅ Score bar with color (red, yellow, green)
-   ✅ Questions are **fetched once**, stored in Redux, and reused
-   ✅ Backend scoring and review of correct/incorrect answers
-   ✅ Unit & integration test coverage
-   ✅ Fully containerized with Docker

## 📁 Project Structure

```
trivia-app/
├── backend/                # Express backend API
│   ├── src/               # Source code
│   │   ├── controllers/   # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   ├── __tests__/        # Backend tests
│   ├── Dockerfile        # Backend container config
│   ├── jest.config.js    # Jest configuration
│   └── tsconfig.json     # TypeScript configuration
│
├── frontend/              # React + Vite frontend
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── features/     # Redux features
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
│   ├── __tests__/        # Frontend tests
│   ├── types/            # TypeScript type definitions
│   ├── Dockerfile        # Frontend container config
│   └── vite.config.ts    # Vite configuration
│
├── docker-compose.yml    # Docker services configuration
└── README.md            # Project documentation
```

## 🛠️ Prerequisites

-   Node.js v18+ (v20 preferred)
-   Docker & Docker Compose
-   Git

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)

1. Clone the repository:

    ```bash
    git clone <your-repo-url>
    cd trivia-app
    ```

2. Start all services:

    ```bash
    # Build and start all containers
    docker-compose up --build

    # To run in detached mode (background)
    docker-compose up -d --build

    # To view logs
    docker-compose logs -f

    # To stop all services
    docker-compose down
    ```

3. Access the application:
    - Frontend: [http://localhost:5173](http://localhost:5173)
    - Backend: [http://localhost:5000](http://localhost:5000)

### Option 2: Local Development

#### Backend Setup

```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## �� Database Seeding

### Using Docker

1. First, ensure your containers are running:

    ```bash
    docker-compose up -d
    ```

2. Run the seed script:

    ```bash
    # Run seed script
    docker exec -it trivia-backend npm run seed

    # If you need to reset the database first
    docker exec -it trivia-backend npm run seed:reset
    ```

3. You'll be prompted to:
    - Specify number of questions per category/difficulty
    - Choose whether to append or reset existing data

### Local Development

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Run the seed script:

    ```bash
    # Run seed script
    npm run seed

    # If you need to reset the database first
    npm run seed:reset
    ```

## 🐳 Docker Commands Reference

### Basic Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild a specific service
docker-compose up -d --build backend

# View running containers
docker-compose ps

# Execute command in a container
docker-compose exec backend npm run test
```

### Container Management

```bash
# Remove all containers and volumes
docker-compose down -v

# Remove all containers, volumes, and images
docker-compose down -v --rmi all

# View container logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### Development Commands

```bash
# Run tests in backend container
docker-compose exec backend npm run test

# Run tests in frontend container
docker-compose exec frontend npm run test

# Access MongoDB shell
docker-compose exec mongo mongosh

# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm install
npm run test
```

### Frontend Tests

```bash
cd frontend
npm install
npm run test
```

## 🛣️ Future Enhancements

-   User authentication
-   Track quiz history by user
-   Admin dashboard to manage questions
-   Export results to PDF
-   CI pipeline using GitHub Actions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Result Output
1. Docker Running
<img width="1381" alt="Screenshot 2025-06-01 at 5 58 23 PM" src="https://github.com/user-attachments/assets/a2093b98-df07-4cdd-8a31-aa92dc2023b9" />
<img width="1563" alt="Screenshot 2025-06-01 at 5 58 53 PM" src="https://github.com/user-attachments/assets/23e38762-8643-4702-b958-cc4fa498b566" />

2. MongoDb Compass
<img width="1421" alt="Screenshot 2025-06-01 at 5 59 30 PM" src="https://github.com/user-attachments/assets/c37d8a1e-3eb4-438b-a4f4-0f9fbf8e81de" />
<img width="1423" alt="Screenshot 2025-06-01 at 6 00 02 PM" src="https://github.com/user-attachments/assets/1bb64c9e-8619-4e12-8ff2-af24055e77bc" />

3. Test Results (Backend and Frontend)
<img width="1237" alt="Screenshot 2025-06-01 at 6 01 07 PM" src="https://github.com/user-attachments/assets/1cb673a2-6b66-448c-9af6-e05a852659ea" />
<img width="1235" alt="Screenshot 2025-06-01 at 6 01 38 PM" src="https://github.com/user-attachments/assets/ee87b165-27b8-4360-a275-683e39d3fcf4" />




