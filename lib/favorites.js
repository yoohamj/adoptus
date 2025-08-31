// Simple localStorage-based favorites per user
// Key format: favorites_v1:{userId}

const KEY_PREFIX = 'favorites_v1:';

export async function getUserId() {
  try {
    const { Auth } = await import('aws-amplify');
    const user = await Auth.currentAuthenticatedUser();
    return user?.attributes?.sub || user?.username || null;
  } catch {
    return null;
  }
}

function read(key) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(key, arr) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(arr)); } catch {}
}

export async function getFavorites() {
  const uid = await getUserId();
  if (!uid) return [];
  const key = KEY_PREFIX + uid;
  return read(key);
}

export async function isFavorite(id) {
  const favs = await getFavorites();
  return favs.includes(id);
}

export async function addFavorite(id) {
  const uid = await getUserId();
  if (!uid) return [];
  const key = KEY_PREFIX + uid;
  const favs = read(key);
  if (!favs.includes(id)) {
    favs.unshift(id);
    write(key, favs);
  }
  return favs;
}

export async function removeFavorite(id) {
  const uid = await getUserId();
  if (!uid) return [];
  const key = KEY_PREFIX + uid;
  const favs = read(key).filter(x => x !== id);
  write(key, favs);
  return favs;
}

export async function toggleFavorite(id) {
  const uid = await getUserId();
  if (!uid) return [];
  const key = KEY_PREFIX + uid;
  const favs = read(key);
  const idx = favs.indexOf(id);
  if (idx === -1) {
    favs.unshift(id);
  } else {
    favs.splice(idx, 1);
  }
  write(key, favs);
  return favs;
}
