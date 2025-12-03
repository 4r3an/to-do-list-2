"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Check, Trash2, X, Calendar, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  status: string;
  completed: boolean;
  createdAt: string;
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

export default function TaskDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDateStart, setEditDateStart] = useState("");
  const [editDateEnd, setEditDateEnd] = useState("");
  const [editTimeStart, setEditTimeStart] = useState("");
  const [editTimeEnd, setEditTimeEnd] = useState("");
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const tasks: Task[] = JSON.parse(savedTasks);
      const foundTask = tasks.find((t) => t.id === id);
      if (foundTask) {
        setTask(foundTask);
        setEditTitle(foundTask.title);
        setEditDescription(foundTask.description);
        setEditDateStart(foundTask.date_start || "");
        setEditDateEnd(foundTask.date_end || "");
        setEditTimeStart(foundTask.time_start || "");
        setEditTimeEnd(foundTask.time_end || "");
        setEditStatus(foundTask.status || "to-do");
      }
    }
  }, [id, router]);

  const handleSaveEdit = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks && task) {
      const tasks: Task[] = JSON.parse(savedTasks);
      const updatedTasks = tasks.map((t) =>
        t.id === task.id
          ? { 
              ...t, 
              title: editTitle, 
              description: editDescription,
              date_start: editDateStart,
              date_end: editDateEnd,
              time_start: editTimeStart,
              time_end: editTimeEnd,
              status: editStatus
            }
          : t
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTask({ 
        ...task, 
        title: editTitle, 
        description: editDescription,
        date_start: editDateStart,
        date_end: editDateEnd,
        time_start: editTimeStart,
        time_end: editTimeEnd,
        status: editStatus
      });
      setIsEditing(false);
    }
  };

  const handleToggleComplete = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks && task) {
      const tasks: Task[] = JSON.parse(savedTasks);
      let newStatus = task.status;
      if (task.status === "to-do") {
        newStatus = "doing";
      } else if (task.status === "doing") {
        newStatus = "done";
      } else {
        newStatus = "to-do";
      }
      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTask({ ...task, status: newStatus });
    }
  };

  const handleDelete = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const tasks: Task[] = JSON.parse(savedTasks);
      const updatedTasks = tasks.filter((t) => t.id !== id);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      router.push("/");
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Not found</p>
            <Button
              onClick={() => router.push("/")}
              className="w-full mt-4"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Task</h1>
        </div>

        <Card>
          <CardHeader>
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-bold"
              />
            ) : (
              <CardTitle className={task.completed ? "line-through" : ""}>
                {task.title}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              {isEditing ? (
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              ) : (
                <CardDescription>
                  {task.description || "No description"}
                </CardDescription>
              )}
            </div>

            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={editDateStart}
                    onChange={(e) => setEditDateStart(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={editDateEnd}
                    onChange={(e) => setEditDateEnd(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    value={editTimeStart}
                    onChange={(e) => setEditTimeStart(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={editTimeEnd}
                    onChange={(e) => setEditTimeEnd(e.target.value)}
                  />
                </div>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="to-do">To-do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              </>
            ) : (
              <>
                {(task.date_start || task.time_start) && (
                  <div className="space-y-2">
                    {task.date_start && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {task.date_start} {task.date_end && `- ${task.date_end}`}
                      </div>
                    )}
                    {task.time_start && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {task.time_start} {task.time_end && `- ${task.time_end}`}
                      </div>
                    )}
                  </div>
                )}
                <div className="text-sm flex items-center gap-2">
                  Status:
                  <Badge variant={getStatusVariant(task.status)}>
                    {task.status === "to-do" ? "To-do" : task.status === "doing" ? "Doing" : "Done"}
                  </Badge>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-4 border-t">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveEdit} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(task.title);
                      setEditDescription(task.description);
                      setEditDateStart(task.date_start || "");
                      setEditDateEnd(task.date_end || "");
                      setEditTimeStart(task.time_start || "");
                      setEditTimeEnd(task.time_end || "");
                      setEditStatus(task.status || "to-do");
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleToggleComplete}
                    variant="outline"
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {task.status === "to-do" ? "Start" : task.status === "doing" ? "Finish" : "Reset"}
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
