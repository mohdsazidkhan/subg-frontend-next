'use client'

import React, { useState } from 'react'
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaHeadset,
  FaComments,
  FaRocket,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaDiscord,
  FaTelegramPlane,
} from 'react-icons/fa'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'
import { toast } from 'react-toastify'

// Define social links from .env
const socialLinks = [
  { icon: <FaFacebookF />, url: process.env.NEXT_PUBLIC_FACEBOOK_URL },
  { icon: <FaTwitter />, url: process.env.NEXT_PUBLIC_TWITTER_URL },
  { icon: <FaInstagram />, url: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { icon: <FaYoutube />, url: process.env.NEXT_PUBLIC_YOUTUBE_URL },
  { icon: <FaLinkedinIn />, url: process.env.NEXT_PUBLIC_LINKEDIN_URL },
  { icon: <FaWhatsapp />, url: process.env.NEXT_PUBLIC_WHATSAPP_URL },
  { icon: <FaDiscord />, url: process.env.NEXT_PUBLIC_DISCORD_URL },
  { icon: <FaTelegramPlane />, url: process.env.NEXT_PUBLIC_TELEGRAM_URL },
]

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `Subject: ${formData.subject}\n${formData.message}`,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Message sent successfully!')
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavbar />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaComments className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-700 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions about our quiz platform? We'd love to hear from you.
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                      <FaEnvelope className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">subgquiz@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                      <FaPhone className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">+91-7678131912</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                      <FaMapMarkerAlt className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300">Delhi, India</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                      <FaClock className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Response Time</h3>
                      <p className="text-gray-600 dark:text-gray-300">Within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((item, index) => (
                      <a
                        key={index}
                        href={item.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Help</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaHeadset className="text-blue-600 dark:text-blue-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Support</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Get help with your account or quiz issues</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaRocket className="text-green-600 dark:text-green-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Feedback</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Share your thoughts and suggestions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaComments className="text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Partnership</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Interested in collaborating with us?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <UnifiedFooter />
    </div>
  )
}

export default ContactUs
