import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ==========================
  // HANDLE GOOGLE LOGIN/SIGNUP
  // ==========================
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/google`,
        { credential: credentialResponse.credential }
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      setSuccess('Account created/logged in successfully via Google');

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    // Password Match Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Password Length Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/signup`,
        {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      );

      // Save Token and User
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      setSuccess('Account created successfully');

      // Redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {

      setError(
        err.response?.data?.message || 'Signup failed'
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="min-h-screen bg-brandSilver flex items-center justify-center px-4 py-10">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-lg relative overflow-hidden"
      >

        {/* Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-brandBlack"></div>

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brandSilver mb-4 border border-[#af956b]/20">
            <UserPlus className="text-brandBlack" size={28} />
          </div>

          <h2 className="text-3xl font-serif text-gray-900">
            Create Account
          </h2>

          <p className="text-gray-500 text-sm mt-2 font-medium">
            Join Rithus Beauty Hub
          </p>

        </div>


        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 text-center">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-600 text-sm px-4 py-3 rounded-lg mb-5 text-center">
            {success}
          </div>
        )}


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brandBlack focus:bg-white transition-all"
            />
          </div>


          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Username
            </label>

            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brandBlack focus:bg-white transition-all"
            />
          </div>


          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brandBlack focus:bg-white transition-all"
            />
          </div>


          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brandBlack focus:bg-white transition-all"
            />
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brandBlack focus:bg-white transition-all"
            />
          </div>


          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brandBlack focus:bg-white transition-all"
            />
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brandBlack hover:bg-[#907a53] text-white font-semibold py-3 rounded-xl transition-all duration-300"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        {/* OR DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* GOOGLE SIGNUP BUTTON */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Signup Failed');
              setError('Google Signup failed');
            }}
            text="signup_with"
          />
        </div>


        {/* Login Link */}
        <div className="mt-6 text-center">

          <p className="text-sm text-gray-600">

            Already have an account?{' '}

            <Link
              to="/login"
              className="text-brandBlack font-bold hover:underline"
            >
              Login here
            </Link>

          </p>

        </div>

      </motion.div>

    </div>
  );

};

export default Signup;
