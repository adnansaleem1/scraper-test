import { Controller, Request, Post, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Successfully logged in.', schema: {
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.NjUXjSLWEHRHxLQUT5H4MDQ2trMJXoKP0eCsO7eRUcU'
    }
  }})
  @ApiResponse({ status: 400, description: 'Username and password are required' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    if (!loginDto.username || !loginDto.password) {
        throw new BadRequestException('Username and password are required');
    }
    return this.authService.login(req.user);
  }
}
