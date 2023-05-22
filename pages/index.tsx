import { unstable_cache } from "next/cache";
import Link from "next/link";

// getStaticProps errors with
// Error: Invariant: incrementalCache missing in unstable_cache
export async function getServerSideProps() {
  let data = await unstable_cache(
    async () => {
      return {
        res: await (
          await fetch("https://639040c665ff4183110d7bdd.mockapi.io/blogs")
        ).json(),
      };
    },
    undefined,
    {
      tags: ["links"],
    }
  )();

  return {
    props: {
      links: data.res,
    },
  };
}

export default function Home({ links }: any) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <ul>
        {links &&
          links.map((link: any, indx: any) => {
            return (
              <li key={indx}>
                <Link href={`/article/${link.id}`}>{link.title}</Link>
              </li>
            );
          })}
      </ul>
    </main>
  );
}
