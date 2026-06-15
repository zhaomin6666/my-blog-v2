import { blogService, type BlogPost, type BlogPostMeta } from "@/lib/blog";
import type { AgentKnowledgeItem } from "../agentDemoTypes";
import { scoreTextMatch, stripMarkdown, truncateText } from "./textUtils";

function blogMetaToKnowledgeItem(post: BlogPostMeta, score = 0): AgentKnowledgeItem {
  const tags = post.tags.length ? `Tags: ${post.tags.join(", ")}` : "Tags: none";
  const series = post.series ? `Series: ${post.series}` : "Series: none";

  return {
    source: {
      type: "blog",
      title: post.title,
      url: `/blog/${post.slug}`,
      excerpt: truncateText(post.summary),
    },
    context: [
      `Blog: ${post.title}`,
      `Summary: ${post.summary}`,
      tags,
      series,
      `Language: ${post.lang}`,
    ].join("\n"),
    score,
  };
}

function fullPostToKnowledgeItem(post: BlogPost): AgentKnowledgeItem {
  const excerpt = truncateText(stripMarkdown(post.rawContent), 360);

  return {
    source: {
      type: "blog",
      title: post.title,
      url: `/blog/${post.slug}`,
      excerpt,
    },
    context: [
      `Blog: ${post.title}`,
      `Summary: ${post.summary}`,
      `Excerpt: ${excerpt}`,
      post.tags.length ? `Tags: ${post.tags.join(", ")}` : "Tags: none",
      post.series ? `Series: ${post.series}` : "Series: none",
    ].join("\n"),
    score: 10,
  };
}

export async function searchBlogPosts(
  query: string,
  limit = 3,
): Promise<AgentKnowledgeItem[]> {
  const posts = await blogService.getPublishedPosts();

  return posts
    .map((post) => ({
      post,
      score: scoreTextMatch(query, [
        post.title,
        post.summary,
        post.tags.join(" "),
        post.series ?? "",
        post.slug,
      ]),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post, score }) => blogMetaToKnowledgeItem(post, score));
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<AgentKnowledgeItem | null> {
  const post = await blogService.getPublishedPostBySlug(slug);
  if (!post) return null;

  return fullPostToKnowledgeItem(post);
}

export async function getRecentBlogPosts(limit = 3): Promise<AgentKnowledgeItem[]> {
  const posts = await blogService.getPublishedPosts({ limit });
  return posts.map((post) => blogMetaToKnowledgeItem(post));
}
