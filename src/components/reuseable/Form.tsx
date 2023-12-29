import { useState } from "react";

type InputItem = {
    title: string;
    placeholder: string;
    type: 'input' | 'area';
    name: string;
};

type FormProps = {
    inputItems: InputItem[];
    submitButtonTitle: string;
    onSubmit: (values: Record<string, string>) => void;
}

const ReusableForm: React.FC<FormProps> = ({ inputItems, onSubmit, submitButtonTitle }) => {
    const [formValues, setFormValues] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit}>
            {inputItems.map((item) => (
                <div key={item.name} className="form-floating">
                    {item.type === 'input' ? (
                        <input
                            type="text"
                            className="form-control"
                            id={item.name}
                            placeholder={item.placeholder}
                            name={item.name}
                            onChange={handleChange}
                        />
                    ) : (
                        <textarea
                            className="form-control"
                            id={item.name}
                            placeholder={item.placeholder}
                            name={item.name}
                            onChange={handleChange}
                            style={{ height: 150 }}
                        />
                    )}
                    <label htmlFor={item.name}>{item.title}</label>
                </div>
            ))}
            <button type="submit" className="btn btn-primary rounded-pill">{submitButtonTitle}</button>
        </form>
    );
};

export default ReusableForm;
export type { InputItem, FormProps };