import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, CheckCircle, XCircle, RefreshCw, Trophy, Home, Layers, MapPin, Clock, ChevronRight, ChevronLeft, Globe, Zap, Brain, Trash2, PlayCircle, X, PieChart, BarChart3, Download, Share2, Sparkles } from 'lucide-react';

// Analytics tracking utility
const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

const SwissFlag = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"  width={size} height={size} className={className}>
    <defs>
      <color id="zurichBlue" value="#0055A5"/>
      <color id="swissRed" value="#D52B1E"/>
    </defs>

    <g clipPath="url(#roundCorner)">
      <defs>
        <clipPath id="roundCorner">
          <rect x="0" y="0" width="64" height="64" rx="12" ry="12"/>
        </clipPath>
      </defs>

      <rect x="0" y="0" width="64" height="64" fill="#ffffff"/>
      <polygon points="0,64 64,64 64,0" fill="#0055A5"/>
    </g>

    <circle cx="32" cy="32" r="20" fill="#D52B1E"/>

    <path d="M22 32 L29 39 L42 24" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </svg>
);

import { QUESTIONS_DATA } from './questionsData';

// Utility to render plain text or trusted HTML snippets (used for image-based questions/options)
// eslint-disable-next-line no-unused-vars
const ContentBlock = ({ content, isHtml = false, className = "", as: Tag = 'span' }) => {
  if (isHtml) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <Tag className={className}>{content}</Tag>;
};


// --- COMPONENTS ---

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, icon: Icon }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
    outline: "border-2 border-red-600 text-red-600 hover:bg-red-50",
    correct: "bg-green-100 text-green-800 border-2 border-green-500",
    incorrect: "bg-red-100 text-red-800 border-2 border-red-500",
    neutral: "bg-white border-2 border-slate-200 hover:border-red-400 text-slate-700",
    text: "bg-transparent text-slate-500 hover:text-red-600 hover:bg-slate-50"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  </div>
);

