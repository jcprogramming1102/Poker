import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Player {
  id: string;
  name: string;
  totalScore: number; // 累积总分
  roundScore: number; // 当前局分数
  isDealer: boolean;
}

export interface Round {
  roundNumber: number;
  playerScores: Record<string, number>;
  dealerScore?: number;
  timestamp: string;
}

export interface GameRecord {
  id: string;
  date: string;
  players: Player[];
  rounds: Round[];
}

interface GameState {
  players: Player[];
  currentRound: number;
  rounds: Round[];
  gameRecords: GameRecord[];
  gameStarted: boolean;
  
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setDealer: (id: string) => void;
  updatePlayerRoundScore: (playerId: string, change: number) => void;
  startGame: () => void;
  endGame: () => void;
  nextRound: () => void;
  resetGame: () => void;
  resetSystem: () => void;
  addGameRecord: (record: GameRecord) => void;
  deleteGameRecord: (id: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      return {
        players: [],
        currentRound: 1,
        rounds: [],
        gameRecords: [],
        gameStarted: false,

        addPlayer: (name: string) => {
          set(state => {
            const newPlayer: Player = {
              id: Date.now().toString(),
              name,
              totalScore: 0,
              roundScore: 0,
              isDealer: false
            };
            return { players: [...state.players, newPlayer] };
          });
        },

        removePlayer: (id: string) => {
          set(state => ({
            players: state.players.filter(p => p.id !== id)
          }));
        },

        setDealer: (id: string) => {
          set(state => {
            const newPlayers = state.players.map(p => {
              return {
                ...p,
                isDealer: p.id === id
              };
            });
            return { players: newPlayers };
          });
        },

        updatePlayerRoundScore: (playerId: string, change: number) => {
          set(state => {
            const updatedPlayers = state.players.map(p => {
              if (p.id === playerId) {
                return { 
                  ...p, 
                  roundScore: p.roundScore + change,
                  totalScore: p.totalScore + change 
                };
              }
              return p;
            });

            // 计算所有非庄家玩家的总分并更新庄家的分数
            let dealerIndex = -1;
            let totalNonDealerScore = 0;
            updatedPlayers.forEach((p, index) => {
              if (p.isDealer) {
                dealerIndex = index;
              } else {
                totalNonDealerScore += p.roundScore;
              }
            });

            // 如果有庄家，更新庄家的分数为玩家总分的相反数
            if (dealerIndex !== -1) {
              updatedPlayers[dealerIndex] = {
                ...updatedPlayers[dealerIndex],
                roundScore: -totalNonDealerScore,
                totalScore: updatedPlayers[dealerIndex].totalScore - totalNonDealerScore
              };
            }

            const currentPlayerScores: Record<string, number> = {};
            updatedPlayers.forEach(p => {
              currentPlayerScores[p.id] = p.roundScore;
            });

            const updatedRounds = [...state.rounds];
            const lastRound = updatedRounds[updatedRounds.length - 1];
            
            if (lastRound && lastRound.roundNumber === state.currentRound) {
              lastRound.playerScores = currentPlayerScores;
              lastRound.dealerScore = -totalNonDealerScore;
            } else {
              updatedRounds.push({
                roundNumber: state.currentRound,
                playerScores: currentPlayerScores,
                dealerScore: -totalNonDealerScore,
                timestamp: new Date().toISOString()
              });
            }

            return {
              players: updatedPlayers,
              rounds: updatedRounds
            };
          });
        },

        startGame: () => {
          // 开始游戏时，重置玩家的roundScore
          set(state => {
            const resetPlayers = state.players.map(p => ({
              ...p,
              roundScore: 0
            }));
            return { 
              gameStarted: true, 
              currentRound: 1,
              rounds: [],
              players: resetPlayers
            };
          });
        },

        endGame: () => {
          const state = get();
          const newRecord: GameRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            players: [...state.players],
            rounds: [...state.rounds]
          };
          set({ gameStarted: false });
          get().addGameRecord(newRecord);
        },

        nextRound: () => {
          set(state => {
            // 保存当前局记录
            const playerScores: Record<string, number> = {};
            state.players.forEach(p => {
              playerScores[p.id] = p.roundScore;
            });
            
            // 计算庄家分数
            let totalNonDealerScore = 0;
            state.players.forEach(p => {
              if (!p.isDealer) {
                totalNonDealerScore += p.roundScore;
              }
            });

            const newRound: Round = {
              roundNumber: state.currentRound,
              playerScores,
              dealerScore: -totalNonDealerScore,
              timestamp: new Date().toISOString()
            };

            // 重置玩家roundScore为下一局做准备
            const resetPlayers = state.players.map(p => ({
              ...p,
              roundScore: 0
            }));

            return {
              currentRound: state.currentRound + 1,
              rounds: [...state.rounds, newRound],
              players: resetPlayers
            };
          });
        },

        resetGame: () => {
          set({
            players: [],
            currentRound: 1,
            rounds: [],
            gameStarted: false
          });
        },

        resetSystem: () => {
          set({
            players: [],
            currentRound: 1,
            rounds: [],
            gameRecords: [],
            gameStarted: false
          });
        },

        addGameRecord: (record: GameRecord) => {
          set(state => ({
            gameRecords: [record, ...state.gameRecords]
          }));
        },

        deleteGameRecord: (id: string) => {
          set(state => ({
            gameRecords: state.gameRecords.filter(record => record.id !== id)
          }));
        }
      };
    },
    {
      name: 'poker-scorer-storage'
    }
  )
);
