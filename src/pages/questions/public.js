'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import MobileAppWrapper from '../../components/MobileAppWrapper';
import UnifiedNavbar from '../../components/UnifiedNavbar';
import UnifiedFooter from '../../components/UnifiedFooter';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaHeart, FaShareAlt, FaEye, FaCheck, FaTimes, FaReply, FaSearch } from 'react-icons/fa';

const PublicUserQuestions = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.getPublicUserQuestions({ page, limit, search: searchTerm });
      if (res?.success) {
        setItems(res.data || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (e) {
      console.error('Failed to load public questions', e);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm]);

  useEffect(() => { load(); }, [load]);

  const answer = async (q, idx) => {
    try {
      if (typeof q.selectedOptionIndex === 'number') return;
      
      // Immediately show visual feedback
      setItems(prev => prev.map(it => it._id === q._id ? { ...it, selectedOptionIndex: idx, isAnswered: true } : it));
      
      await API.answerUserQuestion(q._id, idx);
      toast.success('Answer submitted successfully!');
    } catch (e) {
      toast.error(e?.message || 'Failed to submit Answer!');
      // Revert the visual feedback on error
      setItems(prev => prev.map(it => it._id === q._id ? { ...it, selectedOptionIndex: undefined, isAnswered: false } : it));
    }
  };

  const like = async (q) => {
    try {
      const res = await API.likeUserQuestion(q._id);
      if (res?.data?.firstTime) {
        setItems(prev => prev.map(it => it._id === q._id ? { ...it, likesCount: (it.likesCount||0) + 1 } : it));
      }
    } catch (e) {}
  };

  const share = async (q) => {
    try {
      await API.shareUserQuestion(q._id);
      setItems(prev => prev.map(it => it._id === q._id ? { ...it, sharesCount: (it.sharesCount||0) + 1 } : it));
      if (navigator.share) {
        navigator.share({ title: 'User Question', text: q.questionText, url: window.location.href }).catch(()=>{});
      }
    } catch (e) {}
  };

  const view = async (q) => {
    try {
      const res = await API.incrementUserQuestionView(q._id);
      if (res?.data?.firstTime) {
        setItems(prev => prev.map(it => it._id === q._id ? { ...it, viewsCount: (it.viewsCount||0) + 1 } : it));
      }
    } catch (e) {}
  };

  const timeAgo = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours>1?'s':''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days>1?'s':''} ago`;
  };

  const getInitials = (name = '') => {
    const parts = String(name).trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase() || 'U';
  };

  const isCurrentUser = (userId) => {
    try {
      const current = JSON.parse(localStorage.getItem('user'));
      return current?._id === userId;
    } catch {
      return false;
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <MobileAppWrapper title="User Questions">
      <UnifiedNavbar />
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Questions ({total})</h1>
                <p className="text-gray-600 dark:text-gray-300">Answer, like, share user questions</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={() => { setPage(1); load(); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Search
              </button>
            </div>
          </div>

          {loading && (
            <div className="mb-4">
              <div className="h-2 w-24 bg-blue-200 dark:bg-blue-900 rounded animate-pulse"></div>
            </div>
          )}

          {/* Questions List */}
          {!items || items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">No questions found</div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((row) => {
                const user = row.userId || {};
                return (
                  <div key={row._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 text-white flex items-center justify-center font-bold">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user.name || 'Unknown User'}
                            {user._id && isCurrentUser(user._id) && (
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">You</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.level?.levelName || 'Starter'}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Posted {timeAgo(row.createdAt)}</div>
                    </div>

                    <div className="mt-3 text-base font-medium text-gray-900 dark:text-white">
                      {row.questionText}
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {row.options.map((opt, idx) => {
                        const isSelected = typeof row.selectedOptionIndex === 'number' && row.selectedOptionIndex === idx;
                        const isCorrect = idx === row.correctAnswer;
                        const isWrong = isSelected && !isCorrect;
                        const answered = typeof row.selectedOptionIndex === 'number';
                        const showFeedback = answered && isSelected;
                        const showCorrectAnswer = answered && !isSelected && isCorrect;

                        let buttonClasses = 'w-full sm:w-auto px-3 py-2 rounded-lg text-sm text-left border flex items-center justify-between';
                        let textColor = 'text-gray-900 dark:text-gray-100';
                        let backgroundColor = 'bg-white dark:bg-gray-800';
                        let borderColor = 'border-gray-300 dark:border-gray-700';

                        if (showFeedback) {
                          if (isCorrect) {
                            backgroundColor = 'bg-green-500';
                            borderColor = 'border-green-600';
                            textColor = 'text-white';
                          } else if (isWrong) {
                            backgroundColor = 'bg-red-500';
                            borderColor = 'border-red-600';
                            textColor = 'text-white';
                          }
                        } else if (showCorrectAnswer) {
                          backgroundColor = 'bg-green-500';
                          borderColor = 'border-green-600';
                          textColor = 'text-white';
                        } else if (isSelected) {
                          backgroundColor = 'bg-blue-50 dark:bg-blue-900/20';
                          borderColor = 'border-blue-500';
                          textColor = 'text-blue-700 dark:text-blue-300';
                        }

                        if (answered && !isSelected && !isCorrect) {
                          buttonClasses += ' opacity-60 cursor-not-allowed';
                        } else if (!answered) {
                          buttonClasses += ' hover:bg-blue-50 dark:hover:bg-gray-700';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => answer(row, idx)}
                            disabled={answered}
                            className={`${buttonClasses} ${backgroundColor} ${textColor} ${borderColor}`}
                          >
                            <div className="flex items-center">
                              <span className="font-semibold mr-2">{String.fromCharCode(65+idx)}.</span>
                              <span>{opt}</span>
                            </div>
                            {(showFeedback || showCorrectAnswer) && (
                              <div className="ml-2">
                                {isCorrect && <FaCheck className="text-white" />}
                                {isWrong && <FaTimes className="text-white" />}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex justify-between items-center gap-4">
                      <button onClick={() => like(row)} className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-red-600">
                        <FaHeart /> <span className="text-sm">{row.likesCount || 0}</span>
                      </button>
                      <button onClick={() => share(row)} className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600">
                        <FaShareAlt /> <span className="text-sm">{row.sharesCount || 0}</span>
                      </button>
                      <div className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <FaReply /> <span className="text-sm">{row.answersCount || 0}</span>
                      </div>
                      <button onClick={() => view(row)} className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <FaEye /> <span className="text-sm">{row.viewsCount || 0}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} questions
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  disabled={page <= 1} 
                  onClick={() => setPage(p => p - 1)} 
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button 
                  disabled={page >= totalPages} 
                  onClick={() => setPage(p => p + 1)} 
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <UnifiedFooter />
    </MobileAppWrapper>
  );
};

export default PublicUserQuestions;
