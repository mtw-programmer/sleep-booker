import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuad extends AuthGuard('local') {}
