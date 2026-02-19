import { render } from 'preact';
import { App } from './app';
import './styles/main.css';

// Renderizar la aplicación en el elemento con id 'app'
render(<App />, document.getElementById('app'));