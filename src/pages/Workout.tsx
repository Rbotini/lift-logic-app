import { useState, useEffect } from "react";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ExerciseCard from "@/components/ExerciseCard";
import RestTimer from "@/components/RestTimer";
import { useWgerExercises } from "@/hooks/useWgerApi";
import { useWorkoutManager } from "@/hooks/useWorkoutManager";
import { toast } from "sonner";

interface WorkoutProps {
  onBack: () => void;
  user?: any;
  selectedWorkout?: any;
}

interface ExerciseProgress {
  exerciseId: number;
  weight: string;
  completed: boolean;
  currentSet: number;
}

const Workout = ({ onBack, user, selectedWorkout }: WorkoutProps) => {
  const { completeWorkout } = useWorkoutManager(user);
  const { getExerciseImage } = useWgerExercises();
  const currentWorkout = selectedWorkout;
  
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>(
    currentWorkout?.exercises?.map((exercise: any) => ({
      exerciseId: exercise.exerciseId,
      weight: "",
      completed: false,
      currentSet: 1
    })) || []
  );
  const [showRestTimer, setShowRestTimer] = useState<string | null>(null);

  const completedCount = exerciseProgress.filter(p => p.completed).length;
  const progressPercentage = currentWorkout?.exercises?.length 
    ? (completedCount / currentWorkout.exercises.length) * 100 
    : 0;

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
    const exercise = currentWorkout?.exercises?.find((ex: any) => ex.exerciseId === exerciseId);
    
    setExerciseProgress(prev => 
      prev.map(p => {
        if (p.exerciseId === exerciseId) {
          const newCurrentSet = p.currentSet + 1;
          const isCompleted = newCurrentSet > (exercise?.sets || 1);
          
          if (!isCompleted && exercise?.rest) {
            setShowRestTimer(exercise.rest);
          }
          
          return { 
            ...p, 
            completed: isCompleted,
            currentSet: isCompleted ? exercise?.sets || 1 : newCurrentSet
          };
        }
        return p;
      })
    );
  };

  const saveWorkout = async () => {
    const completedExercises = exerciseProgress.filter(p => p.completed).length;
    
    if (completedExercises === 0) {
      toast.error("Complete pelo menos um exercício antes de salvar!");
      return;
    }

    if (currentWorkout?.id) {
      await completeWorkout(currentWorkout.id);
    }
    
    toast.success(`Treino salvo! ${completedExercises} exercícios concluídos.`);
    onBack();
  };

  useEffect(() => {
    if (currentWorkout?.exercises?.length && completedCount === currentWorkout.exercises.length && completedCount > 0) {
      toast.success("🎉 Parabéns! Treino completo!");
    }
  }, [completedCount, currentWorkout?.exercises?.length]);

  if (!currentWorkout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Treino não encontrado</h2>
          <Button onClick={onBack}>Voltar</Button>
        </div>
      </div>
    );
  }

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
              {currentWorkout.day_name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {completedCount} de {currentWorkout.exercises?.length || 0} exercícios
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

        {/* Rest Timer */}
        {showRestTimer && (
          <RestTimer 
            restTime={showRestTimer}
            isActive={true}
            onTimerComplete={() => setShowRestTimer(null)}
          />
        )}

        {/* Exercises List */}
        <div className="space-y-4 mb-8">
          {currentWorkout.exercises?.map((exercise: any, index: number) => {
            const progress = exerciseProgress.find(p => p.exerciseId === exercise.exerciseId);
            const exerciseImage = getExerciseImage(exercise.exerciseId);
            
            return (
              <div key={exercise.exerciseId} className="space-y-2">
                <ExerciseCard
                  exercise={{
                    name: exercise.name,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    image: exerciseImage,
                    description: `Série ${progress?.currentSet || 1} de ${exercise.sets} • ${exercise.reps} repetições`
                  }}
                  isCompleted={progress?.completed || false}
                  weight={progress?.weight || ""}
                  onWeightChange={(weight) => updateExerciseWeight(exercise.exerciseId, weight)}
                  onComplete={() => toggleExerciseCompletion(exercise.exerciseId)}
                />
                
                {progress && !progress.completed && (
                  <div className="text-center text-sm text-muted-foreground">
                    Descanso: {exercise.rest} entre séries
                  </div>
                )}
              </div>
            );
          }) || []}
        </div>

        {/* Save Button */}
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
          <Button 
            onClick={saveWorkout}
            size="lg"
            className="w-full bg-gradient-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-glow"
          >
            {completedCount === (currentWorkout.exercises?.length || 0) ? (
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