import { coFetch } from '@console/internal/co-fetch';
import { ConfigMapModel } from '@console/internal/models';
import { ConfigMapKind, resourceURL } from '@console/internal/module/k8s';

export const USER_SETTING_CONFIGMAP_NAMESPACE = 'openshift-console-user-settings';

export const createConfigMap = async (): Promise<ConfigMapKind> => {
  try {
    const response = await coFetch('/api/console/user-settings', { method: 'POST' });
    return response.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

export const updateConfigMap = async (
  configMap: ConfigMapKind,
  key: string,
  value: string,
): Promise<ConfigMapKind> => {
  const url = resourceURL(ConfigMapModel, {
    ns: configMap.metadata.namespace,
    name: configMap.metadata.name,
  });
  const patch =
    value === undefined
      ? [{ op: 'remove', path: `/data/${key}` }]
      : {
          data: {
            [key]: value,
          },
        };
  // Use JSON Merge Patch instead of normal JSON Patch because JSON Patch calls
  // fail if there is no data defined.
  try {
    const response = await coFetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type':
          value === undefined
            ? 'application/json-patch+json;charset=UTF-8'
            : 'application/merge-patch+json;charset=UTF-8',
      },
      body: JSON.stringify(patch),
    });
    return response.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

export const deseralizeData = (data: string | null) => {
  if (typeof data !== 'string') {
    return data;
  }
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const seralizeData = <T>(data: T) => {
  if (typeof data === 'string') {
    return data;
  }
  if (data === null) {
    return null;
  }
  if (data === undefined) {
    return undefined;
  }
  return JSON.stringify(data);
};
