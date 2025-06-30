import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

export default function ModernKPI({ title, value, icon, color, trend, trendDir }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, boxShadow: 3, borderRadius: 3, minWidth: 220 }}>
      <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" color="text.primary">{value}</Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="caption" color={trendDir === 'up' ? 'success.main' : 'error.main'}>
              {trendDir === 'up' ? '▲' : '▼'} {trend}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
