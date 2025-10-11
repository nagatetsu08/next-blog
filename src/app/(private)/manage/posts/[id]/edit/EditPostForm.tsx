// Form送信で使うuseActionStateはクライアントコンポーネントでしか使えない。（SSC）
// ただEditFormはDBから既存データを取得して表示することが一般的で、これはサーバーコンポーネント扱いになる（SSR）
// 一つのtsxファイル内で同時にサーバーコンポーネントとクライアントコンポーネントを定義できないので、ファイルを分けてインポートする形で
// 分割して使う

'use client'

import { useState, useActionState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import TextareaAutosize from "react-textarea-autosize";
import "highlight.js/styles/github.css"; // コードハイライト用のスタイル
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { updatePost } from "@/lib/actions/updatePost";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type EditPostFormProps = {
  post : {
    id: string
    title: string
    content: string
    topImage?: string | null
    published: boolean
  }
}

export default function EditPostForm({post}: EditPostFormProps) {

  const [content, setContent] = useState(post.content)
  const [contentLength, setContentLength] = useState(0)
  const [preview, setPreview] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [published, setPublished] = useState(post.published)
  const [imagePreview, setImagePreview] = useState(post.topImage)

  const [state, formAction] = useActionState(
    updatePost, // サーバーアクション
    {
      success: false,
      errors: {}
    }
  )

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)
    setContentLength(value.length)
  }

  const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      // DBに保存されている画像パスをブラウザ内部のメモリに上に展開してアクセスできるようにしてくれる。
      // インターネット画像はそのままURLでも問題ないが、一度サーバに保存したやつはこのようにしないとアクセスできない
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  // imagePreviewとpost.topImageが変わったら動く
  // URL.createObjectURLはブラウザ内メモリに蓄積されていくので、画像変更するたびにたまる。
  // 変更したあとは変更前画像はいらないので、変更したタイミングで変更前画像のメモリ分を解放してやる処理
  // ポイント：useEffect内の分岐処理で使っている変数やステーと変数をuseEffectの監視対象とすること。

  useEffect(() => {
    return () => {
      if(imagePreview && imagePreview !== post.topImage) {
        URL.revokeObjectURL(imagePreview)
      } 
    }
  }, [imagePreview, post.topImage])

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">新規記事投稿（Markdown対応）</h1>
      <form className="space-y-4" action={formAction}>
        <div>
          <Label htmlFor="title" className="py-2">タイトル</Label>
          <Input 
            type="text" 
            id="title" 
            name="title" 
            placeholder="タイトルを入力してください" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {state.errors.title && (
            <p className="text-red-500 text-sm-mt1">
              {state.errors.title.join(',')}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="topImage">トップ画像</Label>
          <Input
            type="file"
            id="topImage"
            accept="image/*"
            name="topImage"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt={post.title}
                width={0}
                height={0}
                sizes="200px"
                className="w-[200px]"
                priority
              />
            </div>
          )}
          {state.errors.topImage && (
            <p className="text-red-500 text-sm-mt1">
              {state.errors.topImageß.join(',')}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="content" className="py-2">内容(Markdown)</Label>
          <TextareaAutosize 
            id="content"
            name="content"
            className="w-full border p-2"
            placeholder="Markdown形式で入力してください"
            minRows={8} // 最低限の高さ
            value={content}
            onChange={handleContentChange}
          />
          {state.errors.content && (
            <p className="text-red-500 text-sm-mt1">
              {state.errors.content.join(',')}
            </p>
          )}
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">
          文字数: {contentLength}
        </div>
        <div>
          {/* この書き方はクリックごとにフラグON/OFFを切り替えたいときのやつ（トグル設定） */}
          <Button type="button" onClick={() => setPreview(!preview)}>
            {preview ? 'プレビューを閉じる' : 'プレビューを表示'}
          </Button>
        </div>
        {preview && (
          // proseはmarkdownを綺麗に表示するためのクラス（makrdown拡張をインストールした時に使える）
          <div className="border p-4 bg-gray-50 prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false} // HTMLスキップを無効化
              unwrapDisallowed={true} // Markdownの改行を解釈
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        <RadioGroup 
          // booleanを文字列に変更する必要がある
          value={ published.toString() } 
          name="published"
          onValueChange={(value) => setPublished(value === 'true')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="pulished-one" />
            <Label htmlFor="pulished-one">表示</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="pulished-two" />
            <Label htmlFor="pulished-two">非表示</Label>
          </div>
        </RadioGroup>
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          更新する
        </Button>
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="oldImageUrl" value={post.topImage || ''} />
      </form>
    </div>
  )
}
