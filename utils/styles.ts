import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  navBar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#fff',
      marginLeft: 10,
    },
  },
  stepper: {
    marginTop: '20px',
  },
  grayBg: {
    backgroundColor: '#ddd',
  },
  navbarButton: {
    color: '#fff',
    textTransform: 'initial',
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    maxWidth: 800,
    margin: '0 auto',
  },
});
export default useStyles;
