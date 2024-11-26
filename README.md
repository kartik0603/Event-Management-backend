# **Event Management System**

## **Project Overview**

This **Event Management System** allows users to create, manage, and RSVP to events. The application features user authentication (sign-up and login), event creation, and RSVP management. It supports functionalities like viewing event details, creating events, and attending or not attending events.

The backend is built using **Node.js**, **Express**, and **MongoDB**, and the API follows an **MVC (Model-View-Controller)** architecture. This project can be used for handling event-based applications where users can manage their attendance and event organizers can create and monitor events.

---

## **Features**

### **User Features:**
- **Sign-up & Login**: Users can register and log in to the system.
- **Create Events**: Event organizers can create events with detailed information like title, description, date, location, type, etc.
- **RSVP to Events**: Users can respond to events with statuses "Going" or "Not Going."
- **View Events**: Users can view details of all events, including the event title, description, location, etc.
- **Event Management**: Event organizers can see a list of users who have RSVP'd to the event.

### **Admin Features:**
- **Manage Users**: Admins can view and manage users who have registered on the platform.
- **Manage Events**: Admins can view, update, and delete events.

### **RSVP Management:**
- Users can RSVP to an event by selecting "Going" or "Not Going."
- If an event is full, users will not be able to RSVP.
- Users can update their RSVP status if they change their mind.

---

## **Technology Stack**

### **Backend:**
- **Node.js**: JavaScript runtime to build the backend API.
- **Express.js**: Web framework for Node.js, used to build the API and handle routes.
- **MongoDB**: NoSQL database to store event, user, and RSVP data.
- **Mongoose**: ODM (Object Data Modeling) library to interact with MongoDB in a structured manner.

### **Authentication:**
- **JWT (JSON Web Token)**: Used for secure user authentication and authorization.
- **bcrypt.js**: Used for securely hashing and verifying user passwords.

### **File Upload:**
- **Multer**: Middleware used for handling file uploads (e.g., event image uploads).

### **API Validation:**
- **Joi**: Used for input validation to ensure correct data is sent in API requests.

---

## **Project Structure**

### **Backend Structure**
```plaintext
├── config/                    # Configuration files for database, middleware, etc.
│   ├── db.js                  # MongoDB connection
│   └── middleware.js          # Middleware functions (e.g., authentication, file upload)
│
├── controllers/               # Controller functions handling the business logic
│   ├── eventController.js     # Functions for creating, fetching, and updating events
│   ├── rsvpController.js      # Functions for RSVP management (user event responses)
│   └── userController.js      # Functions for user registration, login, etc.
│
├── models/                    # Mongoose models (schemas)
│   ├── event.model.js         # Event schema (event details, attendees, etc.)
│   ├── rsvp.model.js          # RSVP schema (user responses to events)
│   └── user.model.js          # User schema (user details, authentication)
│
├── routes/                    # Express route handlers
│   ├── eventRoutes.js         # Routes for event-related operations
│   ├── rsvpRoutes.js          # Routes for RSVP-related operations
│   └── userRoutes.js          # Routes for user-related operations
│
├── services/                  # Optional: Service layer for additional business logic
│   └── authService.js         # Functions for token generation, password hashing, etc.
│
├── utils/                     # Utility functions for validation, logging, etc.
│   ├── dateValidator.js       # Date validation helper
│   └── logger.js              # Logger for logging requests and errors
│
├── .env                       # Environment variables (e.g., database URL, JWT secret)
├── .gitignore                 # Files and folders to ignore in Git
├── server.js                  # Main entry point for the server, Express app initialization
└── package.json               # Project metadata, dependencies, and scripts


Key Routes
User Routes:
POST /api/users/register: User registration (creates a new user).
POST /api/users/login: User login (authenticates and returns JWT token).
Event Routes:
POST /api/events/create: Create a new event (requires authentication).
GET /api/events: Get a list of all events.
GET /api/events/:id: Get details of a specific event.
PUT /api/events/:id: Update an existing event (requires authentication).
DELETE /api/events/:id: Delete an event (requires authentication).
RSVP Routes:
POST /api/rsvp: RSVP to an event (requires authentication).
GET /api/rsvp/user: Get the RSVP status of the logged-in user.
GET /api/rsvp/event/:eventId: Get all RSVPs for a specific event.

Conclusion
This Event Management System offers a robust solution for managing events, user RSVPs, and more.
 With its well-organized backend structure, it can easily be extended to include additional
features such as event search, notifications, or even integration with third-party services.
