import {expect, it} from '@jest/globals';
import renderer from 'react-test-renderer';
import DayPage from '..';

it('renders correctly', () => {
    const tree = renderer.create(<DayPage />).toJSON();
    expect(tree).toMatchSnapshot();
});