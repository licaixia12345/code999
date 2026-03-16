import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { mockGrammar } from '@/data/mockData';

export default function Grammar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = mockGrammar[currentIndex];
  const progress = ((currentIndex + 1) / mockGrammar.length) * 100;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < mockGrammar.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const isCorrect = selectedAnswer === currentQuestion.correct_answer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link to="/learn" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            返回学习中心
          </Link>
          
          <Badge variant="success" size="md">
            得分: {score} / {currentIndex + (showResult ? 1 : 0)}
          </Badge>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>题目进度</span>
              <span>{currentIndex + 1} / {mockGrammar.length}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Card className="p-8">
            <Badge variant="gray" className="mb-4">语法练习</Badge>
            
            <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = 'w-full p-4 text-left rounded-xl border-2 transition-all ';
                
                if (!showResult) {
                  buttonClass += selectedAnswer === option 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50';
                } else {
                  if (option === currentQuestion.correct_answer) {
                    buttonClass += 'border-green-500 bg-green-50';
                  } else if (option === selectedAnswer && !isCorrect) {
                    buttonClass += 'border-red-500 bg-red-50';
                  } else {
                    buttonClass += 'border-gray-200 opacity-50';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && option === currentQuestion.correct_answer && (
                        <CheckCircle className="text-green-500" size={20} />
                      )}
                      {showResult && option === selectedAnswer && !isCorrect && (
                        <XCircle className="text-red-500" size={20} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  <Lightbulb className={isCorrect ? 'text-green-500' : 'text-red-500'} size={20} />
                  <div>
                    <div className={`font-medium mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '回答正确!' : '回答错误'}
                    </div>
                    <div className="text-sm text-gray-600">{currentQuestion.explanation}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {currentIndex < mockGrammar.length - 1 ? (
                <Button onClick={handleNext} disabled={!showResult}>
                  下一题
                </Button>
              ) : (
                <Button onClick={handleRestart}>
                  <RotateCcw size={18} className="mr-2" />
                  重新开始
                </Button>
              )}
            </div>
          </Card>

          <div className="mt-8 text-center">
            <div className="text-gray-500 mb-2">完成所有题目</div>
            <div className="text-2xl font-bold">
              {Math.round((score / mockGrammar.length) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
