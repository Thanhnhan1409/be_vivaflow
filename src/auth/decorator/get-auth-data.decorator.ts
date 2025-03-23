import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { user } from '@prisma/client';

export const GetAuthData = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    console.log('Request user:', request.user); // 🛠 Debug
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);

export type AuthData = Pick<user, 'id' | 'email' | 'username'>;
