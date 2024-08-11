'use client';

import { MeQuery } from '@/services/graphql/generated';
import { useEffect, useState } from 'react';

const User = () => {
  const [userData, setUserData] = useState<MeQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data: MeQuery = await response.json();
        setUserData(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Welcome, {userData?.me?.username || userData?.me?.defaultAccount.id}!</h1>
    </div>
  );
};

export default User;
