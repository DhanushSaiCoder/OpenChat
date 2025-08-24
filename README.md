<div align="center">

# OpenChat: A Real-time Chat Application

</div>

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)

</div>

<div align="center">

OpenChat is a modern, full-stack real-time chat application designed to facilitate seamless communication between users. Built with a robust MERN (MongoDB, Express.js, React, Node.js) stack and enhanced with Socket.IO for instant messaging, OpenChat provides a dynamic and interactive user experience.

</div>

## Table of Contents

*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Configuration](#configuration)
    *   [Running the Application](#running-the-application)
*   [API Endpoints](#api-endpoints)
*   [Project Structure](#project-structure)
*   [Contributing](#contributing)
*   [License](#license)

## Features

OpenChat offers a comprehensive set of features for a rich messaging experience:

*   **Secure User Authentication:** Users can securely register and log in using JWT (JSON Web Tokens) for session management.
*   **Real-time Messaging:** Leverage Socket.IO for instant, bidirectional communication, ensuring messages are delivered and received in real-time.
*   **Intuitive Conversation Management:** Easily create new conversations, view existing chat histories, and manage participants.
*   **User Discovery:** Browse a list of registered users to initiate new chats.
*   **Responsive User Interface:** A clean and responsive design built with React, providing a smooth experience across various devices.

## Technologies Used

This project is built using a combination of powerful and modern technologies:

### Frontend

*   **React:** A declarative, component-based JavaScript library for building dynamic user interfaces.
*   **React Router DOM:** For efficient client-side routing and navigation within the single-page application.
*   **Socket.IO Client:** The client-side library for establishing real-time, event-driven communication with the backend.
*   **Font Awesome:** Provides a comprehensive set of scalable vector icons that can be customized with CSS.

### Backend

*   **Node.js:** A powerful JavaScript runtime environment for building scalable network applications.
*   **Express.js:** A fast, unopinionated, and minimalist web framework for Node.js, used for building robust APIs.
*   **MongoDB:** A flexible NoSQL document database, ideal for handling large volumes of unstructured data.
*   **Mongoose:** An elegant MongoDB object modeling tool for Node.js, simplifying data interaction.
*   **Socket.IO:** The server-side library enabling real-time, low-latency communication between the server and connected clients.
*   **JSON Web Tokens (JWT):** A compact, URL-safe means of representing claims to be transferred between two parties, used for secure authentication.
*   **Bcrypt:** A library for hashing passwords, ensuring secure storage of user credentials.
*   **CORS:** Middleware to enable Cross-Origin Resource Sharing, allowing the frontend to communicate with the backend.
*   **Dotenv:** A module that loads environment variables from a `.env` file, keeping sensitive configuration separate from the codebase.

## Getting Started

To get a copy of OpenChat up and running on your local machine, follow these steps.

### Prerequisites

Ensure you have the following software installed:

*   **Node.js:** (LTS version recommended) - Download from [nodejs.org](https://nodejs.org/)
*   **npm:** (Comes bundled with Node.js)
*   **MongoDB:** A running instance of MongoDB (local or cloud-based like MongoDB Atlas). - Download from [mongodb.com](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/OpenChat.git
    cd OpenChat
    ```
    *(Remember to replace `your-username` with the actual GitHub username if you fork this project.)*

2.  **Install Backend Dependencies:**
    Navigate to the `backend` directory and install the required Node.js packages:
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    Navigate to the `frontend/chat-app` directory and install the required Node.js packages:
    ```bash
    cd ../frontend/chat-app
    npm install
    ```

### Configuration

1.  **Backend Environment Variables:**
    Create a `.env` file in the `backend` directory with the following content:
    ```dotenv
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```
    *   `MONGO_URI`: Replace with your MongoDB connection URI (e.g., `mongodb://localhost:27017/openchat` for a local instance, or your MongoDB Atlas connection string).
    *   `JWT_SECRET`: Provide a strong, random string for JWT token signing. You can generate one online or use a tool.
    *   `PORT`: The port on which the backend server will run. Default is `5000`.

2.  **Frontend Environment Variables:**
    Create a `.env` file in the `frontend/chat-app` directory with the following content:
    ```dotenv
    REACT_APP_BACKEND_URL=http://localhost:5000
    ```
    *   `REACT_APP_BACKEND_URL`: This should match the `PORT` you set for your backend server.

### Running the Application

Once all dependencies are installed and environment variables are configured, you can start the application from the project root:

```bash
npm start
```

This command uses `concurrently` to start both the backend server and the React development server simultaneously.

*   The backend server will be accessible at `http://localhost:5000` (or your configured `PORT`).
*   The frontend React application will typically open in your browser at `http://localhost:3000`.

## API Endpoints

The OpenChat backend exposes a set of RESTful API endpoints for managing users, conversations, and messages.

### Authentication

*   `POST /auth/signup`: Register a new user account.
*   `POST /auth/login`: Authenticate user credentials and receive a JSON Web Token.

### Conversations

*   `POST /conversation/:userId`: Create a new conversation, typically with another user.
*   `GET /conversation/:conversationId`: Retrieve details and messages of a specific conversation.
*   `DELETE /conversation/:conversationId`: Delete an existing conversation.

### Messages

*   `POST /message/:conversationId`: Send a new message within a specified conversation.
*   `GET /message/:conversationId`: Fetch all messages belonging to a particular conversation.

### Users

*   `GET /users/`: Retrieve a list of all registered users in the system.

## Project Structure

```
OpenChat/
├── backend/                  # Node.js/Express.js backend services and API
│   ├── .env                  # Environment variables for backend
│   ├── server.js             # Main entry point for the backend server
│   ├── middleware/           # Express middleware functions (e.g., authentication, error handling)
│   ├── models/               # Mongoose schemas defining MongoDB document structures
│   └── routes/               # API route definitions and their respective handlers
├── frontend/
│   └── chat-app/             # React single-page application (SPA)
│       ├── public/           # Static assets served directly by the web server
│       ├── src/              # Source code for the React application
│       │   ├── components/   # Reusable UI components
│       │   ├── pages/        # Top-level components representing different views/pages
│       │   └── styles/       # CSS stylesheets for styling components and pages
│       └── package.json      # Frontend project metadata, dependencies, and scripts
├── package.json              # Root project dependencies and scripts (for concurrently)
├── .gitignore                # Specifies intentionally untracked files to ignore
├── plan.js                   # Development notes or planning details
├── request.http              # HTTP client request definitions (for testing APIs)
└── README.md                 # Project documentation (this file)
```

## Contributing

Contributions are welcome! If you have suggestions for improvements or find a bug, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (Note: A `LICENSE` file is not included in the current directory structure, you may want to add one.)