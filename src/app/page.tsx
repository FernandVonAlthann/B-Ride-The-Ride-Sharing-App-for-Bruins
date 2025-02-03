'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock authentication logic
    if (email && password) {
      router.push('/dashboard');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">B-Ride Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" onClick={handleLogin}>Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}