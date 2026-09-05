import express, { Application } from 'express';
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet';
import cookieParser from 'cookie-parser'

import { CorsConfig } from './core/config/server.config';
import { notFoundMiddleware } from './core/middlewares/not-found.mw';
import logger from './core/utils/logger';
import errorHandler from './core/middlewares/error-handler.mw';
import { AdminRouter } from './modules/admin';
import { TeacherRouter } from './modules/teacher/teacher.routes';

export const app: Application = express();
app.use(helmet())
app.use(cookieParser())

const whitelist = CorsConfig.whitelist

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },

  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'locale']
})

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression())

app.use(
  '/api',
  AdminRouter,
  TeacherRouter
)

const $404 = notFoundMiddleware({
  logger: logger,
  suggestAlternatives: true,
  includeRequestInfo: true,
  trackMetrics: true
})

app.use($404);

app.use(errorHandler)