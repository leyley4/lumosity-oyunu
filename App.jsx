import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, Zap, Play, RotateCcw, Home, Circle, Square, Triangle, Star, Hexagon, Check, X } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'memory', 'speed', 'gameover'
  const [score, setScore] = useState(0);
  const [lastGamePlayed, setLastGamePlayed] = useState('');

  const startGame = (gameType) => {
    setScore(0);
    setLastGamePlayed(gameType);
    setCurrentView(gameType);
  };

  const endGame = (finalScore) => {
    setScore(finalScore);
    setCurrentView('gameover');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('menu')}>
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">BeyinGücü</h1>
        </div>
        {currentView !== 'menu' && currentView !== 'gameover' && (
          <div className="flex items-center gap-4 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
            <span className="font-semibold text-indigo-800">Puan: {score}</span>
          </div>
        )}
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        {currentView === 'menu' && <MainMenu onStartGame={startGame} />}
        {currentView === 'memory' && <MemoryMatrix onEndGame={endGame} />}
        {currentView === 'speed' && <SpeedMatch onEndGame={endGame} />}
        {currentView === 'gameover' && (
          <GameOver 
            score={score} 
            gameName={lastGamePlayed === 'memory' ? 'Hafıza Matrisi' : 'Hız Eşleştirme'}
            onRestart={() => startGame(lastGamePlayed)}
            onMainMenu={() => setCurrentView('menu')}
          />
        )}
      </main>
    </div>
  );
};

