'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Author {
  id: string;
  name: string;
  designation: string;
  imageUrl?: string;
}

interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  author: Author;
}

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  isResolved: boolean;
  views: number;
  createdAt: string;
  author: Author;
  answers: Answer[];
  _count: {
    answers: number;
  };
}

export default function QuestionPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [error, setError] = useState('');

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/questions/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuestion(data);
      } else if (response.status === 404) {
        router.push('/qa');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (!answerContent.trim()) {
      setError('Answer content is required');
      return;
    }

    setSubmittingAnswer(true);
    setError('');

    try {
      const response = await fetch(`/api/questions/${params.id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: answerContent.trim()
        }),
      });

      if (response.ok) {
        setAnswerContent('');
        fetchQuestion(); // Refresh to show new answer
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to submit answer');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseTags = (tagsString: string | null) => {
    if (!tagsString) return [];
    try {
      return JSON.parse(tagsString);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Question not found
            </h1>
            <Link
              href="/qa"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Back to Q&A
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/qa"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Q&A
          </Link>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          {/* Status Badges */}
          <div className="flex items-center gap-2 mb-4">
            {question.isResolved && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Resolved
              </span>
            )}
            {question.answers.some(a => a.isAccepted) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                ✓ Has Accepted Answer
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {question.title}
          </h1>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center" title={`${question.views} unique members have viewed this question`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {question.views} members viewed
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {question._count.answers} answers
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {question.content}
            </p>
          </div>

          {/* Tags */}
          {question.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {parseTags(question.tags).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3 overflow-hidden">
                {question.author.imageUrl ? (
                  <img src={question.author.imageUrl} alt={question.author.name} className="w-full h-full object-cover" />
                ) : (
                  question.author.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{question.author.name}</div>
                {question.author.designation && (
                  <div className="text-sm text-gray-500">{question.author.designation}</div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Asked {formatDate(question.createdAt)}
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {question._count.answers} {question._count.answers === 1 ? 'Answer' : 'Answers'}
          </h2>

          {question.answers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No answers yet</h3>
              <p className="text-gray-600">Be the first to answer this question!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`bg-white rounded-lg shadow-sm border p-6 ${
                    answer.isAccepted ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                  }`}
                >
                  {answer.isAccepted && (
                    <div className="flex items-center mb-4">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-800 font-medium">Accepted Answer</span>
                    </div>
                  )}

                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {answer.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-2 overflow-hidden">
                        {answer.author.imageUrl ? (
                          <img src={answer.author.imageUrl} alt={answer.author.name} className="w-full h-full object-cover" />
                        ) : (
                          answer.author.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{answer.author.name}</div>
                        {answer.author.designation && (
                          <div className="text-xs text-gray-500">{answer.author.designation}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatDate(answer.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        {session ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Answer
            </h3>
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-4">
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Write your answer here. Be detailed and helpful."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingAnswer || !answerContent.trim()}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submittingAnswer ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Post Answer'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Want to answer this question?
            </h3>
            <p className="text-gray-600 mb-4">
              Please sign in to post an answer.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 