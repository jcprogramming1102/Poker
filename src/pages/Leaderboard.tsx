import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Star } from 'lucide-react';
import { useGameStore } from '../store';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { players, gameRecords } = useGameStore();

  // Get all players from all records for comprehensive ranking
  const getAllPlayers = () => {
    const playerMap = new Map<string, { name: string; totalScore: number }>();

    // Add current game players
    players.forEach(p => {
      playerMap.set(p.id, { name: p.name, totalScore: p.totalScore });
    });

    // Add players from game records
    gameRecords.forEach(record => {
      record.players.forEach(p => {
        const existing = playerMap.get(p.id);
        if (existing) {
          existing.totalScore = Math.max(existing.totalScore, p.totalScore);
        } else {
          playerMap.set(p.id, { name: p.name, totalScore: p.totalScore });
        }
      });
    });

    return Array.from(playerMap.values())
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  const allPlayers = getAllPlayers();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          
          <h1 className="text-4xl font-serif font-bold text-gold text-shadow">
            排行榜
          </h1>

          <div className="w-24"></div>
        </div>

        {allPlayers.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-24 h-24 text-gold/30 mx-auto mb-6" />
            <p className="text-white/60 text-xl">還沒有排行榜數據</p>
            <p className="text-white/40 mt-2">快來開始遊戲吧！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 Podium */}
            {allPlayers.slice(0, 3).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 2nd Place */}
                {allPlayers[1] && (
                  <div className="order-1 md:order-none mt-8 md:mt-12">
                    <div className="bg-gradient-to-br from-gray-400/30 to-gray-500/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-400/40 card-shadow text-center">
                      <div className="text-gray-300 mb-2">亞軍</div>
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <Medal className="w-10 h-10 text-gray-700" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{allPlayers[1].name}</h3>
                      <div className="text-3xl font-serif font-bold text-gray-300">
                        {allPlayers[1].totalScore}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {allPlayers[0] && (
                  <div className="order-0 md:order-none">
                    <div className="bg-gradient-to-br from-yellow-400/30 to-gold/40 backdrop-blur-sm rounded-2xl p-8 border border-gold/50 card-shadow text-center relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center shadow-lg">
                          <Trophy className="w-7 h-7 text-emerald-dark" />
                        </div>
                      </div>
                      <div className="text-gold-light mb-2 mt-4">冠軍</div>
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                        <Star className="w-12 h-12 text-emerald-dark fill-current" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{allPlayers[0].name}</h3>
                      <div className="text-4xl font-serif font-bold text-gold">
                        {allPlayers[0].totalScore}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {allPlayers[2] && (
                  <div className="order-2 md:order-none mt-8 md:mt-16">
                    <div className="bg-gradient-to-br from-amber-700/30 to-amber-800/30 backdrop-blur-sm rounded-2xl p-6 border border-amber-600/40 card-shadow text-center">
                      <div className="text-amber-400 mb-2">季軍</div>
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                        <Medal className="w-10 h-10 text-amber-200" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{allPlayers[2].name}</h3>
                      <div className="text-3xl font-serif font-bold text-amber-400">
                        {allPlayers[2].totalScore}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rest of Players */}
            {allPlayers.slice(3).length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <div className="divide-y divide-white/10">
                  {allPlayers.slice(3).map((player, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 rounded-full bg-white/10 text-white/70 flex items-center justify-center font-bold">
                          {index + 4}
                        </span>
                        <span className="text-white font-medium">{player.name}</span>
                      </div>
                      <span className="text-xl font-bold text-gold">{player.totalScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
