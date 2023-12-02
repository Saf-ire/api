import { Module } from '@nestjs/common';
import { SerialService } from './serial.service';
import { SerialController } from './serial.controller';

@Module({
  controllers: [SerialController],
  providers: [
    SerialService,
    // {
    //   provide: 'SerialService',
    //   useFactory: SerialService,
    // },
  ],
})
export class SerialModule {}
