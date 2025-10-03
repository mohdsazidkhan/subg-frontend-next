'use client'
import MobileAppWrapper from '../MobileAppWrapper';
import UnifiedNavbar from '../UnifiedNavbar';
import UnifiedFooter from '../UnifiedFooter';

const HowItWorks = () => (
  <MobileAppWrapper title="How It Works">
    {/* Desktop Header */}
    <UnifiedNavbar />
    <div className="min-h-screen bg-subg-light dark:bg-subg-dark">
      <div className="max-w-4xl mx-auto p-4 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <h1 className="text-xl lg:text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
        How It Works
      </h1>

      <ol className="space-y-6 list-decimal list-inside text-base leading-relaxed">
        <li>
          <strong>Register / Login: </strong>
          Sign up using your mobile number or email to create your SUBG QUIZ account.
        </li>

        <li>
          <strong>Choose Subscription & Access Levels: </strong>
          Access quizzes based on your subscription:
          <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Free Plan – Levels 0 to 3</li>
            <li>Basic Plan – Levels 0 to 6</li>
            <li>Premium Plan – Levels 0 to 9</li>
            <li>Pro Plan – All Levels (0 to 10)</li>
          </ul>
        </li>

        <li>
          <strong>Play Timed Quizzes: </strong>
          Participate in daily multiple-choice quizzes. Each quiz is skill-based and carefully curated.
        </li>

        <li>
          <strong>Track Progress: </strong>
          View your quiz performance, accuracy stats, and level advancement in your dashboard.
        </li>

        <li>
          <strong>Monthly Rewards System: </strong>
          Every month, rewards are given to the <strong>Top 10 eligible users</strong> who meet these criteria:
          <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Reached Level 10 (330 total quiz attempts)</li>
            <li>Have at least 330 high-score quizzes (≥75% accuracy)</li>
            <li>Rank in Top 10 on monthly leaderboard</li>
          </ul>
          <p className="mt-2 text-sm">
            <strong>Ranking is based on:</strong> 1) Highest Average Quiz Score, 2) Highest Accuracy, 3) Total Score, 4) Total Quizzes Played.
            In case of a tie, these same metrics are used again in order as tie-breakers.
          </p>
        </li>

        <li>
          <strong>Result & Prize Distribution: </strong>
          Results are declared on the <strong>last day of every month after 9:00 PM</strong>. The Top 10 winners receive their rewards from ₹10,000 total pool within <strong>7 days</strong>.
        </li>
      </ol>

      <p className="mt-8 text-sm text-orange-400 font-semibold">
        Note: SUBG QUIZ is a 100% skill-based platform. There is no gambling or betting involved. Rewards are purely based on consistent knowledge, accuracy, and performance.
      </p>
      </div>
    </div>
    {/* Desktop Footer */}
    <UnifiedFooter />
  </MobileAppWrapper>
)

export default HowItWorks
