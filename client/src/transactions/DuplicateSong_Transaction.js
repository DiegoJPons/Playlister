import { jsTPS_Transaction } from "jstps";

export default class DuplicateSong_Transaction extends jsTPS_Transaction {
  constructor(initStore, initIndex, initSong) {
    super();
    this.store = initStore;
    this.index = initIndex;
    this.song = { ...initSong };
    this.songDuplicate = structuredClone(initSong);
    this.songDuplicate.title = this.songDuplicate.title + " (Copy) ";
    this.songDuplicateIndex = initIndex + 1;
  }

  executeDo() {
    this.store.createSong(this.songDuplicateIndex, this.songDuplicate);
  }

  executeUndo() {
    this.store.removeSong(this.songDuplicateIndex);
  }
}
