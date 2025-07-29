import { useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/navigation";
import Home from "@/pages/Home";
import Workout from "@/pages/Workout";
import Progress from "@/pages/Progress";
import Exercises from "@/pages/Exercises";
import Setup from "@/pages/Setup";
import Auth from "@/pages/Auth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has completed setup
          setTimeout(async () => {
            try {
              const { data: preferences } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              setIsSetupComplete(!!preferences);
            } catch (error) {
              setIsSetupComplete(false);
            }
          }, 0);
        } else {
          setIsSetupComplete(false);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    toast({
      title: "Bem-vindo!",
      description: "Sua configuração foi salva com sucesso. Vamos começar!",
    });
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsSetupComplete(false);
      setActiveTab("home");
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-4 mx-auto"></div>
            <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user || !session) {
    return <Auth onSuccess={() => {}} />;
  }

  // Show setup if not completed
  if (!isSetupComplete) {
    return <Setup onComplete={handleSetupComplete} userId={user.id} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <Home onStartWorkout={() => setActiveTab("workout")} user={user} />;
      case "workout":
        return <Workout onBack={() => setActiveTab("home")} user={user} />;
      case "progress":
        return <Progress user={user} />;
      case "exercises":
        return <Exercises />;
      default:
        return <Home onStartWorkout={() => setActiveTab("workout")} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveTab()}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSignOut={handleSignOut}
        userName={user?.user_metadata?.full_name || user?.email || "Usuário"}
      />
    </div>
  );
};

export default Index;