// Social Share Modal Component
const SocialShareModal = ({ onClose, milestone }) => {
  const shareText = milestone === 'perfect_score' 
    ? `🎉 Ich habe gerade 15/15 richtig beim Grundkenntnistest Zürich geschafft! Perfekte Punktzahl! 🇨🇭 #Einbürgerung #GKTZürich`
    : `🎓 Ich habe gerade 100% Abdeckung beim Grundkenntnistest Zürich erreicht! Alle Fragen beantwortet! 🇨🇭 #Einbürgerung #GKTZürich`;
  
  const shareUrl = 'https://gktzh.app/';
  
  const handleShare = (platform) => {
    let url = '';
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }
    
    trackEvent('milestone_share', { 
      milestone: milestone,
      platform: platform 
    });
    
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const handleCopyLink = () => {
    const textToCopy = `${shareText}\n${shareUrl}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      trackEvent('milestone_copy_link', { milestone: milestone });
      alert('Text und Link kopiert!');
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 rounded-full p-4 animate-bounce">
              <Sparkles className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            {milestone === 'perfect_score' ? '🎉 Perfekt!' : '🎓 Meilenstein erreicht!'}
          </h2>
          
          <p className="text-lg text-slate-600 mb-6">
            {milestone === 'perfect_score' 
              ? 'Sie haben zum ersten Mal 15/15 richtig! Teilen Sie diesen Erfolg!'
              : 'Sie haben alle Fragen gesehen! 100% Abdeckung erreicht!'}
          </p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-700">
            {shareText}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1a8cd8] transition-colors"
            >
              <Share2 size={18} />
              Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center gap-2 bg-[#1877F2] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1664d8] transition-colors"
            >
              <Share2 size={18} />
              Facebook
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center justify-center gap-2 bg-[#0A66C2] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#094d92] transition-colors"
            >
              <Share2 size={18} />
              LinkedIn
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#20bd5a] transition-colors"
            >
              <Share2 size={18} />
              WhatsApp
            </button>
          </div>
          
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors mb-3"
          >
            <Share2 size={18} />
            Text & Link kopieren
          </button>
          
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-sm font-medium"
          >
            Später teilen
          </button>
        </div>
      </div>
    </div>
  );
};

const PieChartComponent = ({ data, centerText, centerSubtext }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <p>Keine Daten verfügbar</p>
      </div>
    );
  }
  
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  const innerRadius = 50; // For donut chart
  
  // Calculate cumulative angles to avoid mutation
  const cumulativeAngles = data.reduce((acc, item) => {
    const lastAngle = acc.length > 0 ? acc[acc.length - 1] : -90;
    const angle = (item.value / total) * 360;
    acc.push(lastAngle + angle);
    return acc;
  }, []);
  
  const paths = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const startAngle = index === 0 ? -90 : cumulativeAngles[index - 1];
    const endAngle = cumulativeAngles[index];
    
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate outer arc points
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    // Calculate inner arc points
    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');
    
    return (
      <g key={index}>
        <path d={pathData} fill={item.color} className="transition-opacity hover:opacity-80" />
      </g>
    );
  });
  
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="w-64 h-64">
          {paths}
          {centerText && (
            <g>
              <text x="100" y="95" textAnchor="middle" className="text-3xl font-bold fill-slate-800">
                {centerText}
              </text>
              {centerSubtext && (
                <text x="100" y="115" textAnchor="middle" className="text-sm fill-slate-500">
                  {centerSubtext}
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm text-slate-700">
              <span className="font-semibold">{item.label}:</span> {item.value} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChartComponent = ({ correct, incorrect }) => {
  const total = correct + incorrect;
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0;
  const incorrectPercentage = total > 0 ? (incorrect / total) * 100 : 0;
  const MIN_PERCENTAGE_TO_SHOW_LABEL = 10; // Minimum width percentage to display label inside bar
  
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-xl p-6 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-green-700 flex items-center gap-2">
              <CheckCircle size={16} /> Richtige Antworten
            </span>
            <span className="text-lg font-bold text-green-700">{correct}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
            <div 
              className="bg-green-500 h-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${correctPercentage}%` }}
            >
              {correctPercentage > MIN_PERCENTAGE_TO_SHOW_LABEL && <span className="text-xs font-bold text-white">{Math.round(correctPercentage)}%</span>}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-red-700 flex items-center gap-2">
              <XCircle size={16} /> Falsche Antworten
            </span>
            <span className="text-lg font-bold text-red-700">{incorrect}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
            <div 
              className="bg-red-500 h-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${incorrectPercentage}%` }}
            >
              {incorrectPercentage > MIN_PERCENTAGE_TO_SHOW_LABEL && <span className="text-xs font-bold text-white">{Math.round(incorrectPercentage)}%</span>}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Erfolgsquote Berechnung</h3>
          <div className={`text-3xl font-bold ${correctPercentage >= 80 ? 'text-green-600' : correctPercentage >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
            {Math.round(correctPercentage)}%
          </div>
        </div>
        <div className="text-sm text-slate-600 space-y-2">
          <p>Die Erfolgsquote wird wie folgt berechnet:</p>
          <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs">
            <div>Erfolgsquote = (Richtige Antworten ÷ Gesamt Versuche) × 100</div>
            <div className="mt-2 text-slate-800 font-semibold">
              = ({correct} ÷ {total}) × 100 = {Math.round(correctPercentage)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MILESTONE TRACKING UTILITIES ---

const useMilestones = () => {
  const [milestones, setMilestones] = useState(() => {
    try {
      const saved = localStorage.getItem('zurich-quiz-milestones');
      return saved ? JSON.parse(saved) : {
        first_perfect_score: false,
        full_coverage: false
      };
    } catch (e) {
      console.error("Failed to load milestones from localStorage", e);
      return {
        first_perfect_score: false,
        full_coverage: false
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('zurich-quiz-milestones', JSON.stringify(milestones));
    } catch (e) {
      console.error("Failed to save milestones to localStorage", e);
    }
  }, [milestones]);

  const checkAndSetMilestone = (milestoneKey) => {
    if (!milestones[milestoneKey]) {
      setMilestones(prev => ({
        ...prev,
        [milestoneKey]: true
      }));
      return true; // Milestone just achieved
    }
    return false; // Already achieved
  };

  return { milestones, checkAndSetMilestone };
};

// --- LOGIC: SMART LEARNING SYSTEM (WITH LOCAL STORAGE) ---

const useSmartLearning = () => {
  // Structure: { [questionId]: { correctCount: 0, incorrectCount: 0, lastResult: 'correct' | 'incorrect' } }
  
  // 1. Initialize from LocalStorage
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('zurich-quiz-progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
      return {};
    }
  });

  // 2. Save to LocalStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem('zurich-quiz-progress', JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  }, [progress]);

  // Function to reset progress
  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem('zurich-quiz-progress');
  };

  const updateProgress = (questionId, isCorrect) => {
    setProgress(prev => {
      const current = prev[questionId] || { correctCount: 0, incorrectCount: 0, lastResult: null };
      return {
        ...prev,
        [questionId]: {
          correctCount: current.correctCount + (isCorrect ? 1 : 0),
          incorrectCount: current.incorrectCount + (!isCorrect ? 1 : 0),
          lastResult: isCorrect ? 'correct' : 'incorrect'
        }
      };
    });
  };

  const getWeightedQuestions = (allQuestions, count = 15) => {
    // Weight calculation logic...
    const weightedQuestions = allQuestions.map(q => {
      const stats = progress[q.id] || { correctCount: 0, incorrectCount: 0, lastResult: null };
      
      const b = 4.2;
      const alpha = 4.4;
      const beta = 1.5;
      const gamma = -2.0;
      const delta = 1.4;
      const epsilon = 0.004;

      let weight = b;
      if (stats.lastResult === 'incorrect') weight += alpha;
      weight += beta * Math.min(stats.incorrectCount, 6); // Cap penalty
      if (stats.lastResult === null) weight += gamma;     // Deprioritize unseen
      weight -= delta * stats.correctCount;

      weight = Math.max(epsilon, weight);
      
      return { ...q, weight };
    });

    // Weighted random selection
    const selected = [];
    const pool = [...weightedQuestions];
    
    for (let i = 0; i < count; i++) {
      if (pool.length === 0) break;
      
      const totalWeight = pool.reduce((sum, q) => sum + q.weight, 0);
      let randomVal = Math.random() * totalWeight;
      
      let selectedIndex = -1;
      for (let j = 0; j < pool.length; j++) {
        randomVal -= pool[j].weight;
        if (randomVal <= 0) {
          selectedIndex = j;
          break;
        }
      }
      if (selectedIndex === -1) selectedIndex = pool.length - 1;

      selected.push(pool[selectedIndex]);
      pool.splice(selectedIndex, 1);
    }
    
    return selected;
  };

  const getWeakestQuestions = (allQuestions) => {
    return allQuestions.filter(q => {
      const stats = progress[q.id];
      return !stats || stats.incorrectCount > stats.correctCount || stats.lastResult === 'incorrect';
    });
  };

  return { progress, updateProgress, getWeightedQuestions, getWeakestQuestions, resetProgress };
};

// --- SCREENS ---

const WelcomeScreen = ({ onStart, onStartFlashcards, progress, onReset }) => {
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showSuccessRateModal, setShowSuccessRateModal] = useState(false);
  
  const totalAnswered = Object.keys(progress).length;
  const correctAnswers = Object.values(progress).reduce((sum, p) => sum + p.correctCount, 0);
  const totalAttempts = Object.values(progress).reduce((sum, p) => sum + p.correctCount + p.incorrectCount, 0);
  const incorrectAnswers = totalAttempts - correctAnswers;
  const masteryRate = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  
  // Calculate mastered questions (more correct than incorrect)
  const masteredCount = Object.values(progress).filter(p => p.correctCount > p.incorrectCount).length;
  const remaining = QUESTIONS_DATA.length - totalAnswered;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-8 animate-fade-in">
      <div className="space-y-4 max-w-2xl">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <SwissFlag size={64} />
        </div>
        <h1 className="text-4xl font-bold text-slate-800">Grundkenntnistest Zürich</h1>
        <p className="text-lg text-slate-600">
          Bereiten Sie sich optimal auf Ihr Einbürgerungsgespräch und den Kantonalen Test vor.
          Das System lernt mit und wiederholt schwierige Fragen öfter.
        </p>
      </div>

      {totalAnswered > 0 && (
        <div className="w-full max-w-md">
          <div className="flex gap-6 justify-center w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
            <div 
              className="text-center cursor-pointer hover:bg-slate-50 rounded-lg p-2 transition-colors group"
              onClick={() => {
                trackEvent('view_questions_modal', { 
                  total_answered: totalAnswered,
                  mastered_count: masteredCount 
                });
                setShowQuestionsModal(true);
              }}
            >
              <div className="text-2xl font-bold text-slate-800 group-hover:text-red-600 transition-colors">{totalAnswered}</div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1 justify-center">
                <PieChart size={12} /> Fragen gesehen
              </div>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div 
              className="text-center cursor-pointer hover:bg-slate-50 rounded-lg p-2 transition-colors group"
              onClick={() => {
                trackEvent('view_success_rate_modal', { 
                  mastery_rate: masteryRate,
                  correct_answers: correctAnswers,
                  total_attempts: totalAttempts 
                });
                setShowSuccessRateModal(true);
              }}
            >
              <div className={`text-2xl font-bold ${masteryRate >= 80 ? 'text-green-600' : 'text-slate-800'} group-hover:text-red-600 transition-colors`}>{masteryRate}%</div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1 justify-center">
                <BarChart3 size={12} /> Erfolgsquote
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              trackEvent('progress_reset', { 
                questions_seen: totalAnswered,
                mastery_rate: masteryRate 
              });
              onReset();
            }}
            className="text-xs text-red-400 hover:text-red-600 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <Trash2 size={12} /> Fortschritt zurücksetzen
          </button>
        </div>
      )}

      {/* Questions Seen Modal */}
      {showQuestionsModal && (
        <Modal title="Fragen Übersicht" onClose={() => setShowQuestionsModal(false)}>
          <div className="space-y-6">
            <p className="text-slate-600 text-center">
              Ihr Lernfortschritt im Überblick
            </p>
            <PieChartComponent
              data={[
                { label: 'Gemeistert', value: masteredCount, color: '#10b981' },
                { label: 'Gesehen', value: totalAnswered - masteredCount, color: '#f59e0b' },
                { label: 'Verbleibend', value: remaining, color: '#e2e8f0' }
              ]}
              centerText={`${totalAnswered}`}
              centerSubtext={`von ${QUESTIONS_DATA.length}`}
            />
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-slate-600 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" /> Gemeistert
                </span>
                <span className="font-semibold">{masteredCount} Fragen</span>
              </div>
              <p className="text-xs text-slate-500 ml-6">Fragen mit mehr richtigen als falschen Antworten</p>
              <div className="flex justify-between mt-2">
                <span className="text-slate-600">📚 Gesehen (noch nicht gemeistert)</span>
                <span className="font-semibold">{totalAnswered - masteredCount} Fragen</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-slate-600">⏳ Verbleibend</span>
                <span className="font-semibold">{remaining} Fragen</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Success Rate Modal */}
      {showSuccessRateModal && (
        <Modal title="Erfolgsquote Details" onClose={() => setShowSuccessRateModal(false)}>
          <div className="space-y-6">
            <p className="text-slate-600 text-center">
              Verstehen Sie, wie Ihre Erfolgsquote berechnet wird
            </p>
            <BarChartComponent correct={correctAnswers} incorrect={incorrectAnswers} />
          </div>
        </Modal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => {
          trackEvent('start_quiz', { source: 'card_click' });
          onStart();
        }}>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
              <BookOpen className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Smart Quiz</h3>
            <p className="text-slate-500 text-sm">
              Intelligenter Testmodus. Fragen, die Sie falsch beantworten, kommen öfter dran.
            </p>
            <Button 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                trackEvent('start_quiz', { source: 'button_click' });
                onStart();
              }}
            >
              <Zap size={18} /> Quiz Starten
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => {
          trackEvent('start_flashcards', { source: 'card_click' });
          onStartFlashcards();
        }}>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
              <Layers className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Lernkarten</h3>
            <p className="text-slate-500 text-sm">
              Lernen Sie entspannt. Sie können wählen, ob Sie alle oder nur schwierige Karten sehen wollen.
            </p>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                trackEvent('start_flashcards', { source: 'button_click' });
                onStartFlashcards();
              }}
            >
              Karten Öffnen
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => {
          trackEvent('open_video_playlist', { source: 'card_click' });
          window.open('https://www.youtube.com/playlist?list=PLg1iF-QfOu4_3pMJTx1noY9Hj939cBamq', '_blank', 'noopener');
        }}>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-amber-50 rounded-full group-hover:bg-amber-100 transition-colors">
              <PlayCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Video Playlist</h3>
            <p className="text-slate-500 text-sm text-center">
              Erklärvideos zum Grundkenntnistest. Öffnet in YouTube und ist offline speicherbar.
            </p>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                trackEvent('open_video_playlist', { source: 'button_click' });
                window.open('https://www.youtube.com/playlist?list=PLg1iF-QfOu4_3pMJTx1noY9Hj939cBamq', '_blank', 'noopener');
              }}
            >
              Videos ansehen
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const QuizScreen = ({ questions, onFinish, onExit, onAnswer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showTranslate, setShowTranslate] = useState(false);
  // Generate a random session seed once when the quiz starts
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1000000));
  const currentQuestion = questions[currentIndex];

  // Shuffle options for the current question
  const shuffledIndices = useMemo(() => {
    const numOptions = (showTranslate ? currentQuestion.optionsEn : currentQuestion.options).length;
    const indices = Array.from({ length: numOptions }, (_, i) => i);
    
    // Seeded random shuffle using session seed + question ID for varied shuffling per test
    const seed = sessionSeed + currentQuestion.id;
    const seededRandom = (index) => {
      // Linear congruential generator with seed and index
      const x = (seed + index) * 9301 + 49297;
      return (x % 233280) / 233280;
    };
    
    // Fisher-Yates shuffle using seeded random
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i) * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [sessionSeed, currentQuestion.id, currentQuestion.options, currentQuestion.optionsEn, showTranslate]);

  const handleOptionClick = (shuffledIndex) => {
    if (isAnswered) return;
    setSelectedOption(shuffledIndex);
    setIsAnswered(true);
    
    // Map shuffled index back to original index to check correctness
    const originalIndex = shuffledIndices[shuffledIndex];
    const isCorrect = originalIndex === currentQuestion.correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Track answer
    trackEvent('quiz_answer', {
      question_id: currentQuestion.id,
      category: currentQuestion.category,
      level: currentQuestion.level,
      is_correct: isCorrect,
      question_number: currentIndex + 1,
      total_questions: questions.length
    });
    
    // Track incorrect answers separately for easier analysis
    if (!isCorrect) {
      trackEvent('question_incorrect', {
        question_id: currentQuestion.id,
        category: currentQuestion.category,
        level: currentQuestion.level,
        question_text: currentQuestion.question.substring(0, 100), // First 100 chars for identification
        question_number: currentIndex + 1
      });
    }
    
    // Update Smart Learning System
    onAnswer(currentQuestion.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowTranslate(false);
    } else {
      onFinish(score, questions.length);
    }
  };

  // Progress Bar
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const displayQuestion = showTranslate ? currentQuestion.questionEn : currentQuestion.question;
  const displayOptions = showTranslate ? currentQuestion.optionsEn : currentQuestion.options;
  
  // Create shuffled options array
  const shuffledOptions = shuffledIndices.map(originalIdx => displayOptions[originalIdx]);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => {
          trackEvent('quiz_exit', { 
            questions_completed: currentIndex,
            total_questions: questions.length 
          });
          onExit();
        }} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
          <Home size={16} /> Beenden
        </button>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => {
               const newValue = !showTranslate;
               trackEvent('toggle_translation', { 
                 language: newValue ? 'en' : 'de',
                 screen: 'quiz' 
               });
               setShowTranslate(newValue);
             }}
             className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition-colors ${showTranslate ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Globe size={16} />
             {showTranslate ? 'Deutsch' : 'English'}
           </button>
           <span className="text-sm font-bold text-slate-500">
             Frage {currentIndex + 1} / {questions.length}
           </span>
        </div>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-red-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase rounded-full tracking-wide">
              {currentQuestion.category}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-full tracking-wide">
              {currentQuestion.level}
            </span>
          </div>
          <ContentBlock
            as="h2"
            content={displayQuestion}
            isHtml={currentQuestion.questionHtml}
            className={`text-2xl font-bold text-slate-800 leading-snug min-h-[4rem] ${currentQuestion.questionHtml ? 'question-html' : ''}`}
          />
        </div>

        <div className="space-y-3">
          {shuffledOptions.map((option, shuffledIdx) => {
            let variant = "neutral";
            if (isAnswered) {
              // Check if this shuffled position contains the correct answer
              const originalIdx = shuffledIndices[shuffledIdx];
              if (originalIdx === currentQuestion.correct) variant = "correct";
              else if (shuffledIdx === selectedOption) variant = "incorrect";
            } else if (shuffledIdx === selectedOption) {
              variant = "outline";
            }

            return (
              <button
                key={shuffledIdx}
                onClick={() => handleOptionClick(shuffledIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex justify-between items-center group min-h-[80px] ${currentQuestion.optionsHtml ? 'option-button-html' : ''}
                  ${variant === 'neutral' ? 'border-slate-200 hover:border-red-300 hover:bg-red-50' : ''}
                  ${variant === 'correct' ? 'border-green-500 bg-green-50 text-green-900' : ''}
                  ${variant === 'incorrect' ? 'border-red-500 bg-red-50 text-red-900 opacity-60' : ''}
                `}
              >
                <ContentBlock
                  content={option}
                  isHtml={currentQuestion.optionsHtml}
                  className={`font-medium text-lg ${currentQuestion.optionsHtml ? 'option-html' : ''}`}
                />
                {variant === 'correct' && <CheckCircle className="text-green-600 shrink-0" />}
                {variant === 'incorrect' && <XCircle className="text-red-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 flex justify-end animate-fade-in">
            <Button onClick={handleNext} className="px-8 py-3 text-lg">
              {currentIndex === questions.length - 1 ? "Ergebnis ansehen" : "Nächste Frage"}
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

const FlashcardScreen = ({ questions, weakestQuestions, onExit }) => {
  const [mode, setMode] = useState('all'); // 'all' or 'weak'
  const activeSet = mode === 'all' ? questions : weakestQuestions;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  // Reset index when mode changes by handling it in the mode setter
  const handleModeChange = (newMode) => {
    trackEvent('flashcard_mode_change', { 
      new_mode: newMode,
      previous_mode: mode 
    });
    setMode(newMode);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowTranslate(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSet.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowTranslate(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeSet.length) % activeSet.length);
    }, 200);
  };

  // Guard for empty weakest set
  if (activeSet.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Alles perfekt!</h2>
        <p className="text-slate-600 mb-6">Sie haben momentan keine "schwierigen" Fragen markiert. Super!</p>
        <div className="flex gap-4">
          <Button onClick={() => handleModeChange('all')}>Alle Karten anzeigen</Button>
          <Button variant="secondary" onClick={onExit}>Zurück</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = activeSet[currentIndex];
  const displayQuestion = showTranslate ? currentQuestion.questionEn : currentQuestion.question;
  const displayAnswer = showTranslate ? currentQuestion.optionsEn[currentQuestion.correct] : currentQuestion.options[currentQuestion.correct];

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col items-center h-[85vh]">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium">
          <Home size={18} /> Zurück
        </button>
        <div className="flex gap-2">
          {/* Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
            <button 
              onClick={() => handleModeChange('all')}
              className={`px-3 py-1 rounded-md transition-colors ${mode === 'all' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              Alle
            </button>
            <button 
              onClick={() => handleModeChange('weak')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${mode === 'weak' ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}
            >
              <Brain size={14} /> Fokus ({weakestQuestions.length})
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end mb-4">
         <button 
             onClick={() => {
               const newValue = !showTranslate;
               trackEvent('toggle_translation', { 
                 language: newValue ? 'en' : 'de',
                 screen: 'flashcards' 
               });
               setShowTranslate(newValue);
             }}
             className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition-colors ${showTranslate ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Globe size={16} />
             {showTranslate ? 'Deutsch' : 'English'}
           </button>
      </div>

      <div className="flex-1 w-full perspective-1000 relative group cursor-pointer" onClick={() => {
        const newFlipped = !isFlipped;
        if (newFlipped) {
          trackEvent('flashcard_flip', { 
            mode: mode,
            question_id: currentQuestion.id 
          });
        }
        setIsFlipped(newFlipped);
      }}>
        <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden">
            <Card className="h-full flex flex-col justify-center items-center p-8 text-center bg-white border-b-4 border-b-red-600">
               <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500 font-bold uppercase">{currentQuestion.category}</span>
                <span className="px-2 py-1 bg-red-50 rounded text-xs text-red-600 font-bold uppercase">{currentQuestion.level}</span>
               </div>
               <div className="w-full max-h-[60vh] overflow-auto flex flex-col items-center gap-4 px-2">
                 <ContentBlock
                   as="h3"
                   content={displayQuestion}
                   isHtml={currentQuestion.questionHtml}
                   className={`text-2xl font-bold text-slate-800 leading-relaxed ${currentQuestion.questionHtml ? 'question-html card-html' : ''}`}
                 />
                 <p className="text-slate-400 text-sm animate-pulse">Klicken zum Umdrehen</p>
               </div>
            </Card>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <Card className="h-full flex flex-col justify-center items-center p-8 text-center bg-red-50 border-b-4 border-b-red-600">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Richtige Antwort</h3>
              <div className="w-full max-h-[60vh] overflow-auto flex items-center justify-center px-2">
                <ContentBlock
                  as="p"
                  content={displayAnswer}
                  isHtml={currentQuestion.optionsHtml}
                  className={`text-2xl font-medium text-red-900 leading-relaxed text-center ${currentQuestion.optionsHtml ? 'option-html card-html' : ''}`}
                />
              </div>
            </Card>
          </div>

        </div>
      </div>

      <div className="flex gap-4 mt-8 w-full justify-center items-center">
        <Button variant="secondary" onClick={handlePrev} className="px-6">
           <ChevronLeft size={20} /> Zurück
        </Button>
        <span className="text-slate-400 font-medium text-sm">
          {currentIndex + 1} / {activeSet.length}
        </span>
        <Button onClick={handleNext} className="px-6">
           Nächste Karte <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

const ResultScreen = ({ score, total, onRestart, onHome, checkAndSetMilestone }) => {
  const percentage = Math.round((score / total) * 100);
  const [showShareModal, setShowShareModal] = useState(false);
  const [achievedMilestone, setAchievedMilestone] = useState(null);
  
  let message = "";
  let subMessage = "";
  
  if (percentage >= 90) {
    message = "Hervorragend!";
    subMessage = "Sie sind bestens vorbereitet. Das System hat Ihre Ergebnisse gespeichert.";
  } else if (percentage >= 70) {
    message = "Gut gemacht!";
    subMessage = "Solide Leistung. Wir werden die schwierigen Fragen beim nächsten Mal wiederholen.";
  } else {
    message = "Weiter üben!";
    subMessage = "Keine Sorge, das System merkt sich Ihre Fehler und hilft Ihnen beim Lernen.";
  }

  // Track quiz completion and check for perfect score milestone
  useEffect(() => {
    trackEvent('quiz_complete', {
      score: score,
      total: total,
      percentage: percentage,
      performance_level: percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'needs_practice'
    });
    
    // Check for perfect score milestone (15/15)
    if (score === total && total === 15 && checkAndSetMilestone) {
      const isNew = checkAndSetMilestone('first_perfect_score');
      if (isNew) {
        trackEvent('milestone_achieved', { 
          milestone: 'first_perfect_score',
          score: score,
          total: total 
        });
        // Schedule state updates to avoid cascading renders
        setTimeout(() => {
          setAchievedMilestone('perfect_score');
          setShowShareModal(true);
        }, 0);
      }
    }
  }, [score, total, percentage, checkAndSetMilestone]);

  return (
    <>
      {showShareModal && achievedMilestone && (
        <SocialShareModal 
          onClose={() => setShowShareModal(false)}
          milestone={achievedMilestone}
        />
      )}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="relative mb-8">
        <Trophy className={`w-32 h-32 ${percentage >= 70 ? 'text-yellow-400' : 'text-slate-300'}`} />
        {percentage >= 70 && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
            {percentage}%
          </div>
        )}
      </div>

      <h2 className="text-4xl font-bold text-slate-800 mb-2">{message}</h2>
      <p className="text-xl text-slate-600 mb-8 max-w-md">{subMessage}</p>

      <Card className="p-6 mb-8 w-full max-w-sm bg-slate-50">
        <div className="flex justify-between items-center text-lg font-medium border-b border-slate-200 pb-4 mb-4">
          <span className="text-slate-600">Erreichte Punkte</span>
          <span className="text-slate-900 font-bold">{score} / {total}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-medium">
          <span className="text-slate-600">Quote</span>
          <span className={`font-bold ${percentage >= 60 ? 'text-green-600' : 'text-red-500'}`}>{percentage}%</span>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button onClick={() => {
          trackEvent('quiz_restart', { 
            previous_score: score,
            previous_percentage: percentage 
          });
          onRestart();
        }} className="flex-1">
          <RefreshCw size={18} /> Nochmals versuchen
        </Button>
        <Button variant="secondary" onClick={() => {
          trackEvent('return_home', { source: 'result_screen' });
          onHome();
        }} className="flex-1">
          <Home size={18} /> Hauptmenü
        </Button>
      </div>
      </div>
    </>
  );
};

// --- APP CONTAINER ---

// Check if app is already installed
const isAlreadyInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
};

const App = () => {
  const [screen, setScreen] = useState('welcome'); // welcome, quiz, flashcards, results
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  
  // Initialize Smart Learning Hook (Persistence handled inside)
  const { progress, updateProgress, getWeightedQuestions, getWeakestQuestions, resetProgress } = useSmartLearning();
  
  // Initialize Milestones Hook
  const { checkAndSetMilestone } = useMilestones();
  const [showShareModal, setShowShareModal] = useState(false);
  const [achievedMilestone, setAchievedMilestone] = useState(null);

  // Listen for install events
  useEffect(() => {
    const handleAppInstallable = () => {
      // Only show install button if not already installed
      if (!isAlreadyInstalled()) {
        setIsInstallable(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      // Show a success message briefly
      setTimeout(() => setIsInstalled(false), 3000);
    };

    window.addEventListener('appinstallable', handleAppInstallable);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstallable', handleAppInstallable);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  
  // Check for 100% question coverage milestone
  useEffect(() => {
    const totalAnswered = Object.keys(progress).length;
    if (totalAnswered === QUESTIONS_DATA.length && totalAnswered > 0) {
      const isNew = checkAndSetMilestone('full_coverage');
      if (isNew) {
        trackEvent('milestone_achieved', { 
          milestone: 'full_coverage',
          total_questions: QUESTIONS_DATA.length 
        });
        // Schedule state updates to avoid cascading renders
        setTimeout(() => {
          setAchievedMilestone('full_coverage');
          setShowShareModal(true);
        }, 0);
      }
    }
  }, [progress, checkAndSetMilestone]);

  const handleInstallClick = async () => {
    if (window.showInstallPrompt) {
      await window.showInstallPrompt();
    }
  };

  const startQuiz = () => {
    // Get questions weighted by difficulty/history
    const selection = getWeightedQuestions(QUESTIONS_DATA, 15);
    setActiveQuestions(selection);
    setScore(0);
    setScreen('quiz');
    
    // Track quiz start with question metadata
    const categories = selection.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {});
    const levels = selection.reduce((acc, q) => {
      acc[q.level] = (acc[q.level] || 0) + 1;
      return acc;
    }, {});
    
    trackEvent('quiz_start', {
      question_count: selection.length,
      categories: JSON.stringify(categories),
      levels: JSON.stringify(levels)
    });
  };

  const startFlashcards = () => {
    // Pass all questions to flashcards, logic handles filtering inside component
    setActiveQuestions(QUESTIONS_DATA); 
    setScreen('flashcards');
  };

  const finishQuiz = (finalScore, total) => {
    setScore(finalScore);
    setQuestionCount(total);
    setScreen('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Social Share Modal for 100% Coverage */}
      {showShareModal && achievedMilestone && (
        <SocialShareModal 
          onClose={() => setShowShareModal(false)}
          milestone={achievedMilestone}
        />
      )}
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('welcome')}>
            <SwissFlag size={28} className="drop-shadow-sm" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">Zürich<span className="text-red-600">Einbürgerung</span></span>
          </div>
          <div className="flex items-center gap-4">
             {screen !== 'welcome' && (
               <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">
                  {screen === 'quiz' ? 'Prüfung' : screen === 'flashcards' ? 'Training' : 'Ergebnis'}
               </span>
             )}
             {isInstallable && (
               <button
                 onClick={handleInstallClick}
                 className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm shadow-md"
                 title="App installieren"
               >
                 <Download size={16} />
                 <span className="hidden sm:inline">Installieren</span>
               </button>
             )}
             {isInstalled && (
               <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg font-medium text-sm animate-fade-in">
                 <CheckCircle size={16} />
                 <span className="hidden sm:inline">Installiert!</span>
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:py-8">
        {screen === 'welcome' && (
          <WelcomeScreen 
            onStart={startQuiz} 
            onStartFlashcards={startFlashcards} 
            progress={progress} 
            onReset={resetProgress}
          />
        )}
        {screen === 'quiz' && (
          <QuizScreen 
            questions={activeQuestions} 
            onAnswer={updateProgress}
            onFinish={finishQuiz} 
            onExit={() => setScreen('welcome')} 
          />
        )}
        {screen === 'flashcards' && (
          <FlashcardScreen 
            questions={QUESTIONS_DATA}
            weakestQuestions={getWeakestQuestions(QUESTIONS_DATA)}
            onExit={() => setScreen('welcome')} 
          />
        )}
        {screen === 'results' && (
          <ResultScreen 
            score={score} 
            total={questionCount} 
            onRestart={startQuiz} 
            onHome={() => setScreen('welcome')}
            checkAndSetMilestone={checkAndSetMilestone}
          />
        )}
      </main>

      {/* Styles for flip animation */}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;