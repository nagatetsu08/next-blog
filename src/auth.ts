import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma'; 
import bcryptjs from 'bcryptjs';

// ユーザー取得関数
async function getUser(email: string) {
  return await prisma.user.findUnique({
    where: { email: email }
  })
}

// NextAuth(authConfig)という書き方でもOK。
// ただ、{...authConfig}というふうにスプレッドでわざわざ展開している場合は
// あとで渡す引数を柔軟に追加できるというメリットがある。（{...authConfig, addParam}）みたいな感じで
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    // 公式サイトのものはVercelを使ったものになっているのでprisma仕様のものに変える。
    Credentials({
      async authorize(credentials) {
        // zodによるバリデーション
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email); // ユーザー取得
          if (!user) return null;
          const passwordsMatch = await bcryptjs.compare(password, user.password); // パスワード比較
          if (passwordsMatch) return user;
        }
        return null;
      }
    })
  ],
});