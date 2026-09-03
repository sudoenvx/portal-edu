import React from 'react';

interface ProtectedLayoutProps {
  allowed_roles?: ('admin' | 'user')[]
  children: React.ReactNode
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return <>{children}</>;
  
  // const { user, isLoading } = useAuth()
  // const location = useLocation()
  
  // if (isLoading) {
  //   return (
  //     <div className='h-screen w-screen flex justify-center items-center'>
  //       <div className="flex flex-col items-center gap-3">
  //       </div>
  //     </div>
  //   );
  // }

  // if(!user) {
  //   return <Navigate to={`/login?redirect=${location.pathname}`} />
  // }

  // if(allowed_roles && !allowed_roles.includes(user.role as 'admin' | 'user')) {
  //   return <Navigate to={`/unauthorized?redirect=${location.pathname}`} />
  // }

  // return <>{children}</>;
};
