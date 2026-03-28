import axios from "axios";

const backendBase =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: `${backendBase.replace(/\/$/, "")}/store`,
});
export const createPlaylist = (payload) => {
  return api.post(`/playlist/`, payload);
};
export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`);
export const getPlaylistById = (id) => api.get(`/playlist/${id}`);
export const getPlaylistPairs = () => api.get(`/playlistpairs/`);
export const updatePlaylistById = (id, playlist) => {
  return api.put(`/playlist/${id}`, {
    playlist: playlist,
  });
};

export const copyPlaylist = (id) => api.post(`/playlist/${id}/copy`);

export const getSongCatalog = () => api.get(`/songs/catalog`);
export const getPlaylistSearch = (searchCriteria) => {
  return api.get(`/playlist/search-result`, { params: searchCriteria });
};

export const getSongCatalogSearch = (searchCriteria) => {
  return api.get(`/songs/search-result`, { params: searchCriteria });
};
export const removeSongFromCatalog = (id) => api.delete(`/song/${id}`);
export const createSong = (payload) => {
  return api.post(`/song/`, payload);
};

export const updateSong = (payload) => {
  return api.put(`/song/${payload._id}`, payload);
};

export const addSongToPlaylist = (id, song) => {
  return api.put(`/playlist/${id}/song/`, {
    song: song,
  });
};

export const incrementListenersCount = (id) =>
  api.put(`/playlist/${id}/listeners`);

export const incrementListensCount = (id) => api.put(`/song/${id}/listens`);
const apis = {
  createPlaylist,
  deletePlaylistById,
  getPlaylistById,
  getPlaylistPairs,
  updatePlaylistById,
  getSongCatalog,
  getPlaylistSearch,
  getSongCatalogSearch,
  removeSongFromCatalog,
  createSong,
  updateSong,
  addSongToPlaylist,
  copyPlaylist,
  incrementListenersCount,
  incrementListensCount,
};

export default apis;
