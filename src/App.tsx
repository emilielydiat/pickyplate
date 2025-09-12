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
  AddFromExistingFood,
  FoodEditor,
  EditAvatar,
  FriendProfile,
  Friends,
  Home,
  EatTogether,
  MealPriorities,
  MyFoodList,
  PickFriend,
  Profile,
  Requests,
  Settings,
  SharedFoodList,
  Signup,
  Login,
} from "./pages";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <FriendsProvider>
          <PageTitleProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute layout={<Layout />} />}>
                  <Route index element={<Home />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="friends" element={<Friends />} />
                  <Route path="friend/:friendId" element={<FriendProfile />} />
                  <Route path="friends/add-friend" element={<AddFriend />} />
                  <Route path="pick-friend" element={<PickFriend />} />

                  <Route
                    path="eat-together/:friendId"
                    element={<EatTogether />}
                  />

                  <Route path="my-food-list" element={<MyFoodList />} />
                  <Route
                    path="my-food-list/edit-food/:foodId"
                    element={<FoodEditor />}
                  />
                  <Route
                    path="my-food-list/create-food"
                    element={<FoodEditor />}
                  />
                  <Route
                    path="friend/:friendId/shared-food-list"
                    element={<SharedFoodList />}
                  />
                  <Route
                    path="friend/:friendId/shared-food-list/add-existing-food"
                    element={<AddFromExistingFood />}
                  />

                  <Route path="requests" element={<Requests />} />
                  <Route path="settings">
                    <Route index element={<Settings />} />
                    <Route
                      path="set-meal-priorities"
                      element={<MealPriorities />}
                    />
                  </Route>

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
