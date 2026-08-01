import nodemailer from 'nodemailer';

export const verifyEmail=(email,token)=>{

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRAN_USER,
        pass: process.env.TRAN_PASS
    }
});

const mailconfigurations = {
    from: process.env.TRAN_USER,
    to: email,
    subject: 'Browser For Final year Question',
    text: `hii jitendra Your Verification link is here http://localhost:5173/verify/${token}`
};

transporter.sendMail(mailconfigurations, (error, info) => {
    if (error) {
        throw Error(error)
    }
    else {
        console.log(info)
        console.log("Email Send Successfully")
    }
});

};

