import { useState } from 'react'
import styles from './MessageInput.module.css'

export default function MessageInput({ onSend }) {
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!body.trim() && !image) return
    await onSend(body, image)
    setBody('')
    setImage(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={body}
        onChange={e => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Type a message...'
      />
      <label className={styles.fileLabel}>
        📎
        <input
          className={styles.fileInput}
          type='file'
          accept='image/*'
          onChange={e => {
            setImage(e.target.files[0])
            e.target.value = ''
          }}
        />
      </label>
      {image && <span className={styles.preview}>{image.name}</span>}
      <button
        className={styles.sendBtn}
        type='submit'
        disabled={!body.trim() && !image}
      >
        Send
      </button>
    </form>
  )
}