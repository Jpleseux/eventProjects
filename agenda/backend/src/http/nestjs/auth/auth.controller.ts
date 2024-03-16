import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthRegisterUserResponse } from './authRegister.response.dto';
import { AuthRegisterUserRequestDto } from './authRegister.request.dto';
import { RegisterRepositoryTypeOrm } from '@Modules/auth/infra/register/repository/registerRepository.typeorm';
import { RegisterGatewayLocal } from '@Modules/auth/infra/register/gateway/registerGateway.local';
import { LoginGatewayLocal } from '@Modules/auth/infra/login/gateway/loginGatewayLocal.local';
import { LoginRepositoryTypeorm } from '@Modules/auth/infra/login/repository/loginRepositoryTypeOrm.orm';
import { saveUserUsecase } from '@Modules/auth/core/register/usecases/saveUser.usecase';
import { AuthLoginRequestDto } from './authLogin.request.dto';
import { LoginUsecase } from '@Modules/auth/core/login/usecases/login.usecase';
import { VerifyToken } from '@Modules/auth/core/login/usecases/verifyToken.usecase';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    readonly registerRepo: RegisterRepositoryTypeOrm,
    readonly registerGateway: RegisterGatewayLocal,
    readonly loginGateway: LoginGatewayLocal,
    readonly loginRepo: LoginRepositoryTypeorm,
  ) {}
  @ApiOkResponse({
    description: '',
    type: AuthRegisterUserResponse,
    isArray: false,
  })
  @Post('save/user')
  async saveUser(@Body() body: AuthRegisterUserRequestDto, @Res() response) {
    try {
      const action = new saveUserUsecase(
        this.registerRepo,
        this.registerGateway,
      );
      const output = await action.execute(body);
      response.status(HttpStatus.OK).send({
        message: 'Usuario salvo com sucesso',
        user: output.user.props,
        token: output.token,
      });
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
  }
  @Post('login')
  async Login(@Body() body: AuthLoginRequestDto, @Res() response) {
    const action = new LoginUsecase(this.loginGateway, this.loginRepo);
    const output = await action.execute(body);
    response.status(HttpStatus.OK).send({
      message: 'Login realizado com sucesso.',
      token: output.token,
      user: output.user.props,
    });
  }
  @Get('verify/:token')
  async verifyToken(@Res() response, @Param('token') token: string) {
    const action = new VerifyToken(this.loginGateway, this.loginRepo);
    const user = await action.execute(token);
    response.status(HttpStatus.OK).send({
      message: 'Usuario Autorizado.',
      token: user.props,
    });
  }
}
