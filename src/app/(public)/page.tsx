import { getPosts, searchPosts } from "@/lib/post"
import PostCard from "@/components/post/PostCard"
import { Post } from "@/types/post"

// Next15以降は動的パラメータやURL、リクエストパラメータは全てPromise型で返ってくることになった。
// そのため、以下（searchProps）のようにProps型を作ってやったほうが見やすい。
// なお、引数時の型の形（{params}: {params: paramsの型}）はNext14より前から変わっていない

// indexとか動的パラメータじゃない時
// {params}: {params: paramsの型}
// 動的パラメータ、URLパラメータの時
// {params}: {params: Promise<paramsの型>}

type SearchParams = {
  search?: string
}

type searchProps = {searchParams: Promise<SearchParams>}

export default async function PostsPage({searchParams} : searchProps) {
// export default async function PostsPage({searchParams}: {searchParams: Promise<SearchParams>}){

  const resolveSearchParams = await searchParams;
  const query = resolveSearchParams.search || ''

  const posts = query 
  ? await searchPosts(query) as Post[]
  : await getPosts() as Post[]
  // const posts = await getPosts() as Post[] // 型アサーションでPostの配列型として強制している。つまり値がなくてもPosts[]が返ってくる。（nullpointerにならない）
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* 画面の横幅によって横1行に表示するカードの数を変えている。gapはグリッドアイテム間の縦・横間隔間隔（gap-6で1.5rem）  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            return <PostCard
              key={post.id}
              post={post} 
            />
          })}
          {/* アロー関数のあとが()の場合はreturnを省略できる（=1行で書ける） */}
          {/* {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post} 
            />
          ))} */}
        </div>
      </div>
    </>
  )
}
