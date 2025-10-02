export type IssueStatus = "pending" | "in-progress" | "resolved";
export type IssueSeverity = "low" | "medium" | "high" | "critical";
export type IssueCategory = "infrastructure" | "sanitation" | "lighting" | "traffic" | "utilities" | "environment";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  location: {
    address: string;
    coordinates: [number, number]; // [lat, lng]
  };
  reportedBy: {
    name: string;
    email: string;
    phone: string;
  };
  assignedTo?: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
  comments: Comment[];
  estimatedResolution?: Date;
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  activeIssues: number;
  resolvedToday: number;
  totalStaff: string;
  avgResolutionTime: number; // in hours
}

export interface KPIData {
  totalIssues: number;
  pendingIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  averageResolutionTime: number;
  issuesByCategory: Record<IssueCategory, number>;
  issuesOverTime: Array<{ date: string; count: number }>;
}

// Mock Data
export const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Public Works",
    head: "John Smith",
    activeIssues: 15,
    resolvedToday: 8,
    totalStaff: "25",
    avgResolutionTime: 48
  },
  {
    id: "2",
    name: "Sanitation",
    head: "Maria Garcia",
    activeIssues: 22,
    resolvedToday: 12,
    totalStaff: "18",
    avgResolutionTime: 24
  },
  {
    id: "3",
    name: "Transportation",
    head: "David Chen",
    activeIssues: 8,
    resolvedToday: 5,
    totalStaff: "15",
    avgResolutionTime: 72
  },
  {
    id: "4",
    name: "Parks & Recreation",
    head: "Sarah Johnson",
    activeIssues: 6,
    resolvedToday: 3,
    totalStaff: "12",
    avgResolutionTime: 36
  }
];

export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic hazard near the intersection",
    category: "infrastructure",
    severity: "high",
    status: "pending",
    location: {
      address: "123 Main Street, Downtown",
      coordinates: [40.7589, -73.9851]
    },
    reportedBy: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1-555-0123"
    },
    assignedTo: "Public Works",
    department: "Public Works",
    createdAt: new Date("2024-01-15T09:30:00Z"),
    updatedAt: new Date("2024-01-15T09:30:00Z"),
    comments: [
      {
        id: "1",
        author: "John Doe",
        role: "Citizen",
        content: "This pothole has been getting worse over the past week. It's causing cars to swerve.",
        createdAt: new Date("2024-01-15T09:30:00Z")
      }
    ]
  },
  {
    id: "2",
    title: "Broken Street Light",
    description: "Street light is flickering and may go out completely",
    category: "lighting",
    severity: "medium",
    status: "in-progress",
    location: {
      address: "456 Oak Avenue, Residential District",
      coordinates: [40.7505, -73.9934]
    },
    reportedBy: {
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1-555-0456"
    },
    assignedTo: "Public Works",
    department: "Public Works",
    createdAt: new Date("2024-01-14T14:20:00Z"),
    updatedAt: new Date("2024-01-15T08:15:00Z"),
    comments: [
      {
        id: "2",
        author: "Jane Smith",
        role: "Citizen",
        content: "The light has been flickering for three days now.",
        createdAt: new Date("2024-01-14T14:20:00Z")
      },
      {
        id: "3",
        author: "Mike Wilson",
        role: "Technician",
        content: "Scheduled for repair tomorrow morning. Parts have been ordered.",
        createdAt: new Date("2024-01-15T08:15:00Z")
      }
    ]
  },
  {
    id: "3",
    title: "Overflowing Garbage Bin",
    description: "Public garbage bin is overflowing, attracting pests",
    category: "sanitation",
    severity: "medium",
    status: "resolved",
    location: {
      address: "789 Park Lane, City Center",
      coordinates: [40.7614, -73.9776]
    },
    reportedBy: {
      name: "Robert Johnson",
      email: "robert.j@email.com",
      phone: "+1-555-0789"
    },
    assignedTo: "Sanitation",
    department: "Sanitation",
    createdAt: new Date("2024-01-13T16:45:00Z"),
    updatedAt: new Date("2024-01-14T11:30:00Z"),
    comments: [
      {
        id: "4",
        author: "Robert Johnson",
        role: "Citizen",
        content: "Bin has been full for days and is starting to smell.",
        createdAt: new Date("2024-01-13T16:45:00Z")
      },
      {
        id: "5",
        author: "Lisa Brown",
        role: "Sanitation Worker",
        content: "Issue resolved. Bin emptied and scheduled for more frequent pickup.",
        createdAt: new Date("2024-01-14T11:30:00Z")
      }
    ]
  },
  {
    id: "4",
    title: "Traffic Signal Malfunction",
    description: "Traffic light stuck on red, causing traffic backup",
    category: "traffic",
    severity: "critical",
    status: "pending",
    location: {
      address: "Junction of 5th Ave & Broadway",
      coordinates: [40.7505, -73.9851]
    },
    reportedBy: {
      name: "Emergency Services",
      email: "dispatch@city.gov",
      phone: "+1-911"
    },
    assignedTo: "Transportation",
    department: "Transportation",
    createdAt: new Date("2024-01-15T11:00:00Z"),
    updatedAt: new Date("2024-01-15T11:00:00Z"),
    comments: [
      {
        id: "6",
        author: "Traffic Control",
        role: "Emergency Services",
        content: "Traffic backup extending 3 blocks. Immediate attention required.",
        createdAt: new Date("2024-01-15T11:00:00Z")
      }
    ]
  }
];

export const mockKPIData: KPIData = {
  totalIssues: 156,
  pendingIssues: 23,
  inProgressIssues: 45,
  resolvedIssues: 88,
  averageResolutionTime: 42,
  issuesByCategory: {
    infrastructure: 45,
    sanitation: 38,
    lighting: 25,
    traffic: 18,
    utilities: 22,
    environment: 8
  },
  issuesOverTime: [
    { date: "Jan 1", count: 12 },
    { date: "Jan 2", count: 8 },
    { date: "Jan 3", count: 15 },
    { date: "Jan 4", count: 22 },
    { date: "Jan 5", count: 18 },
    { date: "Jan 6", count: 25 },
    { date: "Jan 7", count: 19 }
  ]
};

// Real-time event simulation
export class MockRealtimeService {
  private listeners: Array<(issue: Issue) => void> = [];

  subscribe(callback: (issue: Issue) => void) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  simulateNewIssue() {
    const newIssue: Issue = {
      id: Date.now().toString(),
      title: "New Issue - " + Math.random().toString(36).substr(2, 9),
      description: "Simulated real-time issue report",
      category: "infrastructure",
      severity: "medium",
      status: "pending",
      location: {
        address: "Simulated Address",
        coordinates: [40.7589 + (Math.random() - 0.5) * 0.01, -73.9851 + (Math.random() - 0.5) * 0.01]
      },
      reportedBy: {
        name: "Test User",
        email: "test@example.com",
        phone: "+1-555-0000"
      },
      department: "Public Works",
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };

    this.listeners.forEach(callback => callback(newIssue));
  }

  startSimulation() {
    // Simulate new issues every 30 seconds
    return setInterval(() => {
      this.simulateNewIssue();
    }, 30000);
  }
}

export const realtimeService = new MockRealtimeService();