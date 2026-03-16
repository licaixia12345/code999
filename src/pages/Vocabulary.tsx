import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, RotateCcw, Check, X, ChevronRight } from 'lucide-react';
import { Button, Card, ProgressBar } from '@/components/ui';
import { mockVocabulary } from '@/data/mockData';

export default function Vocabulary() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');

  const currentWord = mockVocabulary[currentIndex];
  const progress = ((currentIndex) / mockVocabulary.length) * 100;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < mockVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleKnown = () => {
    setKnownWords(prev => new Set(prev).add(currentWord.id));
    handleNext();
  };

  const handleUnknown = () => {
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link to="/learn" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            返回学习中心
          </Link>
          
          <div className="flex gap-2">
            <Button
              variant={mode === 'learn' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => { setMode('learn'); handleRestart(); }}
            >
              学习模式
            </Button>
            <Button
              variant={mode === 'quiz' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => { setMode('quiz'); handleRestart(); }}
            >
              测试模式
            </Button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>学习进度</span>
              <span>{currentIndex + 1} / {mockVocabulary.length}</span>
            </div>
            <ProgressBar value={progress} size="md" color="primary" />
          </div>

          <Card className="min-h-[400px] flex flex-col items-center justify-center p-8">
            <div 
              className={`w-full max-w-md cursor-pointer transition-all duration-500 perspective-1000 ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ 
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div 
                className="bg-white rounded-2xl shadow-lg p-8 text-center relative"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    const utterance = new SpeechSynthesisUtterance(currentWord.word);
                    utterance.lang = 'en';
                    speechSynthesis.speak(utterance);
                  }}
                >
                  <Volume2 size={16} />
                </Button>
                
                <div className="text-5xl font-bold mb-4 text-primary-600">{currentWord.word}</div>
                <div className="text-gray-400 mb-2">{currentWord.pronunciation}</div>
                <div className="text-gray-500">点击查看释义</div>
              </div>

              <div 
                className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg p-8 text-center text-white absolute inset-0 flex flex-col items-center justify-center"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-4xl font-bold mb-4">{currentWord.translation}</div>
                <div className="text-primary-100 mb-2">{currentWord.pronunciation}</div>
                <div className="text-white/80 italic mt-4">"{currentWord.example_sentence}"</div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between mt-8">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              上一个
            </Button>
            
            <div className="flex gap-4">
              {mode === 'learn' ? (
                <>
                  <Button
                    variant="success"
                    onClick={handleKnown}
                    disabled={currentIndex === mockVocabulary.length - 1}
                  >
                    <Check size={18} className="mr-2" />
                    认识
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleUnknown}
                    disabled={currentIndex === mockVocabulary.length - 1}
                  >
                    <X size={18} className="mr-2" />
                    不认识
                  </Button>
                </>
              ) : (
                <Button variant="primary">
                  显示答案
                </Button>
              )}
            </div>
          </div>

          {knownWords.size > 0 && (
            <div className="mt-8 text-center text-gray-500">
              已掌握 {knownWords.size} 个单词
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          <h3 className="font-semibold mb-4">单词列表</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {mockVocabulary.map((word, index) => (
              <button
                key={word.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFlipped(false);
                }}
                className={`p-3 rounded-lg text-left transition-all ${
                  index === currentIndex 
                    ? 'bg-primary-500 text-white' 
                    : knownWords.has(word.id)
                      ? 'bg-success-100 text-success-700'
                      : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{word.word}</div>
                <div className={`text-xs ${index === currentIndex ? 'text-primary-100' : 'text-gray-500'}`}>
                  {word.translation}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
