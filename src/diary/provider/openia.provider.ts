import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export const OpenAIProvider = {
  provide: OpenAI,
  useFactory: (configService: ConfigService) => {
    const endpoint = 'https://models.inference.ai.azure.com';
    const openaiApiKey = configService.get<string>('OPENAI_API_KEY');
    return new OpenAI({
      baseURL: endpoint,
      apiKey: openaiApiKey,
    });
  },
  inject: [ConfigService],
};