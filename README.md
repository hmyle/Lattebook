# 📖 LatteBook - Library Management System

<p> 
<img src = 'https://github.com/hmyle/ISYS2101-G18/assets/116583355/14a8910a-2c8d-448a-b95e-a26e30b73397'>
</p>

LatteBook is a comprehensive library management system that streamlines the processes of book management, user interactions, and library administration. This project aims to provide an efficient and user-friendly platform for both librarians and library patrons.

## 💻 Features

- User Authentication and Authorization
  - User registration and login functionality
  - Role-based access control (librarian and patron)

- Book Management
  - Add, update, and delete books
  - Categorize books by author, category, and publisher
  - Search functionality to find books by title, author, or category

- User Management
  - Manage user profiles and account settings
  - Track user borrowing history and active reservations
  - Assign RFID tags to users for automatic check-in and check-out

- Reservation System
  - Allow users to reserve books online
  - Manage reservations, including pick-up and return dates
  - Calculate and track overdue fines

- Dashboard and Reporting
  - Display key statistics and metrics on the librarian's dashboard
  - Generate reports on book borrowing, overdue books, and library usage

- Integration with IoT Devices
  ![28BYJ-48-driver_and_motor_bb (1)](https://github.com/hmyle/ISYS2101-G18/assets/116583355/6dcdbc44-2642-4405-9139-69d8e76bcf56)
  - Automatic check-in and check-out using RFID technology
  - Monitor temperature and humidity levels in the library using sensors
  - Send email alerts for overdue books and extreme temperature/humidity conditions

- Book Recommendation System
  - Provide personalized book recommendations based on user preferences
  - Utilize OpenAI's GPT-3.5-turbo model for generating recommendations

## ⚙️ Technologies Used

- Node.js and Express.js for the backend server
- MongoDB and Mongoose for the database
- EJS (Embedded JavaScript) for server-side rendering of views
- HTML, CSS, and JavaScript for the frontend
- Arduino and ESP8266 for IoT device integration
- OpenAI API for book recommendation functionality

## 🛠️ Getting Started

1. Clone the repository: `git clone https://github.com/hmyle/lattebook.git`
2. Install the dependencies: `npm install`
3. Set up the MongoDB database and update the connection URI in `index.js`
4. Configure the Arduino and ESP8266 devices and update the necessary code in the IoT files
5. Obtain an API key from OpenAI and update the `openai` configuration in `index.js`
6. Start the server: `npm start`
7. Access the application in your browser at `http://localhost:3000`

## 📁 Folder Structure

- `controllers/`: Contains the route handler functions
- `middleware/`: Contains custom middleware functions
- `models/`: Defines the database schemas using Mongoose
- `public/`: Serves static files such as CSS, JavaScript, and images
- `routes/`: Defines the API endpoints and routes
- `views/`: Contains the EJS templates for rendering the views
- `index.js`: The main entry point of the application
- `iot/`: Contains the Arduino and ESP8266 code for IoT device integration

## 🌟 Authors
- Luong Tuan Kiet (Frontend Developer)
- Tran Hoang Son (Frontend Developer)
- Le Ha My (Backend Developer/System Architecture)

## License

This project is licensed under the [MIT License](LICENSE).
