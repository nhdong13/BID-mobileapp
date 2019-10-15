import React from 'react';
import renderer from 'react-test-renderer';

import { MuliText } from '../StyledText';

it(`renders correctly`, () => {
  const tree = renderer.create(<MuliText>Snapshot test!</MuliText>).toJSON();

  expect(tree).toMatchSnapshot();
});
