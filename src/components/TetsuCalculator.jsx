import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Info, Github, Coffee, Scale, Play, Square } from 'lucide-react';

const TetsuCalculator = () => {
  const [coffee, setCoffee] = useState(20);
  const [ratio, setRatio] = useState(15);
  const [tasteProfile, setTasteProfile] = useState('standard');
  const [strength, setStrength] = useState('strong');
  const [showMethod, setShowMethod] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const [calculations, setCalculations] = useState({
    totalWater: 0,
    firstPours: [],
    secondPours: [],
    runningTotal: []
  });

  const calculatePours = () => {
    const totalWater = coffee * ratio;
    const firstPhaseWater = totalWater * 0.4;
    const secondPhaseWater = totalWater * 0.6;

    let firstPours = [];
    switch (tasteProfile) {
      case 'sweet':
        firstPours = [firstPhaseWater * 0.42, firstPhaseWater * 0.58];
        break;
      case 'bright':
        firstPours = [firstPhaseWater * 0.58, firstPhaseWater * 0.42];
        break;
      default:
        firstPours = [firstPhaseWater * 0.5, firstPhaseWater * 0.5];
    }

    let secondPours = [];
    switch (strength) {
      case 'light':
        secondPours = [secondPhaseWater];
        break;
      case 'strong':
        secondPours = [secondPhaseWater / 2, secondPhaseWater / 2];
        break;
      case 'stronger':
        secondPours = [secondPhaseWater / 3, secondPhaseWater / 3, secondPhaseWater / 3];
        break;
    }

    const allPours = [...firstPours, ...secondPours];
    const runningTotal = allPours.reduce((acc, curr, idx) => {
      const prev = idx > 0 ? acc[idx - 1] : 0;
      acc.push(Math.round(prev + curr));
      return acc;
    }, []);

    setCalculations({
      totalWater,
      firstPours: firstPours.map(Math.round),
      secondPours: secondPours.map(Math.round),
      runningTotal
    });
  };

  useEffect(() => {
    calculatePours();
  }, [coffee, ratio, tasteProfile, strength]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setCurrentStep(0);
    startTimeRef.current = Date.now() - (elapsedTime * 1000);
    timerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedTime(elapsedSeconds);
      
      const newStep = Math.floor(elapsedSeconds / 45);
      if (newStep !== currentStep && newStep < calculations.firstPours.length + calculations.secondPours.length) {
        setCurrentStep(newStep);
      }
    }, 100);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setElapsedTime(0);
    setCurrentStep(-1);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-stone-50 to-neutral-100 shadow-xl rounded-2xl overflow-hidden border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-stone-800" />
              <h1 className="text-2xl font-bold text-stone-800">
                Tetsu Kasuya Method
              </h1>
            </div>
            <button 
              onClick={() => setShowMethod(true)}
              className="p-2 rounded-full hover:bg-stone-100/50 transition-colors"
            >
              <Info className="w-5 h-5 text-stone-600" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-800 mb-1">
                  <Coffee className="w-4 h-4" />
                  Coffee (g)
                </label>
                <div className="space-y-1">
                  <input
                    type="number"
                    value={coffee}
                    onChange={(e) => setCoffee(e.target.value === '' ? '' : Number(e.target.value))}
                    min="0"
                    max="1000"
                    step="1"
                    className="w-full px-3 py-2 bg-white/80 border-2 border-stone-200 rounded-lg 
                             focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all text-lg"
                    placeholder="20"
                  />
                  <p className="text-xs text-stone-500 italic">
                    Recommended minimum quantity is 6g, finest grind
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-800 mb-1">
                  <Scale className="w-4 h-4" />
                  Ratio (1:{ratio})
                </label>
                <input
                  type="range"
                  value={ratio}
                  onChange={(e) => setRatio(Number(e.target.value))}
                  min="13"
                  max="19"
                  className="w-full h-2 bg-gradient-to-r from-stone-700 to-stone-400 rounded-lg 
                           appearance-none cursor-pointer accent-stone-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-stone-800 mb-1">
                    Taste Profile
                  </label>
                  <select
                    value={tasteProfile}
                    onChange={(e) => setTasteProfile(e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 border-2 border-stone-200 rounded-lg 
                             focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                  >
                    <option value="standard">Standard</option>
                    <option value="sweet">Sweeter</option>
                    <option value="bright">Brighter</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-800 mb-1">
                    Strength
                  </label>
                  <select
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 border-2 border-stone-200 rounded-lg 
                             focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                  >
                    <option value="light">Light</option>
                    <option value="strong">Strong</option>
                    <option value="stronger">Stronger</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-stone-800">
                  Pour Schedule
                </h3>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-stone-800 w-16 text-right">
                    {formatTime(elapsedTime)}
                  </div>
                  {!isTimerRunning ? (
                    <button
                      onClick={startTimer}
                      className="p-2 rounded-lg bg-stone-700 text-white hover:bg-stone-800 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={resetTimer}
                      className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                {[...calculations.firstPours, ...calculations.secondPours].map((pour, idx, arr) => (
                  <div 
                    key={idx} 
                    className={`relative flex items-center gap-4 ${
                      currentStep === idx ? 'bg-stone-200 -mx-2 px-2 rounded-lg' : ''
                    }`}
                  >
                    <div className="w-16">
                      <div className="text-base font-medium text-stone-700 text-right">
                        {formatTime(idx * 45)}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className={`h-2 w-2 rounded-full ${
                        idx <= currentStep ? 'bg-stone-900' : 'bg-stone-300'
                      } relative z-10`} />
                      {idx !== arr.length - 1 && (
                        <div className={`absolute left-1 top-2 h-14 w-0.5 ${
                          idx < currentStep ? 'bg-stone-900' : 'bg-stone-300'
                        } -translate-x-1/2`} />
                      )}
                    </div>
                    
                    <div className="flex-1 py-2 px-3">
                      <span className="text-sm font-medium text-stone-800">
                        {idx === 0 ? (
                          <>Bloom with <span className="font-bold">{pour}g</span></>
                        ) : (
                          <>Add up to <span className="font-bold">{calculations.runningTotal[idx]}g water</span></>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <footer className="mt-6 py-3 px-6 bg-white/20 backdrop-blur-sm border-t border-stone-200">
          <div className="flex justify-between items-center text-sm text-stone-600">
            <span>From Meenaviyal</span>
            <a 
              href="https://github.com/meenaviyal/v60-calculator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-stone-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </footer>
      </Card>

      <AlertDialog open={showMethod} onOpenChange={setShowMethod}>
        <AlertDialogContent className="bg-white max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>The 4:6 Method by Tetsu Kasuya</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-gray-600">
              <p>
                The 4:6 method is an innovative pour-over technique developed by 2016 World Brewers Cup Champion Tetsu Kasuya. At its core, this method divides the total brewing water into two phases: 40% for the first phase and 60% for the second phase, giving you precise control over both the flavor and strength of your coffee.
              </p>
              
              <p>
                The first phase represents 40% of the total water and controls the balance between sweetness and acidity. With this method, you can fine-tune these flavors by adjusting how you split the water between two pours. Using a smaller first pour creates a sweeter cup, while a larger first pour emphasizes brightness and acidity. For a balanced cup, use equal pours.
              </p>
              
              <p>
                The second phase uses the remaining 60% of water and determines the coffee's strength. The way you divide this water affects the final intensity of your brew. A single pour produces a lighter body, two pours create a stronger cup, and three pours result in the most intense flavor. This systematic approach allows you to consistently brew coffee tailored to your taste preferences.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-stone-100 hover:bg-stone-200">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TetsuCalculator;
