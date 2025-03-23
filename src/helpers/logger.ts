import {
  ConsoleLogger,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class FormatLogger extends ConsoleLogger {}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    let ipAddress = request.headers['x-real-ip'];
    if (!ipAddress) ipAddress = ip;

    response.on('close', () => {
      const { statusCode } = response;
      this.logger.log(
        `${method} - ${originalUrl} - ${statusCode} - ${ipAddress}`,
      );
    });

    if (next) {
      next();
    }
  }
}
