"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  Circle,
  ArrowRight,
  Flag,
  X,
  Trophy,
  Target,
  CheckCircle2
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import quizData from "@/data/mock/quiz.json";

interface Question {
  id: number;
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: number;
  userAnswer?: number | null;
  isAnswered: boolean;
  image?: string;
  correctOrder?: number[];
  matches?: string[];
}

interface QuizData {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  totalQuestions: number;
  timeLimit: number;
  currentQuestion: number;
  questions: Question[];
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizData>(quizData.quiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(quiz.currentQuestion - 1);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // Convert to seconds
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    score: number;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto submit
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);


  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Update quiz data
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, userAnswer: answer, isAnswered: true }
          : q
      )
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    setShowConfirmModal(true);
  };

  const confirmFinishQuiz = () => {
    // Calculate score and show results
    const answeredQuestions = quiz.questions.filter(q => q.isAnswered).length;
    const correctAnswers = quiz.questions.filter(q => 
      q.isAnswered && q.userAnswer === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / quiz.totalQuestions) * 100);
    
    const results = {
      totalQuestions: quiz.totalQuestions,
      answeredQuestions,
      correctAnswers,
      score
    };
    
    setQuizResults(results);
    setShowResults(true);
    setShowConfirmModal(false);
    
    // Clear timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'true-false': return 'Doğru/Yanlış';
      case 'multiple-choice': return 'Çoktan Seçmeli';
      case 'poll': return 'Anket Sorusu';
      case 'reorder': return 'Sıralama';
      case 'matching': return 'Eşleştirme';
      default: return type;
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex relative overflow-hidden">
      {/* Quiz Sidebar */}
      <motion.div
        initial={{ x: sidebarOpen ? 0 : -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ duration: 0.3 }}
        className="fixed left-4 top-4 w-80 bg-white dark:bg-gray-800 z-50 flex flex-col hidden lg:flex rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 h-[calc(100vh-2rem)]"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{quiz.instructorAvatar}</span>
              </div>
              <div>
                <h2 className="text-gray-900 dark:text-white font-semibold text-sm">{quiz.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{quiz.instructor}</p>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Soru listesini gizle"
              >
                <Menu className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Soru listesini gizle
                <div className="absolute bottom-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 p-3 min-h-0">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-2">
            {quiz.questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                  index === currentQuestionIndex
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 text-purple-600 dark:text-purple-300'
                    : question.isAnswered
                    ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 text-green-600 dark:text-green-300'
                    : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {question.isAnswered ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      Soru {question.id}
                    </div>
                    <div className="text-xs opacity-80 truncate">
                      {question.question.length > 40 
                        ? question.question.substring(0, 40) + '...'
                        : question.question
                      }
                    </div>
                  </div>
                </div>
              </button>
            ))}
            </div>
          </ScrollArea>
        </div>

        {/* Timer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-black dark:bg-black rounded-xl p-4">
            <div className="text-white text-sm font-medium mb-3">Süre</div>
            <div className="flex items-center justify-center gap-1">
              {formatTime(timeLeft).split('').map((char, index) => (
                <div key={index} className="flex items-center">
                  {char === ':' ? (
                    <span className="text-white text-2xl font-mono mx-1">:</span>
                  ) : (
                    <div className="bg-gray-800 rounded-lg px-2 py-1 min-w-[24px] text-center">
                      <span className="text-white text-2xl font-mono">{char}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle Sidebar Button - Only visible when sidebar is closed */}
      {!sidebarOpen && (
        <div className="fixed left-4 top-4 z-50 group">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            aria-label="Soru listesini aç"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="absolute top-full left-0 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Soru listesini aç
            <div className="absolute bottom-full left-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-96' : 'ml-16'} overflow-hidden`}>
        <div className="p-4 md:p-8 flex gap-6 h-full">
          {/* Combined Header and Question Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 flex-1 flex flex-col min-h-0">
            {/* Header Section */}
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Hafta 1 - Başlangıç - İşletme Yönetimi Başarısına Giriş
              </p>
            </div>

            {/* Progress Bar Separator */}
            <div className="mb-6 -mx-6 md:-mx-8 shadow-sm">
              <div className="w-full bg-gray-100 dark:bg-gray-600 h-0.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-0.5 transition-all duration-700 ease-out shadow-sm"
                  style={{ 
                    width: `${(quiz.questions.filter(q => q.isAnswered).length / quiz.totalQuestions) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Soru {currentQuestion.id} / {quiz.totalQuestions}
                  </span>
                  <div className="relative group">
                    <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-xs rounded-full flex items-center gap-1">
                      {getQuestionTypeLabel(currentQuestion.type)}
                      <span className="text-purple-500 cursor-help">?</span>
                    </span>
                    <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {currentQuestion.type === 'true-false' 
                        ? "İfadeye katılıyorsanız 'DOĞRU', katılmıyorsanız 'YANLIŞ' seçeneğini işaretleyerek cevap verin."
                        : currentQuestion.type === 'reorder'
                        ? "Seçenekleri doğru sıraya göre sürükleyip bırakın."
                        : currentQuestion.type === 'matching'
                        ? "Terimleri tanımlarıyla eşleştirin."
                        : currentQuestion.type === 'poll'
                        ? "Tercih ettiğiniz seçeneği işaretleyin."
                        : "Aşağıdaki seçeneklerden en iyi cevabı seçin."
                      }
                      <div className="absolute bottom-full left-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={handlePreviousQuestion}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Önceki soru"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex >= quiz.totalQuestions - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Sonraki soru"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
            </div>

            {/* Question Content */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="pr-4">
                {/* Question */}
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {currentQuestion.question}
                </h2>

              {/* Question Image */}
              {currentQuestion.image && (
                <div className="mb-6">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-red-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-sm">Soru Görseli</span>
                  </div>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3 mb-8">
              {currentQuestion.type === 'reorder' ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-move hover:border-purple-400 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {option}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentQuestion.type === 'matching' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Terimler</h4>
                    <div className="space-y-2">
                      {currentQuestion.options?.map((option, index) => (
                        <div
                          key={index}
                          className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                          <span className="text-gray-900 dark:text-white font-medium">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tanımlar</h4>
                    <div className="space-y-2">
                      {currentQuestion.matches?.map((match, index) => (
                        <div
                          key={index}
                          className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                        >
                          <span className="text-gray-900 dark:text-white font-medium">{match}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : currentQuestion.type === 'poll' ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        userAnswers[currentQuestion.id] === index
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          userAnswers[currentQuestion.id] === index
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {userAnswers[currentQuestion.id] === index && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                // Default multiple choice and true-false
                currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    className={`w-full p-4 text-left rounded-lg border transition-all duration-200 focus:outline-none ${
                      userAnswers[currentQuestion.id] === index
                        ? 'border-purple-300 bg-purple-50/50 dark:bg-purple-900/10'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    aria-pressed={userAnswers[currentQuestion.id] === index}
                    aria-label={`Seçenek ${index + 1}: ${option}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 mt-0.5 ${
                        userAnswers[currentQuestion.id] === index
                          ? 'border-purple-400 bg-purple-400'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {userAnswers[currentQuestion.id] === index && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium leading-relaxed">
                        {option}
                      </span>
                    </div>
                  </button>
                ))
              )}
              </div>
              </div>
            </ScrollArea>

          </div>

          {/* Answer Key Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-80 flex-shrink-0 flex flex-col min-h-0">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cevap Anahtarı</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Seçilen</span>
              </div>
              </div>
              
              {/* Progress Bar */}
              <div className="-mx-6 shadow-lg">
                <div className="w-full bg-gray-100 dark:bg-gray-600 h-0.5 shadow-sm">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-0.5 transition-all duration-700 ease-out shadow-sm"
                    style={{ 
                      width: `${(quiz.questions.filter(q => q.isAnswered).length / quiz.totalQuestions) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-2">
              {quiz.questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                    index === currentQuestionIndex 
                      ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={`text-sm font-medium w-6 ${
                    index === currentQuestionIndex 
                      ? 'text-purple-700 dark:text-purple-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {question.id}.
                  </span>
                  <div className="flex gap-1.5">
                    {question.options?.map((_, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(question.id, optionIndex)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-110 ${
                          userAnswers[question.id] === optionIndex
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 border-2 border-purple-300 shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                        title={`${String.fromCharCode(97 + optionIndex).toUpperCase()} seçeneğini seç`}
                      >
                        {String.fromCharCode(97 + optionIndex)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              </div>
            </ScrollArea>
            
            {/* Navigation and Finish Quiz Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 mb-3">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={handlePreviousQuestion}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Önceki
                  </button>
                )}
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex >= quiz.totalQuestions - 1}
                  className="flex-1 px-3 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  Sonraki
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <button 
                onClick={handleFinishQuiz}
                className="w-full px-4 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
              >
                Sınavı Bitir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Finish Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {/* Content */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Sınavı Bitirmek İstiyor musunuz?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {quiz.questions.filter(q => q.isAnswered).length} soru cevapladınız, {quiz.totalQuestions - quiz.questions.filter(q => q.isAnswered).length} soru kaldı.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Devam Et
                  </button>
                  <button
                    onClick={confirmFinishQuiz}
                    className="flex-1 px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
                  >
                    Sınavı Bitir
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && quizResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowResults(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowResults(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {/* Results Content */}
              <div className="text-center">
                {/* Trophy Icon */}
                <div className="mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                    quizResults.score >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                    quizResults.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Trophy className={`h-10 w-10 ${
                      quizResults.score >= 80 ? 'text-green-600 dark:text-green-400' :
                      quizResults.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                </div>

                {/* Score */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {quizResults.score}%
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {quizResults.score >= 80 ? 'Mükemmel! 🎉' :
                   quizResults.score >= 60 ? 'İyi iş! 👍' :
                   'Daha fazla çalışman gerekiyor 💪'}
                </p>

                {/* Stats */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">Toplam Soru</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {quizResults.totalQuestions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">Cevaplanan</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {quizResults.answeredQuestions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-700 dark:text-gray-300">Doğru Cevap</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {quizResults.correctAnswers}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResults(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestionIndex(0);
                      setUserAnswers({});
                      setTimeLeft(quiz.timeLimit * 60);
                      setQuiz(prev => ({
                        ...prev,
                        questions: prev.questions.map(q => ({ ...q, userAnswer: null, isAnswered: false }))
                      }));
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}