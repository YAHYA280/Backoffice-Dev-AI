import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser,     
  faGear,        
  faHouse          
} from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Accueil',
    href: '/',
    icon: <FontAwesomeIcon icon={faHouse} />,
  },
  {
    label: 'Mon profil',
    href: '#',
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    label: 'Paramètres de comptes',
    href: '#',
    icon: <FontAwesomeIcon icon={faGear} />,
  },
];
