import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, SeverityBadge } from "@/components/StatusBadge";
import { 
  ArrowLeft, Bell, Search, Filter, AlertTriangle, CheckCircle2, 
  Clock, User, MapPin, Building, Calendar, Activity
} from "lucide-react";
import { mockIssues, realtimeService, type Issue } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: "new_issue" | "status_update" | "escalation" | "assignment";
  title: string;
  description: string;
  issue: Issue;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
}

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");

  useEffect(() => {
    // Generate mock notifications from issues
    const mockNotifications: Notification[] = mockIssues.slice(0, 15).map((issue, index) => ({
      id: `notif-${issue.id}`,
      type: ["new_issue", "status_update", "escalation", "assignment"][index % 4] as Notification["type"],
      title: getNotificationTitle(issue, ["new_issue", "status_update", "escalation", "assignment"][index % 4] as Notification["type"]),
      description: getNotificationDescription(issue, ["new_issue", "status_update", "escalation", "assignment"][index % 4] as Notification["type"]),
      issue,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
      read: Math.random() > 0.4, // 60% chance of being read
      priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as Notification["priority"]
    }));

    setNotifications(mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

    // Subscribe to real-time updates
    const unsubscribe = realtimeService.subscribe((newIssue) => {
      const newNotification: Notification = {
        id: `notif-${newIssue.id}`,
        type: "new_issue",
        title: "New Issue Reported",
        description: `${newIssue.title} - ${newIssue.location.address}`,
        issue: newIssue,
        timestamp: new Date(),
        read: false,
        priority: newIssue.severity === "critical" ? "high" : newIssue.severity === "high" ? "medium" : "low"
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    });

    return unsubscribe;
  }, []);

  const getNotificationTitle = (issue: Issue, type: Notification["type"]): string => {
    switch (type) {
      case "new_issue":
        return "New Issue Reported";
      case "status_update":
        return "Issue Status Updated";
      case "escalation":
        return "Issue Escalated";
      case "assignment":
        return "Issue Assigned";
      default:
        return "Notification";
    }
  };

  const getNotificationDescription = (issue: Issue, type: Notification["type"]): string => {
    switch (type) {
      case "new_issue":
        return `${issue.title} - ${issue.location.address}`;
      case "status_update":
        return `${issue.title} status changed to ${issue.status}`;
      case "escalation":
        return `${issue.title} has been escalated to ${issue.department}`;
      case "assignment":
        return `${issue.title} assigned to ${issue.department}`;
      default:
        return issue.title;
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_issue":
        return <AlertTriangle className="h-5 w-5 text-civic-primary" />;
      case "status_update":
        return <Activity className="h-5 w-5 text-civic-secondary" />;
      case "escalation":
        return <AlertTriangle className="h-5 w-5 text-status-pending" />;
      case "assignment":
        return <Building className="h-5 w-5 text-civic-accent" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 border-red-200 bg-red-50";
      case "medium":
        return "text-orange-600 border-orange-200 bg-orange-50";
      case "low":
        return "text-green-600 border-green-200 bg-green-50";
      default:
        return "text-gray-600 border-gray-200 bg-gray-50";
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleViewIssue = (issueId: string) => {
    navigate(`/issues/${issueId}`);
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || notif.type === filterType;
    const matchesRead = filterRead === "all" || 
                       (filterRead === "read" && notif.read) ||
                       (filterRead === "unread" && !notif.read);
    
    return matchesSearch && matchesType && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/municipality")} className="max-sm:px-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="max-sm:hidden">Back to Dashboard</span>
            </Button>
            <div className="h-6 w-px bg-border max-sm:hidden" />
            <div>
              <h1 className="text-xl font-semibold">Notifications</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="new_issue">New Issues</SelectItem>
              <SelectItem value="status_update">Status Updates</SelectItem>
              <SelectItem value="escalation">Escalations</SelectItem>
              <SelectItem value="assignment">Assignments</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRead} onValueChange={setFilterRead}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="read">Read Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all hover:shadow-md cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-civic-primary bg-card/50' : ''
                }`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between flex-wrap">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-civic-primary rounded-full" />
                          )}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.description}
                        </p>
                        <div className="flex text-xs text-muted-foreground max-sm:flex-col">
                          <div className="flex items-center mr-3">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.timestamp.toLocaleString()}
                          </div>
                          <div className="flex items-center mr-3">
                            <MapPin className="h-3 w-3 mr-1" />
                            {notification.issue.location.address}
                          </div>
                          <div className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {notification.issue.department}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4 max-md:mt-5">
                      <StatusBadge status={notification.issue.status} />
                      <SeverityBadge severity={notification.issue.severity} />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIssue(notification.issue.id);
                        }}
                      >
                        View Issue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Notifications Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== "all" || filterRead !== "all"
                    ? "Try adjusting your filters to see more notifications."
                    : "You're all caught up! No new notifications at this time."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;