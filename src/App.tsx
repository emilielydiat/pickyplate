import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { PageTitleProvider } from "./context/PageTitleContext";
import { UserProvider } from "./context/UserContext";
import { FriendsProvider } from "./context/FriendsContext";

import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import { Layout } from "./components/Layout";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <FriendsProvider>
          <PageTitleProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  {routes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
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
