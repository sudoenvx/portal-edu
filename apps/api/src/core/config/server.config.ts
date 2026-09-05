import 'dotenv/config'

export const DatabaseConfig = {
    database_url: process.env.DATABASE_URL
}

export const CorsConfig = {
    whitelist: process.env.CORS_WHITELIST?.split(',').map((origin) => origin.trim()) || [],
    credentials: true,
}

export const AppConfig = {
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000'),
}

export const JwtConfig = {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
}