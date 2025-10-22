import React, { useEffect, useState } from 'react'
import { Mail, Eye, Reply, CheckCircle, X, Loader2, Trash2 } from 'lucide-react'
import { messagesAPI } from '../../utils/api'
import { toast } from 'react-hot-toast'

const MessagesManager = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const loadMessages = async () => {
    try {
      const res = await messagesAPI.getAll()
      setMessages(res.data)
    } catch (err) {
      console.error('Error fetching messages', err)
      toast.error('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const markRead = async (id, read = true) => {
    try {
      await messagesAPI.markRead(id, { read })
      setMessages((prev) => prev.map(m => m.id === id ? { ...m, read } : m))
      toast.success(read ? 'Marked as read' : 'Marked as unread')
    } catch (err) {
      console.error('Error marking read', err)
      toast.error('Failed to update read status')
    }
  }

  const openReply = (message) => {
    setReplyingTo(message)
    setReplyText('')
  }

  const sendReply = async () => {
    if (!replyingTo) return
    setSending(true)
    try {
      await messagesAPI.reply(replyingTo.id, { reply: replyText })
      setMessages((prev) => prev.map(m => m.id === replyingTo.id ? { ...m, replied: true } : m))
      toast.success('Reply sent')
      setReplyingTo(null)
      setReplyText('')
    } catch (err) {
      console.error('Error sending reply', err)
      toast.error('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    try {
      await messagesAPI.delete(id)
      setMessages((prev) => prev.filter(m => m.id !== id))
      toast.success('Message deleted')
    } catch (err) {
      console.error('Error deleting message', err)
      toast.error('Failed to delete message')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Mail size={22} className="text-accent-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <p className="text-gray-400 text-sm">View and manage contact form submissions</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No messages yet.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${m.read ? 'bg-gray-700 text-gray-300' : 'bg-yellow-600/30 text-yellow-400'}`}>{m.read ? 'Read' : 'Unread'}</span>
                    {m.replied && <span className="text-xs px-2 py-1 rounded-full bg-green-600/30 text-green-400">Replied</span>}
                    <span className="text-sm text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="text-white font-semibold truncate">{m.subject || 'No Subject'}</h3>
                  <p className="text-gray-400 text-sm truncate">From: {m.name} &lt;{m.email}&gt;</p>
                  <div className="mt-3 text-gray-300 whitespace-pre-line">{m.content}</div>
                </div>
                <div className="flex-shrink-0 ml-4 flex flex-col gap-2">
                  <button onClick={() => markRead(m.id, !m.read)} className="btn-secondary">
                    <CheckCircle size={16} className="mr-2" /> {m.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button onClick={() => openReply(m)} className="btn-primary">
                    <Reply size={16} className="mr-2" /> Reply
                  </button>
                  <button
                    onClick={() => deleteMessage(m.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                    aria-label="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Reply to {replyingTo.name}</h3>
              <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-400">To: {replyingTo.email}</div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                placeholder="Type your reply..."
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setReplyingTo(null)} className="btn-secondary">Cancel</button>
                <button onClick={sendReply} disabled={sending || !replyText.trim()} className="btn-primary flex items-center">
                  {sending ? (<><Loader2 size={16} className="mr-2 animate-spin" /> Sending...</>) : (<><Reply size={16} className="mr-2" /> Send Reply</>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesManager