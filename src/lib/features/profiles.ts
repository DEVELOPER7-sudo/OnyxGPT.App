import { UserProfile } from '../../types/features';

// ============================================================
// LOCAL STORAGE KEY
// ============================================================

const STORAGE_KEY = 'onyx_user_profiles';

// ============================================================
// USER PROFILE OPERATIONS
// ============================================================

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const createUserProfile = async (
  userId: string,
  displayName?: string,
  bio?: string
): Promise<UserProfile> => {
  const profile: UserProfile = {
    id: userId,
    display_name: displayName,
    bio,
    profile_visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(profile));
  return profile;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  const existing = await getUserProfile(userId) || await createUserProfile(userId);
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(updated));
  return updated;
};

// ============================================================
// AVATAR MANAGEMENT
// ============================================================

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  // Optimize image and create object URL
  const optimizedFile = await optimizeImage(file);
  const url = URL.createObjectURL(optimizedFile);
  
  // Update profile with avatar URL
  await updateUserProfile(userId, { avatar_url: url });
  
  return url;
};

export const deleteAvatar = async (userId: string): Promise<void> => {
  const profile = await getUserProfile(userId);

  if (profile?.avatar_url) {
    // Revoke object URL if it was created locally
    if (profile.avatar_url.startsWith('blob:')) {
      URL.revokeObjectURL(profile.avatar_url);
    }
    await updateUserProfile(userId, { avatar_url: undefined });
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

async function optimizeImage(file: File, maxWidth = 256, maxHeight = 256): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve(optimizedFile);
        }, 'image/jpeg', 0.85);
      };

      img.onerror = () => reject(new Error('Failed to load image'));

      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export const getPublicProfile = async (userId: string): Promise<Partial<UserProfile> | null> => {
  const profile = await getUserProfile(userId);

  if (!profile) return null;

  // Only return public information
  if (profile.profile_visibility === 'public') {
    const { id, display_name, bio, avatar_url } = profile;
    return { id, display_name, bio, avatar_url };
  }

  return null;
};
