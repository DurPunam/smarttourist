const admin = require('firebase-admin');
const twilio = require('twilio');

class NotificationService {
  constructor() {
    // Initialize Firebase Admin (if credentials are provided)
    if (process.env.FIREBASE_PROJECT_ID) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
        this.firebaseInitialized = true;
        console.log('✅ Firebase Admin initialized');
      } catch (error) {
        console.log('⚠️  Firebase Admin not initialized:', error.message);
        this.firebaseInitialized = false;
      }
    } else {
      this.firebaseInitialized = false;
      console.log('⚠️  Firebase credentials not provided');
    }

    // Initialize Twilio (if credentials are provided)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.twilioInitialized = true;
      console.log('✅ Twilio initialized');
    } else {
      this.twilioInitialized = false;
      console.log('⚠️  Twilio credentials not provided');
    }
  }

  /**
   * Send push notification via Firebase
   */
  async sendPushNotification(deviceToken, notification, data = {}) {
    if (!this.firebaseInitialized) {
      console.log('Push notification skipped: Firebase not initialized');
      return { success: false, message: 'Firebase not configured' };
    }

    try {
      const message = {
        token: deviceToken,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          ...data,
          timestamp: new Date().toISOString(),
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'tourist-safety',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('Push notification sent:', response);

      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      console.error('Push notification error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send SMS via Twilio
   */
  async sendSMS(phoneNumber, message) {
    if (!this.twilioInitialized) {
      console.log('SMS skipped: Twilio not initialized');
      return { success: false, message: 'Twilio not configured' };
    }

    try {
      const response = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      console.log('SMS sent:', response.sid);

      return {
        success: true,
        messageId: response.sid,
      };
    } catch (error) {
      console.error('SMS error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send WhatsApp message via Twilio
   */
  async sendWhatsApp(phoneNumber, message) {
    if (!this.twilioInitialized) {
      console.log('WhatsApp skipped: Twilio not initialized');
      return { success: false, message: 'Twilio not configured' };
    }

    try {
      const response = await this.twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phoneNumber}`,
      });

      console.log('WhatsApp sent:', response.sid);

      return {
        success: true,
        messageId: response.sid,
      };
    } catch (error) {
      console.error('WhatsApp error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send emergency alert to multiple channels
   */
  async sendEmergencyAlert(user, alert) {
    const results = {
      push: null,
      sms: null,
      whatsapp: null,
    };

    const message = `🚨 EMERGENCY ALERT
Tourist: ${user.name}
Type: ${alert.type}
Location: ${alert.location?.address || 'Unknown'}
Time: ${new Date().toLocaleString()}

Immediate assistance required!`;

    // Send push notification
    if (user.deviceToken) {
      results.push = await this.sendPushNotification(
        user.deviceToken,
        {
          title: '🚨 Emergency Alert',
          body: `${user.name} needs immediate assistance`,
        },
        {
          type: 'emergency',
          alertId: alert.id,
          userId: user.id,
        }
      );
    }

    // Send SMS
    if (user.phone) {
      results.sms = await this.sendSMS(user.phone, message);
    }

    // Send WhatsApp
    if (user.phone && process.env.ENABLE_WHATSAPP === 'true') {
      results.whatsapp = await this.sendWhatsApp(user.phone, message);
    }

    return results;
  }

  /**
   * Send notification to nearby authorities
   */
  async notifyNearbyAuthorities(alert, authorities) {
    const notifications = [];

    for (const authority of authorities) {
      const message = `🚨 TOURIST EMERGENCY NEARBY

Location: ${alert.location?.address || 'Unknown'}
Distance: ${authority.distance} km
Type: ${alert.type}
Tourist: ${alert.touristName}

Please respond immediately.`;

      // Send to each authority
      const result = await this.sendSMS(authority.phone, message);
      notifications.push({
        authorityId: authority.id,
        result,
      });
    }

    return notifications;
  }

  /**
   * Send weather alert
   */
  async sendWeatherAlert(users, weatherData) {
    const message = `⚠️ WEATHER ALERT

${weatherData.alert.event}
Severity: ${weatherData.alert.severity}
Area: ${weatherData.location}

${weatherData.alert.description}

Please take necessary precautions.`;

    const results = [];

    for (const user of users) {
      if (user.deviceToken) {
        const result = await this.sendPushNotification(
          user.deviceToken,
          {
            title: '⚠️ Weather Alert',
            body: weatherData.alert.event,
          },
          {
            type: 'weather',
            severity: weatherData.alert.severity,
          }
        );
        results.push({ userId: user.id, result });
      }
    }

    return results;
  }

  /**
   * Send safety tip notification
   */
  async sendSafetyTip(deviceToken, tip) {
    return await this.sendPushNotification(
      deviceToken,
      {
        title: '💡 Safety Tip',
        body: tip,
      },
      {
        type: 'safety-tip',
      }
    );
  }
}

// Export singleton instance
module.exports = new NotificationService();
