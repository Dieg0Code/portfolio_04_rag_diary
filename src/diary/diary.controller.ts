import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { SemanticQueryDto } from './dto/semantic-query.dto';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  create(@Body() createDiaryDto: CreateDiaryDto) {
    return this.diaryService.create(createDiaryDto);  
  }

  @Post('semantic-query')
  semanticQuery(@Body() semanticQueryDto: SemanticQueryDto) {
    return this.diaryService.semanticSearch(semanticQueryDto.query);
  }

  @Post('rag')
  aiResponse(@Body() semanticQuery: SemanticQueryDto) {
    return this.diaryService.ragResponse(semanticQuery);
  }

  @Get()
  findAll() {
    return this.diaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiaryDto: UpdateDiaryDto) {
    return this.diaryService.update(+id, updateDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diaryService.remove(+id);
  }
}
