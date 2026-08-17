import {
  getNotificationsByUser,
  markNotificationRead,
} from "../models/notification.model.js";


export async function getNotifications(req, res) {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notifications = await getNotificationsByUser(userId);

    return res.json({
      success: true,
      notifications,
    });

  } catch (error) {

    console.error("❌ Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get notifications",
    });

  }

}


export async function readNotification(req, res) {

  try {

    const userId = req.user?.id;
    const id = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notification = await markNotificationRead(id, userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });

  } catch (error) {

    console.error("❌ Read notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });

  }

}
