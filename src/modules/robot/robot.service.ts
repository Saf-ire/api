import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { Model } from 'mongoose';
import { Robot, RobotDocument } from './entities/robot.entity';
import { InjectModel } from '@nestjs/mongoose';

import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';

@Injectable()
export class RobotService {
  constructor(
    @InjectModel(Robot.name)
    public robotModel: Model<Robot>,
  ) {}

  change_stream: any;

  async create(createRobotDto: CreateRobotDto): Promise<Robot> {
    const newRobot = await this.robotModel.create(createRobotDto);
    return newRobot;
  }

  async findAll(): Promise<Robot[]> {
    const robots = await this.robotModel.find().exec();

    if (!robots) {
      throw new NotFoundException('No se encontró ningún robot');
    }

    return robots;
  }

  async findOneWithSocket(_id: string) {
    this.robotModel.collection
      .watch<RobotDocument>(
        [
          {
            $match: {
              _id,
            },
          },
        ],
        {
          fullDocument: 'updateLookup',
        },
      )
      .on('change', (change) => {
        console.log(change);
        this.change_stream = change;
      });
    return this.change_stream;
  }

  async findOne(id: string): Promise<Robot> {
    const robot = await this.robotModel.findById(id).lean();

    if (!robot) {
      throw new NotFoundException(
        `No se encontró ningún robot con el _id: ${id}`,
      );
    }

    return robot;
  }

  async findTest(id: string) {
    const robot = await this.robotModel.findOne({
      name: { $eq: id },
    });

    if (!robot) {
      throw new NotFoundException(`No se encontró el robot con el _id: ${id}`);
    }

    return robot;
  }

  // async streamRobot(id: string) {
  //   const robotStream = await this.robotModel.collection.watch([{ _id: id }]);

  //   return robotStream;
  // }

  async update(id: string, updateRobotDto: UpdateRobotDto): Promise<Robot> {
    const updatedRobot = await this.robotModel
      .findByIdAndUpdate(id, updateRobotDto, { new: true })

      .exec();

    if (!updatedRobot) {
      throw new NotFoundException([
        `No se encontró ningún robot con el _id: ${id}`,
      ]);
    }

    updatedRobot.save();

    return updatedRobot;
  }

  async remove(id: string) {
    const robot = await this.robotModel.findById(id).exec();

    if (!robot) throw new BadRequestException('Ese robot no existe');

    return this.robotModel.findByIdAndRemove(id).exec();
  }
}
