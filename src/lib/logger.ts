type LogLevel = 'info' | 'warn' | 'error';
type LogCtx = Record<string, unknown>;

const isDev = import.meta.env.DEV;

function emit(level: LogLevel, scope: string, msg: string, ctx?: LogCtx): void {
  if (isDev) {
    const tag = `[${level.toUpperCase()}][${scope}]`;
    ctx !== undefined
      ? console[level](tag, msg, ctx)
      : console[level](tag, msg);
    return;
  }
  console[level](JSON.stringify({
    level,
    scope,
    msg,
    ts: new Date().toISOString(),
    ...(ctx ?? {}),
  }));
}

export const logger = {
  // debug only fires in dev — zero overhead in production
  debug: (scope: string, msg: string, ctx?: LogCtx) => {
    if (isDev) console.debug(`[DEBUG][${scope}]`, msg, ...(ctx ? [ctx] : []));
  },
  info:  (scope: string, msg: string, ctx?: LogCtx) => emit('info', scope, msg, ctx),
  warn:  (scope: string, msg: string, ctx?: LogCtx) => emit('warn', scope, msg, ctx),
  error: (scope: string, msg: string, ctx?: LogCtx) => emit('error', scope, msg, ctx),
};
