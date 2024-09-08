import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { ConfigModule } from '@nestjs/config';
import { OpenAIProvider } from './provider/openia.provider';
import { SupabaseProvider } from './provider/supabase.provider';

@Module({
  imports: [ConfigModule],
  controllers: [DiaryController],
  providers: [DiaryService, OpenAIProvider, SupabaseProvider],
})
export class DiaryModule {}
