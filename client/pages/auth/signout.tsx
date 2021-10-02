import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRequest } from './../../hooks/useRequest';
import Router from 'next/router';


const SignOut: NextPage = () => {
  const { doRequest } = useRequest({
      uri: "/api/users/signout",
      method: 'post',
      onSuccess: () => Router.push('/')
  });
  useEffect(() => {
    doRequest();
  }, [])
  return <div>Signing user out...</div>;
}


export default SignOut;
