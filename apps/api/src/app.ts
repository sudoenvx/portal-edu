import express, { Application } from 'express';
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet';

import { CorsConfig } from './core/config/server.config';
import { notFoundMiddleware } from './core/middlewares/not-found.mw';
import logger from './core/utils/logger';
import errorHandler from './core/middlewares/error-handler.mw';
import { AdminRouter } from './modules/admin';

export const app: Application = express();
app.use(helmet())

app.use(
  '/api',
  AdminRouter
)

const whitelist = CorsConfig.whitelist

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
})

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression())

const $404 = notFoundMiddleware({
  logger: logger,
  suggestAlternatives: true,
  includeRequestInfo: true,
  trackMetrics: true
})

app.use($404);

app.use(errorHandler)