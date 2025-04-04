import React from 'react';
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LiveAlert } from "@/types/alerts";

interface MockAlert {
  id: string;
  type: string;
  user: string;
  message: string;
  timestamp: string;
}

interface MockData {
  alerts: MockAlert[];
}

const mockData: MockData = {
  alerts: [
    {
      id: "1",
      type: "security",
      user: "Hamza",
      message: "Suspicious activity detected",
      timestamp: "2024-07-15T12:34:56Z",
    },
    {
      id: "2",
      type: "moderation",
      user: "Zeeshan",
      message: "User reported for inappropriate content",
      timestamp: "2024-07-14T23:45:12Z",
    },
    {
      id: "3",
      type: "flagged",
      user: "Ali",
      message: "Content flagged by multiple users",
      timestamp: "2024-07-14T18:27:33Z",
    },
    {
      id: "4",
      type: "report",
      user: "Usman",
      message: "DMCA report received",
      timestamp: "2024-07-13T09:18:29Z",
    },
  ],
};

const GodmodeDashboard = () => {
  const alerts: LiveAlert[] = mockData.alerts.map(alert => ({
    ...alert,
    alert_type: mapAlertTypeToSystem(alert.type), // Function to map types to our expected values
    user_id: 'some-user-id',
    username: alert.user,
    avatar_url: '',
    timestamp: alert.timestamp,
    created_at: alert.timestamp,
    content_type: 'unknown',
    reason: alert.message,
    severity: 'medium',
    content_id: 'some-content-id',
    message: alert.message,
    status: 'pending',
    title: `Alert for ${alert.user}`,
    is_viewed: false,
    type: alert.type
  }));

  // Add this helper function nearby:
  const mapAlertTypeToSystem = (type: string): "violation" | "risk" | "information" => {
    switch(type) {
      case "security":
      case "report":
        return "violation";
      case "flagged":
      case "moderation":
        return "risk";
      default:
        return "information";
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">God Mode Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Real-time status of platform services.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>All systems operational.</p>
            </CardContent>
            <CardFooter>
              <Button>Check System Logs</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Overview of user activity and engagement.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Total Users: 1,234,567</p>
              <p>Active Users (last 24h): 45,678</p>
            </CardContent>
            <CardFooter>
              <Button>View Detailed Analytics</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Recent alerts and moderation actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Pending Reports: 32</p>
              <p>Recent Bans: 5</p>
            </CardContent>
            <CardFooter>
              <Button>Review Moderation Queue</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Alerts</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge>{alert.alert_type}</Badge>
                    </TableCell>
                    <TableCell>{alert.username}</TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Alert Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about this alert.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="type"
                                className="text-right font-medium"
                              >
                                Type
                              </label>
                              <p
                                id="type"
                                className="col-span-3"
                              >
                                {alert.type}
                              </p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="user"
                                className="text-right font-medium"
                              >
                                User
                              </label>
                              <p
                                id="user"
                                className="col-span-3"
                              >
                                {alert.user}
                              </p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="message"
                                className="text-right font-medium"
                              >
                                Message
                              </label>
                              <p
                                id="message"
                                className="col-span-3"
                              >
                                {alert.message}
                              </p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="timestamp"
                                className="text-right font-medium"
                              >
                                Timestamp
                              </label>
                              <p
                                id="timestamp"
                                className="col-span-3"
                              >
                                {alert.timestamp}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GodmodeDashboard;
