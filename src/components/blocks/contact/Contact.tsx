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
                    messageElement.value = '';
                    phoneElement.value = '';
                    titleElement.value = '';
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
                            <div className="form-floating mb-4">
                                <input required type="text" name="name" id="form_name" placeholder="Jane" className="form-control" />
                                <label htmlFor="form_name">First Name *</label>
                                <div className="valid-feedback"> Looks good! </div>
                                <div className="invalid-feedback"> Please enter your first name. </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-floating mb-4">
                                <input required type="text" name="surname" placeholder="Doe" id="form_lastname" className="form-control" />
                                <label htmlFor="form_lastname">Last Name *</label>
                                <div className="valid-feedback"> Looks good! </div>
                                <div className="invalid-feedback"> Please enter your last name. </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-floating mb-4">
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    id="form_email"
                                    className="form-control"
                                    placeholder="jane.doe@example.com"
                                />
                                <label htmlFor="form_email">Email *</label>
                                <div className="valid-feedback"> Looks good! </div>
                                <div className="invalid-feedback"> Please provide a valid email address. </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-floating mb-4">
                                <input required type="tel" name="Phonee" placeholder="01234567891" id="form_phone" className="form-control" />
                                <label htmlFor="form_phone">Phone *</label>
                                <div className="valid-feedback"> Looks good! </div>
                                <div className="invalid-feedback"> Please enter your phone. </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-floating mb-4">
                                <input required type="text" name="Job title" placeholder="Manager" id="form_jobtitle" className="form-control" />
                                <label htmlFor="form_jobtitle">Job Title *</label>
                                <div className="valid-feedback"> Looks good! </div>
                                <div className="invalid-feedback"> Please enter your job title. </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-floating mb-4">
                                <input required type="text" name="surname" placeholder="Doe" id="form_organisation" className="form-control" />
                                <label htmlFor="form_lastname">Organisation *</label>
                                <div className="valid-feedback"> Looks good! </div>
                                <div className="invalid-feedback"> Please enter your organsiation. </div>
                            </div>
                        </div>

                        {
                            showMessage && (
                                <div className="col-12">
                                    <div className="form-floating mb-4">
                                        <textarea
                                            required
                                            name="message"
                                            id="form_message"
                                            className="form-control"
                                            placeholder="Your message"
                                            style={{ height: 150 }}
                                        />

                                        <label htmlFor="form_message">Message *</label>
                                        <div className="valid-feedback"> Looks good! </div>
                                        <div className="invalid-feedback"> Please enter your messsage. </div>
                                    </div>
                                </div>
                            )
                        }

                        <div className="col-12 text-center">
                            <input type="submit" value={sendButtonTitle} className="btn btn-primary rounded-pill btn-send mb-3" />
                            <p className="text-muted">
                                <strong>*</strong> These fields are required.
                            </p>
                        </div>

                    </div>

                </form>

            </div>
        </div>
    )
}

interface ContactProp {
    title: string
    subtitle: string
    showMessage: boolean
    sendButtonTitle: string
    signUp: boolean
}

export default Contact