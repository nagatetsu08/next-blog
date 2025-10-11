export type Post = {
  id: string,
  title: string,
  content: string,
  topImage: string | null
  createdAt: Date
  updatedAt: Date
  published: boolean
  author : {
    name: string
  }
}

// prpos定義用の型

// react + typescriptにおいて、パラメータ内のプロパティに型を当てはめる時はちょっと特殊。
// ❌ function PostCard(post: Post) → propsはオブジェクトを渡す必要がある。従って、コンポーネント関数にPostCard(post: Post)のようには渡せない
// ❌ function PostCard({post}: Post) → 一つオブジェクト（{}）を挟んでいるので、型が合わない
// ❌ function PostCard({post: Post}) → postというパラメータにPost型を突っ込むという型解釈以外の捉え方をされて、エラーとなる。
// ⭕️ function PostCard({ post }: { post: Post }) → こういう書き方になる（これをProps型というらしい）と覚えた方がいい。

// 以下の書き方は上記の書き方を使いまわしたり、簡潔に描けるように省略表記させるめに定義
export type PostCardProps = {post: Post}

// 例えば将来的にpropsが増える場合
// export type PostCardProps = {post: Post, onClick?: () => void, showAuthorIcon?: boolean}と変更して、
// 呼び出しもとでは、function PostCard({ post, onClick, showAuthorIcon }: PostCardProps) { ... }のようにできる。
