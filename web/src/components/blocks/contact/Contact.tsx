import { FC, FormEvent } from "react"

const Contact: FC<ContactProp> = ({ title, subtitle, showMessage, sendButtonTitle }) => {

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Sending email")
        const emailElement = document.getElementById("form_email") as HTMLInputElement;
        const nameElement = document.getElementById("form_name") as HTMLInputElement;
        const lastNameElement = document.getElementById("form_lastname") as HTMLInputElement;
        const messageElement = document.getElementById("form_message") as HTMLTextAreaElement;
        const organisationElement = document.getElementById("form_organisation") as HTMLTextAreaElement;
        const phoneElement = document.getElementById("form_phone") as HTMLTextAreaElement;
        const titleElement = document.getElementById("form_jobtitle") as HTMLTextAreaElement;

        if (
            emailElement && nameElement && lastNameElement &&
            organisationElement && phoneElement && titleElement
        ) {
            const email = emailElement.value;
            const name = nameElement.value;
            const lastName = lastNameElement.value;
            const organisation = organisationElement.value;
            const message = messageElement ? messageElement.value : 'Registration form';
            const phone = phoneElement.value;
            const title = titleElement.value;

            const combinedMessage = `
                Name: ${name}
                Last Name: ${lastName}
                Email: ${email}
                organisation: ${organisation}
                phone: ${phone}
                Job Title: ${title}
                Message: ${message}
              `;

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: combinedMessage }),
                });

                if (response.ok) {
                    alert('Message sent successfully. We will be in contact in due course.');
                    emailElement.value = '';
                    nameElement.value = '';
                    lastNameElement.value = '';
                    organisationElement.value = '';
                    phoneElement.value = '';
                    titleElement.value = '';
                    if (messageElement) {
                        messageElement.value = '';
                    }
                } else {
                    const data = await response.json();
                    alert(`Failed to send email: ${data.message}`);
                }
            } catch (error) {
                console.error('There was an error sending the email', error);
            }
        } else {
            alert('Please provide information for all fields.')
        }

    }

    return (
        <div className="row">
            <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                <h2 className="display-4 mb-3 text-center">{title}</h2>
                <p className="lead text-center mb-10">
                    {subtitle}
                </p>

                <form className="contact-form needs-validation" method="post" onSubmit={handleSubmit}>
                    <div className="messages"></div>
                    <div className="row gx-4">
                        <div className="col-md-6">
                            <TextInput id="form_name" label="First Name" placeholder="Jane" required />
                            <TextInput id="form_email" label="Email" placeholder="jane.doe@example.com" type="email" required />
                            <TextInput id="form_jobtitle" label="Job Title" placeholder="Manager" required />
                        </div>
                        <div className="col-md-6">
                            <TextInput id="form_lastname" label="Last Name" placeholder="Doe" required />
                            <TextInput id="form_phone" label="Phone" placeholder="01234567891" type="tel" required />
                            <TextInput id="form_organisation" label="Organisation" placeholder="Doe" required />
                        </div>

                        {showMessage && (
                            <div className="col-12">
                                <TextAreaInput id="form_message" label="Message" placeholder="Your message" required />
                            </div>
                        )}

                        <SubmitSection sendButtonTitle={sendButtonTitle} />
                    </div>
                </form>
            </div>
        </div>
    );

}

interface ContactProp {
    title: string
    subtitle: string
    showMessage: boolean
    sendButtonTitle: string
    signUp: boolean
}

export default Contact

// TextInput.tsx
interface TextInputProps {
    id: string;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ id, label, placeholder, type = "text", required }) => {
    return (
        <div className="form-floating mb-4">
            <input required={required} type={type} id={id} placeholder={placeholder} className="form-control" />
            <label htmlFor={id}>{label}</label>
            <div className="valid-feedback"> Looks good! </div>
            <div className="invalid-feedback"> Please enter {label.toLowerCase()}. </div>
        </div>
    );
}

// TextAreaInput.tsx
interface TextAreaInputProps {
    id: string;
    label: string;
    placeholder: string;
    required?: boolean;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, label, placeholder, required }) => {
    return (
        <div className="form-floating mb-4">
            <textarea required={required} id={id} placeholder={placeholder} className="form-control" style={{ height: 150 }} />
            <label htmlFor={id}>{label}</label>
            <div className="valid-feedback"> Looks good! </div>
            <div className="invalid-feedback"> Please enter {label.toLowerCase()}. </div>
        </div>
    );
}

// SubmitSection.tsx
interface SubmitSectionProps {
    sendButtonTitle: string;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({ sendButtonTitle }) => {
    return (
        <div className="col-12 text-center">
            <input type="submit" value={sendButtonTitle} className="btn btn-primary rounded-pill btn-send mb-3" />
            <p className="text-muted">
                <strong>*</strong> These fields are required.
            </p>
        </div>
    );
}
