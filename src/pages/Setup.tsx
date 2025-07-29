import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Target, Trophy, Heart, ArrowRight, Calendar, Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SetupFormData {
  name: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  level: string;
  training_days: number;
  muscleGroups: string[];
}

interface SetupProps {
  onComplete: () => void;
  userId: string;
}

const Setup = ({ onComplete, userId }: SetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, setValue, watch } = useForm<SetupFormData>({
    defaultValues: {
      muscleGroups: []
    }
  });
  const { toast } = useToast();

  const watchedValues = watch();
  const totalSteps = 6;

  const goals = [
    { id: "hipertrofia", label: "Hipertrofia", icon: "💪", description: "Foco no crescimento muscular" },
    { id: "emagrecimento", label: "Emagrecimento", icon: "🔥", description: "Queima de gordura e definição" },
    { id: "condicionamento", label: "Condicionamento", icon: "⚡", description: "Resistência e saúde geral" }
  ];

  const levels = [
    { id: "iniciante", label: "Iniciante", description: "Ideal para quem está começando ou retornando após pausa" },
    { id: "intermediario", label: "Intermediário", description: "Para quem já treina há algum tempo" },
    { id: "avancado", label: "Avançado", description: "Foco total em performance e resultados" }
  ];

  const muscleGroups = [
    { id: "pernas", label: "Pernas", icon: "🦵" },
    { id: "abdomen", label: "Abdômen", icon: "🎯" },
    { id: "bracos", label: "Braços", icon: "💪" },
    { id: "costas", label: "Costas", icon: "🏋️" },
    { id: "funcional", label: "Funcional", icon: "⚡" }
  ];

  const handleMuscleGroupChange = (groupId: string, checked: boolean) => {
    const currentGroups = watchedValues.muscleGroups || [];
    if (checked) {
      setValue("muscleGroups", [...currentGroups, groupId]);
    } else {
      setValue("muscleGroups", currentGroups.filter(id => id !== groupId));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return watchedValues.name && watchedValues.age && watchedValues.height && watchedValues.weight;
      case 2:
        return watchedValues.goal;
      case 3:
        return watchedValues.level;
      case 4:
        return watchedValues.training_days && watchedValues.training_days >= 2 && watchedValues.training_days <= 6;
      case 5:
        return watchedValues.muscleGroups && watchedValues.muscleGroups.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: SetupFormData) => {
    try {
      // Update profile with name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: data.name })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Insert user preferences
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          fitness_level: data.level,
          goal: data.goal,
          training_days: data.training_days,
          preferred_muscle_groups: data.muscleGroups
        });

      if (preferencesError) throw preferencesError;

      toast({
        title: "Configuração concluída!",
        description: "Seu plano de treino será gerado em breve",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar preferências",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Passo {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Dados do usuário */}
            {currentStep === 1 && (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Vamos nos conhecer!</CardTitle>
                  <CardDescription>
                    Conte-nos um pouco sobre você para personalizar seu treino
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome"
                      {...register("name", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="30"
                        {...register("age", { required: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Altura (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="175"
                        {...register("height", { required: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        {...register("weight", { required: true })}
                      />
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Objetivo do treino */}
            {currentStep === 2 && (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Qual seu objetivo?</CardTitle>
                  <CardDescription>
                    Isso nos ajuda a personalizar seus treinos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={watchedValues.goal}
                    onValueChange={(value) => setValue("goal", value)}
                    className="space-y-3"
                  >
                    {goals.map((goal) => (
                      <div key={goal.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value={goal.id} id={goal.id} />
                        <Label htmlFor={goal.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{goal.icon}</span>
                            <div>
                              <div className="font-medium">{goal.label}</div>
                              <div className="text-sm text-muted-foreground">{goal.description}</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </>
            )}

            {/* Step 3: Nível de treino */}
            {currentStep === 3 && (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Qual seu nível?</CardTitle>
                  <CardDescription>
                    Vamos ajustar a intensidade do seu treino
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={watchedValues.level}
                    onValueChange={(value) => setValue("level", value)}
                    className="space-y-3"
                  >
                    {levels.map((level) => (
                      <div key={level.id} className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value={level.id} id={level.id} />
                        <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                          <div className="font-medium mb-1">{level.label}</div>
                          <div className="text-sm text-muted-foreground">{level.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </>
            )}

            {/* Step 4: Frequência */}
            {currentStep === 4 && (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Frequência</CardTitle>
                  <CardDescription>
                    Quantos dias por semana você pode treinar?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="training_days" className="text-base">
                      Escolha entre 2 e 6 dias por semana
                    </Label>
                    <Input
                      id="training_days"
                      type="number"
                      min="2"
                      max="6"
                      placeholder="Entre 2 e 6 dias"
                      {...register("training_days", { 
                        required: true, 
                        min: 2, 
                        max: 6,
                        valueAsNumber: true
                      })}
                    />
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 5: Preferências de grupos musculares */}
            {currentStep === 5 && (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <Dumbbell className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Preferências</CardTitle>
                  <CardDescription>
                    Quais grupos musculares você prefere trabalhar?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {muscleGroups.map((group) => (
                      <div key={group.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors">
                        <Checkbox
                          id={group.id}
                          checked={watchedValues.muscleGroups?.includes(group.id) || false}
                          onCheckedChange={(checked) => handleMuscleGroupChange(group.id, checked as boolean)}
                        />
                        <Label htmlFor={group.id} className="flex items-center gap-2 cursor-pointer">
                          <span className="text-lg">{group.icon}</span>
                          <span className="text-sm font-medium">{group.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 6: Confirmação */}
            {currentStep === 6 && (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Tudo pronto!</CardTitle>
                  <CardDescription>
                    Sua jornada fitness está prestes a começar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Seu perfil:</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p><strong>Nome:</strong> {watchedValues.name}</p>
                      <p><strong>Objetivo:</strong> {goals.find(g => g.id === watchedValues.goal)?.label}</p>
                      <p><strong>Nível:</strong> {levels.find(l => l.id === watchedValues.level)?.label}</p>
                      <p><strong>Frequência:</strong> {watchedValues.training_days} dias por semana</p>
                      <p><strong>Grupos favoritos:</strong> {watchedValues.muscleGroups?.length} selecionados</p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between p-6 pt-0">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="ml-auto"
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!canProceed()}
                  className="ml-auto bg-gradient-to-r from-primary to-secondary"
                >
                  Começar minha jornada
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Setup;