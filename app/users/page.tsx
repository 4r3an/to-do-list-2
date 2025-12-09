"use client";


import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const axios = require('axios');

interface UserData {
    id : number;
    name : string;
    username : string;
    email : string;
}

export default function UsersPage() {
    const router = useRouter();

    // Fetch users using TanStack Query
    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await axios.get('https://jsonplaceholder.typicode.com/users');
            return response.data;
        }
    });

    // Old axios implementation (commented out)
    // const [users, setUsers] = useState<UserData[]>([]);
    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         const UserData = await axios.get('https://jsonplaceholder.typicode.com/users');
    //         setUsers(UserData.data);
    //         console.log(UserData.data);
    //     };
    //     fetchUsers();
    // },[]);

    const handleBackTasks = () => {
        router.push("/");
    }

    if (isLoading) {
        return <div className="text-center p-4">Loading users...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">Error loading users</div>;
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
                    {users.map((user: UserData) => (
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