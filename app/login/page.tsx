"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff,  } from "lucide-react";


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  console.log(email, password);

  const handleLogin = () => {
    if (email === "test_todo@test.com" && password === "123456789") {
      // localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      setError("Username or password is incorrect");
    }
  };

  console.log(email, password)

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const checkEmail = "test_todo@test.com"
    const checkPassword = "123456789"

    if (email === checkEmail && password === checkPassword) {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      setError("Username or password is incorrect");
    }
  }

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                // value={email}
                name="email"
                // onChange={(e) => {
                //   setEmail(e.target.value);
                //   setError("");
                // }}
                // onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  // value={password}
                  name="password"
                  // onChange={(e) => {
                  //   setPassword(e.target.value);
                  //   setError("");
                  // }}
                  // onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            </form>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <div className="text-center">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
