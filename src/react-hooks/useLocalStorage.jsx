// Hook supporting writing, getting and deleting data from local storage
import React from "react";
import {
  STORAGE_ACCESS_TOKEN_NAME,
  STORAGE_SOURCE_OF_FUND_FINANCE_NAME,
  STORAGE_SOURCE_OF_FUND_NAME,
  STORAGE_USER_PROGRAMS_NAME,
  STORAGE_USER_RIGHTS_NAME,
  STORAGE_MOH_APPROVAL_PARAMS,
  STORAGE_USER_ID_NAME
} from "../buq/utils/constants";

const useLocalStorage = () => {
  // Clear the local storage
  // Pass only local storage name (string)
  const handleClearLocalStorage = (localStorageName) => {
    localStorage.removeItem(localStorageName);
  };

  // Save data in the local storage
  // Pass local storage name (string) and data (array, object, etc.)
  const handleSaveInLocalStorage = (localStorageName, dataToSave) => {
    localStorage.setItem(localStorageName, JSON.stringify(dataToSave));
  };

  // Retrieves stored data that are not parsed
  const localStorageItem = (id) => localStorage.getItem(id);

  // Retrieves stored data that are parsed
  const parseLocalStorageItem = (id) => JSON.parse(localStorageItem(id));

  const storedItems = {
    userId: localStorageItem(STORAGE_USER_ID_NAME),
    userPrograms: parseLocalStorageItem(STORAGE_USER_PROGRAMS_NAME),
    userRights: parseLocalStorageItem(STORAGE_USER_RIGHTS_NAME),
    sourcesOfFunds: parseLocalStorageItem(STORAGE_SOURCE_OF_FUND_NAME),
    sourceOfFundFinance:  parseLocalStorageItem(STORAGE_SOURCE_OF_FUND_FINANCE_NAME),
    token: localStorageItem(STORAGE_ACCESS_TOKEN_NAME),
    mohApprovalParams: parseLocalStorageItem(STORAGE_MOH_APPROVAL_PARAMS)
  };

  return {
    storedItems,
    handleClearLocalStorage,
    handleSaveInLocalStorage,
  };
};

export default useLocalStorage;
