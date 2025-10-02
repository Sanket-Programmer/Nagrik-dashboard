import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "@/components/KPICard";
import { StatusBadge, SeverityBadge } from "@/components/StatusBadge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Shield, Building, Users, MapPin, AlertTriangle, CheckCircle2, 
  Clock, Search, Filter, Bell, Settings, LogOut, Home, Briefcase,
  TrendingUp, Activity, AlertCircle, Plus
} from "lucide-react";
import { mockIssues, mockDepartments, mockKPIData, realtimeService, type Issue } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; 


type Department = {
  id: string;
  name: string;
  head: string;
  activeIssues: number;
  resolvedToday: number;
  totalStaff: string;
  avgResolutionTime: number;
};


const MunicipalityDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Issue[]>([]);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [newDepartmentName, setNewDepartmentName] = useState<string>("");
  const [newDepartmentHead, setNewDepartmentHead] = useState<string>("");
  const [newDepartmentStaff, setNewDepartmentStaff] = useState<string>("");
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real-time updates simulation
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((newIssue) => {
      setIssues(prev => [newIssue, ...prev]);
      setNotifications(prev => [newIssue, ...prev.slice(0, 4)]);
    });

    const interval = realtimeService.startSimulation();

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory;
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const statusColors = {
    pending: "#ef4444",
    "in-progress": "#f59e0b",
    resolved: "#22c55e"
  };

  const categoryData = Object.entries(mockKPIData.issuesByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const handleLogout = () => {
    navigate("/login");
  };

  const handleViewIssue = (issueId: string) => {
    navigate(`/issues/${issueId}`);
  };

  const handleAddDepartment = () => {
   if (newDepartmentName.trim() && newDepartmentHead.trim()) {
     const newDept: Department = {
      id: String(departments.length + 1), // simple ID generator
      name: newDepartmentName.trim(),
      head: newDepartmentHead.trim(),
      activeIssues: 0,
      resolvedToday: 0,
      totalStaff: newDepartmentStaff.trim(),
      avgResolutionTime: 0,
     };
   setDepartments((prev) => [...prev, newDept]);

    // Reset form
    setNewDepartmentName("");
    setNewDepartmentHead("");
    setNewDepartmentStaff("");
    setIsAddDepartmentOpen(false);
  }
};  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 bg-white shadow-sm items-center justify-between">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-2">
          <div className="flex items-center space-x-4">
             <Building className="h-8 w-8 text-civic-primary max-sm:h-6"/>
            <h1 className="text-xl font-semibold max-sm:text-lg">Municipality Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost"
              size="sm" 
              className="relative mr-5 hover:bg-gray-100 max-sm:m-0"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5"/>
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-1.5 text-xs">
                  {notifications.length}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="bg-red-500 text-white max-sm:hidden">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
             >
             <Menu className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`fixed sm:static top-16 left-0 w-64 min-h-screen border-r bg-card transform transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}>
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "overview" ? "bg-civic-primary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`} onClick={() => {setActiveTab("overview"); setSidebarOpen(false);}}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "map" ? "bg-civic-primary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`} onClick={() => {setActiveTab("map"); setSidebarOpen(false);}}>
              <MapPin className="h-4 w-4 mr-2" />
              Interactive Map
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "issues" ? "bg-civic-primary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`} onClick={() => {setActiveTab("issues"); setSidebarOpen(false);}}>
              <Briefcase className="h-4 w-4 mr-2" />
              Issue Management
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "departments" ? "bg-civic-primary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`} onClick={() => {setActiveTab("departments"); setSidebarOpen(false);}}>
              <Users className="h-4 w-4 mr-2" />
              Departments
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "settings" ? "bg-civic-primary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="bg-red-500 text-white sm:hidden">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Issues"
              value={mockKPIData.totalIssues}
              change="+12% from last week"
              icon={AlertTriangle}
              trend="up"
            />
            <KPICard
              title="Pending Issues"
              value={mockKPIData.pendingIssues}
              change="-5% from yesterday"
              icon={Clock}
              trend="down"
            />
            <KPICard
              title="Resolved Today"
              value={mockKPIData.resolvedIssues}
              change="+18% from yesterday"
              icon={CheckCircle2}
              trend="up"
            />
            <KPICard
              title="Avg Resolution Time"
              value={`${mockKPIData.averageResolutionTime}h`}
              change="-8% improvement"
              icon={Activity}
              trend="down"
            />
          </div>

          <Tabs className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Issues by Category</CardTitle>
                    <CardDescription>Distribution of reported issues</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-0 pr-0">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" tick={{ fontSize: 12, fill: "#555" }}/>
                        <YAxis />
                        <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--civic-primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
                 </CardContent>
              </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Issues Over Time</CardTitle>
                    <CardDescription>Weekly trend analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-0">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockKPIData.issuesOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--civic-primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((issue) => (
                        <div key={issue.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="h-5 w-5 text-civic-primary" />
                            <div>
                              <p className="font-medium">{issue.title}</p>
                              <p className="text-sm text-muted-foreground">{issue.location.address}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={issue.status} />
                            <SeverityBadge severity={issue.severity} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive City Map</CardTitle>
                  <CardDescription>Real-time visualization of all reported issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] bg-muted/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                      <p className="text-muted-foreground">
                        Map integration would display issue pins here
                        <br />
                        Red: Pending • Yellow: In Progress • Green: Resolved
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Issues List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Issues ({filteredIssues.length})</CardTitle>
                  <CardDescription>Manage and monitor civic issues across the city</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredIssues.map((issue) => (
                      <div key={issue.id} className="lg:flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="lg:flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{issue.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                              <div className="flex space-x-2 mt-2 max-md:flex-col gap-2">
                                <Badge variant="outline" className="text-xs w-min">
                                  {issue.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {issue.location.address}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(issue.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="lg:flex items-center space-x-2 max-lg:mt-4">
                              <SeverityBadge severity={issue.severity} />
                              <StatusBadge status={issue.status} />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewIssue(issue.id)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader className="lg:flex flex-row items-center justify-between max-md:flex-wrap gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                    <CardTitle>Department Overview</CardTitle>
                    <CardDescription>Monitor performance across all municipal departments</CardDescription>
                  </div>
                  <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                        <DialogDescription>
                          Create a new municipal department to manage civic issues.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="department-name">Department Name</Label>
                          <Input
                            id="department-name"
                            value={newDepartmentName}
                            onChange={(e) => setNewDepartmentName(e.target.value)}
                            placeholder="e.g., Road Maintenance"
                          />
                        </div>
                        <div>
                          <Label htmlFor="department-head">Department Head</Label>
                          <Input
                            id="department-head"
                            value={newDepartmentHead}
                            onChange={(e) => setNewDepartmentHead(e.target.value)}
                            placeholder="e.g., John Smith"
                          />
                        </div>
                          <div>
                          <Label htmlFor="department-staff">Total Staff</Label>
                          <Input
                            id="department-staff"
                            value={newDepartmentStaff}
                            onChange={(e) => setNewDepartmentStaff(e.target.value)}
                            placeholder="e.g., 10"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddDepartment}>
                          Add Department
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                      <Card key={dept.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                          <CardDescription>Head: {dept.head}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Active Issues</p>
                              <p className="text-2xl font-bold text-status-pending">{dept.activeIssues}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Resolved Today</p>
                              <p className="text-2xl font-bold text-status-resolved">{dept.resolvedToday}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Staff</p>
                              <p className="text-lg font-semibold">{dept.totalStaff}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Avg Resolution</p>
                              <p className="text-lg font-semibold">{dept.avgResolutionTime}h</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MunicipalityDashboard;