import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload, AuthResponse } from '../../interfaces/auth.interface';
import ErrorMessage from '../../shared/constants/error-messages.constants';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { MembersService } from '../members/members.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const member = await this.membersService.findMemberByEmail(signInDto.email);
    if (!member) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const isMatch = await AuthHelpers.verify(
      signInDto.password,
      member.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const payload: AuthPayload = {
      sub: member.id,
      email: member.email,
      nickname: member.nickname,
      role: member.role,
    };

    return this.generateToken(payload);
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    await this.membersService.checkValidEmail(signUpDto.email);
    await this.membersService.checkValidNickname(signUpDto.nickname);

    const { passwordConfirm, ...createData } = signUpDto;
    createData.password = await AuthHelpers.hash(signUpDto.password);

    const member = await this.membersService.create(createData);

    const payload: AuthPayload = {
      sub: member.id,
      email: member.email,
      nickname: member.nickname,
      role: member.role,
    };

    return this.generateToken(payload);
  }

  private generateToken(payload: AuthPayload): AuthResponse {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
