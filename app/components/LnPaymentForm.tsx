'use client';

import { useState } from 'react';

const PaymentForm = () => {
  const [paymentRequest, setPaymentRequest] = useState('');
  const [memo, setMemo] = useState('');
  const [walletId, setWalletId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pay-via-ln', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentRequest,
          memo,
          walletId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit payment');
      }

      if (data.errors[0]) {
        console.log('Payment errored:', data);
        alert(`Payment errored! ${data.errors[0].message}`);
      } else {
        console.log('Payment successful:', data);
        alert('Payment submitted successfully!');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pay Via LN</h2>
      <form onSubmit={handlePaymentSubmit}>
        <div>
          <label htmlFor="paymentRequest">Payment Request:</label>
          <input
            id="paymentRequest"
            type="text"
            value={paymentRequest}
            onChange={(e) => setPaymentRequest(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="memo">Memo:</label>
          <input
            id="memo"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="walletId">Wallet ID:</label>
          <input
            id="walletId"
            type="text"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
