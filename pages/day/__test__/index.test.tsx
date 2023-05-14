import renderer from 'react-test-renderer';
import DayPage from '../index.page';

describe('Day page', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<DayPage />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});