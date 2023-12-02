import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SerialModule } from './modules/serial/serial.module';
import { RobotModule } from './modules/robot/robot.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://saf-ire:${process.env.MONGO_USER_PASSWORD}@cluster0.2xz4l9d.mongodb.net/?retryWrites=true&w=majority`,
    ),
    SerialModule,
    RobotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
