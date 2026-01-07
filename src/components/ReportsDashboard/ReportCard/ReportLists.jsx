import React from 'react';

const ReportLists = ({ strengths, weaknesses, recommendations }) => {
  // Helper function to convert text to array
  const textToArray = (text) => {
    if (!text) return [];
    if (typeof text !== 'string') return [];
    
    const trimmed = text.trim();
    if (!trimmed) return [];
    
    // Split by new lines, Arabic commas, or periods
    const items = trimmed
      .split(/[\n،,\.]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // If array is empty but there's text, return as single item
    if (items.length === 0 && trimmed.length > 0) {
      return [trimmed];
    }
    
    return items;
  };

  // Data for the three sections with new color scheme
  const sections = [
    {
      title: 'Strengths',
      items: strengths,
      color: 'border-r-4 border-[#FCC6FF]',
      bgColor: 'bg-[#FCC6FF]/20'
    },
    {
      title: 'Weaknesses',
      items: weaknesses,
      color: 'border-r-4 border-[#FFE6C9]',
      bgColor: 'bg-[#FFE6C9]/30'
    },
    {
      title: 'Recommendations',
      items: recommendations,
      color: 'border-r-4 border-[#FFC785]',
      bgColor: 'bg-[#FFC785]/30'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Evaluation Summary</h3>
      
      {sections.map((section, index) => {
        const itemsArray = textToArray(section.items);
        const hasItems = itemsArray.length > 0;
        
        return (
          <div key={index} className={`p-4 rounded-lg ${section.bgColor} border ${section.color} shadow-sm`}>
            <div className="mb-3">
              <h4 className="font-bold text-gray-800 text-lg">
                {section.title}
              </h4>
            </div>
            
            {hasItems ? (
              <div className="space-y-2">
                {itemsArray.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className="p-3 bg-white/70 rounded-lg border border-gray-100 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start">
                      <span className="text-gray-600 text-sm mr-2">•</span>
                      <span className="text-gray-700 flex-1">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No {section.title.toLowerCase()}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReportLists;