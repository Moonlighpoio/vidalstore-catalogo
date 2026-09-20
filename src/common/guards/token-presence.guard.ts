import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TokenPresenceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Formato de token inválido');
    }
    
    return true;
  }
}