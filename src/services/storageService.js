import { supabase } from "../config/supabaseClient.js";

const uploadFile = async (file, filepath, bucket) => {
  const { buffer } = file;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filepath, buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    throw new Error("Error uploading file:", error.message);
  }

  const { data, error: publicUrlError } = supabase.storage
    .from(bucket)
    .getPublicUrl(filepath);

  if (publicUrlError) {
    throw new Error("Error getting file URL:", publicUrlError.message);
  }

  return data.publicUrl;
};

const deleteFile = async (filepath, bucket) => {
  const { error } = await supabase.storage.from(bucket).remove(filepath);

  if (error) {
    throw new Error("Error deleting file:", error.message);
  } else {
    console.log("File deleted successfully!");
  }
};

const deleteAllFiles = async (folderPath, bucket) => {
  const { data, error } = await supabase.storage.from(bucket).list(folderPath);

  if (error) {
    throw new Error("Error listing files:", error.message);
  }

  if (!data.length) return;

  const filePaths = data.map((file) => `${folderPath}/${file.name}`);
  const { error: deleteError } = await supabase.storage
    .from(bucket)
    .remove(filePaths);

  if (deleteError) {
    throw new Error("Error deleting files:", deleteError.message);
  } else {
    console.log("All files deleted successfully!");
  }
};

export { uploadFile, deleteFile, deleteAllFiles };