const MainMenu = ({ onStartGame }) => {
  return (
    <div className="max-w-4xl w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Zihnini Keskinleştir</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Her gün sadece birkaç dakika ayırarak hafızanı ve reflekslerini güçlendir. Oynamak istediğin antrenmanı seç.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Hafıza Matrisi Kartı */}
        <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex justify-center items-center h-48">
            <Brain className="w-24 h-24 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="p-8 flex flex-col flex-grow">
            <h3 className="text-2xl font-bold mb-3 text-slate-800">Hafıza Matrisi</h3>
            <p className="text-slate-600 mb-6 flex-grow">Kısa süreliğine beliren karelerin yerlerini akılda tut ve gizlendikten sonra onları bul. Uzamsal hafızanı test et.</p>
            <button 
              onClick={() => onStartGame('memory')}
              className="w-full py-4 rounded-xl font-bold text-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" /> Oyuna Başla
            </button>
          </div>
        </div>

        {/* Hız Eşleştirme Kartı */}
        <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 flex justify-center items-center h-48">
            <Zap className="w-24 h-24 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="p-8 flex flex-col flex-grow">
            <h3 className="text-2xl font-bold mb-3 text-slate-800">Hız Eşleştirme</h3>
            <p className="text-slate-600 mb-6 flex-grow">Ekranda beliren şekil, bir önceki şekil ile aynı mı? Hızlı düşün ve karar ver. Bilgi işleme hızını artır.</p>
            <button 
              onClick={() => onStartGame('speed')}
              className="w-full py-4 rounded-xl font-bold text-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" /> Oyuna Başla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoryMatrix = ({ onEndGame }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState('memorize'); // 'memorize', 'recall', 'feedback'
  
  // Izgara yapılandırması
  const gridSize = level < 4 ? 3 : (level < 8 ? 4 : 5);
  const activeTileCount = Math.min(2 + level, Math.floor((gridSize * gridSize) * 0.6));
  
  const [activeTiles, setActiveTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [wrongTile, setWrongTile] = useState(null);

  // Turu Başlat
  const startRound = useCallback(() => {
    const totalTiles = gridSize * gridSize;
    const newActiveTiles = [];
    while (newActiveTiles.length < activeTileCount) {
      const rand = Math.floor(Math.random() * totalTiles);
      if (!newActiveTiles.includes(rand)) {
        newActiveTiles.push(rand);
      }
    }
    setActiveTiles(newActiveTiles);
    setSelectedTiles([]);
    setWrongTile(null);
    setGameState('memorize');

    // 1.5 saniye sonra hatırlama evresine geç
    setTimeout(() => {
      setGameState('recall');
    }, Math.max(800, 2000 - (level * 100))); // Seviye arttıkça ezberleme süresi azalır
  }, [gridSize, activeTileCount, level]);

  // İlk yüklemede oyunu ve zamanlayıcıyı başlat
  useEffect(() => {
    startRound();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startRound]);

  // Zaman bittiğinde
  useEffect(() => {
    if (timeLeft === 0) {
      onEndGame(score);
    }
  }, [timeLeft, score, onEndGame]);

  const handleTileClick = (index) => {
    if (gameState !== 'recall') return;
    if (selectedTiles.includes(index)) return;

    if (activeTiles.includes(index)) {
      // Doğru seçim
      const newSelected = [...selectedTiles, index];
      setSelectedTiles(newSelected);
      
      if (newSelected.length === activeTiles.length) {
        // Tur tamamlandı
        setGameState('feedback');
        setScore(s => s + (level * 50));
        setTimeout(() => {
          setLevel(l => l + 1);
        }, 500);
      }
    } else {
      // Yanlış seçim
      setGameState('feedback');
      setWrongTile(index);
      setTimeout(() => {
        // Hata yapınca aynı seviyeyi tekrarla, puan düşme yok ama vakit kaybı
        startRound();
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="text-lg font-semibold text-slate-500">Seviye: <span className="text-indigo-600">{level}</span></div>
        <div className="flex items-center gap-2 text-xl font-bold bg-slate-100 px-4 py-2 rounded-lg">
          Zaman: <span className={timeLeft <= 10 ? 'text-red-500' : 'text-slate-800'}>{timeLeft}s</span>
        </div>
      </div>

      <div className="text-center mb-6 h-8">
        {gameState === 'memorize' && <p className="text-lg font-medium animate-pulse text-indigo-600">Karelerin yerini ezberle!</p>}
        {gameState === 'recall' && <p className="text-lg font-medium text-slate-700">Kareleri hatırla ve tıkla.</p>}
        {gameState === 'feedback' && !wrongTile && <p className="text-lg font-bold text-green-500">Harika! Sonraki seviye...</p>}
        {gameState === 'feedback' && wrongTile !== null && <p className="text-lg font-bold text-red-500">Yanlış kare, tekrar dene!</p>}
      </div>

      <div 
        className="grid gap-2 mb-8 w-full aspect-square bg-slate-100 p-3 rounded-xl"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const isActive = activeTiles.includes(index);
          const isSelected = selectedTiles.includes(index);
          const isWrong = wrongTile === index;
          
          let tileClass = "bg-white rounded-lg cursor-pointer transition-all duration-200 shadow-sm border-b-4 border-slate-200 hover:bg-slate-50";
          
          if (gameState === 'memorize' && isActive) {
            tileClass = "bg-indigo-500 rounded-lg shadow-inner border-b-4 border-indigo-700 scale-95";
          } else if (gameState === 'recall') {
             if (isSelected) {
               tileClass = "bg-green-400 rounded-lg border-b-0 translate-y-1";
             }
          } else if (gameState === 'feedback') {
             if (isWrong) {
                tileClass = "bg-red-500 rounded-lg animate-shake border-red-700";
             } else if (isActive) {
                // Gösterimi tamamla
                tileClass = "bg-indigo-300 rounded-lg opacity-50";
             }
          }

          return (
            <div 
              key={index}
              onClick={() => handleTileClick(index)}
              className={`${tileClass} w-full h-full min-h-[4rem]`}
            />
          );
        })}
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 linear" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
      </div>
    </div>
  );
};

const shapes = [
  { id: 'circle', component: Circle, color: 'text-blue-500' },
  { id: 'square', component: Square, color: 'text-red-500' },
  { id: 'triangle', component: Triangle, color: 'text-green-500' },
  { id: 'star', component: Star, color: 'text-amber-500' },
  { id: 'hexagon', component: Hexagon, color: 'text-purple-500' }
];

const SpeedMatch = ({ onEndGame }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [previousShape, setPreviousShape] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'

  const generateShape = useCallback(() => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    // İlk şekil değilse bazen bilerek aynısını getirelim ki "Evet" seçeneği çıksın
    if (previousShape && Math.random() > 0.5) {
      return previousShape;
    }
    return randomShape;
  }, [previousShape]);

  // İlk yükleme
  useEffect(() => {
    const initial = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentShape(initial);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Zaman bitimi
  useEffect(() => {
    if (timeLeft === 0) {
      onEndGame(score);
    }
  }, [timeLeft, score, onEndGame]);

  const handleAnswer = (isSameBtn) => {
    if (!previousShape) {
      // İlk şekilde mantıken önceki yok. O yüzden ilk butona basıldığında oyunu başlatmış gibi olalım
      setPreviousShape(currentShape);
      setCurrentShape(generateShape());
      return;
    }

    const isActuallySame = previousShape.id === currentShape.id;
    
    if (isSameBtn === isActuallySame) {
      // Doğru
      setScore(s => s + 50);
      setFeedback('correct');
    } else {
      // Yanlış
      setScore(s => Math.max(0, s - 20));
      setFeedback('wrong');
    }

    setTimeout(() => setFeedback(null), 300);
    setPreviousShape(currentShape);
    setCurrentShape(generateShape());
  };

  const CurrentIcon = currentShape?.component;

  return (
    <div className="w-full max-w-lg bg-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center">
       <div className="w-full flex justify-between items-center mb-8">
        <div className="text-lg font-semibold text-slate-500">Puan: <span className="text-orange-500">{score}</span></div>
        <div className="flex items-center gap-2 text-xl font-bold bg-slate-100 px-4 py-2 rounded-lg">
          Zaman: <span className={timeLeft <= 10 ? 'text-red-500' : 'text-slate-800'}>{timeLeft}s</span>
        </div>
      </div>

      <div className="text-center mb-8 h-12">
        {!previousShape ? (
          <p className="text-lg text-slate-600">Gördüğün ilk şekli aklında tut. Herhangi bir butona basarak başla.</p>
        ) : (
           <p className="text-xl font-medium text-slate-800">Şu anki şekil, <strong className="text-orange-500">öncekiyle aynı mı?</strong></p>
        )}
      </div>

      <div className="relative w-48 h-48 bg-slate-50 rounded-3xl border-4 border-slate-100 flex justify-center items-center mb-12 shadow-inner">
         {feedback === 'correct' && <div className="absolute inset-0 bg-green-100 rounded-2xl opacity-50 transition-opacity"></div>}
         {feedback === 'wrong' && <div className="absolute inset-0 bg-red-100 rounded-2xl opacity-50 transition-opacity"></div>}
         
         {CurrentIcon && (
           <CurrentIcon className={`w-32 h-32 ${currentShape.color} drop-shadow-md`} strokeWidth={1.5} />
         )}
      </div>

      <div className="flex w-full gap-4">
        <button 
          onClick={() => handleAnswer(false)}
          className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xl transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <X className="w-6 h-6 text-red-500" /> Hayır (Farklı)
        </button>
        <button 
          onClick={() => handleAnswer(true)}
          className="flex-1 py-5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-2xl font-bold text-xl transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <Check className="w-6 h-6 text-green-600" /> Evet (Aynı)
        </button>
      </div>
      
      {/* İsteğe bağlı klavye yönlendirmesi eklenebilir, şimdilik touch/click odaklı */}
    </div>
  );
};

const GameOver = ({ score, gameName, onRestart, onMainMenu }) => {
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl text-center">
      <div className="mb-6 inline-flex justify-center items-center bg-indigo-100 w-24 h-24 rounded-full">
        <Brain className="w-12 h-12 text-indigo-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Antrenman Bitti!</h2>
      <p className="text-slate-500 mb-8">{gameName} oyununda elde ettiğin skor:</p>
      
      <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-10">
        {score}
      </div>

      <div className="space-y-4">
        <button 
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
        >
          <RotateCcw className="w-5 h-5" /> Tekrar Oyna
        </button>
        <button 
          onClick={onMainMenu}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2"
        >
          <Home className="w-5 h-5" /> Ana Menüye Dön
        </button>
      </div>
    </div>
  );
};

export default App;
