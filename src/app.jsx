import { h } from 'preact';
import Router from 'preact-router';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { Home } from './routes/home';
import { Arcade } from './routes/arcade';
import { GameMemory } from './routes/game-memory';
import { GameTrivia } from './routes/game-trivia';
import { GameWordSearch } from './routes/game-word-search';
import { GameCrossword } from './routes/game-crossword';
import { NotFound } from './routes/not-found';

export function App() {
  return (
    <>
      <Header />
      <Router>
        <Home path="/" />
        <Arcade path="/arcade" />
        <GameMemory path="/arcade/memoria" />
        <GameTrivia path="/arcade/trivia" />
        <GameWordSearch path="/arcade/sopa-de-letras" />
        <GameCrossword path="/arcade/crucigrama" />
        <NotFound default />
      </Router>
      <Footer />
    </>
  );
}
