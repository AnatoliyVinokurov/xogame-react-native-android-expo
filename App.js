import React, { useState } from 'react';
import { View, Text, Image, Button, TouchableOpacity, Platform } from 'react-native';
import { ImageBackground } from 'react-native';

export default function App() {
  const [gameState, setGameState] = useState(Array(9).fill(2)); // 2 represents an empty cell
  const [activePlayer, setActivePlayer] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [gameResult, setGameResult] = useState(''); // To display game result
  const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const dropIn = (cellIndex) => {
    if (gameState[cellIndex] === 2 && gameActive) {
      const newGameState = [...gameState];
      newGameState[cellIndex] = activePlayer;
      setGameState(newGameState);

      // Check for a win
      for (const winningPosition of winningPositions) {
        const [a, b, c] = winningPosition;
        if (
          newGameState[a] === newGameState[b] &&
          newGameState[b] === newGameState[c] &&
          newGameState[b] !== 2
        ) {
          setGameActive(false);

          if (Platform.OS === 'android') {
            ToastAndroid.show(`Player ${activePlayer + 1} Wins`, ToastAndroid.SHORT);
          }

          // Set the winning line cells
          for (const i of winningPosition) {
            newGameState[i] = `win-${activePlayer}`;
          }

          setGameState(newGameState);
          setGameResult(`Player ${activePlayer + 1} Wins`);
          return;
        }
      }

      // Check for a draw
      if (newGameState.every((cell) => cell !== 2)) {
        setGameActive(false);
        if (Platform.OS === 'android') {
          ToastAndroid.show("It's a Draw", ToastAndroid.SHORT);
        }
        setGameResult("It's a Draw");
      } else {
        setActivePlayer(1 - activePlayer); // Switch player
      }
    }
  };

  const resetGame = () => {
    setGameState(Array(9).fill(2));
    setActivePlayer(0);
    setGameActive(true);
    setGameResult('');
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Your game board UI */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300 }}>
        {gameState.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: 100,
              height: 100,
              borderColor: 'black',
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => dropIn(index)}
            disabled={!gameActive || cell !== 2}
          >
            {cell === 0 && <Image source={require('./assets/tictcx.png')} style={{ width: 50, height: 50 }} />}
            {cell === 1 && <Image source={require('./assets/tictactoe_o.png')} style={{ width: 50, height: 50 }} />}
            {cell === 'win-0' && <Image source={require('./assets/tictcx_strike.png')} style={{ width: 50, height: 50 }} />}
            {cell === 'win-1' && <Image source={require('./assets/tictactoe_o_strike.png')} style={{ width: 50, height: 50 }} />}
          </TouchableOpacity>
        ))}
      </View>
      <Text>{gameActive ? `Player ${activePlayer + 1}'s turn` : gameResult || 'Game Over'}</Text>
      <Button title="Restart" onPress={resetGame} disabled={gameActive} />
    </View>
     </ImageBackground>
  );
}
