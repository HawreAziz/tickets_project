import React, { useState } from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import { InputElement } from '../../components';
import { useRequest } from '../../hooks/useRequest';

interface ErrorProps {
  message: string;
}

const SignUp: NextPage = () => {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const { errors, doRequest } = useRequest({
      uri: '/api/users/signup',
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
      <h1>Sign Up</h1>
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
        Sign up
      </button>
    </div>
    </div>
    </>
  )
}

export default SignUp;
