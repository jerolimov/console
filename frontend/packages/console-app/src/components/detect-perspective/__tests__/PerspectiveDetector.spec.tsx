import * as React from 'react';
import { mount } from 'enzyme';
import { Perspective, useExtensions } from '@console/plugin-sdk';
import { usePerspective } from '@console/shared';
import PerspectiveDetector from '../PerspectiveDetector';

jest.mock('@console/plugin-sdk', () => ({
  useExtensions: jest.fn(),
}));

jest.mock('@console/shared', () => ({
  usePerspective: jest.fn(),
}));

const mockPerspectives = [
  {
    type: 'Perspective',
    properties: {
      id: 'admin',
      name: 'Admin Perspective',
      default: true,
    },
  },
  {
    type: 'Perspective',
    properties: {
      id: 'dev',
      name: 'Dev Perspective',
      usePerspectiveDetection: undefined,
    },
  },
] as Perspective[];

describe('PerspectiveDetector', () => {
  it('should set default perspective if there are no perspective detectors available', () => {
    const setPerspective = jest.fn();
    (useExtensions as jest.Mock).mockImplementation(() => mockPerspectives);
    (usePerspective as jest.Mock).mockImplementation(() => ({ setPerspective }));

    const wrapper = mount(<PerspectiveDetector />);
    expect(wrapper.isEmptyRender()).toBe(true);
    expect(setPerspective).toHaveBeenCalledWith('admin');
  });

  it('should set detected perspective if detection is successful', () => {
    const setPerspective = jest.fn();
    mockPerspectives[1].properties.usePerspectiveDetection = () => [true, false];
    (usePerspective as jest.Mock).mockImplementation(() => ({ setPerspective }));

    const wrapper = mount(<PerspectiveDetector />);
    expect(wrapper.isEmptyRender()).toBe(true);
    expect(setPerspective).toHaveBeenCalledWith('dev');
  });

  it('should set default perspective if detection fails', () => {
    const setPerspective = jest.fn();
    mockPerspectives[1].properties.usePerspectiveDetection = () => [false, false];
    (usePerspective as jest.Mock).mockImplementation(() => ({ setPerspective }));

    const wrapper = mount(<PerspectiveDetector />);
    expect(wrapper.isEmptyRender()).toBe(true);
    expect(setPerspective).toHaveBeenCalledWith('admin');
  });
});
