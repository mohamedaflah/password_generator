import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response, response } from 'express';
response;
import { JwtService } from 'src/utils/jwt/jwt.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const response = await this.userService.register(createUserDto);
    console.log('🚀 ~ UserController ~ register ~ response:', response);
    if (response.user) {
      const token: string = this.jwtService.generateToken(
        response.user.userName,
      );
      res.cookie('token', token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
      return res.status(200).json({ success: true, token, ...response });
    }
    // else
    return res.json({ success: false, ...response });
  }

  @Post('login')
  async login(@Body() loginUserDto, @Res() res: Response) {
    console.log('🚀 ~ UserController ~ login ~ loginUserDto:', loginUserDto);
    const response = await this.userService.login(loginUserDto);
    console.log(response);

    if (response.user) {
      // its the case user data is matching
      const token: string = this.jwtService.generateToken(
        response.user.userName,
      );
      res.cookie('token', token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
      return res.status(200).json({ success: true, token, ...response });
    }
    // else
    console.log('eslo');

    return res.status(500).json({ success: false, ...response });
  }

  @Get('/')
  authCheck(@Req() request: Request) {
    const token: string = request.cookies?.token;
    if (!token) {
      return {
        success: false,
        message: 'user is not authenticated',
      };
    }

    const verifiedToken: Promise<boolean> = this.jwtService.verifyToken(token);
    if (verifiedToken) {
      return {
        success: true,
        message: 'user is authenticated',
      };
    }
    // else
    return {
      success: false,
      message: 'user is not authenticated',
    };
  }

  @Get('logout')
  logout(@Res() response: Response) {
    try {
      response.clearCookie('token');
      return response.json({
        success: true,
        message: 'successfully logged out',
      });
    } catch (error) {
      console.log(error, 'in catch');
      return response.json({
        success: false,
        message: error,
      });
    }
  }
}
