import { useState, useEffect } from "react";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ExerciseCard from "@/components/ExerciseCard";
import { useWorkoutData, useWgerExercises } from "@/hooks/useWgerApi";
import { toast } from "sonner";

interface WorkoutProps {
  onBack: () => void;
  user?: any;
}

interface ExerciseProgress {
  exerciseId: number;
  weight: string;
  completed: boolean;
}

const Workout = ({ onBack, user }: WorkoutProps) => {
  const { getCurrentWorkout } = useWorkoutData(user);
  const { getExerciseImage } = useWgerExercises();
  const currentWorkout = getCurrentWorkout();
  
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>(
    currentWorkout.exercises.map(exercise => ({
      exerciseId: exercise.exerciseId,
      weight: "",
      completed: false
    }))
  );

  const completedCount = exerciseProgress.filter(p => p.completed).length;
  const progressPercentage = (completedCount / currentWorkout.exercises.length) * 100;

  const updateExerciseWeight = (exerciseId: number, weight: string) => {
    setExerciseProgress(prev => 
      prev.map(p => 
        p.exerciseId === exerciseId 
          ? { ...p, weight } 
          : p
      )
    );
  };

  const toggleExerciseCompletion = (exerciseId: number) => {
    setExerciseProgress(prev => 
      prev.map(p => 
        p.exerciseId === exerciseId 
          ? { ...p, completed: !p.completed } 
          : p
      )
    );
  };

  const saveWorkout = () => {
    const completedExercises = exerciseProgress.filter(p => p.completed).length;
    
    if (completedExercises === 0) {
      toast.error("Complete pelo menos um exercício antes de salvar!");
      return;
    }

    toast.success(`Treino salvo! ${completedExercises} exercícios concluídos.`);
    onBack();
  };

  useEffect(() => {
    if (completedCount === currentWorkout.exercises.length && completedCount > 0) {
      toast.success("🎉 Parabéns! Treino completo!");
    }
  }, [completedCount, currentWorkout.exercises.length]);

  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="px-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {currentWorkout.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {completedCount} de {currentWorkout.exercises.length} exercícios
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-muted"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">
              Progresso do treino
            </span>
            <span className="text-sm font-medium text-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4 mb-8">
          {currentWorkout.exercises.map((exercise, index) => {
            const progress = exerciseProgress.find(p => p.exerciseId === exercise.exerciseId);
            const exerciseImage = getExerciseImage(exercise.exerciseId);
            
            return (
              <ExerciseCard
                key={exercise.exerciseId}
                exercise={{
                  name: exercise.name,
                  sets: exercise.sets,
                  reps: exercise.reps,
                  image: exerciseImage,
                  description: `Série ${index + 1} do seu treino`
                }}
                isCompleted={progress?.completed || false}
                weight={progress?.weight || ""}
                onWeightChange={(weight) => updateExerciseWeight(exercise.exerciseId, weight)}
                onComplete={() => toggleExerciseCompletion(exercise.exerciseId)}
              />
            );
          })}
        </div>

        {/* Save Button */}
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
          <Button 
            onClick={saveWorkout}
            size="lg"
            className="w-full bg-gradient-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-glow"
          >
            {completedCount === currentWorkout.exercises.length ? (
              <>
                <CheckCircle2 className="mr-2" size={20} />
                Finalizar Treino
              </>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                Salvar Progresso
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Workout;