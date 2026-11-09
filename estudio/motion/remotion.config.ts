import {Config} from '@remotion/cli/config';
// Ambiente em nuvem: usa o Chrome headless que já vem instalado (sem baixar outro).
const navegador = process.env.REMOTION_BROWSER;
if (navegador) Config.setBrowserExecutable(navegador);
Config.setVideoImageFormat('jpeg');
Config.setConcurrency(Number(process.env.REMOTION_CONCURRENCY || 4));
