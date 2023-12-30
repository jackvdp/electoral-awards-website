import React, { useState, ChangeEvent, FormEvent } from "react";

type InputItem = {
    title: string;
    placeholder: string;
    type: 'input' | 'area';
    name: string;
    defaultValue: string;
};

type FormProps = {
    inputItems: InputItem[];
    submitButtonTitle: string;
    onSubmit: (values: Record<string, string>) => void;
};

const ReusableForm: React.FC<FormProps> = ({ inputItems, onSubmit, submitButtonTitle }) => {
    const [formValues, setFormValues] = useState<Record<string, string>>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <div className="row">
                {inputItems.map((item) => (
                    item.type === 'input' ? (
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
                    ) : (
                        <div key={item.name} className="col-md-12">
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
                    )
                ))}
            </div>
            <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">{submitButtonTitle}</button>
            </div>
        </form>
    );
};

export default ReusableForm;
export type { InputItem, FormProps };