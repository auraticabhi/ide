import { useEffect, useState } from 'react';

const CodeEditorShimmer = () => {
  const [lines, setLines] = useState<any>([]);

  useEffect(() => {
    // Generate random line lengths for more realistic appearance
    const generateLines = () => {
      return Array.from({ length: 15 }, () => ({
        indent: Math.floor(Math.random() * 3), // 0-2 levels of indentation
        width: 20 + Math.floor(Math.random() * 60) // Line width between 20-80%
      }));
    };
    setLines(generateLines());
  }, []);

  return (
    <div className="absolute inset-0 z-10 bg-gray-50 overflow-hidden">
      {/* Line numbers column */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-100 border-r border-gray-200">
        {lines.map((_:any, idx:any) => (
          <div 
            key={`line-num-${idx}`}
            className="h-8 px-2 text-right flex items-center justify-end"
          >
            <div className="w-6 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      
      {/* Code content area */}
      <div className="ml-8 p-4">
        {lines.map((line:any, idx:any) => (
          <div 
            key={`line-${idx}`}
            className="flex items-center h-8 space-x-2"
          >
            {/* Indentation */}
            <div />
            
            {/* Keywords/punctuation */}
            <div className="h-4 w-12 bg-purple-200/70 rounded animate-pulse" />
            
            {/* Main code content */}
            <div 
              className="h-4 rounded animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]"
              style={{ width: `${line.width}%` }}
            />
            
            {/* Occasional punctuation or ending */}
            {Math.random() > 0.5 && (
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Scrollbar imitation */}
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-100">
        <div className="w-full h-32 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default CodeEditorShimmer;