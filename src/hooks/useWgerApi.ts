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

interface UserProfile {
  name: string;
  age: string;
  height: string;
  weight: string;
  goal: string;
  level: string;
  muscleGroups: string[];
}

export const useWorkoutData = (userProfile?: UserProfile) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  
  // Workout templates by level and focus
  const workoutTemplates = {
    beginner: {
      exerciseCount: 4,
      duration: "30-40 min",
      workouts: [
        {
          title: "Treino A - Superior",
          exercises: [
            { name: "Supino com Halteres", sets: 2, reps: 12, exerciseId: 75, rest: "60s" },
            { name: "Remada com Halteres", sets: 2, reps: 12, exerciseId: 84, rest: "60s" },
            { name: "Desenvolvimento com Halteres", sets: 2, reps: 10, exerciseId: 76, rest: "60s" },
            { name: "Rosca Direta", sets: 2, reps: 12, exerciseId: 92, rest: "45s" }
          ]
        },
        {
          title: "Treino B - Inferior + Core",
          exercises: [
            { name: "Agachamento Livre", sets: 2, reps: 15, exerciseId: 111, rest: "90s" },
            { name: "Leg Press", sets: 2, reps: 12, exerciseId: 345, rest: "60s" },
            { name: "Panturrilha em Pé", sets: 2, reps: 15, exerciseId: 576, rest: "45s" },
            { name: "Abdominal Crunch", sets: 2, reps: 15, exerciseId: 167, rest: "30s" }
          ]
        }
      ]
    },
    intermediate: {
      exerciseCount: 5,
      duration: "45-60 min",
      workouts: [
        {
          title: "Treino A - Peito e Tríceps",
          exercises: [
            { name: "Supino Reto", sets: 3, reps: 12, exerciseId: 73, rest: "60s" },
            { name: "Supino Inclinado", sets: 3, reps: 10, exerciseId: 537, rest: "60s" },
            { name: "Crucifixo", sets: 3, reps: 12, exerciseId: 135, rest: "45s" },
            { name: "Tríceps Pulley", sets: 3, reps: 12, exerciseId: 539, rest: "45s" },
            { name: "Tríceps Francês", sets: 3, reps: 10, exerciseId: 246, rest: "45s" }
          ]
        },
        {
          title: "Treino B - Costas e Bíceps",
          exercises: [
            { name: "Puxada Frontal", sets: 3, reps: 12, exerciseId: 154, rest: "60s" },
            { name: "Remada Baixa", sets: 3, reps: 10, exerciseId: 84, rest: "60s" },
            { name: "Pullover", sets: 3, reps: 12, exerciseId: 185, rest: "45s" },
            { name: "Rosca Direta", sets: 3, reps: 12, exerciseId: 92, rest: "45s" },
            { name: "Rosca Martelo", sets: 3, reps: 10, exerciseId: 272, rest: "45s" }
          ]
        },
        {
          title: "Treino C - Pernas e Glúteos",
          exercises: [
            { name: "Agachamento", sets: 4, reps: 12, exerciseId: 111, rest: "90s" },
            { name: "Leg Press", sets: 3, reps: 15, exerciseId: 345, rest: "60s" },
            { name: "Cadeira Extensora", sets: 3, reps: 12, exerciseId: 127, rest: "45s" },
            { name: "Mesa Flexora", sets: 3, reps: 12, exerciseId: 132, rest: "45s" },
            { name: "Panturrilha", sets: 3, reps: 15, exerciseId: 576, rest: "45s" }
          ]
        },
        {
          title: "Treino D - Ombros e Core",
          exercises: [
            { name: "Desenvolvimento", sets: 3, reps: 10, exerciseId: 76, rest: "60s" },
            { name: "Elevação Lateral", sets: 3, reps: 12, exerciseId: 128, rest: "45s" },
            { name: "Elevação Frontal", sets: 3, reps: 12, exerciseId: 129, rest: "45s" },
            { name: "Encolhimento", sets: 3, reps: 12, exerciseId: 571, rest: "45s" },
            { name: "Prancha", sets: 3, reps: 30, exerciseId: 167, rest: "60s" }
          ]
        }
      ]
    },
    advanced: {
      exerciseCount: 7,
      duration: "60-75 min",
      workouts: [
        {
          title: "Treino A - Peito e Tríceps (Hipertrofia)",
          exercises: [
            { name: "Supino Reto", sets: 4, reps: 8, exerciseId: 73, rest: "90s" },
            { name: "Supino Inclinado", sets: 4, reps: 10, exerciseId: 537, rest: "90s" },
            { name: "Supino Declinado", sets: 3, reps: 12, exerciseId: 427, rest: "60s" },
            { name: "Crucifixo", sets: 3, reps: 12, exerciseId: 135, rest: "60s" },
            { name: "Paralelas", sets: 3, reps: 10, exerciseId: 197, rest: "60s" },
            { name: "Tríceps Testa", sets: 4, reps: 10, exerciseId: 246, rest: "60s" },
            { name: "Tríceps Corda", sets: 3, reps: 12, exerciseId: 275, rest: "45s" }
          ]
        },
        {
          title: "Treino B - Costas e Bíceps (Volume)",
          exercises: [
            { name: "Barra Fixa", sets: 4, reps: 8, exerciseId: 154, rest: "90s" },
            { name: "Remada Curvada", sets: 4, reps: 8, exerciseId: 84, rest: "90s" },
            { name: "Puxada Triangular", sets: 3, reps: 10, exerciseId: 513, rest: "60s" },
            { name: "Remada Unilateral", sets: 3, reps: 12, exerciseId: 525, rest: "60s" },
            { name: "Pullover", sets: 3, reps: 12, exerciseId: 185, rest: "60s" },
            { name: "Rosca Direta", sets: 4, reps: 10, exerciseId: 92, rest: "60s" },
            { name: "Rosca Martelo", sets: 3, reps: 12, exerciseId: 272, rest: "45s" }
          ]
        },
        {
          title: "Treino C - Quadríceps e Glúteos",
          exercises: [
            { name: "Agachamento Livre", sets: 5, reps: 8, exerciseId: 111, rest: "120s" },
            { name: "Leg Press 45°", sets: 4, reps: 12, exerciseId: 345, rest: "90s" },
            { name: "Cadeira Extensora", sets: 4, reps: 15, exerciseId: 127, rest: "60s" },
            { name: "Hack Squat", sets: 3, reps: 12, exerciseId: 123, rest: "90s" },
            { name: "Afundo", sets: 3, reps: 10, exerciseId: 456, rest: "60s" },
            { name: "Cadeira Adutora", sets: 3, reps: 15, exerciseId: 789, rest: "45s" },
            { name: "Panturrilha em Pé", sets: 4, reps: 20, exerciseId: 576, rest: "45s" }
          ]
        }
      ]
    }
  };

  // Generate workouts based on user profile
  const generateWorkouts = () => {
    if (!userProfile) {
      // Default intermediate workouts
      return workoutTemplates.intermediate.workouts;
    }

    const level = userProfile.level as keyof typeof workoutTemplates;
    const template = workoutTemplates[level] || workoutTemplates.intermediate;
    
    // Adjust workouts based on goals and preferences
    let workouts = [...template.workouts];
    
    // Adjust for weight loss goal
    if (userProfile.goal === "weight-loss") {
      workouts = workouts.map(workout => ({
        ...workout,
        exercises: workout.exercises.map(ex => ({
          ...ex,
          sets: Math.max(ex.sets - 1, 2),
          reps: ex.reps + 3,
          rest: ex.rest.replace(/\d+/, (match) => String(Math.max(parseInt(match) - 15, 30)))
        }))
      }));
    }
    
    // Adjust for muscle mass goal
    if (userProfile.goal === "mass") {
      workouts = workouts.map(workout => ({
        ...workout,
        exercises: workout.exercises.map(ex => ({
          ...ex,
          sets: ex.sets + 1,
          reps: Math.max(ex.reps - 2, 6)
        }))
      }));
    }

    return workouts;
  };

  const workouts = generateWorkouts();
  const getDifficulty = (): "Iniciante" | "Intermediário" | "Avançado" => {
    if (!userProfile) return "Intermediário";
    
    switch (userProfile.level) {
      case "beginner": return "Iniciante";
      case "advanced": return "Avançado";
      default: return "Intermediário";
    }
  };

  const getCurrentWorkout = () => ({
    ...workouts[currentWorkoutIndex],
    difficulty: getDifficulty(),
    duration: userProfile ? 
      workoutTemplates[userProfile.level as keyof typeof workoutTemplates]?.duration || "45-60 min" 
      : "45-60 min"
  });
  
  const getNextWorkout = () => {
    const nextIndex = (currentWorkoutIndex + 1) % workouts.length;
    setCurrentWorkoutIndex(nextIndex);
    return {
      ...workouts[nextIndex],
      difficulty: getDifficulty(),
      duration: userProfile ? 
        workoutTemplates[userProfile.level as keyof typeof workoutTemplates]?.duration || "45-60 min" 
        : "45-60 min"
    };
  };

  return {
    workouts: workouts.map(w => ({
      ...w,
      difficulty: getDifficulty(),
      duration: userProfile ? 
        workoutTemplates[userProfile.level as keyof typeof workoutTemplates]?.duration || "45-60 min" 
        : "45-60 min"
    })),
    getCurrentWorkout,
    getNextWorkout,
    currentWorkoutIndex
  };
};