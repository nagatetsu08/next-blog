
import { prisma } from "@/lib/prisma";


// 全件取得
export async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true},
    include: {
      author: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// 1件取得
export async function getPost(id: string) {
  return await prisma.post.findUnique({
    where: {id},
    include: {
      author: {
        select: {
          name: true
        },
      },
    }
  });
}

// 検索キーワードによってインタラクティブに検索して返す
export async function searchPosts(search: string) {
  // 全角スペースを半角スペースに変換しつつスペースで分割 (空文字などを除外)
  const decodedSearch = decodeURIComponent(search)
  const normalizedSearch = decodedSearch.replace(/[\s ]+/g, ' ').trim()
  const searchWords = normalizedSearch.split(' ').filter(Boolean)

  const filters = searchWords.map( word =>({
    OR: [
      { title: { contains: word }}, 
      { content: { contains: word }}, 
    ]
  }))

  return await prisma.post.findMany({
    // filtersで1キーワードごとに整備したやつ（title in ('キーワード') or content in ('キーワード')）をANDでくっつけていく
    where: {
      AND: filters
    },
    include: {
      author: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

}