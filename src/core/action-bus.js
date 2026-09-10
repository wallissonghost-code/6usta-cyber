export class ActionBus {
  #handlers = new Map();
  on(action, handler) {
    const handlers = this.#handlers.get(action) || new Set();
    handlers.add(handler);
    this.#handlers.set(action, handlers);
    return () => handlers.delete(handler);
  }
  emit(action, payload = {}) {
    for (const handler of this.#handlers.get(action) || []) handler(payload);
  }
}
