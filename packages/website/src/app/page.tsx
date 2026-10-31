import { getAllPosts, getAllPublishedPosts } from '@/lib/posts';

import { PostCard } from '../components/PostCard';

export default async function Home() {
    const posts = process.env.NODE_ENV === 'development' ? getAllPosts() : getAllPublishedPosts();

    return (
        <>
            {posts.map(post => (
                <PostCard
                    key={post.slug}
                    post={post}
                />
            ))}
        </>
    );
}
