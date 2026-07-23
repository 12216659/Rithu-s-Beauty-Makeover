import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================
  // HANDLE GOOGLE LOGIN
  // ==========================
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/google`,
        { credential: credentialResponse.credential }
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      if (data.role && data.role.toLowerCase() === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // HANDLE LOGIN
  // ==========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');

    try {

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`,
        credentials
      );

      // ==========================
      // SAVE TOKEN
      // ==========================
      localStorage.setItem('token', data.token);

      // SAVE USER INFO
      localStorage.setItem(
        'user',
        JSON.stringify(data)
      );

      console.log('LOGIN RESPONSE:', data);

      // ==========================
      // ADMIN REDIRECT
      // ==========================
      if (
        data.role &&
        data.role.toLowerCase() === 'admin'
      ) {

        navigate('/admin/dashboard');

      } else {

        navigate('/');

      }

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        'Login failed'
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-brandSilver flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-md relative overflow-hidden"
      >

        {/* TOP BORDER */}
        <div className="absolute top-0 left-0 w-full h-1 bg-brandBlack"></div>

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brandSilver mb-4 border border-[#af956b]/20">
            <Lock
              className="text-brandBlack"
              size={28}
            />
          </div>

          <h2 className="text-2xl font-serif text-gray-900">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-sm mt-2 font-medium">
            Please login to your account.
          </p>

        </div>

        {/* ERROR MESSAGE */}
        {error && (

          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>

        )}

        {/* LOGIN FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* EMAIL */}
          <div>

            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Email
            </label>

            <input
              type="email"
              required
              value={credentials.email}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  email: e.target.value
                })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandBlack focus:bg-white transition-colors"
              placeholder="Enter your email"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Password
            </label>

            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value
                })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandBlack focus:bg-white transition-colors"
              placeholder="Enter your password"
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >

            {loading
              ? 'Authenticating...'
              : 'Login'}

          </button>

        </form>

        {/* OR DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
              setError('Google Login failed');
            }}
          />
        </div>

        {/* SIGNUP LINK */}
        <div className="mt-6 text-center">

          <p className="text-sm text-gray-600">

            Don't have an account?{' '}

            <Link
              to="/signup"
              className="text-brandBlack font-bold hover:underline"
            >
              Sign up here
            </Link>

          </p>

        </div>

      </motion.div>

    </div>

  );

};

export default Login;
