import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { jsTPS } from "jstps";
import storeRequestSender from "./requests";
import CreateSong_Transaction from "../transactions/CreateSong_Transaction";
import MoveSong_Transaction from "../transactions/MoveSong_Transaction";
import RemoveSong_Transaction from "../transactions/RemoveSong_Transaction";
import UpdateSong_Transaction from "../transactions/UpdateSong_Transaction";
import DuplicateSong_Transaction from "../transactions/DuplicateSong_Transaction";
import AuthContext from "../auth";
import { avatarClasses } from "@mui/material";

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
  MARK_LIST_FOR_PLAY: "MARK_LIST_FOR_PLAY",
  MARK_LIST_FOR_EDIT: "MARK_LIST_FOR_EDIT",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
  UPDATE_LIST_WHILE_EDITING: "UPDATE_LIST_WHILE_EDITING",
  EDIT_SONG: "EDIT_SONG",
  REMOVE_SONG_FROM_CATALOG: "REMOVE_SONG_FROM_CATALOG",
  EDIT_SONG_IN_CATALOG: "EDIT_SONG_IN_CATALOG",
  HIDE_MODALS: "HIDE_MODALS",
  LOAD_PLAYLIST_SEARCH: "LOAD_PLAYLIST_SEARCH",
  // Songs
  LOAD_SONG_CATALOG: "LOAD_SONG_CATALOG",
  SET_CURRENT_PLAYING_SONG: "SET_CURRENT_PLAYING_SONG",
  LOAD_SONG_SEARCH: "LOAD_SONG_SEARCH",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
  NONE: "NONE",
  DELETE_LIST: "DELETE_LIST",
  EDIT_SONG_IN_CATALOG: "EDIT_SONG_IN_CATALOG",
  REMOVE_SONG_FROM_CATALOG: "REMOVE_SONG_FROM_CATALOG",
  SHOW_CREATE_SONG_MODAL: "SHOW_CREATE_SONG_MODAL",
  PLAY_LIST: "PLAY_LIST",
  EDIT_LIST: "EDIT_LIST",
  ERROR: "ERROR",
};

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE,
    idNamePairs: [],
    songCatalog: [],
    currentList: null,
    currentSongIndex: -1,
    currentSong: null,
    currentSongToPlay: null,
    newListCounter: 0,
    listNameActive: false,
    listIdMarkedForDeletion: null,
    listMarkedForDeletion: null,
    listIdMarkedForPlay: null,
    listMarkedForPlay: null,
    listIdMarkedForEdit: null,
    listMarkedForEdit: null,
    userName: null,
    avatar: null,
    songToRemove: null,
    songToEdit: null,
  });
  const history = useHistory();

  console.log("inside useGlobalStore");

  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
  const { auth } = useContext(AuthContext);
  console.log("auth: " + auth);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          currentModal: store.currentModal,
          idNamePairs: payload.idNamePairs,
          currentList: payload.playlist,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          listIdMarkedForEdit: store.listIdMarkedForEdit,
          listMarkedForEdit: payload.playlist,
          lastViewedPlaylistId: null,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: null,
          listMarkedForEdit: null,
        });
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          currentModal: CurrentModal.EDIT_LIST,
          idNamePairs: store.idNamePairs,
          currentList: payload.playlist,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter + 1,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: payload.playlist._id,
          listMarkedForEdit: payload.playlist,
          lastViewedPlaylistId: payload.playlist._id,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload,
          songCatalog: store.songCatalog,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: null,
          listMarkedForEdit: null,
          currentSongToPlay: store.currentSongToPlay,
          lastViewedPlaylistId: store.lastViewedPlaylistId,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          currentModal: CurrentModal.DELETE_LIST,
          idNamePairs: store.idNamePairs,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: payload.id,
          listMarkedForDeletion: payload.playlist,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: null,
          listMarkedForEdit: null,
        });
      }
      // PREPARE TO PLAY A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_PLAY: {
        return setStore({
          currentModal: CurrentModal.PLAY_LIST,
          idNamePairs: store.idNamePairs,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForPlay: payload.id,
          listMarkedForPlay: payload.playlist,
          listIdMarkedForEdit: null,
          listMarkedForEdit: null,
          userName: payload.userName,
          avatar: payload.avatar,
          lastViewedPlaylistId: payload.id,
        });
      }
      // PREPARE TO EDIT A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_EDIT: {
        return setStore({
          currentModal: CurrentModal.EDIT_LIST,
          idNamePairs: store.idNamePairs,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: payload.id,
          listMarkedForEdit: payload.playlist,
          lastViewedPlaylistId: payload.id,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: null,
          listMarkedForEdit: null,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: true,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: null,
          listMarkedForEdit: null,
        });
      }
      //
      case GlobalStoreActionType.EDIT_SONG_IN_CATALOG: {
        return setStore({
          ...store,
          currentModal: CurrentModal.EDIT_SONG_IN_CATALOG,
          songToEdit: payload.songToEdit,
        });
      }
      case GlobalStoreActionType.SHOW_CREATE_SONG_MODAL: {
        return setStore({
          ...store,
          currentModal: CurrentModal.SHOW_CREATE_SONG_MODAL,
        });
      }
      case GlobalStoreActionType.REMOVE_SONG_FROM_CATALOG: {
        return setStore({
          ...store,
          currentModal: CurrentModal.REMOVE_SONG_FROM_CATALOG,
          songToRemove: payload.songToRemove,
        });
      }
      case GlobalStoreActionType.UPDATE_LIST_WHILE_EDITING: {
        return setStore({
          currentModal: store.currentModal,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: store.listIdMarkedForEdit,
          listMarkedForEdit: payload,
        });
      }
      case GlobalStoreActionType.HIDE_MODALS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          songCatalog: store.songCatalog,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          listIdMarkedForPlay: null,
          listMarkedForPlay: null,
          listIdMarkedForEdit: null,
          listMarkedForEdit: null,
          currentSongToPlay: store.currentSongToPlay,
          lastViewedPlaylistId: store.lastViewedPlaylistId,
        });
      }
      case GlobalStoreActionType.LOAD_SONG_CATALOG: {
        return setStore({
          ...store,
          songCatalog: payload,
          currentModal: CurrentModal.NONE,
        });
      }
      case GlobalStoreActionType.SET_CURRENT_PLAYING_SONG: {
        return setStore({
          ...store,
          currentModal: CurrentModal.NONE,
          currentSongToPlay: payload,
        });
      }
      case GlobalStoreActionType.LOAD_PLAYLIST_SEARCH: {
        return setStore({
          ...store,
          currentModal: CurrentModal.NONE,
          idNamePairs: payload,
          currentList: null,
          listNameActive: false,
        });
      }
      case GlobalStoreActionType.LOAD_SONG_SEARCH: {
        return setStore({
          ...store,
          currentModal: CurrentModal.NONE,
          songCatalog: payload,
          currentList: null,
          listNameActive: false,
        });
      }
      default:
        return store;
    }
  };

  store.setCurrentPlayingSong = function (song) {
    storeReducer({
      type: GlobalStoreActionType.SET_CURRENT_PLAYING_SONG,
      payload: song,
    });
  };
  // RETREIVE SONG CATALOG
  store.loadSongCatalog = function () {
    async function asyncLoadSongCatalog() {
      const response = await storeRequestSender.getSongCatalog();
      if (response.data.success) {
        let songCatalog = response.data.songCatalog;
        console.log(songCatalog);
        storeReducer({
          type: GlobalStoreActionType.LOAD_SONG_CATALOG,
          payload: songCatalog,
        });
      } else {
        console.log("FAILED TO GET THE SONG CATALOG");
      }
    }
    asyncLoadSongCatalog();
  };
  store.tryAcessingOtherAccountPlaylist = function () {
    let id = "635f203d2e072037af2e6284";
    async function asyncSetCurrentList(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: playlist,
        });
      }
    }
    asyncSetCurrentList(id);
    history.push("/playlist/635f203d2e072037af2e6284");
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    // GET THE LIST
    async function asyncChangeListName(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        playlist.name = newName;
        async function updateList(playlist) {
          response = await storeRequestSender.updatePlaylistById(
            playlist._id,
            playlist
          );
          if (response.data.success) {
            async function getListPairs(playlist) {
              response = await storeRequestSender.getPlaylistPairs();
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    playlist: playlist,
                  },
                });
              }
            }
            getListPairs(playlist);
          }
        }
        updateList(playlist);
      }
    }
    asyncChangeListName(id);
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
    tps.clearAllTransactions();
    history.push("/");
  };

  store.showCreateSongModal = function () {
    storeReducer({
      type: GlobalStoreActionType.SHOW_CREATE_SONG_MODAL,
      payload: {},
    });
  };
  store.createNewSong = function (song) {
    async function asyncCreateNewSong(song) {
      let response = await storeRequestSender.createSong(song);
      if (response.data.success) {
        let newSong = response.data.song;

        const newCatalog = [...store.songCatalog, newSong];
        storeReducer({
          type: GlobalStoreActionType.LOAD_SONG_CATALOG,
          payload: newCatalog,
        });
        store.hideModals();
        store.loadSongCatalog();
      }
    }
    asyncCreateNewSong(song);
  };

  store.addSongToPlaylist = function (id, song) {
    async function asyncAddSongToPlaylist(id, song) {
      let response = await storeRequestSender.addSongToPlaylist(id, song);
      if (response.data.success) {
        store.loadSongCatalog();
      } else {
        console.log("FAILED TO ADD SONG TO PLAYLIST");
      }
    }
    asyncAddSongToPlaylist(id, song);
  };
  store.updateSong = function (songData) {
    async function asyncUpdateSong(songData) {
      const song = { ...songData, _id: store.songToEdit._id };
      let response = await storeRequestSender.updateSong(song);
      if (response.data.success) {
        let updatedSong = response.data.song;

        const newCatalog = store.songCatalog.map((existingSong) => {
          if (existingSong._id === updatedSong._id) {
            return updatedSong;
          }
          return existingSong;
        });

        storeReducer({
          type: GlobalStoreActionType.LOAD_SONG_CATALOG,
          payload: newCatalog,
        });
        store.songToEdit = null;
        store.hideModals();
        store.loadSongCatalog();
      }
    }
    asyncUpdateSong(songData);
  };
  // THIS FUNCTION CREATES A NEW LIST
  store.createNewList = async function () {
    let newListName = "Untitled" + store.newListCounter;
    const newList = {
      name: newListName,
      songs: [],
      ownerEmail: auth.user.email,
      userName: auth.user.userName,
      listenersCount: 0,
    };
    const response = await storeRequestSender.createPlaylist(newList);
    console.log("createNewList response: " + response);
    if (response.status === 201) {
      tps.clearAllTransactions();
      let newList = response.data.playlist;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: { playlist: newList },
      });

      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
    } else {
      console.log("FAILED TO CREATE A NEW LIST");
    }
  };

  store.searchSongCatalog = function (searchCriteria) {
    async function asyncSearchSongs() {
      const response = await storeRequestSender.getSongCatalogSearch(
        searchCriteria
      );
      if (response.data.success) {
        let searchResults = response.data.data;
        let songs = searchResults;
        storeReducer({
          type: GlobalStoreActionType.LOAD_SONG_SEARCH,
          payload: songs,
        });
      } else {
        console.log("FAILED TO GET SEARCH RESULTS");
      }
    }
    asyncSearchSongs();
  };

  store.removeSongFromCatalog = function () {
    async function asyncRemoveSongFromCatalog() {
      const response = await storeRequestSender.removeSongFromCatalog(
        store.songToRemove._id
      );
      if (response.data.success) {
        store.loadSongCatalog();
        setStore((prevStore) => ({
          ...prevStore,
          songToRemove: null,
          currentModal: CurrentModal.NONE,
        }));
      } else {
        console.log("FAILED TO REMOVE SONG FROM CATALOG");
      }
    }
    asyncRemoveSongFromCatalog();
  };

  store.searchPlaylists = function (searchCriteria) {
    async function asyncSearchPlaylists() {
      const response = await storeRequestSender.getPlaylistSearch(
        searchCriteria
      );
      if (response.data.success) {
        let searchResults = response.data.data;
        let pairsArray = searchResults;
        storeReducer({
          type: GlobalStoreActionType.LOAD_PLAYLIST_SEARCH,
          payload: pairsArray,
        });
      } else {
        console.log("FAILED TO GET SEARCH RESULTS");
      }
    }
    asyncSearchPlaylists();
  };
  store.sortSongCatalog = function (sortOption) {
    const copy = [...store.songCatalog];

    copy.sort((a, b) => {
      let comparison = 0;

      switch (sortOption) {
        case "Listens (Hi-Lo)":
          comparison = b.listensCount - a.listensCount;
          break;
        case "Listens (Lo-Hi)":
          comparison = a.listensCount - b.listensCount;
          break;

        case "Playlist (Hi-Lo)":
          comparison = b.playlistCount - a.playlistCount;
          break;
        case "Playlist (Lo-Hi)":
          comparison = a.playlistCount - b.playlistCount;
          break;
        case "Year (Hi-Lo)":
          comparison = b.year - a.year;
          break;
        case "Year (Lo-Hi)":
          comparison = a.year - b.year;
          break;
        case "Title (A-Z)":
          comparison = a.title.localeCompare(b.title);
          break;
        case "Title (Z-A)":
          comparison = b.title.localeCompare(a.title);
          break;

        case "Artist (A-Z)":
          comparison = a.artist.localeCompare(b.artist);
          break;
        case "Artist (Z-A)":
          comparison = b.artist.localeCompare(a.artist);
          break;

        default:
          comparison = 0;
      }
      return comparison;
    });

    storeReducer({
      type: GlobalStoreActionType.LOAD_SONG_CATALOG,
      payload: copy,
    });
  };

  store.sortIdNamePairs = function (sortOption) {
    const copy = [...store.idNamePairs];

    copy.sort((a, b) => {
      let comparison = 0;

      switch (sortOption) {
        case "Listeners (Hi-Lo)":
          comparison = b.listenersCount - a.listenersCount;
          break;
        case "Listeners (Lo-Hi)":
          comparison = a.listenersCount - b.listenersCount;
          break;
        case "Playlist Name (A-Z)":
          comparison = a.name.localeCompare(b.name);
          break;
        case "Playlist Name (Z-A)":
          comparison = b.name.localeCompare(a.name);
          break;
        case "User Name (A-Z)":
          comparison = a.userName.localeCompare(b.userName);
          break;
        case "User Name (Z-A)":
          comparison = b.userName.localeCompare(a.userName);
          break;

        default:
          comparison = 0;
      }
      return comparison;
    });
    storeReducer({
      type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
      payload: copy,
    });
  };
  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = function () {
    async function asyncLoadIdNamePairs() {
      const response = await storeRequestSender.getPlaylistPairs();
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;
        console.log(pairsArray);
        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: pairsArray,
        });
      } else {
        console.log("FAILED TO GET THE LIST PAIRS");
      }
    }
    asyncLoadIdNamePairs();
  };

  store.markListForEdit = function (id) {
    async function getListToEdit(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.MARK_LIST_FOR_EDIT,
          payload: { id: id, playlist: playlist },
        });
      }
    }
    getListToEdit(id);
  };
  store.markListForPlay = function (id) {
    async function getListToPlay(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.MARK_LIST_FOR_PLAY,
          payload: {
            id: id,
            playlist: playlist,
            userName: response.data.userName,
            avatar: response.data.avatar,
          },
        });
      }
    }
    getListToPlay(id);
  };

  // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
  // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
  // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
  // showDeleteListModal, and hideDeleteListModal
  store.markListForDeletion = function (id) {
    async function getListToDelete(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
          payload: { id: id, playlist: playlist },
        });
      }
    }
    getListToDelete(id);
  };
  store.deleteList = function (id) {
    async function processDelete(id) {
      let response = await storeRequestSender.deletePlaylistById(id);
      store.loadIdNamePairs();
      if (response.data.success) {
        history.push("/");
      }
    }
    processDelete(id);
  };
  store.deleteMarkedList = function () {
    store.deleteList(store.listIdMarkedForDeletion);
    store.hideModals();
  };
  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

  store.showEditSongModal = (song) => {
    storeReducer({
      type: GlobalStoreActionType.EDIT_SONG_IN_CATALOG,
      payload: { songToEdit: song },
    });
  };

  store.showRemoveSongModal = (song) => {
    storeReducer({
      type: GlobalStoreActionType.REMOVE_SONG_FROM_CATALOG,
      payload: { songToRemove: song },
    });
  };
  store.hideModals = () => {
    console.log("\n\n\nhiding modals");
    auth.errorMessage = null;
    storeReducer({
      type: GlobalStoreActionType.HIDE_MODALS,
      payload: {},
    });
  };
  store.isDeleteListModalOpen = () => {
    return store.currentModal === CurrentModal.DELETE_LIST;
  };
  store.isEditSongModalOpen = () => {
    return store.currentModal === CurrentModal.EDIT_SONG;
  };
  store.isErrorModalOpen = () => {
    return store.currentModal === CurrentModal.ERROR;
  };

  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo
  store.setCurrentList = function (id) {
    async function asyncSetCurrentList(id) {
      let response = await storeRequestSender.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;

        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: playlist,
        });
      }
    }
    asyncSetCurrentList(id);
  };

  store.getPlaylistSize = function () {
    return store.currentList.songs.length;
  };
  store.addNewSong = function () {
    let index = this.getPlaylistSize();
    this.addCreateSongTransaction(
      index,
      "Untitled",
      "?",
      new Date().getFullYear(),
      "dQw4w9WgXcQ"
    );
  };
  // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
  // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
  store.createSong = function (index, song) {
    store.currentList = store.listMarkedForEdit;
    let list = store.currentList;
    list.songs.splice(index, 0, song);
    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
  // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
  store.moveSong = function (start, end) {
    store.currentList = store.listMarkedForEdit;
    let list = store.currentList;

    // WE NEED TO UPDATE THE STATE FOR THE APP
    if (start < end) {
      let temp = list.songs[start];
      for (let i = start; i < end; i++) {
        list.songs[i] = list.songs[i + 1];
      }
      list.songs[end] = temp;
    } else if (start > end) {
      let temp = list.songs[start];
      for (let i = start; i > end; i--) {
        list.songs[i] = list.songs[i - 1];
      }
      list.songs[end] = temp;
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
  // FROM THE CURRENT LIST
  store.removeSong = function (index) {
    store.currentList = store.listMarkedForEdit;
    let list = store.currentList;
    list.songs.splice(index, 1);

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };

  // THIS FUNCTION ADDS A DuplicateSong_Transaction TO THE TRANSACTION STACK
  store.addDuplicateSongTransaction = (index) => {
    let song = store.listMarkedForEdit.songs[index];
    let transaction = new DuplicateSong_Transaction(store, index, song);
    tps.processTransaction(transaction);
  };
  // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
  store.addCreateSongTransaction = (index, title, artist, year, youTubeId) => {
    // ADD A SONG ITEM AND ITS NUMBER
    let song = {
      title: title,
      artist: artist,
      year: year,
      youTubeId: youTubeId,
    };
    let transaction = new CreateSong_Transaction(store, index, song);
    tps.processTransaction(transaction);
  };
  store.addMoveSongTransaction = function (start, end) {
    let transaction = new MoveSong_Transaction(store, start, end);
    tps.processTransaction(transaction);
  };
  // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
  store.addRemoveSongTransaction = (song, index) => {
    //let index = store.currentSongIndex;
    //let song = store.currentList.songs[index];
    let transaction = new RemoveSong_Transaction(store, index, song);
    tps.processTransaction(transaction);
  };
  store.addUpdateSongTransaction = function (index, newSongData) {
    let song = store.currentList.songs[index];
    let oldSongData = {
      title: song.title,
      artist: song.artist,
      year: song.year,
      youTubeId: song.youTubeId,
    };
    let transaction = new UpdateSong_Transaction(
      this,
      index,
      oldSongData,
      newSongData
    );
    tps.processTransaction(transaction);
  };
  store.updateCurrentList = function () {
    async function asyncUpdateCurrentList() {
      const response = await storeRequestSender.updatePlaylistById(
        store.currentList._id,
        store.currentList
      );
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.UPDATE_LIST_WHILE_EDITING,
          payload: store.currentList,
        });
      }
    }
    asyncUpdateCurrentList();
  };
  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };
  store.canAddNewSong = function () {
    return store.currentList !== null;
  };
  store.canUndo = function () {
    return store.currentList !== null && tps.hasTransactionToUndo();
  };
  store.canRedo = function () {
    return store.currentList !== null && tps.hasTransactionToDo();
  };
  store.canClose = function () {
    return store.currentList !== null;
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setIsListNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  function KeyPress(event) {
    if (!store.modalOpen && event.ctrlKey) {
      if (event.key === "z") {
        store.undo();
      }
      if (event.key === "y") {
        store.redo();
      }
    }
  }

  document.onkeydown = (event) => KeyPress(event);

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
