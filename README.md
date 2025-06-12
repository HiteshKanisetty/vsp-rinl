# Rake Placement Memo Management System

This project is a web-based application for managing railway wagon placement memos, acknowledgements, and related logistics. It features real-time wagon tracking, user authentication, dashboard insights, and robust data validation using Node.js, Express.js, MongoDB, and EJS.

---

## Features

- **User Authentication**: Secure login and role-based access.
- **Memo Management**: Create, view, and update placement memos.
- **Wagon Management**: Add, assign, and track wagons.
- **Challan Management**: Manage challans with release dates and times.
- **Dashboard**: Visual overview of loaded, unloaded, damaged, and under-maintenance wagons.
- **Real-Time Updates**: Immediate status changes reflected in the UI.
- **Responsive UI**: Built with EJS templates and CSS.

---

## Technologies & Packages Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [EJS](https://ejs.co/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) (for password hashing)
- [express-session](https://www.npmjs.com/package/express-session) (for session management)
- [connect-mongo](https://www.npmjs.com/package/connect-mongo) (MongoDB session store)
- [dotenv](https://www.npmjs.com/package/dotenv) (for environment variables)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [nodemon](https://www.npmjs.com/package/nodemon) (for development auto-reload)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or Atlas cloud instance)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. **Clone the Repository**

```sh
git clone <your-repo-url>
cd vsp-rinl
```

### 2. **Install All Required Packages**

Run the following command to install all dependencies in one go:

```sh
npm install express mongoose ejs bcryptjs express-session connect-mongo dotenv body-parser nodemon
```

This will install everything needed for the backend, frontend templating, authentication, session management, and development auto-reload.

### 3. **Set Up Environment Variables**

Create a `.env` file in the root directory:

```
PORT=2000
MONGODB_URI=mongodb://localhost:27017/vsp-rinl
SESSION_SECRET=your_secret_key
```

> Adjust `MONGODB_URI` if using MongoDB Atlas or a different local port.

### 4. **Start MongoDB**

If running locally, start your MongoDB server:

```sh
mongod
```

### 5. **Run the Application**

For development (with auto-reload):

```sh
npm run dev
```

Or for production:

```sh
npm start
```

The app will be available at [http://localhost:2000](http://localhost:2000).

---

## Project Structure

```
vsp-rinl/
│
├── controllers/
│   └── mastercontroller.js
├── models/
│   ├── user.js
│   ├── memo.js
│   ├── wagon.js
│   └── challan.js
├── routes/
│   └── masterroutes.js
├── views/
│   └── master-dash/
│       └── newmemo.ejs
├── public/
│   ├── memo.js
│   └── newmemo.css
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## Useful Commands

- **Install all dependencies:**  
  `npm install express mongoose ejs bcryptjs express-session connect-mongo dotenv body-parser nodemon`

- **Start the server (development):**  
  `npm run dev`

- **Start the server (production):**  
  `npm start`

- **Install a new package:**  
  `npm install <package-name>`

---

## Notes for Beginners

- Make sure MongoDB is running before starting the app.
- Default login and user creation logic may need to be set up in your database.
- If you change `.env`, restart the server.
- For any issues, check the terminal for error messages.

---

## License

This project is for educational and internal use.  
Feel free to modify and extend as per your requirements.

---

**Happy Coding!**
