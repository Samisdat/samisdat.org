import { Heading } from '@samisdat/ui-components/Heading';

import { faHand } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getAllPosts, getAllPublishedPosts } from '@/lib/posts';
import { PostCard } from '../components/PostCard';
import { NoNoNo } from '../components/NoNoNo';
import { YesYesYes } from '../components/YesYesYes';

export default async function Home() {
    const posts = process.env.NODE_ENV === 'development' ? getAllPosts() : getAllPublishedPosts();

    return (
        <>
            <Heading>
                <YesYesYes />
                <NoNoNo />
                <FontAwesomeIcon icon={faHand} />
                Hallo
            </Heading>
            {posts.map(post => (
                <PostCard key={post.slug} post={post} />
            ))}
        </>
    );
}
