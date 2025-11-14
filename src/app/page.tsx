import PageContent from "./page-content";
export default function Home() {
  return <PageContent />;

  /*
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Item>size=8</Item>
        </Grid>
        <Grid size={4}>
          <Item>size=4</Item>
        </Grid>
        <Grid size={4}>
          <Item>size=4</Item>
        </Grid>
        <Grid size={8}>
          <Item>size=8</Item>
        </Grid>
      </Grid>
      <p>Who loves code may code something lovable — or die tryin’.</p>
      <PanoramaWrapper />
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Willkommen zu meinem Blog
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Die neuesten {posts.length} Artikel
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        {posts.map((post) => (
          <Card
            key={post.slug}
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
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
                <Chip label={post.author} size="small" variant="outlined" />
              </Box>
              <Typography color="text.secondary">
                {post.content.substring(0, 150)}...
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );*/
}
