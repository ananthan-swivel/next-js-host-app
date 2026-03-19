import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect } from 'react';

const dummyUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

export default function UserPage() {
  useEffect(() => {
    // Check if cookie exists
    if (!document.cookie.split('; ').find(row => row.startsWith('testingcoote='))) {
      // Generate UUID
      const uuid = crypto.randomUUID ? crypto.randomUUID() : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
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
