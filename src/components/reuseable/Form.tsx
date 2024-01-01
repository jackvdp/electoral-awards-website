import React, { useState, ChangeEvent, FormEvent } from "react";
import { countries } from "data/countries";

type InputItem = {
    title: string;
    placeholder: string;
    type: 'input' | 'area' | 'country';
    name: string;
    defaultValue: string;
};

type FormProps = {
    inputItems: InputItem[];
    submitButtonTitle: string;
    onSubmit: (values: Record<string, string>) => void;
    additionalButtons?: React.ReactNode[];
};

const ReusableForm: React.FC<FormProps> = ({ inputItems, onSubmit, submitButtonTitle, additionalButtons }) => {
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [hasChanged, setHasChanged] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setHasChanged(true);
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <div className="row">
                {inputItems.map((item, key) => {
                    switch (item.type) {
                        case 'input':
                            return (
                                <div key={item.name} className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={item.name}
                                            placeholder={item.placeholder}
                                            name={item.name}
                                            onChange={handleChange}
                                            defaultValue={item.defaultValue}
                                        />
                                        <label htmlFor={item.name}>{item.title}</label>
                                    </div>
                                </div>
                            );
                        case 'area':
                            return (
                                <div key={key} className="col-md-12">
                                    <div className="form-floating mb-3">
                                        <textarea
                                            className="form-control"
                                            id={item.name}
                                            placeholder={item.placeholder}
                                            name={item.name}
                                            onChange={handleChange}
                                            style={{ height: '100%' }}
                                        />
                                        <label htmlFor={item.name}>{item.title}</label>
                                    </div>
                                </div>
                            );
                        case 'country':
                            return (
                                <div key={item.name} className="col-md-6">
                                    <div className="form-select-wrapper mb-3">
                                        <select
                                            className="form-select"
                                            name={item.name}
                                            id={item.name}
                                            onChange={handleChange}
                                            defaultValue={item.defaultValue}
                                            aria-label={item.placeholder}
                                        >
                                            <option disabled value="">{item.placeholder}</option>
                                            {getCountryNames().map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            );
                    }
                })}
            </div>
            <div className="d-flex justify-content-center gap-2">
                <button type="submit" disabled={!hasChanged} className="btn btn-primary m-4">{submitButtonTitle}</button>
                {additionalButtons}
            </div>
        </form>
    );
};

export default ReusableForm;
export type { InputItem, FormProps };

const getCountryNames = (): string[] => {
    return countries.map((country) => {
        return country.name
    })
}