export default function LandingBackground() {
  return (
    <>
      <div className='absolute inset-0 z-0' style={{ background: 'linear-gradient(to top, #0a0a0a, #151b21)' }} />
      <div
        className='absolute z-0 w-[120vmax] h-[120vmax] rounded-full blur-[120px] animate-iridescent-1 pointer-events-none'
        style={{
          left: '-55%',
          top: '-30%',
          background:
            'radial-gradient(circle, rgba(249, 107, 19, 0.14) 0%, rgba(249, 107, 19, 0.05) 40%, transparent 70%)',
        }}
      />
      <div
        className='absolute z-0 w-[100vmax] h-[100vmax] rounded-full blur-[100px] animate-iridescent-2 pointer-events-none'
        style={{
          right: '-55%',
          bottom: '-25%',
          background:
            'radial-gradient(circle, rgba(19, 249, 184, 0.12) 0%, rgba(19, 249, 184, 0.04) 45%, transparent 70%)',
        }}
      />
      <div
        className='absolute z-0 w-[90vmax] h-[90vmax] rounded-full blur-[90px] animate-iridescent-3 pointer-events-none'
        style={{
          left: '-40%',
          bottom: '15%',
          background: 'radial-gradient(circle, rgba(249, 107, 19, 0.11) 0%, transparent 55%)',
        }}
      />
      <div
        className='absolute z-0 w-[80vmax] h-[80vmax] rounded-full blur-[80px] animate-iridescent-4 pointer-events-none'
        style={{
          right: '-40%',
          top: '25%',
          background: 'radial-gradient(circle, rgba(19, 249, 184, 0.11) 0%, transparent 60%)',
        }}
      />
      <div
        className='absolute z-0 w-[100vmax] h-[100vmax] rounded-full opacity-[0.2] blur-[100px] animate-wave-1 pointer-events-none'
        style={{
          left: '-20%',
          top: '-30%',
          background: 'radial-gradient(circle, #3d2218 0%, transparent 70%)',
        }}
      />
      <div
        className='absolute z-0 w-[80vmax] h-[80vmax] rounded-full opacity-[0.15] blur-[80px] animate-wave-2 pointer-events-none'
        style={{
          right: '-25%',
          top: '10%',
          background: 'radial-gradient(circle, #2d1810 0%, transparent 65%)',
        }}
      />
      <div
        className='absolute z-0 w-[90vmax] h-[90vmax] rounded-full opacity-[0.12] blur-[90px] animate-wave-3 pointer-events-none'
        style={{
          left: '-15%',
          bottom: '-20%',
          background: 'radial-gradient(circle, #1a0f0a 0%, transparent 60%)',
        }}
      />
      <div
        className='absolute z-0 w-[70vmax] h-[70vmax] rounded-full opacity-[0.15] blur-[70px] animate-wave-4 pointer-events-none'
        style={{
          right: '-10%',
          bottom: '-15%',
          background: 'radial-gradient(circle, #3d2218 0%, transparent 70%)',
        }}
      />
    </>
  );
}
