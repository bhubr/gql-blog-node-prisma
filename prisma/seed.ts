import { PrismaClient, User, Post } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

/**
 * data payload for User entity
 */
interface IUserData {
  email: string;
  name: string;
  avatarUrl: string;
}

/**
 * data payload for Post entity
 */
 interface IPostData {
  title: string;
  content: string;
  authorId: number;
  published: boolean;
}


/**
 * post data payload from JSON Placeholder
 */
interface IFakePostData {
  id: number;
  userId: number;
  title: string;
  body: string;
}

/**
 * data payload from randomuser
 */
interface IRandomUser {
  name: {
    first: string,
    last: string
  };
  email: string;
  picture: {
    large: string;
  }
}

/**
 * Fetches posts from JSON Placeholder
 *
 * @param num number of users to generate
 * @returns {array} array of user payloads for insertion
 */
const fecthPosts = async (): Promise<IPostData[]> => {
  const { data: posts }: { data: IFakePostData[] } = await axios.get('https://jsonplaceholder.typicode.com/posts')
  return posts.map(({ body: content, title, userId: authorId }: IFakePostData) => ({
    title, content, authorId, published: true
  }));
}

/**
 * Converts randomuser.me object to our own user payload type
 *
 * @param user result object from randomuser.me
 * @returns {object} object payload for insertion in DB
 */
const mapRandomUserFields = (user: IRandomUser): IUserData => {
  const { name: { first, last }, email, picture: { large }} = user
  return {
    name: `${first} ${last}`,
    email,
    avatarUrl: large,
  }
}

/**
 * Fetches random users from randomuser.me
 *
 * @param num number of users to generate
 * @returns {array} array of user payloads for insertion
 */
const fecthRandomUsers = async (num = 10): Promise<IUserData[]> => {
  const { data: { results } } = await axios.get(`https://randomuser.me/api/?results=${num}`)
  return results.map(mapRandomUserFields);
}

/**
 * Insert many users into DB
 *
 * @param userData array of user payloads to insert
 * @returns array of users
 */
const insertUsers = async (userData: IUserData[]): Promise<User[]> => {
  await prisma.user.createMany({
    data: userData,
  })
  return prisma.user.findMany({})
}

/**
 * Insert many posts into DB
 *
 * @param postData array of post payloads to insert
 * @returns array of users
 */
 const insertPosts = async (postData: IPostData[]): Promise<Post[]> => {
  await prisma.post.createMany({
    data: postData,
  })
  return prisma.post.findMany({})
}

/**
 * Seeding process entry point
 */
const seed = async (): Promise<void> => {
  const randomUsers = await fecthRandomUsers()
  const insertedUsers = await insertUsers(randomUsers)
  const fakePosts = await fecthPosts()
  const insertedPosts = await insertPosts(fakePosts)
  console.log(insertedUsers, insertedPosts)
}

seed()