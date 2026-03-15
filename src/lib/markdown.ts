import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/limitless');

export type Insight = {
  id: string;
  date: string;
  tags: string[];
  content: string;
  dateObj: string;
};

export function getInsights(): Insight[] {
  if (!fs.existsSync(contentDirectory)) return [];
  
  const fileNames = fs.readdirSync(contentDirectory).filter(file => file.endsWith('.md'));
  
  const allInsights = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Provide default tags or parse them
    let tags = matterResult.data.tags || [];
    if (typeof tags === 'string') {
        const match = tags.match(/\[(.*?)\]/);
        if (match) {
            tags = match[1].split(',').map(t => t.trim());
        } else {
            tags = [tags];
        }
    }

    const dateStr = matterResult.data.date || id;
    
    // Combine the data with the id and content
    return {
      id,
      date: dateStr,
      dateObj: new Date(dateStr).toISOString(),
      tags,
      content: matterResult.content,
      ...matterResult.data,
    };
  });
  
  // Sort insights by date descending
  return allInsights.sort((a, b) => {
    if (new Date(a.dateObj) < new Date(b.dateObj)) {
      return 1;
    } else {
      return -1;
    }
  });
}
