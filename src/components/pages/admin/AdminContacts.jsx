'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'
import { toast } from 'react-toastify'
import { FaSearch, FaArrowLeft, FaTrash, FaReply } from 'react-icons/fa'
import AdminMobileAppWrapper from '@/components/AdminMobileAppWrapper'

const AdminContacts = () => {
  const router = useRouter()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await API.getContacts()
      if (response.success) {
        setContacts(response.data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('Failed to fetch contacts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        const response = await API.deleteContact(contactId)
        if (response.success) {
          toast.success('Contact message deleted successfully')
          fetchContacts()
        }
      } catch (error) {
        console.error('Error deleting contact:', error)
        toast.error('Failed to delete contact message')
      }
    }
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Contact Messages">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </AdminMobileAppWrapper>
    )
  }

  return (
    <AdminMobileAppWrapper title="Contact Messages">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {contact.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {contact.name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                    title="Reply via Email"
                  >
                    <FaReply />
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    title="Delete Message"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                  Subject: {contact.subject}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {contact.message}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Received: {new Date(contact.createdAt).toLocaleString()}</span>
                <span>Phone: {contact.phone || 'Not provided'}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📧</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No contact messages found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No messages have been received yet'}
            </p>
          </div>
        )}
      </div>
    </AdminMobileAppWrapper>
  )
}

export default AdminContacts
