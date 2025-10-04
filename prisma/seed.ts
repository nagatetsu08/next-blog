import * as bcrypt from 'bcryptjs'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // クリーンアップ
  await prisma.user.deleteMany()
  await prisma.post.deleteMany()

  // パスワード暗号化
  const hasedPassword = await bcrypt.hash('password123', 12)

  //ダミー画像URL
  const dummyImages = [ 
    'https://picsum.photos/seed/post1/600/400', // ダミー画像
    'https://picsum.photos/seed/post2/600/400' 
  ]
  
  // ユーザ作成
  const User = await prisma.user.create({
    data: {
      email:    'test@example.com',
      name:     'Testuser',
      password: hasedPassword,
      posts: {
        create: [
          { 
            title: 'はじめてのブログ投稿',
            content: 'これは最初のブログ投稿です。Next.jsとPrismaでブログを作成しています。',
            topImage: dummyImages[0],
            published: true,
          },
          { 
            title: '2番目の投稿',
            content: 'ブログの機能を少しずつ追加していきます。認証機能やダッシュボードなども実装予定です。',
            topImage: dummyImages[1],
            published: true,
          }
        ]
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // 処理完了後 or 失敗後にDBとの接続を切る切る 
    await prisma.$disconnect()
  })