import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import AdminProblemList from './AdminProblemList';

const AdminUpdateList = () => (
  <AdminProblemList
    title="Update problems"
    subtitle="Edit statements, test cases, starter code and tags."
    renderActions={(problem) => (
      <Link to={`/admin/update/${problem._id}`} className="btn btn-secondary">
        <Pencil size={15} /> Edit
      </Link>
    )}
  />
);

export default AdminUpdateList;
