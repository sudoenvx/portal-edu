import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

/**
 * Configuration options for not found middleware
 */
export interface NotFoundOptions {
  logger?: Logger;
  message?: string;
  includeRequestInfo?: boolean;
  suggestAlternatives?: boolean;
  trackMetrics?: boolean;
  customResponse?: (req: Request, res: Response) => void;
  excludePaths?: string[];
  includeCORS?: boolean;
}

/**
 * Common API endpoints for suggestion algorithm
 */
const commonEndpoints = [
  '/api/health',
  '/api/version',
  '/api/status',
  '/health',
  '/metrics',
  '/api/users',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/docs',
  '/api-docs'
];

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
};

/**
 * Find similar endpoints to suggest as alternatives
 */
const findSimilarEndpoints = (requestedPath: string, availableEndpoints: string[]): string[] => {
  const similarities = availableEndpoints
    .map(endpoint => ({
      endpoint,
      similarity: calculateSimilarity(requestedPath, endpoint)
    }))
    .filter(item => item.similarity > 0.3) // Only suggest if similarity > 30%
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3) // Top 3 suggestions
    .map(item => item.endpoint);

  return similarities;
};

/**
 * Not Found Middleware (404 Handler)
 * 
 * Handles requests to undefined routes with helpful error messages.
 * Can suggest similar endpoints and track 404 metrics for monitoring.
 * 
 * @param options - Configuration options
 * @returns Express middleware function
 * 
 * @example
 * ```typescript
 * import { notFoundMiddleware } from './middlewares/validation/notFoundMiddleware';
 * 
 * // Should be registered as the last middleware
 * app.use(notFoundMiddleware({
 *   logger: winston.createLogger(...),
 *   suggestAlternatives: true,
 *   includeRequestInfo: true,
 *   trackMetrics: true
 * }));
 * ```
 */
export const notFoundMiddleware = (options: NotFoundOptions = {}) => {
  const {
    logger,
    message = 'The requested resource was not found',
    includeRequestInfo = true,
    suggestAlternatives = true,
    trackMetrics = true,
    customResponse,
    excludePaths = [],
    includeCORS = true
  } = options;

  // Track 404 counts for metrics
  const notFoundCounts = new Map<string, number>();

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Skip excluded paths
      if (excludePaths.some(path => req.path.startsWith(path))) {
        return next();
      }

      // Add CORS headers if enabled
      if (includeCORS) {
        res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      }

      // Track metrics
      if (trackMetrics) {
        const pathKey = req.path;
        notFoundCounts.set(pathKey, (notFoundCounts.get(pathKey) || 0) + 1);
      }

      logger?.warn(req.method)
      logger?.warn(req.path)
      logger?.warn(req.get('User-Agent'))

      // Log the 404 error
      logger?.warn('Route not found', {
        method: req.method,
        path: req.path,
        originalUrl: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        timestamp: new Date().toISOString(),
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        body: req.method !== 'GET' && Object.keys(req.body || {}).length > 0 ? 
          { hasBody: true, bodySize: JSON.stringify(req.body).length } : undefined
      });

      // Use custom response handler if provided
      if (customResponse) {
        return customResponse(req, res);
      }

      type ResponseBody = {
        error: string;
        code: string;
        message: string;
        path: string;
        method: string;
        timestamp: string;
        requestInfo?: {
          originalUrl: string;
          baseUrl: string;
          query?: Record<string, unknown>;
          headers: {
            'user-agent': string;
            'accept': string;
            'content-type': string;
          };
        };
        suggestions?: {
          message: string;
          endpoints: string[];
        };
        documentation?: {
          message: string;
          links: Array<{
            rel: string;
            href: string;
          }>;
        };
      };


      // Build response object
      const responseBody: ResponseBody = {
        error: 'Not Found',
        code: 'ROUTE_NOT_FOUND',
        message,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
      };

            // Add documentation link
      responseBody.documentation = {
        message: 'For available API endpoints, please refer to the API documentation',
        links: [
          { rel: 'documentation', href: '/docs' },
          { rel: 'openapi', href: '/api-docs' }
        ]
      };

      // Add request information if enabled
      if (includeRequestInfo) {
        responseBody.requestInfo = {
          originalUrl: req.originalUrl,
          baseUrl: req.baseUrl,
          query: Object.keys(req.query).length > 0 ? req.query : undefined,
          headers: {
            'user-agent': req.get('User-Agent') as string,
            'accept': req.get('Accept') as string,
            'content-type': req.get('Content-Type') as string
          }
        };
      }

      // Suggest similar endpoints if enabled
      if (suggestAlternatives) {
        const suggestions = findSimilarEndpoints(req.path, commonEndpoints);
        if (suggestions.length > 0) {
          responseBody.suggestions = {
            message: 'Did you mean one of these endpoints?',
            endpoints: suggestions
          };
        }

        // Provide method-specific suggestions
        if (req.method === 'POST' && req.path.includes('/login')) {
          responseBody.suggestions = {
            message: 'Authentication endpoints:',
            endpoints: ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password']
          };
        } else if (req.path.includes('/user')) {
          responseBody.suggestions = {
            message: 'User-related endpoints:',
            endpoints: ['/api/users', '/api/users/:id', '/api/users/profile']
          };
        }
      }

      // Add documentation link if it's an API request
      if (req.path.startsWith('/api/')) {
        responseBody.documentation = {
          message: 'For available API endpoints, please refer to the API documentation',
          links: [
            { rel: 'documentation', href: '/docs' },
            { rel: 'openapi', href: '/api-docs' }
          ]
        };
      }

      // Set appropriate status code
      res.status(404).json(responseBody);

    } catch (error) {
      const err = error as Error;
      
      logger?.error('Error in not found middleware', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
      });

      // Fallback response
      res.status(404).json({
        error: 'Not Found',
        code: 'ROUTE_NOT_FOUND',
        message: 'The requested resource was not found',
        timestamp: new Date().toISOString()
      });
    }
  };
};

