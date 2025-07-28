import { useState, useMemo } from "react";
import { Search, Filter, RotateCcw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWgerExercises } from "@/hooks/useWgerApi";
import { toast } from "sonner";

const Exercises = () => {
  const { exercises, categories, loading, error, getExerciseImage, getCategoryName } = useWgerExercises();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(exercise => 
        exercise.category === parseInt(selectedCategory)
      );
    }

    return filtered;
  }, [exercises, searchQuery, selectedCategory]);

  const handleImageError = (exerciseId: number) => {
    setImageErrors(prev => new Set(prev).add(exerciseId));
  };

  const addToWorkout = (exerciseName: string) => {
    toast.success(`${exerciseName} adicionado ao seu treino!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-6 pb-20">
        <div className="px-4 max-w-md mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Carregando exercícios...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-6 pb-20">
        <div className="px-4 max-w-md mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6 pb-20">
      <div className="px-4 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Catálogo de Exercícios
          </h1>
          <p className="text-muted-foreground">
            Explore {exercises.length} exercícios disponíveis
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar exercício..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter size={18} className="mr-2" />
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredExercises.length} exercício(s) encontrado(s)
          </p>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          {filteredExercises.map(exercise => {
            const exerciseImage = getExerciseImage(exercise.id);
            const hasImageError = imageErrors.has(exercise.id);
            
            return (
              <div 
                key={exercise.id}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-card transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Exercise Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg overflow-hidden">
                    {exerciseImage && !hasImageError ? (
                      <img
                        src={exerciseImage}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(exercise.id)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-secondary flex items-center justify-center">
                        <RotateCcw className="text-secondary-foreground" size={20} />
                      </div>
                    )}
                  </div>

                  {/* Exercise Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 leading-tight">
                      {exercise.name}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {getCategoryName(exercise.category)}
                    </p>

                    {exercise.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {exercise.description.replace(/<[^>]*>/g, '')}
                      </p>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToWorkout(exercise.name)}
                      className="w-full"
                    >
                      Adicionar ao Treino
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum exercício encontrado com esses filtros
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;