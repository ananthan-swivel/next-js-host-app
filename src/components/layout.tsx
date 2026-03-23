import { Inter } from "next/font/google";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.className}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Next.js Host App
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 200,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 200, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem button component="a" href="/">
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component="a" href="/users">
                <ListItemText primary="Users" />
              </ListItem>
              <ListItem button component="a" href="/sync-engine">
                <ListItemText primary="LogSyncEngine" />
              </ListItem>
              {/* Add more sidebar links here */}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </div>
  );
}
