'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSort, FaBook, FaTrophy, FaUser, FaCalendar, FaTag } from 'react-icons/fa';
import UnifiedNavbar from '../UnifiedNavbar';
import UnifiedFooter from '../UnifiedFooter';
import MobileAppWrapper from '../MobileAppWrapper';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    // Mock categories data - replace with actual API call
    const mockCategories = [
      { id: 1, name: 'General Knowledge', icon: FaBook, quizCount: 150 },
      { id: 2, name: 'Science', icon: FaBook, quizCount: 120 },
      { id: 3, name: 'Technology', icon: FaBook, quizCount: 80 },
      { id: 4, name: 'Sports', icon: FaTrophy, quizCount: 90 },
      { id: 5, name: 'History', icon: FaCalendar, quizCount: 110 },
      { id: 6, name: 'Geography', icon: FaBook, quizCount: 95 },
      { id: 7, name: 'Entertainment', icon: FaBook, quizCount: 130 },
      { id: 8, name: 'Mathematics', icon: FaBook, quizCount: 75 },
    ];
    
    setCategories(mockCategories);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    // Mock search results - replace with actual API call
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: 'General Knowledge Quiz 1', category: 'General Knowledge', difficulty: 'Easy', questions: 10, rating: 4.5 },
        { id: 2, title: 'Science Fundamentals', category: 'Science', difficulty: 'Medium', questions: 15, rating: 4.2 },
        { id: 3, title: 'Technology Trends', category: 'Technology', difficulty: 'Hard', questions: 20, rating: 4.8 },
        { id: 4, title: 'Sports History', category: 'Sports', difficulty: 'Medium', questions: 12, rating: 4.3 },
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'Hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">☆</span>);
    }
    
    return stars;
  };

  return (
    <MobileAppWrapper>
      <UnifiedNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Search Quizzes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find the perfect quiz to challenge yourself
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search for quizzes, categories, or topics..."
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('easy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === 'easy'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setActiveFilter('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === 'medium'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setActiveFilter('hard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === 'hard'
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Hard
            </button>
          </div>

          {/* Categories Section */}
          {!searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Browse by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                    >
                      <div className="text-center">
                        <IconComponent className="text-3xl text-blue-600 dark:text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.quizCount} quizzes
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Search Results
                </h2>
                <div className="flex items-center space-x-2">
                  <FaSort className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-900 dark:text-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="questions">Questions</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {result.title}
                          </h3>
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FaTag className="mr-1" />
                              {result.category}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result.difficulty)}`}>
                              {result.difficulty}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FaBook className="mr-1" />
                              {result.questions} questions
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center mr-4">
                              {renderStars(result.rating)}
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                {result.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Start Quiz
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaSearch className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Popular Searches */}
          {!searchQuery && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Popular Searches
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {['General Knowledge', 'Science', 'Technology', 'Sports', 'History', 'Geography', 'Math', 'Entertainment'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      handleSearch(term);
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <UnifiedFooter />
    </MobileAppWrapper>
  );
};

export default SearchPage;