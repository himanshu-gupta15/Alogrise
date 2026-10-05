import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Guests are sent to sign in for app pages
  const to = (path) => (isAuthenticated ? path : '/signin');

  return (
    <footer className="bg-bg px-4 pb-8 pt-6 sm:px-14">
      <div className="rule mb-6" />
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-neutral-500">
        <span>© {new Date().getFullYear()} Algorise</span>
        <span className="flex-1" />
        <Link to={to('/practice')} className="hover:text-accent">Problems</Link>
        <Link to={to('/contest')} className="hover:text-accent">Contests</Link>
        <Link to={to('/interview')} className="hover:text-accent">Interview prep</Link>
        <Link to={to('/create-problem')} className="hover:text-accent">Contribute a problem</Link>
      </div>
    </footer>
  );
};

export default Footer;
