export enum StartedByLabel {
  user = 'pipeline.openshift.io/started-by',
  triggers = 'triggers.tekton.dev/eventlistener',
}

export enum PipelineResourceType {
  git = 'git',
  image = 'image',
  cluster = 'cluster',
  storage = 'storage',
}

export const pipelineResourceTypeSelections = {
  '': 'Select resource type',
  [PipelineResourceType.git]: 'Git',
  [PipelineResourceType.image]: 'Image',
  [PipelineResourceType.cluster]: 'Cluster',
  [PipelineResourceType.storage]: 'Storage',
};

export enum VolumeTypes {
  EmptyDirectory = 'emptyDir',
  ConfigMap = 'configMap',
  Secret = 'secret',
  PVC = 'persistentVolumeClaim',
}

export const pipelineWorkspaceTypeSelections = {
  [VolumeTypes.EmptyDirectory]: 'Empty Directory',
  [VolumeTypes.ConfigMap]: 'Config Map',
  [VolumeTypes.Secret]: 'Secret',
  [VolumeTypes.PVC]: 'PVC',
};

export enum SecretAnnotationId {
  Git = 'git',
  Image = 'docker',
}

export const SecretAnnotationType = {
  [SecretAnnotationId.Git]: 'Git Server',
  [SecretAnnotationId.Image]: 'Docker Registry',
};

export const PIPELINE_SERVICE_ACCOUNT = 'pipeline';
