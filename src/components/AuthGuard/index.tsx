import { FunctionComponent, Fragment, useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { useRouter } from 'next/router';
import { Spin } from '@douyinfe/semi-ui';
import { userTokenQuery } from '@/store';

export type AuthGuardProps = {};

export const AuthGuard: FunctionComponent<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const userLoadable = useRecoilValueLoadable(userTokenQuery);

  useEffect(() => {
    if (userLoadable.state !== 'loading') {
      // auth is loaded and there is no token
      if (userLoadable.state !== 'hasValue') {
        // remember the page that user tried to access
        router.replace('/login').then();
      }
    }
  }, [userLoadable.state, router]);

  switch (userLoadable.state) {
    case 'loading':
      return (
        <div className="h-screen w-screen flex justify-center items-center">
          <Spin size="large" />
        </div>
      );
    case 'hasValue':
      return <Fragment key="AuthGuard">{children}</Fragment>;
    case 'hasError':
    default:
      return null;
  }
};
