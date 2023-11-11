/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID, Query } from 'appwrite'

import { appwriteConfig, account, databases, storage, avatars } from './config'
import { IUpdatePost, INewPost, INewUser, IUpdateUser } from '@/types'

export const createUserAccount = async (user: INewUser) => {
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

export const saveUserToDB = async (user: {
  accountId: string
  email: string
  name: string
  imageUrl: URL
  username?: string
}) => {
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

export const signInAccount = async (user: { email: string; password: string }) => {
  try {
    const session = await account.createEmailSession(user.email, user.password)

    return session
  } catch (error) {
    console.log(error)
  }
}

export const getAccount = async () => {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error) {
    console.log(error)
  }
}

export const getCurrentUser = async () => {
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

export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession('current')

    return session
  } catch (error) {
    console.log(error)
  }
}

export const createPost = async (post: INewPost) => {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) throw Error

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newPost
  } catch (error) {
    console.log(error)
  }
}

export const uploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file)

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export const getFilePreview = async (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100)

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export const searchPosts = async (searchTerm: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export const getInfinitePosts = async ({ pageParam }: { pageParam: number }) => {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(9)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export const getPostById = async (postId?: string) => {
  if (!postId) throw Error

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    if (!post) throw Error

    return post
  } catch (error) {
    console.log(error)
  }
}

export const updatePost = async (post: IUpdatePost) => {
  const hasFileToUpdate = post.file.length > 0

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    }

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) throw Error

      // Get new file url
      const fileUrl = await getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    )

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId)
      }

      // If no new file uploaded, just throw error
      throw Error
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId)
    }

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export const deletePost = async (postId?: string, imageId?: string) => {
  if (!postId || !imageId) return

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    if (!statusCode) throw Error

    await deleteFile(imageId)

    return { status: 'Ok' }
  } catch (error) {
    console.log(error)
  }
}

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export const savePost = async (userId: string, postId: string) => {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )

    if (!statusCode) throw Error

    return { status: 'Ok' }
  } catch (error) {
    console.log(error)
  }
}

export const getUserPosts = async (userId?: string) => {
  if (!userId) return

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    )

    if (!post) throw Error

    return post
  } catch (error) {
    console.log(error)
  }
}

export const getRecentPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export const getUsers = async (limit?: number) => {
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

export const getUserById = async (userId: string) => {
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

export const updateUser = async (user: IUpdateUser) => {
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
