import { useState } from "react";
import { Calendar, User, Flame } from "lucide-react";
import WorkoutCard from "@/components/WorkoutCard";
import { useWorkoutData } from "@/hooks/useWgerApi";

interface HomeProps {
  onStartWorkout: () => void;
  userData?: any;
}

const Home = ({ onStartWorkout, userData }: HomeProps) => {
  const { getCurrentWorkout } = useWorkoutData(userData);
  const [userName] = useState(userData?.name || "João");
  
  const currentWorkout = getCurrentWorkout();
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
                <p className="text-2xl font-bold text-foreground">7</p>
                <p className="text-xs text-muted-foreground">Dias seguidos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Calendar className="text-accent-foreground" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">Treinos feitos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Treino de Hoje
          </h2>
          
          <WorkoutCard
            title={currentWorkout.title}
            exercises={currentWorkout.exercises.length}
            duration={currentWorkout.duration}
            difficulty={currentWorkout.difficulty}
            onStart={onStartWorkout}
            className="animate-pulse-glow"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Acesso Rápido
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-card border border-border p-4 rounded-xl text-left hover:bg-muted/50 transition-colors">
              <p className="font-medium text-foreground">Último Treino</p>
              <p className="text-sm text-muted-foreground">Ontem • Pernas</p>
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