import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StatusBadge, SeverityBadge } from "@/components/StatusBadge";
import { 
  ArrowLeft, MapPin, Clock, User, Mail, Phone, MessageSquare, 
  Camera, AlertTriangle, CheckCircle2, Activity, Send, Calendar,
  Building, Users, Settings
} from "lucide-react";
import { mockIssues, mockDepartments, type Issue, type Comment } from "@/lib/mock-data";

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState<Issue["status"]>("pending");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    const foundIssue = mockIssues.find(i => i.id === id);
    if (foundIssue) {
      setIssue(foundIssue);
      setNewStatus(foundIssue.status);
    }
  }, [id]);

  const handleBack = () => {
     navigate(-1);
  };

  const handleStatusUpdate = () => {
    if (!issue) return;
    
    const updatedIssue = {
      ...issue,
      status: newStatus,
      updatedAt: new Date()
    };
    
    setIssue(updatedIssue);
    // In a real app, this would make an API call
  };

  const handleAddComment = () => {
    if (!issue || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Department Admin",
      role: "Department Admin",
      content: newComment,
      createdAt: new Date()
    };

    const updatedIssue = {
      ...issue,
      comments: [...issue.comments, comment],
      updatedAt: new Date()
    };

    setIssue(updatedIssue);
    setNewComment("");
  };

  const handleAssignDepartment = () => {
    if (!issue || !selectedDepartment) return;
    
    const updatedIssue = {
      ...issue,
      department: selectedDepartment,
      updatedAt: new Date()
    };
    
    setIssue(updatedIssue);
    setIsAssignDialogOpen(false);
    setSelectedDepartment("");
  };

  if (!issue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Issue Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested issue could not be found.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="max-sm:px-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="max-sm:hidden">Back</span>
            </Button>
            <div className="h-6 w-px bg-border max-sm:hidden"/>
            <div>
              <h1 className="text-xl font-semibold">Issue Details</h1>
              <p className="text-sm text-muted-foreground">#{issue.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={issue.status} />
            <SeverityBadge severity={issue.severity} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{issue.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {issue.category}
                  </Badge>
                </CardTitle>
                <CardDescription>{issue.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-civic-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Location</p>
                        <p className="text-sm text-muted-foreground">{issue.location.address}</p>
                        <p className="text-xs text-muted-foreground">
                          Coordinates: {issue.location.coordinates.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-civic-secondary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Department</p>
                        <p className="text-sm text-muted-foreground">{issue.department}</p>
                        {issue.assignedTo && (
                          <p className="text-xs text-muted-foreground">
                            Assigned to: {issue.assignedTo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-civic-accent mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Timeline</p>
                        <p className="text-sm text-muted-foreground">
                          Reported: {new Date(issue.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Updated: {new Date(issue.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-status-pending mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Priority Level</p>
                        <SeverityBadge severity={issue.severity} className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Issue Location
                </CardTitle>
                <CardDescription>Precise location of the reported issue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">Map View</p>
                    <p className="text-sm text-muted-foreground">
                      Interactive map showing exact issue location
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {issue.location.coordinates.join(", ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Comments & Updates ({issue.comments.length})
                </CardTitle>
                <CardDescription>Communication history and status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-civic-primary/20 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-start max-sm:flex-col">
                         <div className="flex items-center space-x-2 justify-start mr-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-sm">{comment.author}</span>
                          </div>
                          <Badge variant="outline" className="text-xs max-sm:mt-2">
                            {comment.role}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-4">{comment.content}</p>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add a comment or update..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reporter Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Reporter Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">{issue.reportedBy.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{issue.reportedBy.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{issue.reportedBy.phone}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Reporter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Status Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Status</label>
                    <Select value={newStatus} onValueChange={(value: Issue["status"]) => setNewStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-status-pending" />
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-2 text-status-progress" />
                            In Progress
                          </div>
                        </SelectItem>
                        <SelectItem value="resolved">
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-status-resolved" />
                            Resolved
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleStatusUpdate}
                    disabled={newStatus === issue.status}
                    className="w-full"
                  >
                    Update Status
                  </Button>

                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Quick Actions</p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        Add Photos
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Work
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        Assign Team
                      </Button>
                      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            <Building className="h-4 w-4 mr-2" />
                            Assign to Department
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Issue to Department</DialogTitle>
                            <DialogDescription>
                              Select a department to handle this civic issue.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="department-select">Department</Label>
                              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a department..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockDepartments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.name}>
                                      <div className="flex items-center">
                                        <Building className="h-4 w-4 mr-2" />
                                        {dept.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAssignDepartment} disabled={!selectedDepartment}>
                              Assign Issue
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issue Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue ID:</span>
                    <span className="font-mono">#{issue.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline" className="text-xs">
                      {issue.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Severity:</span>
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span>{issue.department}</span>
                  </div>
                  {issue.estimatedResolution && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Resolution:</span>
                      <span>{new Date(issue.estimatedResolution).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;