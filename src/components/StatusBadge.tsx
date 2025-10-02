import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IssueStatus, IssueSeverity } from "@/lib/mock-data";

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

interface SeverityBadgeProps {
  severity: IssueSeverity;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-status-pending text-status-pending-foreground hover:bg-status-pending"
    },
    "in-progress": {
      label: "Progress",
      className: "bg-status-progress text-status-progress-foreground hover:bg-status-progress"
    },
    resolved: {
      label: "Resolved",
      className: "bg-status-resolved text-status-resolved-foreground hover:bg-status-resolved"
    }
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const severityConfig = {
    low: {
      label: "Low",
      className: "bg-muted text-muted-foreground hover:bg-"
    },
    medium: {
      label: "Medium",
      className: "bg-status-progress text-status-progress-foreground hover:bg-status-progress"
    },
    high: {
      label: "High",
      className: "bg-status-pending text-status-pending-foreground hover:bg-status-pending"
    },
    critical: {
      label: "Critical",
      className: "bg-destructive text-destructive-foreground animate-pulse hover:bg-destructive"
    }
  };

  const config = severityConfig[severity];

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}