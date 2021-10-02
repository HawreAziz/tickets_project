import React, { useState } from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import { InputElement } from '../../components';
import { useRequest } from '../../hooks/useRequest';

interface ErrorProps {
  message: string;
}

const Signin: NextPage = () => {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const { errors, doRequest } = useRequest({
      uri: '/api/users/signin',
      method: 'post', body: {
      email, password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async () => {
    await doRequest();
  }

  const formatErrors = () => {
    if(errors.length === 0){
      return null;
    }
    return (
      <div className="error__container">
        <h2>Ooops...</h2>
        <ul>
          {
            errors?.map((error: ErrorProps) => (
              <li key={error.message}>{error.message}</li>
            ))
          }
        </ul>
      </div>
    )
  }

  return (
    <>
    <div className="landing__form">
    <div className="inner_div">
      <h1>Signin</h1>
      <InputElement
        value={email}
        setValue={setEmail}
        fieldText="Email Address"
        labelText="Enter Email"
      />
      <InputElement
        value={password}
        setValue={setPassword}
        labelText="Password"
        fieldText="Enter Password"
        type="password"
      />
      {formatErrors()}
      <button
        className="btn btn-primary"
        onClick={onSubmit}
      >
        Signin
      </button>
    </div>
    </div>
    </>
  )
}

export default Signin;
