import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const UpdateTransport = () => {
    const [updateTransportData, setUpdateTransportData] = useState({
        busNo: "",
        routeNumber: "",
        driverName: "",
        licenseNumber: "",
        phoneNumber: "",
    });
    const [transportOriginalData, setTransportOriginalData] = useState({});
    const { backendUrl, api } = useContext(AppContext);
    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getTransport();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdateTransportData({ ...updateTransportData, [name]: value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const isFormChanged = hasTransportDataChanged();
        if (!isFormChanged) {
            toast.info('No changes made.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post(`${backendUrl}/transport/update-transport?id=${id}`, updateTransportData, {
                withCredentials: true
            });

            if (response.status === 201) {
                toast.success(response.data?.message || "Transport details updated successfully.");
                navigate("/view-all-transport", { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateReset = () => {
        setUpdateTransportData({
            busNo: "",
            routeNumber: "",
            driverName: "",
            licenseNumber: "",
            phoneNumber: "",
        });
    };

    const hasTransportDataChanged = () => {
        for (let key in updateTransportData) {
            if (updateTransportData[key] !== transportOriginalData[key]) {
                return true;
            }
        }
        return false;
    };

    const getTransport = async () => {
        try {
            const response = await api.get(`${backendUrl}/transport/fetch-transport?id=${id}`);
            if (response.status === 200) {
                toast.success(response.data?.message || "Successfully fetched transport details.");
                setTransportOriginalData(response.data.data);
                setUpdateTransportData(response.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again later.");
        }
    };

    return (
        <div className="common-container add-books-container">
            <h4 className='common-container-heading'>Update Transport Vehicle</h4>
            <form onSubmit={handleUpdateSubmit} onReset={handleUpdateReset}>
                <div className="form-group">
                    <label className="form-label">Bus No.</label>
                    <input type="text" name="busNo" value={updateTransportData.busNo} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Route No.</label>
                    <input type="text" name="routeNumber" value={updateTransportData.routeNumber} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Driver Name</label>
                    <input type="text" name="driverName" value={updateTransportData.driverName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">License No.</label>
                    <input type="text" name="licenseNumber" value={updateTransportData.licenseNumber} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Contact No.</label>
                    <input type="text" name="phoneNumber" value={updateTransportData.phoneNumber} onChange={handleInputChange} required />
                </div>
                <div className="form-group btn-container">
                    <button type="submit" className="btn btn-save" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                    <button type="reset" className="btn btn-reset">
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};
