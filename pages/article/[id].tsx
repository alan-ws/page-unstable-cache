import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { unstable_cache } from "next/cache";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    if (ctx.params === undefined)
      return {
        notFound: true,
      };
    if (typeof ctx.params.id !== "string")
      return {
        notFound: true,
      };
    const articles = await unstable_cache(
      // no idea if this is right
      async (ctx: GetServerSidePropsContext) => {
        console.log("we are in unstable cache");
        return {
          content: await (
            await fetch(
              `https://639040c665ff4183110d7bdd.mockapi.io/blogs/${
                ctx.params!.id
              }`
            )
          ).json(),
        };
      },
      [ctx.params!.id],
      {
        tags: ["article", ctx.params.id],
      }
    )(ctx); // no idea if I need to pass in the ctx
    return { props: { content: articles.content } };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
}

// no getStaticProps because:
// Error: Invariant: incrementalCache missing in unstable_cache
// export async function getStaticPaths() {
//   const data = await (
//     await fetch(`https://639040c665ff4183110d7bdd.mockapi.io/blogs`)
//   ).json();
//   const paths = data.map((d: any) => ({
//     params: { id: d.id },
//   }));
//   return { paths, fallback: "blocking" };
// }

export default function Article({ content }: any) {
  return (
    <main>
      {content && (
        <div>
          <h1>{content.title}</h1>
          <p>{content.body}</p>
        </div>
      )}
    </main>
  );
}
