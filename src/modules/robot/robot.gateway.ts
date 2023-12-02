import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';

import { Observable, from, map } from 'rxjs';

import { RobotService } from './robot.service';
import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';
import { Robot, RobotDocument } from './entities/robot.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@WebSocketGateway(81, {
  cors: {
    origin: [
      'http://localhost:4000',
      'http://localhost:3000',
      'http://localhost:4200',
    ],
  },
})
export class RobotGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  @WebSocketServer() io: Server;
  constructor(
    private readonly robotService: RobotService,
    @InjectModel(Robot.name)
    public robotModel: Model<Robot>,
  ) {}

  change_stream: any;

  onModuleInit() {
    this.robotModel.collection
      .watch<RobotDocument>([], {
        fullDocument: 'updateLookup',
      })
      .on('change', (change: any) => {
        console.log({
          _change_stream: change.fullDocument,
        });
        this.change_stream = change;
        this.io.emit('updateRobot', change.fullDocument);
      });
  }
  private readonly logger = new Logger(RobotGateway.name);

  afterInit(server: any) {
    this.logger.debug('Sockets listos');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} disconnected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  @SubscribeMessage('createRobot')
  create(@MessageBody() createRobDto: CreateRobotDto): Promise<Robot> {
    return this.robotService.create(createRobDto);
  }

  @SubscribeMessage('findAllRobots')
  findAll(): Observable<Robot[]> {
    const robots = this.robotService.findAll();

    return from(robots).pipe(map((data) => data));

    // return robots;
  }

  @SubscribeMessage('findOneRobot')
  async findOne(@MessageBody() _id: string) {
    const robot = await this.robotService.findOne(_id);
    // const robot = await this.robotService.findOneWithSocket(_id);

    console.log(robot);

    this.io.emit('findOneRobot', robot);
  }

  @SubscribeMessage('updateRobot')
  update(@MessageBody() updateRobotDto: UpdateRobotDto): Promise<Robot> {
    return this.robotService.update(updateRobotDto._id, updateRobotDto);
  }

  @SubscribeMessage('removeRobot')
  remove(@MessageBody() id: string): Promise<Robot> {
    return this.robotService.remove(id);
  }

  @SubscribeMessage('test')
  test(@MessageBody() data: unknown): WsResponse<unknown> {
    this.logger.debug(`Payload: ${data}`);

    return {
      event: 'test',
      data: data,
    };
  }

  @SubscribeMessage('events')
  onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
    const event = 'events';
    const response = [1, 2, 3];

    return from(response).pipe(map((data) => ({ event, data })));
  }
}
