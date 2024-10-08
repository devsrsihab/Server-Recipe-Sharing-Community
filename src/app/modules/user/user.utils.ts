import { IName } from './user.interface';
import { User } from './user.model';

//==============Admin Id Generate===============
// last admin
const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })

    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};

// userData.id = generateRandomId();
export const generatAdminId = async () => {
  // first time 0
  let currentid = (0).toString();
  // last student id
  const lastAdminId = await findLastAdminId(); //A-0001

  if (lastAdminId) {
    currentid = lastAdminId; // if exist last faculty the  the is assign to currentid
  }

  let incrementId = (Number(currentid.substring(2)) + 1).toString().padStart(4, '0');
  incrementId = `A-${incrementId}`;
  return incrementId; // A-0001++
};

//==============User Id generate===============
// last lastFaculty
const findLastUserId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'user',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })

    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};

// userData.id = generateRandomId();
export const generatUserId = async () => {
  // first time 0
  let currentid = (0).toString();
  // last student id
  const lastUserId = await findLastUserId(); //A-0001

  if (lastUserId) {
    currentid = lastUserId; // if exist last faculty the  the is assign to currentid
  }

  let incrementId = (Number(currentid.substring(2)) + 1).toString().padStart(4, '0');
  incrementId = `U-${incrementId}`;
  return incrementId; // A-0001++
};

// generate username
export const generateUsername = async (name: IName) => {
  let username = `${name.firstName.toLowerCase()}${name.lastName.toLowerCase()}`;
  // check if the username is already taken
  const user = await User.findOne({ username });
  if (user) {
    // if taken, add a random number between 1000 and 9999 to the end
    username += Math.floor(Math.random() * 9000) + 1000;
  }
  return username;
};
