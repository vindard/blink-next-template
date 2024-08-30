'use client';

import { btcSatPriceInTtd } from "@/services/client/blink";
import { MeQuery } from "@/services/common/blink/generated";
import { useEffect, useState } from 'react';

const User = () => {
  const [userData, setUserData] = useState<MeQuery | null>(null);
  const [usdBtcPrice, setUsdBtcPrice] = useState<string | null>(null);
  const [ttdBtcPrice, setTtdBtcPrice] = useState<string | null>(null);
  const [ttdUsdPrice, setTtdUsdPrice] = useState<string | null>(null);
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

  const toLocaleString = (val: string) =>
    parseFloat(val).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    const fetchRealtimePrice = async () => {
      const prices = await btcSatPriceInTtd();
      if (prices instanceof Error) {
        setError(prices.message);
        return;
      }
      setTtdBtcPrice(toLocaleString(prices.priceOfOneBtcInTtd));
      setUsdBtcPrice(toLocaleString(prices.priceOfOneBtcInUsd));
      setTtdUsdPrice(toLocaleString(prices.priceOfOneUsdInTtd));
    };

    fetchRealtimePrice();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Welcome, {userData?.me?.username || userData?.me?.defaultAccount.id}!</h1>
      <h2>Current price: TT${ttdBtcPrice} (US${usdBtcPrice} @ TT${ttdUsdPrice})</h2>
    </div>
  );
};

export default User;
