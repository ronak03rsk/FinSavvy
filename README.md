# ExpenseTracker

ExpenseTracker is a full-stack application designed to help users manage their expenses, track financial goals, and gain insights into their spending habits. The app includes gamification features to make financial management engaging and rewarding.

## Features

### Frontend
- **Expense Tracking**: Add, view, and categorize expenses.
- **Gamification Dashboard**: Earn points and badges for financial activities.
- **AI Assistant**: Get financial advice and insights.
- **Monthly Reports**: Generate and download PDF reports of expenses.
- **Multi-Language Support**: Switch between languages for a personalized experience.

### Backend
- **Authentication**: Secure login and registration using JWT.
- **Database**: MongoDB for storing user data and expenses.
- **AI Integration**: Rule-based AI assistant for financial advice.
- **PDF Generation**: Create monthly financial summaries.
- **Email Notifications**: Send reports via email.

## Technologies Used

### Frontend
- React
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- MongoDB

### Additional Libraries
- Axios
- PDFKit
- Nodemailer

## Installation

### Prerequisites
- Node.js
- MongoDB

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ronak03rsk/FinSavvy.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ExpenseTracker
   ```

3. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

4. Install dependencies for the frontend:
   ```bash
   cd ../frontend/expense-tracker
   npm install
   ```

5. Create a `.env` file in the `backend` directory and add the following:
   ```properties
   PORT=5000
   MONGO_URI=<your_mongo_connection_string>
   JWT_SECRET=<your_jwt_secret>
   HF_API_KEY=<your_hugging_face_api_key>
   ```

6. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

7. Start the frontend development server:
   ```bash
   cd ../frontend/expense-tracker
   npm run dev
   ```

## Deployment

### Backend
- Use platforms like Heroku, AWS, or Render.
- Ensure environment variables are configured.

### Frontend
- Build the frontend:
  ```bash
  npm run build
  ```
- Deploy the `dist` folder to platforms like Netlify or Vercel.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
