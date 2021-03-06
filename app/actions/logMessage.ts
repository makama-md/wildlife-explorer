export const CHANGE_LOG_MESSAGE = 'CHANGE_LOG_MESSAGE';

export interface ChangeLogMessageAction {
  type: typeof CHANGE_LOG_MESSAGE;
  newLogMessage: string | null;
  meta: {
    track: (action: unknown) => unknown;
  };
}

export function changeLogMessage(newLogMessage: string | null) {
  return {
    type: CHANGE_LOG_MESSAGE,
    newLogMessage,
    meta: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      track: (_: unknown) => {
        return {
          hit: 'event',
          category: 'interface',
          action: 'new log message'
        };
      }
    }
  };
}
