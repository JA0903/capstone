import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { industries } from "../utils/data";
import { fetchOneCompany, updateCompany } from "../services/companyServices";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import { useEffect } from "react";

export default function EditCompany({ companyId, onClose = () => { }, loadTable = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        location: '',
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // Prevent double submission
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        setErrorMessage('');
        
        try {
            const { success, message } = await updateCompany(companyId, formData);
            if (success) {
                loadTable();
                toast.success(message, { toastId: 'success-submit' });
                onClose();
                return;
            }
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error);
            setErrorMessage('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        try {
            const loadData = async () => {
                const { success, message, company } = await fetchOneCompany(companyId);
                if (success) return setFormData(company);
                setErrorMessage(message);
            }
            loadData();
        } catch (error) {
            console.error(error);
        }
    }, [companyId]);

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Edit Company</p>
                <p className="text-sm text-gray-500 mb-8">
                    Update company information
                </p>

                <div className="mb-4">
                    <Input
                        label="Company Name"
                        required={true}
                        name="companyName"
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Select
                        label="Industry"
                        required={true}
                        name="industry"
                        placeholder="Select Industry"
                        options={industries.map(industry => ({ value: industry.value, name: industry.name }))}
                        value={formData.industry}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-8">
                    <Input
                        label="Location"
                        required={true}
                        name="location"
                        placeholder="City, Province"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </div>

                {errorMessage &&
                    <div className="mb-8">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                }

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
