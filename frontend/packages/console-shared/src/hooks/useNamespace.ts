import * as React from 'react';
// FIXME upgrading redux types is causing many errors at this time
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { useDispatch } from 'react-redux';
import { setActiveNamespace } from '@console/internal/actions/ui';

import { useUserSettingsCompatibility } from './useUserSettingsCompatibility';

const LAST_NAMESPACE_NAME_USERSETTINGS_KEY = 'console.lastUsed.namespace';
const LAST_NAMESPACE_NAME_LOCAL_STORAGE_KEY = 'bridge/last-namespace-name';

export function useNamespace() {
  const [lastNamespace, setLastNamespace, loaded] = useUserSettingsCompatibility<string>(
    LAST_NAMESPACE_NAME_USERSETTINGS_KEY,
    LAST_NAMESPACE_NAME_LOCAL_STORAGE_KEY,
  );
  const dispatch = useDispatch();

  const setNamespace = React.useCallback(
    (name) => {
      dispatch(setActiveNamespace(name));
      setLastNamespace(name);
    },
    [dispatch, setLastNamespace],
  );

  return {
    namespace: lastNamespace,
    setNamespace,
    loaded,
  };
}
