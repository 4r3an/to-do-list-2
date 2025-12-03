import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Check, Trash2, Calendar, Clock } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  status: string;
  completed: boolean;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "to-do":
      return "outline";
    case "doing":
      return "default";
    case "done":
      return "secondary";
    default:
      return "outline";
  }
};

export default function TaskCard({ 
  id, 
  title, 
  description,
  date_start,
  date_end,
  time_start,
  time_end,
  status,
  completed,
  onDelete, 
  onToggleComplete,
  onStatusChange
}: TaskCardProps) {
  const handleStatusClick = () => {
    if (status === "to-do") {
      onStatusChange(id, "doing");
    } else if (status === "doing") {
      onStatusChange(id, "done");
    } else {
      onStatusChange(id, "to-do");
    }
  };

  return (
    <Card className={completed ? "opacity-60" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className={completed ? "line-through" : ""}>
            {title}
          </CardTitle>
          <Badge variant={getStatusVariant(status)}>
            {status === "to-do" ? "To-do" : status === "doing" ? "Doing" : "Done"}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
        {(date_start || time_start) && (
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            {date_start && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {date_start} {date_end && `- ${date_end}`}
              </div>
            )}
            {time_start && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {time_start} {time_end && `- ${time_end}`}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex gap-2">
        <Link href={`/tasks/${id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleStatusClick}
        >
          <Check className="h-4 w-4 mr-1" />
          {status === "to-do" ? "Start" : status === "doing" ? "Finish" : "Reset"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
