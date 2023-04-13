import Head from 'next/head'
import Link from "next/link"
import Layout from "./layout/layout.js"

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>Welcome Page - Sign-In Page</title>
      </Head>
      
      <Link href="/Initial-Faculty-Ranking">
        <h1>INITIAL FACULTY RANKING</h1>
      </Link>
      <Link href="/TA-Allocation/allocation">
        <h1>TA ALLOCATION</h1>
      </Link>
    </Layout>
  )
}

/* 
CREDIT: 

Next.js set-up: https://youtube.com/playlist?list=PLynWqC6VC9KOvExUuzhTFsWaxnpP_97BD

React-dnd with Next.js tutorial I followed: https://www.youtube.com/watch?v=NW8erkUgqus
*/