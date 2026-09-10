export const GAME_ACTIONS = Object.freeze({
  like: { id: 'like', label: 'Like' },
  comment: { id: 'comment', label: 'Comentário' },
  gift_rosa: { id: 'gift_rosa', label: 'Rosa' },
  gift_capivara: { id: 'gift_capivara', label: 'Capivara' },
  gift_galaxia: { id: 'gift_galaxia', label: 'Galáxia' },
  restart: { id: 'restart', label: 'Reiniciar' }
});

export const GAME_MANIFEST = Object.freeze({
  game: 'cyber-cyclone',
  version: 1,
  actions: Object.values(GAME_ACTIONS)
});
