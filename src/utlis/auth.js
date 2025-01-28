// utils/checkRoleAndRedirect.js
import { useRouter } from 'next/navigation';  // For App Router
import {jwtDecode} from 'jwt-decode';

export const getRole = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (err) {
    return null;
  }
}

export const checkRoleAndRedirect = (expectedRole) => {
  const router = useRouter();
  const token = localStorage.getItem('token');

  // If no token, redirect to login
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    // Decode the token to get the payload (which includes the role)
    const decoded = jwtDecode(token);
    // If the role doesn't match the expected role, redirect to the home page (or any other page)
    if (decoded.role !== expectedRole) {
      router.push('/');
      return;
    }

    return decoded.role;
  } catch (err) {
    // If token is invalid or expired, redirect to login
    router.push('/login');
    return;
  }
};
