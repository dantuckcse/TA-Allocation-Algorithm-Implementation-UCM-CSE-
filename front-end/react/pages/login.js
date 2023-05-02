import Head from 'next/head'
import Layout from "./layout/layout.js"
import React, { useEffect, useState } from "react";
import { url } from "../components/url.js";

export default function login(){

    return(
        <Layout>
            <div className='login-container'>
                <div className='login-contents'>
                    <h1 id = 'login-title'>TA ALLOCATION</h1>
                    <div className='login-buttons-container'>
                        <button className="DF-CD-Button" id = 'login-buttons'>LOGIN</button>
                        <button className="DF-CD-Button" id = 'login-buttons'>REGISTER</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}