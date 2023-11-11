import { Client, Account, Databases, Storage, Avatars } from 'appwrite'

const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
}

const client = new Client().setEndpoint(appwriteConfig.url).setProject(appwriteConfig.projectId)
const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)
const avatars = new Avatars(client)

export { appwriteConfig, account, databases, storage, avatars }
