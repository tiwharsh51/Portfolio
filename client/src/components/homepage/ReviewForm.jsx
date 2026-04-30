import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ReviewForm = ({ onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    email: '',
    comment: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState(localStorage.getItem('reviewer_email') || '');
  const [googleUser, setGoogleUser] = useState(null);

  useEffect(() => {
    /* global google */
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleGoogleResponse,
        auto_select: true
      });
      google.accounts.id.prompt();
    }
  }, []);

  const handleGoogleResponse = (response) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      setGoogleUser({ name: payload.name, email: payload.email, photo: payload.picture });
      localStorage.setItem('reviewer_email', payload.email);
    } catch (e) { console.error("Identity error"); }
  };

  const extractNameFromEmail = (email) => {
    if (!email || !email.includes('@')) return '';
    return email.split('@')[0].split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const submitReview = async (rating = formData.rating) => {
    const targetEmail = googleUser?.email || formData.email || lastEmail;
    
    if (!targetEmail) return toast.error('Email artifact required');
    if (!isValidEmail(targetEmail)) return toast.error('Please enter a valid email');
    
    setLoading(true);
    try {
      const isGuest = !targetEmail;
      const guestId = Math.floor(1000 + Math.random() * 9000);
      const resolvedName = googleUser?.name || (isGuest ? `Guest Node #${guestId}` : extractNameFromEmail(targetEmail));
      const avatarUrl = googleUser?.photo || (isGuest 
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${guestId}&backgroundColor=0f172a`
        : `https://www.gravatar.com/avatar/${targetEmail.length}?d=identicon&s=200`);
      
      const { data } = await api.post('/testimonials/public', {
        name: resolvedName,
        email: targetEmail,
        comment: formData.comment || 'System Note: Zero-Friction Rating',
        rating: rating,
        photoUrl: avatarUrl,
        role: googleUser ? 'Google Verified' : 'External Node',
        company: googleUser ? 'Google Ecosystem' : 'Community Member'
      });
      
      if (data.success) {
        if (targetEmail) localStorage.setItem('reviewer_email', targetEmail);
        toast.success('Feedback Synchronized!');
        setFormData(prev => ({ ...prev, comment: '' }));
        if (onReviewSubmitted) onReviewSubmitted();
      }
    } catch (error) {
      toast.error('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 border-t border-white/5 pt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded">
          <div className="flex-shrink-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Feedback Form</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow w-full">
            <input 
              type="email" 
              value={googleUser?.email || formData.email || lastEmail}
              readOnly={!!googleUser}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-[11px] text-white outline-none focus:border-primary transition-colors font-medium placeholder:text-gray-600"
              placeholder="Email Artifact..."
            />
            <input 
              type="text" 
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-[11px] text-white outline-none focus:border-primary transition-colors font-medium placeholder:text-gray-600"
              placeholder="Write Feedback..."
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => submitReview(star)}
                onMouseEnter={() => setFormData(prev => ({...prev, rating: star}))}
                className={`text-2xl transition-all hover:scale-125 ${formData.rating >= star ? 'text-primary' : 'text-white/10'}`}
              >
                ★
              </button>
            ))}
          </div>

          <button 
            onClick={() => submitReview()}
            disabled={loading}
            className="flex-shrink-0 bg-primary hover:bg-blue-700 text-[9px] font-black uppercase tracking-[0.2em] text-white px-6 py-3 rounded transition-all disabled:opacity-50"
          >
            {loading ? 'SYNCING...' : 'TRANSMIT'}
          </button>
        </div>
        <p className="text-center text-[7px] text-gray-700 uppercase tracking-[0.3em] mt-4 font-bold">
          Enter email and feedback, then click a star or 'Transmit' to publish instantly.
        </p>
      </div>
    </div>
  );
};

export default ReviewForm;
