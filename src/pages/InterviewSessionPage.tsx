import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Play, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Square, 
  Send, 
  SkipForward, 
  Clock, 
  AlertCircle, 
  Check, 
  Camera, 
  Sparkles,
  Film,
  CheckCircle2,
  Volume2,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { INTERVIEW_QUESTIONS, CATEGORY_METADATA } from '../lib/questions';
import { InterviewCategory, Question, QuestionAnswerRecord } from '../types';
import { InterviewCard } from '../components/InterviewCard';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { evaluateAnswer, aggregateEvaluations } from '../lib/scoring';
import { saveInterviewSession } from '../lib/storage';
import { saveRecordedVideo } from '../lib/videoStorage';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { AnalysisLoader } from '../components/AnalysisLoader';
import { WorkflowGraphic } from '../components/WorkflowGraphic';

export const InterviewSessionPage: React.FC = () => {
  const { category = 'hr' } = useParams<{ category: InterviewCategory }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get('mode') === 'quick' ? 'quick' : 'full';

  // Questions for this track
  const categoryQuestions = INTERVIEW_QUESTIONS.filter(q => q.category === category);
  const questionsList: Question[] = mode === 'quick' 
    ? categoryQuestions.slice(0, 1) 
    : categoryQuestions;

  // Session Flow Stage: 'hardware-check' -> 'interview' -> 'completed'
  const [sessionStage, setSessionStage] = useState<'hardware-check' | 'interview'>('hardware-check');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questionsList[currentQuestionIndex] || categoryQuestions[0];

  // Video / Audio state
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);

  // Transcript & speech recognition state
  const [answerTranscript, setAnswerTranscript] = useState('');
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingNavigationId, setPendingNavigationId] = useState<string | null>(null);

  // Completed session answers
  const [completedAnswers, setCompletedAnswers] = useState<QuestionAnswerRecord[]>([]);

  // DOM Refs
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const checkVideoRef = useRef<HTMLVideoElement | null>(null);
  const playbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Initialize camera and microphone on mount
  useEffect(() => {
    initCameraAndMicrophone();

    return () => {
      stopMediaStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  // Sync stream with live video element
  useEffect(() => {
    if (sessionStage === 'hardware-check' && checkVideoRef.current && mediaStream) {
      checkVideoRef.current.srcObject = mediaStream;
    }
    if (sessionStage === 'interview' && liveVideoRef.current && mediaStream) {
      liveVideoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, sessionStage, isRecording]);

  // Initialize Media Devices
  const initCameraAndMicrophone = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionStatus('denied');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true
      });

      setMediaStream(stream);
      setPermissionStatus('granted');
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
      if (checkVideoRef.current) {
        checkVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera/Microphone permission denied or device unavailable:', err);
      setPermissionStatus('denied');
    }
  };

  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const toggleCameraTrack = () => {
    if (!mediaStream) return;
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraActive(videoTrack.enabled);
    }
  };

  const toggleMicTrack = () => {
    if (!mediaStream) return;
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicActive(audioTrack.enabled);
    }
  };

  // Setup Web Speech API Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      return;
    }

    setSpeechRecognitionSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript + ' ';
      }
      if (fullTranscript.trim()) {
        setAnswerTranscript(fullTranscript.trim());
        setValidationError(null);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Web Speech API error:', event.error);
      if (event.error === 'not-allowed') {
        setSpeechRecognitionSupported(false);
      }
    };

    recognition.onend = () => {
      setSpeechRecognitionActive(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Start MediaRecorder + Speech Recognition
  const handleStartRecording = () => {
    setValidationError(null);
    recordedChunksRef.current = [];
    setRecordedVideoUrl(null);
    setRecordedVideoBlob(null);

    if (!mediaStream) {
      initCameraAndMicrophone().then(() => {
        beginRecordingProcess();
      });
    } else {
      beginRecordingProcess();
    }
  };

  const beginRecordingProcess = () => {
    if (!mediaStream) {
      setValidationError('Cannot record without camera/microphone access. Please enable permissions or type your answer directly.');
      return;
    }

    try {
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      let selectedMime = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const recorder = new MediaRecorder(mediaStream, selectedMime ? { mimeType: selectedMime } : undefined);
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mime = selectedMime || 'video/webm';
        const blob = new Blob(recordedChunksRef.current, { type: mime });
        setRecordedVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      if (recognitionRef.current && speechRecognitionSupported) {
        try {
          recognitionRef.current.start();
          setSpeechRecognitionActive(true);
        } catch (e) {
          console.warn('Speech recognition start error:', e);
        }
      }
    } catch (err: any) {
      console.error('Failed to start MediaRecorder:', err);
      setValidationError('Failed to initialize media recorder. You can type your answer directly.');
    }
  };

  // Stop Recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current && speechRecognitionActive) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
      setSpeechRecognitionActive(false);
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setIsRecording(false);
  };

  // Reset & Re-record current question
  const handleResetRecording = () => {
    handleStopRecording();
    setRecordedVideoUrl(null);
    setRecordedVideoBlob(null);
    setAnswerTranscript('');
    setRecordingSeconds(0);
    setValidationError(null);
  };

  // Real-time computed metrics from candidate's actual text
  const words = answerTranscript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const detectedKeywords = currentQuestion.expectedKeywords.filter(expected => {
    const root = expected.toLowerCase().slice(0, Math.max(4, expected.length - 2));
    return words.some(w => w.toLowerCase().startsWith(root) || w.toLowerCase() === expected.toLowerCase());
  });

  const missingKeywords = currentQuestion.expectedKeywords.filter(
    k => !detectedKeywords.includes(k)
  );

  const fillerRegex = /\b(um|uh|like|you know|basically|sort of|kind of|honestly|actually|literally)\b/gi;
  const fillerCount = (answerTranscript.match(fillerRegex) || []).length;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit and analyze actual answer
  const handleAnalyzeAndProceed = async () => {
    if (isRecording) {
      handleStopRecording();
    }

    const cleanAnswer = answerTranscript.trim();
    if (!cleanAnswer || wordCount < 3) {
      setValidationError('No answer recorded yet. Please record your spoken answer using your camera and microphone, or type your response.');
      return;
    }

    setValidationError(null);

    // Save video blob to IndexedDB
    const videoKey = `video_${currentQuestion.id}_${Date.now()}`;
    if (recordedVideoBlob) {
      await saveRecordedVideo(videoKey, recordedVideoBlob);
    }

    // Evaluate answer strictly with genuine calculations
    const evaluation = evaluateAnswer(cleanAnswer, currentQuestion);

    const record: QuestionAnswerRecord = {
      questionId: currentQuestion.id,
      questionPrompt: currentQuestion.prompt,
      category: currentQuestion.category,
      userAnswer: cleanAnswer,
      timeSpentSeconds: recordingSeconds > 0 ? recordingSeconds : Math.round((wordCount / 130) * 60),
      evaluation,
      hasVideoRecording: !!recordedVideoBlob,
      videoBlobUrl: recordedVideoUrl || undefined,
      speechRecognitionUsed: speechRecognitionSupported,
      videoAnalysis: {
        videoRecorded: !!recordedVideoBlob,
        videoDurationSeconds: recordingSeconds,
        speechTranscribed: true,
        browserSpeechRecognitionAvailable: speechRecognitionSupported,
        facialEmotionStatus: 'Coming Soon (Python/FastAPI Backend Pipeline)',
        voicePitchConfidenceStatus: 'Coming Soon (Python/FastAPI Backend Pipeline)',
        eyeContactStatus: 'Coming Soon (Python/FastAPI Backend Pipeline)',
        postureStatus: 'Coming Soon (Python/FastAPI Backend Pipeline)'
      }
    };

    const updatedAnswers = [...completedAnswers, record];
    setCompletedAnswers(updatedAnswers);

    // Trigger visual analysis loader
    setIsAnalyzing(true);

    if (currentQuestionIndex < questionsList.length - 1) {
      // Move to next question after loader completes
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswerTranscript('');
        setRecordingSeconds(0);
        setRecordedVideoUrl(null);
        setRecordedVideoBlob(null);
        setIsAnalyzing(false);
      }, 1600);
    } else {
      // Assemble completed real session
      const aggregated = aggregateEvaluations(updatedAnswers.map(a => a.evaluation));
      const catMeta = CATEGORY_METADATA[category as InterviewCategory] || CATEGORY_METADATA.hr;
      const sessionId = `real_session_${Date.now()}`;

      const session = {
        id: sessionId,
        category: category as InterviewCategory,
        categoryName: catMeta.name,
        timestamp: Date.now(),
        dateFormatted: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        durationSeconds: updatedAnswers.reduce((sum, a) => sum + a.timeSpentSeconds, 0),
        overallScore: aggregated.overallScore,
        answers: updatedAnswers,
        aggregatedEvaluation: aggregated,
        hasVideoRecordings: updatedAnswers.some(a => a.hasVideoRecording)
      };

      saveInterviewSession(session);
      setPendingNavigationId(sessionId);
    }
  };

  const handleLoaderComplete = () => {
    if (pendingNavigationId) {
      stopMediaStream();
      navigate(`/analysis?sessionId=${pendingNavigationId}`);
    }
  };

  const handleSkip = () => {
    if (isRecording) handleStopRecording();
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerTranscript('');
      setRecordingSeconds(0);
      setRecordedVideoUrl(null);
      setRecordedVideoBlob(null);
      setValidationError(null);
    } else {
      navigate('/practice');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fade-in">
      
      {/* Loading overlay while analyzing */}
      {isAnalyzing && (
        <AnalysisLoader onComplete={handleLoaderComplete} durationMs={1600} />
      )}

      {/* STAGE 1: CAMERA & MIC READINESS CHECK */}
      {sessionStage === 'hardware-check' && (
        <div className="space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65A3C]">
              Step 02 of 05 · Hardware & Environment
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
              Camera & Microphone Check
            </h1>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Verify your video framing, lighting, and microphone levels before starting your {CATEGORY_METADATA[category as InterviewCategory]?.name || ''} interview.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Live Mirror Preview */}
            <div className="lg:col-span-7 bg-[#1C1917] rounded-2xl overflow-hidden border border-[#292524] shadow-md flex flex-col justify-between relative min-h-[380px]">
              
              {/* Header inside mirror */}
              <div className="p-4 flex items-center justify-between text-xs text-white bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">Live Mirror Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Audio visualizer:</span>
                  <AudioVisualizer stream={mediaStream} isActive={isMicActive} barCount={12} className="h-4" />
                </div>
              </div>

              {/* Viewport */}
              <div className="relative w-full flex-1 flex items-center justify-center bg-[#0F0D0C] min-h-[300px]">
                {permissionStatus === 'granted' && mediaStream ? (
                  <video
                    ref={checkVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform -scale-x-100 max-h-[380px] ${!isCameraActive ? 'hidden' : ''}`}
                  />
                ) : null}

                {(!isCameraActive || permissionStatus !== 'granted' || !mediaStream) && (
                  <div className="p-8 text-center text-neutral-400 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto text-neutral-300">
                      <VideoOff className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">
                      {permissionStatus === 'denied' ? 'Camera Permission Required' : 'Camera Feed Paused'}
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                      {permissionStatus === 'denied'
                        ? 'Camera or microphone permission was blocked. You can click retry below or proceed with written typing.'
                        : 'Camera is currently muted.'}
                    </p>
                    {permissionStatus === 'denied' && (
                      <Button size="sm" variant="outline" onClick={initCameraAndMicrophone} className="border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700 text-xs">
                        Retry Device Permission
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Controls bar */}
              <div className="p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between text-white z-10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleCameraTrack}
                    disabled={!mediaStream}
                    className={`p-2 rounded-xl border transition-colors ${
                      isCameraActive
                        ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                        : 'border-red-500/50 bg-red-950/60 text-red-400'
                    }`}
                    title={isCameraActive ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isCameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleMicTrack}
                    disabled={!mediaStream}
                    className={`p-2 rounded-xl border transition-colors ${
                      isMicActive
                        ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                        : 'border-red-500/50 bg-red-950/60 text-red-400'
                    }`}
                    title={isMicActive ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>

                <span className="text-xs text-neutral-400">
                  {permissionStatus === 'granted' ? 'Microphone & Camera Connected' : 'Checking Hardware...'}
                </span>
              </div>

            </div>

            {/* Right: Readiness Checklist & Launch Button */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs space-y-4">
                <span className="text-xs uppercase tracking-wider text-[#E65A3C] font-semibold block">
                  Candidate Readiness Checklist
                </span>

                <div className="space-y-3 text-xs text-[#57534E]">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1C1917]">Camera at Eye Level</strong>
                      <span>Center your face and ensure your room has soft front lighting.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1C1917]">Clear Speaking Pace</strong>
                      <span>Aim for ~130–150 words per minute. Avoid rushing through sentences.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#1C1917]">Speech-to-Text Support</strong>
                      <span>
                        {speechRecognitionSupported 
                          ? 'Browser Speech Recognition API is fully supported.' 
                          : 'Speech recognition is unavailable; manual answer typing is fully supported.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Launch Action */}
                <div className="pt-3">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full"
                    onClick={() => setSessionStage('interview')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    I'm Ready — Begin Question 1
                  </Button>
                </div>
              </div>

              {/* Tips banner */}
              <div className="p-4 rounded-xl bg-[#FDF2F0] border border-[#FBE8E2] text-xs text-[#57534E] flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[#E65A3C] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Pro-Tip:</strong> Format your answer with STAR: Situation (context), Task (goal), Action (what you owned), and Result (quantifiable impact).
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* STAGE 2: LIVE INTERVIEW QUESTION & RECORDING WORKSPACE */}
      {sessionStage === 'interview' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Session Progress Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E65A3C] animate-pulse" />
              <span className="font-serif text-base font-bold text-[#1C1917]">
                {CATEGORY_METADATA[category as InterviewCategory]?.name || 'Interview Practice'}
              </span>
              <span className="text-xs text-[#78716C]">
                Question {currentQuestionIndex + 1} of {questionsList.length}
              </span>
            </div>

            <div className="w-full sm:w-60">
              <ProgressBar
                current={currentQuestionIndex + 1}
                total={questionsList.length}
                label={`Step ${currentQuestionIndex + 1} of ${questionsList.length}`}
              />
            </div>
          </div>

          {/* Main Interview Question Display */}
          <InterviewCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questionsList.length}
          />

          {/* Live Video Recorder & Webcam Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Live Camera Feed / Video Playback (Col 7) */}
            <div className="lg:col-span-7 bg-[#1C1917] rounded-2xl overflow-hidden border border-[#292524] shadow-md flex flex-col justify-between relative min-h-[380px] sm:min-h-[440px]">
              
              {/* Video Overlay Top Header */}
              <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                {/* Recording status badge */}
                <div className="flex items-center gap-2">
                  {isRecording ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-semibold tracking-wider uppercase animate-pulse shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      REC LIVE
                    </div>
                  ) : recordedVideoUrl ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-semibold tracking-wider uppercase shadow-sm">
                      <Film className="w-3.5 h-3.5" />
                      Recorded
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-medium backdrop-blur-sm">
                      <Camera className="w-3.5 h-3.5" />
                      Ready to Record
                    </div>
                  )}
                </div>

                {/* Timer Display */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white font-mono text-xs font-semibold backdrop-blur-sm border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="tabular-nums">{formatTimer(recordingSeconds)}</span>
                </div>
              </div>

              {/* Video Element Viewport */}
              <div className="relative w-full flex-1 flex items-center justify-center bg-[#0F0D0C]">
                {recordedVideoUrl && !isRecording ? (
                  /* Playback of candidate's recorded answer */
                  <video
                    ref={playbackVideoRef}
                    src={recordedVideoUrl}
                    controls
                    className="w-full h-full object-cover rounded-t-2xl max-h-[440px]"
                  />
                ) : permissionStatus === 'granted' && mediaStream ? (
                  /* Live Webcam stream */
                  <video
                    ref={liveVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform -scale-x-100 max-h-[440px] ${!isCameraActive ? 'hidden' : ''}`}
                  />
                ) : null}

                {/* Fallback if camera is off or denied */}
                {(!isCameraActive || permissionStatus !== 'granted' || !mediaStream) && !recordedVideoUrl && (
                  <div className="p-8 text-center text-neutral-400 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto text-neutral-300">
                      <VideoOff className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">
                      {permissionStatus === 'denied' ? 'Camera Access Denied or Unavailable' : 'Camera Feed Paused'}
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                      {permissionStatus === 'denied'
                        ? 'Browser camera permission was denied. You can re-enable permissions in browser settings or type your answer directly into the transcript box below.'
                        : 'Click Enable Camera below to restore live preview.'}
                    </p>
                    {permissionStatus === 'denied' && (
                      <Button size="sm" variant="outline" onClick={initCameraAndMicrophone} className="border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700 text-xs">
                        Retry Camera Access
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Video Controls Bottom Bar */}
              <div className="p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleCameraTrack}
                    disabled={!mediaStream}
                    className={`p-2 rounded-xl border transition-colors ${
                      isCameraActive
                        ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                        : 'border-red-500/50 bg-red-950/60 text-red-400'
                    }`}
                    title={isCameraActive ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isCameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleMicTrack}
                    disabled={!mediaStream}
                    className={`p-2 rounded-xl border transition-colors ${
                      isMicActive
                        ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                        : 'border-red-500/50 bg-red-950/60 text-red-400'
                    }`}
                    title={isMicActive ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>

                {/* Central Record / Stop Controls */}
                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <Button
                      size="md"
                      variant="primary"
                      onClick={handleStartRecording}
                      icon={<div className="w-3 h-3 rounded-full bg-white animate-pulse" />}
                      iconPosition="left"
                    >
                      {recordedVideoUrl ? 'Re-record Answer' : 'Start Recording'}
                    </Button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-sm active:scale-95"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      Stop Recording
                    </button>
                  )}
                </div>

                {/* Replay indicator */}
                {recordedVideoUrl && !isRecording && (
                  <button
                    onClick={handleResetRecording}
                    className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>

            </div>

            {/* Right Column: Real-Time Spoken Transcript & NLP Feedback (Col 5) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs flex flex-col justify-between space-y-4">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-semibold block">
                      Live Spoken Answer
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                      Speech-to-Text Transcript
                    </h3>
                  </div>

                  {speechRecognitionActive && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Transcribing
                    </span>
                  )}
                </div>

                {/* Speech Recognition Browser Support Notice */}
                {!speechRecognitionSupported && (
                  <div className="my-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Speech analysis is unavailable in this browser.</strong>
                      <span>Please type your answer or use a supported browser (Chrome, Edge, or Safari).</span>
                    </div>
                  </div>
                )}

                {/* Editable Spoken Transcript Box */}
                <div className="mt-3">
                  <label className="text-[11px] font-medium text-[#78716C] block mb-1">
                    Your Spoken Words (Auto-transcribed or typed):
                  </label>
                  <textarea
                    value={answerTranscript}
                    onChange={(e) => {
                      setAnswerTranscript(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder={
                      isRecording 
                        ? "Listening to your answer... Speak clearly into your microphone." 
                        : "No answer recorded yet. Click 'Start Recording' and speak your response, or type directly here."
                    }
                    rows={7}
                    className="w-full p-3.5 rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] text-[#1C1917] text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-[#E65A3C] focus:ring-2 focus:ring-[#E65A3C]/10 transition-all resize-y placeholder:text-[#A8A29E]"
                  />
                </div>

                {/* Live Metrics from Real Words */}
                <div className="grid grid-cols-3 gap-2 mt-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] text-xs">
                  <div>
                    <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Word Count</span>
                    <span className={`font-mono font-bold text-sm block mt-0.5 tabular-nums ${
                      wordCount >= 100 ? 'text-[#1B4332]' : (wordCount > 30 ? 'text-[#E65A3C]' : 'text-[#78716C]')
                    }`}>
                      {wordCount} words
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Keywords Matched</span>
                    <span className="font-mono font-bold text-sm text-[#1B4332] block mt-0.5 tabular-nums">
                      {detectedKeywords.length} / {currentQuestion.expectedKeywords.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Fillers Detected</span>
                    <span className={`font-mono font-bold text-sm block mt-0.5 tabular-nums ${
                      fillerCount > 0 ? 'text-[#B45309]' : 'text-[#1B4332]'
                    }`}>
                      {fillerCount}
                    </span>
                  </div>
                </div>

                {/* Live Keywords Chips */}
                <div className="mt-3">
                  <span className="text-[11px] text-[#78716C] block mb-1.5 font-medium">
                    Live Expected Keywords Tracking:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {detectedKeywords.map(k => (
                      <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#E8F2EC] text-[#1B4332] border border-[#C5DED0]">
                        <Check className="w-3 h-3" />
                        {k}
                      </span>
                    ))}
                    {missingKeywords.map(k => (
                      <span key={k} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] text-[#A8A29E] bg-white border border-[#EAE5DC]">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Validation Error Message */}
                {validationError && (
                  <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-[#F0ECE4] flex flex-wrap items-center justify-between gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSkip}
                  icon={<SkipForward className="w-3.5 h-3.5" />}
                >
                  Skip Prompt
                </Button>

                <Button
                  size="md"
                  variant="primary"
                  onClick={handleAnalyzeAndProceed}
                  disabled={isAnalyzing}
                  icon={isAnalyzing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                >
                  {isAnalyzing
                    ? 'Evaluating Answer NLP...'
                    : currentQuestionIndex < questionsList.length - 1
                    ? 'Submit & Next Question'
                    : 'Finish & View Real Assessment'}
                </Button>
              </div>

            </div>

          </div>

          {/* Real Architecture Notice for Future Python/FastAPI Backend Integration */}
          <div className="p-6 rounded-2xl bg-white border border-[#E7E2DA] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                <Film className="w-4 h-4 text-[#E65A3C]" />
                Video Analysis & Backend Pipeline Architecture
              </div>
              <span className="text-[11px] font-mono text-[#1B4332] bg-[#E8F2EC] px-2.5 py-0.5 rounded-full font-medium">
                Active Client NLP Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
              
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF]">
                <strong className="block text-[#1C1917] mb-1">Live Camera Recording</strong>
                <span className="text-[#1B4332] font-semibold block">Browser MediaRecorder API</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">Stored in IndexedDB memory</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF]">
                <strong className="block text-[#1C1917] mb-1">Spoken Answer Extraction</strong>
                <span className="text-[#1B4332] font-semibold block">
                  {speechRecognitionSupported ? 'Web Speech API Active' : 'Manual Typing Fallback'}
                </span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">Real transcript parsing</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF]">
                <strong className="block text-[#1C1917] mb-1">Facial & Gaze Analysis</strong>
                <span className="text-[#B45309] font-semibold block">Coming Soon (Python/FastAPI)</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">OpenCV / MediaPipe backend</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF]">
                <strong className="block text-[#1C1917] mb-1">Voice Pitch & Posture</strong>
                <span className="text-[#B45309] font-semibold block">Coming Soon (Python/FastAPI)</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">PyAudio & Pose classification</span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
