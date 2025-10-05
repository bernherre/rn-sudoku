
import React from 'react';
import { render } from '@testing-library/react-native';
import Grid from './Grid';
import { useGame } from '@/state/store';

jest.mock('@/state/store');

describe('Grid', () => {
  test('renders cells', () => {
    (useGame as any).mockReturnValue({
      current: [[1,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],
      puzzle: [[1,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],
      select: jest.fn(),
      selected: null,
      size: 4
    });
    const { getByText } = render(<Grid />);
    expect(getByText('1')).toBeTruthy();
  });
});
