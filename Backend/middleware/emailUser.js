const sendEmail = require('./email.js');
const  crypto = require('crypto');

const emailUserRegistrationConfirmationMessage = async (userEmail, name, verificationToken) => {
    const emailOptions = {
        email: userEmail,
        subject: `Welcome to Xtracker ${name}`,
        message: `Thank you for registering!\n\nPlease click the link below to confirm your registration:\n\nhttp://xpensetransfer.com/verify?token=${verificationToken}\n`
    }

    try {
        await sendEmail(emailOptions);
        console.log('Registration confirmation email sent successfully');
    } catch (error) {
        console.error('Failed to send registration confirmation email:', error);
    }
}

const generateVerificationToken = async () => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const tokenExpires = Date.now() + 10 * 60 * 1000;
  console.log("Verification token created: ", hashedToken);
  return {
    verificationToken: hashedToken,
    expiresIn: tokenExpires
  };
};

module.exports = { generateVerificationToken, emailUserRegistrationConfirmationMessage };
