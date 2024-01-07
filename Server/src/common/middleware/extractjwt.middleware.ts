import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.cookies && req.cookies.access_token) {
      const token = req.cookies.access_token;
      req.headers.authorization = `Bearer ${token}`;
    } else if (req.headers.authorization) {
      next();
    }
    next();
  }
}
