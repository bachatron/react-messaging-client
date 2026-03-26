import { useState } from 'react'
import api from '../../services/api'
import styles from './ConversationList.module.css'

function getInitials(username) {
  return username?.slice(0, 2).toUpperCase() || '??'
}

export default function ConversationList({ conversations, onSelect, selectedId }) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (e) => {
    const value = e.target.value
    setSearch(value)
    if (value.trim() === '') return setResults([])
    const res = await api.get(`/api/users?search=${value}`)
    setResults(res.data)
  }

  return (
    <div>
      <input
        className={styles.search}
        placeholder='Search users...'
        value={search}
        onChange={handleSearch}
      />

      {results.length > 0 && (
        <ul className={styles.list}>
          {results.map(user => {
            const existing = conversations.find(c => c.other_user.id === user.id)
            return (
              <li key={user.id} className={styles.item}>
                <span>{user.username}</span>
                <button
                  className={styles.messageBtn}
                  onClick={() => {
                    if (existing) {
                      onSelect(user, existing.id)
                    } else {
                      onSelect(user)
                    }
                    setSearch('')
                    setResults([])
                  }}
                >
                  {existing ? 'Open' : 'Message'}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {conversations.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No conversations yet</p>
          <p className={styles.emptySubtitle}>Search for a user above to start chatting</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {conversations.map(c => (
            <li
              key={c.id}
              className={`${styles.item} ${selectedId === c.id ? styles.itemActive : ''}`}
              onClick={() => onSelect(c.other_user, c.id)}
            >
              <div className={styles.itemAvatar}>
                {c.other_user.avatar_url
                  ? <img src={c.other_user.avatar_url} alt='' className={styles.itemAvatarImg} />
                  : c.other_user.username?.slice(0, 2).toUpperCase()
                }
              </div>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{c.other_user.username}</p>
                {c.last_message && <p className={styles.itemLast}>{c.last_message}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}