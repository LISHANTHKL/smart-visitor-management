import smtplib

from email.message import EmailMessage


def send_email(
    to_email,
    subject,
    body,
    qr_path=None
):

    EMAIL_ADDRESS = "companyguestpass@gmail.com"

    EMAIL_PASSWORD = "nduf qqzh pgad rwwk"

    msg = EmailMessage()

    msg["Subject"] = subject

    msg["From"] = EMAIL_ADDRESS

    msg["To"] = to_email

    msg.set_content(body)

    # ATTACH QR IMAGE
    if qr_path:

        with open(qr_path, "rb") as f:

            file_data = f.read()

            file_name = qr_path.split("/")[-1]

        msg.add_attachment(
            file_data,
            maintype="image",
            subtype="png",
            filename=file_name
        )

    with smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465
    ) as smtp:

        smtp.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        smtp.send_message(msg)