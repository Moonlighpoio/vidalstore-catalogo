import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

interface AuthenticatedRequest {
  user?: {
    sub: string;
    groups: string[];
  };
}

@Injectable()
export class EditorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      throw new UnauthorizedException(
        'Authenticated user is required',
      );
    }

    const groups = request.user.groups ?? [];

    const isEditor = groups.includes('editores');
    const isAdmin = groups.includes('administradores');

    if (!isEditor && !isAdmin) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}