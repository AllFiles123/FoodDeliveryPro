import { getUserById } from "../models/user.model.js";


export async function getProfile(req, res) {

  try {

    const user = getUserById(
      req.user.id
    );


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    return res.json({
      success: true,
      user,
    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });

  }

}
