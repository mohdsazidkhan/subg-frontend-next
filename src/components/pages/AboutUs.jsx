'use client'

import React from 'react'
import { FaRocket, FaUsers, FaTrophy, FaBrain, FaGlobe, FaHeart } from 'react-icons/fa'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'

const AboutUs = () => {
  const features = [
    {
      icon: FaRocket,
      title: 'Innovative Learning',
      description: 'We use cutting-edge technology to make learning fun and engaging.'
    },
    {
      icon: FaUsers,
      title: 'Community Driven',
      description: 'Join thousands of students in our vibrant learning community.'
    },
    {
      icon: FaTrophy,
      title: 'Achievement Focused',
      description: 'Earn rewards and recognition for your learning progress.'
    },
    {
      icon: FaBrain,
      title: 'Smart Analytics',
      description: 'Track your progress with detailed analytics and insights.'
    },
    {
      icon: FaGlobe,
      title: 'Accessible Everywhere',
      description: 'Learn from anywhere, anytime with our responsive platform.'
    },
    {
      icon: FaHeart,
      title: 'Passion for Education',
      description: 'We are passionate about making quality education accessible to all.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Quiz Categories' },
    { number: '1000+', label: 'Quizzes Available' },
    { number: '50K+', label: 'Quizzes Completed' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavbar />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                SUBG QUIZ
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empowering students worldwide through interactive learning experiences, 
              comprehensive quizzes, and rewarding achievements.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  We believe that learning should be engaging, accessible, and rewarding. 
                  Our platform combines the power of technology with proven educational 
                  methodologies to create an environment where students can thrive.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  From interactive quizzes to comprehensive analytics, we provide 
                  everything students need to succeed in their educational journey.
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Interactive and engaging quiz experience
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Comprehensive analytics and progress tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Reward system to motivate learning
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Accessible on all devices
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
              What Makes Us Different
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
              <h2 className="text-4xl font-bold text-center mb-12">
                Our Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      {stat.number}
                    </div>
                    <div className="text-lg text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">MS</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Mohammad Sazid Khan
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  Founder & CEO
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Passionate about education technology and making learning accessible to everyone.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">DT</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Development Team
                </h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                  Full-Stack Developers
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Dedicated to creating innovative solutions and maintaining platform excellence.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">CT</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Content Team
                </h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">
                  Educational Experts
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Creating high-quality educational content and ensuring learning effectiveness.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:subgquiz@gmail.com"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Contact Us
              </a>
              <a
                href="/contact"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-full text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-all duration-300"
              >
                Visit Contact Page
              </a>
            </div>
          </div>
        </div>
      </div>

      <UnifiedFooter />
    </div>
  )
}

export default AboutUs
