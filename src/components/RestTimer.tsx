import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface RestTimerProps {
  restTime: string; // e.g., "60s", "90s"
  onTimerComplete?: () => void;
  isActive?: boolean;
}

const RestTimer = ({ restTime, onTimerComplete, isActive = false }: RestTimerProps) => {
  const parseRestTime = (time: string): number => {
    const match = time.match(/(\d+)s/);
    return match ? parseInt(match[1]) : 60;
  };

  const initialTime = parseRestTime(restTime);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isActive) {
      setTimeLeft(initialTime);
      setIsRunning(true);
    }
  }, [isActive, initialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play sound notification
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => {
              // Fallback if audio file not found
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance('Descanso finalizado!');
                utterance.lang = 'pt-BR';
                speechSynthesis.speak(utterance);
              }
            });
            onTimerComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimerComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  if (!isActive && !isRunning && timeLeft === initialTime) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 my-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tempo de Descanso
        </h3>
        
        <div className="text-3xl font-bold text-primary mb-4">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="sm"
              className="bg-gradient-secondary hover:bg-secondary/90"
            >
              <Play className="w-4 h-4 mr-1" />
              Iniciar
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size="sm"
              variant="outline"
            >
              <Pause className="w-4 h-4 mr-1" />
              Pausar
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Resetar
          </Button>
        </div>
        
        {timeLeft === 0 && (
          <div className="mt-2 text-green-600 font-medium">
            ✅ Descanso concluído!
          </div>
        )}
      </div>
    </div>
  );
};

export default RestTimer;