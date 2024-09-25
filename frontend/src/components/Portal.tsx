import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    id: string;
    children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ id, children }) => {
    const portalRoot = document.getElementById(id);

    if (!portalRoot) return null;

    return ReactDOM.createPortal(children, portalRoot);
};

export default Portal;
