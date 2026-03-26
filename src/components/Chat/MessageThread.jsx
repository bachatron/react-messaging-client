import { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './MessageThread.module.css'

export default function MessageThread({ messages, loading, selectedUser }) {
  const { currentUser } = useAuth()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) return <div className={styles.thread}>Loading...</div>

  return (
    <>
      {selectedUser && (
        <div className={styles.header}>
          <div className={styles.headerAvatar}>
            {selectedUser.avatar_url
              ? <img src={selectedUser.avatar_url} alt='' className={styles.headerAvatarImg} />
              : selectedUser.username?.slice(0, 2).toUpperCase()
            }
          </div>
          <span className={styles.headerName}>{selectedUser.username}</span>
        </div>
      )}
      <div className={styles.thread}>
        {messages.map(m => {
          const isOwn = m.user_id === currentUser.id
          return (
            <div
              key={m.id}
              className={`${styles.messageWrapper} ${isOwn ? styles.messageWrapperOwn : styles.messageWrapperOther}`}
            >
              <div className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}>
                {m.body}
                {m.image_url && <img className={styles.image} src={m.image_url} alt='attachment' />}
              </div>
              <span className={styles.time}>
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </>
  )
}