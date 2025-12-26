// src/components/GanttChart/PhaseEvaluation.jsx
import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import StarRatingAnimation from "./Star rating.json";

const PhaseEvaluation = React.memo(({ phaseId, evaluation, loading }) => {
    const animationContainer = useRef(null);
    const animationInstance = useRef(null);
    
    useEffect(() => {
        if (animationContainer.current && StarRatingAnimation) {
            // تدمير الأنيميشن السابق إذا وجد
            if (animationInstance.current) {
                animationInstance.current.destroy();
            }
            
            // إنشاء الأنيميشن الجديد
            animationInstance.current = lottie.loadAnimation({
                container: animationContainer.current,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: StarRatingAnimation,
            });
            
            return () => {
                if (animationInstance.current) {
                    animationInstance.current.destroy();
                }
            };
        }
    }, []);
    
    // تشغيل الأنيميشن عندما تتغير النتيجة
    useEffect(() => {
        if (animationInstance.current && evaluation?.score) {
            const score = Number(evaluation.score) || 0;
            
            // حساب عدد النجوم بناءً على النتيجة
            const starsCount = Math.floor(score / 20);
            
            // بدء الأنيميشن
            animationInstance.current.goToAndPlay(0, true);
            
            // يمكنك التحكم في الأنيميشن بناءً على النتيجة
            // animationInstance.current.setSpeed(1.5);
        }
    }, [evaluation]);
    
    if (loading) {
        return (
            <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                <div className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                <span className="text-red-600 font-medium">Loading...</span>
            </div>
        );
    }
    
    if (!evaluation) {
        return null;
    }
    
    // Convert score to number if it's a string
    const score = Number(evaluation.score) || 0;
    const comments = evaluation.comments || '';
    
    if (score === 0 && !comments) {
        return null;
    }
    
    // Determine score style with light red tones
    const getScoreStyle = (score) => {
        if (score >= 90) return 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md';
        if (score >= 80) return 'bg-gradient-to-r from-red-300 to-red-400 text-white shadow';
        if (score >= 70) return 'bg-gradient-to-r from-pink-300 to-red-300 text-white';
        if (score >= 60) return 'bg-gradient-to-r from-red-200 to-pink-300 text-gray-800';
        if (score >= 50) return 'bg-gradient-to-r from-red-100 to-pink-200 text-gray-800';
        return 'bg-gradient-to-r from-red-50 to-red-100 text-gray-800';
    };
    
    const scoreStyleClass = getScoreStyle(score);
    
    // Display score rating
    const getScoreDisplay = (score) => {
        if (score >= 95) return 'Excellent';
        if (score >= 85) return 'Very Good';
        if (score >= 75) return 'Good';
        if (score >= 65) return 'Acceptable';
        if (score >= 50) return 'Average';
        return 'Needs Improvement';
    };
    
    const scoreDisplay = getScoreDisplay(score);
    
    // Calculate stars based on score
    const starsCount = Math.floor(score / 20);
    
    return (
        <div className="mt-2 space-y-3">
            {/* Star Rating Animation Container */}
            <div className="flex justify-center items-center">
                <div 
                    ref={animationContainer} 
                    className="w-32 h-32 flex items-center justify-center"
                />
            </div>
            
            {/* Main Score - Distinct */}
            <div className={`px-4 py-3 rounded-lg text-center font-bold transition-all duration-300 hover:scale-[1.02] ${scoreStyleClass}`}>
                <div className="text-xl mb-1">{score}/100</div>
                <div className="text-sm opacity-90">{scoreDisplay}</div>
                <div className="text-xs mt-1 opacity-80">
                    {starsCount}/5 stars
                </div>
            </div>
            
            {/* Performance Indicator Bar */}
            <div className="pt-1">
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                            score >= 90 ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                            score >= 70 ? 'bg-gradient-to-r from-pink-300 to-red-300' :
                            score >= 50 ? 'bg-gradient-to-r from-red-200 to-pink-300' :
                            'bg-gradient-to-r from-red-300 to-red-400'
                        }`}
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                </div>
            </div>
            
            {/* Comments Section */}
            {comments && comments.trim() !== '' && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg border border-red-100 shadow-sm mt-3">
                    <div className="flex items-start gap-2">
                        <div className="w-1 h-full bg-gradient-to-b from-red-400 to-pink-400 rounded-full mt-0.5"></div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1 font-semibold">Evaluation Notes:</p>
                            <p className="text-sm text-gray-800 leading-relaxed">{comments}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Simple star visualization */}
            <div className="flex justify-center items-center gap-1 mt-2">
                {[...Array(5)].map((_, index) => (
                    <div 
                        key={index}
                        className={`w-5 h-5 rounded-full transition-all duration-300 ${
                            index < starsCount 
                                ? 'bg-gradient-to-r from-red-400 to-pink-400 shadow-md' 
                                : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
});

export default PhaseEvaluation;