import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const MessagesInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (error) {
      toast.error('Error updating message');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Error deleting message');
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inbox ({messages.filter(m=>!m.isRead).length} unread)</h2>
      </div>

      <div className="glassmorphism rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">Date</th>
              <th className="p-4 font-semibold text-sm">Sender</th>
              <th className="p-4 font-semibold text-sm">Subject / Message</th>
              <th className="p-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-400">No messages found.</td></tr>
            ) : (
              messages.map(msg => (
                <tr key={msg._id} className={`border-b border-white/5 hover:bg-white/5 ${!msg.isRead ? 'bg-indigo-500/10' : ''}`}>
                  <td className="p-4">
                    {!msg.isRead ? <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span> : <span className="text-gray-500 text-xs">Read</span>}
                  </td>
                  <td className="p-4 text-sm text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="font-medium">{msg.name}</div>
                    <div className="text-xs text-gray-400">{msg.email}</div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="font-medium truncate">{msg.subject}</div>
                    <div className="text-sm text-gray-400 truncate">{msg.message}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!msg.isRead && (
                        <button onClick={() => markAsRead(msg._id)} className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded hover:bg-indigo-500/40 transition">
                          Mark Read
                        </button>
                      )}
                      <button onClick={() => deleteMessage(msg._id)} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/40 transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesInbox;
