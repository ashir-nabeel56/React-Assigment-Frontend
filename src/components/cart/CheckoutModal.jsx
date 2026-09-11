import { useState } from "react";
import "./CheckModal.css";


function CheckoutModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Naam zaroori hai";
        if (!formData.email.trim()) newErrors.email = "Email zaroori hai";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Sahi email likhein";
        if (!formData.phone.trim()) newErrors.phone = "Phone number zaroori hai";
        if (!formData.address.trim()) newErrors.address = "Address zaroori hai";
        if (!formData.city.trim()) newErrors.city = "City zaroori hai";
        if (!formData.postalCode.trim())
            newErrors.postalCode = "Postal code zaroori hai";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(formData);
    };

    return (
        <div className="checkout-modal-overlay" onClick={onClose}>
            <div
                className="checkout-modal-box"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="checkout-modal-header">
                    <h2>Shipping Details</h2>
                    <button
                        type="button"
                        className="checkout-modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form className="checkout-modal-form" onSubmit={handleSubmit}>
                    <div className="checkout-field">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Your full name"
                        />
                        {errors.fullName && (
                            <span className="checkout-error">{errors.fullName}</span>
                        )}
                    </div>

                    <div className="checkout-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <span className="checkout-error">{errors.email}</span>
                        )}
                    </div>

                    <div className="checkout-field">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="03xx-xxxxxxx"
                        />
                        {errors.phone && (
                            <span className="checkout-error">{errors.phone}</span>
                        )}
                    </div>

                    <div className="checkout-field">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="House #, Street, Area"
                        />
                        {errors.address && (
                            <span className="checkout-error">{errors.address}</span>
                        )}
                    </div>

                    <div className="checkout-field-row">
                        <div className="checkout-field">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                            />
                            {errors.city && (
                                <span className="checkout-error">{errors.city}</span>
                            )}
                        </div>

                        <div className="checkout-field">
                            <label>Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="00000"
                            />
                            {errors.postalCode && (
                                <span className="checkout-error">{errors.postalCode}</span>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="checkout-modal-submit">
                        Confirm & Place Order
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CheckoutModal;