import { useState } from "react";
import Navigation from "@/components/ui/navigation";
import Home from "@/pages/Home";
import Workout from "@/pages/Workout";
import Progress from "@/pages/Progress";
import Exercises from "@/pages/Exercises";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <Home onStartWorkout={() => setActiveTab("workout")} />;
      case "workout":
        return <Workout onBack={() => setActiveTab("home")} />;
      case "progress":
        return <Progress />;
      case "exercises":
        return <Exercises />;
      default:
        return <Home onStartWorkout={() => setActiveTab("workout")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveTab()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
