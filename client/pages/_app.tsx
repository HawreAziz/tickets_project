import "bootstrap/dist/css/bootstrap.css";
import './index.css';
import type { AppProps, AppContext } from 'next/app';
import { Header } from '../components';
import "../components/Header.css";
import buildClient from '../api';
import "./auth/Signup.css";


interface ComponentProps extends AppProps {
  currentUser: {
    id: string;
    email: string;
  }
}


const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  )
}

AppComponent.getInitialProps = async (appContext: AppContext): Promise<ComponentProps> => {
  const { req }   = appContext.ctx;
  const client = buildClient(req);
  const { data } = await client.get<ComponentProps>('/api/users/currentuser');
  let pageProps = {}
  if(appContext.Component.getInitialProps){
    pageProps = appContext.Component.getInitialProps(appContext.ctx);
  }
  return data
}

export default AppComponent;
