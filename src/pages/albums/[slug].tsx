import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

type Album = {
  slug: string;
  title: string;
  artist: string;
  year: number;
  ranking: number;
  cover: string;
  comment: string;
};

type Props = {
  album: Album;
};

const AlbumDetailPage = ({ album }: Props) => {
  return (
    <>
   <Head>
  <title>{`${album.title} | Album Detail`}</title>
</Head>
      <main style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
        <h1>{album.title}</h1>
        <img src={album.cover} alt={album.title} style={{ width: '200px' }} />
        <p><strong>Artist:</strong> {album.artist}</p>
        <p><strong>Year:</strong> {album.year}</p>
        <p><strong>Ranking:</strong> {album.ranking}</p>
        <hr />
        <div>{album.comment}</div>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const albumsDir = path.join(process.cwd(), 'content/albums');
  const filenames = fs.readdirSync(albumsDir);

  const paths = filenames.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, '');
    return { params: { slug } };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), 'content/albums', `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const album: Album = {
    slug,
    title: data.title,
    artist: data.artist,
    year: data.year,
    ranking: data.ranking,
    cover: data.cover,
    comment: content,
  };

  return {
    props: {
      album,
    },
  };
};

export default AlbumDetailPage;

