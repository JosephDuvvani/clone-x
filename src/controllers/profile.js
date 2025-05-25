import { upload } from "../middleware/multerMiddleware.js";
import models from "../models/index.js";
import { deleteAllFiles, uploadFile } from "../services/storageService.js";
import { v4 as uuidv4 } from "uuid";

const getProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const profile = await models.Profile.find(username);
    return res.json({ profile });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving profile information",
      error: err,
    });
  }
};

const updateProfile = [
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  async (req, res) => {
    const { username } = req.params;
    const { firstname, lastname, bio } = req.body;
    const files = req.files;

    let data = {
      firstname,
      lastname,
      bio,
    };

    if (files) {
      try {
        const bucket = process.env.SUPABASE_BUCKET_NAME;
        const banner = files?.bannerImage?.[0];
        const picture = files?.profileImage?.[0];

        if (banner) {
          const folderPath = `banners/${username}`;
          const filepath = `${folderPath}/${uuidv4()}`;
          await deleteAllFiles(folderPath, bucket);

          const fileUrl = await uploadFile(banner, filepath, bucket);
          data = {
            ...data,
            bannerUrl: fileUrl,
          };
        }
        if (picture) {
          const folderPath = `profiles/${username}`;
          const filepath = `${folderPath}/${uuidv4()}`;
          await deleteAllFiles(folderPath, bucket);

          const fileUrl = await uploadFile(picture, filepath, bucket);
          data = {
            ...data,
            pictureUrl: fileUrl,
          };
        }
      } catch (err) {
        return res.status(500).json({
          message: "Error uploading file",
          error: err,
        });
      }
    }

    try {
      const profile = await models.Profile.updateProfile(username, data);
      return res.json({ profile });
    } catch (err) {
      return res.status(500).json({
        message: "Error retrieving profile information",
        error: err,
      });
    }
  },
];

export { getProfile, updateProfile };
