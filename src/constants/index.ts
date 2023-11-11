const sidebarLinks = [
  { imgURL: '/assets/icons/home.svg', route: '/', label: 'Home' },
  { imgURL: '/assets/icons/wallpaper.svg', route: '/explore', label: 'Explore' },
  { imgURL: '/assets/icons/people.svg', route: '/people', label: 'People' },
  { imgURL: '/assets/icons/bookmark.svg', route: '/saved', label: 'Saved' },
  { imgURL: '/assets/icons/gallery-add.svg', route: '/create-post', label: 'Create Post' },
]

const bottombarLinks = [
  { imgURL: '/assets/icons/home.svg', route: '/', label: 'Home' },
  { imgURL: '/assets/icons/wallpaper.svg', route: '/explore', label: 'Explore' },
  { imgURL: '/assets/icons/bookmark.svg', route: '/saved', label: 'Saved' },
  { imgURL: '/assets/icons/gallery-add.svg', route: '/create-post', label: 'Create' },
]

enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = 'createUserAccount',

  // USER KEYS
  GET_CURRENT_USER = 'getCurrentUser',
  GET_USERS = 'getUsers',
  GET_USER_BY_ID = 'getUserById',

  // POST KEYS
  GET_POSTS = 'getPosts',
  GET_INFINITE_POSTS = 'getInfinitePosts',
  GET_RECENT_POSTS = 'getRecentPosts',
  GET_POST_BY_ID = 'getPostById',
  GET_USER_POSTS = 'getUserPosts',
  GET_FILE_PREVIEW = 'getFilePreview',

  //  SEARCH KEYS
  SEARCH_POSTS = 'getSearchPosts',
}

export { sidebarLinks, bottombarLinks, QUERY_KEYS }
