import React from "react";

interface CommentModalProps {
  open: boolean;
  comment: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  open,
  comment,
  onChange,
  onCancel,
  onSave
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div className="bg-white p-6 rounded shadow-xl w-96 border border-gray-400 max-w-full">
        <h2 className="text-lg font-medium mb-4">Edit comment</h2>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded"
          value={comment}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;