🚗 RideLink Frontend
A modern and responsive frontend for the RideLink carpooling platform, enabling users to seamlessly search, book, and manage shared rides with real-time communication and interactive UI components.

🌟 Overview
RideLink’s frontend provides a **smooth and intuitive user experience** for connecting travelers heading in the same direction. It integrates with a Spring Boot backend to deliver features like ride discovery, booking workflows, real-time chat, and user analytics.

🚀 Features
 🔐 Authentication
* Login & Signup UI
* JWT-based authentication
* Token stored securely in localStorage
* Protected routes for authenticated users

 🚗 Ride Management
* Search rides based on location
* Book available rides
* View upcoming rides
* Dynamic ride cards with key details

 📍 Ride History
* View ride history with **Driver / Passenger toggle**
* Displays:
  * Ride details
  * Savings / earnings
  * Rating system
* Integrated review submission UI

💬 Real-time Chat
* WebSocket-powered chat interface
* Dedicated chat room per ride
* Enables communication between ride participants

⭐ Rating System
* Rate drivers after ride completion
* Supports:
  * Star-based ratings
  * Optional comments
* Conditional UI (rate only if not already rated)

👤 User Dashboard
* Central hub for:
  * Ride stats
  * Activity overview
  * Navigation between features

🎨 UI/UX

* 🌙 Dark theme interface
* 📱 Fully responsive design
* Clean and modern layout using reusable components

 🧠 Tech Stack
 Category   Technology   
 Framework | React (Vite) 
 Routing   | React Router 
 Styling   | Tailwind CSS 
 State     | React Hooks  
 API       | Fetch API    
 Realtime  | WebSockets   

📂 Pages

* `/login` → Authentication page
* `/dashboard` → Main user dashboard
* `/search` → Find available rides
* `/book` → Book a ride
* `/history` → Ride history (Driver/Passenger)
* `/chat` → Ride-based chat system
* `/upcoming` → Upcoming rides

🔗 API Integration
* Integrated with Spring Boot backend
  
⚙️ Setup & Installation
1. Clone the repository
git clone https://github.com/your-username/ridelink-frontend.git](https://github.com/CharviBhake/RideLink-Frontend.git
cd ridelink-frontend

2. Install dependencies
npm install

 3. Configure environment variables
Create a `.env` file:
VITE_API_URL=http://localhost:8080

4. Run the app
npm run dev


📸 Screenshots

> Add screenshots by placing images in an `assets/` folder


### 🏠 Dashboard
![Login](.src/assets/login.png)
![Sign-up](.src/assets/sign-up.png)
![Dashboard](.src/assets/dashboard.png)

---

### 🔍 Ride Search

![Search](.src/assets/search.png)

---

### 📜 Ride History

![History](.src/assets/history.png)

---

### 💬 Chat

![Chat](.src/assets/chat.png)

---

### 👤 Profile / Upcoming Rides

![Profile](.src/assets/profile.png)


💡 Key Highlights
* Real-time communication using WebSockets
* Geolocation-based ride discovery
* Dynamic UI with conditional rendering
* Clean separation of concerns with reusable components

🎯 Purpose
This project was built to:
* Demonstrate full-stack integration skills
* Build a real-world ride-sharing interface
* Showcase frontend architecture and state management



---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