/**
 * Get 404 metrics for monitoring
 * Returns the most frequently requested missing routes
 */
// export const getNotFoundMetrics = (middleware: ReturnType<typeof notFoundMiddleware>) => {
//   // This would need to be implemented with a shared metrics store
//   // For now, return a placeholder structure
//   return {
//     getMostRequested: (limit: number = 10) => {
//       // Implementation would depend on your metrics storage solution
//       return [];
//     },
//     getTotalCount: () => {
//       // Return total 404 count
//       return 0;
//     },
//     getCountForPath: (path: string) => {
//       // Return count for specific path
//       return 0;
//     }
//   };
// };

/**
 * Advanced 404 middleware with route registration tracking
 * This version can track registered routes and provide better suggestions
 */
export class RouteTracker {
  private registeredRoutes: Set<string> = new Set();
  private routePatterns: Map<string, RegExp> = new Map();

  /**
   * Register a route pattern
   */
  registerRoute(method: string, path: string): void {
    const key = `${method.toUpperCase()}:${path}`;
    this.registeredRoutes.add(key);

    // Convert Express route patterns to regex
    const regexPattern = path
      .replace(/:([^/]+)/g, '([^/]+)')  // :id -> ([^/]+)
      .replace(/\*/g, '.*');           // * -> .*
    
    this.routePatterns.set(key, new RegExp(`^${regexPattern}$`));
  }

  /**
   * Find similar registered routes
   */
  findSimilarRoutes(_method: string, requestedPath: string): string[] {
    const routes = Array.from(this.registeredRoutes)
      .map(route => route.split(':')[1])
      .filter(route => route);

    return findSimilarEndpoints(requestedPath, routes);
  }

  /**
   * Check if a route matches any registered pattern
   */
  matchesPattern(method: string, path: string): boolean {
    const methodRoutes = Array.from(this.routePatterns.entries())
      .filter(([key]) => key.startsWith(`${method.toUpperCase()}:`));

    return methodRoutes.some(([, pattern]) => pattern.test(path));
  }
}

/**
 * Create not found middleware with route tracking
 */
export const createAdvancedNotFoundMiddleware = (
  routeTracker: RouteTracker,
  options: NotFoundOptions = {}
) => {
  return notFoundMiddleware({
    ...options,
    suggestAlternatives: true,
    customResponse: (req, res) => {
      const suggestions = routeTracker.findSimilarRoutes(req.method, req.path);
      
      res.status(404).json({
        error: 'Not Found',
        code: 'ROUTE_NOT_FOUND',
        message: 'The requested resource was not found',
        path: req.path,
        method: req.method,
        suggestions: suggestions.length > 0 ? {
          message: 'Similar registered routes:',
          endpoints: suggestions
        } : undefined,
        timestamp: new Date().toISOString()
      });
    }
  });
};