import { auth } from "../util/firebase";

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRef, useState } from 'react'

import styles from '../styles/Auth.module.css'

interface IProps {
    setUser: any;
}

enum Operation {
    "sign-up" = "sign-up",
    'login' = "login"
}

export default function Auth({setUser}:IProps) {
    
    const usernameRef = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [mode, setMode] = useState(Operation.login);
    const [error, setError] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (mode == Operation["sign-up"] && !username) {
            setMode(Operation["sign-up"]);
            usernameRef.current?.focus();
            return;
        }

        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const passwordHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""); // convert bytes to hex string

        if (mode == Operation["sign-up"]) {
            createUserWithEmailAndPassword(auth, email, passwordHex)
            .then( request => {
                setUser({...request.user, displayName: username})
                updateProfile(request.user, {displayName: username})
            })
            .catch( error => setError(error.message))
        }
        
        else if (mode == Operation["login"]) {
            signInWithEmailAndPassword(auth, email, passwordHex)
            .then( request => setUser(request.user))
            .catch( error => setError(error.message))
        }
    } 

    onAuthStateChanged(auth, (authedUser) => {
		if (authedUser) setUser(authedUser)
	})
    
    return <div className={styles.auth}>
        <h2>Currently Signed in as Guest User</h2>

        { error && <p style={{color: "red"}}> {error} </p> }

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection:"column", textAlign:"left"}}>
            <label htmlFor="username">email</label>
            <input required type="email" name="email" id="input-email" onChange={ e=> setEmail(e.target.value) } value={email}/>
            <label htmlFor="password">password</label>
            <input required type="password" autoComplete="true" name="password" id="input-password" onChange={ e=> setPassword(e.target.value) } value={password}/>
            
            {   mode == Operation["sign-up"] && 
                <>
                    <label htmlFor="username">username</label>
                    <input type="username" ref={usernameRef} name="username" id="input-username" onChange={ e=> setUsername(e.target.value) } value={username}/>
                </>
            }

            <div>
                <button type="submit" onClick={()=>setMode(()=>Operation["sign-up"])}> Sign Up </button>
                <button type="submit" onClick={()=>setMode(()=>Operation.login)}> Log In </button>
            </div>
        </form>
    </div>
}

