import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Auth.module.css'

export default function Register() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    username: '', email: '', password: '', password_confirmation: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await signup(form.email, form.password, form.password_confirmation, form.username)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Something went wrong')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Start messaging today</p>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input className={styles.input} name='username' onChange={handleChange} value={form.username} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} name='email' type='email' onChange={handleChange} value={form.email} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} name='password' type='password' onChange={handleChange} value={form.password} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm password</label>
            <input className={styles.input} name='password_confirmation' type='password' onChange={handleChange} value={form.password_confirmation} />
          </div>
          <button className={styles.submitBtn} type='submit'>Sign up</button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link className={styles.link} to='/login'>Log in</Link>
        </p>
      </div>
    </div>
  )
}