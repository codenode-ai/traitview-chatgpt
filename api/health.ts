// Health check endpoint
import { supabase } from '@/lib/supabaseClient';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  try {
    // Testar conexão com Supabase
    const { data, error } = await supabase
      .from('testes')
      .select('id')
      .limit(1);
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Database connection failed',
          error: error.message 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        status: 'ok', 
        message: 'TraitView API is running',
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Internal server error',
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}