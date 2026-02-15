// common/decorators/cookies.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext): string | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ cookies?: Record<string, string> }>();
    return request.cookies?.[cookieName];
  },
);

export const AllCookies = createParamDecorator(
  (
    _data: unknown,
    ctx: ExecutionContext,
  ): Record<string, string> | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ cookies?: Record<string, string> }>();
    return request.cookies;
  },
);
