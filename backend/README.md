# AI Image Studio Backend

A robust Node.js/Express backend for AI-powered image generation and modification using Google Gemini AI and Cloudinary.

## Features

- AI Image Generation using Google Gemini AI
- Image Modification with AI-powered transformations
- Cloud Storage with Cloudinary
- MongoDB integration for metadata storage
- Security with rate limiting and validation
- Comprehensive logging with Winston
- Centralized error handling
- RESTful API with consistent responses
- File upload handling with Multer
- **Enhanced CORS configuration** for production deployments
- Health check and CORS test endpoints
- Graceful shutdown handling
- **Production-ready Vercel deployment** with proper CORS headers

## Project Structure

```tree
backend/
├── config/           # Configuration files
│   ├── cloudinary.js # Cloudinary configuration
│   ├── env.js        # Database connection
│   └── logger.js     # Winston logger setup
├── controllers/      # Business logic
│   └── imageController.js
├── middleware/       # Express middleware
│   ├── errorHandler.js
│   ├── requestLogger.js
│   ├── uploadMiddleware.js
│   └── validation.js
├── models/          # Database models
│   └── Image.js
├── routes/          # API routes
│   └── imageRoutes.js
├── services/        # External service integrations
│   └── geminiService.js
├── logs/           # Application logs
├── index.js        # Main application file
├── package.json    # Dependencies and scripts
└── vercel.json     # Deployment configuration
```

## Installation

1. Clone the repository
2. Navigate to backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Copy environment file: `cp .example.env .env`
5. Configure environment variables in `.env`
6. Start development server: `npm run dev`
7. Start production server: `npm start`

## Environment Variables

Create a `.env` file based on `.example.env` with the following variables:

### Required Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `GEMINI_API_KEY` - Google Gemini AI API key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `FRONTEND_URL` - Frontend application URL (e.g., `https://ai-image-studio-app.vercel.app`)

### Optional Variables

- `RATE_LIMIT_WINDOW_MS` - Rate limiting window (default: 900000ms)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)
- `LOG_LEVEL` - Logging level (default: info)
- `LOG_FILE_PATH` - Log file path (default: logs/)
- `MAX_FILE_SIZE` - Max file upload size (default: 5MB)
- `ALLOWED_FILE_TYPES` - Allowed file types for uploads

## API Endpoints

### System Endpoints

- `GET /` - API information and available endpoints
- `GET /health` - Server health status
- `GET /cors-test` - CORS configuration test endpoint

### Image Generation

- `POST /api/image/generate` - Generate image from text prompt

**Request Body:**

```json
{
  "prompt": "A beautiful sunset over mountains",
  "style": "photorealistic",
  "size": "1024x1024"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "image_id",
    "url": "cloudinary_url",
    "prompt": "A beautiful sunset over mountains",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Image Modification

- `POST /api/image/modify` - Modify existing image with AI

**Request:** Multipart form data with image file and modification prompt

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "modified_image_id",
    "originalImageId": "original_image_id",
    "url": "cloudinary_url",
    "modificationPrompt": "Make it more vibrant",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Image Management

- `GET /api/image/all` - Get all images
- `GET /api/image/:id` - Get specific image by ID
- `DELETE /api/image/:id` - Delete image by ID

## CORS Configuration

The API implements a robust CORS configuration that:

- **Explicit Origin Validation** - Only allows requests from specified domains
- **Production Ready** - Supports Vercel deployments with proper domain handling
- **Development Support** - Includes localhost origins for development
- **Preflight Handling** - Properly handles OPTIONS requests
- **Security Headers** - Includes necessary CORS headers for secure communication

### Allowed Origins

The backend is configured to accept requests from:

- `https://ai-image-studio-app.vercel.app` (Production frontend)
- `https://ai-image-studio-app-frontend.vercel.app` (Alternative frontend domain)
- `http://localhost:4200` (Angular development server)
- `http://localhost:5000` (Backend development server)
- Custom domains specified in `FRONTEND_URL` environment variable

