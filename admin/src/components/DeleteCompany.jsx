import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteCompany } from "../services/companyServices";

export default function DeleteCompany({ companyId, onClose = () => { }, loadTable = () => { } }) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        // Prevent double submission
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        try {
            const { success, message } = await deleteCompany(companyId);
            if (success) {
                loadTable();
                toast.success(message);
                onClose();
                return;
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold mb-8">Delete Company</p>

                <p className="mb-8 text-center text-red-500 bg-red-500/10 p-4 rounded-xl">Are you sure you want to delete this Company?</p>

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Deleting...' : 'Delete Company'}
                    </button>
                </div>
            </div>
        </div>
    );
}
