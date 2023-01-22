// Custom decorator to get the user from the request object

import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: 'email', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException(
        'User not found in request object'
      );
    }

    if (data === 'email') {
      return user.email;
    }

    return user;
  }
);
