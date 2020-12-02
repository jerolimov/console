import * as React from 'react';
import { useExtensions, Perspective, isPerspective } from '@console/plugin-sdk';

type PerspectiveDetectorProps = {
  setActivePerspective: (string) => void;
};

const PerspectiveDetector: React.FC<PerspectiveDetectorProps> = ({ setActivePerspective }) => {
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
    if (detectedPerspective) {
      // eslint-disable-next-line no-console
      console.warn('5111 setActivePerspective 1', detectedPerspective);
      setActivePerspective(detectedPerspective);
    } else if (detectors.length < 1 || detectionComplete) {
      // eslint-disable-next-line no-console
      console.warn('5111 setActivePerspective 2', defaultPerspective.properties.id);
      setActivePerspective(defaultPerspective.properties.id); // set default perspective if there are no detectors or none of the detections were successfull
    }
  }, [
    defaultPerspective,
    detectedPerspective,
    detectionComplete,
    detectors.length,
    setActivePerspective,
  ]);

  return null;
};

export default PerspectiveDetector;
