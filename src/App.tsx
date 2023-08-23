import { useContext, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import { socket } from './socket';
import { AuthContext } from './auth-context';

import './App.css';
import { fetcher } from './leaderboards';
import { URL } from './axios';

function computeWinnerText(player1: boolean, winner: string) {
  if (winner == 'd') return 'Draw';

  if (winner == 'p1' && player1) {
    return 'You win';
  } else if (winner == 'p1' && !player1) {
    return 'You lose';
  } else if (winner == 'p2' && !player1) {
    return 'You win';
  } else if (winner == 'p2' && player1) {
    return 'You lose';
  }

  return 'No one wins';
}

const TIMER = 5;

function App() {
  const [roomId, setRoomId] = useState<string>('');
  const [player1, setPlayer1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selected, setSelected] = useState<string>('');
  const [winner, setWinner] = useState<string>('');
  const [rematchRequested, setRematchRequested] = useState(false);
  const { user } = useContext(AuthContext);

  const { data } = useSWR(`${URL}/users/${user.id}`, fetcher);
  console.log(data);
  const [timer, setTimer] = useState(TIMER);
  const timerId = useRef<number>(null);

  const clear = () => {
    clearInterval(timerId.current);
  };

  useEffect(() => {
    if (gameStarted) {
      timerId.current = setInterval(() => {
        setTimer((time) => time - 1);
      }, 1000);
    }

    return () => clear();
  }, [gameStarted]);

  useEffect(() => {
    if (timer === 0) {
      socket.emit('timeout', { roomId: roomId });
      clear();
    }
  }, [timer, roomId]);

  useEffect(() => {
    function onConnect() {
      console.log(socket.id);
    }

    function onNewGame(data) {
      setRoomId(data.roomId);
      setPlayer1(data.player1);
      setLoading(true);
      setWinner('');
      setRematchRequested(false);
    }

    function onGameStarted() {
      setGameStarted(true);
      setLoading(false);
      setTimer(TIMER);
    }

    function onGameEnded(data) {
      setGameStarted(false);
      setWinner(data.winner);
      setSelected('');
      if (data.winner == 'd') {
        onGameStarted();
      }
    }

    function onRematchRequested(data) {
      setRoomId(data.roomId);
      setRematchRequested(true);
    }

    function onGameCancelled() {
      setGameStarted(false);
      setSelected('');
      clear();
      setTimer(TIMER);
    }

    socket.on('connect', onConnect);
    socket.on('new_game', onNewGame);
    socket.on('game_started', onGameStarted);
    socket.on('game_ended', onGameEnded);
    socket.on('rematch_requested', onRematchRequested);
    socket.on('game_cancelled', onGameCancelled);

    return () => {
      socket.off('connect', onConnect);
      socket.off('new_game', onNewGame);
      socket.off('game_started', onGameStarted);
      socket.off('game_ended', onGameStarted);
      socket.off('rematch_requested', onRematchRequested);
      socket.off('game_cancelled', onGameCancelled);
    };
  }, []);

  function handleClick() {
    socket.emit('find_game', { id: user.id });
  }

  function handleCancelGame() {
    socket.emit('cancel_game', { roomId: roomId });
  }

  function sendChoice(e: React.MouseEvent<HTMLButtonElement>) {
    setSelected(e.currentTarget.value);

    const choiceEvent = player1 ? 'p1_choice' : 'p2_choice';
    socket.emit(choiceEvent, { roomId, choice: e.currentTarget.value });
  }

  function onClickRematch() {
    socket.emit('request_rematch', { roomId: roomId, id: user.id });
  }

  function onClickAcceptRematch() {
    socket.emit('accept_rematch', { roomId: roomId, id: user.id });
  }

  const winnerText = computeWinnerText(player1, winner);
  console.log(roomId);
  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <h2>
        username: {user.username} Total games: {data?.games} Total wins: {data?.wins}
      </h2>
      <h3>{winner ? winnerText : ''}</h3>
      {!loading && !gameStarted && <button onClick={handleClick}>Find a Game</button>}
      {loading && <p>Finding game...</p>}

      {gameStarted && !loading && (
        <form>
          {!selected && (
            <>
              <div>
                <h3>Make a choice in {timer}</h3>
                <button onClick={sendChoice} value="rock" type="button">
                  Rock
                </button>
                <button onClick={sendChoice} value="paper" type="button">
                  Paper
                </button>
                <button onClick={sendChoice} value="scissors" type="button">
                  Scissors
                </button>
              </div>
              <div>
                <button onClick={handleCancelGame}>Cancel game</button>
              </div>
            </>
          )}
          {selected && <button disabled>{selected[0].toUpperCase() + selected.slice(1)}</button>}
        </form>
      )}

      {!gameStarted && roomId && !loading && <button onClick={onClickRematch}>Rematch</button>}
      <div>
        {rematchRequested && <button onClick={onClickAcceptRematch}>Accept rematch</button>}
      </div>
    </div>
  );
}

export default App;
