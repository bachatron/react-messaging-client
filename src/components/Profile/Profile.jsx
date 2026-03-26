import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import styles from './Profile.module.css'

export default function Profile({ onClose }) {
  const { currentUser, setCurrentUser } = useAuth()
  const [username, setUsername] = useState(currentUser.username || '')
  const [bio, setBio] = useState(currentUser.bio || '')
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(currentUser.avatar_url || null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('bio', bio)
      if (avatar) formData.append('avatar', avatar)

      const res = await api.patch(`/api/users/${currentUser.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setCurrentUser(res.data)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onClose}>← Back</button>
        <h2 className={styles.title}>Edit Profile</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            {preview
              ? <img src={preview} alt='avatar' className={styles.avatarImg} />
              : <span>{username?.slice(0, 2).toUpperCase()}</span>
            }
          </div>
          <label className={styles.avatarLabel}>
            Change photo
            <input
              type='file'
              accept='image/*'
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Fields */}
        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <input
            className={styles.input}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Bio</label>
          <textarea
            className={styles.textarea}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder='Tell something about yourself...'
            rows={3}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Profile updated!</p>}

        <button className={styles.saveBtn} type='submit' disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}