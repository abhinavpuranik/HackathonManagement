'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import './success.module.css';
const SuccessPage = () => {
  const searchParams = useSearchParams();
  console.log(searchParams);
  const paramsObject = {};

  // Convert search parameters to JSON object
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  // Convert the JSON object to a JSON string if needed
  const jsonParams = JSON.stringify(paramsObject);
  console.log(paramsObject);
  const session_id = searchParams.get('session_id');
  useEffect(() => {
    const handleSuccess = async () => {
      if (session_id) {
          const response = await fetch('/api/payment-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paramsObject),
          });
                const data = await response.json();
          if (response.ok) {
            console.log('Payment recorded successfully:', data);
          } else {
            console.error('Error recording payment:', data);
          }
      }
    };

    handleSuccess();
  }, [session_id]);

  return (
    <div className="success-page">
      <h1>Registration Successful</h1>
      <p>Your registration has been successfully completed.</p>
    </div>
  );
};

export default SuccessPage;