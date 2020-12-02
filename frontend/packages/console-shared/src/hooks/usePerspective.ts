import * as React from 'react';
// FIXME upgrading redux types is causing many errors at this time
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { useDispatch } from 'react-redux';
import { setActivePerspective } from '@console/internal/actions/ui';

import { useUserSettingsCompatibility } from './useUserSettingsCompatibility';

const LAST_PERSPECTIVE_USERSETTINGS_KEY = `console.lastUsed.perspective`;
const LAST_PERSPECTIVE_LOCAL_STORAGE_KEY = `bridge/last-perspective`;

export function usePerspective() {
  const [lastPerspective, setLastPerspective, loaded] = useUserSettingsCompatibility<string>(
    LAST_PERSPECTIVE_USERSETTINGS_KEY,
    LAST_PERSPECTIVE_LOCAL_STORAGE_KEY,
  );
  const dispatch = useDispatch();

  const setPerspective = React.useCallback(
    (name) => {
      dispatch(setActivePerspective(name));
      setLastPerspective(name);
    },
    [dispatch, setLastPerspective],
  );

  return {
    perspective: lastPerspective,
    setPerspective,
    loaded,
  };
}
