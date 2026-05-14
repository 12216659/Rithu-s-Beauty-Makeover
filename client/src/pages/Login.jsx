import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import axios from 'axios';

const Login = () => {

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================
  // HANDLE LOGIN
  // ==========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');

    try {

      const { data } = await axios.post(
        'https://rithus-backend.onrender.com/api/auth/login',
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

    <div className="min-h-screen bg-brandLightPink flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-md relative overflow-hidden"
      >

        {/* TOP BORDER */}
        <div className="absolute top-0 left-0 w-full h-1 bg-brandPink"></div>

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brandLightPink mb-4 border border-pink-100">
            <Lock
              className="text-brandPink"
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
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandPink focus:bg-white transition-colors"
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
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandPink focus:bg-white transition-colors"
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

        {/* SIGNUP LINK */}
        <div className="mt-6 text-center">

          <p className="text-sm text-gray-600">

            Don't have an account?{' '}

            <Link
              to="/signup"
              className="text-brandPink font-bold hover:underline"
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