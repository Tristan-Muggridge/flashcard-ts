import { auth } from "../util/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useState } from 'react'

import styles from '../styles/Auth.module.css'

interface IProps {
    setUser: any;
}

export default function Auth({setUser}:IProps) {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    enum Operation {
        "sign-up",
        'login'
    }

    const handleSubmit = async (e: any, op: Operation=Operation.login) => {
        e.preventDefault();

        if (op === Operation["sign-up"]) {
            createUserWithEmailAndPassword(auth, email, password)
            .then( request => setUser(request.user))
            .catch( error => setError(error.message))
        }
        else {
            signInWithEmailAndPassword(auth, email, password)
            .then( request => setUser(request.user))
            .catch( error => setError(error.message))

            setPersistence(auth, browserSessionPersistence)
            .then(() => signInWithEmailAndPassword(auth, email, password))
            .catch(error => console.error(error.code, error.message))
        }        
    } 
    
    

    return <div className={styles.auth}>
        <h2>Currently Signed in as Guest User</h2>

        { error && <p style={{color: "red"}}> {error} </p> }

        <form  onSubmit={e=> handleSubmit(e)} style={{display: 'flex', flexDirection:"column", textAlign:"left"}}>
            <label htmlFor="username">email</label>
            <input type="email" name="email" id="input-email" onChange={ e=> setEmail(e.target.value) } value={email}/>
            <label htmlFor="password">password</label>
            <input type="password" autoComplete="true" name="password" id="input-password" onChange={ e=> setPassword(e.target.value) } value={password}/>
            <div>
                <button type="submit" onClick={ e => handleSubmit(e, Operation["sign-up"])}> Sign Up </button>
                <button type="submit" onClick={ e=> handleSubmit(e)}> Log In </button>
            </div>
        </form>
    </div>
}