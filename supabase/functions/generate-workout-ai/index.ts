import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, userPreferences } = await req.json();
    
    console.log('Gerando treino com IA para:', userProfile);

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY não configurado');
    }

    // Construir prompt personalizado baseado nas preferências do usuário
    const userPrompt = `
    Preciso de um plano de treino personalizado com as seguintes informações:

    1. Objetivo: ${userPreferences.goal === 'weight-loss' ? 'Perder gordura' : userPreferences.goal === 'mass' ? 'Ganhar massa muscular' : 'Manter forma física'}
    2. Dias por semana: ${userPreferences.training_days}
    3. Nível: ${userPreferences.fitness_level === 'beginner' ? 'Iniciante' : userPreferences.fitness_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
    4. Grupos musculares preferidos: ${userPreferences.preferred_muscle_groups?.join(', ') || 'Todos'}
    5. Tenho acesso a academia completa
    6. Idade: ${userProfile.age || 'Não informado'} anos, Peso: ${userProfile.weight || 'Não informado'} kg

    IMPORTANTE: 
    - Retorne APENAS um JSON válido com a seguinte estrutura
    - TODOS os nomes de exercícios devem estar em PORTUGUÊS BRASILEIRO
    - Use nomes tradicionais brasileiros para os exercícios
    
    {
      "workouts": [
        {
          "day": "Segunda-feira",
          "exercises": [
            {
              "name": "Nome do exercício em português",
              "sets": 3,
              "reps": "12-15",
              "rest": 60,
              "instructions": "Instruções detalhadas em português"
            }
          ]
        }
      ]
    }

    Exemplos de nomes corretos em português:
    - Supino Reto (não Bench Press)
    - Agachamento (não Squats)
    - Remada Curvada (não Bent Over Rows)
    - Rosca Direta (não Bicep Curls)
    - Desenvolvimento (não Shoulder Press)
    - Leg Press (este pode ficar)
    - Stiff (este pode ficar)
    - Prancha (não Plank)

    Crie exatamente ${userPreferences.training_days} treinos diferentes, um para cada dia da semana que treina.
    `;

    const systemPrompt = `Você é um personal trainer experiente. Sua função é criar treinos personalizados de acordo com os dados fornecidos pelo usuário, sempre considerando saúde, segurança e evolução gradual. Os treinos devem ser detalhados, simples de seguir, e divididos por dias. O plano deve se ajustar conforme os objetivos, rotina, equipamento disponível e nível atual do aluno. SEMPRE retorne apenas JSON válido, sem texto adicional.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API Groq:', errorText);
      throw new Error(`Erro na API Groq: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Resposta vazia da IA');
    }

    console.log('Resposta da IA:', aiResponse);

    // Parse da resposta JSON da IA
    let workoutPlan;
    try {
      // Limpar possível texto extra e extrair apenas o JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workoutPlan = JSON.parse(jsonMatch[0]);
      } else {
        workoutPlan = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta da IA:', parseError);
      console.error('Resposta original:', aiResponse);
      throw new Error('Erro ao interpretar resposta da IA');
    }

    return new Response(JSON.stringify({
      success: true,
      workoutPlan: workoutPlan.workouts || workoutPlan
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função generate-workout-ai:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});