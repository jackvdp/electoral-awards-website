// components/reuseable/Form.tsx
import React, {useState, ChangeEvent, FormEvent} from "react";
import {countries} from "data/countries";

export type InputItem = {
    title: string;
    placeholder: string;
    type: 'input' | 'area' | 'country' | 'password' | 'email' | 'phone' | 'select';
    name: string;
    defaultValue: string;
    required?: boolean;
    options?: { label: string; value: string }[];
};

export type FormProps = {
    inputItems: InputItem[];
    submitButtonTitle: string;
    onSubmit: (values: Record<string, string>) => void;
    additionalButtons?: React.ReactNode[];
    disableSubmitInitially: boolean;
};

const ReusableForm: React.FC<FormProps> = ({
                                               inputItems,
                                               onSubmit,
                                               submitButtonTitle,
                                               additionalButtons,
                                               disableSubmitInitially,
                                           }) => {
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [hasChanged, setHasChanged] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setHasChanged(true);
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let isValid = true;
        const newErrors: Record<string, string | null> = {};

        inputItems.forEach((item) => {
            const value = formValues[item.name] || item.defaultValue;

            switch (item.type) {
                case "password":
                    if (item.required && !validatePassword(value)) {
                        newErrors[item.name] =
                            "Password must be at least 8 characters long and contain only letters and numbers";
                        isValid = false;
                    }
                    break;
                case "email":
                    if (item.required && !validateEmail(value)) {
                        newErrors[item.name] = "Invalid email";
                        isValid = false;
                    }
                    break;
                case "phone":
                    if (item.required && !validatePhone(value)) {
                        newErrors[item.name] =
                            "Invalid phone number (please include country code e.g. +44...)";
                        isValid = false;
                    }
                    break;
                case "country":
                    if (item.required && !validateCountry(value)) {
                        newErrors[item.name] = "Please select a country";
                        isValid = false;
                    }
                    break;
                default:
                    break;
            }
        });

        if (isValid) {
            onSubmit(formValues);
        } else {
            alert("Please fix the following errors: \n" + Object.values(newErrors).join("\n"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container contact-form needs-validation" method="post">
            <div className="row">
                {inputItems.map((item, key) => {
                    switch (item.type) {
                        case "input":
                        case "password":
                        case "email":
                        case "phone":
                            return (
                                <div key={item.name} className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type={item.type === "password" ? "password" : "text"}
                                            className="form-control"
                                            id={item.name}
                                            required={item.required}
                                            placeholder={item.placeholder}
                                            name={item.name}
                                            onChange={handleChange}
                                            defaultValue={item.defaultValue}
                                        />
                                        <label htmlFor={item.name}>{item.title}</label>
                                        <div className="valid-feedback">Looks good!</div>
                                        <div className="invalid-feedback">Please enter {item.title.toLowerCase()}.</div>
                                    </div>
                                </div>
                            );
                        case "area":
                            return (
                                <div key={key} className="col-md-12">
                                    <div className="form-floating mb-3">
                    <textarea
                        className="form-control"
                        id={item.name}
                        required={item.required}
                        placeholder={item.placeholder}
                        name={item.name}
                        onChange={handleChange}
                        defaultValue={item.defaultValue}
                        style={{height: "100%"}}
                    />
                                        <label htmlFor={item.name}>{item.title}</label>
                                        <div className="valid-feedback">Looks good!</div>
                                        <div className="invalid-feedback">Please enter {item.title.toLowerCase()}.</div>
                                    </div>
                                </div>
                            );
                        case "country":
                            return (
                                <div key={item.name} className="col-md-6">
                                    <div className="form-select-wrapper mb-3">
                                        <select
                                            className="form-select"
                                            name={item.name}
                                            id={item.name}
                                            onChange={handleChange}
                                            defaultValue={item.defaultValue || ""}
                                            aria-label={item.placeholder}
                                        >
                                            <option value="">{item.placeholder}</option>
                                            {getCountryNames().map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            );
                        case "select":
                            return (
                                <div key={item.name} className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            name={item.name}
                                            id={item.name}
                                            onChange={handleChange}
                                            defaultValue={item.defaultValue}
                                            required={item.required}
                                        >
                                            <option value="" disabled>
                                                {item.placeholder}
                                            </option>
                                            {item.options?.map((option, index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor={item.name}>{item.title}</label>
                                        <div className="valid-feedback">Looks good!</div>
                                        <div className="invalid-feedback">Please select {item.title.toLowerCase()}.
                                        </div>
                                    </div>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div>
            <div className="d-flex justify-content-center gap-2">
                <button
                    type="submit"
                    disabled={!hasChanged && disableSubmitInitially}
                    className="btn btn-primary m-4"
                >
                    {submitButtonTitle}
                </button>
                {additionalButtons}
            </div>
        </form>
    );
};

export default ReusableForm;

const getCountryNames = (): string[] => {
    return countries.map((country) => country.name);
};

const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /^[a-z0-9]+$/i.test(password);
};

const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
    return phone.startsWith("+") && phone.length > 7 && /^\+[0-9]+$/.test(phone);
};

const validateCountry = (country: string): boolean => {
    return country.length > 0;
};