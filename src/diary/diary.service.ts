import { Injectable } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Diary } from './entities/diary.entity';
import { SemanticQueryDto } from './dto/semantic-query.dto';

@Injectable()
export class DiaryService {

  constructor(
    private configService: ConfigService,
    private openai: OpenAI,
    private supabase: SupabaseClient,
  ) { }


  async create(createDiaryDto: CreateDiaryDto) {

    // Formatear el contenido como "title: my first diary | content: This is the content of my first diary entry."
    const formattedContent = `title: ${createDiaryDto.title} | content: ${createDiaryDto.content} date: ${new Date().toISOString().split('T')[0]}`;

    // Crear el embedding utilizando OpenAI
    const response = await this.openai.embeddings.create({
      input: [formattedContent],
      model: 'text-embedding-3-large',
    });

    // Obtener el embedding generado
    const embedding = response.data[0].embedding;
    console.log('Embedding length:', embedding.length);

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

  async semanticSearch(query: string) {
    const response = await this.openai.embeddings.create({
      input: [query],
      model: 'text-embedding-3-large',
    });
  
    const queryEmbedding = response.data[0].embedding;
    console.log('Query embedding length:', queryEmbedding.length);
  
    const { data, error } = await this.supabase.rpc('search_diary', {
      query_embedding: queryEmbedding,
      similarity_threshold: 0.5,
      match_count: 3
    });

    console.log(`Embedding length ${queryEmbedding.length}`);

    if (error) throw new Error(`Error searching diary: ${error.message}`);

    return data;
  }

  async ragResponse(query: SemanticQueryDto) {


    const data = await this.semanticSearch(query.query);

    const userQuery = String(query.query);
    const contextData = JSON.stringify(data);

    const prompt: string = `Eres un asistente de IA de mi diario personal, tu nombre es PIA acrónimo de Personal Intelligent Assistant. Mi Nombre es Diego y soy tu programador, la aplicación es un diario potenciado con RAG, tu función es contestar la consultas del usuario y responder en base a la información contenida en el contexto, obtenida mediante búsqueda semántica en la base de datos, no te desvíes del tema por ningún motivo. La consulta original del usuario fue __UserQuery: ${userQuery} y el resultado de la búsqueda semántica fue __Context: ${contextData}, fecha actual ${new Date().toISOString().split('T')[0]}, en base a esto debes generar una respuesta para el usuario. Debes tener en cuenta el la query del usuario, hay veces que no es necesario que uses el contexto para responder, como cuando te saluda, te cuenta algo, etc. debes tener criterio para saber cuando usar el contexto y cuando no. No es necesario que quieras entablar una conversación con el usuario, tu función principal es devolver información relevante en base a la consulta, eres similar a una secretaria, puedes conversar pero debes ser breve y profesional, va a haber cierta información que puedes deducir en base a la consulta y al contexto, pero no debes inventar información, solo responder con decocciones cuando sea muy obvio.`;


    const iaResponse = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: prompt,
        }
      ],
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 1000,
    });

    console.log(data);
    console.log(query);

    const res = iaResponse.choices[0].message.content;

    if (!res) throw new Error(`Error generating response ${iaResponse}`);

    return res;
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
