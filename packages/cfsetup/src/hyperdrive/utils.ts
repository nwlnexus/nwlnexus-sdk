import { getEnvironmentVariableFactory } from '../environment-variables/factory';

export const getHyperdriveWarningFromEnv = getEnvironmentVariableFactory({
  variableName: 'NO_HYPERDRIVE_WARNING'
});
