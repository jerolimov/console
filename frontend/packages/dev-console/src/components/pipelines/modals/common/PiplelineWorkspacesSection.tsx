import * as React from 'react';
import { useField } from 'formik';
import { SecretModel, ConfigMapModel } from '@console/internal/models';
import { DropdownField } from '@console/shared';
import { PipelineWorkspace } from '../../../../utils/pipeline-augment';
import FormSection from '../../../import/section/FormSection';
import { VolumeTypes, pipelineWorkspaceTypeSelections } from '../../const';
import PVCDropdown from './PVCDropdown';
import MultipleResourceKeySelector from './MultipleResourceKeySelector';

const getVolumeTypeFields = (volumeType: VolumeTypes, index: number) => {
  switch (volumeType) {
    case VolumeTypes.Secret: {
      return (
        <MultipleResourceKeySelector
          resourceNameField={`workspaces.${index}.secret.secretName`}
          resourceKeysField={`workspaces.${index}.secret.items`}
          label="Secret"
          resourceModel={SecretModel}
          addString="Add item"
          required
        />
      );
    }
    case VolumeTypes.ConfigMap: {
      return (
        <MultipleResourceKeySelector
          resourceNameField={`workspaces.${index}.configMap.name`}
          resourceKeysField={`workspaces.${index}.configMap.items`}
          label="Config Map"
          resourceModel={ConfigMapModel}
          addString="Add item"
          required
        />
      );
    }
    case VolumeTypes.PVC: {
      return <PVCDropdown name={`workspaces.${index}.persistentVolumeClaim.claimName`} />;
    }
    default:
      return null;
  }
};

const PipelineWorkspacesSection: React.FC = () => {
  const [{ value: workspaces }] = useField<PipelineWorkspace[]>('workspaces');
  return (
    workspaces.length > 0 && (
      <FormSection title="Workspaces" fullWidth>
        {workspaces.map((workspace, index) => (
          <div className="form-group" key={workspace.name}>
            <DropdownField
              name={`workspaces.${index}.type`}
              label={workspace.name}
              items={pipelineWorkspaceTypeSelections}
              fullWidth
              required
            />
            {getVolumeTypeFields(workspace.type as VolumeTypes, index)}
          </div>
        ))}
      </FormSection>
    )
  );
};

export default PipelineWorkspacesSection;
