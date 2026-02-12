'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { TypingAnimation } from '@/components/ui/typing-animation';

interface DemoEntry {
  prompt: string;
  market: { tam: string; cagr: string; detail: string };
  competitors: { count: number; names: string; detail: string };
  difficulty: { score: string; label: string };
}

const DEMO_DATA: DemoEntry[] = [
  {
    prompt: 'An AI-powered personal finance app that helps millennials save and invest automatically',
    market: { tam: '$8.7B', cagr: '18.3%', detail: '4 segments identified' },
    competitors: { count: 5, names: 'Acorns, Wealthfront, Qapital', detail: 'High competition in robo-advisory' },
    difficulty: { score: '7.4', label: 'High – regulatory hurdles' },
  },
  {
    prompt: 'A marketplace connecting local farmers directly with urban restaurants',
    market: { tam: '$3.2B', cagr: '14.1%', detail: '2 segments identified' },
    competitors: { count: 4, names: 'Barn2Door, FarmLogics, LocalLine', detail: 'Fragmented regional players' },
    difficulty: { score: '5.8', label: 'Moderate – logistics complexity' },
  },
  {
    prompt: 'A browser extension that summarizes any webpage into key takeaways using AI',
    market: { tam: '$1.9B', cagr: '24.6%', detail: '3 segments identified' },
    competitors: { count: 6, names: 'TLDR, Summari, Wordtune', detail: 'Fast-moving AI space' },
    difficulty: { score: '4.2', label: 'Low – lean MVP possible' },
  },
  {
    prompt: 'A platform for remote teams to run async standups and retrospectives',
    market: { tam: '$5.1B', cagr: '21.2%', detail: '3 segments identified' },
    competitors: { count: 7, names: 'Geekbot, Range, Standuply', detail: 'Crowded but room for niche' },
    difficulty: { score: '5.5', label: 'Moderate – integration heavy' },
  },
  {
    prompt: 'A subscription box for sustainable, zero-waste household products',
    market: { tam: '$2.8B', cagr: '16.7%', detail: '2 segments identified' },
    competitors: { count: 3, names: 'Package Free, EarthHero, Blueland', detail: 'Growing consumer demand' },
    difficulty: { score: '6.1', label: 'Moderate – supply chain risk' },
  },
];

const HOLD_DURATION = 3500;
const FADE_DURATION = 400;

export default function InsightsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.2, once: true });
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [typingKey, setTypingKey] = useState(0);

  // Start the demo when the section scrolls into view
  useEffect(() => {
    if (isInView && !started) {
      setStarted(true);
    }
  }, [isInView, started]);

  const entry = DEMO_DATA[currentIndex];

  const handleTypingComplete = useCallback(() => {
    setShowCards(true);
    // Small delay before triggering the staggered card animations
    requestAnimationFrame(() => setCardsVisible(true));
  }, []);

  // After cards are shown, hold, then cycle to next
  useEffect(() => {
    if (!cardsVisible) return;

    const holdTimer = setTimeout(() => {
      // Fade out cards
      setCardsVisible(false);

      const fadeTimer = setTimeout(() => {
        setShowCards(false);
        // Advance to next prompt
        setCurrentIndex((prev) => (prev + 1) % DEMO_DATA.length);
        setTypingKey((prev) => prev + 1);
      }, FADE_DURATION);

      return () => clearTimeout(fadeTimer);
    }, HOLD_DURATION);

    return () => clearTimeout(holdTimer);
  }, [cardsVisible]);

  const getDifficultyColor = (score: string) => {
    const num = parseFloat(score);
    if (num >= 7) return 'text-error-500';
    if (num >= 5) return 'text-warning-500';
    return 'text-accent-500';
  };

  return (
    <div ref={containerRef} className='w-full h-dvh flex flex-col items-center justify-center gap-5'>
      <h1
        className='text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-8'
        style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
      >
        Get The Best Insights
      </h1>

      {/* Typing input box */}
      <div className='w-full px-6 py-2 rounded-[10px] border border-white/15 bg-white/5 ring-1 ring-primary-500 shadow-lg shadow-primary-500/20'>
        {started && (
          <TypingAnimation
            key={typingKey}
            className='text-white text-sm sm:text-base'
            blinkCursor={true}
            typeSpeed={50}
            loop={false}
            showCursor={true}
            startOnView={false}
            words={[entry.prompt]}
            onComplete={handleTypingComplete}
          />
        )}
      </div>

      {/* Insight cards */}
      <div className='mt-8 w-full grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <AnimatePresence mode='wait'>
          {showCards && (
            <>
              <motion.div
                key={`market-${currentIndex}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: cardsVisible ? 1 : 0, y: cardsVisible ? 0 : 16 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, delay: 0 }}
                className='rounded-[10px] border border-white/15 bg-white/5 p-4'
              >
                <p className='text-white/50 text-xs font-medium uppercase tracking-wider mb-2'>Market Analysis</p>
                <p className='text-white/90 text-sm'>TAM: {entry.market.tam}</p>
                <p className='text-white/90 text-sm'>CAGR: {entry.market.cagr}</p>
                <p className='text-white/60 text-xs mt-1'>{entry.market.detail}</p>
              </motion.div>

              <motion.div
                key={`competitors-${currentIndex}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: cardsVisible ? 1 : 0, y: cardsVisible ? 0 : 16 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, delay: 0.12 }}
                className='rounded-[10px] border border-white/15 bg-white/5 p-4'
              >
                <p className='text-white/50 text-xs font-medium uppercase tracking-wider mb-2'>Competitor Intel</p>
                <p className='text-white/90 text-sm'>{entry.competitors.count} direct competitors</p>
                <p className='text-white/90 text-sm'>Notable: {entry.competitors.names}</p>
                <p className='text-white/60 text-xs mt-1'>{entry.competitors.detail}</p>
              </motion.div>

              <motion.div
                key={`difficulty-${currentIndex}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: cardsVisible ? 1 : 0, y: cardsVisible ? 0 : 16 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, delay: 0.24 }}
                className='rounded-[10px] border border-white/15 bg-white/5 p-4'
              >
                <p className='text-white/50 text-xs font-medium uppercase tracking-wider mb-2'>Difficulty Score</p>
                <p className={`text-2xl font-bold ${getDifficultyColor(entry.difficulty.score)}`}>
                  {entry.difficulty.score}<span className='text-white/50 text-base font-normal'>/10</span>
                </p>
                <p className='text-white/60 text-xs mt-1'>{entry.difficulty.label}</p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
