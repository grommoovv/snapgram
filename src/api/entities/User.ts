import { saveUserToDB, getAccount, uploadFile, getFilePreview, deleteFile } from '@/api/appwrite'
import { account, avatars, databases, appwriteConfig } from '@/api/appwrite/config'
import { INewUser, IUpdateUser } from '@/types'
import { ID, Query } from 'appwrite'

export class User {
  async createUserAccount(user: INewUser) {
    try {
      const newAccount = await account.create(ID.unique(), user.email, user.password, user.name)

      if (!newAccount) throw Error

      const avatarUrl = avatars.getInitials(user.name)

      const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl,
      })

      return newUser
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async saveUserToDB(user: {
    accountId: string
    email: string
    name: string
    imageUrl: URL
    username?: string
  }) {
    try {
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user
      )

      return newUser
    } catch (error) {
      console.log(error)
    }
  }

  async getCurrentUser() {
    try {
      const currentAccount = await getAccount()

      if (!currentAccount) throw Error

      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      )

      if (!currentUser) throw Error

      return currentUser.documents[0]
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      )

      if (!user) throw Error

      return user
    } catch (error) {
      console.log(error)
    }
  }

  async getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc('$createdAt')]

    if (limit) {
      queries.push(Query.limit(limit))
    }

    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        queries
      )

      if (!users) throw Error

      return users
    } catch (error) {
      console.log(error)
    }
  }

  async updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0
    try {
      let image = {
        imageUrl: user.imageUrl,
        imageId: user.imageId,
      }

      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(user.file[0])
        if (!uploadedFile) throw Error

        // Get new file url
        const fileUrl = await getFilePreview(uploadedFile.$id)
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id)
          throw Error
        }

        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
      }

      //  Update user
      const updatedUser = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.userId,
        {
          name: user.name,
          bio: user.bio,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
        }
      )

      // Failed to update
      if (!updatedUser) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageId)
        }
        // If no new file uploaded, just throw error
        throw Error
      }

      // Safely delete old file after successful update
      if (user.imageId && hasFileToUpdate) {
        await deleteFile(user.imageId)
      }

      return updatedUser
    } catch (error) {
      console.log(error)
    }
  }
}
