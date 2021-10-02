import { NextPage } from 'next';
import buildClient from '../api';
import {color } from '@hacommon/common';

interface UserProps {
  currentUser: {
    id: string;
    email: string;
  }
}

const Landing: NextPage<UserProps>  = ({ currentUser}) => {
  const text = currentUser ? 'You are signed in' : 'You are not signed in';
  return <h1>{color.blue}</h1>
}

export const getServerSideProps = async ({ req }): Promise<{props: UserProps}> => {
  // if the request is sent on the server
  // use this url 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
  const client = buildClient(req);
  const { data } = await client.get<UserProps>('/api/users/currentuser');
  return { props: data};
}

export default Landing;
