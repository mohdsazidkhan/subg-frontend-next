'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const SubcategoryPage = () => {
  const router = useRouter()
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    icon: '📂'
  })

  useEffect(() => {
    fetchSubcategories()
    fetchCategories()
  }, [])

  const fetchSubcategories = async () => {
    try {
      setLoading(true)
      const response = await API.getSubcategories()
      if (response.success) {
        setSubcategories(response.data)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      toast.error('Failed to fetch subcategories')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await API.getCategories()
      if (response.success) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSubcategory) {
        const response = await API.updateSubcategory(editingSubcategory._id, formData)
        if (response.success) {
          toast.success('Subcategory updated successfully')
          fetchSubcategories()
          setShowForm(false)
          setEditingSubcategory(null)
          setFormData({ name: '', description: '', category: '', icon: '📂' })
        }
      } else {
        const response = await API.createSubcategory(formData)
        if (response.success) {
          toast.success('Subcategory created successfully')
          fetchSubcategories()
          setShowForm(false)
          setFormData({ name: '', description: '', category: '', icon: '📂' })
        }
      }
    } catch (error) {
      console.error('Error saving subcategory:', error)
      toast.error('Failed to save subcategory')
    }
  }

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory)
    setFormData({
      name: subcategory.name,
      description: subcategory.description || '',
      category: subcategory.category?._id || '',
      icon: subcategory.icon || '📂'
    })
    setShowForm(true)
  }

  const handleDelete = async (subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        const response = await API.deleteSubcategory(subcategoryId)
        if (response.success) {
          toast.success('Subcategory deleted successfully')
          fetchSubcategories()
        }
      } catch (error) {
        console.error('Error deleting subcategory:', error)
        toast.error('Failed to delete subcategory')
      }
    }
  }

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Subcategories">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Subcategories">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subcategories</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Subcategory</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubcategories.map((subcategory) => (
            <div
              key={subcategory._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{subcategory.icon}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(subcategory)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(subcategory._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {subcategory.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {subcategory.description || 'No description'}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Category: {subcategory.category?.name || 'N/A'}
              </p>
            </div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="📂"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg"
                  >
                    {editingSubcategory ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingSubcategory(null)
                      setFormData({ name: '', description: '', category: '', icon: '📂' })
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminMobileAppWrapper>
  )
}

export default SubcategoryPage
