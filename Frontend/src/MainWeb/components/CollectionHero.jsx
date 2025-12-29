import React from 'react';

const CollectionHero = ({ title, subtitle, backgroundClass = "bg-[#fbf7f2]", imageUrl }) => {
  const hasImage = Boolean(imageUrl);

  return (
    <section
      className={`${hasImage ? 'bg-cover bg-center' : backgroundClass} py-16 md:py-20 relative flex items-center`}
      style={hasImage ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      {hasImage && <div className="absolute inset-0 bg-black/20" aria-hidden />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-[#9c7c3a] md:text-[#fbf7f2] mb-4 tracking-[2px]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-[#3b3b3b] md:text-[#fbf7f2]/90 max-w-2xl mx-auto font-sans">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default CollectionHero;