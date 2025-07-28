import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: {
    name: string;
    sets: number;
    reps: number;
    image?: string;
    description?: string;
  };
  isCompleted: boolean;
  weight: string;
  onWeightChange: (weight: string) => void;
  onComplete: () => void;
}

const ExerciseCard = ({ 
  exercise, 
  isCompleted, 
  weight, 
  onWeightChange, 
  onComplete 
}: ExerciseCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={cn(
      "bg-card border border-border rounded-xl p-6 transition-all duration-300",
      "hover:shadow-card",
      isCompleted && "bg-success/10 border-success/20"
    )}>
      <div className="flex items-start gap-4">
        {/* Exercise Image/GIF */}
        <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden">
          {exercise.image && !imageError ? (
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-secondary flex items-center justify-center">
              <RotateCcw className="text-secondary-foreground" size={24} />
            </div>
          )}
        </div>

        {/* Exercise Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-2 leading-tight">
            {exercise.name}
          </h3>
          
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-muted-foreground">
              {exercise.sets}x{exercise.reps}
            </span>
            
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Carga (kg)"
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
                className="w-24 h-8 text-sm"
                disabled={isCompleted}
              />
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
          </div>

          {exercise.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {exercise.description}
            </p>
          )}

          <Button
            onClick={onComplete}
            variant={isCompleted ? "outline" : "default"}
            size="sm"
            className={cn(
              "w-full transition-all duration-200",
              isCompleted && "bg-success text-success-foreground hover:bg-success/90"
            )}
          >
            <Check 
              className={cn(
                "mr-2 transition-transform duration-200",
                isCompleted && "scale-110"
              )} 
              size={16} 
            />
            {isCompleted ? "Concluído" : "Marcar como concluído"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;