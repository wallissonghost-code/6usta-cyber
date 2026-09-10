import { lockViewport } from './ui/viewport.js';
import { ProjectDanielConnector } from './integrations/project-daniel.js';
import { GAME_MANIFEST } from './game/actions.js';

lockViewport();

const legacy = window.CyberGame || {};
const dispatch = (action, payload = {}) => {
  if (typeof legacy.dispatch === 'function') return legacy.dispatch(action, payload);
  window.dispatchEvent(new CustomEvent('cyber:action', { detail: { action, payload } }));
};

const connector = new ProjectDanielConnector({
  dispatch,
  status: state => window.dispatchEvent(new CustomEvent('cyber:connector-status', { detail: state }))
});

window.CyberApp = Object.freeze({
  manifest: GAME_MANIFEST,
  dispatch,
  connect: code => connector.connect(code),
  disconnect: () => connector.disconnect()
});
