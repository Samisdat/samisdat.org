export interface Frontmatter {
  title: string;
  date: Date;
  published: boolean;
  description?: string;
  image?: true | string;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  source: string;
}
