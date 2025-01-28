"use client";

// hoc/withProtectedRoute.js
import { useRouter } from 'next/navigation';  // For App Router
import { useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const withProtectedRoute = (WrappedComponent, expectedRole = 'any') => {
  // This function wraps your page and adds protection logic
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You must be logged in to access this page');
        router.push('/login');  // Redirect to login if no token
        return;
      }

      try {
        const decoded = jwtDecode(token);

        if (expectedRole !== 'any' && decoded.role !== expectedRole) {
          router.push('/');  // Redirect to home if roles do not match
          return;
        }

        // You can pass the decoded role as a prop to your page component if needed
        // or perform other actions based on the role.
      } catch (err) {
        router.push('/login');  // Redirect to login if token is invalid
      }
    }, [expectedRole, router]);

    // Return the wrapped component once the redirect logic is handled
    return <WrappedComponent {...props} />;
  };
};

export default withProtectedRoute;
