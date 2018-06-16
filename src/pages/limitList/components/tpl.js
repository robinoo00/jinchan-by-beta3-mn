import CSSModules from 'react-css-modules'
import styles from '../styles/tpl.css'
import Header from '../../../components/header/header'
import List from './list'

const Example = () => {
    return (
        <div>
            <Header
                title={'挂单明细'}
            />
            <List/>
        </div>
    );
};

export default CSSModules(Example, styles)

