import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class TokenPresenceGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
    private getHeaderValue;
    private parseGroups;
}
