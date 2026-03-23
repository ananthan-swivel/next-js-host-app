"use client";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useEffect } from "react";

const dummyUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
];

export default function UserPage() {
  useEffect(() => {
    // Check if cookie exists
    if (
      !document.cookie
        .split("; ")
        .find((row) => row.startsWith("testingcoote="))
    ) {
      // Generate UUID
      const uuid = crypto.randomUUID
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
      // Set cookie
      document.cookie = `testingcoote=${uuid}; path=/;`;
    }
  }, []);

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {dummyUsers.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
