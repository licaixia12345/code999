import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, RotateCcw, CheckCircle } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';

const listeningMaterials = [
  {
    id: '1',
    title: 'At the Coffee Shop',
    transcript: 'Welcome! What can I get for you today? I would like a large cappuccino, please. Would you like that for here or to go? For here, please. That will be $4.50. Thank you!',
    difficulty: 1,
  },
  {
    id: '2',
    title: 'Asking for Directions',
    transcript: 'Excuse me, could you tell me how to get to the train station? Sure, go straight down this street and turn left at the second traffic light. It is about a five-minute walk from here. Thank you so much! You are welcome!',
    difficulty: 1,
  },
  {
    id: '3',
    title: 'Making a Reservation',
    transcript: 'Hello, I would like to make a reservation for dinner this Saturday. How many people will be in your party? There will be four of us. What time would you like? Around 7 PM would be perfect. May I have your name and phone number?',
    difficulty: 2,
  },
  {
    id: '4',
    title: 'Job Interview',
    transcript: 'Can you tell me about your previous work experience? Yes, I worked as a software developer for three years at a tech company. What are your greatest strengths? I am very detail-oriented and great at problem-solving.',
    difficulty: 2,
  },
];

export default function Listening() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentMaterial = listeningMaterials[currentIndex];
  const progress = ((currentIndex + 1) / listeningMaterials.length) * 100;

  const handlePlay = () => {
    if (!audioRef.current) {
      const utterance = new SpeechSynthesisUtterance(currentMaterial.transcript);
      utterance.lang = 'en';
      utterance.rate = 0.9;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audioRef.current = {
        play: () => {
          speechSynthesis.speak(utterance);
          setIsPlaying(true);
        },
        pause: () => {
          speechSynthesis.cancel();
          setIsPlaying(false);
        },
        currentTime: 0,
      } as unknown as HTMLAudioElement;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < listeningMaterials.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranscript(false);
      setCurrentTime(0);
      setIsPlaying(false);
      audioRef.current = null;
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowTranscript(false);
    setCurrentTime(0);
    setIsPlaying(false);
    audioRef.current = null;
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return '简单';
      case 2: return '中等';
      case 3: return '困难';
      default: return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link to="/learn" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            返回学习中心
          </Link>
          
          <Badge variant="accent" size="md">
            听力训练
          </Badge>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>练习进度</span>
              <span>{currentIndex + 1} / {listeningMaterials.length}</span>
            </div>
            <ProgressBar value={progress} size="md" color="success" />
          </div>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="gray">{getDifficultyLabel(currentMaterial.difficulty)}</Badge>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript ? '隐藏原文' : '显示原文'}
              </Button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentMaterial.title}
            </h2>

            <div className="flex flex-col items-center justify-center py-8">
              <button
                onClick={handlePlay}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isPlaying 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-orange-500 hover:bg-orange-50'
                }`}
              >
                {isPlaying ? (
                  <Pause size={40} />
                ) : (
                  <Play size={40} className="ml-2" />
                )}
              </button>
              <p className="mt-4 text-gray-500">
                {isPlaying ? '播放中...' : '点击播放听力材料'}
              </p>
            </div>

            {showTranscript && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 size={18} className="text-gray-500" />
                  <span className="font-medium text-gray-700">听力原文</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {currentMaterial.transcript}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <Button
                variant="secondary"
                onClick={handleRestart}
              >
                <RotateCcw size={18} className="mr-2" />
                重新开始
              </Button>
              <Button onClick={handleNext}>
                下一题
              </Button>
            </div>
          </Card>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">听力材料列表</h3>
            <div className="space-y-2">
              {listeningMaterials.map((material, index) => (
                <button
                  key={material.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setShowTranscript(false);
                    setCurrentTime(0);
                    setIsPlaying(false);
                    audioRef.current = null;
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                    index === currentIndex
                      ? 'bg-orange-500 text-white'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === currentIndex ? 'bg-white/20' : 'bg-orange-100 text-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{material.title}</div>
                    <div className={`text-sm ${index === currentIndex ? 'text-orange-100' : 'text-gray-500'}`}>
                      {getDifficultyLabel(material.difficulty)} · {material.transcript.split(' ').length} 词
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
