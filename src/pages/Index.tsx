import { useState } from "react";
import Navigation from "@/components/ui/navigation";
import Home from "@/pages/Home";
import Workout from "@/pages/Workout";
import Progress from "@/pages/Progress";
import Exercises from "@/pages/Exercises";
import Setup from "@/pages/Setup";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleSetupComplete = (data: any) => {
    setUserData(data);
    setIsSetupComplete(true);
  };

  if (!isSetupComplete) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <Home onStartWorkout={() => setActiveTab("workout")} userData={userData} />;
      case "workout":
        return <Workout onBack={() => setActiveTab("home")} userData={userData} />;
      case "progress":
        return <Progress />;
      case "exercises":
        return <Exercises />;
      default:
        return <Home onStartWorkout={() => setActiveTab("workout")} userData={userData} />;
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
