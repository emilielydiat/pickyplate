import { render, screen, waitFor, within } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactElement } from "react";
import theme from "../theme";

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>,
    options,
  );
}

export { customRender as render, screen, waitFor, within };
