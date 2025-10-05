'use client'
import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"; // ルーティングは必ずこのnexe/navigationのものを使う

// Client側でインタラクティブかつリアクティブ（ユーザーが入力したら反応する）のようにしたいので、ヘッダーコンポーネントから切り離すかつクライアントコンポーネント化させる
export default function SearchBox() {
  const [ search, setSearch ] = useState("");
  const [ debouncedSearch, setDebouncedSearch] = useState('')
  const router = useRouter();

  // デバウンス処理
  // onChangeは何かしら文字を入力する都度検索がかかる。これだと負荷が高いし、文字が完成する前に検索をかけてもあまり意味がない
  // 従って、数秒程度でイベントが発火されるようにuseEffectを使って、delayのような処理を実装する。

  // 2つの変数に分けて処理をしている理由
  // searchの方はリアルタイムで動いてしまうので、「数秒前の検索ワードで検索する」という動きをsearchだけだと実現できない。
  // debouncedSearchというState変数をもう一つ用意することで、0.5秒前のキーワードを保持する　→ それを使って検索をかける　→ その間searchは次の入力を受けられる（受けたとしても検索結果に問題がでない）
  // という状態を作り出すことができる。


  // searchを監視して、更新されたらsetDebouncedSearchを動かす
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500);

    //これはsetTimeoutを使った際のお作法
    return () => clearTimeout(timer)
  }, [search])

  // debouncedSearchが更新されたら実行

  // 2つ目のuseEffectでrouterも監視対象（[debouncedSearch, router]）に加えている理由は、
  // Next.jsのuseRouter()が返すrouterインスタンスが「たまに再生成される可能性があるため、依存関係として正しく監視し、副作用内で常に最新のrouterを使うため」です。
  // useRouterが返す値が、オブジェクトの参照型であるため

  // 詳細解説
  // ReactのuseEffect依存配列には、副作用内で使うすべての外部値・参照を入れるのがベストプラクティスです。
  // useRouter()が返すrouterインスタンスがコンポーネントの再レンダリングや状態変化によって再生成（参照が変わる）可能性があるため。（その時は問題なくても後々問題が出てくる可能性があるため）
  // 依存配列に加えておくことで、「routerインスタンス自体が変化した時も副作用（画面遷移）が正しく反応」するようになります。
  // 実際にはrouterインスタンスが変わることは少ないですが、コードの正確性やTypeScriptの警告を防止する目的もあり、
  // Next.jsの公式サンプルや多くの実装例で「依存にrouterを必ず含める」スタイルが推奨されています。（つまりは際レンダリング時の予防）


  // Q.どういうものを監視対象にするべき？
  // A.その変数がuseEffectの外部にあり、副作用内で参照していて、かつ値が変化する可能性がある場合は、依存配列に加えるべき
  //   たとえば、props, state, context, フックの戻り値など。
  //   逆に加えなくていいのは、「useEffect関数の内部で宣言して使うローカル変数」や毎回新規で作成される値とか定数

  // // 例A: 外部で宣言され、値が変化しうる場合
  // const externalValue = ... // propsから渡される, stateやcontext
  // useEffect(() => {
  //   // externalValue を使う
  // }, [externalValue]); // 監視対象

  // // 例B: useEffect内部でのみ使う定数・一時変数
  // useEffect(() => {
  //   const temp = 123 // これは依存に加えなくてよい
  //   // temp を使う
  // }, []);

  useEffect(() => {
    if(debouncedSearch.trim()) {
      // (public)/に対して、リクエストパラメータ：searchを付与して遷移する。
      router.push(`/?search=${debouncedSearch.trim()}`)
    } else {
      router.push('/')
    }
  }, [debouncedSearch, router])

  return (
    <>
      <Input
        placeholder="記事を検索"
        className="w-[200px] lg:w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  )
}
