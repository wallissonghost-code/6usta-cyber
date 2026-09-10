import { GAME_MANIFEST } from '../game/actions.js';
import { normalizeLiveAction } from './live-actions.js';

export class ProjectDanielConnector {
  constructor({ dispatch, status }) {
    this.dispatch = dispatch;
    this.status = status;
    this.session = null;
  }

  async connect(code) {
    const SDK = window.LivePlusGameSDK;
    if (!SDK?.Session) throw new Error('SDK do Projeto Daniel indisponível');
    this.status?.('connecting');
    const session = new SDK.Session({ code, manifest: GAME_MANIFEST });
    this.session = session;
    const forward = payload => {
      const action = normalizeLiveAction(payload);
      if (action) this.dispatch(action, payload);
    };
    session.on?.('action', forward);
    session.on?.('event', forward);
    session.on?.('connected', () => this.status?.('connected'));
    session.on?.('disconnected', () => this.status?.('disconnected'));
    await session.connect?.();
    return session;
  }

  disconnect() {
    this.session?.disconnect?.();
    this.session = null;
    this.status?.('disconnected');
  }
}
