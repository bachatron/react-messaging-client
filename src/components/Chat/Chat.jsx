import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import useConversations from '../../hooks/useConversations'
import useMessages from '../../hooks/useMessages'
import ConversationList from './ConversationList'
import MessageThread from './MessageThread'
import MessageInput from './MessageInput'
import styles from './Chat.module.css'
import Profile from '../Profile/Profile'

function getInitials(username) {
  return username?.slice(0, 2).toUpperCase() || '??'
}

export default function Chat() {
  const { logout, currentUser } = useAuth()
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const { conversations, setConversations, startConversation } = useConversations()
  const { messages, loading, sendMessage } = useMessages(selectedConversationId)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showProfile, setShowProfile] = useState(false)

  const handleSelectUser = async (user, existingConversationId = null) => {
    setSelectedUser(user)
    setShowProfile(false) // close profile when selecting a conversation
    if (existingConversationId) {
      setSelectedConversationId(existingConversationId)
      return
    }
    const conversation = await startConversation(user.id)
    setSelectedConversationId(conversation.id)
  }

  const handleSend = async (body, image) => {
    const message = await sendMessage(body, image)
    setConversations(prev => prev.map(c =>
      c.id === selectedConversationId ? { ...c, last_message: message.body } : c
    ))
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p className={styles.sidebarTitle}>Messages</p>
          <ConversationList
            conversations={conversations}
            onSelect={handleSelectUser}
            selectedId={selectedConversationId}
          />
        </div>
        <div className={styles.sidebarFooter} onClick={() => setShowProfile(p => !p)} style={{ cursor: 'pointer' }}>
          <div className={styles.avatar}>{getInitials(currentUser.username)}</div>
          <span className={styles.username}>{currentUser.username}</span>
          <button className={styles.logoutBtn} onClick={(e) => { e.stopPropagation(); logout(); }}>Logout</button>
        </div>
      </div>

      <div className={styles.main}>
        {showProfile ? (
          <Profile onClose={() => setShowProfile(false)} />
        ) : selectedConversationId ? (
          <>
            <MessageThread messages={messages} loading={loading} selectedUser={selectedUser} />
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <div className={styles.empty}>
            Select a conversation or search for a user
          </div>
        )}
      </div>
    </div>
  )
}