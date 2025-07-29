import { useState } from "react";
import { TrendingUp, Calendar, Weight, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressProps {
  user?: any;
}

const Progress = ({ user }: ProgressProps) => {
  const [currentWeight, setCurrentWeight] = useState("75.2");
  const [weightHistory] = useState([
    { date: "01/01", weight: 76.5 },
    { date: "08/01", weight: 76.0 },
    { date: "15/01", weight: 75.8 },
    { date: "22/01", weight: 75.2 },
  ]);

  const [workoutHistory] = useState([
    { date: "22/01/2024", workout: "Peito e Tríceps", exercises: 5, duration: "52 min" },
    { date: "21/01/2024", workout: "Costas e Bíceps", exercises: 5, duration: "48 min" },
    { date: "20/01/2024", workout: "Pernas", exercises: 6, duration: "65 min" },
    { date: "19/01/2024", workout: "Ombros", exercises: 4, duration: "42 min" },
  ]);

  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="px-4 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Seu Progresso
          </h1>
          <p className="text-muted-foreground">
            Acompanhe sua evolução no treino
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">24</p>
                  <p className="text-xs text-muted-foreground">Treinos completos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Calendar className="text-secondary-foreground" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">7</p>
                  <p className="text-xs text-muted-foreground">Dias seguidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weight Tracking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight size={20} />
              Peso Corporal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="flex-1"
                placeholder="Peso atual (kg)"
              />
              <Button size="sm" variant="outline">
                Salvar
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground">Histórico</h4>
              {weightHistory.map((entry, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                  <span className="font-medium text-foreground">{entry.weight} kg</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workout History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Histórico de Treinos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workoutHistory.map((workout, index) => (
                <div 
                  key={index} 
                  className="bg-muted/50 p-3 rounded-lg border border-border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-foreground">{workout.workout}</h4>
                    <span className="text-xs text-muted-foreground">{workout.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{workout.exercises} exercícios</span>
                    <span>{workout.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler size={20} />
              Medidas Corporais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Braço</label>
                <Input className="mt-1" placeholder="cm" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Peito</label>
                <Input className="mt-1" placeholder="cm" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Cintura</label>
                <Input className="mt-1" placeholder="cm" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Coxa</label>
                <Input className="mt-1" placeholder="cm" />
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Salvar Medidas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;