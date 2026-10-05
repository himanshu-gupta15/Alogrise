import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import AdminProblemList, { ConfirmDialog } from './AdminProblemList';

const AdminDelete = () => {
  const [pending, setPending] = useState(null); // { problem, helpers }
  const [busy, setBusy] = useState(false);

  const confirmDelete = async () => {
    const { problem, helpers } = pending;
    try {
      setBusy(true);
      await axiosClient.delete(`/problem/delete/${problem._id}`);
      helpers.removeRow(problem._id);
      helpers.setNotice({ type: 'success', message: `Deleted “${problem.title}”.` });
    } catch {
      helpers.setNotice({ type: 'error', message: `Could not delete “${problem.title}”.` });
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  return (
    <>
      <AdminProblemList
        title="Delete problems"
        subtitle="Deleting removes a problem from the platform. This can't be undone."
        renderActions={(problem, helpers) => (
          <button type="button" className="btn btn-danger" onClick={() => setPending({ problem, helpers })}>
            <Trash2 size={15} /> Delete
          </button>
        )}
      />
      {pending && (
        <ConfirmDialog
          title="Delete this problem?"
          body={<>“{pending.problem.title}” will be removed for everyone. This can't be undone.</>}
          confirmLabel="Delete problem"
          danger
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  );
};

export default AdminDelete;
