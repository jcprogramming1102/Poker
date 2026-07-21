import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, History, Play, Plus, Trash2, Crown, RotateCcw, AlertCircle } from 'lucide-react';
import { useGameStore } from '../store';

const Home = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showNoDealerError, setShowNoDealerError] = useState(false);
  const { players, addPlayer, removePlayer, setDealer, startGame, resetSystem } = useGameStore();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      addPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  const handleStartGame = () => {
    // 检查是否有庄家
    const hasDealer = players.some(p => p.isDealer);
    if (!hasDealer) {
      setShowNoDealerError(true);
      return;
    }

    if (players.length > 0) {
      startGame();
      navigate('/game');
    }
  };

  const handleResetSystem = () => {
    resetSystem();
    setShowResetConfirm(false);
  };

  const getButtonClass = (isDealer: boolean) => {
    if (isDealer) {
      return 'px-3 py-1.5 rounded-lg transition-all bg-gold/30 text-gold border border-gold';
    }
    return 'px-3 py-1.5 rounded-lg transition-all bg-white/10 text-white/70 hover:bg-gold/20 hover:text-gold hover:border-gold border border-transparent';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-gold mb-4 text-shadow">
            掌控遊戲勝負
          </h1>
          <p className="text-xl text-white/80">記錄每一刻輝煌</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/leaderboard')}
            className="group bg-emerald/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald/50 hover:bg-emerald/40 transition-all duration-300 card-shadow"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-gold group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-white">排行榜</h3>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="group bg-emerald/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald/50 hover:bg-emerald/40 transition-all duration-300 card-shadow"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <History className="w-12 h-12 text-gold group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-white">遊戲記錄</h3>
            </div>
          </button>
        </div>

        <div className="bg-emerald/20 backdrop-blur-sm rounded-3xl p-8 border border-emerald/40 card-shadow mb-8">
          <h2 className="text-3xl font-serif font-bold text-gold mb-6 flex items-center gap-3">
            <Users className="w-8 h-8" />
            玩家管理
          </h2>

          <form onSubmit={handleAddPlayer} className="flex gap-3 mb-8">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="輸入玩家姓名..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-gold focus:bg-white/15 transition-all"
            />
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-emerald-dark font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              加入
            </button>
          </form>

          <div className="space-y-3">
            {players.length === 0 ? (
              <p className="text-white/60 text-center py-8">還沒有玩家，快來加入吧！</p>
            ) : (
              players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light text-emerald-dark font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-lg">{player.name}</span>
                    </div>
                    {player.isDealer && (
                      <Crown className="w-5 h-5 text-gold" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDealer(player.id)}
                      className={getButtonClass(player.isDealer)}
                    >
                      {player.isDealer ? '莊家' : '設為莊家'}
                    </button>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {players.length > 0 && (
          <div className="text-center mb-4">
            <button
              onClick={handleStartGame}
              className="px-12 py-4 bg-gradient-to-r from-gold to-gold-light text-emerald-dark text-2xl font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 card-shadow"
            >
              <Play className="w-8 h-8 inline mr-3" />
              開始遊戲
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-8 py-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-xl hover:bg-red-500/20 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            重置系統
          </button>
        </div>

        {/* 重置系统确认对话框 */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-emerald/95 backdrop-blur-lg rounded-2xl p-8 border border-gold/30 max-w-md w-full card-shadow">
              <h3 className="text-2xl font-bold text-gold mb-4 text-center">確認重置系統？</h3>
              <p className="text-white/80 text-center mb-6">
                此操作將刪除所有玩家、遊戲記錄，並重置所有數據。此操作無法撤銷！
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleResetSystem}
                  className="px-6 py-3 bg-red-500/30 text-red-300 border border-red-500 rounded-xl hover:bg-red-500/40 transition-colors"
                >
                  確認重置
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 没有庄家错误对话框 */}
        {showNoDealerError && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-emerald/95 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30 max-w-md w-full card-shadow">
              <div className="text-center mb-4">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-red-300 mb-4 text-center">錯誤：沒有莊家</h3>
              <p className="text-white/80 text-center mb-6">
                開始遊戲前必須先選擇一位玩家作為莊家。請點擊「設為莊家」按鈕。
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowNoDealerError(false)}
                  className="px-8 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  知道了
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
