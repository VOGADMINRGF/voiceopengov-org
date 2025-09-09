// components/Headline.tsx
export function Headline({ children }: { children: React.ReactNode }) {
    return (
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-8 mt-16"
        style={{ color: '#9333ea' }}
      >
        {children}
      </h2>
    );
  }
  