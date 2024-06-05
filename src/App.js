import { Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Library from "./pages/Library";
import AddBook from "./pages/AddBook";
import { useState } from "react";

function App() {
  const [tab, setTab] = useState("library");

  const updateTab = (tab) => {
    setTab(tab);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Container component="main" sx={{ paddingY: 3 }}>
        {tab === "addBook" ? (
          <AddBook updateTab={updateTab} />
        ) : (
          <Library updateTab={updateTab} />
        )}
      </Container>
    </Box>
  );
}

export default App;
