import React, { useState } from 'react';
import { Send, Heart, AlertCircle, CheckCircle, Users, Info } from 'lucide-react';

export default function DiscordWomenHealthApp() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('Health Community Member');
  const [category, setCategory] = useState('general');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [useProxy, setUseProxy] = useState(true);

  const categories = [
    { value: 'general', label: '💬 General Discussion', color: 'bg-blue-100' },
    { value: 'nutrition', label: '🥗 Nutrition & Diet', color: 'bg-green-100' },
    { value: 'fitness', label: '💪 Fitness & Exercise', color: 'bg-purple-100' },
    { value: 'mental', label: '🧠 Mental Health', color: 'bg-pink-100' },
    { value: 'pregnancy', label: '🤰 Pregnancy & Maternity', color: 'bg-yellow-100' },
    { value: 'menstrual', label: '🌸 Menstrual Health', color: 'bg-red-100' },
    { value: 'support', label: '💖 Support & Encouragement', color: 'bg-indigo-100' }
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

    // Validate webhook URL format
    if (!webhookUrl.includes('discord.com/api/webhooks/')) {
      setStatus({ type: 'error', message: 'Invalid webhook URL format. Please check your webhook URL.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const selectedCategory = categories.find(c => c.value === category);
      
      // Create the payload
      const payload = {
        username: username || 'Health Community Member',
        embeds: [{
          title: `${selectedCategory.label}`,
          description: message,
          color: getCategoryColor(category),
          footer: {
            text: `Posted by ${username || 'Health Community Member'}`,
          },
          timestamp: new Date().toISOString(),
        }]
      };

      console.log('Sending payload:', payload);

      // Use CORS proxy if enabled
      const finalUrl = useProxy 
        ? `https://api.allorigins.win/raw?url=${encodeURIComponent(webhookUrl)}`
        : webhookUrl;

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      console.log('Response status:', response.status);

      if (response.ok || response.status === 204) {
        setStatus({ 
          type: 'success', 
          message: '✨ Message sent successfully to your women\'s health community!' 
        });
        setMessage('');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus({ type: '', message: '' });
        }, 5000);
      } else {
        let errorMsg = `Failed to send message (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          // If can't parse error, use status text
          errorMsg = response.statusText || errorMsg;
        }
        setStatus({ 
          type: 'error', 
          message: errorMsg
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message}. Make sure your webhook URL is correct and the channel exists.` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    const colors = {
      general: 3447003,      // Blue
      nutrition: 3066993,    // Green
      fitness: 10181046,     // Purple
      mental: 15418782,      // Pink
      pregnancy: 16776960,   // Yellow
      menstrual: 15548997,   // Red
      support: 5793266       // Indigo
    };
    return colors[cat] || 3447003;
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

      const finalUrl = useProxy 
        ? `https://corsproxy.io/?${encodeURIComponent(webhookUrl)}`
        : webhookUrl;

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      if (response.ok || response.status === 204) {
        setStatus({ type: 'success', message: '✨ Quick message sent successfully!' });
        setTimeout(() => {
          setStatus({ type: '', message: '' });
        }, 3000);
      } else {
        setStatus({ type: 'error', message: `Failed to send (Status: ${response.status})` });
      }
    } catch (error) {
      console.error('Error:', error);
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
      const finalUrl = useProxy 
        ? `https://corsproxy.io/?${encodeURIComponent(webhookUrl)}`
        : webhookUrl;

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: '✅ Test message from Women\'s Health Community App - Connection successful!'
        }),
        mode: 'cors'
      });

      if (response.ok || response.status === 204) {
        setStatus({ 
          type: 'success', 
          message: '✅ Connection successful! Check your Discord channel for the test message.' 
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: `Connection failed (Status: ${response.status}). Please verify your webhook URL.` 
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Connection failed: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-pink-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              Women's Health Community
            </h1>
          </div>
          <p className="text-center text-gray-600">
            Share your health journey, get support, and connect with others
          </p>
        </div>

        {/* Webhook Setup */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Discord Setup</h2>
          </div>
          
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discord Webhook URL
          </label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://discord.com/api/webhooks/1234567890/abcdefghijklmnop"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
          />
          
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors disabled:opacity-50 mb-3"
          >
            🔗 Test Connection
          </button>

          <div className="flex items-center justify-between mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useProxy"
                checked={useProxy}
                onChange={(e) => setUseProxy(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="useProxy" className="ml-2 text-sm font-medium text-yellow-800">
                Use CORS Proxy (Required in Claude.ai)
              </label>
            </div>
            <Info className="w-5 h-5 text-yellow-600" />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">How to get your webhook URL:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Open Discord and go to your server</li>
                  <li>Click Server Settings → Integrations</li>
                  <li>Click "Webhooks" → "New Webhook"</li>
                  <li>Name it and select your channel</li>
                  <li>Click "Copy Webhook URL"</li>
                  <li>Paste it above and click "Test Connection"</li>
                </ol>
              </div>
            </div>
          </div>

          {useProxy && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-3">
              <p className="text-xs text-yellow-800">
                ⚠️ <strong>Privacy Note:</strong> CORS proxy routes your webhook through a third-party service (allorigins.win). 
                For production use, download this code and run it on your own server without the proxy.
              </p>
            </div>
          )}
        </div>

        {/* Main Message Composer */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="How should we call you?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      category === cat.value
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, questions, or experiences..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length} characters
              </p>
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={sendToDiscord}
              disabled={isLoading || !webhookUrl || !message}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center ${
                isLoading || !webhookUrl || !message
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send to Community
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Messages */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Support Messages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => sendQuickMessage("💪 Stay strong! You've got this!")}
              disabled={isLoading || !webhookUrl}
              className="p-3 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-medium text-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💪 Send Encouragement
            </button>
            <button
              onClick={() => sendQuickMessage("🤗 Sending virtual hugs and support!")}
              disabled={isLoading || !webhookUrl}
              className="p-3 bg-pink-100 hover:bg-pink-200 rounded-lg text-sm font-medium text-pink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🤗 Send Virtual Hug
            </button>
            <button
              onClick={() => sendQuickMessage("✨ Remember to take care of yourself today!")}
              disabled={isLoading || !webhookUrl}
              className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg text-sm font-medium text-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Self-Care Reminder
            </button>
            <button
              onClick={() => sendQuickMessage("🌸 You are not alone in this journey!")}
              disabled={isLoading || !webhookUrl}
              className="p-3 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-sm font-medium text-yellow-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🌸 Solidarity Message
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {status.message && (
          <div
            className={`rounded-xl p-4 flex items-start mb-6 ${
              status.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                status.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {status.message}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>💜 Built with care for women's health communities</p>
          <p className="mt-2">
            Remember: This is a supportive space. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}