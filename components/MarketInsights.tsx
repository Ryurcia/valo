import { MarketAnalysis, CompetitiveAnalysis } from '@/types';

interface MarketInsightsProps {
  marketAnalysis: MarketAnalysis | null;
  competitors: CompetitiveAnalysis | null;
  difficulty: string | null;
}

export default function MarketInsights({
  marketAnalysis,
  competitors,
  difficulty,
}: MarketInsightsProps) {
  if (!marketAnalysis && !competitors && !difficulty) {
    return (
      <div className='p-6 bg-surface-variant rounded-lg'>
        <p className='text-white/50 text-center text-sm'>
          Market insights are being generated...
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold text-white'>Market Insights</h2>

      {/* Market Analysis Grid */}
      {marketAnalysis && (
        <div className='grid grid-cols-2 gap-3'>
          <div className='p-4 bg-surface-variant rounded-lg'>
            <p className='text-xs font-medium text-accent-500 mb-1'>TAM</p>
            <p className='text-lg font-semibold text-white'>{marketAnalysis.tam}</p>
          </div>
          <div className='p-4 bg-surface-variant rounded-lg'>
            <p className='text-xs font-medium text-accent-500 mb-1'>CAGR</p>
            <p className='text-lg font-semibold text-white'>{marketAnalysis.cagr}</p>
          </div>
          <div className='p-4 bg-surface-variant rounded-lg col-span-2'>
            <p className='text-xs font-medium text-accent-500 mb-1'>Market Size</p>
            <p className='text-sm text-white/70'>{marketAnalysis.market_size}</p>
          </div>
          <div className='p-4 bg-surface-variant rounded-lg col-span-2'>
            <p className='text-xs font-medium text-accent-500 mb-1'>Market Growth</p>
            <p className='text-sm text-white/70'>{marketAnalysis.market_growth}</p>
          </div>
        </div>
      )}

      {/* Competitive Analysis */}
      {competitors && (
        <div className='space-y-3'>
          <div className='p-4 bg-surface-variant rounded-lg'>
            <p className='text-xs font-medium text-accent-500 mb-3'>Competitors</p>
            <div className='space-y-2'>
              {competitors.competitors.map((competitor, index) => (
                <div key={index} className='flex items-center justify-between py-2 border-b border-white/5 last:border-0'>
                  <span className='text-sm font-medium text-white'>{competitor.name}</span>
                  <div className='flex items-center gap-4 text-xs text-white/60'>
                    <span>{competitor.market_share} share</span>
                    <span>{competitor.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='p-4 bg-surface-variant rounded-lg'>
              <p className='text-xs font-medium text-accent-500 mb-1'>Your Estimated Share</p>
              <p className='text-lg font-semibold text-white'>{competitors.your_estimated_share}</p>
            </div>
            <div className='p-4 bg-surface-variant rounded-lg'>
              <p className='text-xs font-medium text-accent-500 mb-1'>Market Opportunity</p>
              <p className='text-sm text-white/70'>{competitors.market_opportunity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty */}
      {difficulty && (
        <div className='p-4 bg-surface-variant rounded-lg'>
          <p className='text-xs font-medium text-accent-500 mb-1'>Implementation Difficulty</p>
          <p className='text-sm text-white/70 leading-relaxed'>{difficulty}</p>
        </div>
      )}
    </div>
  );
}
