import { useState, useMemo } from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticProps } from 'next';
import Head from 'next/head';

type Album = {
  slug: string;
  title: string;
  artist: string;
  year: number;
  ranking: number;
  cover: string;
  comment: string;
  tags: string[];
};

type Props = {
  albums: Album[];
};

const AlbumsPage = ({ albums }: Props) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = albums.flatMap((album) => album.tags);
    return Array.from(new Set(tags));
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return albums.filter(
      (album) =>
        (album.title.toLowerCase().includes(lowerQuery) ||
          album.artist.toLowerCase().includes(lowerQuery)) &&
        (selectedTag ? album.tags.includes(selectedTag) : true)
    );
  }, [albums, query, selectedTag]);

  return (
    <>
      <Head>
        <title>My Favorite Albums</title>
      </Head>
      <main className="px-6 py-8 max-w-4xl mx-auto min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6">🎵 My Top Albums</h1>

        {/* 🔍 検索バー */}
        <input
          type="text"
          placeholder="Search by title or artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-black dark:text-white 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 🏷️ タグボタン */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              selectedTag === null
                ? 'bg-blue-500 text-white border-2 border-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedTag === tag
                  ? 'bg-blue-500 text-white border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 🎨 アルバム一覧 */}
        <div className="space-y-6">
          {filteredAlbums.map((album) => (
            <Link
              key={album.slug}
              href={`/albums/${album.slug}`}
              className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                         rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-200"
            >
              <img
                src={album.cover}
                alt={album.title}
                className="w-40 h-40 object-cover flex-shrink-0"
              />
              <div className="p-4 flex flex-col justify-center">
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  #{album.ranking} - {album.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>{album.artist}</strong> ({album.year})
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {album.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const albumsDir = path.join(process.cwd(), 'content/albums');
  const filenames = fs.readdirSync(albumsDir);

  const albums: Album[] = filenames.map((filename) => {
    const filePath = path.join(albumsDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: filename.replace(/\.mdx?$/, ''),
      title: data.title,
      artist: data.artist,
      year: data.year,
      ranking: data.ranking,
      cover: data.cover,
      comment: content,
      tags: data.tags || [],
    };
  });

  albums.sort((a, b) => a.ranking - b.ranking);

  return {
    props: {
      albums,
    },
  };
};

export default AlbumsPage;

