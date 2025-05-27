# NEA Website

A modern website built with Next.js, PostgreSQL, and Tailwind CSS.

## Features

- Modern UI with Tailwind CSS
- PostgreSQL database with Prisma ORM
- TypeScript for type safety
- Next.js for optimal performance
- Authentication system
- Responsive design

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd nea-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/nea_website"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses PostgreSQL with the following main models:
- User
- Post

See `prisma/schema.prisma` for the complete schema definition.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 