import {
  getUserSettings,
  updateUserSettings,
} from "../models/user.model.js";


export async function getSettings(req, res) {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let settings = await getUserSettings(userId);

    if (!settings) {
      settings = await updateUserSettings({
        userId,
        theme: "light",
        language: "en",
      });
    }

    return res.json({
      success: true,
      settings,
    });

  } catch (error) {

    console.error("❌ Get settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get settings",
    });

  }

}


export async function updateSettings(req, res) {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const settings = await updateUserSettings({
      userId,
      theme: req.body?.theme,
      language: req.body?.language,
    });

    return res.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });

  } catch (error) {

    console.error("❌ Update settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });

  }

}
