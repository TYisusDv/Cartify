# CarSync

**CarSync** is a Point of Sale (POS) system with inventory management tailored for a car oil shop. The system is built to streamline sales, track inventory, and manage client data efficiently.

## Features

- **Point of Sale**: Simple and intuitive interface for handling sales transactions.
- **Inventory Management**: Track stock levels, manage product information, and monitor inventory changes.
- **Client Management**: Store and manage customer details and purchase history.
- **Authentication**: Secure user authentication with JWT tokens.

## Tech Stack

- **Backend**: Python, Django REST Framework
- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS, Sass
- **Authentication**: JWT Tokens
- **Containerization**: Docker

## Setup

### Prerequisites

- Docker installed on your machine.
- Basic understanding of Python, Django, React, and Docker.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tyisusdv/carsync.git
   cd carsync

2. **Build docker compose**:
   ```bash
   docker compose build --no-cache

3. **Run docker compose**:
   ```bash
   docker compose up

### Environment Variables
Create a .env file in the root directory to manage environment variables. Example:

1. **Create file .env**:
   ```bash
   POSTGRES_DB = your_db_name
   POSTGRES_USER = your_db_user
   POSTGRES_PASSWORD = your_db_password
   POSTGRES_HOST = db
   POSTGRES_PORT = 5432
   DJANGO_SECRET_KEY = your_secret_key
   DJANGO_CORS_ALLOWED_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"

### Prerequisites

- Access the application via http://localhost:8000 for the backend and http://localhost:3000 for the frontend.
- Use the admin panel to manage inventory and users.

### Contributing
Contributions are welcome! Please fork this repository and submit a pull request for any improvements or bug fixes.

### License
This project is public but not intended for distribution or sale. Please use it for learning or personal projects.

### Contact
For any questions or suggestions, please contact jesusns1902@outlook.com.