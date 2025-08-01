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
  CreateFood,
  CreateFoodConfirm,
  FoodFlowWrapper,
  EditAvatar,
  EditFood,
  EditFoodConfirm,
  FriendProfile,
  Friends,
  Home,
  MealPreferences,
  MealPreferencesConfirm,
  MealPreferencesFlowWrapper,
  MyFoodList,
  PickFriend,
  Profile,
  Requests,
  SubmitRating,
  MealRatingFlowWrapper,
  ViewResults,
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

                  <Route path="eat-together/:friendId">
                    <Route element={<MealPreferencesFlowWrapper />}>
                      <Route
                        path="meal-preferences"
                        element={<MealPreferences />}
                      />
                      <Route
                        path="meal-preferences/confirm"
                        element={<MealPreferencesConfirm />}
                      />
                    </Route>

                    <Route element={<MealRatingFlowWrapper />}>
                      <Route path="submit-rating" element={<SubmitRating />} />
                      <Route path="view-results" element={<ViewResults />} />
                    </Route>
                  </Route>

                  <Route path="my-food-list" element={<FoodFlowWrapper />}>
                    <Route index element={<MyFoodList />} />
                    <Route path="edit-food/:foodId" element={<EditFood />} />
                    <Route
                      path="edit-food/:foodId/confirm"
                      element={<EditFoodConfirm />}
                    />
                    <Route path="create-food" element={<CreateFood />} />
                    <Route
                      path="create-food/confirm"
                      element={<CreateFoodConfirm />}
                    />
                  </Route>

                  <Route
                    path="friend/:friendId/shared-food-list"
                    element={<FoodFlowWrapper />}
                  >
                    <Route index element={<SharedFoodList />} />
                    <Route path="edit-food/:foodId" element={<EditFood />} />
                    <Route
                      path="edit-food/:foodId/confirm"
                      element={<EditFoodConfirm />}
                    />
                    <Route path="create-food" element={<CreateFood />} />
                    <Route
                      path="create-food/confirm"
                      element={<CreateFoodConfirm />}
                    />
                    <Route
                      path="add-existing-food"
                      element={<AddFromExistingFood />}
                    />
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
