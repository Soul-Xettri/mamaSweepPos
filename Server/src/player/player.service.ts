import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerDto } from './dto/player.dto';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async addPlayer(userId: string, dto: PlayerDto) {
    const check = await this.prisma.player.findUnique({
      where: {
        facebookURL: dto.facebookURL,
      },
    });
    if (check) {
      throw new ForbiddenException('Player already exists');
    }
    const player = await this.prisma.player.create({
      data: {
        name: dto.name,
        facebookURL: dto.facebookURL,
        image: dto.image,
        note: dto.note,
        addedBy: userId,
        Game:{
          create:{
            iGN: dto.iGN,
            type:dto.gameName,
          }
        }
      },
      include:{
        Game:true,
      }
    });
    return player;
  }

  async getAllPlayers() {
    return await this.prisma.player.findMany({
      include: {
        Transaction: true,
        Game:true,
      },
    });
  }

  async getPlayerById(id: string) {
    const player = await this.prisma.player.findFirst({
      where: {
        id,
      },
      include: {
        Transaction: true,
        Game:true,
      },
    });
    if (!player) {
      throw new NotFoundException('Player not found!!!');
    }
    return player;
  }
}
