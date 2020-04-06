import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { userInfo } from 'os';

@Controller('api/ideas')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}
  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@User('id') userId, @Body() data: IdeaDTO) {
    return this.ideaService.create(userId, data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() data: Partial<IdeaDTO>,
  ) {
    return this.ideaService.update(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  destroyIdea(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.destroy(id, userId);
  }
}
