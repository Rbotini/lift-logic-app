import { Home, Activity, TrendingUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: "home", label: "Início", icon: Home },
    { id: "workout", label: "Treino", icon: Activity },
    { id: "progress", label: "Progresso", icon: TrendingUp },
    { id: "exercises", label: "Exercícios", icon: Search },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200",
              "hover:bg-muted/50",
              activeTab === id
                ? "bg-primary text-primary-foreground shadow-glow scale-105"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;