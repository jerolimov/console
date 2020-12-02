import { match as RMatch } from 'react-router-dom';
import { K8sKind } from '@console/internal/module/k8s';
// FIXME upgrading redux types is causing many errors at this time
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { useSelector } from 'react-redux';
import { getBreadcrumbPath } from '@console/internal/components/utils/breadcrumbs';
import { RootState } from '@console/internal/redux';
import { getActivePerspective } from '@console/internal/reducers/ui';
import { ALL_NAMESPACES_KEY } from '../constants/common';
import { useNamespace } from './useNamespace';

type Match = RMatch<{ url: string }>;

export const useTabbedTableBreadcrumbsFor = (
  kindObj: K8sKind,
  match: Match,
  navOption: string,
  subTab: string = null,
) => {
  const { namespace } = useNamespace();
  const isAdminPerspective =
    useSelector((state: RootState) => getActivePerspective(state)) === 'admin';
  const nsURL = ALL_NAMESPACES_KEY === namespace ? 'all-namespaces' : `ns/${namespace}`;

  if (subTab == null) {
    return [];
  }

  return [
    {
      name: kindObj.labelPlural,
      path: isAdminPerspective
        ? `/${navOption}/${nsURL}/${subTab}`
        : getBreadcrumbPath(namespace, match),
    },
    { name: `${kindObj.label} Details`, path: match.url },
  ];
};
