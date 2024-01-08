import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { PlayerDto } from './dto/player.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  addPlayer(@GetCurrentUserId() userId: string, @Body() dto: PlayerDto) {
    return this.playerService.addPlayer(userId, dto);
  }

  @Get('all')
  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @Get(':id')
  getPlayerById(@Param('id') id: string) {
    return this.playerService.getPlayerById(id);
  }
}
