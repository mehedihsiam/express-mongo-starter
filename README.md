# Express MongoDB Starter Template

A production-grade Express.js + MongoDB/Mongoose starter template with TypeScript, comprehensive error handling, Winston logging, Joi validation, and security best practices.

## Features

- ✅ **TypeScript** - Strict mode enabled
- ✅ **Error Handling** - Centralized error middleware with standardized responses
- ✅ **Response Handler** - Universal ApiResponseHandler with error/success/info methods
- ✅ **Logging** - Winston logger with file rotation
- ✅ **Validation** - Joi schema validation
- ✅ **Security** - Helmet, CORS, Rate Limiting
- ✅ **Database** - MongoDB with connection retry logic and graceful shutdown
- ✅ **Async Handler** - Eliminate try-catch boilerplate
- ✅ **Health Checks** - /health and /ready endpoints

## Quick Start

1. Clone this repository
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Copy `.env.example` to `.env` and configure:

   ```bash
   cp .env.example .env
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── env.ts        # Environment variables
│   ├── database.ts   # MongoDB connection
│   └── winston-logger.ts  # Logger setup
├── middleware/       # Express middleware
│   ├── error.middleware.ts
│   ├── auth.middleware.ts
│   └── request-id.middleware.ts
├── modules/          # Feature modules
│   └── example/      # Example module
│       ├── example.controller.ts
│       ├── example.service.ts
│       ├── example.model.ts
│       ├── example.route.ts
│       └── example.validation.ts
├── utils/            # Utility functions
│   ├── response.ts   # Response handler
│   ├── asyncHandler.ts
│   ├── apiError.ts
│   └── validationMiddleware.ts
├── app.ts            # Express app setup
├── index.ts          # Entry point
└── generate-module.ts # Module generator CLI
```

## API Response Format

All endpoints return standardized responses:

```typescript
// Success Response
{
  "status": "success",
  "data": {...},
  "message": "Retrieved successfully"
}

// Error Response
{
  "status": "error",
  "message": "Error message",
  "errors": {...},
  "statusCode": 400
}

// Info Response
{
  "status": "info",
  "message": "Info message",
  "data": {...}
}
```


This creates:

- Controller
- Service
- Model
- Routes
- Validation schema

## Environment Variables

See `.env.example` for all available configuration options.

## Error Handling

Errors are automatically caught by the centralized error middleware and formatted consistently. Supports:

- Mongoose validation errors
- MongoDB duplicate key errors (11000)
- JWT errors
- Custom ApiError instances
- Unhandled exceptions

## License

MIT
