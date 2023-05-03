import React, { useState } from 'react';
import firebase from '../utils/firebase';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from './layout/layout.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = (event) => {
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        router.push('/home');
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };

  return (
    <Layout>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="login-container">
        <div className="login-contents">
          <h1 id="login-title">TA ALLOCATION</h1>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="login-buttons-container">
              <button type="submit" className="DF-CD-Button" id="login-buttons">
                LOGIN
              </button>
              <button className="DF-CD-Button" id="login-buttons">
                REGISTER
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
