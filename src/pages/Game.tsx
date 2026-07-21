import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, RefreshCw, MinusCircle, PlusCircle, Crown } from 'lucide-react';
import { useGameStore } from '../store';

const Game = () => {
  const navigate = useNavigate();
  const [showNextConfirm, setShowNextConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const { players, currentRound, updatePlayerRoundScore, endGame, nextRound } = useGameStore();

  const handleScoreChange = (playerId: string, change: number) => {
    updatePlayerRoundScore(playerId, change);
  };

  // 计算所有非庄家玩家的总分
  const nonDealerPlayers = players.filter(p => !p.isDealer);
  const totalPlayerScore = nonDealerPlayers.reduce((sum, p) => sum + p.roundScore, 0);
  const dealerScore = -totalPlayerScore;

  // 处理退出游戏
  const handleBack = () => {
    setShowBackConfirm(true);
  };

  const confirmBack = () => {
    setShowBackConfirm(false);
    navigate('/');
  };

  // 处理下一局
  const handleNextRound = () => {
    setShowNextConfirm(true);
  };

  const confirmNextRound = () => {
    setShowNextConfirm(false);
    nextRound();
  };

  // 处理结束游戏
  const handleEndGame = () => {
    setShowEndConfirm(true);
  };

  const confirmEndGame = () => {
    setShowEndConfirm(false);
    endGame();
    navigate('/history');
  };

  const getPlayerCardClass = (isDealer: boolean) => {
    if (isDealer) {
      return 'bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gold/50 card-shadow hover:border-gold/50 transition-all';
    }
    return 'bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 card-shadow hover:border-gold/50 transition-all';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-gold">第 {currentRound} 局</h1>
          </div>

          <button
            onClick={handleEndGame}
            className="flex items-center gap-2 px-4 py-2 bg-gold/20 border border-gold rounded-xl text-gold hover:bg-gold/30 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            結束遊戲
          </button>
        </div>

        <div className="bg-emerald/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald/40 mb-8 card-shadow">
          <h3 className="text-lg font-semibold text-gold mb-3">21點計分規則</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-500/30 text-green-400 flex items-center justify-center font-bold">+2</span>
              <span>玩家獲得21點</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center font-bold">+1</span>
              <span>玩家贏過莊家</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-500/30 text-red-400 flex items-center justify-center font-bold">-1</span>
              <span>玩家輸給莊家</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center font-bold">-2</span>
              <span>玩家超過21點</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={getPlayerCardClass(player.isDealer)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light text-emerald-dark font-bold flex items-center justify-center text-lg">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">{player.name}</h3>
                    {player.isDealer && <Crown className="w-5 h-5 text-gold" />}
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <span className="text-5xl font-serif font-bold text-gold">
                  {player.isDealer ? dealerScore : player.roundScore}
                </span>
                <p className="text-white/60 mt-1">
                  {player.isDealer ? '莊家 - 本局分數' : '本局分數'}
                </p>
                {!player.isDealer && (
                  <p className="text-white/40 text-sm mt-1">
                    累計: {player.totalScore}
                  </p>
                )}
              </div>

              {player.isDealer ? (
                <div className="text-center py-6">
                  <p className="text-white/50 text-lg">莊家 - 不參與計分</p>
                  <p className="text-white/30 text-sm mt-2">
                    分數 = 玩家總分相反
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleScoreChange(player.id, 2)}
                    className="flex flex-col items-center gap-1 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-all hover:scale-105"
                  >
                    <PlusCircle className="w-6 h-6" />
                    <span className="font-bold">+2</span>
                  </button>
                  
                  <button
                    onClick={() => handleScoreChange(player.id, 1)}
                    className="flex flex-col items-center gap-1 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all hover:scale-105"
                  >
                    <PlusCircle className="w-6 h-6" />
                    <span className="font-bold">+1</span>
                  </button>
                  
                  <button
                    onClick={() => handleScoreChange(player.id, -1)}
                    className="flex flex-col items-center gap-1 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all hover:scale-105"
                  >
                    <MinusCircle className="w-6 h-6" />
                    <span className="font-bold">-1</span>
                  </button>
                  
                  <button
                    onClick={() => handleScoreChange(player.id, -2)}
                    className="flex flex-col items-center gap-1 p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all hover:scale-105"
                  >
                    <MinusCircle className="w-6 h-6" />
                    <span className="font-bold">-2</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 mb-8 card-shadow">
          <h3 className="text-lg font-semibold text-red-300 mb-4">莊家21點</h3>
          <p className="text-white/70 mb-4">如果莊家獲得21點，所有玩家都獲得 -1</p>
          <button
            onClick={() => {
              nonDealerPlayers.forEach(p => handleScoreChange(p.id, -1));
            }}
            className="w-full py-3 bg-red-500/30 border border-red-500 rounded-xl text-red-300 hover:bg-red-500/40 transition-all font-semibold"
          >
            莊家21點 - 全員 -1
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleNextRound}
            className="px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-emerald-dark text-xl font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 card-shadow"
          >
            <RefreshCw className="w-6 h-6 inline mr-3" />
            下一回合
          </button>
        </div>

        {/* 返回确认对话框 */}
        {showBackConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-emerald/95 backdrop-blur-lg rounded-2xl p-8 border border-gold/30 max-w-md w-full card-shadow">
              <h3 className="text-2xl font-bold text-gold mb-4 text-center">確認返回？</h3>
              <p className="text-white/80 text-center mb-6">
                返回將會保留當前遊戲進度，您可以稍後繼續。
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowBackConfirm(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmBack}
                  className="px-6 py-3 bg-gold/30 text-gold border border-gold rounded-xl hover:bg-gold/40 transition-colors"
                >
                  確認返回
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 下一局确认对话框 */}
        {showNextConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-emerald/95 backdrop-blur-lg rounded-2xl p-8 border border-gold/30 max-w-md w-full card-shadow">
              <h3 className="text-2xl font-bold text-gold mb-4 text-center">確認下一回合？</h3>
              <p className="text-white/80 text-center mb-6">
                此操作將保存當前回合分數並開始新回合。
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowNextConfirm(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmNextRound}
                  className="px-6 py-3 bg-gold/30 text-gold border border-gold rounded-xl hover:bg-gold/40 transition-colors"
                >
                  確認下一回合
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 结束游戏确认对话框 */}
        {showEndConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-emerald/95 backdrop-blur-lg rounded-2xl p-8 border border-gold/30 max-w-md w-full card-shadow">
              <h3 className="text-2xl font-bold text-gold mb-4 text-center">確認結束遊戲？</h3>
              <p className="text-white/80 text-center mb-6">
                此操作將保存遊戲記錄並返回首頁。
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmEndGame}
                  className="px-6 py-3 bg-red-500/30 text-red-300 border border-red-500 rounded-xl hover:bg-red-500/40 transition-colors"
                >
                  確認結束
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
