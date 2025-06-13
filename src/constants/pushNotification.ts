import admin from "firebase-admin";
//const FCM_Token = "dffs9vz5Yivty6ApYvMYYm:APA91bG971biI2VyFVK6gb4_GLV9HM2HBLXzykkwIV4ap0pSbjxinGlNjFYNpg0VwPpYWiKVNdm8lWYpbKFWVyvZJCuFoZL1RNBuY5JTUlOpoyhTGF6Z_SENYCdTcN70kSCVOyxvb75N"

class NotificationService {
  constructor() {
    // Initialize Firebase Admin SDK here
    var serviceAccount = require("../constants/strong-arbor-367509-firebase-adminsdk-3zmc7-ba5893591b.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async sendMultipleNotification(registrationTokens : string[], body:any, title:string , description:string) {
    
    const payload = {
      notification: {
        title:title,
        body:description,
        //image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLpdHzA-sMkNFX97uX94DEN_lCVpSXwl1B0MfvBvp6rDkEx1Xf6tgq6jafKIOaTRQff54&usqp=CAU"
      },
      data: {
        customData: "additional data",
      },
    };
    
    try {

       // Return early without sending notifications
      if (registrationTokens.length === 0) {
        console.log('No registration tokens provided. Skipping notification.');
        return;
      }
      
      const response = await admin.messaging().sendToDevice(
        registrationTokens,
        payload
      );
      console.log(response,'push notfication reposne ')
      return response;
    } catch (error) {
      console.log(error,'push notfication error ')
      throw error;
    }
  }
}

export default new NotificationService();
