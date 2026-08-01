import nodemailer from "nodemailer";

export const sendOtp = async (email, otp) => {

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.TRAN_USER,
            pass: process.env.TRAN_PASS
        }
    });

    const mailconfigurations = {
        from: process.env.TRAN_USER,
        to: email,
        subject: "Forget Password otp form the nodemailer",
        html: `Your Otp is ${otp}`
    }

    transport.sendMail(mailconfigurations, (err, info) => {
        if (err) { throw Error(err) };
        console.log(info);
    })

}

