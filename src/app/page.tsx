import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { getLatestPosts } from '@/lib/posts';

export default function Home() {
  const posts = getLatestPosts(10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Willkommen zu meinem Blog
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Die neuesten {posts.length} Artikel
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {posts.map((post) => (
          <Card key={post.slug} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {post.title}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={formatDate(post.date)} 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={post.author} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
              <Typography color="text.secondary">
                {post.content.substring(0, 150)}...
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
