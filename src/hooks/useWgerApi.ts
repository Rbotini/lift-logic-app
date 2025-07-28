import { useState, useEffect } from "react";

export interface WgerExercise {
  id: number;
  name: string;
  description: string;
  category: number;
  muscles: number[];
  muscles_secondary: number[];
}

export interface WgerExerciseImage {
  id: number;
  exercise: number;
  image: string;
  is_main: boolean;
}

export interface WgerCategory {
  id: number;
  name: string;
}

const WGER_API_BASE = "https://wger.de/api/v2";

export const useWgerExercises = () => {
  const [exercises, setExercises] = useState<WgerExercise[]>([]);
  const [images, setImages] = useState<WgerExerciseImage[]>([]);
  const [categories, setCategories] = useState<WgerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch exercises (Portuguese language = 2)
        const exercisesResponse = await fetch(
          `${WGER_API_BASE}/exercise/?language=2&limit=200`
        );
        const exercisesData = await exercisesResponse.json();
        
        // Fetch exercise images
        const imagesResponse = await fetch(
          `${WGER_API_BASE}/exerciseimage/?limit=1000`
        );
        const imagesData = await imagesResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch(
          `${WGER_API_BASE}/exercisecategory/`
        );
        const categoriesData = await categoriesResponse.json();
        
        setExercises(exercisesData.results || []);
        setImages(imagesData.results || []);
        setCategories(categoriesData.results || []);
        
      } catch (err) {
        setError('Erro ao carregar exercícios');
        console.error('Error fetching WGER data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getExerciseImage = (exerciseId: number): string | undefined => {
    const image = images.find(img => img.exercise === exerciseId && img.is_main);
    return image?.image || images.find(img => img.exercise === exerciseId)?.image;
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Geral";
  };

  const getExercisesByCategory = (categoryId?: number) => {
    if (!categoryId) return exercises;
    return exercises.filter(exercise => exercise.category === categoryId);
  };

  return {
    exercises,
    images,
    categories,
    loading,
    error,
    getExerciseImage,
    getCategoryName,
    getExercisesByCategory
  };
};

export const useWorkoutData = () => {
  // Mock workout data for now - can be replaced with real API/database
  const [workouts] = useState([
    {
      id: 1,
      title: "Treino de Peito e Tríceps",
      exercises: [
        { name: "Supino Reto", sets: 3, reps: 12, exerciseId: 88 },
        { name: "Supino Inclinado", sets: 3, reps: 10, exerciseId: 89 },
        { name: "Crucifixo", sets: 3, reps: 15, exerciseId: 90 },
        { name: "Tríceps Pulley", sets: 3, reps: 12, exerciseId: 91 },
        { name: "Tríceps Francês", sets: 3, reps: 10, exerciseId: 92 },
      ],
      difficulty: "Intermediário" as const,
      duration: "45-60 min"
    },
    {
      id: 2,
      title: "Treino de Costas e Bíceps", 
      exercises: [
        { name: "Puxada Frontal", sets: 3, reps: 12, exerciseId: 93 },
        { name: "Remada Baixa", sets: 3, reps: 10, exerciseId: 94 },
        { name: "Pullover", sets: 3, reps: 15, exerciseId: 95 },
        { name: "Rosca Direta", sets: 3, reps: 12, exerciseId: 96 },
        { name: "Rosca Martelo", sets: 3, reps: 10, exerciseId: 97 },
      ],
      difficulty: "Intermediário" as const,
      duration: "45-60 min"
    }
  ]);

  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  
  const getCurrentWorkout = () => workouts[currentWorkoutIndex];
  
  const getNextWorkout = () => {
    const nextIndex = (currentWorkoutIndex + 1) % workouts.length;
    setCurrentWorkoutIndex(nextIndex);
    return workouts[nextIndex];
  };

  return {
    workouts,
    getCurrentWorkout,
    getNextWorkout,
    currentWorkoutIndex
  };
};