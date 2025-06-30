import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Link from 'next/link';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import TagIcon from '@mui/icons-material/Tag';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const menu = [
  { text: 'Dashboard', icon: <MovieIcon />, href: '/' },
  { text: 'Movies', icon: <MovieIcon />, href: '/movies' },
  { text: 'Actors', icon: <PeopleIcon />, href: '/actors' },
  { text: 'Genres', icon: <CategoryIcon />, href: '/genres' },
  { text: 'Keywords', icon: <TagIcon />, href: '/keywords' },
  { text: 'Graph Explorer', icon: <ShareIcon />, href: '/graph-explorer' },
];

export default function Sidebar() {
  return (
    <Drawer variant="permanent" sx={{ width: 220, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box' } }}>
      <Toolbar />
      <List>
        {menu.map((item) => (
          <Link href={item.href} key={item.text} passHref legacyBehavior>
            <ListItem button component="a">
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
        <ListItem button component={Link} href="/search">
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Search" />
        </ListItem>
        
        <ListItem button component={Link} href="/watchlist">
          <ListItemIcon><BookmarkIcon /></ListItemIcon>
          <ListItemText primary="Watchlist" />
        </ListItem>
        
        <ListItem button component={Link} href="/analytics">
          <ListItemIcon><ShowChartIcon /></ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        
        <ListItem button component={Link} href="/profile">
          <ListItemIcon><AccountCircleIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Drawer>
  );
}
