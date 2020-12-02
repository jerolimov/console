import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@patternfly/react-core';
import { useNamespace } from '@console/shared';
import { createProjectModal } from '@console/internal/components/modals';
import { K8sResourceKind } from '@console/internal/module/k8s';
import ProjectListPage, { ProjectListPageProps } from './ProjectListPage';

export interface CreateProjectListPageProps extends ProjectListPageProps {
  title: string;
  onCreate?: (project: K8sResourceKind) => void;
}

const CreateProjectListPage: React.FC<CreateProjectListPageProps> = ({
  onCreate,
  title,
  children,
  ...props
}) => {
  const { t } = useTranslation();
  const { setNamespace } = useNamespace();

  const handleSubmit = (project: K8sResourceKind) => {
    setNamespace(project.metadata?.name);
    onCreate && onCreate(project);
  };

  const openProjectModal = () => createProjectModal({ blocking: true, onSubmit: handleSubmit });

  return (
    <ProjectListPage {...props} title={title}>
      {children} {t('devconsole~or')}{' '}
      <Button isInline variant="link" onClick={openProjectModal}>
        {t('devconsole~create a project')}
      </Button>
    </ProjectListPage>
  );
};

export default CreateProjectListPage;
