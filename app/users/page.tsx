"use client";


import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const axios = require('axios');

interface UserData {
    id : number;
    name : string;
    username : string;
    email : string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            const UserData = await axios.get('https://jsonplaceholder.typicode.com/users');
            setUsers(UserData.data);
            console.log(UserData.data);
        };
        fetchUsers();
    },[]);

    const handleBackTasks = () => {
        router.push("/");
    }
    
    return (
        <div>
            <div className="flex flex-row justify-between items-center">
                <h1 className="mx-2 text-center text-3xl font-bold py-2">All Users</h1>
                <Button className="mx-2" onClick={handleBackTasks}>Back to Tasks</Button>
            </div>
            <Card>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {users.map((user) => (
                    <div key={user.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                        <CardTitle className="flex items-center">Name : {user.name}</CardTitle>
                        <CardDescription className="flex items-center">Username : {user.username}</CardDescription>
                        <CardDescription className="flex items-center">Email : {user.email}</CardDescription>
                    </div>
                   ))}
                </div>
            </CardContent>
            </Card>
        </div>
    );
}