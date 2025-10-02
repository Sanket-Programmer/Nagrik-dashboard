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
  Users, MapPin, AlertTriangle, CheckCircle2, Clock, Search, 
  Bell, Settings, LogOut, Home, Briefcase, TrendingUp, Activity,
  AlertCircle, FileText, MessageSquare, Camera, Phone, Mail
} from "lucide-react";
import { mockIssues, realtimeService, type Issue } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; 

const DepartmentDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>(
    mockIssues.filter(issue => issue.department === "Public Works")
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Issue[]>([]);
  const [activeTab, setActiveTab] = useState("assigned");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real-time updates simulation
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((newIssue) => {
      if (newIssue.department === "Public Works") {
        setIssues(prev => [newIssue, ...prev]);
        setNotifications(prev => [newIssue, ...prev.slice(0, 4)]);
      }
    });

    const interval = realtimeService.startSimulation();

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = selectedStatus === "all" || issue.status === selectedStatus;
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const departmentKPIs = {
    totalAssigned: issues.length,
    pending: issues.filter(i => i.status === "pending").length,
    inProgress: issues.filter(i => i.status === "in-progress").length,
    resolved: issues.filter(i => i.status === "resolved").length,
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleViewIssue = (issueId: string) => {
    navigate(`/issues/${issueId}`);
  };

  const handleStatusUpdate = (issueId: string, newStatus: Issue["status"]) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus, updatedAt: new Date() }
        : issue
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 bg-white shadow-sm items-center justify-between">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-2">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-civic-secondary" />
            <div>
              <h1 className="text-xl font-semibold">Public Works Department</h1>
              <p className="text-sm text-muted-foreground">Department Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "assigned" ? "bg-civic-secondary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`} onClick={() => {setActiveTab("assigned"); setSidebarOpen(false);}}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "notifications" ? "bg-civic-secondary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`} onClick={() => {setActiveTab("notifications"); setSidebarOpen(false);}}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "performance" ? "bg-civic-secondary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`} onClick={() => {setActiveTab("performance"); setSidebarOpen(false);}}>
              <Activity className="h-4 w-4 mr-2" />
              Performance
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${ activeTab === "settings" ? "bg-civic-secondary text-white rounded-md shadow" : "hover:bg-muted hover:text-foreground"}`}>
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
        <main className="flex-1 p-6 overflow-auto">
          {/* Department KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Assigned Issues"
              value={departmentKPIs.totalAssigned}
              change="Your department total"
              icon={Briefcase}
              className="border-civic-secondary/20"
            />
            <KPICard
              title="Pending"
              value={departmentKPIs.pending}
              change="Need attention"
              icon={Clock}
              trend="down"
            />
            <KPICard
              title="In Progress"
              value={departmentKPIs.inProgress}
              change="Currently working"
              icon={Activity}
            />
            <KPICard
              title="Resolved"
              value={departmentKPIs.resolved}
              change="Completed today"
              icon={CheckCircle2}
              trend="up"
            />
          </div>

          <Tabs className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="assigned" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assigned issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Issues List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Assigned Issues ({filteredIssues.length})</CardTitle>
                  <CardDescription>Manage issues assigned to your department</CardDescription>
                </CardHeader>
                <CardContent className="max-sm:p-3">
                  <div className="space-y-4">
                    {filteredIssues.map((issue) => (
                      <Card key={issue.id} >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between max-lg:flex-col">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{issue.title}</h4>
                                <SeverityBadge severity={issue.severity} />
                                <StatusBadge status={issue.status}/>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                              
                              {/* Issue Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-civic-secondary" />
                                    <span>{issue.location.address}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-civic-secondary" />
                                    <span>Reported: {new Date(issue.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="text-xs">
                                      {issue.category}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-xs text-muted-foreground">
                                      Last updated: {new Date(issue.updatedAt).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Reporter Info */}
                              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                <h5 className="font-medium text-sm mb-2">Reporter Information</h5>
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">Name:</span>
                                    <span>{issue.reportedBy.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    <span>{issue.reportedBy.email}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    <span>{issue.reportedBy.phone}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col max-lg:flex-row mt-5 ml-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewIssue(issue.id)}
                                className="mb-4 max-lg:mr-3"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              
                              {issue.status === "pending" && (
                                <Button
                                  size="sm"
                                  className="bg-civic-accent hover:bg-civic-accent/90"
                                  onClick={() => handleStatusUpdate(issue.id, "in-progress")}
                                >
                                  Start Work
                                </Button>
                              )}
                              
                              {issue.status === "in-progress" && (
                                <Button
                                  size="sm"
                                  className="bg-status-resolved hover:bg-status-resolved/90"
                                  onClick={() => handleStatusUpdate(issue.id, "resolved")}
                                >
                                  Mark Resolved
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Stay updated with new assignments and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((issue) => (
                        <div key={issue.id} className="flex justify-between items-start p-4 bg-civic-secondary/5 border border-civic-secondary/20 rounded-lg max-lg:flex-col max-lg:space-y-3"
>
                         <div className="flex items-start space-x-3">
                                <AlertCircle className="h-5 w-5 text-civic-secondary"/>
                            <div>
                              <p className="font-medium">New Issue Assigned: {issue.title}</p>
                              <p className="text-sm text-muted-foreground">{issue.location.address}</p>
                              <p className="text-xs text-muted-foreground">{new Date(issue.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end">
                            <SeverityBadge severity={issue.severity} />
                             <Button size="sm" className="bg-civic-secondary text-white rounded-md shadow" onClick={() => handleViewIssue(issue.id)}> View </Button>
                       </div>
                    </div> 
                    ))) : (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No new notifications</p>
                        <p className="text-sm text-muted-foreground">New assignments will appear here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                    <CardDescription>Your department's issue resolution trend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-civic-secondary mx-auto mb-4" />
                      <p className="font-semibold">85% Resolution Rate</p>
                      <p className="text-sm text-muted-foreground">Above department average</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Average time to first response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-civic-accent mx-auto mb-4" />
                      <p className="font-semibold">2.5 Hours</p>
                      <p className="text-sm text-muted-foreground">15% better than last month</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default DepartmentDashboard;