import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Clock, Trash2, Crown } from 'lucide-react';
import { useGameStore } from '../store';

const History = () => {
  const navigate = useNavigate();
  const { gameRecords, deleteGameRecord } = useGameStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          
          <h1 className="text-4xl font-serif font-bold text-gold text-shadow">
            遊戲記錄
          </h1>

          <div className="w-24"></div>
        </div>

        {gameRecords.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-24 h-24 text-gold/30 mx-auto mb-6" />
            <p className="text-white/60 text-xl">還沒有遊戲記錄</p>
          </div>
        ) : (
          <div className="space-y-6">
            {gameRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 card-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-gold" />
                    <span className="text-gold font-medium">{formatDate(record.date)}</span>
                  </div>
                  <button
                    onClick={() => deleteGameRecord(record.id)}
                    className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-white/70" />
                  <span className="text-white/70 font-medium">
                    {record.players.length} 位玩家，{record.rounds.length} 回合
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {record.players
                    .sort((a, b) => b.totalScore - a.totalScore)
                    .map((player, index) => (
                      <div
                        key={player.id}
                        className="bg-white/5 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-white">{player.name}</span>
                              {player.isDealer && (
                                <Crown className="w-4 h-4 text-gold" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gold">{player.totalScore}</span>
                          <span className="text-white/40 text-sm ml-2">總分</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
