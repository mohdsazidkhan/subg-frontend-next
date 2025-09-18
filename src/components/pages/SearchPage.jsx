'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FaSearch, FaBrain, FaClock, FaTrophy, FaUser } from 'react-icons/fa'
import UnifiedNavbar from '../UnifiedNavbar'
import UnifiedFooter from '../UnifiedFooter'
import TokenValidationWrapper from '../TokenValidationWrapper'
import API from '@/lib/api'
import { debounce } from '@/lib/utils'

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({
    quizzes: [],
    categories: [],
    subcategories: [],
    articles: []
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, [searchParams])

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ quizzes: [], categories: [], subcategories: [], articles: [] })
      return
    }

    setLoading(true)
    try {
      const results = await API.searchAll({ query, limit: 20 })
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = debounce(handleSearch, 500)

  const handleInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Mathematics': '🧮',
      'Science': '🔬',
      'Technology': '💻',
      'General Knowledge': '🌍',
      'History': '📚',
      'Sports': '⚽',
      'Entertainment': '🎬',
      'Language': '🗣️',
      'Education': '🎓',
      'Art': '🎨',
      'News': '📰',
    }
    
    return iconMap[categoryName] || '📖'
  }

  const getTotalResults = () => {
    return searchResults.quizzes.length + 
           searchResults.categories.length + 
           searchResults.subcategories.length + 
           searchResults.articles.length
  }

  const tabs = [
    { id: 'all', label: 'All', count: getTotalResults() },
    { id: 'quizzes', label: 'Quizzes', count: searchResults.quizzes.length },
    { id: 'categories', label: 'Categories', count: searchResults.categories.length },
    { id: 'subcategories', label: 'Subcategories', count: searchResults.subcategories.length },
    { id: 'articles', label: 'Articles', count: searchResults.articles.length },
  ]

  return (
    <TokenValidationWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        
        <div className="pt-20 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Search
              </h1>
              
              {/* Search Input */}
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Search for quizzes, categories, articles..."
                />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Searching...</p>
              </div>
            )}

            {/* Search Results */}
            {!loading && searchQuery && (
              <>
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="space-y-8">
                  {/* Quizzes */}
                  {(activeTab === 'all' || activeTab === 'quizzes') && searchResults.quizzes.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Quizzes ({searchResults.quizzes.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.quizzes.map((quiz) => (
                          <Link
                            key={quiz._id}
                            href={`/attempt-quiz/${quiz._id}`}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <div className="flex items-start mb-4">
                              <div className="text-3xl mr-4">
                                {getCategoryIcon(quiz.category?.name)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                  {quiz.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {quiz.category?.name} • Level {quiz.level}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center">
                                <FaClock className="w-4 h-4 mr-1" />
                                {quiz.timeLimit} min
                              </div>
                              <div className="flex items-center">
                                <FaBrain className="w-4 h-4 mr-1" />
                                {quiz.questions?.length || 0} questions
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {(activeTab === 'all' || activeTab === 'categories') && searchResults.categories.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Categories ({searchResults.categories.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {searchResults.categories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/category/${category._id}`}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <div className="flex items-center mb-4">
                              <div className="text-4xl mr-4">
                                {getCategoryIcon(category.name)}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {category.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {category.subcategories?.length || 0} Subcategories
                                </p>
                              </div>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                              Explore →
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subcategories */}
                  {(activeTab === 'all' || activeTab === 'subcategories') && searchResults.subcategories.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Subcategories ({searchResults.subcategories.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory._id}
                            href={`/subcategory/${subcategory._id}`}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <div className="flex items-center mb-4">
                              <div className="text-3xl mr-4">
                                {getCategoryIcon(subcategory.category?.name)}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {subcategory.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {subcategory.category?.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                              View Quizzes →
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Articles */}
                  {(activeTab === 'all' || activeTab === 'articles') && searchResults.articles.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Articles ({searchResults.articles.length})
                      </h2>
                      <div className="space-y-4">
                        {searchResults.articles.map((article) => (
                          <Link
                            key={article._id}
                            href={`/articles/${article.slug}`}
                            className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex items-start">
                              <div className="text-3xl mr-4">
                                📝
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                  {article.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">
                                  {article.excerpt}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <FaUser className="w-4 h-4 mr-1" />
                                  {article.author?.name || 'Anonymous'}
                                  <span className="mx-2">•</span>
                                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {getTotalResults() === 0 && searchQuery && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Try searching with different keywords
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Empty State */}
            {!searchQuery && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Start searching
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter a search term to find quizzes, categories, and articles
                </p>
              </div>
            )}
          </div>
        </div>

        <UnifiedFooter />
      </div>
    </TokenValidationWrapper>
  )
}

export default SearchPage
