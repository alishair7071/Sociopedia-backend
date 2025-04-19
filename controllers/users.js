import userModel from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};


export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id from params: "+ id);
    const user = await userModel.findById(id);
    console.log("user: "+ user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const friends = await Promise.all(
      user.friends.map((id) => userModel.findById(id))
    );

    console.log(friends);

    const formattedFriends = friends
      .filter(friend => friend !== null)
      .map(({ _id, firstName, lastName, occupation, location, picturePath, imageUrl }) => {
        return { _id, firstName, lastName, occupation, location, picturePath, imageUrl };
      });

    res.status(200).json(formattedFriends);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};


export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await userModel.findById(id);
    const friend = await userModel.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((Id) => Id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();
    const friends = await Promise.all(
      user.friends.map((id) => userModel.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);

  } catch (e) {
    res.status(500).json({ msg: e.message });
    console.log("errorrrrrrrrrrrrrrrrrrrrr:  "+ e.message);
  }
};
