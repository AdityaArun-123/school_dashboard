import React from 'react';
import './deleteConfirmModal.css';

export const DeleteConfirmModal = ({onclose, deleteConfirm}) => {

    const closeDeleteModal = () => {
        onclose();
    }

    return (
        <>
            <div className="delete-confirm-modal-bg-container" onClick={closeDeleteModal}></div>
            <div class="delete-condirm-modal">
                <div class="modal-header">
                    <span>Confirm Deletion</span>
                    <img src="Gallery/close_icon.png" alt="" class="close" onClick={closeDeleteModal} />
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this record? This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-delete" onClick={()=>{closeDeleteModal(); deleteConfirm();}}>Delete</button>
                    <button class="btn btn-cancel" onClick={closeDeleteModal}>Cancel</button>
                </div>
            </div>
        </>
    )
}
