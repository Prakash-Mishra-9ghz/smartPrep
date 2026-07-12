import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
        // navigate after successful login if needed
    }

    if (loading) {
        return (<main><h1>Loading.....</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            value={email}
                            type='text' id='email' name='email' placeholder='Enter your email' />
                    </div>
                    <div className="input-group">
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            value={password}
                            type='password' id='password' name='password' placeholder='Enter your Password' />
                    </div>
                    <button className='button primary-button'>Login</button>
                </form>

                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login