### Testing CORS

To test if CORS is working correctly:

1. **Test the CORS endpoint:**

   ```bash
   curl -H "Origin: https://ai-image-studio-app.vercel.app" \
        https://your-backend-url.vercel.app/cors-test
   ```

2. **Check browser console** for CORS errors when making requests from your frontend

3. **Verify environment variables** are set correctly in Vercel dashboard

## Rate Limiting

The API implements multiple layers of rate limiting:

- **Global Rate Limit:** 100 requests per 15 minutes per IP
- **Image Generation:** 10 requests per 15 minutes per IP
- **Image Modification:** 15 requests per 15 minutes per IP

## Security Features

- **Helmet.js** - Security headers
- **Enhanced CORS** - Production-ready cross-origin resource sharing with explicit origin validation
- **Rate Limiting** - Protection against abuse
- **Input Validation** - Request data validation
- **File Upload Validation** - Secure file handling
- **Request Logging** - Comprehensive request tracking
- **Preflight Request Handling** - Proper OPTIONS request support

## Error Handling

The API uses a centralized error handling system:

- **Custom Error Classes** - Structured error responses
- **Global Error Handler** - Catches all unhandled errors
- **Validation Errors** - Detailed validation feedback
- **Database Errors** - MongoDB error handling
- **Service Errors** - External API error handling
- **CORS Errors** - Proper CORS policy violation handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Logging

The application uses Winston for comprehensive logging:

- **Request Logging** - All incoming requests
- **Error Logging** - Detailed error information
- **Performance Logging** - Response times and metrics
- **File Rotation** - Automatic log file management

## Database Schema

### Image Model

```javascript
{
  _id: ObjectId,
  prompt: String,
  url: String,
  cloudinaryId: String,
  originalImageId: ObjectId, // For modified images
  modificationPrompt: String, // For modified images
  createdAt: Date,
  updatedAt: Date
}
```

## Dependencies

### Core Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `@google/genai` - Google Gemini AI SDK
- `cloudinary` - Cloud storage service
- `multer` - File upload handling
- `winston` - Logging framework

### Security Dependencies

- `helmet` - Security headers
- `cors` - CORS middleware
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation

### Development Dependencies

- `nodemon` - Development server with auto-restart

## Deployment

### Local Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Vercel Deployment

The project includes `vercel.json` for easy deployment to Vercel with proper CORS headers:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js",
      "headers": {
        "Access-Control-Allow-Origin": "https://ai-image-studio-app.vercel.app",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true"
      }
    }
  ]
}
```

#### Vercel Environment Variables Setup

For production deployment on Vercel, set these environment variables in your Vercel dashboard:

1. Go to your Vercel dashboard → Project Settings → Environment Variables
2. Add all required variables from the Environment Variables section above
3. Set `FRONTEND_URL` to your actual frontend domain (e.g., `https://ai-image-studio-app.vercel.app`)
4. Redeploy your application

**Important:** The `FRONTEND_URL` environment variable is crucial for CORS to work properly in production.

## Testing

Currently, the project doesn't include automated tests. To add testing:

1. Install testing framework: `npm install --save-dev jest supertest`
2. Create test files in `__tests__/` directory
3. Add test script to `package.json`
4. Run tests: `npm test`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGO_URI` in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Gemini API Errors**
   - Verify `GEMINI_API_KEY` is valid
   - Check API quota and limits
   - Ensure proper API permissions

3. **Cloudinary Upload Failures**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file formats

4. **Rate Limiting**
   - Check rate limit configuration
   - Monitor request frequency
   - Adjust limits if needed

5. **CORS Issues**
   - Verify `FRONTEND_URL` environment variable is set correctly
   - Check that the frontend domain matches the allowed origins
   - Test the `/cors-test` endpoint to verify CORS configuration
   - Ensure Vercel environment variables are properly configured
   - Clear browser cache and try again

### Logs

Check application logs in the `logs/` directory for detailed error information and debugging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
