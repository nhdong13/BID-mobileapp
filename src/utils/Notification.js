/* eslint-disable consistent-return */
/* eslint-disable no-undef */
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { registerExpoToken } from 'api/expo.api';

export async function registerPushNotifications(userId) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  );
  let finalStatus = existingStatus;
  console.log(
    'PHUC: registerPushNotifications -> existingStatus',
    existingStatus,
  );

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus != 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log('PHUC: registerPushNotifications -> status', status);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus != 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync().catch((error) =>
    console.log(error),
  );
  console.log('PHUC: registerPushNotifications -> token', token);

  const request = {
    userId: userId,
    token: token,
  };

  const result = await registerExpoToken(request)
    .then(async (res) => {
      // console.log('PHUC: registerPushNotifications -> res', res);
      // await saveTokenExpo(res);

      return res;
    })
    .catch((error) => {
      console.log(
        'PHUC: registerPushNotifications -> erro -> loi deo gi day',
        error,
      );
      return error;
    });
  // console.log('PHUC: registerPushNotifications -> result', result);
  return result;
}
