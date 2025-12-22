import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
    slug: string;
    title: string;
    date: string;
    author: string;
    content: string;
}

export function getAllPosts(): Post[] {
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames.map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title,
            date: data.date,
            author: data.author,
            content,
        };
    });

    return allPostsData.sort((a, b) => {
        if (new Date(a.date) < new Date(b.date)) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getLatestPosts(limit: number = 10): Post[] {
    const allPosts = getAllPosts();
    return allPosts.slice(0, limit);
}
