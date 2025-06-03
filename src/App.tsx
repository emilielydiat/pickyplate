import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { PageTitleProvider } from "./context/PageTitleContext";
import { UserProvider } from "./context/UserContext";
import { FriendsProvider } from "./context/FriendsContext";

import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
  AddFriend,
  AddFromExistingFoodPage,
  CreateFood,
  CreateFoodConfirm,
  FoodFlowWrapper,
  EditAvatar,
  FriendProfile,
  Friends,
  Home,
  MealPreferences,
  MealPreferencesConfirm,
  MealPreferencesFlowWrapper,
  MyFoodListPage,
  PickFriend,
  Profile,
  Requests,
  Settings,
  SharedFoodListPage,
} from "./pages";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <FriendsProvider>
          <PageTitleProvider>
            <Router>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="friends" element={<Friends />} />
                  <Route path="friend/:friendId" element={<FriendProfile />} />
                  <Route path="friends/add-friend" element={<AddFriend />} />
                  <Route path="pick-friend" element={<PickFriend />} />

                  <Route
                    path="eat-together/:friendId"
                    element={<MealPreferencesFlowWrapper />}
                  >
                    <Route
                      path="meal-preferences"
                      element={<MealPreferences />}
                    />
                    <Route
                      path="meal-preferences/confirm"
                      element={<MealPreferencesConfirm />}
                    />
                  </Route>

                  <Route path="my-food-list" element={<MyFoodListPage />} />
                  <Route
                    path="friend/:friendId/shared-food-list"
                    element={<SharedFoodListPage />}
                  />

                  <Route
                    path="my-food-list/create-food"
                    element={<FoodFlowWrapper />}
                  >
                    <Route index element={<CreateFood />} />
                    <Route path="confirm" element={<CreateFoodConfirm />} />
                  </Route>

                  <Route
                    path="friend/:friendId/shared-food-list/add-existing-food"
                    element={<AddFromExistingFoodPage />}
                  />

                  <Route
                    path="friend/:friendId/shared-food-list/create-food"
                    element={<FoodFlowWrapper />}
                  >
                    <Route index element={<CreateFood />} />
                    <Route path="confirm" element={<CreateFoodConfirm />} />
                  </Route>

                  <Route path="requests" element={<Requests />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="edit-avatar" element={<EditAvatar />} />
                </Route>
              </Routes>
            </Router>
          </PageTitleProvider>
        </FriendsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
