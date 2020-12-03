import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore: FIXME missing exports due to out-of-sync @types/react-redux version
import { useSelector } from 'react-redux';
import { useExtensions, Perspective, isPerspective } from '@console/plugin-sdk';
import { usePerspective } from '@console/shared';
import { RootState } from '@console/internal/redux';

type PerspectiveDetectorProps = {
  setActivePerspective: (string) => void;
};

const PerspectiveDetector: React.FC<PerspectiveDetectorProps> = ({ setActivePerspective }) => {
  const activePerspective = useSelector(({ UI }: RootState): string => UI.get('activePerspective'));
  // eslint-disable-next-line no-console
  console.warn('5111 activePerspective', activePerspective);

  const { perspective: lastPerspective, setPerspective, loaded } = usePerspective();

  let detectedPerspective: string;
  const perspectiveExtensions = useExtensions<Perspective>(isPerspective);
  const defaultPerspective = perspectiveExtensions.find((p) => p.properties.default);
  const detectors = perspectiveExtensions.filter((p) => p.properties.usePerspectiveDetection);
  const detectionResults = detectors.map((p) => p.properties.usePerspectiveDetection());

  const detectionComplete = detectionResults.every((result, index) => {
    const [enablePerspective, loading] = result;
    if (!detectedPerspective && !loading && enablePerspective) {
      detectedPerspective = detectors[index].properties.id;
    }
    return loading === false;
  });

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('lastPerspective', lastPerspective, loaded);
    // eslint-disable-next-line no-console
    console.log('detectedPerspective', detectedPerspective);
    // eslint-disable-next-line no-console
    console.log('detectionComplete', detectionComplete);

    if (lastPerspective && loaded) {
      // Update perspective in redux
      setPerspective(lastPerspective);
    } else if (detectedPerspective) {
      setPerspective(detectedPerspective);
    } else if (detectors.length < 1 || detectionComplete) {
      // set default perspective if there are no detectors or none of the detections were successfull
      setPerspective(defaultPerspective.properties.id);
    }
  }, [
    lastPerspective,
    setPerspective,
    loaded,
    defaultPerspective,
    detectedPerspective,
    detectionComplete,
    detectors.length,
  ]);

  return null;
};

export default PerspectiveDetector;
