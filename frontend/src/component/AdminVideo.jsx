import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Upload } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import AdminProblemList, { ConfirmDialog } from './AdminProblemList';

const AdminVideo = () => {
  const [pending, setPending] = useState(null); // { problem, helpers }
  const [busy, setBusy] = useState(false);

  const confirmDelete = async () => {
    const { problem, helpers } = pending;
    try {
      setBusy(true);
      await axiosClient.delete(`/video/delete/${problem._id}`);
      // The problem itself stays; only its video is gone
      helpers.setNotice({ type: 'success', message: `Removed the video for “${problem.title}”.` });
    } catch (err) {
      const msg = err?.response?.status === 404 ? 'has no video to remove' : 'could not be updated';
      helpers.setNotice({ type: 'error', message: `“${problem.title}” ${msg}.` });
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  return (
    <>
      <AdminProblemList
        title="Video solutions"
        subtitle="Upload a walkthrough for any problem. It appears in the problem's Editorial tab."
        renderActions={(problem, helpers) => (
          <>
            <Link to={`/admin/upload/${problem._id}`} className="btn btn-primary">
              <Upload size={15} /> Upload
            </Link>
            <button type="button" className="btn btn-secondary" onClick={() => setPending({ problem, helpers })} aria-label="Remove video">
              <Trash2 size={15} />
            </button>
          </>
        )}
      />
      {pending && (
        <ConfirmDialog
          title="Remove this video?"
          body={<>The walkthrough for “{pending.problem.title}” will be deleted from storage. The problem stays.</>}
          confirmLabel="Remove video"
          danger
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  );
};

export default AdminVideo;
