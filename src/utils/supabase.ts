import supabase from "../supabase";

export const constructAvatarURL = (filePath: string) => {
  return supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;
};
