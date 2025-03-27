import { Navigate } from 'react-router-dom';

export const withAuth = (Component: React.ComponentType) => {
  return (props: any) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };
}; 