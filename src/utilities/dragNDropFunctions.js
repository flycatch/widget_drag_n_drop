import { LOCAL_STORAGE_KEY } from "../constants/StorageConstant";

export const saveToLocalStorage = (updatedList) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
};
