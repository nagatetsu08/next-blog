'use client'

import { useState, useActionState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import TextareaAutosize from "react-textarea-autosize";
import "highlight.js/styles/github.css"; // コードハイライト用のスタイル
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPost } from "@/lib/actions/createPost";

export default function CreatePage() {

  const [content, setContent] = useState("")
  const [contentLength, setContentLength] = useState(0)
  const [preview, setPreview] = useState(false)

  const [state, formAction] = useActionState(
    createPost, // サーバーアクション
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

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">新規記事投稿（Markdown対応）</h1>
      <form className="space-y-4" action={formAction}>
        <div>
          <Label htmlFor="title" className="py-2">タイトル</Label>
          <Input type="text" id="title" name="title" placeholder="タイトルを入力してください" />
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
          />
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
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          投稿する
        </Button>
      </form>
    </div>
  )
}
