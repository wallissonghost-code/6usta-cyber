const aliases = Object.freeze({
  like: 'like', curtida: 'like',
  comment: 'comment', comentario: 'comment', comentário: 'comment',
  rose: 'gift_rosa', rosa: 'gift_rosa', gift_rosa: 'gift_rosa',
  capivara: 'gift_capivara', gift_capivara: 'gift_capivara',
  galaxy: 'gift_galaxia', galaxia: 'gift_galaxia', galáxia: 'gift_galaxia', gift_galaxia: 'gift_galaxia',
  restart: 'restart', reiniciar: 'restart'
});

export function normalizeLiveAction(input) {
  const raw = typeof input === 'string' ? input : input?.action || input?.type || input?.event || '';
  return aliases[String(raw).trim().toLowerCase()] || null;
}
