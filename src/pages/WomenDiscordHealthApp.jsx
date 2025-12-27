import React, { useState } from 'react';
import { Send, Heart, AlertCircle, CheckCircle, Users, Info, Zap } from 'lucide-react';
import '../styles/womenhealthdscord.css';

export default function WomenDiscordHealthApp() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('Health Community Member');
  const [category, setCategory] = useState('general');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [useProxy, setUseProxy] = useState(true);

  const categories = [
    { value: 'general', label: '💬 General Discussion', color: 3447003 },
    { value: 'nutrition', label: '🥗 Nutrition & Diet', color: 3066993 },
    { value: 'fitness', label: '💪 Fitness & Exercise', color: 10181046 },
    { value: 'mental', label: '🧠 Mental Health', color: 15418782 },
    { value: 'pregnancy', label: '🤰 Pregnancy & Maternity', color: 16776960 },
    { value: 'menstrual', label: '🌸 Menstrual Health', color: 15548997 },
    { value: 'support', label: '💖 Support & Encouragement', color: 5793266 }
  ];

  const quickMessages = [
    { text: "💪 Stay strong! You've got this!", icon: '💪', label: 'Encouragement' },
    { text: "🤗 Sending virtual hugs and support!", icon: '🤗', label: 'Virtual Hug' },
    { text: "✨ Remember to take care of yourself today!", icon: '✨', label: 'Self-Care' },
    { text: "🌸 You are not alone in this journey!", icon: '🌸', label: 'Solidarity' }
  ];

  const sendToDiscord = async () => {
    if (!webhookUrl.trim()) {
      setStatus({ type: 'error', message: 'Please enter your Discord webhook URL' });
      return;
    }

    if (!message.trim()) {
      setStatus({ type: 'error', message: 'Please enter a message to send' });
      return;
    }

    if (!webhookUrl.includes('discord.com/api/webhooks/')) {
      setStatus({ type: 'error', message: 'Invalid webhook URL format. Please check your webhook URL.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const selectedCategory = categories.find(c => c.value === category);
      
      const payload = {
        username: username || 'Health Community Member',
        embeds: [{
          title: `${selectedCategory.label}`,
          description: message,
          color: selectedCategory.color,
          footer: {
            text: `Posted by ${username || 'Health Community Member'}`,
          },
          timestamp: new Date().toISOString(),
        }]
      };

      console.log('Sending to Discord:', payload);

      let response;
      if (useProxy) {
        // Using CORS proxy
        response = await fetch(`https://corsproxy.io/?${encodeURIComponent(webhookUrl)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Direct connection
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      console.log('Response status:', response.status);

      if (response.ok || response.status === 204) {
        setStatus({ 
          type: 'success', 
          message: '✨ Message sent successfully to your women\'s health community!' 
        });
        setMessage('');
        setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setStatus({ 
          type: 'error', 
          message: `Failed to send message (Status: ${response.status}). ${errorText}` 
        });
      }
    } catch (error) {
      console.error('Send error:', error);
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message}. Make sure your webhook URL is correct.` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuickMessage = async (quickMsg) => {
    if (!webhookUrl.trim()) {
      setStatus({ type: 'error', message: 'Please enter your Discord webhook URL first' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = {
        username: 'Health Bot',
        content: quickMsg,
      };

      console.log('Sending quick message:', payload);

      let response;
      if (useProxy) {
        response = await fetch(`https://corsproxy.io/?${encodeURIComponent(webhookUrl)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      console.log('Quick message response:', response.status);

      if (response.ok || response.status === 204) {
        setStatus({ type: 'success', message: '✨ Quick message sent!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } else {
        const errorText = await response.text();
        console.error('Quick message error:', errorText);
        setStatus({ type: 'error', message: `Failed to send (Status: ${response.status})` });
      }
    } catch (error) {
      console.error('Quick message error:', error);
      setStatus({ type: 'error', message: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    if (!webhookUrl.trim()) {
      setStatus({ type: 'error', message: 'Please enter your Discord webhook URL first' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const payload = {
        content: '✅ Test message from Women\'s Health Community App - Connection successful!'
      };

      console.log('Testing connection to:', webhookUrl);

      let response;
      if (useProxy) {
        response = await fetch(`https://corsproxy.io/?${encodeURIComponent(webhookUrl)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      console.log('Test response:', response.status);

      if (response.ok || response.status === 204) {
        setStatus({ 
          type: 'success', 
          message: '✅ Connection successful! Check your Discord channel for the test message.' 
        });
      } else {
        const errorText = await response.text();
        console.error('Test error:', errorText);
        setStatus({ 
          type: 'error', 
          message: `Connection failed (Status: ${response.status}). Please verify your webhook URL.` 
        });
      }
    } catch (error) {
      console.error('Test connection error:', error);
      setStatus({ 
        type: 'error', 
        message: `Connection failed: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="discord-app-container">
      <div className="discord-app-wrapper">
        
        {/* Header */}
        <div className="hero-card">
          <div className="hero-header">
            <div className="hero-logo">
              <Heart size={26} color="white" fill="white" />
            </div>
            <div className="hero-text">
              <h1>Women's Health Community</h1>
              <p>Share your health journey, get support, and connect with others</p>
            </div>
          </div>
          
          <div className="hero-badges">
            <span className="hero-badge">
              <span className="status-dot"></span>
              Secure & Private
            </span>
            <span className="hero-badge">💜 Safe Space</span>
            <span className="hero-badge">🤝 Community Support</span>
          </div>
        </div>

        {/* Webhook Setup */}
        <div className="section-card">
          <div className="section-header">
            <Users size={24} className="section-icon" />
            <h2>Discord Connection</h2>
          </div>
          
          <div className="form-field">
            <label className="form-label">Discord Webhook URL</label>
            <input
              type="text"
              className="form-input"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>

          <button
            className="btn btn-test"
            onClick={testConnection}
            disabled={isLoading}
          >
            <Zap size={16} />
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>

          <div className="proxy-toggle">
            <div className="proxy-toggle-header">
              <input
                type="checkbox"
                id="useProxy"
                className="proxy-checkbox"
                checked={useProxy}
                onChange={(e) => setUseProxy(e.target.checked)}
              />
              <label htmlFor="useProxy" className="proxy-label">
                Use CORS Proxy (Required in Claude.ai)
              </label>
            </div>
            {useProxy && (
              <p className="proxy-note">
                ⚠️ Routes through allorigins.win for compatibility
              </p>
            )}
          </div>

          <div className="info-box">
            <div className="info-box-content">
              <Info size={16} className="info-icon" />
              <div>
                <p className="info-title">Setup Guide:</p>
                <ol className="info-list">
                  <li>Open Discord → Server Settings</li>
                  <li>Go to Integrations → Webhooks</li>
                  <li>Create New Webhook</li>
                  <li>Copy Webhook URL and paste above</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Message Composer */}
        <div className="section-card">
          <h3 className="section-header">Compose Message</h3>

          <div className="form-field">
            <label className="form-label">Your Name (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="How should we call you?"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Topic Category</label>
            <div className="category-grid">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`category-button ${category === cat.value ? 'active' : ''}`}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Your Message</label>
            <textarea
              className="form-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts, questions, or experiences..."
            />
            <p className="char-count">{message.length} characters</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={sendToDiscord}
            disabled={isLoading || !webhookUrl || !message}
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send to Community
              </>
            )}
          </button>
        </div>

        {/* Quick Messages */}
        <div className="section-card">
          <h3 className="section-header">Quick Support Messages</h3>
          <div className="quick-messages-grid">
            {quickMessages.map((qm, idx) => (
              <button
                key={idx}
                className="quick-message-button"
                onClick={() => sendQuickMessage(qm.text)}
                disabled={isLoading || !webhookUrl}
              >
                <span className="quick-message-icon">{qm.icon}</span>
                {qm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.type === 'success' ? (
              <CheckCircle size={20} className="status-icon success" />
            ) : (
              <AlertCircle size={20} className="status-icon error" />
            )}
            <p className={`status-text ${status.type}`}>
              {status.message}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="app-footer">
          <p className="footer-text">
            💜 Built with care for women's health communities
          </p>
          <p className="footer-note">
            Remember: This is a supportive space. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}