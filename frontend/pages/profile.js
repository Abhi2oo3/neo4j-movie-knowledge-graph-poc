import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { 
  Box, 
  Toolbar, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  Button, 
  TextField, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Badge,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useState } from 'react';

export default function Profile() {
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    role: 'Admin',
    avatar: '/api/placeholder/150/150',
    bio: 'Movie enthusiast and data analyst with a passion for discovering hidden gems in cinema.',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
      emailUpdates: true,
      privacyMode: false
    },
    stats: {
      moviesWatched: 247,
      reviewsWritten: 89,
      listsCreated: 12,
      followers: 156
    }
  });

  const [formData, setFormData] = useState(userData);

  const handleSave = () => {
    setUserData(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
  };

  const recentActivity = [
    { id: 1, action: 'Watched "The Shawshank Redemption"', time: '2 hours ago', type: 'watch' },
    { id: 2, action: 'Added "Pulp Fiction" to favorites', time: '1 day ago', type: 'favorite' },
    { id: 3, action: 'Wrote a review for "Fight Club"', time: '3 days ago', type: 'review' },
    { id: 4, action: 'Created list "Best Thrillers"', time: '1 week ago', type: 'list' },
    { id: 5, action: 'Followed director Christopher Nolan', time: '1 week ago', type: 'follow' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'watch': return <MovieIcon />;
      case 'favorite': return <FavoriteIcon />;
      case 'review': return <StarIcon />;
      case 'list': return <TrendingUpIcon />;
      case 'follow': return <PersonIcon />;
      default: return <HistoryIcon />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'watch': return '#003366';
      case 'favorite': return '#FF6699';
      case 'review': return '#FFD700';
      case 'list': return '#00AEEF';
      case 'follow': return '#FFBB28';
      default: return '#666';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        
        <Box sx={{ p: 3 }}>
          {/* Profile Header */}
          <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                      onClick={() => setOpenDialog(true)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={userData.avatar}
                    sx={{ width: 120, height: 120, fontSize: '3rem' }}
                  >
                    {userData.name.charAt(0)}
                  </Avatar>
                </Badge>
              </Grid>
              
              <Grid item xs>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" sx={{ mr: 2, fontWeight: 600 }}>
                    {userData.name}
                  </Typography>
                  <Chip label={userData.role} color="primary" size="small" />
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {userData.email}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {userData.bio}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">{userData.stats.moviesWatched}</Typography>
                      <Typography variant="body2" color="text.secondary">Movies Watched</Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">{userData.stats.reviewsWritten}</Typography>
                      <Typography variant="body2" color="text.secondary">Reviews</Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">{userData.stats.listsCreated}</Typography>
                      <Typography variant="body2" color="text.secondary">Lists</Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">{userData.stats.followers}</Typography>
                      <Typography variant="body2" color="text.secondary">Followers</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item>
                <Button
                  variant={editMode ? "outlined" : "contained"}
                  startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                  onClick={editMode ? handleCancel : () => setEditMode(true)}
                  sx={{ mr: 1 }}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
                {editMode && (
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<SettingsIcon />} label="Settings" />
              <Tab icon={<HistoryIcon />} label="Activity" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {editMode ? (
                      <Box>
                        <TextField
                          fullWidth
                          label="Name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Name:</strong> {userData.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Email:</strong> {userData.email}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Role:</strong> {userData.role}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Bio:</strong> {userData.bio}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Account Statistics
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                          <MovieIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="h4">{userData.stats.moviesWatched}</Typography>
                          <Typography variant="body2">Movies Watched</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                          <StarIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="h4">{userData.stats.reviewsWritten}</Typography>
                          <Typography variant="body2">Reviews Written</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                          <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="h4">{userData.stats.listsCreated}</Typography>
                          <Typography variant="body2">Lists Created</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
                          <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="h4">{userData.stats.followers}</Typography>
                          <Typography variant="body2">Followers</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {tab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Preferences
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PaletteIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Theme" 
                          secondary="Choose your preferred theme"
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={userData.preferences.theme}
                            onChange={(e) => setUserData({
                              ...userData,
                              preferences: { ...userData.preferences, theme: e.target.value }
                            })}
                          >
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                            <MenuItem value="auto">Auto</MenuItem>
                          </Select>
                        </FormControl>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <LanguageIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Language" 
                          secondary="Select your preferred language"
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={userData.preferences.language}
                            onChange={(e) => setUserData({
                              ...userData,
                              preferences: { ...userData.preferences, language: e.target.value }
                            })}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Spanish</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                          </Select>
                        </FormControl>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <NotificationsIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Push Notifications" 
                          secondary="Receive notifications for new releases"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={userData.preferences.notifications}
                            onChange={(e) => setUserData({
                              ...userData,
                              preferences: { ...userData.preferences, notifications: e.target.checked }
                            })}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <VisibilityIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Privacy Mode" 
                          secondary="Hide your activity from other users"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={userData.preferences.privacyMode}
                            onChange={(e) => setUserData({
                              ...userData,
                              preferences: { ...userData.preferences, privacyMode: e.target.checked }
                            })}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Security
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      sx={{ mb: 2 }}
                    >
                      Change Password
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      sx={{ mb: 2 }}
                    >
                      Enable Two-Factor Authentication
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<SecurityIcon />}
                    >
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {tab === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {recentActivity.map((activity) => (
                    <ListItem key={activity.id} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ 
                          bgcolor: getActivityColor(activity.type),
                          width: 32,
                          height: 32
                        }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={activity.time}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* Avatar Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Upload a new profile picture to personalize your account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
