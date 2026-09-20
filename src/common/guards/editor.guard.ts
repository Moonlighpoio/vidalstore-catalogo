import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    'cognito:groups'?: string[];
  };
}

@Injectable()
export class EditorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const groups = request.user?.['cognito:groups'] ?? [];

    const isEditor = groups.includes('editores');
    const isAdmin = groups.includes('administradores');

    if (!isEditor && !isAdmin) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}