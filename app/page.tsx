"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";

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

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDateStart, setNewDateStart] = useState("");
  const [newDateEnd, setNewDateEnd] = useState("");
  const [newTimeStart, setNewTimeStart] = useState("");
  const [newTimeEnd, setNewTimeEnd] = useState("");
  const [newStatus, setNewStatus] = useState("to-do");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [router]);


  const validateTaskForm = (): boolean => {
    let isValid = true;

    // Validate title
    if (!newTitle || !newTitle.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (newTitle.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      isValid = false;
    } else {
      setTitleError("");
    }

    // Validate dates
    if (newDateStart && newDateEnd) {
      const startDate = new Date(newDateStart);
      const endDate = new Date(newDateEnd);
      if (endDate < startDate) {
        setDateError("End date must be after start date");
        isValid = false;
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }

    // Validate times (only if dates are the same)
    if (newDateStart && newDateEnd && newTimeStart && newTimeEnd) {
      if (newDateStart === newDateEnd) {
        const startTime = new Date(`2000-01-01T${newTimeStart}`);
        const endTime = new Date(`2000-01-01T${newTimeEnd}`);
        if (endTime <= startTime) {
          setTimeError("End time must be after start time");
          isValid = false;
        } else {
          setTimeError("");
        }
      } else {
        setTimeError("");
      }
    } else {
      setTimeError("");
    }

    return isValid;
  };

  const handleAddTask = () => {
    if (!validateTaskForm()) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      date_start: newDateStart,
      date_end: newDateEnd,
      time_start: newTimeStart,
      time_end: newTimeEnd,
      status: newStatus,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    setNewTitle("");
    setNewDescription("");
    setNewDateStart("");
    setNewDateEnd("");
    setNewTimeStart("");
    setNewTimeEnd("");
    setNewStatus("to-do");
    setTitleError("");
    setDateError("");
    setTimeError("");
    setIsDialogOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  const handleUserPage = () => {
    router.push("/users");
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">To-Do List</h1>
          <ButtonGroup>
            <Button variant="outline" onClick={() => handleUserPage()}>
              User
            </Button>
            <Button onClick={() => setShowLogoutDialog(true)}>
              Log out
            </Button>
          </ButtonGroup>
        </div>

        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Title</label>
                  <Input
                    placeholder="Task title"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      setTitleError("");
                    }}
                    className={titleError ? "border-destructive" : ""}
                  />
                  {titleError && (
                    <p className="text-sm text-destructive mt-1">{titleError}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <Input
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Date Start</label>
                    <Input
                      type="date"
                      value={newDateStart}
                      onChange={(e) => {
                        setNewDateStart(e.target.value);
                        setDateError("");
                      }}
                      className={dateError ? "border-destructive" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Date End</label>
                    <Input
                      type="date"
                      value={newDateEnd}
                      onChange={(e) => {
                        setNewDateEnd(e.target.value);
                        setDateError("");
                      }}
                      className={dateError ? "border-destructive" : ""}
                    />
                  </div>
                </div>
                {dateError && (
                  <p className="text-sm text-destructive">{dateError}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Time Start</label>
                    <Input
                      type="time"
                      value={newTimeStart}
                      onChange={(e) => {
                        setNewTimeStart(e.target.value);
                        setTimeError("");
                      }}
                      className={timeError ? "border-destructive" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Time End</label>
                    <Input
                      type="time"
                      value={newTimeEnd}
                      onChange={(e) => {
                        setNewTimeEnd(e.target.value);
                        setTimeError("");
                      }}
                      className={timeError ? "border-destructive" : ""}
                    />
                  </div>
                </div>
                {timeError && (
                  <p className="text-sm text-destructive">{timeError}</p>
                )}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="to-do">To-do</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <Button onClick={handleAddTask} className="w-full">
                  Add
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No tasks</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                date_start={task.date_start}
                date_end={task.date_end}
                time_start={task.time_start}
                time_end={task.time_end}
                status={task.status}
                completed={task.completed}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </main>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

