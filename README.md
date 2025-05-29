# AI Image Studio App

AI Image Studio App is a web application that allows users to generate and modify images using AI technology. The application uses the Gemini AI model from Google for image generation and modification.

## Features

- **AI Image Generation**: Generate completely new images based on text prompts
- **AI Image Modification**: Upload existing images and modify them using text prompts
- **Cloud Storage**: All generated and modified images are stored in Cloudinary
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Project Structure

The project is structured into two main parts:

### Frontend (Angular)

- Built with Angular v20
- Uses TailwindCSS for styling
- Communicates with the backend API for image processing

### Backend (Node.js)

- Express.js server
- MongoDB database for storing image metadata
- Google Generative AI (Gemini) for image generation and modification
- Cloudinary for image storage

## Technologies Used

- **Frontend**:
  - Angular v20
  - TailwindCSS
  - RxJS
  
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB/Mongoose
  - Google Generative AI (@google/generative-ai)
  - Cloudinary
  - Multer for file handling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB instance
- Google Gemini API key
- Cloudinary account

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/ai-image-studio.git
   cd ai-image-studio
   ```

2. Install frontend dependencies

   ```bash
   npm install
   ```

3. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

4. Set up environment variables:
   - Copy the `.example.env` to `.env` in the backend directory
   - Fill in your credentials:

     ```env
     MONGO_URI=your_mongodb_connection_string
     GEMINI_API_KEY=your_google_gemini_api_key
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     PORT=5000
     ```

### Running the Application

1. Start the backend server

   ```bash
   cd backend
   npm run dev
   ```

2. Start the Angular frontend (in another terminal)

   ```bash
   cd ..  # Return to the project root
   npm start
   ```

3. Open your browser at `http://localhost:4200`

## API Endpoints

- `POST /api/image/generate`: Generate an image from a text prompt
- `POST /api/image/modify`: Modify an uploaded image using a text prompt
- `GET /api/image/all`: Get all previously generated and modified images

## Deployment

The application is deployed using Vercel:

- Frontend: <https://ai-image-studio-app-app.vercel.app>
- Backend: <https://ai-image-studio-app-api.vercel.app>

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created by Manthan Ankolekar
