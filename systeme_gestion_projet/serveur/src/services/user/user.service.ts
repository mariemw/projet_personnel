import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { LoginUserDto } from 'src/models/dto/login-user.dto';
import { User, UserDocument } from 'src/models/schema/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel:Model<UserDocument>
    ){  }


    async getUserById(userId:String){
        return await this.userModel.findById(userId);
    }
    
    async findUser(userFound:LoginUserDto){
        const user= await this.userModel.findOne({userName:userFound.userName});
        if (!user) {
            throw new NotFoundException('Utilisateur introuvable');
        }

        if (user.password !== userFound.password) {
            throw new UnauthorizedException('Mot de passe invalide');
        }

        if(!user.isVerified){
            throw new UnauthorizedException('Veuillez vérifier votre adresse e-mail avant de vous connecter');
        }

        return user;
    }

    async findUserByName(userName:string){
        const user= await this.userModel.findOne({userName:userName});

        if (!user) {
            throw new NotFoundException('Utilisateur introuvable');
        }

        return user;
    }

    async createUser(createUserDto:CreateUserDto):Promise<string>{
        const token=crypto.randomBytes(32).toString('hex');
        const expireDate = new Date(); 
        expireDate.setHours(expireDate.getHours() + 24); 
        const existingUser=await this.userModel.findOne({userName:createUserDto.userName});

        if (existingUser){
            throw new ConflictException('Cet utilisateur existe déjà');
        }
        const user={...createUserDto,isVerified:false,verificationToken:token,tokenExpiredAt:expireDate}
        const newUser=new this.userModel(user);
        await newUser.save();
        return token;
    }

    async verifyUser(token:string){
        const userWithToken=await this.userModel.findOne({verificationToken:token});
        if (!userWithToken) throw new BadRequestException('Jeton invalide');
        const date=new Date();
        if (date>userWithToken.tokenExpiredAt){
            throw new BadRequestException('Jeton expirée');
        }
        userWithToken.isVerified=true;
        userWithToken.verificationToken='';
        await userWithToken.save();
    }
}
