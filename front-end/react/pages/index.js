import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import styles from '@/styles/Home.module.css'
import Layout from "./layout/layout.js"

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title> Welcome Page - Sign-In Page </title>
      </Head>
      <Link href="/Initial-Faculty-Ranking">
        <h1>INITIAL FACULTY RANKING</h1>
      </Link>
      <Link href="/TA-Allocation/allocation">
        <h1>TA ALLOCATION</h1>
      </Link>
      <Link href = "/Data-Form">
        <h1>DATA FORM</h1>
      </Link>

      <div login-div>
        <input 
          className = 'login-username-password-input' 
          type = 'text' 
          name = 'username'  
          placeholder='Username'/>

        <input 
          className = 'login-username-password-input' 
          type = 'password' name = 'password' 
          placeholder='Password'/>

        <input 
          type = 'button' 
          value = 'Log In'
          name = 'sign-in' 
          placeholder='Username'/>
      </div>

    </Layout>
  ) 
}

/* 
CREDIT: 

Next.js set-up: https://youtube.com/playlist?list=PLynWqC6VC9KOvExUuzhTFsWaxnpP_97BD

React-dnd with Next.js tutorial I followed: https://www.youtube.com/watch?v=NW8erkUgqus
*/