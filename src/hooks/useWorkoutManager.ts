import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  exerciseId: number;
  rest: string;
}

interface WorkoutSession {
  id: string;
  day_name: string;
  session_date: string;
  exercises: WorkoutExercise[];
  is_completed: boolean;
  completed_at?: string;
}

export const useWorkoutManager = (user: any) => {
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const workoutTemplates = {
    2: [
      { day: "Segunda", title: "Treino A - Corpo Superior", exercises: [
        { name: "Supino Reto", sets: 4, reps: 10, exerciseId: 88, rest: "90s" },
        { name: "Remada Curvada", sets: 4, reps: 10, exerciseId: 84, rest: "90s" },
        { name: "Desenvolvimento", sets: 3, reps: 12, exerciseId: 91, rest: "60s" },
        { name: "Rosca Direta", sets: 3, reps: 12, exerciseId: 92, rest: "60s" },
        { name: "Tríceps Testa", sets: 3, reps: 12, exerciseId: 93, rest: "60s" }
      ]},
      { day: "Quinta", title: "Treino B - Corpo Inferior", exercises: [
        { name: "Agachamento", sets: 4, reps: 12, exerciseId: 111, rest: "90s" },
        { name: "Leg Press", sets: 4, reps: 15, exerciseId: 345, rest: "90s" },
        { name: "Mesa Flexora", sets: 3, reps: 12, exerciseId: 456, rest: "60s" },
        { name: "Panturrilha", sets: 4, reps: 20, exerciseId: 576, rest: "45s" },
        { name: "Abdômen", sets: 3, reps: 20, exerciseId: 234, rest: "45s" }
      ]}
    ],
    3: [
      { day: "Segunda", title: "Treino A - Peito e Tríceps", exercises: [
        { name: "Supino Reto", sets: 4, reps: 10, exerciseId: 88, rest: "90s" },
        { name: "Supino Inclinado", sets: 3, reps: 12, exerciseId: 89, rest: "90s" },
        { name: "Crossover", sets: 3, reps: 12, exerciseId: 90, rest: "60s" },
        { name: "Tríceps Pulley", sets: 4, reps: 12, exerciseId: 94, rest: "60s" },
        { name: "Tríceps Testa", sets: 3, reps: 12, exerciseId: 93, rest: "60s" }
      ]},
      { day: "Quarta", title: "Treino B - Costas e Bíceps", exercises: [
        { name: "Barra Fixa", sets: 4, reps: 8, exerciseId: 154, rest: "90s" },
        { name: "Remada Curvada", sets: 4, reps: 10, exerciseId: 84, rest: "90s" },
        { name: "Puxada Triangular", sets: 3, reps: 12, exerciseId: 513, rest: "60s" },
        { name: "Rosca Direta", sets: 4, reps: 12, exerciseId: 92, rest: "60s" },
        { name: "Rosca Martelo", sets: 3, reps: 12, exerciseId: 272, rest: "45s" }
      ]},
      { day: "Sexta", title: "Treino C - Pernas e Glúteos", exercises: [
        { name: "Agachamento", sets: 5, reps: 10, exerciseId: 111, rest: "120s" },
        { name: "Leg Press", sets: 4, reps: 15, exerciseId: 345, rest: "90s" },
        { name: "Cadeira Extensora", sets: 3, reps: 15, exerciseId: 127, rest: "60s" },
        { name: "Mesa Flexora", sets: 3, reps: 12, exerciseId: 456, rest: "60s" },
        { name: "Panturrilha", sets: 4, reps: 20, exerciseId: 576, rest: "45s" }
      ]}
    ],
    4: [
      { day: "Segunda", title: "Treino A - Peito e Tríceps", exercises: [
        { name: "Supino Reto", sets: 4, reps: 10, exerciseId: 88, rest: "90s" },
        { name: "Supino Inclinado", sets: 3, reps: 12, exerciseId: 89, rest: "90s" },
        { name: "Crossover", sets: 3, reps: 12, exerciseId: 90, rest: "60s" },
        { name: "Tríceps Pulley", sets: 4, reps: 12, exerciseId: 94, rest: "60s" }
      ]},
      { day: "Terça", title: "Treino B - Costas e Bíceps", exercises: [
        { name: "Barra Fixa", sets: 4, reps: 8, exerciseId: 154, rest: "90s" },
        { name: "Remada Curvada", sets: 4, reps: 10, exerciseId: 84, rest: "90s" },
        { name: "Puxada Triangular", sets: 3, reps: 12, exerciseId: 513, rest: "60s" },
        { name: "Rosca Direta", sets: 4, reps: 12, exerciseId: 92, rest: "60s" }
      ]},
      { day: "Quinta", title: "Treino C - Quadríceps e Glúteos", exercises: [
        { name: "Agachamento", sets: 5, reps: 10, exerciseId: 111, rest: "120s" },
        { name: "Leg Press", sets: 4, reps: 15, exerciseId: 345, rest: "90s" },
        { name: "Cadeira Extensora", sets: 3, reps: 15, exerciseId: 127, rest: "60s" },
        { name: "Afundo", sets: 3, reps: 12, exerciseId: 456, rest: "60s" }
      ]},
      { day: "Sexta", title: "Treino D - Ombros e Funcional", exercises: [
        { name: "Desenvolvimento", sets: 4, reps: 10, exerciseId: 91, rest: "90s" },
        { name: "Elevação Lateral", sets: 3, reps: 12, exerciseId: 95, rest: "60s" },
        { name: "Burpees", sets: 3, reps: 10, exerciseId: 234, rest: "60s" },
        { name: "Prancha", sets: 3, reps: 60, exerciseId: 235, rest: "45s" }
      ]}
    ],
    5: [
      { day: "Segunda", title: "Treino A - Peito", exercises: [
        { name: "Supino Reto", sets: 4, reps: 10, exerciseId: 88, rest: "90s" },
        { name: "Supino Inclinado", sets: 4, reps: 12, exerciseId: 89, rest: "90s" },
        { name: "Crossover", sets: 3, reps: 12, exerciseId: 90, rest: "60s" },
        { name: "Flexão", sets: 3, reps: 15, exerciseId: 236, rest: "60s" }
      ]},
      { day: "Terça", title: "Treino B - Costas", exercises: [
        { name: "Barra Fixa", sets: 4, reps: 8, exerciseId: 154, rest: "90s" },
        { name: "Remada Curvada", sets: 4, reps: 10, exerciseId: 84, rest: "90s" },
        { name: "Puxada Triangular", sets: 3, reps: 12, exerciseId: 513, rest: "60s" },
        { name: "Pullover", sets: 3, reps: 12, exerciseId: 185, rest: "60s" }
      ]},
      { day: "Quarta", title: "Treino C - Pernas", exercises: [
        { name: "Agachamento", sets: 5, reps: 10, exerciseId: 111, rest: "120s" },
        { name: "Leg Press", sets: 4, reps: 15, exerciseId: 345, rest: "90s" },
        { name: "Mesa Flexora", sets: 4, reps: 12, exerciseId: 456, rest: "60s" },
        { name: "Panturrilha", sets: 4, reps: 20, exerciseId: 576, rest: "45s" }
      ]},
      { day: "Quinta", title: "Treino D - Ombros e Braços", exercises: [
        { name: "Desenvolvimento", sets: 4, reps: 10, exerciseId: 91, rest: "90s" },
        { name: "Elevação Lateral", sets: 3, reps: 12, exerciseId: 95, rest: "60s" },
        { name: "Rosca Direta", sets: 4, reps: 12, exerciseId: 92, rest: "60s" },
        { name: "Tríceps Pulley", sets: 4, reps: 12, exerciseId: 94, rest: "60s" }
      ]},
      { day: "Sexta", title: "Treino E - Funcional e Abdômen", exercises: [
        { name: "Burpees", sets: 4, reps: 10, exerciseId: 234, rest: "90s" },
        { name: "Mountain Climbers", sets: 3, reps: 20, exerciseId: 237, rest: "60s" },
        { name: "Prancha", sets: 3, reps: 60, exerciseId: 235, rest: "45s" },
        { name: "Abdômen", sets: 4, reps: 20, exerciseId: 238, rest: "45s" }
      ]}
    ],
    6: [
      { day: "Segunda", title: "Treino A - Peito", exercises: [
        { name: "Supino Reto", sets: 4, reps: 10, exerciseId: 88, rest: "90s" },
        { name: "Supino Inclinado", sets: 4, reps: 12, exerciseId: 89, rest: "90s" },
        { name: "Crossover", sets: 3, reps: 12, exerciseId: 90, rest: "60s" }
      ]},
      { day: "Terça", title: "Treino B - Costas", exercises: [
        { name: "Barra Fixa", sets: 4, reps: 8, exerciseId: 154, rest: "90s" },
        { name: "Remada Curvada", sets: 4, reps: 10, exerciseId: 84, rest: "90s" },
        { name: "Puxada Triangular", sets: 3, reps: 12, exerciseId: 513, rest: "60s" }
      ]},
      { day: "Quarta", title: "Treino C - Quadríceps", exercises: [
        { name: "Agachamento", sets: 5, reps: 10, exerciseId: 111, rest: "120s" },
        { name: "Leg Press", sets: 4, reps: 15, exerciseId: 345, rest: "90s" },
        { name: "Cadeira Extensora", sets: 3, reps: 15, exerciseId: 127, rest: "60s" }
      ]},
      { day: "Quinta", title: "Treino D - Ombros e Braços", exercises: [
        { name: "Desenvolvimento", sets: 4, reps: 10, exerciseId: 91, rest: "90s" },
        { name: "Rosca Direta", sets: 4, reps: 12, exerciseId: 92, rest: "60s" },
        { name: "Tríceps Pulley", sets: 4, reps: 12, exerciseId: 94, rest: "60s" }
      ]},
      { day: "Sexta", title: "Treino E - Posteriores", exercises: [
        { name: "Mesa Flexora", sets: 4, reps: 12, exerciseId: 456, rest: "90s" },
        { name: "Stiff", sets: 4, reps: 10, exerciseId: 239, rest: "90s" },
        { name: "Panturrilha", sets: 4, reps: 20, exerciseId: 576, rest: "45s" }
      ]},
      { day: "Sábado", title: "Treino F - Funcional e Cardio", exercises: [
        { name: "Burpees", sets: 4, reps: 10, exerciseId: 234, rest: "90s" },
        { name: "Mountain Climbers", sets: 3, reps: 20, exerciseId: 237, rest: "60s" },
        { name: "Prancha", sets: 3, reps: 60, exerciseId: 235, rest: "45s" },
        { name: "Abdômen", sets: 4, reps: 20, exerciseId: 238, rest: "45s" }
      ]}
    ]
  };

  const generateWeeklyWorkouts = async (trainingDays: number) => {
    try {
      console.log('Iniciando geração de treinos para:', { userId: user.id, trainingDays });
      
      // Primeiro, verifica se já existem treinos para esta semana
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      console.log('Período da semana:', { 
        startOfWeek: startOfWeek.toISOString().split('T')[0], 
        endOfWeek: endOfWeek.toISOString().split('T')[0] 
      });

      const { data: existingWorkouts, error: queryError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('session_date', startOfWeek.toISOString().split('T')[0])
        .lte('session_date', endOfWeek.toISOString().split('T')[0]);

      if (queryError) {
        console.error('Erro ao consultar treinos existentes:', queryError);
      }

      console.log('Treinos existentes encontrados:', existingWorkouts?.length || 0);

      if (existingWorkouts && existingWorkouts.length > 0) {
        console.log('Usando treinos existentes');
        setWeeklyWorkouts(existingWorkouts as unknown as WorkoutSession[] || []);
        return existingWorkouts;
      }

      console.log('Criando novos treinos para', trainingDays, 'dias');
      const template = workoutTemplates[trainingDays as keyof typeof workoutTemplates] || workoutTemplates[3];

      const workoutData = template.map((workout, index) => ({
        user_id: user.id,
        workout_plan_id: "00000000-0000-0000-0000-000000000000", // Temporary UUID
        day_name: workout.day,
        session_date: new Date(startOfWeek.getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        exercises: workout.exercises as any,
        is_completed: false
      }));

      console.log('Dados dos treinos a serem inseridos:', workoutData);

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert(workoutData)
        .select();

      console.log('Resposta da inserção:', { data, error });

      if (error) {
        console.error('Erro ao inserir treinos:', error);
        throw error;
      }

      setWeeklyWorkouts(data as unknown as WorkoutSession[] || []);
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao gerar treinos",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const loadWeeklyWorkouts = async () => {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('session_date', startOfWeek.toISOString().split('T')[0])
        .lte('session_date', endOfWeek.toISOString().split('T')[0])
        .order('session_date');

      if (error) throw error;

      setWeeklyWorkouts(data as unknown as WorkoutSession[] || []);
      return data || [];
    } catch (error: any) {
      toast({
        title: "Erro ao carregar treinos",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const completeWorkout = async (workoutId: string) => {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({ 
          is_completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', workoutId);

      if (error) throw error;

      setWeeklyWorkouts(prev => prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, is_completed: true, completed_at: new Date().toISOString() }
          : workout
      ));

      toast({
        title: "Treino concluído!",
        description: "Parabéns! Seu treino foi registrado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao finalizar treino",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getLastCompletedWorkout = () => {
    return weeklyWorkouts
      .filter(w => w.is_completed)
      .sort((a, b) => new Date(b.completed_at || '').getTime() - new Date(a.completed_at || '').getTime())[0];
  };

  const getTodayWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    return weeklyWorkouts.find(w => w.session_date === today);
  };

  useEffect(() => {
    if (user?.id) {
      loadWeeklyWorkouts();
    }
  }, [user?.id]);

  return {
    weeklyWorkouts,
    loading,
    generateWeeklyWorkouts,
    loadWeeklyWorkouts,
    completeWorkout,
    getLastCompletedWorkout,
    getTodayWorkout
  };
};