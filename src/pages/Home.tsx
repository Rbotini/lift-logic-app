import { useState } from "react";
import { Calendar, User, Flame, CheckCircle2 } from "lucide-react";
import WorkoutCard from "@/components/WorkoutCard";
import { useWorkoutManager } from "@/hooks/useWorkoutManager";

interface HomeProps {
  onStartWorkout: (workout?: any) => void;
  user?: any;
}

const Home = ({ onStartWorkout, user }: HomeProps) => {
  const { weeklyWorkouts, loading, getTodayWorkout, getLastCompletedWorkout } = useWorkoutManager(user);
  const [userName] = useState(user?.user_metadata?.full_name || user?.email || "Usuário");
  
  const todayWorkout = getTodayWorkout();
  const lastCompletedWorkout = getLastCompletedWorkout();
  const completedCount = weeklyWorkouts.filter(w => w.is_completed).length;
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-gradient-hero pt-6 pb-20">
      <div className="px-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Olá, {userName}! 👋
            </h1>
            <p className="text-muted-foreground capitalize">
              {today}
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="text-primary-foreground" size={24} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card p-4 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Flame className="text-secondary-foreground" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Treinos concluídos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Calendar className="text-accent-foreground" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{weeklyWorkouts.length}</p>
                <p className="text-xs text-muted-foreground">Treinos da semana</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Treinos da Semana
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Carregando treinos...</p>
            </div>
          ) : weeklyWorkouts.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-foreground mb-2">Nenhum treino encontrado</p>
              <p className="text-sm text-muted-foreground">Complete seu perfil para gerar treinos personalizados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weeklyWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.is_completed ? `✅ ${workout.day_name} - Concluído` : `${workout.day_name} - ${workout.exercises.length} exercícios`}
                  exercises={workout.exercises.length}
                  duration="45-60 min"
                  difficulty="Intermediário"
                  onStart={() => onStartWorkout(workout)}
                  className={workout.is_completed ? "opacity-75" : todayWorkout?.id === workout.id ? "animate-pulse-glow" : ""}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Acesso Rápido
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-card border border-border p-4 rounded-xl text-left hover:bg-muted/50 transition-colors">
              <p className="font-medium text-foreground">Último Treino</p>
              <p className="text-sm text-muted-foreground">
                {lastCompletedWorkout 
                  ? `${lastCompletedWorkout.day_name} • ${new Date(lastCompletedWorkout.completed_at || '').toLocaleDateString('pt-BR')}`
                  : 'Nenhum treino concluído'
                }
              </p>
            </button>
            
            <button className="bg-card border border-border p-4 rounded-xl text-left hover:bg-muted/50 transition-colors">
              <p className="font-medium text-foreground">Meu Peso</p>
              <p className="text-sm text-muted-foreground">75.2 kg</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;