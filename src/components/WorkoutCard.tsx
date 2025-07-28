import { Play, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  title: string;
  exercises: number;
  duration: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  onStart: () => void;
  className?: string;
}

const WorkoutCard = ({ 
  title, 
  exercises, 
  duration, 
  difficulty, 
  onStart, 
  className 
}: WorkoutCardProps) => {
  const difficultyColors = {
    "Iniciante": "text-success",
    "Intermediário": "text-warning", 
    "Avançado": "text-destructive"
  };

  return (
    <div className={cn(
      "bg-gradient-primary p-6 rounded-xl shadow-card text-primary-foreground",
      "transform transition-all duration-300 hover:scale-[1.02]",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <span className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            "bg-black/20 backdrop-blur-sm",
            difficultyColors[difficulty]
          )}>
            {difficulty}
          </span>
        </div>
        <div className="text-right text-sm opacity-90">
          <div className="flex items-center gap-1 mb-1">
            <Target size={14} />
            <span>{exercises} exercícios</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{duration}</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onStart}
        variant="secondary"
        size="lg"
        className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0 text-white font-semibold shadow-none"
      >
        <Play className="mr-2" size={18} />
        Iniciar Treino
      </Button>
    </div>
  );
};

export default WorkoutCard;