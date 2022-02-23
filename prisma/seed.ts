import { PrismaClient, User, Post, Comment } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

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
 * data payload for Post entity
 */
interface ICommentData {
  text: string;
  authorId: number;
  postId: number;
  approved: boolean;
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
 * comment data payload from JSON Placeholder
 */
interface IFakeCommentData {
  id: number;
  postId: number;
  body: string;
}

/**
 * data payload from randomuser
 */
interface IRandomUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
  };
}

/**
 * Fetches posts from JSON Placeholder
 *
 * @returns {array} array of post payloads for insertion
 */
const fecthPosts = async (): Promise<IPostData[]> => {
  const { data: posts }: { data: IFakePostData[] } = await axios.get(
    'https://jsonplaceholder.typicode.com/posts'
  );
  return posts.map(
    ({ body: content, title, userId: authorId }: IFakePostData) => ({
      title,
      content,
      authorId,
      published: true,
    })
  );
};

/**
 * Return random item from an array
 *
 * @param arr Array of elements
 * @returns random item from array
 */
function pick<T>(arr: Array<T>): T {
  const idx = Math.floor(arr.length * Math.random());
  return arr[idx];
}

/**
 * Fetches comments from JSON Placeholder
 *
 * @returns {array} array of comment payloads for insertion
 */
const fecthComments = async (): Promise<ICommentData[]> => {
  const users = await prisma.user.findMany({});
  const { data: comments }: { data: IFakeCommentData[] } = await axios.get(
    'https://jsonplaceholder.typicode.com/comments'
  );
  return comments.map(({ body: text, postId }: IFakeCommentData) => ({
    text,
    authorId: pick<User>(users).id,
    postId,
    approved: true,
  }));
};

/**
 * Converts randomuser.me object to our own user payload type
 *
 * @param user result object from randomuser.me
 * @returns {object} object payload for insertion in DB
 */
const mapRandomUserFields = (user: IRandomUser): IUserData => {
  const {
    name: { first, last },
    email,
    picture: { large },
  } = user;
  return {
    name: `${first} ${last}`,
    email,
    avatarUrl: large,
  };
};

/**
 * Fetches random users from randomuser.me
 *
 * @param num number of users to generate
 * @returns {array} array of user payloads for insertion
 */
const fecthRandomUsers = async (num = 10): Promise<IUserData[]> => {
  const {
    data: { results },
  } = await axios.get(`https://randomuser.me/api/?results=${num}`);
  return results.map(mapRandomUserFields);
};

/**
 * Insert many users into DB
 *
 * @param userData array of user payloads to insert
 * @returns array of users
 */
const insertUsers = async (userData: IUserData[]): Promise<User[]> => {
  await prisma.user.createMany({
    data: userData,
  });
  return prisma.user.findMany({});
};

/**
 * Insert many posts into DB
 *
 * @param postData array of post payloads to insert
 * @returns array of posts
 */
const insertPosts = async (postData: IPostData[]): Promise<Post[]> => {
  await prisma.post.createMany({
    data: postData,
  });
  return prisma.post.findMany({});
};

/**
 * Insert many comments into DB
 *
 * @param postData array of comment payloads to insert
 * @returns array of comments
 */
const insertComments = async (
  commentData: ICommentData[]
): Promise<Comment[]> => {
  await prisma.comment.createMany({
    data: commentData,
  });
  return prisma.comment.findMany({});
};

/**
 * Seeding process entry point
 */
const seed = async (): Promise<void> => {
  const randomUsers = await fecthRandomUsers();
  const users = await insertUsers(randomUsers);
  const fakePosts = await fecthPosts();
  const posts = await insertPosts(fakePosts);
  const fakeComments = await fecthComments();
  const comments = await insertComments(fakeComments);
  console.log(
    `Inserted ${users.length} users, ${posts.length} posts, ${comments.length} comments`
  );
};

seed();
