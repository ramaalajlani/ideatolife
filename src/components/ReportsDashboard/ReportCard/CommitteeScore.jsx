import React from 'react';
import { TrendingUp } from 'lucide-react';

const getScoreColor = (score) => {
  const numericScore = parseFloat(score) || 0;
  
  if (numericScore >= 80) return 'bg-[#8FD14F]/20 hover:bg-[#8FD14F]/30 text-black';
  if (numericScore >= 60) return 'bg-[#8FD14F]/20 hover:bg-[#8FD14F]/30 text-black';
  if (numericScore >= 40) return 'bg-[#8FD14F]/20 hover:bg-[#8FD14F]/30 text-black';
  return 'bg-[#8FD14F]/20 hover:bg-[#8FD14F]/30 text-black';
};

const CommitteeScore = ({ score }) => {
  const numericScore = parseFloat(score) || 0;
  
  return (
    <div className="mb-6 p-4 bg-[#8FD14F]/10 rounded-lg border border-[#8FD14F]/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-[#8FD14F]" />
          <h4 className="font-semibold text-gray-800 text-sm">Evaluation Score</h4>
        </div>
        
        <div className="text-right">
          <span className={`px-4 py-2 rounded-lg font-bold shadow-sm transition-colors ${getScoreColor(score)}`}>
            {numericScore.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
        <div 
          className="h-3 rounded-full bg-gradient-to-r from-[#8FD14F]/90 to-[#8FD14F] transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(numericScore, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      
      {/* Optional: Score interpretation */}
      <div className="mt-3 text-xs text-gray-600">
        {numericScore >= 80 ? (
          <span className="text-[#8FD14F] font-medium">Excellent</span>
        ) : numericScore >= 60 ? (
          <span className="text-[#8FD14F] font-medium">Good</span>
        ) : numericScore >= 40 ? (
          <span className="text-[#8FD14F] font-medium">Fair</span>
        ) : (
          <span className="text-[#8FD14F] font-medium">Needs Improvement</span>
        )}
      </div>
    </div>
  );
};

export default CommitteeScore;