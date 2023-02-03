import PropTypes from 'prop-types';
import { Member } from './MemberShape';

const Form = PropTypes.shape({
  id: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  admin: PropTypes.bool,
  active: PropTypes.bool,
  member: PropTypes.shape(Member.Form),
});
