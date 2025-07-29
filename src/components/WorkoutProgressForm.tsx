import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkoutProgressFormProps {
  exerciseName: string;
  onSave: () => void;
  userId: string;
  workoutSessionId: string;
}

export const WorkoutProgressForm = ({ exerciseName, onSave, userId, workoutSessionId }: WorkoutProgressFormProps) => {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [bodyWeight, setBodyWeight] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('workout_progress')
        .insert({
          user_id: userId,
          workout_session_id: workoutSessionId,
          exercise_name: exerciseName,
          weight_used: weight ? parseFloat(weight) : null,
          reps_completed: reps ? parseInt(reps) : null,
          difficulty_rating: difficulty,
          body_weight: bodyWeight ? parseFloat(bodyWeight) : null
        });

      if (error) throw error;

      toast({
        title: "Progresso salvo!",
        description: "Seus dados foram registrados com sucesso.",
      });

      onSave();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Progresso - {exerciseName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Carga (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="reps">Repetições</Label>
            <Input
              id="reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="difficulty">Dificuldade (1-5)</Label>
          <Input
            id="difficulty"
            type="number"
            min="1"
            max="5"
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="bodyWeight">Peso Corporal (opcional)</Label>
          <Input
            id="bodyWeight"
            type="number"
            value={bodyWeight}
            onChange={(e) => setBodyWeight(e.target.value)}
            placeholder="70.5"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Salvar Progresso
        </Button>
      </CardContent>
    </Card>
  );
};