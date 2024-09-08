import { Injectable } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Diary } from './entities/diary.entity';

@Injectable()
export class DiaryService {

  constructor(
    private configService: ConfigService,
    private openai: OpenAI,
    private supabase: SupabaseClient,
  ) {}


  async create(createDiaryDto: CreateDiaryDto) {

    // Formatear el contenido como "title: my first diary | content: This is the content of my first diary entry."
    const formattedContent = `title: ${createDiaryDto.title} | content: ${createDiaryDto.content}`;

    // Crear el embedding utilizando OpenAI
    const response = await this.openai.embeddings.create({
      input: [formattedContent],
      model: 'text-embedding-3-small',
    });

    // Obtener el embedding generado
    const embedding = response.data[0].embedding;

    const diaryModel: Diary = {
      title: createDiaryDto.title,
      content: createDiaryDto.content,
      created_at: new Date(),
      embedding: embedding
    }

    // Insertar el registro en la base de datos con el embedding
    const { data, error } = await this.supabase.from('diary').insert([diaryModel]);

    if (error) {
      throw new Error(`Error creating diary: ${error.message}`);
    }

    return data;
  }

  findAll() {
    return `This action returns all diary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diary`;
  }

  update(id: number, updateDiaryDto: UpdateDiaryDto) {
    return `This action updates a #${id} diary`;
  }

  remove(id: number) {
    return `This action removes a #${id} diary`;
  }
}
