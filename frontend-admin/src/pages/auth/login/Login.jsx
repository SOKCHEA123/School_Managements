import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../../services/api';

const Login = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      if (response.data?.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        navigate('/dashboard');
      } else {
        setError('Login failed: Token not received');
      }
    } catch (err) {
      const data = err.response?.data;
      let errorMessage = data?.message || data?.detail || 'Invalid email or password';

      if (data?.errors) {
        const firstErrorKey = Object.keys(data.errors)[0];
        if (firstErrorKey && Array.isArray(data.errors[firstErrorKey])) {
          errorMessage = data.errors[firstErrorKey][0];
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-4 relative">
      
      {/* Main Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 pt-14 relative transition-all duration-300">
        
        {/* ✅ ប៊ូតុងប្តូរភាសា បានផ្លាស់មកក្នុង Card នេះហើយ (ជ្រុងខាងស្តាំខាងលើ) */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'km' : 'en')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 cursor-pointer transition active:scale-95"
            title={i18n.language === 'en' ? 'ប្តូរទៅភាសាខ្មែរ' : 'Switch to English'}
          >
            <img
              src={i18n.language === 'en' ? 'https://flagcdn.com/w40/us.png' : 'https://flagcdn.com/w40/kh.png'}
              alt="Language"
              className="w-5 h-auto rounded-xs shadow-xs"
            />
            <span className="text-xs font-semibold text-slate-700">
              {i18n.language === 'en' ? 'English' : 'ភាសាខ្មែរ'}
            </span>
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <img
              src={`${process.env.PUBLIC_URL || ''}/Logo.png`}
              alt="Hun Sen Snoul High School"
              className="w-24 h-24 object-contain drop-shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/Logo.png';
              }}
            />
          </div>
         
          <h1 className="text-xl sm:text-2xl font-bold text-primary mt-4 tracking-wide leading-relaxed drop-shadow-sm">
            {t('school_name')}
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-6 text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {t('email_or_username')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hunsensnoul.edu.kh"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {t('password')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />

              {/* ប៊ូតុងភ្នែក (Show/Hide Password) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-500 focus:outline-none transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('verifying')}
              </span>
            ) : (
              t('login_btn')
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          {t('no_account')}{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            {t('register_here')}
          </Link>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="mt-8 text-xs text-slate-400">
        © {new Date().getFullYear()} {t('school_name')}. {t('copyright')}
      </div>
    </div>
  );
};

export default Login;