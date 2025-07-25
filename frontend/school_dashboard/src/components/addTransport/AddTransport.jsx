import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

export const AddTransport = () => {
    const [transportData, setTransportData] = useState({
        busNo: "",
        routeNumber: "",
        driverName: "",
        licenseNumber: "",
        phoneNumber: "",
    });

    const { backendUrl, api } = useContext(AppContext);
    const [loading, setIsLoading] = useState(false);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setTransportData({ ...transportData, [name]: value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post(`${backendUrl}/transport/add-transport`, transportData);
            if (response.status === 201) {
                toast.success(response.data?.message || "Student added successfully..");
                resetHandler();
            }
        } catch (error) {
            toast.error(error.response?.data?.data?.message || "Something went wrong! Try again in some time.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetHandler = () => {
        setTransportData({
            busNo: "",
            routeNumber: "",
            driverName: "",
            licenseNumber: "",
            phoneNumber: "",
        });
    };

    return (
        <div className="common-container">
            <div className="add-transport-container">
                <h4 className="common-container-heading">Add New Transport Vehicle</h4>
                <form onSubmit={onSubmitHandler} onReset={resetHandler}>
                    <div className="form-group">
                        <label className="form-label">Bus No.</label>
                        <input type="text" name="busNo" value={transportData.busNo} onChange={onChangeHandler} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Route No.</label>
                        <input type="text" name="routeNumber" value={transportData.routeNumber} onChange={onChangeHandler} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Driver Name</label>
                        <input type="text" name="driverName" value={transportData.driverName} onChange={onChangeHandler} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">License No.</label>
                        <input type="text" name="licenseNumber" value={transportData.licenseNumber} onChange={onChangeHandler} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact No.</label>
                        <input type="text" name="phoneNumber" value={transportData.phoneNumber} onChange={onChangeHandler} required />
                    </div>

                    <div className="form-group btn-container">
                        <button type="submit" className="btn btn-save" disabled={loading}>
                            {loading ? "Adding..." : "Add"}
                        </button>
                        <button type="reset" className="btn btn-reset">
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
