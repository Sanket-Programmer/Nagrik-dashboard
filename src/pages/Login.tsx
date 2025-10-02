import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Building, Users, MapPin, TrendingUp, Activity, CheckCircle2 } from "lucide-react";
import civicHero from "@/assets/civic-hero.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"municipality" | "department" | null>(null);

  const handleRoleSelect = (role: "municipality" | "department") => {
    setSelectedRole(role);
    // Simulate login process
    setTimeout(() => {
      navigate(`/${role}`);
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${civicHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-civic-primary/90 via-civic-primary/70 to-civic-secondary/80" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Nagrik</h1>
            <p className="text-xl text-white/90 mb-2">Centralized Real-time Civic Issue Reporting Dashboard</p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              Select Your Role to Continue
            </Badge>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Municipality Admin */}
            <Card 
              className={`cursor-pointer transition-all duration-300 border-2 backdrop-blur-sm ${
                selectedRole === "municipality" 
                  ? "bg-white/95 border-white shadow-2xl scale-105 transform" 
                  : "bg-white/90 border-white/50 hover:bg-white/95 hover:border-white hover:shadow-xl"
              }`}
              onClick={() => handleRoleSelect("municipality")}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full transition-colors ${
                    selectedRole === "municipality" 
                      ? "bg-civic-primary text-white" 
                      : "bg-civic-primary/10 text-civic-primary"
                  }`}>
                    <Building className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-xl text-foreground">Municipality Admin</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Oversee all civic issues across departments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-civic-primary" />
                  Interactive city-wide map
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2 text-civic-primary" />
                  Department management
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-2 text-civic-primary" />
                  Performance analytics
                </div>
                <Button 
                  className={`w-full mt-4 transition-all ${
                    selectedRole === "municipality" 
                      ? "bg-civic-primary hover:bg-civic-primary/90" 
                      : "border-civic-primary/20 text-civic-primary hover:bg-civic-primary/10"
                  }`}
                  variant={selectedRole === "municipality" ? "default" : "outline"}
                  disabled={selectedRole === "municipality"}
                >
                  {selectedRole === "municipality" ? "Logging in..." : "Access Dashboard"}
                </Button>
              </CardContent>
            </Card>

            {/* Department Admin */}
            <Card 
              className={`cursor-pointer transition-all duration-300 border-2 backdrop-blur-sm ${
                selectedRole === "department" 
                  ? "bg-white/95 border-white shadow-2xl scale-105 transform" 
                  : "bg-white/90 border-white/50 hover:bg-white/95 hover:border-white hover:shadow-xl"
              }`}
              onClick={() => handleRoleSelect("department")}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full transition-colors ${
                    selectedRole === "department" 
                      ? "bg-civic-secondary text-white" 
                      : "bg-civic-secondary/10 text-civic-secondary"
                  }`}>
                    <Users className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-xl text-foreground">Department Admin</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage assigned issues and team workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Activity className="h-4 w-4 mr-2 text-civic-secondary" />
                  Assigned issues tracking
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2 text-civic-secondary" />
                  Team coordination
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-civic-secondary" />
                  Status updates
                </div>
                <Button 
                  className={`w-full mt-4 transition-all ${
                    selectedRole === "department" 
                      ? "bg-civic-secondary hover:bg-civic-secondary/90" 
                      : "border-civic-secondary/20 text-civic-secondary hover:bg-civic-secondary/10"
                  }`}
                  variant={selectedRole === "department" ? "default" : "outline"}
                  disabled={selectedRole === "department"}
                >
                  {selectedRole === "department" ? "Logging in..." : "Access Portal"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-white/80">
              Secure access • Real-time updates • Mobile responsive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;