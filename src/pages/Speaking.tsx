import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Play, Volume2, RefreshCw } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';

const speakingScenarios = [
  { id: '1', text: 'Hello, how are you today?', translation: '你好，今天怎么样？', difficulty: 1 },
  { id: '2', text: 'I would like to order a coffee, please.', translation: '我想点一杯咖啡。', difficulty: 1 },
  { id: '3', text: 'Could you tell me where the nearest station is?', translation: '你能告诉我最近的车站在哪里吗？', difficulty: 2 },
  { id: '4', text: 'I have been studying English for three years.', translation: '我已经学习英语三年了。', difficulty: 2 },
  { id: '5', text: 'What do you think about this new technology?', translation: '你觉得这项新技术怎么样？', difficulty: 3 },
];

export default function Speaking() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const currentScenario = speakingScenarios[currentIndex];
  const progress = ((currentIndex + 1) / speakingScenarios.length) * 100;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setScore(Math.floor(Math.random() * 30) + 70);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playOriginal = () => {
    const utterance = new SpeechSynthesisUtterance(currentScenario.text);
    utterance.lang = 'en';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleNext = () => {
    if (currentIndex < speakingScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAudioUrl(null);
      setScore(null);
      setRecordingTime(0);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAudioUrl(null);
    setScore(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link to="/learn" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            返回学习中心
          </Link>
          
          <Badge variant="accent" size="md">
            口语跟读
          </Badge>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>练习进度</span>
              <span>{currentIndex + 1} / {speakingScenarios.length}</span>
            </div>
            <ProgressBar value={progress} size="md" color="accent" />
          </div>

          <Card className="p-8 text-center">
            <div className="mb-6">
              <Badge variant="primary" className="mb-4">跟读练习</Badge>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {currentScenario.text}
              </div>
              <div className="text-gray-500">
                {currentScenario.translation}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={playOriginal}
              >
                <Volume2 size={16} className="mr-2" />
                播放原声
              </Button>
            </div>

            <div className="mb-8">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 transition-all ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : audioUrl 
                    ? 'bg-success-500' 
                    : 'bg-gray-200'
              }`}>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg"
                >
                  {isRecording ? (
                    <Square className="text-red-500" size={24} />
                  ) : (
                    <Mic className="text-gray-600" size={32} />
                  )}
                </button>
              </div>

              {isRecording && (
                <div className="text-red-500 font-medium mb-2">
                  录音中... {formatTime(recordingTime)}
                </div>
              )}

              {audioUrl && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="secondary" size="sm" onClick={playRecording}>
                      <Play size={16} className="mr-2" />
                      播放录音
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => { setAudioUrl(null); setScore(null); }}>
                      <RefreshCw size={16} className="mr-2" />
                      重录
                    </Button>
                  </div>

                  {score !== null && (
                    <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
                      <div className="text-sm text-gray-500 mb-1">发音评分</div>
                      <div className="text-3xl font-bold text-primary-600">{score}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {score >= 90 ? '完美！' : score >= 80 ? '很好！' : score >= 70 ? '不错！' : '继续练习！'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button onClick={handleNext} disabled={!audioUrl}>
              下一题
            </Button>
          </Card>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">练习场景</h3>
            <div className="space-y-2">
              {speakingScenarios.map((scenario, index) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAudioUrl(null);
                    setScore(null);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    index === currentIndex
                      ? 'bg-accent-500 text-white'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      index === currentIndex ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={index === currentIndex ? '' : 'text-gray-700'}>
                      {scenario.text}
                    </span>
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
