import twilio, { Twilio } from 'twilio';
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client: Twilio = twilio(accountSid, authToken);


/**
 * Sends an OTP to the specified phone number.
 * 
 * @param phoneNumber - The phone number to send the OTP to.
 * @param otp - The OTP to send.
*/

export const sendOtp = async (phoneNumber: string, otp: string) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            to: `+91${phoneNumber}`,
            from: process.env.TWILLIO_NUMBER
        });

        // console.log(message, " mesage response ")
        // console.log(`OTP sent to ${phoneNumber}. Message SID: ${message.sid}`);
        return message
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false
    }
}

