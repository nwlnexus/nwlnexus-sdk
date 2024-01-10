import { getEnvironmentVariableFactory } from '../environment-variables/factory';

export const getConstellationWarningFromEnv = getEnvironmentVariableFactory({
  variableName: 'NO_CONSTELLATION_WARNING'
});
