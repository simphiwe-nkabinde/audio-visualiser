import './style.css'
import draw1 from './waveformAnalyser'
import draw2 from './barGraphAnalyser'
import draw3 from './winAmpBar'

const button: HTMLButtonElement = document.querySelector('#btn')!;

button.addEventListener('click', () => {
  draw1();
  draw2();
  draw3();
});



