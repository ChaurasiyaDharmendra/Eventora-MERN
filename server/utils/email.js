// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');

// dotenv.config();

// const isEmailConfigured = () => {
//     return (
//         process.env.EMAIL_USER &&
//         process.env.EMAIL_PASS &&
//         process.env.EMAIL_USER !== 'your_email@gmail.com' &&
//         process.env.EMAIL_PASS !== 'your_gmail_app_password'
//     );
// };

// const getTransporter = () => {
//     return nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });
// };

// const sendBookingEmail = async (userEmail, userName, eventTitle) => {
//     if (!isEmailConfigured()) {
//         console.log(`[DEV MODE] Email credentials not configured in .env. Skipping email to ${userEmail} for event: ${eventTitle}`);
//         return;
//     }

//     try {
//         const transporter = getTransporter();
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: userEmail,
//             subject: `Booking Confirmed: ${eventTitle}`,
//             html: `
//         <h2>Hi ${userName}!</h2>
//         <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
//         <p>Thank you for choosing Eventora.</p>
//       `
//         };
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully to', userEmail);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

// const sendOTPEmail = async (userEmail, otp, type) => {
//     if (!isEmailConfigured()) {
//         console.log(`[DEV MODE] Email credentials not configured in .env. OTP for ${userEmail} [${type}]: ${otp}`);
//         return;
//     }

//     try {
//         const transporter = getTransporter();
//         const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
//         const msg = type === 'account_verification'
//             ? 'Please use the following OTP to verify your new Eventora account.'
//             : 'Please use the following OTP to verify and confirm your event booking.';

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: userEmail,
//             subject: title,
//             html: `
//                 <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
//                     <h2 style="color: #111;">${title}</h2>
//                     <p style="color: #555; font-size: 16px;">${msg}</p>
//                     <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
//                         ${otp}
//                     </div>
//                     <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
//                 </div>
//             `
//         };
//         await transporter.sendMail(mailOptions);
//         console.log(`OTP sent to ${userEmail} for ${type}`);
//     } catch (error) {
//         console.error('Error sending OTP email:', error);
//     }
// };

// module.exports = { sendBookingEmail, sendOTPEmail };

const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================================
// BOOKING CONFIRMATION EMAIL
// =====================================================

const sendBookingEmail = async (
    userEmail,
    userName,
    eventTitle,
    ticketId
) => {

    try {

        const { data, error } = await resend.emails.send({

            from: 'Eventora <onboarding@resend.dev>',

            to: userEmail,

            subject: `Booking Confirmed: ${eventTitle}`,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    max-width: 600px;
                    margin: auto;
                ">

                    <h2>Hi ${userName}!</h2>

                    <p>
                        Your booking for the event
                        <strong>${eventTitle}</strong>
                        is successfully confirmed.
                    </p>

                    <div style="
                        margin: 25px 0;
                        padding: 20px;
                        background: #f4f4f4;
                        border-radius: 10px;
                        text-align: center;
                    ">

                        <h3>🎟️ Your Ticket ID</h3>

                        <p style="
                            font-size: 24px;
                            font-weight: bold;
                            letter-spacing: 3px;
                        ">
                            ${ticketId}
                        </p>

                        <p style="color: #555;">
                            Please show this Ticket ID at the event entrance.
                        </p>

                    </div>

                    <p>
                        <strong>Event:</strong> ${eventTitle}
                    </p>

                    <p>
                        <strong>Ticket ID:</strong> ${ticketId}
                    </p>

                    <p style="color: #555;">
                        Thank you for choosing Eventora.
                    </p>

                </div>
            `
        });

        if (error) {

            console.error(
                'Booking email error:',
                error
            );

            throw new Error(
                error.message || 'Booking email failed'
            );
        }

        console.log(
            'Booking email sent successfully:',
            data.id
        );

        return data;

    } catch (error) {

        console.error(
            'Error sending booking email:',
            error
        );

        throw error;
    }
};

// =====================================================
// OTP EMAIL
// ACCOUNT VERIFICATION
// BOOKING OTP
// FORGOT PASSWORD
// =====================================================

const sendOTPEmail = async (
    userEmail,
    otp,
    type
) => {

    try {

        let title;
        let msg;

        // =================================================
        // ACCOUNT VERIFICATION
        // =================================================

        if (type === 'account_verification') {

            title = 'Verify your Eventora Account';

            msg =
                'Please use the following OTP to verify your new Eventora account.';
        }

        // =================================================
        // PASSWORD RESET
        // =================================================

        else if (type === 'password_reset') {

            title = 'Reset your Eventora Password';

            msg =
                'Please use the following OTP to reset your Eventora account password.';
        }

        // =================================================
        // EVENT BOOKING
        // =================================================

        else if (type === 'event_booking') {

            title = 'Eventora Booking Verification';

            msg =
                'Please use the following OTP to verify and confirm your event booking.';
        }

        // =================================================
        // DEFAULT
        // =================================================

        else {

            title = 'Eventora Verification Code';

            msg =
                'Please use the following OTP to continue.';
        }

        // =================================================
        // SEND EMAIL
        // =================================================

        const { data, error } = await resend.emails.send({

            from: 'Eventora <onboarding@resend.dev>',

            to: userEmail,

            subject: title,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                    max-width: 600px;
                    margin: auto;
                ">

                    <h2>
                        ${title}
                    </h2>

                    <p style="
                        color: #555;
                        font-size: 16px;
                    ">
                        ${msg}
                    </p>

                    <div style="
                        margin: 20px auto;
                        padding: 15px;
                        font-size: 24px;
                        font-weight: bold;
                        background: #f4f4f4;
                        width: max-content;
                        letter-spacing: 5px;
                        border-radius: 8px;
                    ">
                        ${otp}
                    </div>

                    <p style="
                        color: #999;
                        font-size: 12px;
                    ">
                        This code expires in 5 minutes.
                        <br />
                        If you didn't request this,
                        please ignore this email.
                    </p>

                </div>
            `
        });

        // =================================================
        // RESEND ERROR
        // =================================================

        if (error) {

            console.error(
                'OTP email error:',
                error
            );

            throw new Error(
                error.message || 'OTP email failed'
            );
        }

        // =================================================
        // SUCCESS
        // =================================================

        console.log(
            `OTP sent successfully to ${userEmail}:`,
            data.id
        );

        return data;

    } catch (error) {

        console.error(
            'Error sending OTP email:',
            error
        );

        throw error;
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    sendBookingEmail,
    sendOTPEmail
};