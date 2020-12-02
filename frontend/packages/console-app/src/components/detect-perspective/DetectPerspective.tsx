import * as React from 'react';
import { connect } from 'react-redux';
import { getActivePerspective } from '@console/internal/reducers/ui';
import { RootState } from '@console/internal/redux';

import PerspectiveDetector from './PerspectiveDetector';

type OwnProps = {
  children: React.ReactNode;
};

type StateProps = {
  activePerspective: string;
};

type DispatchProps = {
  setActivePerspective: (string) => void;
};

type DetectPerspectiveProps = OwnProps & StateProps & DispatchProps;

const DetectPerspective: React.FC<DetectPerspectiveProps> = ({ activePerspective, children }) =>
  activePerspective ? <>{children}</> : <PerspectiveDetector />;

const mapStateToProps = (state: RootState) => ({
  activePerspective: getActivePerspective(state),
});

// For testing
export const InternalDetectPerspective = DetectPerspective;

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps)(DetectPerspective);
