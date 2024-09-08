import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SupabaseProvider = {
  provide: SupabaseClient,
  useFactory: (configService: ConfigService) => {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseKey = configService.get<string>('SUPABASE_KEY');
    return createClient(supabaseUrl, supabaseKey);
  },
  inject: [ConfigService],
};