import * as _ from 'lodash';
import { getRandomChars } from '@console/shared';
import {
  Pipeline,
  PipelineResource,
  PipelineRun,
  PipelineRunInlineResource,
  PipelineRunInlineResourceParam,
  PipelineRunReferenceResource,
  PipelineRunResource,
} from '../../../../utils/pipeline-augment';
import { PipelineRunModel } from '../../../../models';
import { getPipelineRunParams, getPipelineRunWorkspaces } from '../../../../utils/pipeline-utils';
import { CREATE_PIPELINE_RESOURCE, initialResourceFormValues } from './const';
import { CommonPipelineModalFormikValues, PipelineModalFormResource } from './types';

/**
 * Migrates a PipelineRun from one version to another to support auto-upgrades with old (and invalid) PipelineRuns.
 *
 * Note: Each check within this method should be driven by the apiVersion number if the API is properly up-versioned
 * for these breaking changes. (should be done moving from 0.10.x forward)
 */
export const migratePipelineRun = (pipelineRun: PipelineRun): PipelineRun => {
  let newPipelineRun = pipelineRun;

  const serviceAccountPath = 'spec.serviceAccount';
  if (_.has(newPipelineRun, serviceAccountPath)) {
    // .spec.serviceAccount was removed for .spec.serviceAccountName in 0.9.x
    // Note: apiVersion was not updated for this change and thus we cannot gate this change behind a version number
    const serviceAccountName = _.get(newPipelineRun, serviceAccountPath);
    newPipelineRun = _.omit(newPipelineRun, [serviceAccountPath]);
    newPipelineRun = _.merge(newPipelineRun, {
      spec: {
        serviceAccountName,
      },
    });
  }

  return newPipelineRun;
};

export const convertPipelineToModalData = (
  pipeline: Pipeline,
  alwaysCreateResources: boolean = false,
): CommonPipelineModalFormikValues => {
  const {
    spec: { params, resources },
  } = pipeline;

  return {
    parameters: params || [],
    resources: (resources || []).map((resource: PipelineResource) => ({
      name: resource.name,
      selection: alwaysCreateResources ? CREATE_PIPELINE_RESOURCE : null,
      data: {
        ...initialResourceFormValues[resource.type],
        type: resource.type,
      },
    })),
  };
};

export const convertMapToNameValueArray = (map: {
  [key: string]: any;
}): PipelineRunInlineResourceParam[] => {
  return Object.keys(map).map((name) => {
    const value = map[name];
    return { name, value };
  });
};

const convertResources = (resource: PipelineModalFormResource): PipelineRunResource => {
  if (resource.selection === CREATE_PIPELINE_RESOURCE) {
    return {
      name: resource.name,
      resourceSpec: {
        params: convertMapToNameValueArray(resource.data.params),
        type: resource.data.type,
      },
    } as PipelineRunInlineResource;
  }

  return {
    name: resource.name,
    resourceRef: {
      name: resource.selection,
    },
  } as PipelineRunReferenceResource;
};

const getPipelineRunLabels = (pipelineName: string, labels: { [key: string]: string }) => {
  return {
    ...labels,
    'tekton.dev/pipeline': pipelineName,
  };
};

const getPipelineRunMetadata = (
  namespace: string,
  pipelineName: string,
  labels: { [key: string]: string },
  options?: { generateName: boolean },
): any => {
  return {
    namespace,
    ...(options?.generateName
      ? {
          generateName: `${pipelineName}-`,
        }
      : {
          name: `${pipelineName}-${getRandomChars()}`,
        }),
    labels: getPipelineRunLabels(pipelineName, labels),
  };
};

export const getPipelineRunFromPipeline = (pipeline: Pipeline): PipelineRun => {
  const { namespace, name: pipelineName, labels } = pipeline.metadata;

  const newPipelineRun = {
    apiVersion: pipeline.apiVersion,
    kind: PipelineRunModel.kind,
    metadata: getPipelineRunMetadata(namespace, pipelineName, labels),
    spec: {
      pipelineRef: {
        name: pipelineName,
      },
      params: getPipelineRunParams(pipeline.spec.params),
    },
  };
  return newPipelineRun;
};

export const getPipelineRunFromPipelineRun = (latestRun: PipelineRun): PipelineRun => {
  const { namespace, labels } = latestRun.metadata;
  const { name: pipelineName } = latestRun.spec.pipelineRef;

  const newPipelineRun = {
    apiVersion: latestRun.apiVersion,
    kind: latestRun.kind,
    metadata: getPipelineRunMetadata(namespace, pipelineName, labels),
    spec: {
      ...latestRun.spec,
      status: null,
    },
  };
  return migratePipelineRun(newPipelineRun);
};

export const getPipelineRunFromForm = (
  pipeline: Pipeline,
  formValues: CommonPipelineModalFormikValues,
  labels: { [key: string]: string },
  options?: { generateName: boolean },
): PipelineRun => {
  const { namespace, name: pipelineName } = pipeline.metadata;
  const { parameters, resources, workspaces } = formValues;

  const newPipelineRun: PipelineRun = {
    apiVersion: pipeline.apiVersion,
    kind: PipelineRunModel.kind,
    metadata: getPipelineRunMetadata(namespace, pipelineName, labels, options),
    spec: {
      pipelineRef: {
        name: pipelineName,
      },
      params: getPipelineRunParams(parameters),
      resources: resources.map(convertResources),
      workspaces: getPipelineRunWorkspaces(workspaces),
    },
  };
  return newPipelineRun;
};
