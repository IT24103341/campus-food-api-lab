# Campus Food Ordering API

## Description
This is a RESTful API for a campus food ordering system built with Node.js, Express, and MongoDB.

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- Postman for testing

## API Endpoints

### Students
- POST `/students` - Create a student
- GET `/students` - Get all students
- GET `/students/:id` - Get student by ID

### Menu Items
- POST `/menu-items` - Create menu item
- GET `/menu-items` - Get all menu items
- GET `/menu-items/search` - Search menu items

### Orders
- POST `/orders` - Place an order
- GET `/orders` - Get all orders (with pagination)
- PATCH `/orders/:id/status` - Update order status
- DELETE `/orders/:id` - Delete order

### Analytics
- GET `/analytics/total-spent/:studentId` - Get total spent by student
- GET `/analytics/top-menu-items` - Get top selling items
- GET `/analytics/daily-orders` - Get daily order counts

## Setup Instructions
1. Clone the repository
2. Run `npm install`
3. Create `.env` file with MongoDB URI
4. Run `node server.js`

## Author
IT24103341
