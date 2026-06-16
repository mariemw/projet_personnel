import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { LoginUserDto } from 'src/models/dto/login-user.dto';
import { UserService } from 'src/services/user/user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService:UserService,
                private readonly mailerService:MailerService
    ){}

    @Get('/verify')
    async verifyUser(@Query('token') token:string,@Res() res:Response){
        await this.userService.verifyUser(token);
        return res.json({ message: 'Votre compte a été vérifié avec succès !' });
    }

    @Get('/:id')
    async getUserById(@Param('id') userId,@Res() res:Response){
        const user=await this.userService.getUserById(userId);
        return res.send(user);
    }

    @Post('/login')
    async getUser(@Body() userFound:LoginUserDto,@Res() res:Response){
        try{
            const user=await this.userService.findUser(userFound);
            return res.status(HttpStatus.OK).json(user);
        }
        catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }

    @Post('/new')
    async createNewUser(@Body() createUserDto:CreateUserDto, @Res() res:Response){
        const token=await this.userService.createUser(createUserDto);
        const verificationLink=`http://localhost:3000/users/verify?token=${token}`;
        await this.mailerService.sendMail({
            to: createUserDto.email,
            subject: 'TEST EMAIL ',
            html: `
                <h2>Hello 👋</h2>
                <p>Welcome to our app</p>
                <a href=${verificationLink}>ici</a>
                `,
        });
        return res.json({ message: 'Utilisateur créé avec succès',token });
    }

}
