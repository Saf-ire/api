import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Robot, RobotSchema } from './entities/robot.entity';
import { RobotGateway } from './robot.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Robot.name, schema: RobotSchema }]),
  ],
  controllers: [RobotController],
  providers: [RobotService, RobotGateway],
  exports: [RobotService],
})
export class RobotModule {}
