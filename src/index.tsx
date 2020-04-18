import { h, render } from 'preact';

import App from './components/App';

const uiRoot = document.createElement('div');
uiRoot.id = 'app';
document.body.appendChild(uiRoot);

render(<App />, uiRoot);
