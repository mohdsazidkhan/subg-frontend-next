'use client';

import React, { useState, useEffect } from 'react';
import { FaTrophy, FaStar, FaLock, FaCheckCircle, FaRocket, FaBrain, FaChartLine, FaAward } from 'react-icons/fa';
import UnifiedNavbar from '../UnifiedNavbar';
import UnifiedFooter from '../UnifiedFooter';
import MobileAppWrapper from '../MobileAppWrapper';

const LevelsPage = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    // Mock levels data - replace with actual API call
    const mockLevels = [
      { id: 1, name: 'Starter', description: 'Begin your quiz journey', requiredQuizzes: 0, unlocked: true, completed: true },
      { id: 2, name: 'Rookie', description: 'Basic knowledge builder', requiredQuizzes: 10, unlocked: true, completed: true },
      { id: 3, name: 'Explorer', description: 'Expand your horizons', requiredQuizzes: 25, unlocked: true, completed: false },
      { id: 4, name: 'Thinker', description: 'Deep thinking required', requiredQuizzes: 50, unlocked: false, completed: false },
      { id: 5, name: 'Strategist', description: 'Strategic knowledge', requiredQuizzes: 100, unlocked: false, completed: false },
      { id: 6, name: 'Master', description: 'Master of knowledge', requiredQuizzes: 200, unlocked: false, completed: false },
      { id: 7, name: 'Expert', description: 'Expert level achieved', requiredQuizzes: 350, unlocked: false, completed: false },
      { id: 8, name: 'Champion', description: 'Champion status', requiredQuizzes: 500, unlocked: false, completed: false },
      { id: 9, name: 'Legend', description: 'Legendary knowledge', requiredQuizzes: 750, unlocked: false, completed: false },
      { id: 10, name: 'Mythical', description: 'Mythical status', requiredQuizzes: 1000, unlocked: false, completed: false },
    ];
    
    setLevels(mockLevels);
    setLoading(false);
  }, []);

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Starter': return FaRocket;
      case 'Rookie': return FaStar;
      case 'Explorer': return FaBrain;
      case 'Thinker': return FaChartLine;
      case 'Strategist': return FaAward;
      case 'Master': return FaTrophy;
      case 'Expert': return FaTrophy;
      case 'Champion': return FaTrophy;
      case 'Legend': return FaTrophy;
      case 'Mythical': return FaTrophy;
      default: return FaStar;
    }
  };

  const getLevelColor = (level, unlocked, completed) => {
    if (completed) return 'from-green-500 to-green-600';
    if (unlocked) return 'from-blue-500 to-blue-600';
    return 'from-gray-400 to-gray-500';
  };

  if (loading) {
    return (
      <MobileAppWrapper>
        <UnifiedNavbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading levels...</p>
          </div>
        </div>
        <UnifiedFooter />
      </MobileAppWrapper>
    );
  }

  return (
    <MobileAppWrapper>
      <UnifiedNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Levels
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Progress through different levels by completing quizzes and improving your knowledge
            </p>
          </div>

          {/* Current Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Level</h2>
                <p className="text-gray-600 dark:text-gray-300">Keep going to unlock more levels!</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{currentLevel}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Level</div>
              </div>
            </div>
          </div>

          {/* Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => {
              const IconComponent = getLevelIcon(level.name);
              const isLocked = !level.unlocked;
              
              return (
                <div
                  key={level.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 ${
                    isLocked ? 'opacity-60' : 'hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {/* Level Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r ${getLevelColor(level.name, level.unlocked, level.completed)}`}>
                    {isLocked ? (
                      <FaLock className="text-white text-2xl" />
                    ) : (
                      <IconComponent className="text-white text-2xl" />
                    )}
                  </div>

                  {/* Level Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {level.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {level.description}
                    </p>
                    
                    {/* Progress Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Required Quizzes:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{level.requiredQuizzes}</span>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="mt-4">
                        {level.completed ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <FaCheckCircle className="mr-1" />
                            Completed
                          </div>
                        ) : level.unlocked ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            Available
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                            <FaLock className="mr-1" />
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Locked Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-gray-900/20 rounded-xl flex items-center justify-center">
                      <FaLock className="text-white text-3xl" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Level Benefits */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Level Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <FaTrophy className="text-4xl mb-4 mx-auto text-yellow-300" />
                <h3 className="text-xl font-semibold mb-2">Unlock Rewards</h3>
                <p className="text-blue-100">Higher levels unlock better rewards and prizes</p>
              </div>
              <div className="text-center">
                <FaBrain className="text-4xl mb-4 mx-auto text-green-300" />
                <h3 className="text-xl font-semibold mb-2">Advanced Quizzes</h3>
                <p className="text-blue-100">Access more challenging and specialized quizzes</p>
              </div>
              <div className="text-center">
                <FaAward className="text-4xl mb-4 mx-auto text-purple-300" />
                <h3 className="text-xl font-semibold mb-2">Recognition</h3>
                <p className="text-blue-100">Get recognized for your knowledge and achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UnifiedFooter />
    </MobileAppWrapper>
  );
};

export default LevelsPage;