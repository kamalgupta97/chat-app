'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type Room = {
  _id: string;
  title: string;
  description: string;
  type: 'public' | 'private';
  startTime: string;
  endTime: string;
  maxParticipants: number;
  tag: string;
  status: 'scheduled' | 'live' | 'closed';
  creator: {
    username: string;
  };
  participants: {
    username: string;
  }[];
};

export default function Home() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/rooms');
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chat Space</h1>
        {session ? (
          <Link
            href="/room/create"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Create Room
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Sign In
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Link
            key={room._id}
            href={`/room/${room._id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{room.title}</h2>
              <span
                className={`px-2 py-1 text-sm rounded ${
                  room.status === 'live'
                    ? 'bg-green-100 text-green-800'
                    : room.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {room.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{room.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{room.participants.length} participants</span>
              <span>{room.tag}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
} 