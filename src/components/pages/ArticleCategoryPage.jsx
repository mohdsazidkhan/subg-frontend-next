import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MobileAppWrapper from '../MobileAppWrapper';
import API from '../../lib/api';
import UnifiedNavbar from '../UnifiedNavbar';
import UnifiedFooter from '../UnifiedFooter';

const PAGE_LIMIT = 12;

const ArticleCategoryPage = ({ categoryId }) => {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryMeta();
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      console.log('ArticleCategoryPage: categoryId changed to:', categoryId);
      fetchArticles(page);
    }
  }, [categoryId, page]);

  const fetchCategoryMeta = async () => {
    try {
      console.log('Fetching category meta for ID:', categoryId);
      const response = await API.getPublicCategories();
      console.log('Categories response:', response);
      const found = (response?.data || response || []).find(c => c._id === categoryId);
      console.log('Found category:', found);
      setCategory(found || null);
    } catch (e) {
      console.error('Error fetching category meta:', e);
      setCategory(null);
    }
  };

  const fetchArticles = async (pageNum) => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching articles for category:', categoryId, 'page:', pageNum);
      const res = await API.getArticlesByCategory(categoryId, { page: pageNum, limit: PAGE_LIMIT });
      console.log('Category articles response:', res);
      const payload = res.data || res;
      // Try multiple possible response structures
      const list = payload.articles || 
                   payload.items || 
                   payload.results ||
                   (Array.isArray(payload) ? payload : []);
      console.log('Extracted articles list:', list);
      setArticles(list);
      if (payload.pagination) {
        setTotalPages(payload.pagination.totalPages || 1);
      } else if (payload.totalPages) {
        setTotalPages(payload.totalPages);
      } else {
        setTotalPages(1);
      }
    } catch (e) {
      console.error('Error loading category articles', e);
      setError('Failed to load articles. Please check console for details.');
      setArticles([]);
      setTotalPages(1);
      
      // Show a helpful error message
      if (e.message?.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const title = useMemo(() => category?.name ? `${category.name} Articles` : 'Category Articles', [category]);

  return (
    <MobileAppWrapper title={title}>
      {/* Desktop Header */}
      <UnifiedNavbar />
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
        <div className="max-w-5xl mx-auto p-4 text-gray-900 dark:text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h1>
              {category?.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
              )}
            </div>
            <button onClick={() => router.back()} className=" bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg">
              ← Back
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : articles.length === 0 ? (
            <div className="text-center text-gray-500">No articles found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <Link key={a._id} href={`/articles/${a.slug}`} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition">
                  {a.featuredImage && (
                    <img src={a.featuredImage} alt={a.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg group-hover:text-yellow-600 dark:group-hover:text-yellow-400">{a.title}</h3>
                    {a.excerpt && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{a.excerpt}</p>}
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                      <span>👁️ {a.views || 0}</span>
                      <span>❤️ {a.likes || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50">Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{i + 1}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      </div>
      {/* Desktop Footer */}
      <UnifiedFooter />
    </MobileAppWrapper>
  );
};

export default ArticleCategoryPage;