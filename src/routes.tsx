import {
  Home,
  Profile,
  Friends,
  FriendProfile,
  AddFriend,
  PickFriend,
  MealPreferencesPage,
  MyFoodListPage,
  SharedFoodListPage,
  CreateFoodPage,
  AddFromExistingFoodPage,
  Requests,
  Settings,
  EditAvatar,
} from "./pages";

type AppRoute = {
  path: string;
  element: JSX.Element;
  children?: object[];
};

export const routes: AppRoute[] = [
  { path: "/", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/friends", element: <Friends /> },
  { path: "/friend/:friendId", element: <FriendProfile /> },
  { path: "/friends/add-friend", element: <AddFriend /> },
  { path: "/pick-friend", element: <PickFriend /> },
  {
    path: "/eat-together/:friendId/meal-preferences",
    element: <MealPreferencesPage />,
  },
  { path: "/my-food-list", element: <MyFoodListPage /> },
  {
    path: "/friend/:friendId/shared-food-list",
    element: <SharedFoodListPage />,
  },
  {
    path: "/my-food-list/create-food",
    element: <CreateFoodPage />,
  },
  {
    path: "/friend/:friendId/shared-food-list/add-existing-food",
    element: <AddFromExistingFoodPage />,
  },
  {
    path: "/friend/:friendId/shared-food-list/create-food",
    element: <CreateFoodPage />,
  },
  { path: "/requests", element: <Requests /> },
  { path: "/settings", element: <Settings /> },
  {
    path: "/edit-avatar",
    element: <EditAvatar />,
  },
];
