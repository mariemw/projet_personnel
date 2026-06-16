import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from 'src/controllers/project/project.controller';
import { Project, ProjectSchema } from 'src/models/schema/project.schema';
import { UserSchema } from 'src/models/schema/user.schema';
import { ProjectService } from 'src/services/project/project.service';
import { UserService } from 'src/services/user/user.service';
import { UserModule } from '../user/user.module';
import { ProjectGateway } from 'src/gateways/project/project.gateway';
import { ListsGateway } from 'src/gateways/lists/lists.gateway';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Project.name,schema:ProjectSchema}]),
        UserModule
    ],
    controllers:[ProjectController],
    providers:[ProjectService,ProjectGateway,ListsGateway],
    exports:[ProjectService]
})
export class ProjectModule {}
