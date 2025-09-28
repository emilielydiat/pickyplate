import emptyMyFoodListImage from "../assets/empty-states/my-food-list-empty.png";
import emptySharedFoodListImage from "../assets/empty-states/shared-food-list-empty.png";
import emptyFriendsImage from "../assets/empty-states/friends-empty.png";
import emptyPickAFriendImage from "../assets/empty-states/pick-a-friend-empty.png";
import emptyAddFriendImage from "../assets/empty-states/add-friend-empty.png";
import emptyMealRequestsImage from "../assets/empty-states/meal-requests-empty.png";
import emptyFriendRequestsImage from "../assets/empty-states/friend-requests-empty.png";

export const emptyStateImages = {
  myFoodList: emptyMyFoodListImage,
  sharedFoodList: emptySharedFoodListImage,
  friends: emptyFriendsImage,
  pickAFriend: emptyPickAFriendImage,
  addFriend: emptyAddFriendImage,
  mealRequests: emptyMealRequestsImage,
  friendRequests: emptyFriendRequestsImage,
} as const;
