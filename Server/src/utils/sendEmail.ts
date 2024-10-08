import nodemailer from "nodemailer"

const sendEmail = async (email: string , token: string): Promise<void> => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: 'Email Verification',
			text: `Please verify your email by clicking the following link: http://47.128.233.168:3001/user/verify?token=${token}}`,
		});
		console.log("Email sent successfully");
	} catch (error) {
		console.log("Email not sent!");
		console.log(error);
		throw error; // Rethrow the error to ensure the caller knows that the email was not sent
	}
};

const sendEmailPayment = async (bookingData: any , imageUrl: string): Promise<void> => {
	try {
		const businessData = {
			email: (bookingData.homestay?.business_user?.[0]?.email) || (bookingData.package?.business_user?.email),
			name: (bookingData.homestay?.business_user?.[0]?.name) || (bookingData.package?.business_user?.name),
			lastName: (bookingData.homestay?.business_user?.[0]?.lastName) || (bookingData.package?.business_user?.lastName),
		  };
		
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: businessData.email,
			subject: 'Payment Successfully Transferred',
			text: `Dear ${businessData.name} ${businessData.lastName},
		  
		  We are pleased to inform you that the payment has been successfully transferred to your account. 
		  
		  Please find the payment slip attached as proof of the transaction.
		  
		  Thank you for your cooperation.
		  
		  Best regards,
		  ${process.env.USER}`,
			attachments: [
			  {
				filename: 'payment-slip.png',
				path: imageUrl
			  }
			]
		  });
		  
		console.log("Email sent successfully");
	} catch (error) {
		console.log("Email not sent!");
		console.log(error);
		throw error; // Rethrow the error to ensure the caller knows that the email was not sent
	}
};


export { sendEmail , sendEmailPayment}
