import { getEnvironmentVariableFactory } from './factory';

// Should we sanitize debug logs? By default, we do, since debug logs could be added to GitHub issues and shouldn't include sensitive information
export const getSanitizeLogs = getEnvironmentVariableFactory({
  variableName: 'CFSETUP_LOG_SANITIZE',
  defaultValue() {
    return 'true';
  }
});
