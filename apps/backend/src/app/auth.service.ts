import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(payload: { email: string; username: string; password: string }) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashed = await bcrypt.hash(payload.password, 10);
    const user = await this.usersService.create({
      email: payload.email,
      name: payload.username,
      password: hashed,
    } as any);

  const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return { user, token };
  }

  async login(payload: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(payload.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

  const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
  }

  // signing is handled via JwtService
}
